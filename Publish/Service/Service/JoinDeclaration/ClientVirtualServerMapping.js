var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var datamodel = require('../../Data/DataModel');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const newMail = require('../../Common/NewMailer');
const fs = require('fs')
const path = require("path");
const Client = require('ssh2').Client;
const ftp = require('ftp');

async function connectToFTP(host, FTP_USER_ID, FTP_PASSWORD) {
    return new Promise((resolve, reject) => {
        const ftp = new FTPClient();
        ftp.on('ready', () => {
            console.log('Connected to FTP server');
            resolve(ftp);
        });

        ftp.on('error', (err) => {
            console.error('FTP error:', err);
            reject(err);
        });

        ftp.connect({
            host: host,
            user: FTP_USER_ID,
            password: FTP_PASSWORD
        });
    });
}

// Function to extract hostname from FTP URL
function extractHostnameFromFTPURL(url) {
    const match = url.match(/^ftp:\/\/([^\/]+)/);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error('Invalid FTP URL');
    }
}

async function copyFileToLocal(sourceFilePath, destinationFilePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourceFilePath);
        const writeStream = fs.createWriteStream(destinationFilePath);

        readStream.pipe(writeStream);

        writeStream.on('close', () => {
            resolve();
        });

        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}

function readFileData(filePath) {
    try {
        // Read file synchronously
        const fileData = fs.readFileSync(filePath, 'utf-8');
        return fileData;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

async function processFTPData() {
    try {
        // Fetch data from TBL_UPSI_BLOCKINGFILE_LOG
        const logRecords = await connect.sequelize.query(`SELECT * FROM "TBL_UPSI_FTP_DETAILS"`);
        // console.log('Processing record:', logRecords[0]);
        const firstRecord = logRecords[0][0]; // Accessing the first record in the array
        const FTP_PATH = firstRecord.FTP_PATH;
        const FTP_USER_ID = firstRecord.FTP_USER_ID;
        const FTP_PASSWORD = firstRecord.FTP_PASSWORD;
        const localCopyFilePath = path.join(__dirname, '../UPSI/ClientVirtual');

        const ftpHost = extractHostnameFromFTPURL(FTP_PATH);

        console.log('FTP Path:', FTP_PATH);
        console.log('FTP Username:', FTP_USER_ID);
        console.log('FTP Password:', FTP_PASSWORD);
        console.log('FTP host:', FTP_PASSWORD);

        // Get current date in the format MMDDYY
        const currentDate = new Date().toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).replace(/\//g, '')
            .replace(/(\d{2})(\d{2})(\d{2})/, '$2$1$3');
        console.log(currentDate)

        // Connect to FTP server
        const remoteFilePath = 'C:/Users/DELL/Desktop/Schedule/ASPWAIS/log';
        const filesInFolder = fs.readdirSync(remoteFilePath);

        // Filter files with allowed extensions
        const allowedExtensions = ['.xls', '.xlsx', '.csv'];
        const filesToCopy = filesInFolder
            .filter(file => {
                const extension = path.extname(file).toLowerCase();
                return allowedExtensions.includes(extension);
            })
            .slice(0, 2)
            .filter(file => {
                const fileNameWithoutExtension = path.basename(file, path.extname(file));
                const fileNameParts = fileNameWithoutExtension.split('.');
                const fileDate = fileNameParts[0].split('_').pop(); // Extract date from the part before the dot
                console.log(fileDate);
                return fileDate === currentDate;
            })
            .map(file => ({
                source: path.join(remoteFilePath, file),
                destination: path.join(localCopyFilePath, file)
            }));

        // Check if files were found
        if (filesToCopy.length === 0) {
            console.log('Files with current date not found.');

            const selectQuery = `INSERT INTO "TBL_UPSI_CLIENTVS_LOG" ("STATUS", "CREATED_ON") 
            VALUES ('File is not available on ${currentDate}',CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(selectQuery);

            return;
        }

        // Copy files to the local directory
        for (const { source, destination } of filesToCopy) {
            await copyFileToLocal(source, destination);
            console.log(`File ${path.basename(source)} copied successfully.`);
        }

        console.log('All files copied successfully.');

        // Read files from the local path
        const dataFromFiles = [];
        for (const { destination } of filesToCopy) {
            const fileName = path.basename(destination);
            const fileDate = fileName.split('_').pop().split('.')[0]; // Extract date from the filename
            console.log("fd", fileDate);
            if (fileDate === currentDate) {
                const fileData = await readFileData(destination); // Implement this function to read file data
                dataFromFiles.push(fileData);
            }
        }

        // Process and store data in one array with column names "server" and "client"
        const combinedData = [];
        for (const fileData of dataFromFiles) {
            // Assuming each line in the file represents one record with "server" and "client" separated by a comma
            const lines = fileData.split('\n');
            for (const line of lines) {
                const [server, client] = line.split(',');
                // combinedData.push({ server, client });
                combinedData.push({ SERVER_NAME: server.trim(), CLIENT: client.trim(), CREATED_BY: 'scheduler' });
            }
        }

        console.log('Combined data:', combinedData);

        const TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA = datamodel.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA();

        const selectQuery1 = `truncate table "TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA"`;

        connect.sequelize.query(selectQuery1)
            .then(() => {
                TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA.bulkCreate(combinedData)
            })
            .then(result1 => {
                console.log("New rows inserted in TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA Successfully");
            })
            .catch(err => {
                console.error("Error in TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA:", err);
            });

        const selectQuery = `INSERT INTO "TBL_UPSI_CLIENTVS_LOG" ("STATUS", "CREATED_ON") 
            VALUES ('ClientVirtualServerMapping Process Completed',CURRENT_TIMESTAMP)`;

        await connect.sequelize.query(selectQuery);

    } catch (error) {
        console.error('Error:', error);
    }
}

// async function processFTPData() {
//     try {
//         console.log('Starting FTP data processing...');
//         // Fetch data from TBL_UPSI_BLOCKINGFILE_LOG
//         const logRecords = await connect.sequelize.query(`SELECT * FROM "TBL_UPSI_FTP_DETAILS"`);
//         // console.log('Processing record:', logRecords[0]);
//         const firstRecord = logRecords[0][0]; // Accessing the first record in the array
//         const FTP_PATH = firstRecord.FTP_PATH;
//         const FTP_USER_ID = firstRecord.FTP_USER_ID;
//         const FTP_PASSWORD = firstRecord.FTP_PASSWORD;
//         const localCopyFilePath = path.join(__dirname, '../UPSI/ClientVirtual');

//         const ftpHost = extractHostnameFromFTPURL(FTP_PATH);

//         console.log('FTP Path:', FTP_PATH);
//         console.log('FTP Username:', FTP_USER_ID);
//         console.log('FTP Password:', FTP_PASSWORD);
//         console.log('FTP host:', FTP_PASSWORD);

//         // Get current date in the format MMDDYY
//         const currentDate = new Date().toLocaleDateString('en-US', {
//             day: '2-digit',
//             month: '2-digit',
//             year: '2-digit'
//         }).replace(/\//g, '')
//             .replace(/(\d{2})(\d{2})(\d{2})/, '$2$1$3');
//         console.log(currentDate);

//         console.log('Connecting to FTP server...');
//         // Connect to FTP server
//         const ftp = await connectToFTP(ftpHost, FTP_USER_ID, FTP_PASSWORD);

//         console.log('Connected to FTP server successfully.');

//         console.log('Reading files from FTP server...');

//         const remoteFilePath = FTP_PATH;
//         const filesInFolder = fs.readdirSync(remoteFilePath);

//         // Filter files with allowed extensions
//         const allowedExtensions = ['.xls', '.xlsx', '.csv'];
//         const filesToCopy = filesInFolder
//             .filter(file => {
//                 const extension = path.extname(file).toLowerCase();
//                 return allowedExtensions.includes(extension);
//             })
//             .slice(0, 2)
//             .filter(file => {
//                 const fileNameWithoutExtension = path.basename(file, path.extname(file));
//                 const fileNameParts = fileNameWithoutExtension.split('.');
//                 const fileDate = fileNameParts[0].split('_').pop(); // Extract date from the part before the dot
//                 console.log(fileDate);
//                 return fileDate === currentDate;
//             })
//             .map(file => ({
//                 source: path.join(remoteFilePath, file),
//                 destination: path.join(localCopyFilePath, file)
//             }));

//         // Check if files were found
//         if (filesToCopy.length === 0) {
//             console.log('Files with current date not found.');
//             const selectQuery = `INSERT INTO "TBL_UPSI_CLIENTVS_LOG" ("STATUS", "CREATED_ON") 
//             VALUES ('File is not available on ${currentDate}',CURRENT_TIMESTAMP)`;

//             await connect.sequelize.query(selectQuery);
//             return;
//         }

//         // Copy files to the local directory
//         for (const { source, destination } of filesToCopy) {
//             await copyFileToLocal(source, destination);
//             console.log(`File ${path.basename(source)} copied successfully.`);
//         }

//         console.log('All files copied successfully.');

//         console.log('Reading files from the local directory...');

//         // Read files from the local path
//         const dataFromFiles = [];
//         for (const { destination } of filesToCopy) {
//             const fileName = path.basename(destination);
//             const fileDate = fileName.split('_').pop().split('.')[0]; // Extract date from the filename
//             console.log("fd", fileDate);
//             if (fileDate === currentDate) {
//                 const fileData = await readFileData(destination); // Implement this function to read file data
//                 dataFromFiles.push(fileData);
//             }
//         }

//         // Process and store data in one array with column names "server" and "client"
//         console.log('Processing data from files...');
//         const combinedData = [];
//         for (const fileData of dataFromFiles) {
//             // Assuming each line in the file represents one record with "server" and "client" separated by a comma
//             const lines = fileData.split('\n');
//             for (const line of lines) {
//                 const [server, client] = line.split(',');
//                 // combinedData.push({ server, client });
//                 combinedData.push({ SERVER_NAME: server.trim(), CLIENT: client.trim(), CREATED_BY: 'scheduler' });
//             }
//         }

//         console.log('Combined data:', combinedData);

//         const TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA = datamodel.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA();

//         const selectQuery1 = `truncate table "TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA"`;

//         connect.sequelize.query(selectQuery1)
//             .then(() => {
//                 TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA.bulkCreate(combinedData)
//             })
//             .then(result1 => {
//                 console.log("New rows inserted in TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA Successfully");
//             })
//             .catch(err => {
//                 console.error("Error in TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA:", err);
//             });

//         console.log('FTP data processing completed.');

//         const selectQuery = `INSERT INTO "TBL_UPSI_CLIENTVS_LOG" ("STATUS", "CREATED_ON") 
//             VALUES ('ClientVirtualServerMapping Process Completed',CURRENT_TIMESTAMP)`;

//         await connect.sequelize.query(selectQuery);

//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

async function GetExistingClientServerMapping() {
    const queryResult = `select * from "TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING" where "IS_ACTIVE" = true`;
    const selectQuery = await connect.sequelize.query(queryResult);
    console.log("array", selectQuery[0])
    return selectQuery[0];
}

async function compareMappings(mapping1, mapping2) {
    return mapping1.AccountCode === mapping2.AccountCode && mapping1.ServerId === mapping2.ServerId;
}

async function deactivateMappings(objDeActivatemapping, session) {
    for (let i = 0; i < objDeActivatemapping.length; i++) {
        const obj = objDeActivatemapping[i];

        const transaction = await session.beginTransaction();

        try {
            // Update IsActive property to false
            obj.IsActive = false;

            // Update the object in the database
            await session.update(obj, { where: { Id: obj.Id } });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            // Rollback the transaction if an error occurs
            await transaction.rollback();
            console.error("Error occurred while deactivating mappings:", error);
        }
    }
}

async function UploadUPSICLIENTVIRTUALSERVERMAPPING() {

    const objmapping = datamodel.TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING();

    const query1 = `select * from "TBL_IBEATS_MST"`;
    const result1 = await connect.sequelize.query(query1);
    const objibeats = result1[0];

    const query2 = `select * from "TBL_UPSI_VIRTUAL_SERVER_MST"`;
    const result2 = await connect.sequelize.query(query2);
    const objserver = result2[0];

    const query3 = `select * from "TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA"`;
    const result3 = await connect.sequelize.query(query3);
    const objdata = result2[0];

    const objExtMapAll = await GetExistingClientServerMapping();

    // Transform objExtMapAll to objExistingmapping
    const objExistingmapping = objExtMapAll.map(ext => ({
        AccountCode: ext.ACCOUNT_CODE.trim(),
        EmployeeId: ext.EMPLOYEE_ID.trim(),
        ServerName: ext.SERVER_NAME.trim(),
        ServerId: ext.SERVER_ID,
        IsActive: ext.IS_ACTIVE
    }));

    console.log("objExistingmapping", objExistingmapping)

    if (objdata.length > 0) {
        objmapping = objdata.map(f => {
            const b = objibeats.find(beat => beat.AccCode.trim().toUpperCase() === f.CLIENT.trim().toUpperCase());
            const s = objserver.find(server => server.SERVER_NAME.trim().toUpperCase() === f.SERVER_NAME.trim().toUpperCase());

            if (b && s) {
                return {
                    AccountCode: f.CLIENT.trim(),
                    ServerName: f.SERVER_NAME.trim(),
                    ServerId: s.ID,
                    EmployeeId: b.EmpId.trim(),
                    IsActive: true
                };
            }
        }).filter(Boolean); // Remove undefined elements
    }

    // Calculate objmappingipload
    objmappingipload = objmapping.filter(mapping => !objExistingmapping.some(existing => compareMappings(mapping, existing)));

    // Calculate objDeActMap
    objDeActMap = objExistingmapping.filter(existing => !objmapping.some(mapping => compareMappings(existing, mapping)));

    // Calculate objDeActivatemapping
    objDeActivatemapping = objExtMapAll.filter(a => {
        return objDeActMap.some(ext => ext.AccountCode === a.AccountCode && ext.ServerId === a.ServerId);
    }).map(a => ({
        AccountCode: a.AccountCode,
        CRE_DATE: a.CRE_DATE,
        CRE_USER: a.CRE_USER,
        EmployeeId: a.EmployeeId,
        Id: a.Id,
        IsActive: a.IsActive,
        ISIN: a.ISIN,
        ServerId: a.ServerId,
        ServerName: a.ServerName,
        Status: a.Status,
        UPD_DATE: new Date(),
        UPD_USER: "1809"
    }));

    const batchSize = 20;

    for (let i = 0; i < objmappingipload.length; i++) {
        const obj = objmappingipload[i];

        const newObj = {
            AccountCode: obj.AccountCode,
            EmployeeId: obj.EmployeeId,
            ServerId: obj.ServerId,
            ServerName: obj.ServerName,
            IsActive: obj.IsActive,
            Status: "New",
            CRE_USER: "1809",
            CRE_DATE: new Date()
        };

        await session.save(newObj);

        if ((i + 1) % batchSize === 0) {
            // Flush a batch of inserts and release memory
            await session.flush();
            await session.clear();
        }
    }

    await deactivateMappings(objDeActivatemapping, session);

    return objmapping.length;



}

// Call the main function
// module.exports.processFTPData = processFTPData;
module.exports.UploadUPSICLIENTVIRTUALSERVERMAPPING = UploadUPSICLIENTVIRTUALSERVERMAPPING;


