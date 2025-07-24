var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");


// Function to query data and create attachment file
var ScriptMstDifferencefile = async function ScriptMstDifferencefile() {

    try {
        const today = new Date();

        // Extract the components of the date (year, month, day)
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(today.getDate()).padStart(2, '0');

        // Form a string in 'YYYY-MM-DD' format ${year}-${month}-${day}
        const formattedDate = `${day}-${month}-${year}`;
        console.log("formattedDate", formattedDate);

        const result = await connect.sequelize.query('select * from usp_script_automation_changes()', {
            type: sequelize.QueryTypes.RAW,
        });
        const data = result[0];
        console.log("data", data);

        // Create the attachment file with fetched data
        const fileName = `ScripMstDiff_${formattedDate}.txt`;
        const filePath = path.resolve(__dirname, '../sendSchedulerFiles', fileName);
        let fileContent = '';

        // Separate data based on conditions
        const newEntries = data.filter(item => item.bse_code_old === null && item.action_new === 'INSERT');
        
        const isinChanges = data.filter(item =>
            (item.isin_old !== '' && item.isin_new !== '' && item.isin_old !== item.isin_new)
        );

        console.log(isinChanges);

        const bseGroupChanges = data.filter(item =>
            (item.bse_group_name_old !== null && item.bse_group_name_new !== null) ? item.bse_group_name_old !== item.bse_group_name_new : false
        );

        const scripNameChanges = data.filter(item =>
            (item.script_name_old !== '' && item.script_name_new !== '') ? item.script_name_old !== item.script_name_new : false
        );



        // Function to pad a string with spaces to a specified length
        const padString = (str, length) => {
            const spacesToAdd = Math.max(0, length - str.length);
            return str + ' '.repeat(spacesToAdd);
        };

        // Function to create a row for the table
        const createTableRow = (columns) => {
            return `| ${columns.map((column, index) => padString(column, columnWidths[index])).join(' | ')} |\n`;
        };

        // Function to create a horizontal line for the table
        const createTableHorizontalLine = () => {
            return `+-${columnWidths.map(width => '-'.repeat(width)).join('-+-')}-+\n`;
        };

        // Define column headers and widths
        const headers = ["Company Name", "ISIN", "Exchange"];
        const headers1 = ["Company Name", "Old ISIN", "New ISIN"];
        const headers2 = ["Company Name", "Old GroupName", "New GroupName",];
        const headers3 = ["Old CompanyName", "New CompanyName", "Exchange"];
        const columnWidths = [35, 35, 20];

        // Create tables based on conditions
        if (newEntries.length > 0) {
            fileContent += "New Entries:\n";
            fileContent += createTableHorizontalLine();
            fileContent += createTableRow(headers);
            fileContent += createTableHorizontalLine();
            newEntries.forEach(item => {
                fileContent += createTableRow([item.script_name_new, item.isin_new, item.exchange_new]);
            });
            fileContent += createTableHorizontalLine();
        } else {
            fileContent += "No New Entries:\n";
        }

        if (isinChanges.length > 0) {
            fileContent += "Changes in ISIN:\n";
            fileContent += createTableHorizontalLine();
            fileContent += createTableRow(headers1);
            fileContent += createTableHorizontalLine();
            isinChanges.forEach(item => {
                fileContent += createTableRow([item.script_name_new, item.isin_old, item.isin_new]);
            });
            fileContent += createTableHorizontalLine();
        } else {
            fileContent += "No Changes in ISIN:\n";
        }

        if (bseGroupChanges.length > 0) {
            fileContent += "Changes in BSE Group:\n";
            fileContent += createTableHorizontalLine();
            fileContent += createTableRow(headers2);
            fileContent += createTableHorizontalLine();
            bseGroupChanges.forEach(item => {
                fileContent += createTableRow([item.script_name_new, item.bse_group_name_old, item.bse_group_name_new]);
            });
            fileContent += createTableHorizontalLine();
        } else {
            fileContent += "No Changes in BSE Group:\n";
        }
        
        if (scripNameChanges.length > 0) {
            fileContent += "Changes in Scrip Name:\n";
            fileContent += createTableHorizontalLine();
            fileContent += createTableRow(headers3);
            fileContent += createTableHorizontalLine();
            scripNameChanges.forEach(item => {
                fileContent += createTableRow([item.script_name_old, item.script_name_new, item.exchange_new]);
            });
            fileContent += createTableHorizontalLine();
        } else {
            fileContent += "No Changes in Scrip Name:\n";
        }


        fs.writeFileSync(filePath, fileContent);
        await sendEmailWithAttachment(filePath, formattedDate);
    } catch (error) {
        console.error('Error creating attachment file:', error);
        // Send error notification via email
        await sendErrorNotification('Error creating attachment file', error);
        // return null;
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
                            Please find attached the Script Mst Diff file as on '${formattedDate}' 
                            <br> <br>
                            </td>
                            </tr>        
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>    
                            Note - Do not reply to this email as this is a system generated mail.    
                            <br> <br>
                            Regards, <br>
                            Newel Technologies Pvt. Ltd.
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
            subject: `Changes in Scrip Master – ${formattedDate}`,
            html: mailBody,
            attachments: [
                {
                    filename: `ScripMstDiff_${formattedDate}.txt`,
                    path: filePath,
                },
            ],
        };


        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

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
            subject: 'Changes in Scrip Master Failed',
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
module.exports.ScriptMstDifferencefile = ScriptMstDifferencefile;



