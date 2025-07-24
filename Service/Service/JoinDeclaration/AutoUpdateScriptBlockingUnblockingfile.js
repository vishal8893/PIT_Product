var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");


    // Function to query data and create attachment file
    var AutoUpdateScriptBlockingUnblockingfile = async function AutoUpdateScriptBlockingUnblockingfile() {
        try {
            const result = await connect.sequelize.query('SELECT eirf_auto_update_scrip_blockingunblockin_file()', {
                type: sequelize.QueryTypes.RAW,
              });
              console.log("data", result);
              const thirdResult = result[0][0].eirf_auto_update_scrip_blockingunblockin_file.split(',')[2];
              console.log("Third Result:", thirdResult);
              await sendEmailWithAttachment(thirdResult);
        } catch (error) {
            console.error('Error creating attachment file:', error);
            // Send error notification via email
            await sendErrorNotification('Error creating attachment file', error);
            // return null;
        }
    }

    // Function to send email with the attachment
    async function sendEmailWithAttachment(thirdResult) {
        try {
            // Create the transporter for sending emails (nodemailer)
            let transporter = nodemailer.createTransport({
                host: configFile.email_smtp_config.host,
                port: configFile.email_smtp_config.port,
                auth: {
                    user: configFile.email_smtp_config.auth.user,
                    pass: configFile.email_smtp_config.auth.pass
                }
            });

            const mailBody = `<html>
                        <body>
                            <table>
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>
                            Blocking count of EIRF_Auto_Update_SCRIP_BlockingUnblockin_file is : '${thirdResult}'
                            </td>
                            </tr>                                    
                            </table>
                        </body>
                       </html>`;

            // Define your email content
            const mailOptions = {
                from: 'newel.technical@gmail.com',
                to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com',
                subject: `EIRF_Auto_Update_SCRIP_BlockingUnblockin_file Job Status`,
                html: mailBody,
            };


            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);

            try {
                const insertQuery = `INSERT INTO "TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") 
                                   VALUES ('EIRF_Auto_Update_SCRIP_BlockingUnblockin_file', CURRENT_DATE,CURRENT_TIMESTAMP);`;
                await connect.sequelize.query(insertQuery);
                console.log('Data saved successfully!');
            } catch (queryError) {
                console.error('Error saving data:', queryError);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Function to send email with the error
    async function sendErrorNotification(errorMessage, error) {
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


            const errorBody = `<html>
                            <body>
                            <table>
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>
                            An error occurred:
                            // <br> <br>
                            </td>
                            </tr>  
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>    
                            // ${errorMessage}   
                            // <br><br>
                            ${error}
                            </td>
                            </tr>
                            </table>                                    
                          </body>
                         </html>`;

            const errorOptions = {
                from: 'newel.technical@gmail.com',
                to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com,rinkal@neweltechnologies.com',
                subject: 'EIRF_Auto_Update_SCRIP_BlockingUnblockin_file Job Failed',
                html: errorBody,
            };

            // Send the error notification email
            const info = await transporter.sendMail(errorOptions);
            console.log('Error notification sent:', info.response);

            try {
                const insertQuery = `INSERT INTO "TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") 
            VALUES ('EIRF_Auto_Update_SCRIP_BlockingUnblockin_file failed',CURRENT_DATE,CURRENT_TIMESTAMP)`;

                await connect.sequelize.query(insertQuery, [error]);
                console.log('Data saved successfully!');

            } catch (queryError) {
                console.error('Error saving data:', queryError);
            }
        } catch (notificationError) {
            console.error('Error sending error notification:', notificationError);
        }
    }

// Call the main function
module.exports.AutoUpdateScriptBlockingUnblockingfile = AutoUpdateScriptBlockingUnblockingfile;



