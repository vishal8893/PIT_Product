const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
var ejs = require('ejs');
const configFile = require('../Config');
const connect = require('../Data/Connect');
// const puppeteer = require('puppeteer');

let flag = ''

let transporter = nodemailer.createTransport({
  host: configFile.email_smtp_config.host,   //SMTP Host Address
  port: configFile.email_smtp_config.port,                 //SMTP PORT
  auth: {
    user: configFile.email_smtp_config.auth.user,   //Username
    pass: configFile.email_smtp_config.auth.pass    //Password
  }
});



// module.exports.notifyMail = function (fromEmail, toEmail, ccEmail, subjectEmail, htmlEmailTemplatePath, dataEmailTemplateBody) {

//   return new Promise((resolve, reject) => {
//     const templateString = fs.readFileSync(htmlEmailTemplatePath, 'utf-8');
//     const HTMLTemplete = ejs.render(templateString, dataEmailTemplateBody);

//     let messageData = {
//       from: 'Notification.Centre@Lightstorm.in',
//       to: toEmail,
//       cc: ccEmail,
//       subject: subjectEmail,
//       html: HTMLTemplete
//     }

//     transporter.sendMail(messageData, (err, info) => {
//       if (err) {
//         let sentData = { messageData: messageData, err: err }
//         reject(sentData);
//       }
//       else {
//         let sentData = { messageData: messageData, info: info }
//         resolve(sentData);
//       }
//     });
//   });
// }

var mailEAHOpt = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Self Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eah.pdf',
    path: "./eah.pdf"
  }]
}

var mailEAHOpt1 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Self Account Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahSelfAcc.pdf',
    path: "./eahSelfAcc.pdf"
  }]
}

var mailEAHOpt2 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Dependent Account Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahDependentAcc.pdf',
    path: "./eahDependentAcc.pdf"
  }]
}

var mailEAHOpt3 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Material Financial Rel Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahMatFin.pdf',
    path: "./eahMatFin.pdf"
  }]
}

var mailEAHOpt4 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: '10%Stack Account Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahStackAcc.pdf',
    path: "./eahStackAcc.pdf"
  }]
}

var mailEAHOpt5 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Security Holding Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahSecHolding.pdf',
    path: "./eahSecHolding.pdf"
  }]
}

var mailEAHOpt6 = {
  from: 'rinkalchaudhary21@gmail.com',
  to: 'rinkal@neweltechnologies.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'Commodity Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'eahCommodity.pdf',
    path: "./eahCommodity.pdf"
  }]
}

function SendEAHEmail(flag1, useremail) {
  if (flag1 == 'details') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Self Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eah.pdf',
        path: "./eah.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'self') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Self Account Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahSelfAcc.pdf',
        path: "./eahSelfAcc.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt1, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'dependent') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Dependent Account Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahDependentAcc.pdf',
        path: "./eahDependentAcc.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt2, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'matfinRel') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Material Financial Rel Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahMatFin.pdf',
        path: "./eahMatFin.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt3, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'stack') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: '10%Stack Account Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahStackAcc.pdf',
        path: "./eahStackAcc.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt4, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'holding') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Security Holding Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahSecHolding.pdf',
        path: "./eahSecHolding.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt5, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  } else if (flag1 == 'commodity') {
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: useremail,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'Commodity Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'eahCommodity.pdf',
        path: "./eahCommodity.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
    // transporter.sendMail(mailEAHOpt6, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
  }

}

var mailOpstion = {
  from: 'khilarivishu@gmail.com',
  to: 'rinkalchaudhary21@gmail.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'PCOI Details',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'pcoi.pdf',
    path: "./pcoi.pdf"
  }]
}

var mailOpstionr = {
  // from: 'khilarivishu@gmail.com',
  from: 'newel.technical@gmail.com',
  to: 'rinkalchaudhary21@gmail.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'PCOI Reminder',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'reminder.pdf',
    path: "./reminder.pdf"
  }]
}

var mailOpstioni = {
  // from: 'khilarivishu@gmail.com',
  from: 'newel.technical@gmail.com',
  to: 'rinkalchaudhary21@gmail.com',
  cc: 'aniket.yadav@neweltechnologies.com',
  subject: 'PCOI intimation',
  text: 'Please Find The Attached File',
  attachments: [{
    filename: 'intimation.pdf',
    path: "./intimation.pdf"
  }]
}


function Emailsendpassword(flag,EmailIdUser) {
  if (flag == 'details') {
    // transporter.sendMail(mailOpstion, function (error, info) {
    //   if (error) {
    //     console.log(error)
    //   } else {
    //     console.log("email send ", info.response)
    //   }
    // })
    transporter.sendMail({
      from: 'newel.technical@gmail.com',
      to: EmailIdUser,
      // cc: 'aniket.yadav@neweltechnologies.com',
      subject: 'PCOI Details',
      text: 'Please Find The Attached File',
      attachments: [{
        filename: 'pcoi.pdf',
        path: "./pcoi.pdf"
      }]
    }, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
  } else if (flag == 'reminder') {
    transporter.sendMail(mailOpstionr, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
  } else if (flag == 'intimation') {
    transporter.sendMail(mailOpstioni, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("email send ", info.response)
      }
    })
  }


}

function Eahreminderandintimation(flag, Emailid) {
  if (flag == 'reminder') {
    fs.readFile('eachreminder.ejs', 'utf8', function (err, templateContent) {
      if (err) {
        console.log("Error reading EJS template:", err);
      } else {
        // Render the template with student data
        const Textr = ejs.render(templateContent, { Data: Emailid });
        transporter.sendMail({
          from: 'khilarivishu@gmail.com',
          to: Emailid.EMAILID,
          cc: 'aniket.yadav@neweltechnologies.com',
          subject: 'Reminder',
          html: Textr
          // text: 'Please Find The Attached File',
          // attachments: [{
          //   filename: 'eachreminder.pdf',
          //   path: "./eachreminder.pdf"
          // }]
        }, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log("email send ", info.response)
          }
        })
      }
    });

  } else if (flag == 'intimation') {
    fs.readFile('eachintimation.ejs', 'utf8', function (err, templateContent) {
      if (err) {
        console.log("Error reading EJS template:", err);
      } else {
        // Render the template with student data
        const Texti = ejs.render(templateContent, { Data: Emailid });

        transporter.sendMail({
          from: 'khilarivishu@gmail.com',
          to: Emailid.EMAILID,
          cc: 'aniket.yadav@neweltechnologies.com',
          subject: 'Intimation',
          // text: 'Please Find The Attached File',
          // attachments: [{
          //   filename: 'Eahintimation.pdf',
          //   path: "./Eahintimation.pdf"
          // }]
          html: Texti
        }, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log("email send ", info.response)
          }
        })
      }
    });

  }
  
}

async function SendDPAllocationEmail(flag, emailData) {
  if (flag == 'approval_notification') {
    try {
      // Get employee email
      const employeeEmail = await connect.sequelize.query(`SELECT "EMAILID" FROM "TBL_USER_MST" WHERE "EMPNO" = '${emailData.EMPID}'`);
      
      const mailBody = `
        <html>
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
            <p>Dear ${emailData.FIRSTNAME},</p>
            <p>
              This is to inform you that your DP Allocation Approval request has been successfully submitted.
            </p>
            <p>
              Employee ID: ${emailData.EMPID}<br>
              Name: ${emailData.FIRSTNAME}<br>
              Designation: ${emailData.DESIGNATED}
            </p>
            <p>
              The approval is currently pending. You will be notified once the approval process is complete.
            </p>
            <p>
              For any queries/concerns with regards to this mail, please connect with the compliance team.
            </p>
            <p>Note - Do not reply to this email as this is a system generated mail.</p>
            <br />
            Regards,<br />
            Compliance Team
            <br><br>
          </body>
        </html>`;

      transporter.sendMail({
        from: 'newel.technical@gmail.com',
        to: employeeEmail[0][0] ? employeeEmail[0][0].EMAILID : 'aniketmdeshmane@gmail.com',
        cc: 'aniketmdeshmane@gmail.com',
        subject: 'DP Allocation Approval - Request Submitted',
        html: mailBody
      }, function (error, info) {
        if (error) {
          console.log('Email sending error:', error);
        } else {
          console.log("DP Allocation Approval email sent:", info.response);
        }      });
    } catch (error) {
      console.log('Error getting employee email:', error);
    }
  } else if (flag == 'admin_approval_request') {
    try {      // Get admin emails - designated users with roles 51,1
      const adminEmails = await connect.sequelize.query(`
        SELECT DISTINCT u_m."EMAILID" 
        FROM "TBL_USER_MST" u_m
        INNER JOIN "TBL_USERROLE_MAP" u_r_m ON u_m."ID" = u_r_m."USERID"
        WHERE u_r_m."ROLEID" IN (51,1) 
          AND u_m."DSIGNATED" = true 
          AND u_m."ISACTIVE" = true 
          AND u_m."EMAILID" IS NOT NULL
      `);

      const adminEmailList = adminEmails[0].map(row => row.EMAILID).filter(email => email && email.trim() !== '');
      const toEmails = adminEmailList.length > 0 ? adminEmailList.join(',') : 'aniketmdeshmane@gmail.com';

      const mailBody = `
        <html>
          <style>
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 20px 0;
            }
            tr td { 
              padding: 10px; 
              border: 1px solid #ddd; 
              text-align: left;
            }
            tr th { 
              padding: 10px; 
              border: 1px solid #ddd; 
              background-color: #f2f2f2; 
              text-align: left;
              font-weight: bold;
            }
            body {
              font-family: calibri;
              font-size: 15px;
              color: #09095d;
              line-height: 1.6;
            }
            .approve-button {
              background-color: #28a745;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 20px 10px 20px 0;
              font-weight: bold;
            }
            .header {
              background-color: #09095d;
              color: white;
              padding: 15px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
            }
            .request-type {
              background-color: #ffc107;
              color: #000;
              padding: 5px 10px;
              border-radius: 3px;
              font-weight: bold;
              text-transform: uppercase;
            }
          </style>
          <body>
            <div class="header">
              DP Allocation ${emailData.REQUEST_TYPE.toUpperCase()} Request - Approval Required
            </div>
            
            <p>Dear Admin Team,</p>
            
            <p>
              A new DP Allocation <span class="request-type">${emailData.REQUEST_TYPE}</span> request has been submitted and requires your immediate attention.
            </p>
            
            <table>
              <tr>
                <th>Request Details</th>
                <th>Information</th>
              </tr>
              <tr>
                <td><strong>Employee ID</strong></td>
                <td>${emailData.EMPID}</td>
              </tr>
              <tr>
                <td><strong>Employee Name</strong></td>
                <td>${emailData.FIRSTNAME}</td>
              </tr>
              <tr>
                <td><strong>Designation</strong></td>
                <td>${emailData.DESIGNATED}</td>
              </tr>
              <tr>
                <td><strong>Request Type</strong></td>
                <td><span class="request-type">${emailData.REQUEST_TYPE.toUpperCase()}</span></td>
              </tr>
              <tr>
                <td><strong>Request Date</strong></td>
                <td>${emailData.CREATED_DT}</td>
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                <td>⏳ Pending Approval</td>
              </tr>
            </table>
            
            <p>
              <strong>Action Required:</strong> Please review and approve/reject this ${emailData.REQUEST_TYPE} request.
            </p>
            
            <p>
              <a href="http://localhost:4200/pit/dark-pool-approval" class="approve-button">
                🔗 Review & Process Request
              </a>
            </p>
            
            <p>
              <strong>Request Summary:</strong><br>
              Employee <strong>${emailData.FIRSTNAME}</strong> (ID: ${emailData.EMPID}) has requested DP allocation ${emailData.REQUEST_TYPE}. 
              This request was submitted on ${emailData.CREATED_DT} and is currently pending administrative approval.
            </p>
            
            <p>
              <strong>Next Steps:</strong>
            </p>
            <ul>
              <li>Click the "Review & Process Request" button above</li>
              <li>Review the employee's request details</li>
              <li>Approve or reject the request with appropriate comments</li>
              <li>Employee will be automatically notified of your decision</li>
            </ul>
            
            <p>
              For any queries or technical issues regarding this request, please contact the IT support team.
            </p>
            
            <p style="color: #dc3545; font-weight: bold;">
              ⚠️ Note: This request requires timely processing. Please take action within 24 hours.
            </p>
            
            <p>Note - This is a system generated email. Please do not reply to this email.</p>
            
            <hr style="margin: 30px 0; border: 1px solid #ddd;">
            
            <p style="font-size: 12px; color: #666;">
              <strong>System Information:</strong><br>
              Email sent from: PIT ARMOUR Compliance System<br>
              Timestamp: ${new Date().toLocaleString()}<br>
              Reference: DP_ALLOC_${emailData.EMPID}_${Date.now()}
            </p>
            
            <br />
            <strong>Regards,</strong><br />
            <strong>PIT ARMOUR System</strong><br />
            <em>Automated Compliance Management</em>
            <br><br>
          </body>
        </html>`;

      transporter.sendMail({
        from: 'newel.technical@gmail.com',
        to: toEmails,
        cc: 'aniketmdeshmane@gmail.com',
        subject: `🔔 DP Allocation ${emailData.REQUEST_TYPE.toUpperCase()} Approval Required - ${emailData.EMPID} (${emailData.FIRSTNAME})`,
        html: mailBody
      }, function (error, info) {
        if (error) {
          console.log('Admin email sending error:', error);
        } else {
          console.log("DP Allocation Admin approval email sent:", info.response);
          console.log("Email sent to admin addresses:", toEmails);
        }
      });
    } catch (error) {
      console.log('Error getting admin emails:', error);
      // Fallback to default email
      transporter.sendMail({
        from: 'newel.technical@gmail.com',
        to: 'aniketmdeshmane@gmail.com',
        cc: 'aniketmdeshmane@gmail.com',
        subject: `🔔 DP Allocation ${emailData.REQUEST_TYPE.toUpperCase()} Approval Required - ${emailData.EMPID} (${emailData.FIRSTNAME})`,
        html: 'Error loading email template. Please check the DP Allocation request manually.'
      });
    }
  }
}

// Simple API function to get user role data with designated users
async function getUserRoleData() {
  try {
    console.log('Getting user role data...');
    
    const result = await connect.sequelize.query(`
      SELECT 
          u_m."LOGINID",
          u_r_m."ROLEID",
          u_m."PANCARDNO",
          u_m."EMPNO",
          u_m."DSIGNATED",
          r_m."CODE",
          u_m."ID",
          u_m."DEFAULTROLEID",
          u_m."FIRSTNAME",
          u_m."LASTNAME",
          u_m."DEPARTMENT",
          u_m."EMAILID"
      FROM "TBL_USER_MST" u_m
      INNER JOIN "TBL_USERROLE_MAP" u_r_m ON u_m."ID" = u_r_m."USERID"
      INNER JOIN "TBL_ROLE_MST" r_m ON r_m."ID" = u_r_m."ROLEID"      WHERE u_r_m."ROLEID" IN (51,1) AND u_m."ISACTIVE" = true
      ORDER BY u_m."FIRSTNAME", u_m."LASTNAME"
    `);
    
    const userData = result[0];
    const designatedUsers = userData.filter(user => user.DSIGNATED === true);
    
    return {
      success: true,
      message: 'User role data retrieved successfully',
      totalRecords: userData.length,
      designatedUsersCount: designatedUsers.length,
      data: userData,
      designatedUsers: designatedUsers,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error in getUserRoleData:', error);
    return {
      success: false,
      message: 'Error retrieving user role data: ' + error.message,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Simple function to get admin emails
async function getAdminEmails() {
  try {
    const result = await connect.sequelize.query(`
      SELECT DISTINCT u_m."EMAILID" 
      FROM "TBL_USER_MST" u_m
      INNER JOIN "TBL_USERROLE_MAP" u_r_m ON u_m."ID" = u_r_m."USERID"
      WHERE u_r_m."ROLEID" IN (51,1) 
        AND u_m."DSIGNATED" = true 
        AND u_m."ISACTIVE" = true 
        AND u_m."EMAILID" IS NOT NULL
    `);
    
    const adminEmails = result[0].map(row => row.EMAILID).filter(email => email && email.trim() !== '');
    return adminEmails.length > 0 ? adminEmails : ['aniketmdeshmane@gmail.com'];
    
  } catch (error) {
    console.error('Error getting admin emails:', error);
    return ['aniketmdeshmane@gmail.com'];
  }
}

module.exports.Emailsendpassword = Emailsendpassword;
module.exports.SendEAHEmail = SendEAHEmail;
module.exports.Eahreminderandintimation = Eahreminderandintimation;
module.exports.SendDPAllocationEmail = SendDPAllocationEmail;
module.exports.getUserRoleData = getUserRoleData;
module.exports.getAdminEmails = getAdminEmails;