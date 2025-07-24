var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW } = require('sequelize');
var sequelize = connect.Sequelize;
const nodemailer = require('nodemailer');
const configFile = require('../../Config');
const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs')
const path = require("path");
const { PassThrough } = require('stream');
let responseSent = false;
var multer = require("multer");
var upload = multer();
let util = require('util')
var moment = require('moment');


var routes = function () {

    // router.route('/checkSubmit')
    //     .post(function (req, res) {
    //         const TBL_SCOI_ACCEPT_LOG = datamodel.TBL_SCOI_ACCEPT_LOG();

    //         var param = {
    //             EMPLOYEE_ID: req.body.eid
    //         };
    //         console.log("param", param);

    //         dataaccess.FindAll(TBL_SCOI_ACCEPT_LOG, param)
    //             .then(async function (result) {
    //                 console.log("result",result);
    //                 if (result != null) {
    //                     const filteredData = await result.filter(record => record.IS_ACCEPT === true);
    //                     console.log("filteredData",filteredData);
    //                     if (filteredData.length > 0) {
    //                         res.status(200).json({ Success: true, Message: 'Records found successfully', Data: filteredData });
    //                     } else {
    //                         res.status(200).json({ Success: false, Message: 'No matching records found for IS_ACCEPT: true', Data: null });
    //                     }
    //                 } else {
    //                     res.status(200).json({ Success: false, Message: 'No records found for the given EMPLOYEE_ID', Data: null });
    //                 }
    //             })
    //             .catch(function (err) {
    //                 dataconn.errorlogger('SubstantialInterestDeclaration', 'checkSubmit', err);
    //                 res.status(200).json({ Success: false, Message: 'Error finding records', Data: null });
    //             });

    //     });
    router.route('/checkSubmit')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            const TBL_SCOI_ACCEPT_LOG = datamodel.TBL_SCOI_ACCEPT_LOG();

            // var param = {
            //     EMPLOYEE_ID: req.body.eid,
            //     IS_ACCEPT: true
            // };
            var param = {
                where:
                    { EMPLOYEE_ID: encryptmodel.eid,IS_ACCEPT: true }
            };
            console.log("param", param);

            dataaccess.FindOne(TBL_SCOI_ACCEPT_LOG, param)
                .then(async function (result) {
                    console.log("result", result);
                    if (result != null) {  
                        var EncryptLoginDetails = dataconn.encryptionAES(result);                       
                            res.status(200).json({ Success: true, Message: 'Records found successfully', Data: EncryptLoginDetails });                        
                    } else {
                        res.status(200).json({ Success: false, Message: 'No records found for the given EMPLOYEE_ID', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('SubstantialInterestDeclaration', 'checkSubmit', err);
                    res.status(200).json({ Success: false, Message: 'Error finding records', Data: null });
                });
        });

    router.route('/saveAcceptResponse')
        .post(function (req, res) {
            const TBL_SCOI_ACCEPT_LOG = datamodel.TBL_SCOI_ACCEPT_LOG();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

            const newValues = {
                EMPLOYEE_ID: encryptmodel.eid,
                IS_ACCEPT: true
            };

            // Check if a record exists for the specific EMPLOYEE_ID with IS_ACCEPT as true
            dataaccess.FindAll(TBL_SCOI_ACCEPT_LOG, { EMPLOYEE_ID: encryptmodel.eid, IS_ACCEPT: true })
                .then(function (existingRecords) {
                    // If an existing record with IS_ACCEPT as true exists, update it to false
                    const filteredRecords = existingRecords.filter(record => record.IS_ACCEPT === true);

                    if (filteredRecords && filteredRecords.length > 0) {
                        const existingRecord = filteredRecords[0];
                        const updateValues = {
                            IS_ACCEPT: false
                        };
                        const param = {
                            ID: existingRecord.ID
                        };
                        console.log("existingRecord", existingRecord);
                        // Update the existing record to set IS_ACCEPT to false
                        dataaccess.Update(TBL_SCOI_ACCEPT_LOG, updateValues, param)
                            .then(function () {
                                // Create a new record with IS_ACCEPT as true
                                dataaccess.Create(TBL_SCOI_ACCEPT_LOG, newValues)
                                    .then(function (result) {
                                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                        res.status(200).json({ Success: true, Message: 'Response Saved Successfully', Data: EncryptLoginDetails });
                                    })
                                    .catch(function (err) {
                                        res.status(200).json({ Success: false, Message: 'Error creating new record', Data: null });
                                    });
                            })
                            .catch(function (err) {
                                res.status(200).json({ Success: false, Message: 'Error updating existing record', Data: null });
                            });
                    } else {
                        // If no existing record with IS_ACCEPT as true, directly create a new record
                        dataaccess.Create(TBL_SCOI_ACCEPT_LOG, newValues)
                            .then(function (result) {
                                var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                res.status(200).json({ Success: true, Message: 'Response Saved Successfully', Data: EncryptLoginDetails });
                            })
                            .catch(function (err) {
                                res.status(200).json({ Success: false, Message: 'Error creating new record', Data: null });
                            });
                    }
                })
                .catch(function (err) {
                    res.status(200).json({ Success: false, Message: 'Error finding existing record', Data: null });
                });
        });

    router.route('/GetAllRelation')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: ['SCOIRel']
                }
            };

            dataaccess.FindAll(TBL_GENERIC_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_GENERIC_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('SubstantialInterestDeclaration', 'GetAllRelation', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/GetAllNOSI')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'SCOINSI'
                }
            };

            dataaccess.FindAll(TBL_GENERIC_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_GENERIC_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('SubstantialInterestDeclaration', 'GetAllNOSI', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/saveFinalData')
        .post(async function (req, res) {            
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        
                const modelData = encryptmodel;
                // console.log("modeldata", req.body);
                const TBL_SCOI_DATA = datamodel.TBL_SCOI_DATA();
                const promises = modelData.data.map(dataObj => {
                    const values = {
                        EMPLOYEE_ID: modelData.eid,
                        NAME: dataObj.name,
                        RELATION: dataObj.relation.ID,
                        NATURE_OF_SUBSTANTIAL_INTEREST: dataObj.interest.ID,
                        DIN: dataObj.directorId,
                        PAN: dataObj.pan,
                        IS_ACTIVE: true
                    };
                    return dataaccess.Create(TBL_SCOI_DATA, values);
                });

                const results = await Promise.all(promises);

                // Check if any of the results is null
                const success = results.every(result => result !== null);


                if (success) {
                    const employeeId = modelData.eid;
                    const PdfResult = await generatePDF(employeeId);
                    var EncryptLoginDetails = dataconn.encryptionAES({ results, PdfResult });
                    res.status(200).json({ Success: true, Message: 'SubstantialInterestDeclaration saved successfully', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            } catch (err) {
                dataconn.errorlogger('SubstantialInterestDeclaration', 'saveFinalData', err);
                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
            }
        });

    async function generatePDF(employeeId) {
        try {
            const TBL_SCOI_DATA = datamodel.TBL_SCOI_DATA();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            const contactData = await dataaccess.FindAll(TBL_SCOI_DATA, {
                attributes: ['ID', 'EMPLOYEE_ID', 'NAME', 'RELATION', 'NATURE_OF_SUBSTANTIAL_INTEREST', 'DIN', 'PAN'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        as: 'Rel',
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: ['SCOIRel'],
                        },
                    },
                    {
                        model: TBL_GENERIC_MST,
                        as: 'Interest',
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: ['SCOINSI'],
                        },
                    }
                ],
            });

            const combinedData = {
                contactDetails: contactData
            };

            let Data = JSON.stringify(combinedData);
            let FinalData = JSON.parse(Data);
            let FinishData = FinalData;

            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'scoi.ejs'), 'utf8', function (err, templateContent) {
                if (err) {
                    console.log("Error reading EJS template:", err);
                } else {
                    // Render the template with student data                                
                    const content = ejs.render(templateContent, { FinishData: FinishData });


                    // Generate PDF from the rendered HTML
                    pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                        if (err) {
                            console.log("Error creating PDF:", err);
                        } else {
                            stream.pipe(fs.createWriteStream('scoi.pdf'));
                            console.log("PDF created successfully.");
                            sendMail(employeeId);
                        }
                    });
                }
            });
        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    };

    async function sendMail(employeeId) {
        const email = await connect.sequelize.query(`SELECT "EMAILID" FROM "TBL_USER_MST" WHERE "EMPNO" = '${employeeId}'`);
        console.log("emailId", email);
        const recipientEmail = email[0][0].EMAILID;

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
            to: recipientEmail,
            // cc: 'aniket.yadav@neweltechnologies.com',
            subject: 'Substantial Interest Declaration Form Details',
            text: 'Please Find The Attached File',
            attachments: [{
                filename: 'scoi.pdf',
                path: "./scoi.pdf"
            }]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

    };


    return router;
}

module.exports = routes;