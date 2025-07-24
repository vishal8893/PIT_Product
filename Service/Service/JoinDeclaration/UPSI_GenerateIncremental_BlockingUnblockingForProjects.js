var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const newMail = require('../../Common/NewMailer');
const fs = require('fs')
const path = require("path");
const ExcelJS = require('exceljs');
const archiver = require('archiver');
const unzipper = require('unzipper');
const moment = require('moment');
const { promisify } = require('util');


// Create the transporter for sending emails (nodemailer)
let transporter = nodemailer.createTransport({
    host: configFile.email_smtp_config.host,
    port: configFile.email_smtp_config.port,
    auth: {
        user: configFile.email_smtp_config.auth.user,
        pass: configFile.email_smtp_config.auth.pass
    }
});

// Function to call the PostgreSQL function
async function callPostgresFunction(createby, pid) {
    try {

        console.log(createby, pid);

        // Call the function        
        const result = await connect.sequelize.query(`SELECT public.eirf_upsi_generateincremental_blockingunblockingforprojects('${createby}','${pid}')`, {
            type: sequelize.QueryTypes.RAW,
        });

        // const sqlerrmText = result[0][0].sqlerrm_text;
        //   console.log("data", sqlerrmText);

        console.log('Function called successfully');

        const func = await generateBlockingLogic(pid, createby);
        console.log(func);
    } catch (error) {
        console.error('Error occurred:', error.message);

        // Send error via email
        const mailOptions = {
            from: 'newel.technical@gmail.com',
            to: 'rinkal@neweltechnologies.com,prasad@neweltechnologies.com,pankaj@neweltechnologies.com',            
            subject: 'EIRF - Generate Term Ops Blocking/Unblocking Scheduler Failed',
            text: `Error: ${error.message}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        try {
            const insertQuery = `INSERT INTO "TBL_UPSI_TERMOPS_BLOCKINGUNBLOCKING_SCHEDULER_LOG"("SCHEDULER_STATUS","SCHEDULER_DATE","FINAL_STATUS")
            VALUES('Error' ,CURRENT_TIMESTAMP,'Failed');`;
            await connect.sequelize.query(insertQuery);
            console.log('Data saved successfully!');
        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    }
}

async function getUserMaster() {
    const query = `select * from "TBL_USER_MST"`;
    const result = await connect.sequelize.query(query);
    // console.log("user",result[0]);

    return result[0];
}

async function getProjectById(id) {
    const query = `select * from "TBL_UPSI_PROJECT_MST" where "ID" = '${id}'`;
    const result = await connect.sequelize.query(query);
    // console.log("project",result[0]);

    return result[0];
}

async function executeBlockUnblockLogicForProject(id) {
    const query = `select "EMPID","ACTION","BSE_GROUP","ACC_CODE","SYMBOL","EXCHANGE","SERVER_ID" from "TBL_UPSI_BLOCKUNBLOCK_ALLEXCHANGE" where "PROJECT_ID" = '${id}' and "CREATED_ON"::date = CURRENT_DATE `;
    const result = await connect.sequelize.query(query);
    console.log("count", result[0]);

    return result[0];
}

async function getAllVirtualServers() {
    const query = `select * from "TBL_UPSI_VIRTUAL_SERVER_MST" where "IS_ACTIVE" = true`;
    const result = await connect.sequelize.query(query);
    // console.log("server",result[0]);

    return result[0];
}

async function getScripbyId(id) {
    const query = `select * from "TBL_UPSI_PROJECT_SCRIPT_DETAILS" WHERE "PROJECT_ID" = '${id}' and "IS_ACTIVE" = true`;
    const result = await connect.sequelize.query(query);
    // console.log("scrip", result[0]);

    return result[0];
}

async function generateBlockingLogic(projectId, createdBy) {
    try {
        console.log('GenerateBlockingLogic_SP started for projectId:', projectId);

        const _apiStatus = {
            status: 'Failure',
            data: '',
            status_code: 500,
            status_message: 'Failed'
        };
        // const _apiStatus = '';

        let response = '';

        // Fetch data from the database
        const lstUserMaster = await getUserMaster();
        const lstPrg = await getProjectById(projectId);
        // const Tab1 = await executeBlockUnblockLogicForProject(createdBy, projectId);
        const Tab1 = await executeBlockUnblockLogicForProject(projectId);
        const lstServers = await getAllVirtualServers();
        const lstScrip = await getScripbyId(projectId);

        console.log('GenearateBlockingLogic_SP() Tab1 count : ', Tab1.length);

        const uniqueEntries = new Set();

        const lstTermOps = [];

        if (Tab1.length > 0) {
            // Tab1.forEach(ob => {
            //     const key = ob.ACC_CODE + '_' + ob.EMPID + '_' + ob.ACTION; // Creating a unique key using AccCode and EmpNo

            //     // Check if the key has already been encountered
            //     if (!uniqueEntries.has(key)) {
            //         const objTermOps = {
            //             EmpNo: ob.EMPID,
            //             Action: ob.ACTION,
            //             BSEGroup: ob.BSE_GROUP,
            //             AccCode: ob.ACC_CODE,
            //             Symbol: ob.SYMBOL,
            //             Exchange: ob.EXCHANGE,
            //             ServerId: ob.SERVER_ID
            //         };

            //         lstTermOps.push(objTermOps); // Add the object to lstTermOps
            //         uniqueEntries.add(key); // Add the key to the set to mark it as encountered
            //     }
            // });

            // console.log(lstTermOps);

            const groupedData = {}; // Object to group data by ACC_CODE_EMPID

            // Grouping data by ACC_CODE_EMPID
            Tab1.forEach(ob => {
                const key = ob.ACC_CODE + '_' + ob.EMPID + '_' + ob.SYMBOL;

                if (!groupedData[key]) {
                    groupedData[key] = [];
                }

                groupedData[key].push(ob);
            });

            // Array to store final result
            const lstTermOps = [];
            // Set to keep track of unique entries
            const uniqueEntries = new Set();

            // Adding data to lstTermOps and checking for both block and unblock actions
            for (const key in groupedData) {
                const actions = groupedData[key];
                const hasBlock = actions.some(action => action.ACTION.toUpperCase() === 'BLOCK');
                const hasUnblock = actions.some(action => action.ACTION.toUpperCase() === 'UNBLOCK');

                // If both block and unblock actions exist, add only unblock action
                if (hasBlock && hasUnblock) {
                    actions.forEach(action => {
                        const actionType = action.ACTION.toUpperCase();
                        if (actionType === 'UNBLOCK') {
                            const uniqueKey = action.ACC_CODE + '_' + action.EMPID + '_' + action.SYMBOL + '_' + '_unblock'; // Unique key for unblock action
                            if (!uniqueEntries.has(uniqueKey)) {
                                const objTermOps = {
                                    EmpNo: action.EMPID,
                                    Action: action.ACTION,
                                    BSEGroup: action.BSE_GROUP,
                                    AccCode: action.ACC_CODE,
                                    Symbol: action.SYMBOL,
                                    Exchange: action.EXCHANGE,
                                    ServerId: action.SERVER_ID
                                };
                                lstTermOps.push(objTermOps);
                                uniqueEntries.add(uniqueKey);
                            }
                        }
                    });
                } else { // If only one type of action exists, add all actions
                    actions.forEach(action => {
                        const actionType = action.ACTION.toUpperCase();
                        const uniqueKey = action.ACC_CODE + '_' + action.EMPID + '_' + action.SYMBOL + '_' + actionType; // Unique key for each action
                        if (!uniqueEntries.has(uniqueKey)) {
                            const objTermOps = {
                                EmpNo: action.EMPID,
                                Action: action.ACTION,
                                BSEGroup: action.BSE_GROUP,
                                AccCode: action.ACC_CODE,
                                Symbol: action.SYMBOL,
                                Exchange: action.EXCHANGE,
                                ServerId: action.SERVER_ID
                            };
                            lstTermOps.push(objTermOps);
                            uniqueEntries.add(uniqueKey);
                        }
                    });
                }
            }
            // Now lstTermOps contains the desired result with block actions filtered out where unblock actions exist

            const directoryPath = path.join(__dirname, '../UPSI/BlockUnblockProjectFile');
            const zipfile = path.join(directoryPath, `EWM_BlockingUnBlocking_${moment().format("YYYYMMDDHHmmssFFF")}.zip`);

            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            if (fs.existsSync(zipfile)) {
                fs.unlinkSync(zipfile);
            }

            const zip = archiver('zip');
            const output = fs.createWriteStream(zipfile);
            zip.pipe(output);

            let fileCounter = 1;

            for (const ser of lstServers) {
                const lstBlock = lstTermOps.filter(a => a.ServerId === ser.ID && a.Action.toUpperCase() === 'BLOCK');
                const lstUnblock = lstTermOps.filter(a => a.ServerId === ser.ID && a.Action.toUpperCase() === 'UNBLOCK');

                const fileBlock = lstBlock.map(a => `||||${a.AccCode}|||ALL|${a.Exchange}|${a.Symbol}|${a.BSEGroup}||||Y|||Blocked as per mail from EWM ${moment().format("YYYYMMDD")}`);
                const fileUnblock = lstUnblock.map(a => `||||${a.AccCode}|||ALL|${a.Exchange}|${a.Symbol}|${a.BSEGroup}||||N|||Unblocked as per mail from EWM ${moment().format("YYYYMMDD")}`);

                // console.log("lstBlock",fileBlock);
                // console.log("lstUnblock",fileUnblock);
                const fileBlockUnblock = fileBlock.concat(fileUnblock);

                // console.log(fileBlockUnblock);

                let FilePath = '';

                if (fileBlockUnblock != null && fileBlockUnblock.length > 0) {
                    const maxFileRecords = 39998;
                    let skipcnt = 0;
                    let counter = maxFileRecords;

                    const d = fileBlockUnblock.length / maxFileRecords === 0 ? 1 : parseFloat(fileBlockUnblock.length) / maxFileRecords;

                    if (Math.ceil(d) > 0) {
                        for (let i = 0; i < Math.ceil(d); i++) {
                            const FilePath = `${directoryPath}/${lstPrg[0].PROJECT_NAME}_EWM_BlockingUnBlocking_${moment().format("YYYYMMDDHHmmssFFF")}_${ser.SERVER_NAME}.txt`;
                            const streamWriter = fs.createWriteStream(FilePath, { flags: 'a' });
                            streamWriter.write("RMS Blocking/UnBlocking\n");

                            for (const rec of fileBlockUnblock.slice(skipcnt, counter)) {
                                streamWriter.write(rec + '\n');
                            }

                            skipcnt = counter;
                            counter += maxFileRecords;

                            streamWriter.end();

                            await new Promise((resolve) => {
                                streamWriter.on('finish', resolve);
                            });

                            //  zip.file(FilePath, { name: 'Files' });

                            // zip.file(FilePath, { name: `Files/file${fileCounter}.txt` }); // Modify file name
                            const fileName = path.basename(FilePath); // Get only the filename from the FilePath
                            zip.file(FilePath, { name: fileName });

                            fileCounter++;

                            // if (fs.existsSync(zipfile)) {
                            //     fs.unlinkSync(zipfile);
                            // }
                        }
                    }
                }
            }

            await zip.finalize();

            console.log('Zipfile saved:', zipfile);

            // await checkZipContents(zipfile)
            //     .then(() => {
            //         console.log('Extraction completed.');
            //     })
            //     .catch(error => {
            //         console.error('Error extracting ZIP file:', error);
            //     });

            // Send email logic here  pending
            let prjDetails;
            let scripNames;
            if (lstPrg.length > 0) {
                const project = lstPrg[0];
                // console.log("project",project)
                scripNames = lstScrip
                    .filter(sn => sn.PROJECT_ID === project.ID)
                    .map(sn => sn.SCRIPT_NAME);

                const PROJECT_HEAD = project.PROJECT_HEAD;
                // Split the string by '-' to separate empno and firstname
                const parts = PROJECT_HEAD.split('-');
                // The first part (parts[0]) will be the empno
                const prjctHeadempno = parts[0];

                prjDetails = {
                    ProjectId: project.ID,
                    Project_Name: project.PROJECT_NAME,
                    CreatedDate: project.CREATED_ON,
                    ScripNames: scripNames.join(', '), // Join script names with comma
                    ProjectHead: lstUserMaster.find(ph => ph.EMPNO === prjctHeadempno)?.FIRSTNAME || '',
                    SpocName: lstUserMaster.find(sp => sp.EMPNO === project.CREATED_BY)?.FIRSTNAME || ''
                };

                // console.log("prjDetails:", result);
                // return result;
            } else {
                // Handle case when lstPrg is empty
                prjDetails = null; // Or whatever value you want to assign
            }
            console.log("prjDetails:", prjDetails);

            const blockedCnt = lstTermOps
                .filter(a => a.Action.toUpperCase() === 'BLOCK')
                .reduce((acc, cur) => {
                    acc[cur.AccCode] = (acc[cur.AccCode] || 0) + 1;
                    return acc;
                }, {});
            console.log("blockedCnt", blockedCnt);

            const totalBlockedCount = Object.values(blockedCnt).reduce((total, count) => total + count, 0);

            console.log("Total number of blocked accounts:", totalBlockedCount);

            const unblockedCnt = lstTermOps
                .filter(a => a.Action.toUpperCase() === 'UNBLOCK')
                .reduce((acc, cur) => {
                    acc[cur.AccCode] = (acc[cur.AccCode] || 0) + 1;
                    return acc;
                }, {});
            console.log("unblockedCnt", unblockedCnt);

            const totalUnBlockedCount = Object.values(unblockedCnt).reduce((total, count) => total + count, 0);

            console.log("Total number of unblocked accounts:", totalUnBlockedCount);

            const bdy = getEmailBodyData(prjDetails, totalBlockedCount, totalUnBlockedCount);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Script Names');
            worksheet.columns = [
                { header: 'Script Name', key: 'scriptName', width: 40 }
            ];
             scripNames.forEach(scriptName => {
                worksheet.addRow({ scriptName });
            });

            const excelBuffer = await workbook.xlsx.writeBuffer();

            // Send error via email
            const mailOptions = {
                from: 'newel.technical@gmail.com',
                to: 'rinkal@neweltechnologies.com',  
                // ,prasad@neweltechnologies.com,pankaj@neweltechnologies.com              
                subject: 'Blocking/Unblocking file',
                html: bdy,
                attachments: [
                    {
                        filename: 'ScriptNames.xlsx',
                        content: excelBuffer,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    },
                    {
                        filename: 'EWM_BlockingUnBlocking.zip', // Name of the attached file
                        path: zipfile // Path to the file to be attached
                    }
                ]
            };

            try {
                const info = await new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error in file sending:', error);
                            reject(error);
                        } else {
                            console.log('File has been sent successfully');
                            resolve(info);
                        }
                    });
                });

                console.log('Email sent:', info.response);

                response = 'File has been sent successfully';
                _apiStatus.data = response;
                _apiStatus.status = 'Success';
                _apiStatus.status_code = 200;
                _apiStatus.status_message = 'Success';
            } catch (error) {
                console.error('Error in file sending:', error);

                response = 'Error in file sending';
                _apiStatus.data = response;
                _apiStatus.status = 'Failure';
                _apiStatus.status_code = 500;
                _apiStatus.status_message = 'Failed';
            }




        } else {
            response = 'No record to generate file';
            _apiStatus.data = response;
            _apiStatus.status = 'Success';
            _apiStatus.status_code = 200;
            _apiStatus.status_message = 'Success';
        }

        console.log("final status", _apiStatus);
        return _apiStatus;
    } catch (ex) {
        console.error('Error:', ex.message);

        // Log exception
        // SendErrorToText logic here

        const response = `Failed - ${ex.message}`;
        const _apiStatus = {
            status: 'Failure',
            data: response,
            status_code: 500,
            status_message: 'Failed'
        };

        return _apiStatus;
    }
}

const getEmailBodyData = (prjDetails, blockedCnt, unblockedCnt) => {
    const { ProjectId, Project_Name, CreatedDate, ScripNames, ProjectHead, SpocName } = prjDetails;
    const formattedDate = CreatedDate.toLocaleDateString(); // Assuming CreatedDate is a Date object

    const emailBody = `
        <p>Dear Team,</p>
        <p>Please find attached the Blocking/Unblocking file. Please do the needful.</p>
        <p><strong>Details of the Project:</strong></p>
        <ul>
            <li>Project Initiated on: ${formattedDate}</li>
            <li>Project Name: ${Project_Name}</li>            
            <li>Project Head: ${ProjectHead}</li>
            <li>SPOC: ${SpocName}</li>
            <li>No. of accounts being blocked: ${blockedCnt}</li>
            <li>No. of accounts being unblocked: ${unblockedCnt}</li>
        </ul>
        <p>This is an Auto-Generated Mail. Kindly do not reply to this.</p>
        <p>Regards,<br/>EWM team</p>
    `;
    // console.log("emailBody", emailBody);
    // <li>Scrip Name: ${ScripNames}</li>
    return emailBody;
};



// async function checkZipContents(zipfile) {
//     console.log('Checking contents of the ZIP file:', zipfile);
//     const zipStream = fs.createReadStream(zipfile);

//     const unzipStream = unzipper.Parse();

//     unzipStream.on('entry', entry => {
//         console.log('File extracted:', entry.path);
//         entry.autodrain();
//     });

//     zipStream.pipe(unzipStream);

//     return new Promise((resolve, reject) => {
//         unzipStream.on('error', reject);
//         unzipStream.on('close', () => {
//             console.log('All files extracted successfully');
//             resolve();
//         });
//     });
// }


// Call the function
module.exports.callPostgresFunction = callPostgresFunction;
module.exports.generateBlockingLogic = generateBlockingLogic;

