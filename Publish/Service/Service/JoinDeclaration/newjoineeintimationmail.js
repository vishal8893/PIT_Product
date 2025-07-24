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


    // Async function to send emails
    async function sendEmail(to, subject, html) {
        try {
            const info = await transporter.sendMail({
                // from: 'Notification.Centre@Lightstorm.in',
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

    // Your main function to fetch data and send emails,2023-05-25
    var sendIntimationEmails = async function sendIntimationEmails() {
        try {
            const query = `
                SELECT "ID", "FIRSTNAME", "EMAILID", "EMPNO"
                FROM "TBL_USER_MST"
                WHERE "EMPJOINDATE" >= '2023-05-25'
                AND "EMPNO" NOT IN (
                    SELECT "EMPLOYEE_ID"
                    FROM "TBL_POB_EMAIL_STATUS"
                    WHERE "EMAIL_TYPE" = 'Intimation' AND "EMAIL_STATUS" = 'Success'
                )
                AND "ISACTIVE" = true
                AND ("EMAILID" <> '' OR "EMAILID" IS NULL)
                AND ("DSIGNATED" = true OR "EFSLDESIGNATED" = true)
                AND "EMPNO" NOT IN ('500099')
                ORDER BY "EMPJOINDATE" DESC
                `;

            const result = await connect.sequelize.query(query);
            console.log(result);
            const employees = result[0];


            for (const employee of employees) {
                const { EMPNO: EmpId, FIRSTNAME: EmpName, EMAILID: EmailId } = employee;

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
                                              Newel gives high importance to compliance and hence it has adopted a Code of Conduct (Code) in line with SEBI(Prohibition of Insider Trading)Regulations, 2015 for dealing in securities. Every Employee of Newel group has to adhere to the Code/Policies in place at all times while dealing in securities.
                                            </p>
                                            <p>
                                              In Newel, we have following codes and policies to be adhered to, while dealing in securities:
                                            </p>
                                            <ul>
                                                <li>Code For Prohibition Of Insider Trading In The Securities Of Newel Financial Services Limited (NFSL Code)</li>
                                                <li>Newel Code for Trading in other Listed Securities (Non NFSL Code)</li>
                                                <li>FAQs on Both Codes</li>
                                            </ul>
                                            <p>
                                              You may refer to these codes and FAQs at Newel Ping under Policies Section for detailed Codes.
                                            </p>
                                            <p>
                                              As per the codes, you are required to provide the Self, Dependent trading account details and Holding statements at the time of Joining.
                                            </p>
                                            <p>
                                              Please click on the below link to fill the details:
                                            </p>
                                            <p>
                                                <a href="http://localhost:4200/pit/pitcodeaccept">Prohibition of Insider Trading – Joining Declaration</a>
                                            </p>
                                            <p>On Clicking the Link, follow the steps below:</p>
                                            <ul>
                                                <li>On clicking the link, you will be directed to the “Ping I Agree” and “Undertaking” Page. Read the rules carefully and click on “I Agree”. </li>
                                                <li>After clicking on the “I Agree” button, you will be redirected to the self and Dependent details page, where you need to fill the required details.</li>
                                                <li>Once you fill the Dependent details, you need to submit the holding statements for Self and Dependent accounts.</li>
                                            </ul>
                                            <p>For any queries, please contact your respective Business Compliance Group or write to the prasad@neweltechnologies.com. </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br/>
                                            Regards,<br/>
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                await sendEmail(EmailId, 'Compliance - Prohibition of Insider Trading – Joining Declaration', mailBody);

                const insertQuery = `INSERT INTO "TBL_POB_EMAIL_STATUS" ("EMPLOYEE_ID", "EMAILID", "EMAIL_STATUS", "EMAIL_TYPE", "EMAIL_DATE")
                VALUES ('${EmpId}','${EmailId}', 'Success', 'Intimation', CURRENT_TIMESTAMP)`;

                await connect.sequelize.query(insertQuery, [EmpId, EmailId]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

// Call the main function
module.exports.sendIntimationEmails = sendIntimationEmails;
