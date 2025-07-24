var express = require('express');
var router = express.Router();
const https = require('https');
const axios = require('axios');
var connect = require('../Data/Connect');
var configFile = require('.././Config');
const { NOW, literal } = require('sequelize');
const { log } = require('console');
var sequelize = connect.Sequelize;
var fs = require('fs');

async function generateToken() {
    try {
        const hrms_oauth2_clientid = "6kojghrgemee2rd2lmig1d55cf";
        const hrms_oauth2_client_secret_key = "11ei2v40lcmp05kcab29ra949sqi6gt5qs72t4f5ddo0gr8k7j4p";

        // Concatenate client id and secret key
        const concatenatedString = `${hrms_oauth2_clientid}:${hrms_oauth2_client_secret_key}`;

        // Convert string to UTF-8 bytes
        const utf8Bytes = Buffer.from(concatenatedString, 'utf-8');

        // Encode UTF-8 bytes to Base64
        const encodedString = utf8Bytes.toString('base64');
        console.log(encodedString);

        // Set headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedString}`,
            'Accept': 'application/json'
        };

        const HRMS_API_PATH = "https://fiber.nuvamapis.com/oauth2/token";


        // Make a request to the HRMS API path to obtain the token
        const tokenResponse = await axios.post(HRMS_API_PATH, {}, { headers });

        // Extract the token from the response
        const jwtToken = tokenResponse.data.access_token;

        return jwtToken;
    } catch (error) {
        console.error("Error while generating token or fetching data:", error);
        throw error;
    }
}


var sendEmail = async function sendEmail(from, to, cc, subject, html, attachment) {
    try {
        // Generate token
        const token = await generateToken();

        // Define request headers
        const headers = {
            'Authorization': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900'
        };

        let params = '';
        let formData = '';

        if (configFile.environment === "uat" || configFile.environment === "local") {

            // Define request parameters
            // params = {
            //     // 'fromEmailId': 'newel.technical@gmail.com',
            //     'fromEmailId': from,
            //     'toEmailIds': to,
            //     'ccEmailIds': cc,
            //     'sendToAllTogether': 'true',
            //     'subject': subject,
            //     'emailBody': html,
            //     'attachments': attachment.map(attachment => ({
            //         filename: attachment.filename,
            //         path: attachment.path
            //     }))
            // };

            formData = new FormData();
            formData.append('fromEmailId', from);
            formData.append('toEmailIds', to);
            formData.append('ccEmailIds', cc);
            formData.append('sendToAllTogether', 'true');
            formData.append('subject', subject);
            formData.append('emailBody', html);

            const filePath = attachment.path;

            if (filePath && fs.existsSync(filePath)) {
                // Attachment file exists, read file and append to form data


                const fileData =  fs.readFileSync(filePath);
                await formData.append('File', data, {
                    filename: path.basename(filePath) // Use the base filename as attachment name
                });

                // Make HTTP POST request to send the email with attachment
                // sendEmail(formData);
                const HRMS_API_PATH = "https://fiber.nuvamapis.com/email/send";

                // Send POST request to the email sending endpoint
                const response = await axios.post(HRMS_API_PATH, formData, { headers });

                console.log("Email sent successfully:", response.data);

                const data = response.data;
                console.log("data",data);
                // fs.readFile(filePath, async (err, data) => {
                //     if (err) {
                //         console.error('Error reading file:', err);
                //         return;
                //     }                    
                // });

            } else {
                // No attachment or attachment file does not exist
                // Make HTTP POST request to send the email without attachment
                // sendEmail(formData);
                const HRMS_API_PATH = "https://fiber.nuvamapis.com/email/send";

                    // Send POST request to the email sending endpoint
                    const response = await axios.post(HRMS_API_PATH, formData, { headers });

                    console.log("Email sent successfully:", response.data);

                    const data = response.data;
                    console.log("data",data);
            }
        } else {
            // Define request parameters
            // params = {
            //     // 'fromEmailId': 'newel.technical@gmail.com',
            //     'fromEmailId': from,
            //     'toEmailIds': to,
            //     'ccEmailIds': cc,
            //     'sendToAllTogether': 'true',
            //     'subject': subject,
            //     'emailBody': html,
            //     'attachments': attachment.map(attachment => ({
            //         filename: attachment.filename,
            //         path: attachment.path
            //     }))
            // };
        }

        // console.log("attachment", params);


        const HRMS_API_PATH = "https://fiber.nuvamapis.com/email/send";

        // Send POST request to the email sending endpoint
        const response = await axios.post(HRMS_API_PATH, params, { headers });

        console.log("Email sent successfully:", response.data);

        const data = response.data;

        // const insertQuery = `INSERT INTO "TBL_HRMS_MAIL_LOG" ("RESPONSE","CREATED_DATE") VALUES ('${result}', CURRENT_TIMESTAMP)`;
        // await connect.sequelize.query(insertQuery, [result]);
        return data;

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}


// Call the getData function
module.exports.sendEmail = sendEmail;






