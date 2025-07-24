var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");


// Function to query data and create attachment file
var SCOIQuarterlyMailSend = async function SCOIQuarterlyMailSend() {
    try {
        const query = `SELECT "ID","EMPNO","EMAILID","FIRSTNAME" FROM "TBL_USER_MST" WHERE "ISACTIVE" = true`;

        const result = await connect.sequelize.query(query);
        console.log(result);
        const employees = result[0];


        for (const employee of employees) {
            const { ID: EmpId, EMPNO: EmpNO, FIRSTNAME: EmpName, EMAILID: EmailId } = employee;

            const mailBody = `<html>
                                        <style>
                                            table { border-collapse: collapse; }
                                            tr td { padding: 5px; }
                                            tr th { padding: 5px; }
                                            body {
                                            font-family: calibri;
                                            font-size: 15px;
                                            color: #09095d;
                                            }
                                        </style>
                                        <body>
                                            <p> Dear '${EmpName}',</p>
                                            <p>Welcome to Newel</p>                                            
                                            <p>
                                              Please click on the below link to fill the details:
                                            </p>
                                            <p>
                                                <a href="http://localhost:4200/pit/scoi">Prohibition of Insider Trading – SCOI</a>
                                            </p>                                            
                                            <p>For any queries, please contact your respective Business Compliance Group or write to the prasad@neweltechnologies.com. </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br/>
                                            Regards,<br/>
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
            await sendEmail(EmailId, 'EIRF - Substantial Interest Declaration Form', mailBody);

            const updateQuery1 = `UPDATE "TBL_SCOI_EMAIL_SEND_STATUS" SET "IS_ACTIVE" = false WHERE "EMPNO" = '${EmpNO}'`;

            await connect.sequelize.query(updateQuery1, [EmpNO]);

            const insertQuery = `INSERT INTO "TBL_SCOI_EMAIL_SEND_STATUS" ("EMPLOYEE_ID", "EMPNO", "EMAILID", "EMAIL_STATUS", "EMAIL_TYPE", "EMAIL_DATE", "IS_ACTIVE", "CREATED_ON")
                VALUES ('${EmpId}','${EmpNO}','${EmailId}', 'Success', 'Intimation', CURRENT_TIMESTAMP, true, CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(insertQuery, [EmpId, EmpNO, EmailId]);

            const updateQuery = `UPDATE "TBL_SCOI_ACCEPT_LOG" SET "IS_ACCEPT" = false WHERE "EMPLOYEE_ID" = '${EmpNO}'`;

            await connect.sequelize.query(updateQuery, [EmpNO]);
        }
    }
    catch (error) {
        console.error('Error creating attachment file:', error);
        // Send error notification via email
        await sendErrorNotification('Error creating attachment file', error);
    }
}

// Create a nodemailer transporter
let transporter = nodemailer.createTransport({
    host: configFile.email_smtp_config.host,
    port: configFile.email_smtp_config.port,
    auth: {
        user: configFile.email_smtp_config.auth.user,
        pass: configFile.email_smtp_config.auth.pass
    }
});

// Async function to send emails
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: 'newel.technical@gmail.com',
            to,
            subject,
            html,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Email error:', error);
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
                            </td>
                            </tr>  
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>                                
                            ${error}
                            </td>
                            </tr>
                            </table>                                    
                          </body>
                         </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - SCOI intimation mail sending failed',
            html: errorBody,
        };

        // Send the error notification email
        const info = await transporter.sendMail(errorOptions);
        console.log('Error notification sent:', info.response);
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}


// Call the main function
module.exports.SCOIQuarterlyMailSend = SCOIQuarterlyMailSend;



