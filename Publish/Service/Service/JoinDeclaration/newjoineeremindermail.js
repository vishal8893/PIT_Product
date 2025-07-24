var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');


    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
        host: configFile.email_smtp_config.host,
        port: configFile.email_smtp_config.port,
        auth: {
            user: configFile.email_smtp_config.auth.user,
            pass: configFile.email_smtp_config.auth.pass
        }
    });

    async function sendReminderEmail(empId, empName, emailId,countResult) {
        try {
            const count = countResult[0].count;
            const subject = `Reminder ${count} | Compliance - Prohibition of Insider Trading – Joining Declaration`;


            const mailBody = `<html>
                            <style>
                             table{ border-collapse: collapse;}
                             tr td { padding: 5px; }
                             tr th { padding: 5px; }
                             body{
                             font-family: calibri;
                             font-size: 15px;
                             color: #09095d;}
                            </style>
                            <body>
                                <p> Dear '${empName}',</p>
                                <p>As informed earlier, <b>“Prohibition of Insider Trading – Joining Declaration”</b> has already been assigned to you. However, as per our records, you are yet to complete the same.</p>
                                <p>Please note, all Employees are expected to complete the <b>“Prohibition of Insider Trading – Joining Declaration”</b> within 60 days of assignment.</p>
                                <p>Please use this link to complete the Form</p>
                                <p><a href="http://localhost:4200/pit/pitcodeaccept">Prohibition of Insider Trading – Joining Declaration</a></p>
                                <p>For any queries or assistance, please contact your respective Business Compliance Group or send your queries on prasad@neweltechnologies.com</p>
                                <p>Note - Do not reply to this email as this is a system-generated mail.</p>
                                <br/>
                                Regards,<br/>
                                Compliance Team
                                <br><br>
                            </body>
                        </html>`;

            await transporter.sendMail({
                from: 'newel.technical@gmail.com',
                to: emailId,
                subject: subject,
                html: mailBody,
            });

            const insertQuery = `
            INSERT INTO "TBL_POB_EMAIL_STATUS" ("EMPLOYEE_ID", "EMAILID", "EMAIL_STATUS", "EMAIL_TYPE", "EMAIL_DATE")
            VALUES ('${empId}', '${emailId}', 'Success', 'Reminder', CURRENT_TIMESTAMP)
        `;

            await connect.sequelize.query(insertQuery, [empId, emailId]);
        } catch (error) {
            console.error('Error sending reminder email:', error);
        }
    }

    async function getCountOfSuccessEmails(empId) {
        const countQuery = `
        SELECT COUNT(*) FROM "TBL_POB_EMAIL_STATUS"
        WHERE "EMAIL_STATUS" = 'Success' AND "EMPLOYEE_ID" = '${empId}'`;
    
        const result = await connect.sequelize.query(countQuery, [empId]);
        console.log('Count Query Result:', result); // Check the query result
        return result[0];
    }
    

    var sendReminderEmails = async function sendReminderEmails() {
        try {

            const query = `
                    SELECT "ID","FIRSTNAME","EMAILID","EMPNO"
                    FROM "TBL_USER_MST"
                    WHERE "EMPJOINDATE" >= '2023-05-25'
                    AND "EMPNO" IN (
                        SELECT "EMPLOYEE_ID"
                        FROM "TBL_POB_EMAIL_STATUS"
                        WHERE "EMAIL_TYPE" = 'Intimation' 
                        AND "EMAIL_STATUS" = 'Success' 
                        AND "IS_TRACKEDEMP" IS NULL
                    )
                    AND "ISACTIVE" = true
                    AND ("DSIGNATED" = true OR "EFSLDESIGNATED" = true)
                    AND "EMPNO" NOT IN (
                        SELECT "EMPLOYEE_ID"
                        FROM "TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO"
                        WHERE "SUBMITTED" = true
                    )
                    AND "EMPNO" NOT IN ('500099') -- Requested by Jahanvi
                    ORDER BY "EMPJOINDATE" DESC`;

            const result = await connect.sequelize.query(query);
            console.log(result);
            const employees = result[0];

            for (const employee of employees) {
                const { EMPNO: empId, FIRSTNAME: empName, EMAILID: emailId } = employee;
                const count = await getCountOfSuccessEmails(empId);
                console.log(count);

                await sendReminderEmail(empId, empName, emailId, count);
                console.log('Reminder email sent for employee:', empName);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

   
// Call the main function to send reminder emails
module.exports.sendReminderEmails = sendReminderEmails;

