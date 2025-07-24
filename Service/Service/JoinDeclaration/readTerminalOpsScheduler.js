var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");
const { log } = require('console');
const Client = require('ssh2').Client;


async function copyFileFromRemoteServer(remoteHost, remoteUser, remotePassword, remoteFilePath, localFilePath) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                const readStream = sftp.createReadStream(remoteFilePath);
                const writeStream = fs.createWriteStream(localFilePath);

                readStream.pipe(writeStream);

                writeStream.on('close', () => {
                    conn.end();
                    resolve();
                });

                writeStream.on('error', (error) => {
                    conn.end();
                    reject(error);
                });
            });
        });

        conn.on('error', (error) => {
            reject(error);
        });

        conn.connect({
            host: remoteHost,
            username: remoteUser,
            password: remotePassword
        });
    });
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

async function processData() {
    try {
        // Fetch data from TBL_UPSI_BLOCKINGFILE_LOG
        const logRecords = await connect.sequelize.query(`SELECT * FROM "TBL_UPSI_BLOCKINGFILE_LOG" WHERE "CREATED_ON"::DATE = CURRENT_DATE - INTERVAL '1 day'`);
        const serverInformationArray = [];

        // Loop through the log records
        for (const logRecord of logRecords[0]) {
            console.log('Processing record:', logRecord);
            const Id = logRecord.SERVER_ID;
            console.log("Id", Id);
            const virtualServerRecord = await connect.sequelize.query(`SELECT * FROM "TBL_UPSI_VIRTUAL_SERVER_MST" WHERE "ID" = '${Id}' AND "PATH_TYPE" = 'SharePath' AND "IS_ACTIVE" = true`);

            if (virtualServerRecord[0].length > 0) {
                const firstRecord = virtualServerRecord[0][0];
                console.log('File copied to local path:', firstRecord);
                const Path = firstRecord.PATH;
                console.log('File copied to local path:', Path);
                const logFolderPath = Path + '/log/';
                const remoteHost = firstRecord.SERVER_NAME;
                const remoteUser = firstRecord.USERID;
                const remotePassword = firstRecord.PASSWORD;
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - 1);
                const dd = String(currentDate.getDate()).padStart(2, '0');
                const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
                const yy = String(currentDate.getFullYear()).slice(-2);
                const logFileNamePattern = `nest_file_uploader_${dd}-${mm}-${yy}_LOG.txt`;

                const remoteFilePath = logFolderPath + logFileNamePattern;
                const localCopyFilePath = path.join(__dirname, '../UPSI/TerminalLogs', logFileNamePattern);

                // Your logic to connect to the remote server and copy the file locally
                await copyFileFromRemoteServer(remoteHost, remoteUser, remotePassword, remoteFilePath, localCopyFilePath)
                .then(() => {
                    console.log('File copied successfully.');
                })
                    .catch((error) => {
                        console.error('Error copying file:', error);
                    });
                // copyFileToLocal(remoteFilePath, localCopyFilePath)
                //     .then(() => {
                //         console.log('File copied successfully.');
                //     })
                //     .catch((error) => {
                //         console.error('Error copying file:', error);
                //     });

                console.log('Processing record:', remoteFilePath);

                // Read the contents of the copied file
                const copiedFileContent = fs.readFileSync(localCopyFilePath, 'utf8');

                const directoryPath = logRecord.DIRECTORY_PATH || '';
                const fileName = logRecord.FILENAME || '';

                // Construct the full file path
                const fullPath = path.join(directoryPath, fileName);
                // console.log("fullPath", fullPath);

                // Check if the constructed file path exists in copiedFileContent
                if (copiedFileContent.includes(fullPath)) {
                    console.log(`File path ${fullPath} found in copied content.`);

                    // Find the line after the fullPath
                    const lines = copiedFileContent.split('\n');
                    const index = lines.findIndex(line => line.includes(fullPath));

                    if (index !== -1 && index < lines.length - 1) {
                        // Get the line after fullPath
                        const nextLine = lines[index + 1];

                        // Extract the number before "rows uploaded"
                        const rowsUploadedMatch = nextLine.match(/(\d+)\s+rows\s+uploaded/);
                        const numberBeforeRowsUploaded = rowsUploadedMatch ? rowsUploadedMatch[1] : null;

                        if (numberBeforeRowsUploaded !== null) {
                            console.log(`Number before 'rows uploaded': ${numberBeforeRowsUploaded}`);

                            // Extract server name from remoteHost
                            const serverName = remoteHost;

                            // Extract total count from logRecord
                            const totalCount = logRecord.TOTAL_RECORDS; // Replace with the actual property from logRecord

                            // Create an object with the information
                            const serverInfo = {
                                serverName: serverName,
                                totalCount: totalCount,
                                uploadedCount: numberBeforeRowsUploaded
                            };

                            // Log the server information
                            console.log('Server Information:', serverInfo);

                            // Add the server information to an array or perform further processing as needed
                            serverInformationArray.push(serverInfo);
                            // Log the server information
                            console.log('serverInformationArray:', serverInfo);
                        } else {
                            console.log(`Number before 'rows uploaded' not found in the next line.`);
                        }
                    } else {
                        console.log(`File path ${fullPath} not found in copied content.`);
                    }
                } else {
                    console.log(`File path ${fullPath} not found in copied content.`);
                }

            } else {
                console.log('Virtual server record not found for log record:', logRecord);
            }
        }

        await sendErrorNotification(serverInformationArray);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to send email 
async function sendErrorNotification(data) {
    try {
        // Create the transporter for sending error notifications
        let transporter = nodemailer.createTransport({
            host: configFile.email_smtp_config.host,
            port: configFile.email_smtp_config.port,
            auth: {
                user: configFile.email_smtp_config.auth.user,
                pass: configFile.email_smtp_config.auth.pass
            }
        });


        // Create HTML body with a table
        let errorBody = `<html>
                            <body>
                                <p>Dear Team,</p>
                                <p>Please find below the status report:</p>
                                <table border="1" style="border-collapse: collapse;">
                                    <tr>
                                        <th style="padding: 10px;">Server Name</th>
                                        <th style="padding: 10px;">Total Count</th>
                                        <th style="padding: 10px;">Uploaded Count</th>
                                    </tr>`;

        // Populate the table rows with data
        data.forEach(serverInfo => {
            errorBody += `<tr>            
                            <td style="padding: 10px;">${serverInfo.serverName}</td>
                            <td style="padding: 10px;">${serverInfo.totalCount}</td>
                            <td style="padding: 10px;">${serverInfo.uploadedCount}</td>
                          </tr>`;
        });

        // Close the HTML body
        errorBody += `</table></body></html>`;


        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'rinkal@neweltechnologies.com,aniket.yadav@neweltechnologies.com',
            subject: 'SDD - Account Block/Unblock File Upload Status',
            html: errorBody,
        };

        // Send the error notification email
        const info = await transporter.sendMail(errorOptions);
        console.log('Mail sent:', info.response);
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}


// Call the main function
module.exports.processData = processData;



