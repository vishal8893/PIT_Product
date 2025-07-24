var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");


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

    const query = `SELECT 'RMS Category Assign to Account' AS "CategoryDescription"
      UNION ALL
            SELECT 
             COALESCE(CAST("rico"."AccountCode" AS TEXT), '') || '|' ||
             CASE 
                WHEN "rico"."AccountCode" IS NULL THEN
                    CASE 
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = true AND "um"."GREYLIST" != true THEN 'EMPL_DES'
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = true AND "um"."GREYLIST" = true THEN 'EMPL_DES_DESGREY'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = false THEN 'EMPL_NDES'
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = false THEN 'EMPL_DES_NDES'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = true AND "um"."GREYLIST" != true THEN 'EMPL_NDES_DES'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = true AND "um"."GREYLIST" = true THEN 'EMPL_NDES_DESGREY'
                    END
                ELSE
                    CASE 
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = true AND "um"."GREYLIST" != true THEN 'EMPL_DES_LAS'
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = true AND "um"."GREYLIST" = true THEN 'EMPL_DES_DESGREY_LAS'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = false THEN 'EMPL_NDES_LAS'
                        WHEN "um"."EFSLDESIGNATED" = true AND "um"."DSIGNATED" = false THEN 'EMPL_DES_NDES_LAS'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = true AND "um"."GREYLIST" != true THEN 'EMPL_NDES_DES_LAS'
                        WHEN "um"."EFSLDESIGNATED" = false AND "um"."DSIGNATED" = true AND "um"."GREYLIST" = true THEN 'EMPL_NDES_DESGREY_LAS'
                    END
            END AS "EmployeeCategory"
      FROM "TBL_USER_MST" AS "um"
      LEFT JOIN "Tbl_Employee_AccountCode_Mapping" AS "rico" 
      ON "rico"."EMPLOYEE_ID" = "um"."EMPNO"
      AND "rico"."IS_ACTIVE" = true  
      WHERE "um"."ISACTIVE" = true 
        AND "rico"."AccountCode" IS NOT NULL
        AND "rico"."AccountName" NOT LIKE 'closed %' 
        AND COALESCE(CAST("rico"."AccountCode" AS TEXT), '') NOT IN ('50076270', '50078052', '50070089');`;

    const result = await connect.sequelize.query(query);
    const data = result[0];
    console.log("data", data);

    // Create the attachment file with fetched data
    const fileName = `RiskCategorization_${formattedDate}.txt`;
    const filePath = path.resolve(__dirname, '../sendSchedulerFiles', fileName);
    let fileContent = '';
    data.forEach(item => {
      fileContent += `${item.CategoryDescription}\n`;
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
                                    Please find attached the Employee Risk Categorization as on '${formattedDate}'
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
      to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com',
      subject: 'Employee Categorization',
      html: mailBody,
      attachments: [
        {
          filename: `RiskCategorization_${formattedDate}.txt`,
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
        INSERT INTO "TBL_RISKCATEGORY_MAIL" ("EMAIL_STATUS","EMAIL_DATE","CREATED_ON") VALUES ('Mail Sent Successfully', '${postgresDate}',CURRENT_TIMESTAMP)`;
      await connect.sequelize.query(insertQuery, [postgresDate]);
      console.log('Date saved successfully!');
    } catch (queryError) {
      console.error('Error saving date:', queryError);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Execute the functions
var sendRiskCategorizationMail = async function sendRiskCategorizationMail() {
  const { filePath, formattedDate } = await createAttachmentFile();
  if (filePath && formattedDate) {
    await sendEmailWithAttachment(filePath, formattedDate);
  } else {
    console.error('Attachment file creation failed.');
  }
}

// Call the main function
module.exports.sendRiskCategorizationMail = sendRiskCategorizationMail;



