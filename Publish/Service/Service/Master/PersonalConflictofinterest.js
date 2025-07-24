var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const ejs = require('ejs');
const pdf = require('html-pdf');
const Emailsendpassword = require('../../Common/Mailer');
const fs = require('fs');
const path = require("path");
const nodemailer = require('nodemailer');
const configFile = require('../../Config');


var routes = function () {


    router.route('/GetAllPCOIDetails/:userId')
        .get(function (req, res) {

            const employeeId = req.params.userId;
            const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
            var param = { where: { IS_ACTIVE: true, EmpId: employeeId } };

            dataaccess.FindAll(TBL_PCOIDetails, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'GetAllPCOIDetails List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of GetAllPCOIDetails List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('PersonalConflictofinterestService', 'GetAllPCOIDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of GetAllPCOIDetails Table', Data: null });
                });
        });

    router.route('/Getacivequrter')
        .get(function (req, res) {

            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            var param = { where: { CurrentActive: true } };

            dataaccess.FindAll(TBL_QuarterMaster, param)
                .then(function (result) {
                    if (result != null && result.length > 0) {
                        // console.log("quarterresult", result);
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_QuarterMaster List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        intimation()
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('PersonalConflictofinterestService', 'TBL_QuarterMaster', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster Table', Data: null });
                });
        });

    router.route('/checkduplicate')
        .post(function (req, res) {
            const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 

            var param = {
                where: {
                    // EmpId: parseInt(req.body.UserId)
                    EmpId: encryptmodel.UserId

                },
                // attributes: [
                //     [
                //         connect.sequelize.fn("count", connect.sequelize.col("EmpId")),
                //         "Count"
                //     ],

                // ]
            };

            dataaccess.FindAll(TBL_PCOIDetails, param).then(
                function (result) {
                    if (result != null && result.length > 0) {
                        let stringifydate = JSON.stringify(result)
                        let parsedate = JSON.parse(stringifydate)
                        let CreatedDate = parsedate[0].CREATED_ON
                        console.log("CreatedDate", CreatedDate);
                        Cheackactivequter().then((StartDate) => {
                            if (CreatedDate > StartDate.StartDate && CreatedDate < StartDate.EndDate) {
                                res.status(200).json({ Success: true, Message: "PCOIDetails already exists", Data: true });
                            } else {
                                res
                                    .status(200)
                                    .json({
                                        Success: false,
                                        Message: "PCOIDetails does not exists",
                                        Data: false,
                                    });
                            }
                        }).catch(() => {
                            res
                                .status(200)
                                .json({
                                    Success: false,
                                    Message: "PCOIDetails does not exists",
                                    Data: false,
                                });
                        })

                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "PCOIDetails does not exists",
                                Data: false,
                            });
                    }
                },

            );

        });

    router.route('/CreatePcoi')
        .post(function (req, res) {
            GetAllActiveQuarter().then((Quarterid) => {
                const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
                const TBL_USER_MST = datamodel.TBL_USER_MST();
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 

                var values = {
                    // EmpId: parseInt(req.body.UserId),
                    EmpId: encryptmodel.UserId,
                    DeclarationFor: encryptmodel.declaration,
                    TransDetails: encryptmodel.tcob,
                    Relation: encryptmodel.rwe,
                    Entity: encryptmodel.entity,
                    PerHolding: encryptmodel.holding,
                    Date: encryptmodel.transactiondate,
                    Nature: encryptmodel.not,
                    ValuePrice: encryptmodel.vpt,
                    MarketValPrice: encryptmodel.mcp,
                    SpDiscount: encryptmodel.sdca,
                    ConflictDetails: encryptmodel.doca,
                    Remark: encryptmodel.remark,
                    CREATED_ON: connect.sequelize.fn("NOW"),
                    // CREATED_BY: parseInt(req.body.UserId),
                    CREATED_BY: encryptmodel.UserId,
                    QuarterId: Quarterid,
                    IS_ACTIVE: true
                };
                dataaccess.Create(TBL_PCOIDetails, values)
                    .then(async function (result) {
                        if (result != null) {
                            let Data = JSON.stringify(result)
                            let FinalData = JSON.parse(Data)
                            let FinishData = FinalData
                            console.log("FinishData", FinishData);
                            // // Sample data
                            const studentData = {
                                // name: "Reddy Sai",
                                // couse_name: "Software Engineering Training",
                                // grade: "55.7",
                                // completion_date: "22-Feb-2019"
                                TransDetails: FinishData.TransDetails,
                                Relation: FinishData.Relation,
                                Entity: FinishData.Entity,
                                PerHolding: FinishData.PerHolding,
                                Date: FinishData.Date,
                                Nature: FinishData.Nature,
                                ValuePrice: FinishData.ValuePrice,
                                MarketValPrice: FinishData.MarketValPrice,
                                SpDiscount: FinishData.SpDiscount,
                                ConflictDetails: FinishData.ConflictDetails,
                                Remark: FinishData.Remark,
                            };

                            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                                where: { EMPNO: encryptmodel.UserId, ISACTIVE: true }
                            });

                            console.log("emaildata", emailData);
                            const UserEmailId = emailData.EMAILID;
                            console.log("UserEmailId", UserEmailId);


                            // Read the EJS template
                            fs.readFile('pcoi.ejs', 'utf8', function (err, templateContent) {
                                if (err) {
                                    console.log("Error reading EJS template:", err);
                                } else {
                                    // Render the template with student data
                                    const content = ejs.render(templateContent, { student: studentData });

                                    // Generate PDF from the rendered HTML
                                    pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                                        if (err) {
                                            console.log("Error creating PDF:", err);
                                        } else {
                                            stream.pipe(fs.createWriteStream('pcoi.pdf'));
                                            console.log("PDF created successfully.");
                                            Emailsendpassword.Emailsendpassword('details', UserEmailId);
                                            // Emailsendpassword.Emailsendpassword('details');
                                            var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                            res.status(200).json({ Success: true, Message: 'CreatePcoi saved successfully', Data: EncryptLoginDetails });
                                        }
                                    });
                                }
                            });



                        }
                        else {

                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }, function (err) {
                        dataconn.errorlogger('PersonalConflictofinterestService', 'CreatePcoi', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });
            }).catch(() => {
                res.status(200).json({ Success: false, Message: 'Quarter is not open', Data: null });

            })

        });

    router.route('/CreatePcoi1')
        .post(function (req, res) {
            GetAllActiveQuarter().then((Quarterid) => {
                const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
                const TBL_USER_MST = datamodel.TBL_USER_MST();
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

                var values = {
                    EmpId: encryptmodel.UserId,
                    DeclarationFor: encryptmodel.declaration,
                    TransDetails: encryptmodel.tcob,
                    Relation: encryptmodel.rwe,
                    Entity: encryptmodel.entity,
                    PerHolding: encryptmodel.holding,
                    Date: encryptmodel.transactiondate,
                    Nature: encryptmodel.not,
                    ValuePrice: encryptmodel.vpt,
                    MarketValPrice: encryptmodel.mcp,
                    SpDiscount: encryptmodel.sdca,
                    ConflictDetails: encryptmodel.doca,
                    Remark: encryptmodel.remark,
                    CREATED_ON: connect.sequelize.fn("NOW"),
                    CREATED_BY: encryptmodel.UserId,
                    QuarterId: Quarterid,
                    IS_ACTIVE: true
                };
                dataaccess.Create(TBL_PCOIDetails, values)
                    .then(async function (result) {
                        if (result != null) {
                            var EncryptLoginDetails = dataconn.encryptionAES(result); 
                            res.status(200).json({ Success: true, Message: 'CreatePcoi saved successfully', Data: EncryptLoginDetails });
                            // let Data = JSON.stringify(result)
                            // let FinalData = JSON.parse(Data)
                            // let FinishData = FinalData
                            // console.log("FinishData", FinishData);

                            // const studentData = {                                
                            //     TransDetails: FinishData.TransDetails,
                            //     Relation: FinishData.Relation,
                            //     Entity: FinishData.Entity,
                            //     PerHolding: FinishData.PerHolding,
                            //     Date: FinishData.Date,
                            //     Nature: FinishData.Nature,
                            //     ValuePrice: FinishData.ValuePrice,
                            //     MarketValPrice: FinishData.MarketValPrice,
                            //     SpDiscount: FinishData.SpDiscount,
                            //     ConflictDetails: FinishData.ConflictDetails,
                            //     Remark: FinishData.Remark,
                            // };

                            // const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                            //     attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                            //     where: { EMPNO: req.body.UserId, ISACTIVE: true }
                            // });

                            // console.log("emaildata", emailData);
                            // const UserEmailId = emailData.EMAILID;
                            // console.log("UserEmailId", UserEmailId);


                            // Read the EJS template
                            // fs.readFile('pcoi.ejs', 'utf8', function (err, templateContent) {
                            //     if (err) {
                            //         console.log("Error reading EJS template:", err);
                            //     } else {
                            //         // Render the template with student data
                            //         const content = ejs.render(templateContent, { student: studentData });

                            //         // Generate PDF from the rendered HTML
                            //         pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                            //             if (err) {
                            //                 console.log("Error creating PDF:", err);
                            //             } else {
                            //                 stream.pipe(fs.createWriteStream('pcoi.pdf'));
                            //                 console.log("PDF created successfully.");
                            //                 // Emailsendpassword.Emailsendpassword('details', UserEmailId);
                            //                 Emailsendpassword.Emailsendpassword('details');
                            //                 res.status(200).json({ Success: true, Message: 'CreatePcoi saved successfully', Data: result });
                            //             }
                            //         });
                            //     }
                            // });
                        }
                        else {

                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }, function (err) {
                        dataconn.errorlogger('PersonalConflictofinterestService', 'CreatePcoi', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });
            }).catch(() => {
                res.status(200).json({ Success: false, Message: 'Quarter is not open', Data: null });

            })

        });

    function GetAllActiveQuarter() {
        return new Promise((resolve, reject) => {
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();

            var param = {
                where: {
                    CurrentActive: true

                },

            };

            dataaccess.FindAll(TBL_QuarterMaster, param).then(
                function (result) {
                    if (result != null && result.length > 0) {
                        let Quarterdata = JSON.stringify(result)
                        let Quarterdatafinsl = JSON.parse(Quarterdata)
                        console.log("Quarterdatafinsl", Quarterdatafinsl);
                        let Quarterid = Quarterdatafinsl[0].QuarterId
                        console.log("Quarterid", Quarterid);
                        resolve(Quarterid)
                    } else {
                        reject()
                    }
                },

            );

        });
    }

    router.route('/UpdatePcoi')
        .post(function (req, res) {
            const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var values = {

                // EmpId: parseInt(req.body.UserId), 
                EmpId: encryptmodel.UserId,
                TransDetails: encryptmodel.tcob,
                DeclarationFor: encryptmodel.declaration,
                Relation: encryptmodel.rwe,
                Entity: encryptmodel.entity,
                PerHolding: encryptmodel.holding,
                Date: encryptmodel.transactiondate,
                Nature: encryptmodel.not,
                ValuePrice: encryptmodel.vpt,
                MarketValPrice: encryptmodel.mcp,
                SpDiscount: encryptmodel.sdca,
                ConflictDetails: encryptmodel.doca,
                Remark: encryptmodel.remark,
                MODIFIED_ON: connect.sequelize.fn('NOW'),
                // ODIFIED_BY: parseInt(req.body.UserId),
                MODIFIED_BY: encryptmodel.UserId,

            }
            var param = { TransId: encryptmodel.Id };

            dataaccess.Update(TBL_PCOIDetails, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'UpdatePcoi updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    console.log("update error", err);
                    dataconn.errorlogger('PersonalConflictofinterestService', 'UpdatePcoi', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeletePcoi')
        .post(function (req, res) {
            const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var param = {
                TransId: encryptmodel.Id
            };


            dataaccess.Delete(TBL_PCOIDetails, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of DeletePcoi Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('greyMasterService', 'DeletePcoi', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of DeletePcoi Table', Data: null });
                });
        });

    router.route('/GetStatus')
        .post(function (req, res) {
            const TBL_PCOIDetails = datamodel.TBL_PCOIDetails();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        
            // console.log("loginid", req.body.loginid);
            var param = {
                where:
                    { EmpId: encryptmodel.loginid }
            };

            dataaccess.FindAll(TBL_PCOIDetails, param)
                .then(function (result) {
                    if (result != null && result.length > 0) {
                        console.log("statusresult", result);
                        let stringifydate = JSON.stringify(result)
                        let parsedate = JSON.parse(stringifydate)
                        let CreatedDate = parsedate[0].CREATED_ON
                        Cheackactivequter().then((StartDate) => {
                            if (CreatedDate > StartDate.StartDate && CreatedDate < StartDate.EndDate) {
                                var EncryptLoginDetails = dataconn.encryptionAES(result);
                                res.status(200).json({ Success: true, Message: 'TBL_PCOIDetails List Table Access', Data: EncryptLoginDetails });
                            }
                        }).catch(() => {

                        })

                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PCOIDetails List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('greyMasterService', 'GetStatus', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PCOIDetails Table', Data: null });
                });
        });


    return router;
};
function reminder() {
    fs.readFile('reminder.ejs', 'utf8', function (err, templateContent) {
        if (err) {
            console.log("Error reading EJS template:", err);
        } else {
            // Render the template with student data
            const content = ejs.render(templateContent);

            // Generate PDF from the rendered HTML
            pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                if (err) {
                    console.log("Error creating PDF:", err);
                } else {
                    stream.pipe(fs.createWriteStream('reminder.pdf'));
                    console.log("PDF created successfully.");
                    Emailsendpassword.Emailsendpassword('reminder')
                }
            });
        }
    });
}

// function intimation() {
//     fs.readFile('intimation.ejs', 'utf8', function (err, templateContent) {
//         if (err) {
//             console.log("Error reading EJS template:", err);
//         } else {
//             // Render the template with student data
//             const content = ejs.render(templateContent);

//             // Generate PDF from the rendered HTML
//             pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
//                 if (err) {
//                     console.log("Error creating PDF:", err);
//                 } else {
//                     stream.pipe(fs.createWriteStream('intimation.pdf'));
//                     console.log("PDF created successfully.");
//                     Emailsendpassword.Emailsendpassword('intimation')
//                 }
//             });
//         }
//     });
// }

function getCurrentQuarter() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month index starts from 0

    if (currentMonth >= 1 && currentMonth <= 3) {
        return 1; // First quarter
    } else if (currentMonth >= 4 && currentMonth <= 6) {
        return 2; // Second quarter
    } else if (currentMonth >= 7 && currentMonth <= 9) {
        return 3; // Third quarter
    } else {
        return 4; // Fourth quarter
    }
}

// function intimation() {
//     fs.readFile('intimation.ejs', 'utf8', function (err, templateContent) {
//         if (err) {
//             console.log("Error reading EJS template:", err);
//         } else {
//             const TBL_USER_MST = datamodel.TBL_USER_MST();

//             var param = { where: { ISACTIVE: true } };

//             dataaccess.FindAll(TBL_USER_MST, param)
//                 .then(function (users) {
//                     if (users != null && users.length > 0) {
//                         users.forEach(function (user) {
//                             const content = ejs.render(templateContent, { user: user });

//                             pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
//                                 if (err) {
//                                     console.log("Error creating PDF:", err);
//                                 } else {
//                                     const pdfFileName = `intimation.pdf`;
//                                     const pdfPath = `./${pdfFileName}`;
//                                     stream.pipe(fs.createWriteStream(pdfPath));
//                                     console.log(`PDF (${pdfFileName}) created successfully.`);

//                                     const quarterId = getCurrentQuarter(); // Get current quarter ID

//                                    await sendEmailWithAttachment(user.EMAILID, pdfPath, user.EMPNO, quarterId);
//                                 }
//                             });
//                         });
//                     } else {
//                         console.log("No users found in TBL_UserMst.");
//                     }
//                 })
//                 .catch(function (err) {
//                     console.error('Error fetching users from TBL_UserMst:', err);
//                 });
//         }
//     });
// }

async function intimation() {
    try {
        const templateContent = await fs.promises.readFile('intimation.ejs', 'utf8');
        const TBL_USER_MST = datamodel.TBL_USER_MST();
        const param = { where: { ISACTIVE: true } };

        const users = await dataaccess.FindAll(TBL_USER_MST, param);

        if (users != null && users.length > 0) {
            for (const user of users) {
                const content = ejs.render(templateContent, { user: user });
                const pdfPath = `./intimation.pdf`;

                await createPDFAndSendEmail(user.EMAILID, content, pdfPath, user.EMPNO);
            }
        } else {
            console.log("No users found in TBL_UserMst.");
        }
    } catch (err) {
        console.error('Error in intimation:', err);
    }
}

async function createPDFAndSendEmail(receiverEmail, content, pdfPath, empNo) {
    try {
        const stream = await new Promise((resolve, reject) => {
            pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                if (err) reject(err);
                else resolve(stream);
            });
        });

        await new Promise((resolve, reject) => {
            stream.pipe(fs.createWriteStream(pdfPath))
                .on('finish', async () => {
                    console.log(`PDF (${pdfPath}) created successfully.`);
                    const quarterId = getCurrentQuarter(); // Get current quarter ID

                    try {
                        await sendEmailWithAttachment(receiverEmail, pdfPath, empNo, quarterId);
                        await saveMailSendLog(empNo, quarterId, receiverEmail, 'Success');
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    } catch (error) {
        console.error('Error creating PDF or sending email:', error);
    }
}

async function sendEmailWithAttachment(receiverEmail, attachmentPath, empNo, quarterId) {
    let transporter = nodemailer.createTransport({
        host: configFile.email_smtp_config.host,
        port: configFile.email_smtp_config.port,
        auth: {
            user: configFile.email_smtp_config.auth.user,
            pass: configFile.email_smtp_config.auth.pass
        }
    });

    const mailOptions = {
        from: 'newel.technical@gmail.com',
        to: receiverEmail,
        subject: 'PCOI intimation',
        text: 'Please Find The Attached File',
        attachments: [
            {
                filename: 'intimation.pdf',
                path: attachmentPath
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

async function saveMailSendLog(empNo, quarterId, receiverEmail, emailStatus) {
    const TBL_PCOI_MAIL_SEND_LOG = datamodel.TBL_PCOI_MAIL_SEND_LOG();
    const mailSendLog = {
        EMPLOYEE_ID: empNo,
        QUARTER_ID: quarterId,
        EMAILID: receiverEmail,
        EMAIL_STATUS: emailStatus
    };

    try {
        const result = await dataaccess.Create(TBL_PCOI_MAIL_SEND_LOG, mailSendLog);
        console.log('Mail send log saved:', result);
    } catch (err) {
        console.error('Error saving mail send log:', err);
    }
}

function Cheackactivequter() {
    return new Promise((resolve, reject) => {
        const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();

        var param = {
            where: {
                CurrentActive: true

            },

        };

        dataaccess.FindAll(TBL_QuarterMaster, param).then(
            function (result) {
                if (result != null && result.length > 0) {
                    let Quarterdata = JSON.stringify(result)
                    let Quarterdatafinsl = JSON.parse(Quarterdata)
                    // let StartDate = Quarterdatafinsl[0].StartDate
                    // let EndDate = Quarterdatafinsl[0].EndDate
                    // console.log("EndDate", StartDate, EndDate);
                    console.log("startdate", Quarterdatafinsl[0].StartDate);
                    console.log("enddate", Quarterdatafinsl[0].EndDate);
                    resolve(Quarterdatafinsl[0])
                } else {
                    reject()
                }
            },

        );
    })
}

module.exports = routes;

module.exports.reminder = reminder
module.exports.intimation = intimation