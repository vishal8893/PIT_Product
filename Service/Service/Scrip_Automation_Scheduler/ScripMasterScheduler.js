var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var Connect = require('../../Data/Connect');
const { func, string, date } = require('joi');
const fs = require("fs");
const https = require("https");
const xlsx = require('xlsx');
var extract = require('extract-zip')
let pgp = require('pg-promise')()
const config = require('../../Config')
// const dbPg = pgp(config.dbConn);
const dbPg = pgp(config.Pg_Config)
const path = require('path');


var NSEdownloadfile = function (NSEDownloadURL, dest) {

  dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
    ('Into NSEdownloadfile -1','',1,'NOW()')`);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString()
    .padStart(2, '0')}_${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}`;

  const folderPath = dest.join(__dirname + '/../../Files/Scrip_Automation/NSEDownload/' + formattedDate);
  //  console.log(folderPath); 
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Dated folder created: ${folderPath}`);
  } else {
    console.log(`Dated folder already exists: ${folderPath}`);
  }

  //Taking backup of Main table into Audit table
  dbPg.manyOrNone(`INSERT INTO public."TBL_NSE_SCRIPT_DAILY_AUDIT" ("TBL_NSE_SCRIPT_DAILY_ID", "SYMBOL", "COMPANY_NAME", "ISIN", "SERIES", "DATE_OF_LISTING", "PAID_UP_VALUE", "MARKET_LOT", "FACE_VALUE", "IS_UPLOAD", "IS_ACTIVE", "CREATED_BY", "CREATED_ON", "MODIFIED_BY", "MODIFIED_ON")
      select "ID", "SYMBOL", "COMPANY_NAME", "ISIN", "SERIES", "DATE_OF_LISTING", "PAID_UP_VALUE", "MARKET_LOT", "FACE_VALUE", "IS_UPLOAD", "IS_ACTIVE", "CREATED_BY", "CREATED_ON", "MODIFIED_BY", "MODIFIED_ON"
      FROM public."TBL_NSE_SCRIPT_DAILY"`);

  var filepath = folderPath + '/EQUITY_L.csv';

  var file = fs.createWriteStream(filepath);

  var request = https.get(NSEDownloadURL, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(() => {

        dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
            ('Into NSEdownloadfile -2 File downloaded','',1,'NOW()')`);
        console.log(`File downloaded to ${dest}`);

        const workbook = xlsx.readFile(filepath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const rowCount = data.length;
        console.log(`Number of rows in worksheet: ${rowCount}`);

        if (data != null) {
          // dbPg.manyOrNone(`truncate table public."TBL_NSE_SCRIPT_DAILY"`);
          dbPg.manyOrNone(`delete from public."TBL_NSE_SCRIPT_DAILY" where "IS_UPLOAD" = false;`);
        }

        let colAr = ['SYMBOL', 'COMPANY_NAME', 'ISIN', 'SERIES', 'DATE_OF_LISTING', 'PAID_UP_VALUE', 'MARKET_LOT', 'FACE_VALUE', 'IS_UPLOAD', 'IS_ACTIVE', 'CREATED_BY', 'CREATED_ON']

        dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
            ('Into NSEdownloadfile -3 before insert','',1,'NOW()')`);
        data.map(e => {
          e.SYMBOL = e.SYMBOL
          e.COMPANY_NAME = e['NAME OF COMPANY']
          e.ISIN = e[' ISIN NUMBER']
          e.SERIES = e[' SERIES']
          e.DATE_OF_LISTING = e[' DATE OF LISTING']
          e.PAID_UP_VALUE = e[' PAID UP VALUE']
          e.MARKET_LOT = e[' MARKET LOT']
          e.FACE_VALUE = e[' FACE VALUE']
          e.IS_UPLOAD = false
          e.IS_ACTIVE = true
          e.CREATED_BY = 1
          e.CREATED_ON = new Date()
          // e.MODIFIED_BY = e.emp_code
          // e.MODIFIED_ON = 

        })

        const cs = new pgp.helpers.ColumnSet(colAr, { table: 'TBL_NSE_SCRIPT_DAILY' })
        const query1 = () => pgp.helpers.insert(data, cs)

        dbPg.none(query1);
        dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
            ('Into NSEdownloadfile -4 after insert','',1,'NOW()')`);
      });
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    console.error(`Error downloading file: ${err.message}`);
    dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
    ('Into NSEdownloadfile -5 into error','error',1,'NOW()')`);
  });
};

var BSEdownloadfile = function (BSEDownloadURL, dest) {

  dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
    ('Into BSEdownloadfile - 1','',1,'NOW()')`);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString()
    .padStart(2, '0')}_${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}`;

  const BSE_ExcludedGroup = "E,F,FC,G,GC,W";
  const folderPath = dest.join(__dirname + '/../../Files/Scrip_Automation/BSEDownload/' + formattedDate);
  //  console.log(folderPath); 
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Dated folder created: ${folderPath}`);
  } else {
    console.log(`Dated folder already exists: ${folderPath}`);
  }

  var filepath = folderPath + '/scrip.zip';
  var folderPath_extract = folderPath + '\\SCRIP\\';
  var file = fs.createWriteStream(filepath);

  var request = https.get(BSEDownloadURL, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(() => {
        ExtractFile(filepath, folderPath)
          .then(data => {
            console.log('into Then resolved', data);
            // console.log("folderPath_extract",folderPath_extract);
            const files = fs.readdirSync(folderPath_extract);
            // // Filter files based on the given criteria
            const matchingFiles = files.filter(file => {
              const fileName = path.parse(file).name;
              const fileExtension = path.parse(file).ext;
              return fileName.startsWith('SCRIP') && fileExtension === '.TXT';
              // });
            })

            dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
            ('Into BSEdownloadfile -2 File Extracted','',1,'NOW()')`);

            const Scrip_Data = fs.readFileSync(folderPath_extract + '\\' + matchingFiles[0] + '\\', 'utf-8');
            // console.log("txt data",Scrip_Data)
            const lines = Scrip_Data.split('\n');
            let count = 0;
            // Process each line
            let colAr_BSE = ['BSE_CODE', 'ISIN_NO', 'SCRIPT_NAME', 'BSE_GROUP', 'STATUS', 'SCRIPT_ID', 'IS_UPLOAD', 'IS_ACTIVE', 'CREATED_BY', 'CREATED_ON']

            // const Array_data = ['BSE_CODE','ISIN_NO','SCRIPT_NAME','BSE_GROUP','STATUS','SCRIPT_ID','IS_UPLOAD','IS_ACTIVE','CREATED_BY','CREATED_ON'];
            const Array_data = [];

            //Taking backup of Main table into Audit table
            dbPg.manyOrNone(`INSERT INTO public."TBL_BSE_SCRIPT_DAILY_AUDIT" ("TBL_BSE_SCRIPT_DAILY_ID", "BSE_CODE", "ISIN_NO", "SCRIPT_NAME", "BSE_GROUP","STATUS", "SCRIPT_ID", "IS_UPLOAD", "IS_ACTIVE", "CREATED_BY", "CREATED_ON", "MODIFIED_BY","MODIFIED_ON")
      select "ID", "BSE_CODE", "ISIN_NO", "SCRIPT_NAME", "BSE_GROUP","STATUS", "SCRIPT_ID", "IS_UPLOAD", "IS_ACTIVE", "CREATED_BY", "CREATED_ON", "MODIFIED_BY", 
      "MODIFIED_ON"FROM public."TBL_BSE_SCRIPT_DAILY"`);
            let CreatedOn_date = new Date();
            for (const line of lines) {
              let SingleLine = [];
              SingleLine = line.split('|');
              let BSE_ExcludedGroup_arr = [];
              BSE_ExcludedGroup_arr = BSE_ExcludedGroup.split(',');


              if (SingleLine != null && SingleLine.length > 17) {
                let BSEGroupName = SingleLine[6].trim();
                let BSEStatus = SingleLine[12].trim();
                let BSEIsinCode = SingleLine[17].trim();

                if (!(BSEStatus === "A")) {
                  continue;
                }
                if (!(BSEGroupName === null) & BSE_ExcludedGroup_arr.includes(BSEGroupName)) {
                  continue;
                }
                if (!BSEIsinCode.startsWith("INE") && !BSEIsinCode.startsWith("IN9")) {
                  continue;
                }

                Array_data.push({ BSE_CODE: SingleLine[0].trim(), ISIN_NO: SingleLine[17].trim(), SCRIPT_NAME: SingleLine[3].trim(), BSE_GROUP: SingleLine[6].trim(), STATUS: SingleLine[12].trim(), SCRIPT_ID: SingleLine[2].trim(), IS_UPLOAD: false, IS_ACTIVE: true, CREATED_BY: 1, CREATED_ON: CreatedOn_date });
              }
            }
            const rowCount = Array_data.length;
            console.log(`Number of rows in worksheet: ${rowCount}`);
            if (Array_data.length > 1) {

              dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
            ('Into BSEdownloadfile -3 data to be inserted','',1,'NOW()')`);

              //  dbPg.manyOrNone(`truncate table public."TBL_BSE_SCRIPT_DAILY"`);
              dbPg.manyOrNone(`delete from public."TBL_BSE_SCRIPT_DAILY" where "IS_UPLOAD" = false;`);
              const cs = new pgp.helpers.ColumnSet(colAr_BSE, { table: 'TBL_BSE_SCRIPT_DAILY' });
              const query1 = () => pgp.helpers.insert(Array_data, cs)
              dbPg.none(query1);

              dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
                ('Into BSEdownloadfile -4 data inserted','',1,'NOW()')`);
            }
          })
          .catch(error => {

            dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
                ('Into BSEdownloadfile -5','error occured',1,'NOW()')`);

            console.error('Error during extraction:', error);
            throw error; // Propagate the error
          });
        console.log(`File downloaded to ${dest}`);
      });
    }).on('error', function (err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
      ('Into BSEdownloadfile -6','error occured',1,'NOW()')`);
      console.error(`Error downloading file: ${err.message}`);
    });
  });
}

function ExtractFile(filepath, folderPath) {
  return new Promise((resolve, reject) => {
    extract(filepath, { dir: folderPath }, function (err) {
      // handle err        
      //resolve();
      if (err == undefined) {
        console.log("File Extracted ", err);
        resolve('File extracted');
      }
      else {
        dbPg.manyOrNone(`INSERT INTO public."TBL_SCRIPT_AUTOMATION_LOGS"("REMARK", "ERROR", "CREATED_BY", "CREATED_ON") values
        ('Into BSEdownloadfile -7','error occured',1,'NOW()')`);
        reject(err)
      }
    })
  });
}

function ReadFile(filepath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });
    console.log("ddad", rl);
    // for(const line of rl) {
    //   // Process each line here asynchronously
    //   console.log(line);
    // }

    resolve();
  });
}

module.exports.NSEdownloadfile = NSEdownloadfile;
module.exports.BSEdownloadfile = BSEdownloadfile;