var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");
const { stringify } = require('csv-stringify');


// Function to query data and create attachment file
async function createAttachmentFile() {
    try {
        const today = new Date();

        // Extract the components of the date (year, month, day)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(today.getDate()).padStart(2, '0');

        // Form a string in 'YYYY-MM-DD' format ${year}-${month}-${day}
        const formattedDate = `${day}-${month}-${year}`;
        console.log("formattedDate", formattedDate);

        const query = `SELECT * FROM "TBL_USER_MST" WHERE "ISACTIVE" = false;`;

        const result = await connect.sequelize.query(query);
        console.log("result", result);
        const employees = result[0];
        console.log("employees", employees);

        const resultArr = [];

        for (const employee of employees) {
            const { EMPNO: empId, PANCARDNO: pan } = employee;

            const query1 = `SELECT "E"."EMPLOYEE_ID","E"."ENTITY_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                WHERE "E"."EMPLOYEE_ID" = '${empId}' AND "E"."IS_ACTIVE" = true AND "A"."IS_ACTIVE" = true;`;
            const result1 = await connect.sequelize.query(query1);
            console.log("result1", result1[0]);

            if (result1[0].length > 0) {
                const transformedResult1 = result1[0].map(row => ({
                    EMPNO: row.EMPLOYEE_ID,
                    ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                    ACC_NAME: row.ENTITY_NAME,
                    PAN: pan
                }));
                console.log("transformedResult1", transformedResult1);
                resultArr.push(transformedResult1);
            } else {
                const query11 = `SELECT "E"."EMPLOYEE_ID","E"."ENTITY_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                WHERE "E"."EMPLOYEE_ID" = '${empId}' AND "E"."IS_ACTIVE" = true AND "A"."IS_ACTIVE" = true;`;

                const result11 = await connect.sequelize.query(query11);
                console.log("result11", result11[0]);

                if (result11[0].length > 0) {
                    const transformedResult11 = result11[0].map(row => ({
                        EMPNO: row.EMPLOYEE_ID,
                        ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                        ACC_NAME: row.ENTITY_NAME,
                        PAN: pan
                    }));
                    console.log("transformedResult11", transformedResult11);
                    resultArr.push(transformedResult11);
                } else {

                }
            }

            const query2 = `SELECT "E"."EMPLOYEE_ID","E"."BROKER_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                WHERE "E"."EMPLOYEE_ID" = '${empId}' AND "E"."IS_ACTIVE" = true AND "A"."IS_ACTIVE" = true;`;
            const result2 = await connect.sequelize.query(query2);
            console.log("result2", result2[0]);

            if (result2[0].length > 0) {
                const transformedResult2 = result2[0].map(row => ({
                    EMPNO: row.EMPLOYEE_ID,
                    ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                    ACC_NAME: row.BROKER_NAME,
                    PAN: pan
                }));
                console.log("transformedResult2", transformedResult2);
                resultArr.push(transformedResult2);
            } else {
                const query22 = `SELECT "E"."EMPLOYEE_ID","E"."BROKER_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                WHERE "E"."EMPLOYEE_ID" = '12345' AND "E"."IS_ACTIVE" = true AND "A"."IS_ACTIVE" = true;`;
                const result22 = await connect.sequelize.query(query22);
                console.log("result22", result22[0]);

                if (result22[0].length > 0) {
                    const transformedResult22 = result22[0].map(row => ({
                        EMPNO: row.EMPLOYEE_ID,
                        ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                        ACC_NAME: row.BROKER_NAME,
                        PAN: pan
                    }));
                    console.log("transformedResult22", transformedResult22);
                    resultArr.push(transformedResult22);
                } else {

                }
            }

            const query3 = `SELECT "R"."PAN_NO","E"."EMPLOYEE_ID","E"."ENTITY_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" 
                ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                INNER JOIN "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "R" 
                ON "R"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                WHERE "E"."EMPLOYEE_ID" = '${empId}' 
                      AND "E"."IS_ACTIVE" = true 
                      AND "A"."IS_ACTIVE" = true 
                      AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                      AND "R"."EMPLOYEE_ID" = "A"."EMPLOYEE_ID"
                      AND "R"."IS_ACTIVE" = true
                      AND "R"."ID" = "E"."REL_INFO_ID";`;
            const result3 = await connect.sequelize.query(query3);
            console.log("result3", result3[0]);

            if (result3[0].length > 0) {
                const transformedResult3 = result3[0].map(row => ({
                    EMPNO: row.EMPLOYEE_ID,
                    ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                    ACC_NAME: row.ENTITY_NAME,
                    PAN: row.PAN_NO
                }));
                console.log("transformedResult3", transformedResult3);
                resultArr.push(transformedResult3);
            } else {
                const query33 = `SELECT "R"."PAN_NO","E"."EMPLOYEE_ID","E"."ENTITY_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" 
                ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                INNER JOIN "TBL_JD_EMPLOYEE_RELATIVE_INFO" AS "R" 
                ON "R"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                WHERE "E"."EMPLOYEE_ID" = '${empId}' 
                AND "E"."IS_ACTIVE" = true 
                AND "A"."IS_ACTIVE" = true 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                AND "R"."EMPLOYEE_ID" = "A"."EMPLOYEE_ID"
                AND "R"."IS_ACTIVE" = true
                AND "R"."ID" = "E"."REL_INFO_ID";`;
                const result33 = await connect.sequelize.query(query33);
                console.log("result33", result33[0]);

                if (result33[0].length > 0) {
                    const transformedResult33 = result33[0].map(row => ({
                        EMPNO: row.EMPLOYEE_ID,
                        ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                        ACC_NAME: row.ENTITY_NAME,
                        PAN: row.PAN_NO
                    }));
                    console.log("transformedResult33", transformedResult33);
                    resultArr.push(transformedResult33);
                } else {

                }
            }

            const query4 = `SELECT "R"."PAN_NO","E"."EMPLOYEE_ID","E"."BROKER_NAME","E"."TRADING_ACCOUNT_NUMBER"			
            FROM "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" AS "E"	
            INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" 
            ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
            INNER JOIN "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "R" 
            ON "R"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
            WHERE "E"."EMPLOYEE_ID" = '${empId}' 
                  AND "E"."IS_ACTIVE" = true 
                  AND "A"."IS_ACTIVE" = true 
                  AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                  AND "R"."EMPLOYEE_ID" = "A"."EMPLOYEE_ID"
                  AND "R"."IS_ACTIVE" = true
                  AND "R"."ID" = "E"."REL_INFO_ID";`;
            const result4 = await connect.sequelize.query(query4);
            console.log("result4", result4[0]);

            if (result4[0].length > 0) {
                const transformedResult4 = result4[0].map(row => ({
                    EMPNO: row.EMPLOYEE_ID,
                    ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                    ACC_NAME: row.BROKER_NAME,
                    PAN: row.PAN_NO
                }));
                console.log("transformedResult4", transformedResult4);
                resultArr.push(transformedResult4);
            } else {
                const query44 = `SELECT "R"."PAN_NO","E"."EMPLOYEE_ID","E"."BROKER_NAME","E"."TRADING_ACCOUNT_NUMBER"			
                FROM "TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO" AS "E"	
                INNER JOIN "Tbl_Employee_AccountCode_Mapping" AS "A" 
                ON "A"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                INNER JOIN "TBL_JD_EMPLOYEE_RELATIVE_INFO" AS "R" 
                ON "R"."EMPLOYEE_ID" = "E"."EMPLOYEE_ID" 
                WHERE "E"."EMPLOYEE_ID" = '${empId}' 
                AND "E"."IS_ACTIVE" = true 
                AND "A"."IS_ACTIVE" = true 
                AND "A"."AccountCode" = "E"."TRADING_ACCOUNT_NUMBER"
                AND "R"."EMPLOYEE_ID" = "A"."EMPLOYEE_ID"
                AND "R"."IS_ACTIVE" = true
                AND "R"."ID" = "E"."REL_INFO_ID";`;
                const result44 = await connect.sequelize.query(query44);
                console.log("result44", result44[0]);

                if (result44[0].length > 0) {
                    const transformedResult44 = result44[0].map(row => ({
                        EMPNO: row.EMPLOYEE_ID,
                        ACC_CODE: row.TRADING_ACCOUNT_NUMBER,
                        ACC_NAME: row.BROKER_NAME,
                        PAN: row.PAN_NO
                    }));
                    console.log("transformedResult44", transformedResult44);
                    resultArr.push(transformedResult44);
                } else {

                }
            }
        }

        console.log("resultArr", resultArr);

        if (resultArr.length > 0) {

            const fileName = `EmployeeTagging.csv`;
            const filePath = path.resolve(__dirname, '../sendSchedulerFiles', fileName);

            // Flatten the resultArr to a single array of objects
            const flattenedData = resultArr.flat();

            const columnsSet = new Set();
            flattenedData.forEach(obj => {
                Object.keys(obj).forEach(column => columnsSet.add(column));
            });
            const columns = Array.from(columnsSet);



            // Extract data from resultArr
            const data = flattenedData.map(item => columns.map(column => item[column]));            

            // Convert data to CSV format
            const csvOptions = {
                header: true, // Do not include header in CSV
                columns: columns
            };

            stringify(data, csvOptions, (err, csvContent) => {
                if (err) {
                    console.error('Error converting to CSV:', err);
                } else {
                    // Save CSV content to the file
                    fs.writeFileSync(filePath, addLinesToCSV(csvContent));
                    console.log('CSV file saved successfully:', filePath);
                }
            });

            function addLinesToCSV(csvContent) {
                const lines = csvContent.split('\n');
                const headerLine = lines[0]
                    .split(',')
                    .map((cell) => `+${'-'.repeat(cell.length + 2)}+`)
                    .join('');
                return [headerLine, ...lines.slice(1), headerLine].join('\n');
            }
            

            for (const rowGroup of resultArr) {
                for (const row of rowGroup) {
                    const query = `SELECT * FROM "EIRF_RICO_IBEATS_ResignedEmp_AccountCode" WHERE "EmployeeID" = '${row.EMPNO}' AND "AccCode" = '${row.ACC_CODE}'`;
                    const rows = await connect.sequelize.query(query);
                    console.log("rows", rows[0]);

                    if (rows[0].length === 0) {
                        // If the row doesn't exist, insert it into the database
                        await connect.sequelize.query(`INSERT INTO "EIRF_RICO_IBEATS_ResignedEmp_AccountCode"("EmployeeID", "AccCode", "AccountName","PanNo","CREATED_ON") VALUES ('${row.EMPNO}','${row.ACC_CODE}','${row.ACC_NAME}','${row.PAN}',CURRENT_TIMESTAMP)`);
                        console.log(`Row inserted into the database: ${JSON.stringify(row)}`);
                    } else {
                        console.log(`Row already exists in the database, skipping: ${JSON.stringify(row)}`);
                    }
                }
            }

            return { filePath, formattedDate };
        } else {
            return { filePath: null, formattedDate };
        }
    } catch (error) {
        console.error('Error creating attachment file:', error);
        return null;
    }
}



// Function to send email with the attachment
async function sendEmailWithAttachment(filePath, formattedDate) {
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
                            Dear All ,
                            <br> <br>  
                            Please change the category to normal category for the attached employee/s as on '${formattedDate}' 
                            <br> <br>
                            </td>
                            </tr>        
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>    
                            Note - Do not reply to this email as this is a system generated mail.
                            <br> <br>
                            Regards, <br>
                            Compliance Team
                            </td>
                            </tr>
                            </table>
                        </body>
                       </html>`;

        // Define your email content
        const mailOptions = {
            from: 'newel.technical@gmail.com',
            to: 'rinkal@neweltechnologies.com,prasad@neweltechnologies.com',
            cc: 'aniket.yadav@neweltechnologies.com',
            subject: `Untagging of Employees – ${formattedDate}`,
            html: mailBody,
            attachments: [
                {
                    filename: `EmployeeTagging.csv`,
                    path: filePath,
                },
            ],
        };


        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);


        const parts = formattedDate.split('-');
        const postgresDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        try {
            const insertQuery = `
        INSERT INTO "TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('Employee tagging mail sent successfully', '${postgresDate}',CURRENT_TIMESTAMP)`;
            await connect.sequelize.query(insertQuery, [postgresDate]);
            console.log('Data saved successfully!');
        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Send error notification via email
        await sendErrorNotification('Error sending email', error, formattedDate);
    }
}

// Function to send email with the attachment if no data
async function sendEmailWithNODataAttachment(filePath, formattedDate) {
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
                            Dear All ,
                            <br> <br>  
                            There are no records as on '${formattedDate}' 
                            <br> <br>
                            </td>
                            </tr>        
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>    
                            Note - Do not reply to this email as this is a system generated mail.
                            <br> <br>
                            Regards, <br>
                            Compliance Team
                            </td>
                            </tr>
                            </table>
                        </body>
                       </html>`;

        // Define your email content
        const mailOptions = {
            from: 'newel.technical@gmail.com',
            to: 'rinkal@neweltechnologies.com,prasad@neweltechnologies.com',
            cc: 'aniket.yadav@neweltechnologies.com',
            subject: `Untagging of Employees – ${formattedDate}`,
            html: mailBody,
        };


        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);


        const parts = formattedDate.split('-');
        const postgresDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        try {
            const insertQuery = `
        INSERT INTO "TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('Employee tagging mail sent successfully', '${postgresDate}',CURRENT_TIMESTAMP)`;
            await connect.sequelize.query(insertQuery, [postgresDate]);
            console.log('Data saved successfully!');
        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        // Send error notification via email
        await sendErrorNotification('Error sending email', error, formattedDate);
    }
}

// Function to send email with the error
async function sendErrorNotification(errorMessage, error, formattedDate) {
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
                            ${errorMessage}    
                            <br><br>
                            ${error}
                            </td>
                            </tr>
                            </table>                                    
                          </body>
                         </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - Employee Tagging failed',
            html: errorBody,
        };

        // Send the error notification email
        const info = await transporter.sendMail(errorOptions);
        console.log('Error notification sent:', info.response);

        const parts = formattedDate.split('-');
        const postgresDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        try {
            const insertQuery = `INSERT INTO "TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('${error}', '${postgresDate}',CURRENT_TIMESTAMP)`;
            await connect.sequelize.query(insertQuery, [error, postgresDate]);
            console.log('Data saved successfully!');
        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}

// Execute the functions
var sendReginedEmpremovalblockinlist = async function sendReginedEmpremovalblockinlist() {
    const { filePath, formattedDate } = await createAttachmentFile();
    console.log("failpath", filePath);

    if (filePath === null) {
        await sendEmailWithNODataAttachment(filePath, formattedDate);
    } else if (filePath && formattedDate) {
        await sendEmailWithAttachment(filePath, formattedDate);
    } else {
        console.error('Attachment file creation failed.');
    }
}


// Call the main function
module.exports.sendReginedEmpremovalblockinlist = sendReginedEmpremovalblockinlist;






