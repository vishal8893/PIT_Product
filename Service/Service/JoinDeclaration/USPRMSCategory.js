var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");



// var routes = function () {

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

        const query = `SELECT   'RMS Blocking/UnBlocking'
        UNION ALL  
        SELECT CASE 
                    WHEN (DATE_PART('month',"t"."TradeDate"::timestamp) - DATE_PART('month', NOW()) < 6) OR 
                         ((DATE_PART('month',"t"."TradeDate"::timestamp) - DATE_PART('month', NOW()) = 6) AND
                         (EXTRACT(day FROM "t"."TradeDate"::timestamp) >= EXTRACT(day FROM NOW())))                
                    THEN ' ' || '||' || "map"."AccCode" || '|' || CASE WHEN "map"."Mode"= 'Buy' THEN 'S' ELSE 'B' END || '||ALL|nse_cm|NEWEL|||||Y|||Contra-Trade not allowed - EMPTRADING'
                    ELSE ' ' || '||' || "map"."AccCode" || '|' || CASE WHEN "map"."Mode"= 'Buy' THEN 'S' ELSE 'B' END || '||ALL|nse_cm|NEWEL|||||N|||' 
               END AS "category"
       FROM  (
           SELECT MAX("sos"."TransId") AS "TransId", MAX("sos"."TradeDate") AS "TradeDate","sos"."EmpId"
            FROM "eirf_rico_sos_emp_mapping" AS  "sos"
            INNER JOIN "TBL_USER_MST" AS "UM" ON "UM"."EMPNO" = "sos"."EmpId"
            WHERE "sos"."ISIN" = 'INE158A01026' AND "sos"."TradeDate" >= '2010-02-01' AND "UM"."ISACTIVE" = true AND "UM"."EFSLDESIGNATED" = true
            GROUP BY "sos"."EmpId"		
        )AS "t"
        INNER JOIN "eirf_rico_sos_emp_mapping" AS "map" ON "t"."TransId" = "map"."TransId"
    --     WHERE "map"."AccCode" NOT IN (SELECT "Acc_Code" FROM "EIRF_RMS_ExceptionList")
        
        UNION ALL
        
        SELECT CASE 
                    WHEN (DATE_PART('month', "t"."TradeDate"::timestamp) - DATE_PART('month', NOW()) < 6) OR 
                         ((DATE_PART('month', "t"."TradeDate"::timestamp) - DATE_PART('month', NOW()) = 6) AND 
                         (EXTRACT(day FROM "t"."TradeDate"::timestamp) >= EXTRACT(day FROM NOW())))					 				                
                    THEN ' ' || '||' || "map"."AccCode" || '|' || CASE WHEN "map"."Mode"= 'Buy' THEN 'S' ELSE 'B' END || '||ALL|bse_cm|543988|||||Y|||Contra-Trade not allowed - EMPTRADING'
                    ELSE ' ' || '||' || "map"."AccCode" || '|' || CASE WHEN "map"."Mode"= 'Buy' THEN 'S' ELSE 'B' END || '||ALL|bse_cm|543988|||||N|||' 
               END AS "category"
        FROM (
            SELECT MAX("sos"."TransId") AS "TransId", MAX("sos"."TradeDate") AS "TradeDate","sos"."EmpId"
            FROM "eirf_rico_sos_emp_mapping" AS "sos"
            INNER JOIN "TBL_USER_MST" AS "UM" ON "UM"."EMPNO" = "sos"."EmpId"
            WHERE "sos"."ISIN" = 'INE158A01026' AND "sos"."TradeDate" >= '2010-02-01' AND "UM"."ISACTIVE" = true AND "UM"."EFSLDESIGNATED" = true
            GROUP BY "sos"."EmpId"
        ) AS "t"
        INNER JOIN "eirf_rico_sos_emp_mapping" AS "map" ON "t"."TransId" = "map"."TransId"
    --     WHERE "map"."AccCode" NOT IN (SELECT "Acc_Code" FROM "EIRF_RMS_ExceptionList");
        `;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("data", data);

        // Create the attachment file with fetched data
        const fileName = `RMSBlockingUnblocking_${formattedDate}.txt`;
        const filePath = path.resolve(__dirname, '../sendSchedulerFiles', fileName);
        let fileContent = '';
        data.forEach(item => {
            fileContent += `${item['?column?']}\n`;
        });
        fs.writeFileSync(filePath, fileContent);

        return { filePath, formattedDate };
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
                            Please find attached the RMS Blocking/unblocking file as on '${formattedDate}' 
                            <br> <br>
                            </td>
                            </tr>        
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>    
                            Note - Do not reply to this email as this is a system generated mail.    
                            <br> <br>
                            Regards, <br>
                            Newel BG Technology
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
            subject: `RMS Blocking/Unblocking – ${formattedDate}`,
            html: mailBody,
            attachments: [
                {
                    filename: `RMSBlockingUnblocking_${formattedDate}.txt`,
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
        INSERT INTO "TBL_RMSCATEGORY_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('RMS category created successfully', '${postgresDate}',CURRENT_TIMESTAMP)`;
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
                            // <br> <br>
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
            subject: 'EIRF -RMS category mail sending failed',
            html: errorBody,
        };

        // Send the error notification email
        const info = await transporter.sendMail(errorOptions);
        console.log('Error notification sent:', info.response);

        const parts = formattedDate.split('-');
        const postgresDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        try {
            const insertQuery = `INSERT INTO "TBL_RMSCATEGORY_LOG" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('${error}', '${postgresDate}',CURRENT_TIMESTAMP)`;
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
var sendUSPRMSCategoryMail = async function sendUSPRMSCategoryMail() {
    const { filePath, formattedDate } = await createAttachmentFile();
    if (filePath && formattedDate) {
        await sendEmailWithAttachment(filePath, formattedDate);
    } else {
        console.error('Attachment file creation failed.');
    }
}

// Call the main function
module.exports.sendUSPRMSCategoryMail = sendUSPRMSCategoryMail;



