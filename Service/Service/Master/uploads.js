var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var Connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
var sequelize = connect.Sequelize;
const fs = require('fs')
const path = require("path");
var multer = require("multer");
var upload = multer();
let util = require('util')
var ExcelJS = require('exceljs');
const moment = require('moment');
const XLSX = require('xlsx');

var routes = function () {
    // Convert date formats to 'yyyy-mm-dd'
    function formatDate(dateString) {
        const formatsToTry = ['YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];

        for (const format of formatsToTry) {
            const parsedDate = moment(dateString, format, true);
            if (parsedDate.isValid()) {
                return parsedDate.format('YYYY-MM-DD');
            }
        }

        // Return original string if no valid format is found
        return dateString;
    }

    router.route('/SaveGreyRestricData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const Type = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const ScripName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const ISIN = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const StartDate = worksheet.getRow(i).values[4] === undefined ? null : formatDate(worksheet.getRow(i).values[4]);
                            const EndDate = worksheet.getRow(i).values[5] === undefined ? null : formatDate(worksheet.getRow(i).values[5]);
                            const Employee_No = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];

                            // const formattedStartDate = formatDate(StartDate);
                            // const formattedEndDate = formatDate(EndDate);

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;

                            console.log(`Cell values at row ${i}:`, Type, ScripName, ISIN, StartDate, EndDate, Employee_No);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);


                            if (Type === 'Grey List') {
                                const TBL_GREY_LIST_MST = datamodel.TBL_GREY_LIST_MST();

                                const query = `SELECT * FROM "TBL_GREY_LIST_MST" WHERE "SCRIPT_NAME" = '${ScripName}' AND "IS_ACTIVE" = true`;
                                const rows = await connect.sequelize.query(query);
                                console.log("rows", rows[0]);

                                if (rows[0].length === 0) {

                                    var values = {
                                        SCRIPT_NAME: ScripName,
                                        ISIN: ISIN,
                                        STARTDATE: StartDate,
                                        ENDDATE: EndDate,
                                        IS_ACTIVE: true,
                                        CREATED_BY: createdByValue
                                    };

                                    try {
                                        createdGreyListMST = await dataaccess.Create(TBL_GREY_LIST_MST, values);

                                        let MAXID = createdGreyListMST.ID;
                                        console.log("MAXID", MAXID);

                                        const TBL_GREY_LIST_DETAILSMST = datamodel.TBL_GREY_LIST_DETAILSMST();

                                        let USERLISTARRAY = Employee_No.split(',');
                                        console.log("USERLISTARRAY", USERLISTARRAY);

                                        const promises = USERLISTARRAY.map((element) => {
                                            return dataaccess.Create(TBL_GREY_LIST_DETAILSMST, {
                                                GRELISTID: MAXID,
                                                EMPNO: element.trim(),
                                                IS_ACTIVE: true,
                                                CREATED_BY: createdByValue,
                                            });
                                        });

                                        await Promise.all(promises);
                                    } catch (error) {
                                        console.error("Error during database insertion:", error);
                                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                        success = false;
                                        break; // Exit the loop on error
                                    }
                                }
                            }
                            else {
                                const query = `SELECT * FROM "TBL_RESTRICTED_LIST_MST" WHERE "SCRIPT_NAME" = '${ScripName}' AND "IS_ACTIVE" = true`;
                                const rows = await connect.sequelize.query(query);
                                console.log("rows", rows[0]);

                                const TBL_RESTRICTED_LIST_MST = datamodel.TBL_RESTRICTED_LIST_MST();

                                if (rows[0].length === 0) {
                                    var values1 = {
                                        SCRIPT_NAME: ScripName,
                                        ISIN: ISIN,
                                        STARTDATE: StartDate,
                                        ENDDATE: EndDate,
                                        IS_ACTIVE: true,
                                        CREATED_BY: createdByValue
                                    };

                                    try {
                                        createdGreyListMST = await dataaccess.Create(TBL_RESTRICTED_LIST_MST, values1);
                                        success = true;
                                    } catch (error) {
                                        console.error("Error during database insertion:", error);
                                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                        success = false;
                                        break;
                                    }
                                }
                            }

                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/SaveHolidayData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)


                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            // const Date = worksheet.getRow(i).values[1];
                            const dateValue = worksheet.getRow(i).values[1] === undefined ? null : formatDate(worksheet.getRow(i).values[1]);
                            const Day = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];

                            console.log(`Cell values at row ${i}:`, dateValue, Day);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_Holiday_Master = datamodel.TBL_Holiday_Master();

                            // // Parse the date from Excel and check if it contains a time component
                            // const excelDate = new Date(dateValue);
                            // const hasTimeComponent = !isNaN(excelDate.getTime()) && excelDate.getHours() > 0;

                            // // Format the date accordingly
                            // const formattedDate = hasTimeComponent
                            //     ? excelDate.toISOString().split('.')[0] // Date with time component
                            //     : excelDate.toISOString().split('T')[0]; // Date without time component
                            // const formattedStartDate = formatDate(dateValue);
                            // const formattedEndDate = formatDate(EndDate);

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;


                            const query = `SELECT * FROM "TBL_Holiday_Master" WHERE "DATE" = '${dateValue}' AND "IS_ACTIVE" = true`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    DATE: dateValue,
                                    DAY: Day,
                                    IS_ACTIVE: true,
                                    CREATED_BY: createdByValue
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_Holiday_Master, values);
                                    success = true;
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                    success = false;
                                    break;
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/SaveScripMstData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);

                    let responseSent = false;
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const BSECode = worksheet.getRow(i).values[1];
                            const NSEBSECode = worksheet.getRow(i).values[2];
                            const NSECode = worksheet.getRow(i).values[3];
                            const LotSize = worksheet.getRow(i).values[4];
                            const ISINCode = worksheet.getRow(i).values[5];
                            const BloombergCode = worksheet.getRow(i).values[6];
                            const ReutersCode = worksheet.getRow(i).values[7];
                            const SedolCode = worksheet.getRow(i).values[8];
                            const DividendDate = worksheet.getRow(i).values[9] === undefined ? null : formatDate(worksheet.getRow(i).values[9]);
                            const RestrictedReset = worksheet.getRow(i).values[10];
                            const ScripDesc = worksheet.getRow(i).values[11];
                            const HoldingPeriod = worksheet.getRow(i).values[12];
                            const IRFFormat = worksheet.getRow(i).values[13];
                            const BSEGroupName = worksheet.getRow(i).values[14];
                            const Exchange = worksheet.getRow(i).values[15];
                            const NatureofTrade = worksheet.getRow(i).values[16];
                            const IsGovernmentSecurity = worksheet.getRow(i).values[17];


                            console.log(`Cell values at row ${i}:`, BSECode, NSEBSECode, NSECode, LotSize, ISINCode, BloombergCode, ReutersCode,
                                SedolCode, DividendDate, RestrictedReset, ScripDesc, HoldingPeriod, IRFFormat, BSEGroupName, Exchange, NatureofTrade, IsGovernmentSecurity);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            var querytext = `SELECT * from check_nse_bse_code_exists(:nse_code,:bse_code);`;
                            var param = {
                                replacements: {

                                    nse_code: NSECode === undefined ? null : NSECode,
                                    bse_code: BSECode
                                },
                                type: Connect.sequelize.QueryTypes.SELECT
                            }
                            console.log('param', param);

                            Connect.sequelize.query(querytext, param)
                                .then(async function (result) {
                                    console.log("result", result);

                                    if (result != (0, 1) && result != (1, 0) && result != (1, 1) && result.length > 0) {


                                        var query = `SELECT * from public."SAVE_UPDATE_SCRIPT_MASTER"( :cre_emp_code,:bse_code,:nse_bse_code,:nse_code,:lot_size,
                                                        :isin_code,:bloomberg_code,:reuters_code,:sedol_code,:divident_date,:restricted_reset,:script_desc,:holding_period,
                                                        :irf_formats,:bsegroupname,:exchange,:nature_of_trade,:trx_no,:is_gov_sec);`;
                                        var param1 = {
                                            replacements: {

                                                cre_emp_code: 1,
                                                bse_code: BSECode === undefined ? null : BSECode,
                                                nse_bse_code: NSEBSECode === undefined ? null : NSEBSECode,
                                                nse_code: NSECode === undefined ? null : NSECode,
                                                lot_size: LotSize === undefined ? null : Number(LotSize),
                                                isin_code: ISINCode === undefined ? null : ISINCode,
                                                bloomberg_code: BloombergCode === undefined ? null : BloombergCode,
                                                reuters_code: ReutersCode === undefined ? null : ReutersCode,
                                                sedol_code: SedolCode === undefined ? null : SedolCode,
                                                divident_date: DividendDate === null ? null : new Date(DividendDate),
                                                restricted_reset: RestrictedReset === undefined ? null : RestrictedReset,
                                                script_desc: ScripDesc === undefined ? null : ScripDesc,
                                                holding_period: HoldingPeriod === undefined ? 30 : Number(HoldingPeriod),
                                                irf_formats: IRFFormat === undefined ? '1' : IRFFormat,
                                                bsegroupname: BSEGroupName === undefined ? null : BSEGroupName,
                                                exchange: Exchange === undefined ? null : Exchange,
                                                nature_of_trade: NatureofTrade === undefined ? null : NatureofTrade,
                                                trx_no: null,
                                                is_gov_sec: IsGovernmentSecurity === undefined ? 'false' : IsGovernmentSecurity,

                                            },
                                            type: Connect.sequelize.QueryTypes.SELECT

                                        }
                                        console.log('param1', param1);

                                        await Connect.sequelize.query(query, param1)
                                            .then(function (result1) {
                                                console.log("result1", result1)
                                                // res.status(200).json({ Success: true, Message: "", Data: result1 });
                                                responseSent = true;
                                            },
                                                function (err) {
                                                    dataconn.errorlogger('scriptmstservice', 'data', err);
                                                    res.status(200).json({ Success: false, Message: 'User has no access of SAVE SAVE_UPDATE_SCRIPT_MASTER', Data: null });
                                                    responseSent = false;
                                                });
                                    }
                                    else {

                                        res.status(200).json({ Success: false, Message: 'Error occurred while generating script', Data: null });
                                        responseSent = true;

                                    }

                                },
                                    function (err) {
                                        dataconn.errorlogger('scriptmstservice', 'CreateScriptdata', err);
                                        // res.status(200).json({ Success: false, Message: 'User has no access of check_nse_bse_code_exists', Data: null });
                                        responseSent = false;
                                    });


                        }


                        // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/getTradeData')
        .get(function (req, res) {

            const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();

            var param = {
                attributes: ['EmpId', 'PanNo', 'TradeDate', 'Exch', 'AccCode', 'AccName', 'ScripCode', 'ScripName', 'Quantity', 'TotalPrice', 'Mode', 'ISIN', 'OpenQuantity', 'TradedBy', 'StrikePrice', 'ExpiryDate', 'OptionType', 'CreatedBy', 'CreatedDate', 'UpdatedBy', 'UpdatedDate'],
            };

            console.log("param", param);

            dataaccess.FindAll(eirf_rico_sos_emp_mapping, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'eirf_rico_sos_emp_mapping Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of eirf_rico_sos_emp_mapping Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getTradeData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of eirf_rico_sos_emp_mapping Table', Data: null });
                });

        });



    router.route('/SaveTradeMstData')
        .post(upload.any(), async function (req, res) {
            for (let key in req.body) {
                req.body[key] = req.body[key] === '' || req.body[key] === 'undefined' ? null : req.body[key];
            }

            const requestBody = { ...req.body };
            const requestFiles = req.files;

            if (!requestFiles || requestFiles.length === 0) {
                return res.status(400).json({ Success: false, Message: 'No file uploaded' });
            }

            const file = requestFiles[0];

            try {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                const requiredHeaders = [
                    'RequestID', 'Exch', 'AccountCode', 'AccountName', 'ScripName', 'Quantity', 'TradeAvailableQty', 'TotalPrice', 'Mode',
                    'ISIN', 'StrikePrice', 'ExpiryDate', 'OptionType', 'TradedQuantity', 'TradeDate'
                ];
                const sheetDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const actualHeaders = sheetDataRaw[0] || [];

                const headersMatch =
                    actualHeaders.length === requiredHeaders.length &&
                    requiredHeaders.every((val, idx) => val === actualHeaders[idx]);

                const Finalarray = [];
                const ErrorArray = [];
                const inFileDuplicates = new Set();
                const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();

                if (!headersMatch) {
                    ErrorArray.push({ Reason: 'Excel headers do not match required format' });
                }


                for (const e of excelData) {

                    if (e.Mode == 'SELL') {
                        if (e.Exch == 'Future' || e.Exch == 'Option') {
                            const requiredFields = [
                                'RequestID', 'AccountCode', 'AccountName', 'ScripName', 'TotalPrice', 'StrikePrice', 'ExpiryDate', 'ExpiryDate',
                                'Quantity', 'TradeAvailableQty', 'Mode', 'ISIN', 'TradedQuantity', 'TradeDate'
                            ];
                            const missingFields = requiredFields.filter(
                                field => !e[field] || e[field].toString().trim() === ''
                            );

                            if (missingFields.length > 0) {
                                e.Reason = `Missing fields: ${missingFields.join(', ')}`;
                                ErrorArray.push({ ...e });
                            }
                            const dateRegexs = /^\d{4}-\d{2}-\d{2}$/;
                            if (!dateRegexs.test(e.ExpiryDate)) {
                                e.Reason = 'Invalid e.ExpiryDate format (YYYY-MM-DD)';
                                ErrorArray.push({ ...e });
                            }
                        } else {
                            const requiredFields = [
                                'RequestID', 'AccountCode', 'AccountName', 'ScripName', 'TotalPrice',
                                'Quantity', 'TradeAvailableQty', 'Mode', 'ISIN', 'TradedQuantity', 'TradeDate'
                            ];
                            const missingFields = requiredFields.filter(
                                field => !e[field] || e[field].toString().trim() === ''
                            );

                            if (missingFields.length > 0) {
                                e.Reason = `Missing fields: ${missingFields.join(', ')}`;
                                ErrorArray.push({ ...e });
                            }
                        }

                        const CheckISIN = `SELECT * FROM "TBL_DP_HOLDING_DATA" WHERE "ISIN_CODE" = '${e.ISIN}'`;
                        const CheckISINs = await connect.sequelize.query(CheckISIN);

                        if (CheckISINs[0].length === 0) {
                            e.Reason = 'ISIN_CODE not available in holding details';
                            ErrorArray.push({ ...e });
                        }

                        // Convert TradeDate if in Excel date format
                        if (typeof e.TradeDate === 'number') {
                            e.TradeDate = convertExcelDateToJSDate(e.TradeDate);
                        }

                        function convertExcelDateToJSDate(serial) {
                            const excelEpoch = new Date(1900, 0, 1);
                            const jsDate = new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
                            const yyyy = jsDate.getFullYear();
                            const mm = String(jsDate.getMonth() + 1).padStart(2, '0');
                            const dd = String(jsDate.getDate()).padStart(2, '0');
                            return `${yyyy}-${mm}-${dd}`;
                        }

                        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (!dateRegex.test(e.TradeDate)) {
                            e.Reason = 'Invalid TradeDate format (YYYY-MM-DD)';
                            ErrorArray.push({ ...e });
                        }



                        if (isNaN(e.Quantity)) {
                            e.Reason = 'Quantity must be numeric';
                            ErrorArray.push({ ...e });
                        }

                        const nameRegex = /^[A-Za-z\s]+$/;
                        if (!nameRegex.test(e.AccountName.toString().trim())) {
                            e.Reason = 'AccountName must contain only alphabetic characters';
                            ErrorArray.push({ ...e });
                        }

                        const duplicateKey = `${e.RequestID}|${e.ISIN}`;
                        if (inFileDuplicates.has(duplicateKey)) {
                            e.Reason = 'Duplicate row in file';
                            ErrorArray.push({ ...e });
                        }
                        inFileDuplicates.add(duplicateKey);

                        // Trade Approval check
                        const approvalQuery = `
          SELECT * FROM public."TBL_IRF_Approval_Data"
          WHERE "ID" = '${e.RequestID}' AND "Transaction" = 'SELL'
        `;
                        const approvalRows = await connect.sequelize.query(approvalQuery);
                        if (approvalRows[0].length === 0) {
                            e.Reason = 'Trade approval pending';
                            ErrorArray.push({ ...e });
                        }

                        // DB duplicate / quantity validation
                        const dbQuery = `
          SELECT * FROM "TBL_DP_HOLDING_DATA"
          WHERE "ISIN_CODE" = '${e.ISIN}' AND "IS_ACTIVE" = true
        `;
                        const rows = await connect.sequelize.query(dbQuery);

                        if (rows[0].length > 0) {
                            const availableQty = Number(rows[0][0].TradeAvailableQty);
                            console.log("availableQty", availableQty);

                            if (availableQty < Number(e.TradedQuantity)) {
                                e.Reason = 'TradedQuantity exceeds available quantity';
                                ErrorArray.push({ ...e });
                            } else {
                                const updatedQty = availableQty - Number(e.TradedQuantity);
                                if (e.Mode === 'SELL' && ErrorArray.length == 0) {
                                    const updateQuery = `
                UPDATE public."TBL_DP_HOLDING_DATA"
                SET "TradeAvailableQty" = '${updatedQty}',
                    "MODIFIED_BY" = '${requestBody.UserId}'
                WHERE "EMPID" = '${requestBody.UserId}' AND "ISIN_CODE" = '${e.ISIN}'
              `;
                                    await connect.sequelize.query(updateQuery);
                                }
                            }
                        }


                        // FIX: Only error if TradeAvailableQty < TradedQuantity
                        if (Number(e.TradeAvailableQty) < Number(e.TradedQuantity)) {
                            e.Reason = 'TradeAvailableQty should be greater than or equal to TradedQuantity';
                            ErrorArray.push({ ...e });
                        }
                        const updateQuery = `
                                                UPDATE public."TBL_DP_HOLDING_DATA"
                                                SET 
                                                    "TradeAvailableQty" = :pendingQty,
                                                    "MODIFIED_BY" = :empId
                                                WHERE 
                                                    "EMPID" = :empId AND "ISIN_CODE" = :isin
                                            `;
                        const QTYending = Number(e.TradeAvailableQty) - Number(e.TradedQuantity)
                        await connect.sequelize.query(updateQuery, {
                            replacements: {
                                pendingQty: QTYending,
                                empId: requestBody.UserId,
                                isin: e.ISIN
                            }
                        });

                        const IRFUpdateQuery = `
                                                UPDATE "TBL_IRF_Approval_Data"
                                                SET "TradeAvailableQty" = :pendingQty
                                                WHERE "ID" = :id
                                            `;
                        await connect.sequelize.query(IRFUpdateQuery, {
                            replacements: {
                                pendingQty: QTYending,
                                id: e.RequestID
                            }
                        });



                    } else if (e.Mode == 'BUY') {
                        if (e.Exch == 'Future' || e.Exch == 'Option') {
                            const requiredFields = [
                                'RequestID', 'AccountCode', 'AccountName', 'ScripName', 'TotalPrice', 'StrikePrice', 'ExpiryDate', 'ExpiryDate',
                                'Quantity', 'TradeAvailableQty', 'Mode', 'ISIN', 'TradedQuantity', 'TradeDate'
                            ];
                            const missingFields = requiredFields.filter(
                                field => !e[field] || e[field].toString().trim() === ''
                            );

                            if (missingFields.length > 0) {
                                e.Reason = `Missing fields: ${missingFields.join(', ')}`;
                                ErrorArray.push({ ...e });
                            }
                            const dateRegexs = /^\d{4}-\d{2}-\d{2}$/;
                            if (!dateRegexs.test(e.ExpiryDate)) {
                                e.Reason = 'Invalid e.ExpiryDate format (YYYY-MM-DD)';
                                ErrorArray.push({ ...e });
                            }
                        } else {
                            const requiredFields = [
                                'RequestID', 'AccountCode', 'AccountName', 'ScripName', 'TotalPrice',
                                'Quantity', 'TradeAvailableQty', 'Mode', 'ISIN', 'TradedQuantity', 'TradeDate'
                            ];
                            const missingFields = requiredFields.filter(
                                field => !e[field] || e[field].toString().trim() === ''
                            );

                            if (missingFields.length > 0) {
                                e.Reason = `Missing fields: ${missingFields.join(', ')}`;
                                ErrorArray.push({ ...e });
                            }
                        }

                        // Convert TradeDate if in Excel date format
                        if (typeof e.TradeDate === 'number') {
                            e.TradeDate = convertExcelDateToJSDate(e.TradeDate);
                        }

                        function convertExcelDateToJSDate(serial) {
                            const excelEpoch = new Date(1900, 0, 1);
                            const jsDate = new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
                            const yyyy = jsDate.getFullYear();
                            const mm = String(jsDate.getMonth() + 1).padStart(2, '0');
                            const dd = String(jsDate.getDate()).padStart(2, '0');
                            return `${yyyy}-${mm}-${dd}`;
                        }

                        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (!dateRegex.test(e.TradeDate)) {
                            e.Reason = 'Invalid TradeDate format (YYYY-MM-DD)';
                            ErrorArray.push({ ...e });
                        }



                        if (isNaN(e.Quantity)) {
                            e.Reason = 'Quantity must be numeric';
                            ErrorArray.push({ ...e });
                        }

                        const nameRegex = /^[A-Za-z\s]+$/;
                        if (!nameRegex.test(e.AccountName.toString().trim())) {
                            e.Reason = 'AccountName must contain only alphabetic characters';
                            ErrorArray.push({ ...e });
                        }

                        const duplicateKey = `${e.RequestID}|${e.ISIN}`;
                        if (inFileDuplicates.has(duplicateKey)) {
                            e.Reason = 'Duplicate row in file';
                            ErrorArray.push({ ...e });
                        }
                        inFileDuplicates.add(duplicateKey);

                        // Trade Approval check
                        const approvalQuery = `
          SELECT * FROM public."TBL_IRF_Approval_Data"
          WHERE "ID" = '${e.RequestID}' AND "Transaction" = 'BUY'
        `;
                        const approvalRows = await connect.sequelize.query(approvalQuery);
                        if (approvalRows[0].length == 0) {
                            e.Reason = 'Trade approval pending';
                            ErrorArray.push({ ...e });
                        }

                        
                        // FIX: Only error if TradeAvailableQty < TradedQuantity
                        if (Number(e.TradeAvailableQty) < Number(e.TradedQuantity)) {
                            e.Reason = 'TradeAvailableQty should be greater than or equal to TradedQuantity';
                            ErrorArray.push({ ...e });
                        }

                        const empId = e.RequestID;
                        const isin = e.ISIN;
                        const getQuery = `
                                                SELECT * FROM public."TBL_DP_HOLDING_DATA" 
                                                WHERE "ISIN_CODE" = :isin AND "EMPID" = :empId
                                            `;
                        const getQueryResult = await connect.sequelize.query(getQuery, {
                            replacements: { isin, empId },
                            type: connect.sequelize.QueryTypes.SELECT
                        });

                        if (getQueryResult && getQueryResult.length > 0) {
                            const existing = getQueryResult[0];

                            const SUMQTY = Number(e.TradedQuantity) + Number(existing.TradeAvailableQty || 0);
                            const QTY = Number(e.TradedQuantity) + Number(existing.DP_QTY || 0);
                            const APQTY = Number(e.TradedQuantity) + Number(existing.ApprovalAvailableQty || 0);

                            const updateQuery = `
                                                    UPDATE public."TBL_DP_HOLDING_DATA"
                                                    SET 
                                                        "TradeAvailableQty" = :sumQty,
                                                        "ApprovalAvailableQty"=:apqty,
                                                        "DP_QTY" = :qty,
                                                        "MODIFIED_BY" = :empId
                                                    WHERE 
                                                        "EMPID" = :empId AND "ISIN_CODE" = :isin
                                                `;
                            await connect.sequelize.query(updateQuery, {
                                replacements: {
                                    sumQty: SUMQTY,
                                    qty: QTY,
                                    apqty: APQTY,
                                    empId,
                                    isin,

                                }
                            });
                            const QTYending = Number(e.TradeAvailableQty) - Number(e.TradedQuantity)
                            const IRFUpdateQuery = `
                                                    UPDATE "TBL_IRF_Approval_Data"
                                                    SET "TradeAvailableQty" = :pendingQty
                                                    WHERE "ID" = :id
                                                `;
                            await connect.sequelize.query(IRFUpdateQuery, {
                                replacements: {
                                    pendingQty: QTYending,
                                    id: e.RequestID
                                }
                            });

                        } else {
                            // ✅ Insert new record into TBL_DP_HOLDING_DATA
                            const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();
                            const valuec = {
                                EMPID: requestBody.UserId,
                                ACCOUNT_CODE: e.AccountCode,
                                ACCOUNT_NAME: e.AccountName,
                                ISIN_CODE: e.ISIN,
                                TRX_DATE: (e.TradeDate && !isNaN(Date.parse(e.TradeDate)) && e.TradeDate !== 'Invalid date') ? e.TradeDate : null,
                                DP_QTY: e.TradedQuantity,
                                SEGMENT: e.Exch,
                                IS_ACTIVE: true,
                                CREATED_BY: requestBody.UserId,
                                CREATED_DT: new Date(),
                                TradeAvailableQty: 0,
                                ApprovalAvailableQty: e.TradedQuantity
                            };
                            if (!valuec.TRX_DATE) {
                                e.Reason = 'Invalid TradeDate';
                                ErrorArray.push({ ...e });
                                continue;
                            }
                            console.log("valuec", valuec);

                            await dataaccess.Create(TBL_DP_HOLDING_DATA, valuec);

                            const IRFUpdateQuery = `
                                                    UPDATE "TBL_IRF_Approval_Data"
                                                    SET "TradeAvailableQty" = 0
                                                    WHERE "ID" = :id
                                                `;
                            await connect.sequelize.query(IRFUpdateQuery, {
                                replacements: {
                                    id: e.RequestID
                                }
                            });
                        }


                    }
                    Finalarray.push({
                        EmpId: requestBody.UserId,
                        TradeDate: (e.TradeDate && e.TradeDate !== '' && e.TradeDate !== 'Invalid date') ? e.TradeDate : null,
                        Exch: e.Exch,
                        AccCode: e.AccountCode,
                        AccName: e.AccountName,
                        ScripName: e.ScripName,
                        Quantity: (e.Quantity !== '' && !isNaN(e.Quantity)) ? Number(e.Quantity) : null,
                        TotalPrice: (e.TotalPrice !== '' && !isNaN(e.TotalPrice)) ? Number(e.TotalPrice) : null,
                        Mode: e.Mode,
                        ISIN: e.ISIN,
                        StrikePrice: (e.StrikePrice !== '' && !isNaN(e.StrikePrice)) ? Number(e.StrikePrice) : null,
                        ExpiryDate: (e.ExpiryDate && e.ExpiryDate !== '' && e.ExpiryDate !== 'Invalid date') ? e.ExpiryDate : null,
                        OptionType: e.OptionType,
                        TradedQuantity: (e.TradedQuantity !== '' && !isNaN(e.TradedQuantity)) ? Number(e.TradedQuantity) : null,
                    });
                }
                // Valid data

                // Merge reasons for same ISIN
                const FinalarrayError = [];
                ErrorArray.forEach((item) => {
                    const existing = FinalarrayError.find(t => t.ISIN === item.ISIN);
                    if (existing) {
                        const reasons = existing.Reason.split('; ').map(r => r.trim());
                        if (!reasons.includes(item.Reason.trim())) {
                            existing.Reason += `; ${item.Reason}`;
                        }
                    } else {
                        FinalarrayError.push({ ...item });
                    }
                });
                const mergedErrorsMap = new Map();

                ErrorArray.forEach(item => {
                    const key = item.ISIN;

                    if (!mergedErrorsMap.has(key)) {
                        // Initialize with a copy and a Set for reasons
                        mergedErrorsMap.set(key, { ...item, Reason: new Set([item.Reason]) });
                    } else {
                        // Add reason to the existing set
                        mergedErrorsMap.get(key).Reason.add(item.Reason);
                    }
                });

                // Convert each Reason Set into a comma-separated string
                const mergedErrors = Array.from(mergedErrorsMap.values()).map(entry => ({
                    ...entry,
                    Reason: Array.from(entry.Reason).join(', ')
                }));

                // Save data if no error
                if (FinalarrayError.length === 0 && Finalarray.length > 0) {
                    const result = await dataaccess.BulkCreate(eirf_rico_sos_emp_mapping, Finalarray);
                    const EncryptLoginDetails = dataconn.encryptionAES(result);

                    const Folder_Path = path.join(__dirname, 'UploadFiles');
                    const writeFile = util.promisify(fs.writeFile);

                    for (let fileItem of requestFiles) {
                        const newFileName = `${fileItem.originalname}`;
                        const filePath = path.join(Folder_Path, newFileName);
                        await writeFile(filePath, fileItem.buffer);
                    }

                    return res.status(200).json({
                        Success: true,
                        Message: 'Excel file uploaded successfully',
                        Data: EncryptLoginDetails
                    });
                } else {
                    return res.status(200).json({
                        Success: false,
                        Message: 'Please fill the valid data',
                        Data: mergedErrors
                    });
                }
            } catch (error) {
                console.error('Excel parsing error:', error);
                res.status(500).json({
                    Success: false,
                    Message: 'Error parsing Excel file',
                    Error: error.message
                });
            }
        });




    router.route('/getRollOverExpiryData')
        .get(function (req, res) {

            const TBL_FNOROLLOVER_EXPIRYDATA = datamodel.TBL_FNOROLLOVER_EXPIRYDATA();

            var param = {
                attributes: ['POSITION_DATE', 'SEGMENT_INDICATOR', 'SETTLEMENT_TYPE', 'CLEARING_MEMBER_CODE', 'MEMBER_TYPE', 'TRADING_MEMBER_CODE', 'ACCOUNT_TYPE', 'CLIENT_ACCOUNT_CODE', 'INSTRUMENT_TYPE', 'SYMBOL', 'EXPIRY_DATE', 'STRIKE_PRICE', 'OPTION_TYPE', 'CA_LEVEL', 'BROUGHT_FORWARD_LONG_QUANTITY', 'BROUGHT_FORWARD_LONG_VALUE',
                    'BROUGHT_FORWARD_SHORT_QUANTITY', 'BROUGHT_FORWARD_SHORT_VALUE', 'DAY_BUY_OPEN_QUANTITY', 'DAY_BUY_OPEN_VALUE', 'DAY_SELL_OPEN_QUANTITY', 'DAY_SELL_OPEN_VALUE', 'PRE_EX_AS_GMNT_LONG_QUANTITY', 'PRE_EX_AS_GMNT_LONG_VALUE', 'PRE_EX_AS_GMNT_SHORT_QUANTITY', 'PRE_EX_AS_GMNT_SHORT_VALUE', 'EXERCISED_QUANTITY', 'ASSIGNED_QUANTITY',
                    'POST_EX_AS_GMNT_LONG_QUANTITY', 'POST_EX_AS_GMNT_LONG_VALUE', 'POST_EX_AS_GMNT_SHORT_QUANTITY', 'POST_EX_AS_GMNT_SHORT_VALUE', 'SETTLEMENT_PRICE', 'NET_PREMIUM', 'DAILY_MTM_SETTLEMENT_VALUE', 'FUTURES_FINAL_SETTLEMENT_VALUE', 'EXERCISED_ASSIGNED_VALUE', 'IS_ACTIVE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_FNOROLLOVER_EXPIRYDATA, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_FNOROLLOVER_EXPIRYDATA Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_FNOROLLOVER_EXPIRYDATA Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getRollOverExpiryData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_FNOROLLOVER_EXPIRYDATA Table', Data: null });
                });

        });

    router.route('/SaveRollOverExpiryData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const PositionDate = worksheet.getRow(i).values[1] === undefined ? null : formatDate(worksheet.getRow(i).values[1]);
                            const SegmentIndicator = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const SettlementType = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const ClearingMemberCode = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const MemberType = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const TradingMemberCode = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const AccountType = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const ClientAccountCode = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];
                            const InstrumentType = worksheet.getRow(i).values[9] === undefined ? null : worksheet.getRow(i).values[9];
                            const Symbol = worksheet.getRow(i).values[10] === undefined ? null : worksheet.getRow(i).values[10];
                            const Expirydate = worksheet.getRow(i).values[11] === undefined ? null : formatDate(worksheet.getRow(i).values[11]);
                            const StrikePrice = worksheet.getRow(i).values[12] === undefined ? null : worksheet.getRow(i).values[12];
                            const OptionType = worksheet.getRow(i).values[13] === undefined ? null : worksheet.getRow(i).values[13];
                            const CALevel = worksheet.getRow(i).values[14] === undefined ? null : worksheet.getRow(i).values[14];
                            const BroughtForwardLongQuantity = worksheet.getRow(i).values[15] === undefined ? null : worksheet.getRow(i).values[15];
                            const BroughtForwardLongValue = worksheet.getRow(i).values[16] === undefined ? null : worksheet.getRow(i).values[16];
                            const BroughtForwardShortQuantity = worksheet.getRow(i).values[17] === undefined ? null : worksheet.getRow(i).values[17];
                            const BroughtForwardShortValue = worksheet.getRow(i).values[18] === undefined ? null : worksheet.getRow(i).values[18];
                            const DayBuyOpenQuantity = worksheet.getRow(i).values[19] === undefined ? null : worksheet.getRow(i).values[19];
                            const DayBuyOpenValue = worksheet.getRow(i).values[20] === undefined ? null : worksheet.getRow(i).values[20];
                            const DaySellOpenQuantity = worksheet.getRow(i).values[21] === undefined ? null : worksheet.getRow(i).values[21];
                            const DaySellOpenValue = worksheet.getRow(i).values[22] === undefined ? null : worksheet.getRow(i).values[22];
                            const PreExAsgmntLongQuantity = worksheet.getRow(i).values[23] === undefined ? null : worksheet.getRow(i).values[23];
                            const PreExAsgmntLongValue = worksheet.getRow(i).values[24] === undefined ? null : worksheet.getRow(i).values[24];
                            const PreExAsgmntShortQuantity = worksheet.getRow(i).values[25] === undefined ? null : worksheet.getRow(i).values[25];
                            const PreExAsgmntShortValue = worksheet.getRow(i).values[26] === undefined ? null : worksheet.getRow(i).values[26];
                            const ExercisedQuantity = worksheet.getRow(i).values[27] === undefined ? null : worksheet.getRow(i).values[27];
                            const AssignedQuantity = worksheet.getRow(i).values[28] === undefined ? null : worksheet.getRow(i).values[28];
                            const PostExAsgmntLongQuantity = worksheet.getRow(i).values[29] === undefined ? null : worksheet.getRow(i).values[29];
                            const PostExAsgmntLongValue = worksheet.getRow(i).values[30] === undefined ? null : worksheet.getRow(i).values[30];
                            const PostExAsgmntShortQuantity = worksheet.getRow(i).values[31] === undefined ? null : worksheet.getRow(i).values[31];
                            const PostExAsgmntShortValue = worksheet.getRow(i).values[32] === undefined ? null : worksheet.getRow(i).values[32];
                            const SettlementPrice = worksheet.getRow(i).values[33] === undefined ? null : worksheet.getRow(i).values[33];
                            const NetPremium = worksheet.getRow(i).values[34] === undefined ? null : worksheet.getRow(i).values[34];
                            const DailyMTMSettlementValue = worksheet.getRow(i).values[35] === undefined ? null : worksheet.getRow(i).values[35];
                            const FuturesFinalSettlementValue = worksheet.getRow(i).values[36] === undefined ? null : worksheet.getRow(i).values[36];
                            const ExercisedAssignedValue = worksheet.getRow(i).values[37] === undefined ? null : worksheet.getRow(i).values[37];
                            const IsActive = worksheet.getRow(i).values[38] === undefined ? null : worksheet.getRow(i).values[38];

                            console.log(`Cell values at row ${i}:`, PositionDate, SegmentIndicator, SettlementType, ClearingMemberCode, MemberType, TradingMemberCode, AccountType, ClientAccountCode, InstrumentType, Symbol, Expirydate, StrikePrice, OptionType, CALevel, BroughtForwardLongQuantity, BroughtForwardLongValue, BroughtForwardShortQuantity, BroughtForwardShortValue, DayBuyOpenQuantity, DayBuyOpenValue, DaySellOpenQuantity, DaySellOpenValue, PreExAsgmntLongQuantity, PreExAsgmntLongValue, PreExAsgmntShortQuantity, PreExAsgmntShortValue, ExercisedQuantity, AssignedQuantity, PostExAsgmntLongQuantity, PostExAsgmntLongValue, PostExAsgmntShortQuantity, PostExAsgmntShortValue, SettlementPrice, NetPremium, DailyMTMSettlementValue, FuturesFinalSettlementValue, ExercisedAssignedValue, IsActive);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_FNOROLLOVER_EXPIRYDATA = datamodel.TBL_FNOROLLOVER_EXPIRYDATA();

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;




                            // // Parse the date from Excel and check if it contains a time component for  PositionDate
                            // const excelDate = new Date(PositionDate);
                            // const hasTimeComponent = !isNaN(excelDate.getTime()) && excelDate.getHours() > 0;

                            // // Format the date accordingly
                            // const formattedDate = hasTimeComponent
                            //     ? excelDate.toISOString().split('.')[0] // Date with time component
                            //     : excelDate.toISOString().split('T')[0]; // Date without time component

                            // // Parse the date from Excel and check if it contains a time component for  Expirydate
                            // const excelDate1 = new Date(Expirydate);
                            // const hasTimeComponent1 = !isNaN(excelDate1.getTime()) && excelDate1.getHours() > 0;

                            // // Format the date accordingly
                            // const formattedDate1 = hasTimeComponent1
                            //     ? excelDate1.toISOString().split('.')[0] // Date with time component
                            //     : excelDate1.toISOString().split('T')[0]; // Date without time component


                            const query = `SELECT * FROM "TBL_FNOROLLOVER_EXPIRYDATA" WHERE "SYMBOL" = '${Symbol}' AND "EXPIRY_DATE" = '${Expirydate}' AND "IS_ACTIVE" = true;`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    POSITION_DATE: PositionDate,
                                    SEGMENT_INDICATOR: SegmentIndicator,
                                    SETTLEMENT_TYPE: SettlementType,
                                    CLEARING_MEMBER_CODE: ClearingMemberCode,
                                    MEMBER_TYPE: MemberType,
                                    TRADING_MEMBER_CODE: TradingMemberCode,
                                    ACCOUNT_TYPE: AccountType,
                                    CLIENT_ACCOUNT_CODE: ClientAccountCode,
                                    INSTRUMENT_TYPE: InstrumentType,
                                    SYMBOL: Symbol,
                                    EXPIRY_DATE: Expirydate,
                                    STRIKE_PRICE: StrikePrice,
                                    OPTION_TYPE: OptionType,
                                    CA_LEVEL: CALevel,
                                    BROUGHT_FORWARD_LONG_QUANTITY: BroughtForwardLongQuantity,
                                    BROUGHT_FORWARD_LONG_VALUE: BroughtForwardLongValue,
                                    BROUGHT_FORWARD_SHORT_QUANTITY: BroughtForwardShortQuantity,
                                    BROUGHT_FORWARD_SHORT_VALUE: BroughtForwardShortValue,
                                    DAY_BUY_OPEN_QUANTITY: DayBuyOpenQuantity,
                                    DAY_BUY_OPEN_VALUE: DayBuyOpenValue,
                                    DAY_SELL_OPEN_QUANTITY: DaySellOpenQuantity,
                                    DAY_SELL_OPEN_VALUE: DaySellOpenValue,
                                    PRE_EX_AS_GMNT_LONG_QUANTITY: PreExAsgmntLongQuantity,
                                    PRE_EX_AS_GMNT_LONG_VALUE: PreExAsgmntLongValue,
                                    PRE_EX_AS_GMNT_SHORT_QUANTITY: PreExAsgmntShortQuantity,
                                    PRE_EX_AS_GMNT_SHORT_VALUE: PreExAsgmntShortValue,
                                    EXERCISED_QUANTITY: ExercisedQuantity,
                                    ASSIGNED_QUANTITY: AssignedQuantity,
                                    POST_EX_AS_GMNT_LONG_QUANTITY: PostExAsgmntLongQuantity,
                                    POST_EX_AS_GMNT_LONG_VALUE: PostExAsgmntLongValue,
                                    POST_EX_AS_GMNT_SHORT_QUANTITY: PostExAsgmntShortQuantity,
                                    POST_EX_AS_GMNT_SHORT_VALUE: PostExAsgmntShortValue,
                                    SETTLEMENT_PRICE: SettlementPrice,
                                    NET_PREMIUM: NetPremium,
                                    DAILY_MTM_SETTLEMENT_VALUE: DailyMTMSettlementValue,
                                    FUTURES_FINAL_SETTLEMENT_VALUE: FuturesFinalSettlementValue,
                                    EXERCISED_ASSIGNED_VALUE: ExercisedAssignedValue,
                                    IS_ACTIVE: true,
                                    CREATED_BY: createdByValue
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_FNOROLLOVER_EXPIRYDATA, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                                    success = true;
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                    success = false;
                                    break;
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/getDPHoldingData')
        .get(function (req, res) {

            const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();
            var param = {
                attributes: ['EMPID', 'FIRSTNAME', 'LOGIN_ID', 'DESIGNATED', 'EFSL_DESIGNATED', 'ACCOUNT_CODE', 'ACCOUNT_NAME', 'PAN_NO', 'E_BOID', 'ISIN_CODE', 'TRX_DATE', 'DP_QTY', 'IS_ACTIVE', 'SEGMENT'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_DP_HOLDING_DATA, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_DP_HOLDING_DATA Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DP_HOLDING_DATA Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getDPHoldingData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DP_HOLDING_DATA Table', Data: null });
                });

        });


    router.route('/SaveDPHoldingData')
        .post(upload.any(), async function (req, res) {
            for (let key in req.body) {
                req.body[key] = req.body[key] === '' || req.body[key] === 'undefined' ? null : req.body[key];
            }

            const requestBody = { ...req.body };
            const requestFiles = req.files;
            if (!requestFiles || requestFiles.length == 0) {
                return res.status(400).json({ Success: false, Message: 'No file uploaded' });
            }

            const file = requestFiles[0];

            try {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                // ✅ Header validation
                const requiredHeaders = ['EmpNO', 'AccName', 'AccCode', 'ScriptName', 'ISINCode', 'TrxDate', 'DpQty', 'Segment'];

                const sheetDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const actualHeaders = sheetDataRaw[0] || [];

                const headersMatch =
                    actualHeaders.length === requiredHeaders.length &&
                    requiredHeaders.every((val, idx) => val === actualHeaders[idx]);

                if (!headersMatch) {

                    e.Reason = 'Excel headers do not match required format'
                    ErrorArray.push({ ...e });
                }

                // ✅ Parse Excel rows


                const Finalarray = [];
                const ErrorArray = [];
                const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();

                const inFileDuplicates = new Set();

                for (const e of excelData) {

                    const requiredFields = [
                        'EmpNO', 'AccName', 'AccCode', 'ScriptName', 'ISINCode', 'TrxDate', 'DpQty', 'Segment'
                    ];
                    const missingFields = requiredFields.filter(
                        field => !e[field] || e[field].toString().trim() === ''
                    );

                    if (missingFields.length > 0) {
                        e.Reason = `Missing fields: ${missingFields.join(', ')}`
                        ErrorArray.push({ ...e });

                    }

                    const TradeArray = [
                        { ID: 1, Name: 'Equity' },
                        { ID: 2, Name: 'Future' },
                        { ID: 3, Name: 'Option' },
                        { ID: 4, Name: 'PrimaryIssue' },
                        { ID: 5, Name: 'SpecialCase' },
                    ];

                    const segmentValid = TradeArray.some(t => t.Name === e.Segment);
                    if (!segmentValid) {
                        e.Reason = `Invalid segment: '${e.segment}' (allowed: ${TradeArray.map(t => t.Name).join(', ')})`
                        ErrorArray.push({ ...e });


                    }


                    const CheckISIN = `select * from "TBL_SCRIPT_MST"  where "ISIN_CODE"='${e.ISINCode}'`
                    let CheckISINs = await connect.sequelize.query(CheckISIN);
                    if (CheckISINs[0].length == 0) {

                        e.Reason = 'ISIN_CODE in db'
                        ErrorArray.push({ ...e });
                    }

                    let query1 = `SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${requestBody.UserId}' AND "IS_ACTIVE" = true
                    UNION
                    SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${requestBody.UserId}' AND "IS_ACTIVE" = true`
                    let SelfData = await connect.sequelize.query(query1);
                    if (SelfData[0].length > 0) {

                        let query2 = `SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${requestBody.UserId}'  AND "IS_ACTIVE" = true 
                    UNION
                    SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${requestBody.UserId}' AND "IS_ACTIVE" = true`

                        let EAH = await connect.sequelize.query(query2);
                        // if (EAH[0] != null) {
                        if (EAH[0].length > 0) {
                            const All = [...SelfData[0], ...EAH[0]];
                            All.forEach((element, index) => {
                                if (element.TRADING_ACCOUNT_NUMBER != e.AccCode) {
                                    if (All.length == (index)) {
                                        e.Reason = 'Invalid account code'
                                        ErrorArray.push({ ...e });
                                    }

                                } else if (element.RELATIONSHIP != e.AccName) {
                                    if (All.length == (index + 1)) {
                                        e.Reason = 'Invalid Name code'
                                        ErrorArray.push({ ...e });
                                    }


                                }

                            })

                        } else {
                            e.Reason = 'account code not in db'
                            ErrorArray.push({ ...e });
                        }

                    }

                    if (typeof e.TrxDate === 'number') {
                        e.TrxDate = convertExcelDateToJSDate(e.TrxDate);
                    }
                    function convertExcelDateToJSDate(serial) {
                        const excelEpoch = new Date(1900, 0, 1); // Jan 1, 1900
                        const jsDate = new Date(excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000); // -2 to account for Excel bug (1900 leap year)
                        const yyyy = jsDate.getFullYear();
                        const mm = String(jsDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(jsDate.getDate()).padStart(2, '0');
                        return `${yyyy}-${mm}-${dd}`;
                    }

                    // ✅ TrxDate format (YYYY-MM-DD)
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
                    if (!dateRegex.test(e.TrxDate)) {
                        e.Reason = 'Invalid TrxDate format (YYYY-MM-DD)'
                        ErrorArray.push({ ...e });

                    }

                    // ✅ dpqty numeric
                    if (isNaN(e.DpQty)) {
                        e.Reason = 'DpQty must be numeric'
                        ErrorArray.push({ ...e });


                    }

                    // ✅ segment only alphabets
                    const segmentRegex = /^[A-Za-z]+$/;
                    if (!segmentRegex.test(e.Segment.toString().trim())) {
                        e.Reason = 'Segment must contain only letters'
                        ErrorArray.push({ ...e });
                    }

                    // ✅ AccName only characters & spaces
                    const accNameRegex = /^[A-Za-z\s]+$/;
                    if (!accNameRegex.test(e.AccName.toString().trim())) {
                        e.Reason = 'AccName must contain only alphabetic characters'
                        ErrorArray.push({ ...e });

                    }

                    // ✅ In-file duplicate check
                    const duplicateKey = `${e.RequestID}|${e.AccCode}|${e.AccName}|${e.ISINCode}|${e.Segment}`;
                    if (inFileDuplicates.has(duplicateKey)) {

                        e.Reason = 'Duplicate row in file'
                        ErrorArray.push({ ...e });

                    }
                    inFileDuplicates.add(duplicateKey);

                    // ✅ DB duplicate check
                    const query = `
                      SELECT * FROM "TBL_DP_HOLDING_DATA"
                      WHERE "EMPID" = '${e.EmpNO}'
                        AND "ISIN_CODE" = '${e.ISINCode}'
                        AND "IS_ACTIVE" = true
                    `;
                    const rows = await connect.sequelize.query(query);
                    if (rows[0].length > 0) {
                        e.Reason = 'Duplicate record exists in DB'
                        ErrorArray.push({ ...e });

                    }

                    // ✅ Final valid data
                    Finalarray.push({
                        EMPID: e.EmpNO,
                        ACCOUNT_CODE: e.AccCode,
                        ACCOUNT_NAME: e.AccName,
                        ISIN_CODE: e.ISINCode,
                        TRX_DATE: e.TrxDate,
                        DP_QTY: e.DpQty,
                        SEGMENT: e.Segment,
                        FIRSTNAME: e.AccName,
                        IS_ACTIVE: true,
                        CREATED_BY: requestBody.UserId,
                        ApprovalAvailableQty: e.DpQty,
                        TradeAvailableQty: 0
                    });
                }


                const FinalarrayError = [];
                ErrorArray.forEach((item) => {
                    const existingEntry = FinalarrayError.find((t) => t.ISINCode === item.ISINCode);
                    if (existingEntry) {
                        // Check if the current Reason is already part of the concatenated Reason
                        const remarksArray = existingEntry.Reason.split("; ").map(r => r.trim());
                        if (!remarksArray.includes(item.Reason.trim())) {
                            existingEntry.Reason += `; ${item.Reason}`;
                        }
                    } else {
                        FinalarrayError.push({ ...item });
                    }
                });
                if (FinalarrayError.length == 0 && Finalarray.length > 0) {
                    const result = await dataaccess.BulkCreate(TBL_DP_HOLDING_DATA, Finalarray);
                    const EncryptLoginDetails = dataconn.encryptionAES(result);
                    const Folder_Path = path.join(__dirname, 'UploadFiles');
                    fileDetails = req.files;
                    for (let i = 0; i < fileDetails.length; i++) {

                        let newFileName = `${fileDetails[i].originalname}`;

                        let writeFile = util.promisify(fs.writeFile)

                        const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                        // Use the existing folder path
                        await writeFile(filePath, fileDetails[i].buffer);
                    }
                    return res.status(200).json({
                        Success: true,
                        Message: 'Excel file uploaded successfully',
                        Data: EncryptLoginDetails
                    });
                } else {

                    res.status(200).json({ Success: false, Message: 'Please fill the valid data', Data: ErrorArray });

                }

            } catch (error) {
                console.error('Excel parsing error:', error);
                res.status(500).json({
                    Success: false,
                    Message: 'Error parsing Excel file',
                    Error: error.message
                });
            }
        });





    router.route('/getfundmanagerlistData')
        .get(function (req, res) {

            const TBL_FUND_MANAGER_LISTDATA = datamodel.TBL_FUND_MANAGER_LISTDATA();

            var param = {
                attributes: ['EMPNO', 'EMPLOYEE_NAME'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_FUND_MANAGER_LISTDATA, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_FUND_MANAGER_LISTDATA Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_FUND_MANAGER_LISTDATA Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getfundmanagerlistData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_FUND_MANAGER_LISTDATA Table', Data: null });
                });

        });

    router.route('/SavefundmanagerlistData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    writeFile(filePath, fileDetails[i].buffer);
                    // const workbook = new ExcelJS.Workbook();
                    // await workbook.xlsx.readFile(filePath);
                    // const worksheet = workbook.getWorksheet(1);
                    const resultArr = [];
                    const resultArr1 = [];
                    const resultArrInActive = [];

                    try {

                        // const formattedStartDate = formatDate(TradeDate);
                        // const formattedEndDate = formatDate(ExpiryDate);                            

                        const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;

                        //1. get data from the main table
                        const query1 = `SELECT * FROM "TBL_FUND_MANAGER_LISTDATA";`;
                        const result1 = await connect.sequelize.query(query1);
                        console.log("result1", result1[0]);

                        const transformedResult = result1[0].map(row => ({
                            ID: row.ID,
                            EMPNO: row.EMPNO,
                            EMP_NAME: row.EMPLOYEE_NAME
                        }));
                        console.log("transformedResult", transformedResult);
                        resultArr.push(transformedResult);

                        console.log("resultArr", resultArr);

                        const TBL_FUND_MANAGER_LISTDATA_HIS = datamodel.TBL_FUND_MANAGER_LISTDATA_HIS();
                        const TBL_FUND_MANAGER_LISTDATA = datamodel.TBL_FUND_MANAGER_LISTDATA();

                        //2. save data from the main table to his table
                        for (const result of resultArr) {
                            if (result.length > 0) {
                                for (const { ID, EMPNO, EMP_NAME } of result) {
                                    const query2 = `SELECT * FROM "TBL_FUND_MANAGER_LISTDATA_HIS" WHERE "EMPNO" = '${EMPNO}'`;
                                    const rows2 = await connect.sequelize.query(query2);
                                    console.log("rows2", rows2[0]);

                                    if (rows2[0].length === 0) {
                                        const values1 = {
                                            TBL_FUND_MANAGER_LISTDATA_ID: ID,
                                            EMPNO: EMPNO,
                                            EMPLOYEE_NAME: EMP_NAME,
                                            CREATED_BY: createdByValue
                                        };
                                        try {
                                            const createdfundHisListMST = await dataaccess.Create(TBL_FUND_MANAGER_LISTDATA_HIS, values1);
                                            success = true;
                                        } catch (error) {
                                            console.error("Error during database insertion:", error);
                                            return res.status(500).json({ Success: false, Message: 'Error inserting data in TBL_FUND_MANAGER_LISTDATA_HIS', Data: null });
                                        }
                                    }
                                }
                            }
                        }

                        //3. truncate the main table
                        const query3 = `TRUNCATE TABLE "TBL_FUND_MANAGER_LISTDATA";`;
                        const rows3 = await connect.sequelize.query(query3);
                        console.log("rows2", rows3[0]);

                        //4.after trucate get data from the history table

                        const query4 = `SELECT * FROM "TBL_FUND_MANAGER_LISTDATA_HIS";`;
                        const result5 = await connect.sequelize.query(query4);
                        console.log("result5", result5[0]);

                        const transformedResult4 = result5[0].map(row => ({
                            EMPNO: row.EMPNO,
                            EMP_NAME: row.EMPLOYEE_NAME
                        }));
                        console.log("transformedResult4", transformedResult4);
                        resultArr1.push(transformedResult4);

                        console.log("resultArr1", resultArr1);

                        //5.save data into main table from the his table
                        for (const result of resultArr1) {
                            if (result.length > 0) {
                                for (const { EMPNO, EMP_NAME } of result) {
                                    const query6 = `SELECT * FROM "TBL_FUND_MANAGER_LISTDATA" WHERE "EMPNO" = '${EMPNO}'`;
                                    const rows6 = await connect.sequelize.query(query6);
                                    console.log("rows6", rows6[0]);

                                    if (rows6[0].length === 0) {
                                        const values2 = {
                                            EMPNO: EMPNO,
                                            EMPLOYEE_NAME: EMP_NAME,
                                            CREATED_BY: createdByValue
                                        };
                                        try {
                                            const createdfundListMST = await dataaccess.Create(TBL_FUND_MANAGER_LISTDATA, values2);
                                            success = true;
                                        } catch (error) {
                                            console.error("Error during database insertion:", error);
                                            return res.status(500).json({ Success: false, Message: 'Error inserting data in TBL_FUND_MANAGER_LISTDATA', Data: null });
                                        }
                                    }
                                }
                            }
                        }

                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.readFile(filePath);
                        const worksheet = workbook.getWorksheet(1);

                        //6.get data from the file and save in main table 
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const EmpId = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const EmpName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];

                            console.log(`Cell values at row ${i}:`, EmpId, EmpName);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            //7.check user is active or not
                            const queryactiveuser = `SELECT * FROM "TBL_USER_MST" WHERE "EMPNO" = '${EmpId}' AND "ISACTIVE" = true`;
                            const rowsactiveuser = await connect.sequelize.query(queryactiveuser);
                            console.log("rowsactiveuser", rowsactiveuser[0]);

                            //8.if unactive saved in one array 
                            if (rowsactiveuser[0].length === 0) {

                                const transformedResult7 = {
                                    EMPNO: EmpId,
                                    EMP_NAME: EmpName
                                };
                                console.log("transformedResult7", transformedResult7);
                                resultArrInActive.push(transformedResult7);

                                console.log("resultArrInActive", resultArrInActive);

                            } else {
                                //9.if ctive saved in main table

                                const query9 = `SELECT * FROM "TBL_FUND_MANAGER_LISTDATA" WHERE "EMPNO" = '${EmpId}'`;
                                const rows9 = await connect.sequelize.query(query9);
                                console.log("rows9", rows9[0]);

                                if (rows9[0].length === 0) {
                                    var values = {
                                        EMPNO: EmpId,
                                        EMPLOYEE_NAME: EmpName,
                                        CREATED_BY: createdByValue
                                    };

                                    try {
                                        createdGreyListMST = await dataaccess.Create(TBL_FUND_MANAGER_LISTDATA, values);
                                        success = true;
                                    } catch (error) {
                                        console.error("Error during database insertion:", error);
                                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                        success = false;
                                        break;
                                    }
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: resultArrInActive });
                    } catch (error) {
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/getitradingRejeclistData')
        .get(function (req, res) {

            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();

            var param = {
                attributes: ['EMPLOYEE_CODE', 'IPOID', 'IPO_NAME'],
                where: { IS_ACTIVE: true },
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_PRIMARY_ISSUE_REJECTION_LIST_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PRIMARY_ISSUE_REJECTION_LIST_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getitradingRejeclistData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PRIMARY_ISSUE_REJECTION_LIST_MST Table', Data: null });
                });

        });

    router.route('/SaveiTradingPrimaryIssueRejectData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const EmpId = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const IPOID = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const IPOName = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];

                            console.log(`Cell values at row ${i}:`, EmpId, IPOID, IPOName);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();

                            // const formattedStartDate = formatDate(TradeDate);
                            // const formattedEndDate = formatDate(ExpiryDate);                            

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;


                            const query = `SELECT * FROM "TBL_PRIMARY_ISSUE_REJECTION_LIST_MST" WHERE "EMPLOYEE_CODE" = '${EmpId}' AND "IPOID" = '${IPOID}' AND "IS_ACTIVE" = true`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    EMPLOYEE_CODE: EmpId,
                                    IPOID: IPOID,
                                    IPO_NAME: IPOName,
                                    IS_ACTIVE: true,
                                    CREATED_BY: createdByValue
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                                    success = true;
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                    success = false;
                                    break;
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });

    router.route('/getEirfFO3MonthsLOTSDailyData')
        .get(function (req, res) {

            const EIRF_FO_3Months_LOTS_DAILY = datamodel.EIRF_FO_3Months_LOTS_DAILY();

            var param = {
                attributes: ['SYMBOL', 'SCRIPT_NAME', 'First_Month_LOT_SIZE', 'First_Month', 'Second_Month_LOT_SIZE', 'Second_Month',
                    'Third_Month_LOT_SIZE', 'Third_Month'],
                // where: { IS_ACTIVE: true },
            };

            console.log("param", param);

            dataaccess.FindAll(EIRF_FO_3Months_LOTS_DAILY, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'EIRF_FO_3Months_LOTS_DAILY Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of EIRF_FO_3Months_LOTS_DAILY Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getEirfFO3MonthsLOTSDailyData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of EIRF_FO_3Months_LOTS_DAILY Table', Data: null });
                });

        });

    router.route('/SaveFOMonthsLOTSDailyData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const quer0 = `truncate table "EIRF_FO_3Months_LOTS_DAILY"`;
                    const row0 = await connect.sequelize.query(quer0);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {
                            const Symbol = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const ScripName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const FirstLOTSize = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const FMonth = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const SecLOTSize = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const SMonth = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const ThirdLOTSize = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const ThirdMonth = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];

                            console.log(`Cell values at row ${i}:`, Symbol, ScripName, FirstLOTSize, FMonth, SecLOTSize, SMonth, ThirdLOTSize, ThirdMonth);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const EIRF_FO_3Months_LOTS_DAILY = datamodel.EIRF_FO_3Months_LOTS_DAILY();

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;

                            const query = `SELECT * FROM "EIRF_FO_3Months_LOTS_DAILY" WHERE "SYMBOL" = '${Symbol}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    SYMBOL: Symbol,
                                    SCRIPT_NAME: ScripName,
                                    First_Month_LOT_SIZE: FirstLOTSize,
                                    First_Month: FMonth,
                                    Second_Month_LOT_SIZE: SecLOTSize,
                                    Second_Month: SMonth,
                                    Third_Month_LOT_SIZE: ThirdLOTSize,
                                    Third_Month: ThirdMonth,
                                    IS_ACTIVE: true,
                                    CREATED_BY: createdByValue
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(EIRF_FO_3Months_LOTS_DAILY, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                                    success = true;
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                    success = false;
                                    break;
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                    } catch (error) {
                        // Handle errors and send an error response
                        console.error(error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                    }
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            }
        });


    router.route('/getDPHoldingDataByEmpId')
        .get(function (req, res) {
            const empId = req.query.empId;

            //var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            if (!empId) {
                return res.status(200).json({ Success: false, Message: 'Employee ID is required', Data: null });
            }

            const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();
            const TBL_SCRIPT_MST = datamodel.TBL_SCRIPT_MST();
            var param = {
                attributes: ['ID', 'EMPID', 'FIRSTNAME', 'LOGIN_ID', 'DESIGNATED', 'EFSL_DESIGNATED',
                    'ACCOUNT_CODE', 'ACCOUNT_NAME', 'PAN_NO', 'E_BOID', 'ISIN_CODE', 'TRX_DATE',
                    'DP_QTY', 'IS_ACTIVE', 'SEGMENT', 'CREATED_DT', 'TradeAvailableQty', 'ApprovalAvailableQty'],
                where: {
                    EMPID: empId,
                    IS_ACTIVE: true
                },
                include: [{
                    model: TBL_SCRIPT_MST,
                    as: 'Script',
                    attributes: ['SCRIP_DESC'],
                    required: false
                }],
                order: [['CREATED_DT', 'DESC']]
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_DP_HOLDING_DATA, param)
                .then(function (result) {
                    console.log("resultkhi;lari", result);
                    if (result != null && result.length > 0) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'DP Holding Data retrieved successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'No records found for the employee', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getDPHoldingDataByEmpId', err);
                    res.status(200).json({ Success: false, Message: 'Error retrieving DP Holding Data', Data: null });
                });
        });
    router.route('/addDPHoldingData')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            // Convert empty strings to null
            for (var key in encryptmodel) {
                encryptmodel[key] = encryptmodel[key] === '' || encryptmodel[key] === 'undefined' ? null : encryptmodel[key];
            }

            const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();            // Create values object from decrypted data
            var values = {
                EMPID: encryptmodel.EMPID,
                FIRSTNAME: encryptmodel.FIRSTNAME,
                LOGIN_ID: encryptmodel.LOGIN_ID,
                DESIGNATED: encryptmodel.DESIGNATED,
                EFSL_DESIGNATED: encryptmodel.EFSL_DESIGNATED,
                ACCOUNT_CODE: encryptmodel.ACCOUNT_CODE,
                ACCOUNT_NAME: encryptmodel.ACCOUNT_NAME,
                PAN_NO: encryptmodel.PAN_NO,
                E_BOID: encryptmodel.E_BOID,
                ISIN_CODE: encryptmodel.ISIN_CODE,
                TRX_DATE: encryptmodel.TRX_DATE,
                DP_QTY: encryptmodel.DP_QTY,
                SEGMENT: encryptmodel.SEGMENT,
                IS_ACTIVE: true,
                CREATED_BY: encryptmodel.CREATED_BY || encryptmodel.FIRSTNAME,
                CREATED_DT: new Date(),
                TradeAvailableQty: 0,
                ApprovalAvailableQty: encryptmodel.DP_QTY
            };

            // Validate required fields
            if (!values.EMPID) {
                return res.status(200).json({ Success: false, Message: 'Employee ID is required', Data: null });
            }

            dataaccess.Create(TBL_DP_HOLDING_DATA, values)
                .then(function (result) {
                    console.log("Created result", result);
                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                    res.status(200).json({ Success: true, Message: 'DP Holding Data added successfully', Data: EncryptLoginDetails });
                }, function (err) {
                    dataconn.errorlogger('uploads', 'addDPHoldingData', err);
                    res.status(200).json({ Success: false, Message: 'Error adding DP Holding Data: ' + err.message, Data: null });
                });
        }); router.route('/deleteDPHoldingData')
            .post(async function (req, res) {
                try {
                    var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                    // Ensure ID and EMPID are scalar values, not objects
                    const id = typeof encryptmodel.ID === 'object' ? encryptmodel.ID.ID || encryptmodel.ID : encryptmodel.ID;
                    const empId = typeof encryptmodel.EMPID === 'object' ? encryptmodel.EMPID.EMPID || encryptmodel.EMPID : encryptmodel.EMPID;

                    console.log('Delete - ID:', id, 'EMPID:', empId, 'Type of ID:', typeof id);

                    if (!id || !empId) {
                        return res.status(200).json({ Success: false, Message: 'Both ID and Employee ID are required', Data: null });
                    }

                    const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();

                    // First, check if the record exists and is active
                    const query = `SELECT * FROM "TBL_DP_HOLDING_DATA" WHERE "ID" = '${id}' AND "EMPID" = '${empId}' AND "IS_ACTIVE" = true`;
                    const rows = await connect.sequelize.query(query);
                    console.log("Found records:", rows[0]);

                    if (rows[0].length === 0) {
                        return res.status(200).json({ Success: false, Message: 'Record not found or already deleted', Data: null });
                    }

                    // Record exists, proceed with soft delete
                    var updateValues = {
                        IS_ACTIVE: false,
                        MODIFIED_BY: encryptmodel.MODIFIED_BY || 'System',
                        MODIFIED_DT: new Date()
                    };

                    var whereClause = {
                        ID: id,
                        EMPID: empId,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Update(TBL_DP_HOLDING_DATA, updateValues, whereClause);

                    if (result[0] > 0) {
                        // Retrieve the updated record to return in response
                        const deletedRecord = await dataaccess.FindOne(TBL_DP_HOLDING_DATA, { where: { ID: id, EMPID: empId } });
                        var EncryptLoginDetails = dataconn.encryptionAES(deletedRecord);
                        res.status(200).json({
                            Success: true,
                            Message: 'DP Holding Data deleted successfully',
                            Data: EncryptLoginDetails
                        });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Failed to delete record', Data: null });
                    }
                } catch (error) {
                    console.error("Error during delete operation:", error);
                    dataconn.errorlogger('uploads', 'deleteDPHoldingData', error);
                    res.status(200).json({ Success: false, Message: 'Error deleting DP Holding Data: ' + error.message, Data: null });
                }
            });

    router.route('/updateDPHoldingData')
        .post(async function (req, res) {
            try {
                const encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                // Normalize ID and EMPID in case they're nested objects
                const id = typeof encryptmodel.ID === 'object' ? encryptmodel.ID?.ID ?? encryptmodel.ID : encryptmodel.ID;
                const empId = typeof encryptmodel.EMPID === 'object' ? encryptmodel.EMPID?.EMPID ?? encryptmodel.EMPID : encryptmodel.EMPID;

                console.log('Update - ID:', id, 'EMPID:', empId);

                if (!id || !empId) {
                    return res.status(200).json({
                        Success: false,
                        Message: 'Both ID and Employee ID are required',
                        Data: null
                    });
                }

                const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();

                // Query for existing record
                const selectQuery = `
        SELECT * FROM "TBL_DP_HOLDING_DATA"
        WHERE "ID" = '${id}' AND "EMPID" = '${empId}' AND "IS_ACTIVE" = true
      `;
                const [rows] = await connect.sequelize.query(selectQuery);

                if (rows.length === 0) {
                    return res.status(200).json({
                        Success: false,
                        Message: 'Record not found or inactive',
                        Data: null
                    });
                }

                const existing = rows[0];

                // Sanitize incoming fields
                for (let key in encryptmodel) {
                    if (encryptmodel[key] === '' || encryptmodel[key] === 'undefined') {
                        encryptmodel[key] = null;
                    }
                }

                const Updatedqty = Number(encryptmodel.Updatedqty || 0);
                const ExistingApprovalQty = Number(existing.ApprovalAvailableQty || 0);

                const updateValues = {
                    FIRSTNAME: encryptmodel.FIRSTNAME,
                    LOGIN_ID: encryptmodel.LOGIN_ID,
                    DESIGNATED: encryptmodel.DESIGNATED,
                    EFSL_DESIGNATED: encryptmodel.EFSL_DESIGNATED,
                    ACCOUNT_CODE: encryptmodel.ACCOUNT_CODE,
                    ACCOUNT_NAME: encryptmodel.ACCOUNT_NAME,
                    PAN_NO: encryptmodel.PAN_NO,
                    E_BOID: encryptmodel.E_BOID,
                    ISIN_CODE: encryptmodel.ISIN_CODE,
                    TRX_DATE: encryptmodel.TRX_DATE,
                    DP_QTY: encryptmodel.DP_QTY,
                    SEGMENT: encryptmodel.SEGMENT,
                    MODIFIED_BY: encryptmodel.MODIFIED_BY || encryptmodel.FIRSTNAME,
                    MODIFIED_DT: new Date(),
                    ApprovalAvailableQty: ExistingApprovalQty + Updatedqty
                };

                const whereClause = {
                    ID: id,
                    EMPID: empId,
                    IS_ACTIVE: true
                };

                const result = await dataaccess.Update(TBL_DP_HOLDING_DATA, updateValues, whereClause);

                if (result[0] > 0) {
                    const updatedRecord = await dataaccess.FindOne(TBL_DP_HOLDING_DATA, {
                        where: { ID: id, EMPID: empId }
                    });

                    const EncryptLoginDetails = dataconn.encryptionAES(updatedRecord);

                    return res.status(200).json({
                        Success: true,
                        Message: 'DP Holding Data updated successfully',
                        Data: EncryptLoginDetails
                    });
                } else {
                    return res.status(200).json({
                        Success: false,
                        Message: 'Failed to update record',
                        Data: null
                    });
                }
            } catch (error) {
                console.error('Error during update operation:', error);
                dataconn.errorlogger('uploads', 'updateDPHoldingData', error);
                return res.status(200).json({
                    Success: false,
                    Message: 'Error updating DP Holding Data: ' + error.message,
                    Data: null
                });
            }
        });


    //////////////////////////////////////////////////////////

    router.route('/getDPAllocationApprovalData')
        .get(function (req, res) {

            const TBL_DP_ALLOCATION_APPROVAL = datamodel.TBL_DP_ALLOCATION_APPROVAL();

            var param = {

                where: {

                    IS_ACTIVE: true,
                    // REQUEST_TYPE :'reset'
                },
                order: [['CREATED_DT', 'DESC']]
            };

            dataaccess.FindAll(TBL_DP_ALLOCATION_APPROVAL, param)
                .then(function (result) {
                    if (result != null && result.length > 0) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);

                        res.status(200).json({ Success: true, Message: 'TBL_DP_ALLOCATION_APPROVAL Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'No records found in TBL_DP_ALLOCATION_APPROVAL Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getDPAllocationApprovalData', err);
                    res.status(200).json({ Success: false, Message: 'Error accessing TBL_DP_ALLOCATION_APPROVAL Table: ' + err.message, Data: null });
                });
        });
    router.route('/addDPAllocationApprovalData')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                // Convert empty strings to null
                for (var key in encryptmodel) {
                    encryptmodel[key] = encryptmodel[key] === '' || encryptmodel[key] === 'undefined' ? null : encryptmodel[key];
                }

                const TBL_DP_ALLOCATION_APPROVAL = datamodel.TBL_DP_ALLOCATION_APPROVAL();

                // Validate REQUEST_TYPE
                if (!encryptmodel.REQUEST_TYPE || !['finalize', 'reset'].includes(encryptmodel.REQUEST_TYPE.toLowerCase())) {
                    return res.status(200).json({ Success: false, Message: 'REQUEST_TYPE is required and must be either "finalize" or "reset"', Data: null });
                }

                // Create values object from decrypted data
                if (encryptmodel.REQUEST_TYPE.toLowerCase() == 'reset') {
                    var values = {
                        EMPID: encryptmodel.EMPID,
                        FIRSTNAME: encryptmodel.FIRSTNAME,
                        DESIGNATED: encryptmodel.DESIGNATED,
                        REQUEST_TYPE: encryptmodel.REQUEST_TYPE.toLowerCase(), // Store as lowercase
                        IS_MAIL_SENT_FOR_APPROVAL: false, // Initially set to false
                        IS_ACCEPTED: false,
                        IS_ACTIVE: true,
                        CREATED_BY: encryptmodel.CREATED_BY || encryptmodel.FIRSTNAME,
                        CREATED_DT: new Date(),
                        REASON: encryptmodel.REASON
                    };
                } else {
                    var values = {
                        EMPID: encryptmodel.EMPID,
                        FIRSTNAME: encryptmodel.FIRSTNAME,
                        DESIGNATED: encryptmodel.DESIGNATED,
                        REQUEST_TYPE: encryptmodel.REQUEST_TYPE.toLowerCase(), // Store as lowercase
                        IS_MAIL_SENT_FOR_APPROVAL: false, // Initially set to false
                        IS_ACCEPTED: true,
                        IS_ACTIVE: true,
                        CREATED_BY: encryptmodel.CREATED_BY || encryptmodel.FIRSTNAME,
                        CREATED_DT: new Date(),
                        REASON: encryptmodel.REASON
                    };
                }


                // Validate required fields
                if (!values.EMPID) {
                    return res.status(200).json({ Success: false, Message: 'Employee ID is required', Data: null });
                }

                // Check for opposite request type and mark them inactive
                const oppositeType = values.REQUEST_TYPE === 'finalize' ? 'reset' : 'finalize';
                console.log(`Checking for existing ${oppositeType} requests for EMPID: ${values.EMPID}`);

                // Find any active records of the opposite type for this employee
                const query = `SELECT * FROM "TBL_DP_ALLOCATION_APPROVAL" 
                          WHERE "EMPID" = '${values.EMPID}' 
                          AND "REQUEST_TYPE" = '${oppositeType}' 
                          AND "IS_ACTIVE" = true`;

                const existingRequests = await connect.sequelize.query(query);

                // If opposite type requests exist, mark them as inactive
                if (existingRequests[0] && existingRequests[0].length > 0) {
                    console.log(`Found ${existingRequests[0].length} existing ${oppositeType} requests, marking them inactive`);

                    // Update all existing opposite requests to IS_ACTIVE = false
                    const inactivateQuery = `UPDATE "TBL_DP_ALLOCATION_APPROVAL" 
                                        SET "IS_ACTIVE" = false, 
                                            "MODIFIED_BY" = '${values.CREATED_BY}', 
                                            "MODIFIED_DT" = '${new Date().toISOString()}' 
                                        WHERE "EMPID" = '${values.EMPID}' 
                                        AND "REQUEST_TYPE" = '${oppositeType}' 
                                        AND "IS_ACTIVE" = true`;

                    await connect.sequelize.query(inactivateQuery);
                    console.log(`Marked existing ${oppositeType} requests as inactive`);
                }

                // Now create the new request
                const result = await dataaccess.Create(TBL_DP_ALLOCATION_APPROVAL, values);
                console.log("Created result", result);

                if (result != null) {
                    // Step 1: Record created successfully
                    console.log("DP Allocation Approval record created with ID:", result.ID);

                    // Step 2: Send email notification to admins (not to employee)
                    const emailData = {
                        EMPID: values.EMPID,
                        FIRSTNAME: values.FIRSTNAME,
                        DESIGNATED: values.DESIGNATED,
                        REQUEST_TYPE: values.REQUEST_TYPE,
                        CREATED_DT: values.CREATED_DT.toISOString().split('T')[0] // Format date
                    };

                    // Import mailer and send to admins
                    const mailer = require('../../Common/Mailer');
                    mailer.SendDPAllocationEmail('approval_notification', emailData);
                    mailer.SendDPAllocationEmail('admin_approval_request', emailData);

                    // Step 3: Update the IS_MAIL_SENT_FOR_APPROVAL flag
                    const updateValues = {
                        IS_MAIL_SENT_FOR_APPROVAL: true,
                        MODIFIED_BY: values.CREATED_BY,
                        MODIFIED_DT: new Date()
                    };

                    const whereClause = { ID: result.ID };

                    dataaccess.Update(TBL_DP_ALLOCATION_APPROVAL, updateValues, whereClause)
                        .then(function (updateResult) {
                            console.log("Email flag updated successfully");
                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                            res.status(200).json({
                                Success: true,
                                Message: 'DP Allocation Approval Data added successfully and admin notification sent',
                                Data: EncryptLoginDetails
                            });
                        })
                        .catch(function (updateErr) {
                            console.error("Error updating email flag:", updateErr);
                            // Still return success as main record was created
                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                            res.status(200).json({
                                Success: true,
                                Message: 'DP Allocation Approval Data added successfully but email flag update failed',
                                Data: EncryptLoginDetails
                            });
                        });
                } else {
                    res.status(200).json({ Success: false, Message: 'Failed to create DP Allocation Approval Data', Data: null });
                }
            } catch (error) {
                console.error("Error during DP Allocation Approval creation:", error);
                dataconn.errorlogger('uploads', 'addDPAllocationApprovalData', error);
                res.status(200).json({ Success: false, Message: 'Error adding DP Allocation Approval Data: ' + error.message, Data: null });
            }
        });
    router.route('/updateDPAllocationApprovalData')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                console.log('encryptmodel', encryptmodel);

                // Ensure ID and EMPID are scalar values, not objects
                const id = typeof encryptmodel.ID === 'object' ? encryptmodel.ID.ID || encryptmodel.ID : encryptmodel.ID;
                const empId = typeof encryptmodel.EMPID === 'object' ? encryptmodel.EMPID.EMPID || encryptmodel.EMPID : encryptmodel.EMPID;

                console.log('Update - ID:', id, 'EMPID:', empId, 'Type of ID:', typeof id);

                if (!id || !empId) {
                    return res.status(200).json({ Success: false, Message: 'Both ID and Employee ID are required', Data: null });
                }

                const TBL_DP_ALLOCATION_APPROVAL = datamodel.TBL_DP_ALLOCATION_APPROVAL();

                // First, check if the record exists and is active
                const query = `SELECT * FROM "TBL_DP_ALLOCATION_APPROVAL" WHERE "ID" = '${id}' AND "EMPID" = '${empId}' AND "IS_ACTIVE" = true`;
                const rows = await connect.sequelize.query(query);
                console.log("Found records for update:", rows[0]);

                if (rows[0].length === 0) {
                    return res.status(200).json({ Success: false, Message: 'Record not found or inactive', Data: null });
                }

                // Convert empty strings to null
                for (var key in encryptmodel) {
                    encryptmodel[key] = encryptmodel[key] === '' || encryptmodel[key] === 'undefined' ? null : encryptmodel[key];
                }

                const currentRecord = rows[0][0];
                const isApproved = encryptmodel.IS_ACCEPTED === true;
                const requestType = currentRecord.REQUEST_TYPE?.toLowerCase();

                console.log('Processing update with:', {
                    requestType,
                    isApproved,
                    currentRecordId: currentRecord.ID
                });

                // Define update values based on approval decision and request type
                let updateValues = {
                    MODIFIED_BY: encryptmodel.MODIFIED_BY || encryptmodel.FIRSTNAME,
                    MODIFIED_DT: new Date()
                };

                // Handle approval status - different behavior for finalize vs reset
                if (!isApproved) {
                    // Request is rejected
                    if (requestType === 'finalize') {
                        // For rejected finalize requests, mark as inactive (deleted)
                        updateValues.IS_ACCEPTED = false;
                        updateValues.IS_ACTIVE = false;
                    } else {
                        // For rejected reset requests, just mark as rejected but keep active
                        updateValues.IS_ACCEPTED = false;
                        updateValues.IS_ACTIVE = false;
                        updateValues.COMPLIANCEREMARK = encryptmodel.ComplianceRemark
                    }
                } else {
                    // Request is approved
                    updateValues.IS_ACCEPTED = true;
                    updateValues.REQUEST_TYPE = 'reset';

                }

                var whereClause = {
                    ID: id,
                    EMPID: empId,
                    IS_ACTIVE: true
                };
                console.log("updateValues", updateValues);

                // If IS_ACTIVE is false in updateValues, make sure we're still finding the record
                if (updateValues.IS_ACTIVE === false) {
                    delete whereClause.IS_ACTIVE;
                }

                const result = await dataaccess.Update(TBL_DP_ALLOCATION_APPROVAL, updateValues, whereClause);

                if (result[0] > 0) {
                    // Retrieve the updated record to return in response
                    const updatedRecord = await dataaccess.FindOne(TBL_DP_ALLOCATION_APPROVAL, { where: { ID: id, EMPID: empId } });

                    var EncryptLoginDetails = dataconn.encryptionAES(updatedRecord);
                    res.status(200).json({
                        Success: true,
                        Message: `DP Allocation Approval Data ${isApproved ? 'approved' : 'rejected'} successfully`,
                        Data: EncryptLoginDetails
                    });
                } else {
                    res.status(200).json({ Success: false, Message: 'Failed to update record', Data: null });
                }
            } catch (error) {
                console.error("Error during update operation:", error);
                dataconn.errorlogger('uploads', 'updateDPAllocationApprovalData', error);
                res.status(200).json({ Success: false, Message: 'Error updating DP Allocation Approval Data: ' + error.message, Data: null });
            }
        });

    router.route('/deleteDPAllocationApprovalData')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                // Ensure ID and EMPID are scalar values, not objects
                const id = typeof encryptmodel.ID === 'object' ? encryptmodel.ID.ID || encryptmodel.ID : encryptmodel.ID;
                const empId = typeof encryptmodel.EMPID === 'object' ? encryptmodel.EMPID.EMPID || encryptmodel.EMPID : encryptmodel.EMPID;

                console.log('Delete - ID:', id, 'EMPID:', empId, 'Type of ID:', typeof id);

                if (!id || !empId) {
                    return res.status(200).json({ Success: false, Message: 'Both ID and Employee ID are required', Data: null });
                }

                const TBL_DP_ALLOCATION_APPROVAL = datamodel.TBL_DP_ALLOCATION_APPROVAL();

                // First, check if the record exists and is active
                const query = `SELECT * FROM "TBL_DP_ALLOCATION_APPROVAL" WHERE "ID" = '${id}' AND "EMPID" = '${empId}' AND "IS_ACTIVE" = true`;
                const rows = await connect.sequelize.query(query);
                console.log("Found records:", rows[0]);

                if (rows[0].length === 0) {
                    return res.status(200).json({ Success: false, Message: 'Record not found or already deleted', Data: null });
                }

                // Record exists, proceed with soft delete
                var updateValues = {
                    IS_ACTIVE: false,
                    MODIFIED_BY: encryptmodel.MODIFIED_BY || 'System',
                    MODIFIED_DT: new Date()
                };

                var whereClause = {
                    ID: id,
                    EMPID: empId,
                    IS_ACTIVE: true
                };

                const result = await dataaccess.Update(TBL_DP_ALLOCATION_APPROVAL, updateValues, whereClause);

                if (result[0] > 0) {
                    // Retrieve the updated record to return in response
                    const deletedRecord = await dataaccess.FindOne(TBL_DP_ALLOCATION_APPROVAL, { where: { ID: id, EMPID: empId } });
                    var EncryptLoginDetails = dataconn.encryptionAES(deletedRecord);
                    res.status(200).json({
                        Success: true,
                        Message: 'DP Allocation Approval Data deleted successfully',
                        Data: EncryptLoginDetails
                    });
                } else {
                    res.status(200).json({ Success: false, Message: 'Failed to delete record', Data: null });
                }
            } catch (error) {
                console.error("Error during delete operation:", error);
                dataconn.errorlogger('uploads', 'deleteDPAllocationApprovalData', error);
                res.status(200).json({ Success: false, Message: 'Error deleting DP Allocation Approval Data: ' + error.message, Data: null });
            }
        });


    router.route('/encrypt')
        .post(function (req, res) {
            try {
                const payload = req.body.data;
                if (!payload) {
                    return res.status(200).json({ Success: false, Message: 'Data is required', Data: null });
                }
                const encryptedData = dataconn.encryptionAES(payload);
                res.status(200).json({ Success: true, Message: 'Data encrypted', Data: encryptedData });
            } catch (error) {
                res.status(200).json({ Success: false, Message: 'Encryption error', Data: null });
            }
        });

    router.route('/decrypt')
        .post(function (req, res) {
            try {
                const encryptedPayload = req.body.encryptedData;
                if (!encryptedPayload) {
                    return res.status(200).json({ Success: false, Message: 'Encrypted data is required', Data: null });
                }
                const decryptedData = dataconn.decrypt(encryptedPayload);
                res.status(200).json({ Success: true, Message: 'Data decrypted', Data: decryptedData });
            } catch (error) {
                res.status(200).json({ Success: false, Message: 'Decryption error', Data: null });
            }
        });


    router.route('/getallAproverdata')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            console.log("paramghghg", encryptmodel);
            const TBL_DP_ALLOCATION_APPROVAL = datamodel.TBL_DP_ALLOCATION_APPROVAL();
            var param = {
                where: {
                    EMPID: encryptmodel.EMP,
                    IS_ACTIVE: true,
                    IS_ACCEPTED: true,
                    REQUEST_TYPE: 'finalize'
                }

            };
            console.log("paramghghg", param);

            dataaccess.FindAll(TBL_DP_ALLOCATION_APPROVAL, param)
                .then(function (result) {
                    if (result != null && result.length > 0) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_DP_ALLOCATION_APPROVAL Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UplaodService', 'getallAproverdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DP_ALLOCATION_APPROVAL', Data: null });
                });
        });



    router.route('/EmployeeAccountCodeself')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            let query = `SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true
                    UNION
                    SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true`
            let SelfData = await connect.sequelize.query(query);
            // if (SelfData[0] != null) {
            if (SelfData[0].length > 0) {

                let query = ` SELECT 
    ent."TRADING_ACCOUNT_NUMBER",
    ent."RELATIONSHIP",
    rel."PAN_NO" AS "PAN_NO",
    ent."REL_INFO_ID"
FROM public."TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" ent
LEFT JOIN public."TBL_EAH_EMPLOYEE_RELATIVE_INFO" rel
  ON ent."REL_INFO_ID" = rel."ID"
WHERE ent."EMPLOYEE_ID" = '${encryptmodel.loginid}'
  AND ent."IS_ACTIVE" = true

UNION

SELECT 
    oth."TRADING_ACCOUNT_NUMBER",
    oth."RELATIONSHIP",
    rel."PAN_NO" AS "PAN_NO",
    oth."REL_INFO_ID"
FROM public."TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" oth
LEFT JOIN public."TBL_EAH_EMPLOYEE_RELATIVE_INFO" rel
  ON oth."REL_INFO_ID" = rel."ID"
WHERE oth."EMPLOYEE_ID" = '${encryptmodel.loginid}'
  AND oth."IS_ACTIVE" = true;`

                let EAH = await connect.sequelize.query(query);
                // if (EAH[0] != null) {
                if (EAH[0].length > 0) {


                    const All = [...SelfData[0], ...EAH[0]];
                    var EncryptLoginDetails = dataconn.encryptionAES(All);
                    res.status(200).json({ Success: true, Message: 'SelfData Accesable', Data: EncryptLoginDetails });
                } else {
                    var EncryptLoginDetails = dataconn.encryptionAES(SelfData[0]);
                    res.status(200).json({ Success: true, Message: 'SelfData Accesable', Data: EncryptLoginDetails });
                }



            }

        });

    router.route('/EmployeeAccountCodedependant')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            let query = `SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}'  AND "IS_ACTIVE" = true 
                    UNION
                    SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO"
                    WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true`

            let EAH = await connect.sequelize.query(query);
            // if (EAH[0] != null) {
            if (EAH[0].length > 0) {
                var EncryptLoginDetails = dataconn.encryptionAES(EAH[0]);
                res.status(200).json({ Success: true, Message: 'EAH Accesable', Data: EncryptLoginDetails });
            }




        });


    router.post('/AvailableQTY', async (req, res) => {
        const encryptmodel = dataconn.decrypt(req.body.encryptmodel);

        let Querys = `SELECT SUM("ApprovalAvailableQty") AS DPQTY
FROM public."TBL_DP_HOLDING_DATA"
WHERE "EMPID" = '${encryptmodel.EMP}' AND "IS_ACTIVE"= true and "ISIN_CODE"= '${encryptmodel.SearchSecuritycript}'
  AND "TRX_DATE" < CURRENT_DATE - INTERVAL '30 days' and "ApprovalAvailableQty" > 0`
        let RestData = await connect.sequelize.query(Querys)

        if (RestData[0].length > 0) {


            var EncryptLoginDetails = dataconn.encryptionAES(RestData[0]);
            res.status(200).json({ Success: true, Message: 'QTY Accesable', Data: EncryptLoginDetails });
        } else {
            res.status(200).json({ Success: false, Message: '', Data: '' });
        }
    })



    router.route('/GetTradeapproverrecord')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            let query = `SELECT 
  CASE 
    WHEN A."QuantityLot" = 'Quantity' THEN A."EqQuantity"
    WHEN A."QuantityLot" = 'Lot' THEN A."FutOpQuantityLot"
    ELSE '0'
  END AS "ApprovalQuantity",
  A."QuantityLot",
  A.*,
  B."ACC_NAME",
  B."PANNO",
  C."SYMBOL"
FROM public."TBL_IRF_Approval_Data" A
LEFT JOIN public."TBL_RICO_IBEATS_MST" B
  ON A."AccountCode" = B."ACC_CODE"
LEFT JOIN public."TBL_SCRIPT_MST" C
  ON A."ISIN" = C."ISIN_CODE"
WHERE A."EmployeeNumber" = '${encryptmodel.EMP}' and A. "ApprovalStatus"='Approved' and A."TradeAvailableQty" > 0
  AND DATE(A."CREATED_ON") BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
ORDER BY A."CREATED_ON" DESC;`


            let EAH = await connect.sequelize.query(query);

            if (EAH[0].length > 0) {
                var EncryptLoginDetails = dataconn.encryptionAES(EAH[0]);
                res.status(200).json({ Success: true, Message: 'GetTradeapproverrecord', Data: EncryptLoginDetails });
            } else {
                res.status(200).json({ Success: false, Message: '', Data: '' });
            }

        });

    return router;



};

module.exports = routes;