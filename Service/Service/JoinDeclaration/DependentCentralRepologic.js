var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");


    // Function to query data and create attachment file
    var DependentCentralRepologic = async function DependentCentralRepologic() {
        try {
            const result = await connect.sequelize.query('SELECT eirf_dependent_centralrepologic()', {
                type: sequelize.QueryTypes.RAW,
              });
              console.log("data", result);
        } catch (error) {
            console.error('Error creating attachment file:', error);
            // Send error notification via email
            await sendErrorNotification('Error creating attachment file', error);
            // return null;
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
                to: 'rinkal@neweltechnologies.com,aniket.yadav@neweltechnologies.com',
                subject: 'EIRF - Updating Central-Repository Master Failed',
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
module.exports.DependentCentralRepologic = DependentCentralRepologic;



