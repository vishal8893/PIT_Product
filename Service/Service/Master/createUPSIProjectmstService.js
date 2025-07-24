var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
var sequelize = connect.Sequelize;
const nodemailer = require('nodemailer');
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");
const { PassThrough } = require('stream');
let responseSent = false;
var multer = require("multer");
var upload = multer();
let util = require('util')
var moment = require('moment');
var ExcelJS = require('exceljs');
const ejs = require('ejs');
const pdf = require('html-pdf');
const SendUPSIProectMail = require('../../Common/Mailer')


var routes = function () {

    // router.route('/GetAllProjectDetails')
    //     .get(function (req, res) {

    //         const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
    //         const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();

    //         var param = {
    //             where: { IS_ACTIVE: true },
    //             attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
    //             include: [
    //                 {
    //                     model: TBL_UPSI_PROJECT_MST_EMPLOYEEDATA,
    //                     attributes: ['ID', 'UPLOAD_PATH'],
    //                     where: { 
    //                         PROJECT_ID: sequelize.col('TBL_UPSI_PROJECT_MST.ID')
    //                     }
    //                 }

    //             ],
    //         };
    //         console.log("param", param);

    //         dataaccess.FindAll(TBL_UPSI_PROJECT_MST, param)
    //             .then(function (result) {
    //                 console.log("result", result);
    //                 if (result != null) {

    //                     res.status(200).json({ Success: true, Message: 'TBL_UPSI_PROJECT_MST Table Access', Data: result });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_MST Table', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('createUPSIProjectmstService', 'GetAllProjectDetails', err);
    //                 res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_MST Table', Data: null });
    //             });

    //     });

    router.route('/GetAllProjectDetails')
        .get(async function (req, res) {
            const query = `SELECT p.*,e."UPLOAD_PATH",u."ENTITY_ID",u."SBU_ID",u."LOB_ID",u."SUBLOB_ID",u."TYPE" 
                            FROM 
                            "TBL_UPSI_PROJECT_MST" p
                            LEFT JOIN 
                            "TBL_UPSI_PROJECT_MST_EMPLOYEEDATA" e ON p."ID" = e."PROJECT_ID"
                            LEFT JOIN 
                            "TBL_UPSI_PROJECT_USER_CATEGORIZATION" u ON p."ID" = u."PROJECT_ID" AND u."IS_ACTIVE" = true`;

            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) {
                        const data = result[0];
                        var EncryptLoginDetails = dataconn.encryptionAES(data); 
                        res.status(200).json({ Success: true, Message: 'UPSI Project Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access UPSI Project', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllProjectDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UPSI Project', Data: null });
                });
        });

    router.route('/GetAllProjectType')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'NatureOfTrade',
                    IS_ACTIVE: true
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
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllProjectType', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    // router.route('/CreateUPSIProjectMst')
    //     .post(function (req, res) {

    //         const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
    //         const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
    //         Script = req.body.Script;
    //         console.log("Script", Script);

    //         var values = {
    //             PROJECT_NAME: req.body.PROJECT_NAME,
    //             // SCRIPT_NAME: req.body.SCRIPT_NAME,
    //             // ISIN: req.body.ISIN,
    //             STARTDATE: req.body.STARTDATE,
    //             ENDDATE: req.body.ENDDATE,
    //             IS_EQUITY: req.body.IS_EQUITY,
    //             IS_DEPT: req.body.IS_DEPT,
    //             TEAM: null,
    //             TEAMS: req.body.team,
    //             PTYPES: req.body.Type,
    //             IS_ACTIVE: true,

    //         };

    //         dataaccess.Create(TBL_UPSI_PROJECT_MST, values)
    //             .then(async function (result) {
    //                 if (result != null) {
    //                     const IDs = result.ID;
    //                     console.log("IDs", IDs);
    //                     if (Script && Script.length > 0) {
    //                         // const createdScripts = [];

    //                         for (const scriptData of Script) {
    //                             const queryConditions = {
    //                                 where: {
    //                                     SCRIPT_NAME: scriptData.SCRIPT_NAME,
    //                                     PROJECT_ID: IDs,
    //                                     IS_ACTIVE: true
    //                                 }
    //                             };
    //                             const existingScript = dataaccess.FindOne(TBL_UPSI_PROJECT_SCRIPT_DETAILS, queryConditions);


    //                             if (!existingScript) {
    //                                 var values = {
    //                                     PROJECT_ID: IDs,
    //                                     SCRIPT_NAME: scriptData.SCRIPT_NAME,
    //                                     ISIN: scriptData.ISIN,
    //                                     IS_ACTIVE: true,

    //                                 };


    //                                 await dataaccess.Create(TBL_UPSI_PROJECT_SCRIPT_DETAILS, values);

    //                             }
    //                         }
    //                         res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: result });
    //                     } else {
    //                         res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: result });
    //                     }
    //                 }
    //                 else {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('createUPSIProjectmstService', 'CreateUPSIProjectMst', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             });
    //     });

    router.route('/CreateUPSIProjectMst')
        .post(async function (req, res) {
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const Script = encryptmodel.Script;
            console.log("Script", Script);

            const values = {
                PROJECT_NAME: encryptmodel.PROJECT_NAME,
                // SCRIPT_NAME: req.body.SCRIPT_NAME,
                // ISIN: req.body.ISIN,
                STARTDATE: encryptmodel.STARTDATE,
                ENDDATE: encryptmodel.ENDDATE,
                IS_EQUITY: encryptmodel.IS_EQUITY,
                IS_DEPT: encryptmodel.IS_DEPT,
                TEAM: null,
                TEAMS: encryptmodel.team,
                PTYPES: encryptmodel.Type,
                IS_ACTIVE: true,
            };

            try {
                const result = await dataaccess.Create(TBL_UPSI_PROJECT_MST, values);

                if (result != null && result.ID) {
                    const IDs = result.ID;
                    console.log("IDs", IDs);

                    if (Script && Script.length > 0) {
                        for (const scriptData of Script) {
                            const queryConditions = {
                                where: {
                                    SCRIPT_NAME: scriptData.SCRIPT_NAME,
                                    PROJECT_ID: IDs,
                                    IS_ACTIVE: true
                                }
                            };

                            const existingScript = await dataaccess.FindOne(TBL_UPSI_PROJECT_SCRIPT_DETAILS, queryConditions);

                            if (!existingScript) {
                                const scriptValues = {
                                    PROJECT_ID: IDs,
                                    SCRIPT_NAME: scriptData.SCRIPT_NAME,
                                    ISIN: scriptData.ISIN,
                                    IS_ACTIVE: true,
                                };

                                await dataaccess.Create(TBL_UPSI_PROJECT_SCRIPT_DETAILS, scriptValues);
                            }
                        }
                    }
                    var EncryptLoginDetails = dataconn.encryptionAES(result); 
                    res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                }
            } catch (err) {
                dataconn.errorlogger('createUPSIProjectmstService', 'CreateUPSIProjectMst', err);
                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
            }
        });

    router.route('/UpdateUPSIProjectMst')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            // console.log("data", req.body);
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            var values = {
                PROJECT_NAME: encryptmodel.PROJECT_NAME,
                // SCRIPT_NAME: req.body.SCRIPT_NAME,
                // ISIN: req.body.ISIN,
                STARTDATE: encryptmodel.STARTDATE,
                ENDDATE: encryptmodel.ENDDATE,
                IS_EQUITY: encryptmodel.IS_EQUITY,
                IS_DEPT: encryptmodel.IS_DEPT,
                TEAM: null,
                TEAMS: encryptmodel.team,
                PTYPES: encryptmodel.Type,
                IS_ACTIVE: true,

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_UPSI_PROJECT_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_UPSI_PROJECT_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'UpdateUPSIProjectMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteUPSIProjectMstById')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);              

            const projectId = encryptmodel.ID;

            // console.log("body", req.body);
            var param = {
                ID: encryptmodel.ID
            };

            console.log("param", param);
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();

            dataaccess.Update(TBL_UPSI_PROJECT_MST, { IS_ACTIVE: false }, param)
                .then(async function (result) {
                    if (result != null) {
                        const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();

                        var dpAccountParam = {
                            PROJECT_ID: encryptmodel.ID,
                        };


                        dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, dpAccountParam)
                            .then(function (result1) {
                                if (result1 != null) {

                                    const TBL_PROJECT_EMPLOYEE_DETAILS = datamodel.TBL_PROJECT_EMPLOYEE_DETAILS();

                                    var dpAccountParam = {
                                        PROJECT_ID: encryptmodel.ID,
                                    };


                                    dataaccess.Update(TBL_PROJECT_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, dpAccountParam)
                                        .then(async function (result2) {
                                            if (result2 != null) {
                                                const TBL_UPSI_PROJECT_USER_CATEGORIZATION = datamodel.TBL_UPSI_PROJECT_USER_CATEGORIZATION();

                                                var dpAccountParam = {
                                                    PROJECT_ID: encryptmodel.ID,
                                                };


                                                dataaccess.Update(TBL_UPSI_PROJECT_USER_CATEGORIZATION, { IS_ACTIVE: false }, dpAccountParam)
                                                    .then(async function (result3) {
                                                        if (result3 != null) {
                                                            try {
                                                                await sendUnBlockingEmails(projectId);

                                                                // If sendBlockingEmails completes without throwing an error, assume success
                                                                var EncryptLoginDetails = dataconn.encryptionAES(null);                       
                                                                res.status(200).json({ Success: true, Message: 'Project ended Succefully,Please check mail', Data: EncryptLoginDetails });
                                                            } catch (error) {
                                                                console.error('Error sending Unblocking emails:', error);

                                                                // If an error occurs, send an error response
                                                                res.status(200).json({ Success: false, Message: 'Error sending Unblocking emails', Data: null });
                                                            }
                                                        }
                                                        else {
                                                            res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_USER_CATEGORIZATION Table', Data: null });
                                                        }
                                                    })
                                            }
                                            else {
                                                res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PROJECT_EMPLOYEE_DETAILS Table', Data: null });
                                            }
                                        })
                                    // res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: null });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_MST_EMPLOYEEDATA Table', Data: null });
                                }
                            })
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'DeleteUPSIProjectMstById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_MST Table', Data: null });
                });
        });

    router.route("/CheckDuplicateUpsi/:Value/:Id")
        .get(function (req, res) {
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            var param = {
                where: {
                    // PROJECT_NAME: req.params.Value,
                    [sequelize.Op.or]: [
                        sequelize.where(sequelize.fn('LOWER', sequelize.col('PROJECT_NAME')), '=', req.params.Value.toLowerCase()),
                        sequelize.where(sequelize.fn('UPPER', sequelize.col('PROJECT_NAME')), '=', req.params.Value.toUpperCase())
                    ],
                    ID: { [connect.Op.ne]: req.params.Id, },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("APPL_ID")), "Count",],
                ],
            };
            dataaccess.FindAll(TBL_UPSI_PROJECT_MST, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: "PROJECT_NAME already exists", Data: true, });
                    } else {
                        res.status(200).json({ Success: false, Message: "PROJECT_NAME does not exists", Data: false, });
                    }
                }, function (err) {
                    dataconn.errorlogger("createUPSIProjectmstService", "CheckDuplicateUpsi", err);
                    res.status(200).json({ Success: false, Message: "User has no access of createUPSIProjectmstService", Data: null, });
                }
            );
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const BranchMst = datamodel.TBL_UPSI_PROJECT_MST();
            var param = {
                where: {
                    // PROJECT_NAME: req.body.PROJECT_NAME,
                    [sequelize.Op.or]: [
                        sequelize.where(sequelize.fn('LOWER', sequelize.col('PROJECT_NAME')), '=', encryptmodel.PROJECT_NAME.toLowerCase()),
                        sequelize.where(sequelize.fn('UPPER', sequelize.col('PROJECT_NAME')), '=', encryptmodel.PROJECT_NAME.toUpperCase())
                    ],
                    ID: { [connect.Op.ne]: encryptmodel.ID, },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("PROJECT_NAME")), "Count"],
                ]
            };
            console.log("Param", param);

            dataaccess.FindAll(BranchMst, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: "PROJECT_NAME already exists", Data: true, });
                    } else {
                        res.status(200).json({ Success: false, Message: "PROJECT_NAME does not exists", Data: false, });
                    }
                }, function (err) {
                    dataconn.errorlogger("createUPSIProjectmstService", "CheckDuplicateUpsi", err);
                    res.status(200).json({ Success: false, Message: "User has no access of PROJECT_NAME", Data: null, });
                }
            );

        });

    router.route('/SaveUploadFile')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'UploadFiles'); // Use the existing folder path

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);
                const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
                const projectRecord2 = await TBL_UPSI_PROJECT_MST.findOne({
                    attributes: ['ID', 'ISIN'], // Select the ID field
                    where: {
                        ID: requestBody.PROJECT_NAME,
                        IS_ACTIVE: true,
                    }
                });
                const projectId2 = projectRecord2.ID;
                // const isin_no = projectRecord2.ISIN;
                // let newFileName = fileDetails[i].originalname
                let newFileName = `${projectId2}_${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                // writeFile(path.join(Folder_Path, newFileName), fileDetails[i].buffer); // Use the existing folder path
                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path


                if (fs.existsSync(filePath)) {
                    writeFile(filePath, fileDetails[i].buffer);
                    const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();
                    dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { UPLOAD_PATH: filePath }, { PROJECT_ID: projectId2, IS_ACTIVE: true })
                        .then(async function (result3) {
                            if (result3 != null) {
                                const TBL_PROJECT_EMPLOYEE_DETAILS = datamodel.TBL_PROJECT_EMPLOYEE_DETAILS();
                                dataaccess.Update(TBL_PROJECT_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId2 })
                                    .then(async function (result) {
                                        if (result != null) {
                                            const workbook = new ExcelJS.Workbook();
                                            await workbook.xlsx.readFile(filePath);
                                            const worksheet = workbook.getWorksheet(1);
                                            try {
                                                for (let i = 2; i <= worksheet.rowCount; i++) {
                                                    const employeeName = worksheet.getRow(i).values[1];
                                                    const employeeId = worksheet.getRow(i).values[2];

                                                    console.log(`Cell values at row ${i}:`, employeeName, employeeId);
                                                    console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                                    // Insert data into the database
                                                    await connect.sequelize.query(`INSERT INTO "TBL_PROJECT_EMPLOYEE_DETAILS"("EMPLOYEE_NAME", "EMPLOYEE_ID","PROJECT_ID","ISIN","IS_ACTIVE","CREATED_ON") VALUES('${employeeName}', '${employeeId}', ${projectId2}, 'null', 'true','${sequelize.NOW}')`);

                                                }
                                                // Now, call generateEduPDF function
                                                // const upsiProjectPdfResult = await generateUPSIProjectPdf(projectId2);
                                                res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
                                            } catch (error) {
                                                // Handle errors and send an error response
                                                console.error(error);
                                                res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                                            }
                                        }
                                        else {
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('createUPSIProjectmstService', 'SaveUploadFile', err);
                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    });
                            } else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        }, function (err) {
                            dataconn.errorlogger('createUPSIProjectmstService', 'SaveUploadFile', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        });


                } else {
                    writeFile(filePath, fileDetails[i].buffer);
                    try {
                        // Assuming you have a Sequelize model for TBL_UPSI_PROJECT_MST, update this accordingly
                        const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();

                        // Perform a database query to find the ID based on name and eid
                        const projectRecord = await TBL_UPSI_PROJECT_MST.findOne({
                            attributes: ['ID', 'ISIN'], // Select the ID field
                            where: {
                                ID: requestBody.PROJECT_NAME,
                                IS_ACTIVE: true,
                            }
                        });

                        if (projectRecord) {
                            // The projectRecord will contain the ID
                            const projectId = projectRecord.ID;
                            // const isin_no1 = projectRecord.ISIN;
                            console.log('Project ID:', projectId);

                            const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();
                            var values = {
                                UPLOAD_PATH: filePath,
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            };
                            var values1 = {
                                UPLOAD_PATH: filePath,
                            };
                            var param = {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true,
                            };
                            const projectRecord1 = await TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.findOne({
                                attributes: ['PROJECT_ID'], // Select the ID field
                                where: {
                                    PROJECT_ID: projectId,
                                    IS_ACTIVE: true,
                                }
                            });
                            if (projectRecord1) {
                                dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, values1, param)
                                    .then(async function (result) {
                                        if (result != null) {
                                            const TBL_PROJECT_EMPLOYEE_DETAILS = datamodel.TBL_PROJECT_EMPLOYEE_DETAILS();
                                            dataaccess.Update(TBL_PROJECT_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId })
                                                .then(async function (result1) {
                                                    if (result1 != null) {
                                                        const workbook = new ExcelJS.Workbook();
                                                        await workbook.xlsx.readFile(filePath);
                                                        const worksheet = workbook.getWorksheet(1);
                                                        try {
                                                            for (let i = 2; i <= worksheet.rowCount; i++) {
                                                                const employeeName = worksheet.getRow(i).values[1];
                                                                const employeeId = worksheet.getRow(i).values[2];

                                                                console.log(`Cell values at row ${i}:`, employeeName, employeeId);
                                                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);



                                                                // Insert data into the database
                                                                await connect.sequelize.query(`INSERT INTO "TBL_PROJECT_EMPLOYEE_DETAILS"("EMPLOYEE_NAME", "EMPLOYEE_ID","PROJECT_ID","ISIN","IS_ACTIVE","CREATED_ON") VALUES('${employeeName}', '${employeeId}', ${projectId}, 'null', 'true','${sequelize.NOW}')`);

                                                            }

                                                            // Now, call generateEduPDF function
                                                            // const upsiProjectPdfResult = await generateUPSIProjectPdf(projectId);


                                                            // Move the response outside of the loop
                                                            res.status(200).json({ Success: true, Message: 'UPSI Project employeedata saved successfully', Data: filePath });
                                                        } catch (error) {
                                                            // Handle errors and send an error response
                                                            console.error(error);
                                                            res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                                                        }
                                                    }
                                                })

                                            // res.status(200).json({ Success: true, Message: 'upsiemployeedata saved successfully', Data: result });
                                        }
                                        else {
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('createUPSIProjectmstService', 'SaveUploadFile', err);
                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    });
                            } else {
                                dataaccess.Create(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, values)
                                    .then(async function (result) {
                                        if (result != null) {
                                            const workbook = new ExcelJS.Workbook();
                                            await workbook.xlsx.readFile(filePath);
                                            const worksheet = workbook.getWorksheet(1);
                                            try {
                                                for (let i = 2; i <= worksheet.rowCount; i++) {
                                                    const employeeName = worksheet.getRow(i).values[1];
                                                    const employeeId = worksheet.getRow(i).values[2];

                                                    console.log(`Cell values at row ${i}:`, employeeName, employeeId);
                                                    console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);



                                                    // Insert data into the database
                                                    await connect.sequelize.query(`INSERT INTO "TBL_PROJECT_EMPLOYEE_DETAILS"("EMPLOYEE_NAME", "EMPLOYEE_ID","PROJECT_ID","ISIN","IS_ACTIVE","CREATED_ON") VALUES('${employeeName}', '${employeeId}', ${projectId}, 'null', 'true','${sequelize.NOW}')`);

                                                }

                                                // Now, call generateEduPDF function
                                                // const upsiProjectPdfResult = await generateUPSIProjectPdf(projectId);

                                                // Move the response outside of the loop
                                                res.status(200).json({ Success: true, Message: 'UPSI Project employeedata saved successfully', Data: filePath });
                                            } catch (error) {
                                                // Handle errors and send an error response
                                                console.error(error);
                                                res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
                                            }

                                        }
                                        else {
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('createUPSIProjectmstService', 'SaveUploadFile', err);
                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    });
                            }
                        } else {
                            // Handle the case where no record is found
                            console.log('Project not found.');
                            res.status(200).json({ Success: false, Message: 'Project not found', Data: null });
                            return; // Exit the function early
                        }
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
                    }
                }
            }
        });

    router.route('/DownloadFile')
        .post(async function (req, res) {
            const fileName = req.body.filename;
            const filePath = path.join(__dirname, 'UploadFiles', fileName);
            console.log("filePath", filePath);

            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                res.status(404).json({ Success: false, Message: 'File not found', Data: null });
            }
        });

    router.route('/DownloadFile1')
        .post(async function (req, res) {
            const fileName = req.body.filename;
            const filePath = path.join(__dirname, 'AuditFiles', fileName);
            console.log("filePath", filePath);

            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                res.status(404).json({ Success: false, Message: 'File not found', Data: null });
            }
        });

    router.route('/generateblocking')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                        
                const projectId = encryptmodel.ID;
                const entity = encryptmodel.EntityID;
                const sbu = encryptmodel.SbuID;
                if (entity != null || sbu != null) {

                    const TBL_UPSI_PROJECT_USER_CATEGORIZATION = datamodel.TBL_UPSI_PROJECT_USER_CATEGORIZATION();
                    const TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();
                    const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();
                    const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();

                    const dlt1 = await dataaccess.Update(TBL_UPSI_PROJECT_USER_CATEGORIZATION, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                    const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                    const SecHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_MST, {
                        attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
                        where: { ID: projectId, IS_ACTIVE: true }
                    });

                    const ISIN = SecHoldData[0].dataValues.ISIN;

                    var values = {
                        PROJECT_ID: encryptmodel.ID,
                        ISIN: ISIN,
                        ENTITY_ID: encryptmodel.EntityID,
                        SBU_ID: encryptmodel.SbuID,
                        LOB_ID: encryptmodel.LobID,
                        SUBLOB_ID: encryptmodel.SubLobID,
                        TYPE: encryptmodel.type,
                        IS_ACTIVE: true,

                    };

                    dataaccess.Create(TBL_UPSI_PROJECT_USER_CATEGORIZATION, values)
                        .then(async function (result) {
                            if (result != null) {
                                console.log("result", result);
                                const Eid = result.ID;
                                console.log("Eid", Eid);
                                const Entity = result.ENTITY_ID;
                                console.log("Entity", Entity);

                                if (Entity != null) {
                                    const TBL_USER_MST = datamodel.TBL_USER_MST();

                                    const UserData = await dataaccess.FindAll(TBL_USER_MST, {
                                        attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ENTITY', 'SBU'],
                                        where: { ENTITY: encryptmodel.EntityID, ISACTIVE: true }
                                    });
                                    if (UserData && UserData.length > 0) {

                                        const TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();

                                        try {
                                            const insertResults = [];
                                            for (const user of UserData) {
                                                const values = {
                                                    PROJECT_ID: projectId,
                                                    UPSI_USER_CAT_ID: Eid,
                                                    ISIN: ISIN,
                                                    EMPLOYEE_ID: user.EMPNO,
                                                    EMPLOYEE_NAME: user.FIRSTNAME,
                                                    IS_ACTIVE: true,
                                                };

                                                const result = await dataaccess.Create(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, values);
                                                insertResults.push(result);
                                            }
                                            await sendBlockingEmails(projectId);
                                            // If sendBlockingEmails completes without throwing an error, assume success
                                            // res.status(200).json({ Success: true, Message: 'Mail Send Successfully', Data: null });
                                            var EncryptLoginDetails = dataconn.encryptionAES(insertResults);
                                            res.status(200).json({ Success: true, Message: 'upsiproject Entity Employee data saved and Mail Send successfully', Data: EncryptLoginDetails });
                                        } catch (err) {
                                            dataconn.errorlogger('createUPSIProjectmstService', 'generateblocking', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                        }
                                    } else {
                                        res.status(200).json({ Success: false, Message: 'No user data found', Data: null });
                                    }
                                }
                                else {
                                    const TBL_USER_MST = datamodel.TBL_USER_MST();

                                    const UserData1 = await dataaccess.FindAll(TBL_USER_MST, {
                                        attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ENTITY', 'SBU'],
                                        where: { SBU: encryptmodel.SbuID, ISACTIVE: true }
                                    });

                                    if (UserData1 && UserData1.length > 0) {

                                        const TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();

                                        try {
                                            const insertResults = [];
                                            for (const user of UserData1) {
                                                const values = {
                                                    PROJECT_ID: projectId,
                                                    UPSI_USER_CAT_ID: Eid,
                                                    ISIN: ISIN,
                                                    EMPLOYEE_ID: user.EMPNO,
                                                    EMPLOYEE_NAME: user.FIRSTNAME,
                                                    IS_ACTIVE: true,
                                                };

                                                const result = await dataaccess.Create(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, values);
                                                insertResults.push(result);
                                            }
                                            await sendBlockingEmails(projectId);
                                            var EncryptLoginDetails = dataconn.encryptionAES(insertResults);
                                            res.status(200).json({ Success: true, Message: 'upsiproject SBU Employee data saved successfully', Data: EncryptLoginDetails });
                                        } catch (err) {
                                            dataconn.errorlogger('createUPSIProjectmstService', 'generateblocking', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                        }
                                    } else {
                                        res.status(200).json({ Success: false, Message: 'No user data found', Data: null });
                                    }

                                    // res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            } else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                            }
                        }, function (err) {
                            dataconn.errorlogger('createUPSIProjectmstService', 'generateblocking', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        });
                } else {
                    await sendBlockingEmails(projectId);
                    // If sendBlockingEmails completes without throwing an error, assume success
                    // res.status(200).json({ Success: true, Message: 'Mail Send Successfully', Data: null });
                    var EncryptLoginDetails = dataconn.encryptionAES(projectId);
                    res.status(200).json({ Success: true, Message: 'upsiproject Entity Employee data saved and Mail Send successfully', Data: EncryptLoginDetails });
                }
            } catch (error) {
                console.error('Error sending blocking emails:', error);

                // If an error occurs, send an error response
                res.status(200).json({ Success: false, Message: 'Error sending blocking emails', Data: null });
            }
        });

    // async function generateUPSIProjectPdf(projectId) {
    //     try {
    //         const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
    //         const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();

    //         const SecHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_MST, {
    //             attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
    //             where: { ID: projectId }
    //         });

    //         const projectData = await TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.findOne({
    //             attributes: ['PROJECT_ID', 'UPLOAD_PATH'],
    //             where: {
    //                 PROJECT_ID: projectId,
    //                 // IS_ACTIVE: true,
    //             }
    //         });

    //         const filePath = projectData.UPLOAD_PATH;

    //         const workbook = new ExcelJS.Workbook();
    //         await workbook.xlsx.readFile(filePath);
    //         const worksheet = workbook.getWorksheet(1);

    //         const employeeData = [];

    //         for (let i = 2; i <= worksheet.rowCount; i++) {
    //             const employeeName = worksheet.getRow(i).values[1];
    //             const employeeId = worksheet.getRow(i).values[2];

    //             console.log(`Cell values at row ${i}:`, employeeName, employeeId);
    //             console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

    //             const employee = {
    //                 EMPLOYEE_ID: employeeId,
    //                 EMPLOYEE_NAME: employeeName,
    //             };

    //             employeeData.push(employee);

    //             console.log("employeeData", employeeData);

    //         }

    //         const combinedData = {
    //             SecHold: SecHoldData,
    //             phsical: employeeData
    //         };

    //         console.log("combinedData", combinedData);

    //         let Data = JSON.stringify(combinedData)
    //         let FinalData = JSON.parse(Data)
    //         let FinishData = FinalData
    //         console.log("FinishData", FinishData);
    //         fs.readFile(path.join(__dirname, '..', '..', 'Template', 'UPSIProject.ejs'), 'utf8', function (err, templateContent) {
    //             if (err) {
    //                 console.log("Error reading EJS template:", err);
    //             } else {
    //                 // Render the template with student data                                
    //                 const content = ejs.render(templateContent, { FinishData: FinishData });


    //                 // Generate PDF from the rendered HTML
    //                 pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
    //                     if (err) {
    //                         console.log("Error creating PDF:", err);
    //                     } else {
    //                         stream.pipe(fs.createWriteStream('UPSIProject.pdf'));
    //                         console.log("PDF created successfully.");
    //                         SendUPSIProectMail.SendUPSIProectMail('upsiProject')
    //                         // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
    //                     }
    //                 });
    //             }
    //         });

    //     } catch (err) {
    //         console.error("Error:", err);
    //         // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
    //     }
    // }

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

    async function getEmailFromDatabase(empId) {

        const email = await connect.sequelize.query(`SELECT "EMAILID" FROM "TBL_USER_MST" WHERE "EMPNO" = '${empId}'`);
        return email;
    }

    async function sendBlockingEmails(projectId) {
        try {
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();
            const TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();
            const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();
            const TBL_UPSI_EMPLOYEE_DETAILS = datamodel.TBL_UPSI_EMPLOYEE_DETAILS();
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            const TBL_UPSI_AUDITOR_FILE_SAVE = datamodel.TBL_UPSI_AUDITOR_FILE_SAVE();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const employeeData = [];
            const employeeData1 = [];
            const employeeData2 = [];
            const employeeData3 = [];

            const SecHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_MST, {
                attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
                where: { ID: projectId }
            });
            const PROJECT_NAME = SecHoldData[0].dataValues.PROJECT_NAME;
            // const SCRIPT_NAME = SecHoldData[0].dataValues.SCRIPT_NAME;

            console.log("SecHoldData", SecHoldData);


            const ScriptHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_SCRIPT_DETAILS, {
                attributes: ['ID', 'PROJECT_ID', 'SCRIPT_NAME', 'ISIN', 'IS_ACTIVE'],
                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
            });

            console.log("ScriptHoldData", ScriptHoldData);
            const scriptNamesArray = ScriptHoldData.map(data => data.dataValues.SCRIPT_NAME);

            // Joining script names with a comma and space
            const scriptNamesString = scriptNamesArray.join(', ');

            console.log("Script Names Array:", scriptNamesArray);
            console.log("Script Names String:", scriptNamesString);

            const projectData = await TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.findOne({
                attributes: ['PROJECT_ID', 'UPLOAD_PATH'],
                where: {
                    PROJECT_ID: projectId,
                }
            });



            if (projectData && projectData.UPLOAD_PATH != null) {
                const filePath = projectData.UPLOAD_PATH;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(filePath);
                const worksheet = workbook.getWorksheet(1);

                // const employeeData = [];

                for (let i = 2; i <= worksheet.rowCount; i++) {
                    const employeeName = worksheet.getRow(i).values[1];
                    const employeeId = worksheet.getRow(i).values[2];

                    console.log(`Cell values at row ${i}:`, employeeName, employeeId);
                    console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                    try {
                        const emailIdArray = await getEmailFromDatabase(employeeId);

                        // Check if the array is not empty and the nested object exists
                        const emailId = emailIdArray.length > 0 && emailIdArray[0][0] ? emailIdArray[0][0].EMAILID : null;

                        console.log("Raw emailId from the database:", emailId);

                        const employee = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_NAME: employeeName,
                            EMAIL_ID: emailId,
                        };

                        employeeData.push(employee);

                        console.log("employeeData", employeeData);
                    } catch (error) {
                        console.error("Error fetching email from the database:", error);
                    }


                }

                const entityEmployeeData = await TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA.findAll({
                    attributes: ['EMPLOYEE_ID', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                    where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                });

                console.log("entityEmployeeData", entityEmployeeData);

                if (entityEmployeeData != null) {
                    // const employeeData1 = [];

                    for (const data of entityEmployeeData) {
                        const { EMPLOYEE_ID, EMPLOYEE_NAME } = data;
                        const emailIdArray1 = await getEmailFromDatabase(EMPLOYEE_ID);
                        const emailId = emailIdArray1.length > 0 && emailIdArray1[0][0] ? emailIdArray1[0][0].EMAILID : null;

                        const employee = {
                            EMPLOYEE_ID: EMPLOYEE_ID,
                            EMPLOYEE_NAME: EMPLOYEE_NAME,
                            EMAIL_ID: emailId,
                        };

                        employeeData1.push(employee);
                        console.log("employeeData1", employeeData1);
                    }


                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                            const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                            const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                            const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                            const pan = worksheet1.getRow(i).values[4]; //'PAN',
                            const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                            const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                            const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                            const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                            const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                            const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                            const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                            const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                            console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            try {

                                const user = await TBL_USER_MST.findOne({
                                    attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                    where: { FIRSTNAME: sgharedby }
                                });
                            
                                if (user) {
                                    const { EMAILID: USER_EMAILID } = user;
                            
                                    const employee = {
                                        EMPLOYEE_ID: employeeId,
                                        EMPLOYEE_NAME: employeeName,
                                        EMAIL_ID: USER_EMAILID,
                                    };
                            
                                    employeeData3.push(employee);

                                    console.log("employeeData3", employeeData3);
                                }
                                

                                
                            } catch (error) {
                                console.error("Error fetching email from the database:", error);
                            }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }

                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });



                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }

                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, employeeData1];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                         <style>
                                             table {
                                                 border-collapse: collapse;
                                                 }             
                                             tr td {
                                                 padding: 5px;
                                                 }            
                                             tr th {
                                                 padding: 5px;
                                                 }            
                                             body {
                                                 font-family: calibri;
                                                 font-size: 15px;
                                                 color: #09095d;
                                                 }
                                         </style>            
                                         <body>
                                             <p> Dear ${EmpName},</p>
                                             <p>
                                                 You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                 This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                 has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                 securities of Newel Technologies Pvt. Ltd.
                                             </p>
                                             <p>
                                                 For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                 with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                             </p>
                                             <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                             <br />
                                             Regards,<br />
                                             Compliance Team
                                             <br><br>
                                         </body>
                                     </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    }


                } else {
                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData2, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }

                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData2];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });


                        if (projectData1 && projectData1.UPLOADFILE != null) {

                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                         <style>
                                             table {
                                                 border-collapse: collapse;
                                                 }             
                                             tr td {
                                                 padding: 5px;
                                                 }            
                                             tr th {
                                                 padding: 5px;
                                                 }            
                                             body {
                                                 font-family: calibri;
                                                 font-size: 15px;
                                                 color: #09095d;
                                                 }
                                         </style>            
                                         <body>
                                             <p> Dear ${EmpName},</p>
                                             <p>
                                                 You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                 This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                 has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                 securities of Newel Technologies Pvt. Ltd.
                                             </p>
                                             <p>
                                                 For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                 with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                             </p>
                                             <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                             <br />
                                             Regards,<br />
                                             Compliance Team
                                             <br><br>
                                         </body>
                                     </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    }
                }


            } else {
                const entityEmployeeData = await TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA.findAll({
                    attributes: ['EMPLOYEE_ID', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                    where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                });

                console.log("entityEmployeeData", entityEmployeeData);

                if (entityEmployeeData != null) {
                    // const employeeData1 = [];

                    for (const data of entityEmployeeData) {
                        const { EMPLOYEE_ID, EMPLOYEE_NAME } = data;
                        const emailIdArray1 = await getEmailFromDatabase(EMPLOYEE_ID);
                        const emailId = emailIdArray1.length > 0 && emailIdArray1[0][0] ? emailIdArray1[0][0].EMAILID : null;

                        const employee = {
                            EMPLOYEE_ID: EMPLOYEE_ID,
                            EMPLOYEE_NAME: EMPLOYEE_NAME,
                            EMAIL_ID: emailId,
                        };

                        employeeData1.push(employee);
                        console.log("employeeData1", employeeData1);
                    }


                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData1, ...employeeData2, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }

                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData1, ...employeeData2];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });


                        if (projectData1 && projectData1.UPLOADFILE != null) {

                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }



                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData1, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData1];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                         <style>
                                             table {
                                                 border-collapse: collapse;
                                                 }             
                                             tr td {
                                                 padding: 5px;
                                                 }            
                                             tr th {
                                                 padding: 5px;
                                                 }            
                                             body {
                                                 font-family: calibri;
                                                 font-size: 15px;
                                                 color: #09095d;
                                                 }
                                         </style>            
                                         <body>
                                             <p> Dear ${EmpName},</p>
                                             <p>
                                                 You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                 This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                 has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                 securities of Newel Technologies Pvt. Ltd.
                                             </p>
                                             <p>
                                                 For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                 with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                             </p>
                                             <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                             <br />
                                             Regards,<br />
                                             Compliance Team
                                             <br><br>
                                         </body>
                                     </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    }


                } else {
                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                try {

                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });

                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;

                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };

                                        employeeData3.push(employee);

                                        console.log("employeeData3", employeeData3);
                                    }



                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData2, ...employeeData3];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }

                        } else {
                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData2];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            const uniqueEmployeeMap = new Map();

                            // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                            const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                if (!uniqueEmployeeMap.has(employeeId)) {
                                    uniqueEmployeeMap.set(employeeId, true);
                                    return true;
                                }
                                return false;
                            });

                            console.log("Filtered Employee Data:", filteredEmployeeData);

                            const newEmployeeArray = [...filteredEmployeeData];

                            console.log("New Employee Array:", newEmployeeArray);


                            for (const employee of newEmployeeArray) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                            }
                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        const filePath5 = projectData1.UPLOADFILE;
                        console.log("filePath1", filePath5);

                        const workbook1 = new ExcelJS.Workbook();
                        await workbook1.xlsx.readFile(filePath5);
                        const worksheet1 = workbook1.getWorksheet(1);

                        // const employeeData3 = [];

                        for (let i = 2; i <= worksheet1.rowCount; i++) {
                            // const employeeName = worksheet1.getRow(i).values[1];
                            // const employeeId = worksheet1.getRow(i).values[2];
                            // const emailId = worksheet1.getRow(i).values[3];
                            const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                            const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                            const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                            const pan = worksheet1.getRow(i).values[4]; //'PAN',
                            const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                            const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                            const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                            const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                            const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                            const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                            const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                            const entity = worksheet1.getRow(i).values[12]; // 'Entity'

                            console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            // try {
                            //     const employee = {
                            //         EMPLOYEE_ID: employeeId,
                            //         EMPLOYEE_NAME: employeeName,
                            //         EMAIL_ID: emailId.text,
                            //     };

                            //     employeeData3.push(employee);

                            //     console.log("employeeData3", employeeData3);
                            // } catch (error) {
                            //     console.error("Error fetching email from the database:", error);
                            // }
                            try {

                                const user = await TBL_USER_MST.findOne({
                                    attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                    where: { FIRSTNAME: sgharedby }
                                });

                                if (user) {
                                    const { EMAILID: USER_EMAILID } = user;

                                    const employee = {
                                        EMPLOYEE_ID: employeeId,
                                        EMPLOYEE_NAME: employeeName,
                                        EMAIL_ID: USER_EMAILID,
                                    };

                                    employeeData3.push(employee);

                                    console.log("employeeData3", employeeData3);
                                }



                            } catch (error) {
                                console.error("Error fetching email from the database:", error);
                            }


                        }

                        // Merge the contents of employeeData and employeeData1 arrays
                        const mergedEmployeeData = [...employeeData3];

                        console.log("Merged Employee Data:", mergedEmployeeData);

                        const uniqueEmployeeMap = new Map();

                        // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                        const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                            const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                            if (!uniqueEmployeeMap.has(employeeId)) {
                                uniqueEmployeeMap.set(employeeId, true);
                                return true;
                            }
                            return false;
                        });

                        console.log("Filtered Employee Data:", filteredEmployeeData);

                        const newEmployeeArray = [...filteredEmployeeData];

                        console.log("New Employee Array:", newEmployeeArray);


                        for (const employee of newEmployeeArray) {
                            const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                            const mailBody = `  <html>
                                        <style>
                                            table {
                                                border-collapse: collapse;
                                                }             
                                            tr td {
                                                padding: 5px;
                                                }            
                                            tr th {
                                                padding: 5px;
                                                }            
                                            body {
                                                font-family: calibri;
                                                font-size: 15px;
                                                color: #09095d;
                                                }
                                        </style>            
                                        <body>
                                            <p> Dear ${EmpName},</p>
                                            <p>
                                                You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                                This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                                has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                                securities of Newel Technologies Pvt. Ltd.
                                            </p>
                                            <p>
                                                For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                                with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                            </p>
                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                            <br />
                                            Regards,<br />
                                            Compliance Team
                                            <br><br>
                                        </body>
                                    </html>`;
                            await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

                        }




                    }
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendUnBlockingEmails(projectId) {
        try {
            // const projectId = req.body.ID;
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();
            const TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();
            const TBL_UPSI_EMPLOYEE_DETAILS = datamodel.TBL_UPSI_EMPLOYEE_DETAILS();
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();
            const TBL_UPSI_AUDITOR_FILE_SAVE = datamodel.TBL_UPSI_AUDITOR_FILE_SAVE();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const employeeData = [];
            const employeeData1 = [];
            const employeeData2 = [];
            const employeeData3 = [];
            const employeeData4 = [];

            const SecHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_MST, {
                attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
                where: { ID: projectId }
            });
            const PROJECT_NAME = SecHoldData[0].dataValues.PROJECT_NAME;
            // const SCRIPT_NAME = SecHoldData[0].dataValues.SCRIPT_NAME;

            console.log("SecHoldData", SecHoldData);


            const ScriptHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_SCRIPT_DETAILS, {
                attributes: ['ID', 'PROJECT_ID', 'SCRIPT_NAME', 'ISIN', 'IS_ACTIVE'],
                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
            });

            console.log("ScriptHoldData", ScriptHoldData);
            const scriptNamesArray = ScriptHoldData.map(data => data.dataValues.SCRIPT_NAME);

            // Joining script names with a comma and space
            const scriptNamesString = scriptNamesArray.join(', ');

            console.log("Script Names Array:", scriptNamesArray);
            console.log("Script Names String:", scriptNamesString);

            const projectData = await TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.findOne({
                attributes: ['PROJECT_ID', 'UPLOAD_PATH'],
                where: {
                    PROJECT_ID: projectId,
                }
            });

            if (projectData && projectData.UPLOAD_PATH != null) {
                const filePath = projectData.UPLOAD_PATH;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(filePath);
                const worksheet = workbook.getWorksheet(1);

                // const employeeData = [];

                for (let i = 2; i <= worksheet.rowCount; i++) {
                    const employeeName = worksheet.getRow(i).values[1];
                    const employeeId = worksheet.getRow(i).values[2];

                    console.log(`Cell values at row ${i}:`, employeeName, employeeId);
                    console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                    try {
                        const emailIdArray = await getEmailFromDatabase(employeeId);

                        // Check if the array is not empty and the nested object exists
                        const emailId = emailIdArray.length > 0 && emailIdArray[0][0] ? emailIdArray[0][0].EMAILID : null;

                        console.log("Raw emailId from the database:", emailId);

                        const employee = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_NAME: employeeName,
                            EMAIL_ID: emailId,
                        };

                        employeeData.push(employee);

                        console.log("employeeData", employeeData);
                    } catch (error) {
                        console.error("Error fetching email from the database:", error);
                    }


                }

                const entityEmployeeData = await TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA.findAll({
                    attributes: ['EMPLOYEE_ID', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                    where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                });

                console.log("entityEmployeeData", entityEmployeeData);

                if (entityEmployeeData != null) {
                    // const employeeData1 = [];

                    for (const data of entityEmployeeData) {
                        const { EMPLOYEE_ID, EMPLOYEE_NAME } = data;
                        const emailIdArray1 = await getEmailFromDatabase(EMPLOYEE_ID);
                        const emailId = emailIdArray1.length > 0 && emailIdArray1[0][0] ? emailIdArray1[0][0].EMAILID : null;

                        const employee = {
                            EMPLOYEE_ID: EMPLOYEE_ID,
                            EMPLOYEE_NAME: EMPLOYEE_NAME,
                            EMAIL_ID: emailId,
                        };

                        employeeData1.push(employee);
                        console.log("employeeData1", employeeData1);
                    }


                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }
                            }

                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                             <style>
                                                                 table {
                                                                     border-collapse: collapse;
                                                                     }            
                                                                 tr td {
                                                                     padding: 5px;
                                                                     }            
                                                                 tr th {
                                                                     padding: 5px;
                                                                     }            
                                                                 body {
                                                                     font-family: calibri;
                                                                     font-size: 15px;
                                                                     color: #09095d;
                                                                     }
                                                             </style>            
                                                             <body>                
                                                                 <p> Dear ${EmpName},</p>
                                                                 <p>
                                                                     This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                     ${PROJECT_NAME} is being lifted.
                                                                 </p>
                                                                 <p>
                                                                     Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                     in securities market.
                                                                 </p>
                                                                 <p>
                                                                     For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                 </p>
                                                                 <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                 <br />
                                                                 Regards,<br />
                                                                 Compliance Team
                                                                 <br><br>
                                                             </body>            
                                                         </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks3 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks3 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID','SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                             <style>
                                                                 table {
                                                                     border-collapse: collapse;
                                                                     }            
                                                                 tr td {
                                                                     padding: 5px;
                                                                     }            
                                                                 tr th {
                                                                     padding: 5px;
                                                                     }            
                                                                 body {
                                                                     font-family: calibri;
                                                                     font-size: 15px;
                                                                     color: #09095d;
                                                                     }
                                                             </style>            
                                                             <body>                
                                                                 <p> Dear ${EmpName},</p>
                                                                 <p>
                                                                     This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                     ${PROJECT_NAME} is being lifted.
                                                                 </p>
                                                                 <p>
                                                                     Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                     in securities market.
                                                                 </p>
                                                                 <p>
                                                                     For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                 </p>
                                                                 <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                 <br />
                                                                 Regards,<br />
                                                                 Compliance Team
                                                                 <br><br>
                                                             </body>            
                                                         </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });



                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });



                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData1, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks2 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID','SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, employeeData1];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                             <style>
                                                                 table {
                                                                     border-collapse: collapse;
                                                                     }            
                                                                 tr td {
                                                                     padding: 5px;
                                                                     }            
                                                                 tr th {
                                                                     padding: 5px;
                                                                     }            
                                                                 body {
                                                                     font-family: calibri;
                                                                     font-size: 15px;
                                                                     color: #09095d;
                                                                     }
                                                             </style>            
                                                             <body>                
                                                                 <p> Dear ${EmpName},</p>
                                                                 <p>
                                                                     This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                     ${PROJECT_NAME} is being lifted.
                                                                 </p>
                                                                 <p>
                                                                     Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                     in securities market.
                                                                 </p>
                                                                 <p>
                                                                     For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                 </p>
                                                                 <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                 <br />
                                                                 Regards,<br />
                                                                 Compliance Team
                                                                 <br><br>
                                                             </body>            
                                                         </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, employeeData1];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const lks = await dataaccess.Update(TBL_UPSI_PROJECT_MST_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const lks1 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });


                            }

                        }


                    }


                } else {
                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const ulta = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const ulta = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID','SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });


                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }

                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });


                        if (projectData1 && projectData1.UPLOADFILE != null) {

                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID','SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt4 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt4 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }





                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID','SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                         <style>
                                                             table {
                                                                 border-collapse: collapse;
                                                                 }            
                                                             tr td {
                                                                 padding: 5px;
                                                                 }            
                                                             tr th {
                                                                 padding: 5px;
                                                                 }            
                                                             body {
                                                                 font-family: calibri;
                                                                 font-size: 15px;
                                                                 color: #09095d;
                                                                 }
                                                         </style>            
                                                         <body>                
                                                             <p> Dear ${EmpName},</p>
                                                             <p>
                                                                 This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                 ${PROJECT_NAME} is being lifted.
                                                             </p>
                                                             <p>
                                                                 Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                 in securities market.
                                                             </p>
                                                             <p>
                                                                 For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                             </p>
                                                             <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                             <br />
                                                             Regards,<br />
                                                             Compliance Team
                                                             <br><br>
                                                         </body>            
                                                     </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }


                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }


                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }

                        }


                    }
                }


            } else {
                const entityEmployeeData = await TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA.findAll({
                    attributes: ['EMPLOYEE_ID', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                    where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                });

                console.log("entityEmployeeData", entityEmployeeData);

                if (entityEmployeeData != null) {
                    // const employeeData1 = [];

                    for (const data of entityEmployeeData) {
                        const { EMPLOYEE_ID, EMPLOYEE_NAME } = data;
                        const emailIdArray1 = await getEmailFromDatabase(EMPLOYEE_ID);
                        const emailId = emailIdArray1.length > 0 && emailIdArray1[0][0] ? emailIdArray1[0][0].EMAILID : null;

                        const employee = {
                            EMPLOYEE_ID: EMPLOYEE_ID,
                            EMPLOYEE_NAME: EMPLOYEE_NAME,
                            EMAIL_ID: emailId,
                        };

                        employeeData1.push(employee);
                        console.log("employeeData1", employeeData1);
                    }


                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const spy = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const spy = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }

                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });


                        if (projectData1 && projectData1.UPLOADFILE != null) {

                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });


                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const alts = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });


                            } else {

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const alts = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }

                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);
                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData1];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                            <style>
                                                                table {
                                                                    border-collapse: collapse;
                                                                    }            
                                                                tr td {
                                                                    padding: 5px;
                                                                    }            
                                                                tr th {
                                                                    padding: 5px;
                                                                    }            
                                                                body {
                                                                    font-family: calibri;
                                                                    font-size: 15px;
                                                                    color: #09095d;
                                                                    }
                                                            </style>            
                                                            <body>                
                                                                <p> Dear ${EmpName},</p>
                                                                <p>
                                                                    This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                    ${PROJECT_NAME} is being lifted.
                                                                </p>
                                                                <p>
                                                                    Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                    in securities market.
                                                                </p>
                                                                <p>
                                                                    For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                                </p>
                                                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                                <br />
                                                                Regards,<br />
                                                                Compliance Team
                                                                <br><br>
                                                            </body>            
                                                        </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt2 = await dataaccess.Update(TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                            }

                        }


                    }


                } else {
                    const EmployeeData2 = await TBL_UPSI_EMPLOYEE_DETAILS.findAll({
                        attributes: ['EMPNO', 'EMPLOYEE_NAME', 'PROJECT_ID', 'IS_ACTIVE'],
                        where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                    });

                    console.log("EmployeeData2", EmployeeData2);

                    if (EmployeeData2 != null) {
                        // const employeeData2 = [];

                        for (const data of EmployeeData2) {
                            const { EMPNO, EMPLOYEE_NAME } = data;
                            const emailIdArray2 = await getEmailFromDatabase(EMPNO);
                            const emailId = emailIdArray2.length > 0 && emailIdArray2[0][0] ? emailIdArray2[0][0].EMAILID : null;

                            const employee = {
                                EMPLOYEE_ID: EMPNO,
                                EMPLOYEE_NAME: EMPLOYEE_NAME,
                                EMAIL_ID: emailId,
                            };

                            employeeData2.push(employee);
                            console.log("employeeData1", employeeData2);
                        }

                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });

                        // const filePath5 = projectData1.UPLOADFILE;
                        // console.log("filePath1", filePath5);

                        if (projectData1 && projectData1.UPLOADFILE != null) {
                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);
                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }

                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const ult = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId })


                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData2, ...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }

                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                                const ult = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId })

                            }




                        } else {
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });

                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                         <style>
                                                             table {
                                                                 border-collapse: collapse;
                                                                 }            
                                                             tr td {
                                                                 padding: 5px;
                                                                 }            
                                                             tr th {
                                                                 padding: 5px;
                                                                 }            
                                                             body {
                                                                 font-family: calibri;
                                                                 font-size: 15px;
                                                                 color: #09095d;
                                                                 }
                                                         </style>            
                                                         <body>                
                                                             <p> Dear ${EmpName},</p>
                                                             <p>
                                                                 This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                 ${PROJECT_NAME} is being lifted.
                                                             </p>
                                                             <p>
                                                                 Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                 in securities market.
                                                             </p>
                                                             <p>
                                                                 For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                             </p>
                                                             <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                             <br />
                                                             Regards,<br />
                                                             Compliance Team
                                                             <br><br>
                                                         </body>            
                                                     </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData2];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt3 = await dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                            }


                        }


                    } else {
                        const projectData1 = await TBL_UPSI_AUDITOR_FILE_SAVE.findOne({
                            attributes: ['PROJECT_ID', 'UPLOADFILE'],
                            where: {
                                PROJECT_ID: projectId,
                                IS_ACTIVE: true
                            }
                        });


                        if (projectData1 && projectData1.UPLOADFILE != null) {

                            const filePath5 = projectData1.UPLOADFILE;
                            console.log("filePath1", filePath5);

                            const workbook1 = new ExcelJS.Workbook();
                            await workbook1.xlsx.readFile(filePath5);
                            const worksheet1 = workbook1.getWorksheet(1);

                            // const employeeData3 = [];

                            for (let i = 2; i <= worksheet1.rowCount; i++) {
                                // const employeeName = worksheet1.getRow(i).values[1];
                                // const employeeId = worksheet1.getRow(i).values[2];
                                // const emailId = worksheet1.getRow(i).values[3];

                                // console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };

                                //     employeeData3.push(employee);

                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                const employeeName = worksheet1.getRow(i).values[1]; //'Name',
                                const employeeId = worksheet1.getRow(i).values[2];  //'PAN',                          
                                const emailId = worksheet1.getRow(i).values[3]; //'Company Name',
                                const pan = worksheet1.getRow(i).values[4]; //'PAN',
                                const sgharedby = worksheet1.getRow(i).values[5];  //'Shared By',                          
                                const pan1 = worksheet1.getRow(i).values[6]; //'PAN',
                                const shareddate = worksheet1.getRow(i).values[7]; //'Shared Date',
                                const relation = worksheet1.getRow(i).values[8];  //'Relationship',                          
                                const nature = worksheet1.getRow(i).values[9]; //'Nature of UPSI',
                                const doc = worksheet1.getRow(i).values[10];  //'Document Source',                        
                                const acc = worksheet1.getRow(i).values[11]; //'Acc Code',
                                const entity = worksheet1.getRow(i).values[12]; // 'Entity'
    
                                console.log(`Cell values at row ${i}:`, employeeName, employeeId, emailId);
                                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);
    
                                // try {
                                //     const employee = {
                                //         EMPLOYEE_ID: employeeId,
                                //         EMPLOYEE_NAME: employeeName,
                                //         EMAIL_ID: emailId.text,
                                //     };
    
                                //     employeeData3.push(employee);
    
                                //     console.log("employeeData3", employeeData3);
                                // } catch (error) {
                                //     console.error("Error fetching email from the database:", error);
                                // }
                                try {
    
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: sgharedby }
                                    });
    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
    
                                        const employee = {
                                            EMPLOYEE_ID: employeeId,
                                            EMPLOYEE_NAME: employeeName,
                                            EMAIL_ID: USER_EMAILID,
                                        };
    
                                        employeeData3.push(employee);
    
                                        console.log("employeeData3", employeeData3);
                                    }
    
    
    
                                } catch (error) {
                                    console.error("Error fetching email from the database:", error);
                                }


                            }

                            // const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                            //     attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'IS_ACTIVE'],
                            //     where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            // });

                            // console.log("AuditEmpData", AuditEmpData);
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });
                
                            console.log("AuditEmpData", AuditEmpData);

                            if (AuditEmpData != null) {

                                // for (const data of AuditEmpData) {
                                //     const { EMAILID, NAME } = data;


                                //     const employee = {
                                //         EMPLOYEE_NAME: NAME,
                                //         EMAIL_ID: EMAILID,
                                //     };

                                //     employeeData4.push(employee);
                                //     console.log("employeeData", employeeData);
                                // }
                               
                                for (const data of AuditEmpData) {
                                    const { EMAILID, NAME, SHARED_BT } = data;
                    
                                    // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                    const user = await TBL_USER_MST.findOne({
                                        attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                        where: { FIRSTNAME: SHARED_BT }
                                    });
                    
                                    if (user) {
                                        const { EMAILID: USER_EMAILID } = user;
                    
                                        const employee = {
                                            EMPLOYEE_NAME: NAME,
                                            EMAIL_ID: USER_EMAILID,
                                        };
                    
                                        employeeData4.push(employee);
                                        console.log("employeeData4", employeeData4);
                                    }
                                }

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData1 = [...employeeData4];

                                console.log("Merged Employee Data:", mergedEmployeeData1);

                                for (const employee of mergedEmployeeData1) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }
                                const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }

                                const dlt7 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            } else {
                                // Merge the contents of employeeData and employeeData1 arrays
                                const mergedEmployeeData = [...employeeData3];

                                console.log("Merged Employee Data:", mergedEmployeeData);

                                const uniqueEmployeeMap = new Map();

                                // Filter the mergedEmployeeData to retain the first occurrence of each EMPLOYEE_ID
                                const filteredEmployeeData = mergedEmployeeData.filter(employee => {
                                    const employeeId = String(employee.EMPLOYEE_ID); // Convert to string for uniform comparison
                                    if (!uniqueEmployeeMap.has(employeeId)) {
                                        uniqueEmployeeMap.set(employeeId, true);
                                        return true;
                                    }
                                    return false;
                                });

                                console.log("Filtered Employee Data:", filteredEmployeeData);

                                const newEmployeeArray = [...filteredEmployeeData];

                                console.log("New Employee Array:", newEmployeeArray);


                                for (const employee of newEmployeeArray) {
                                    const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                    const mailBody = `  <html>
                                                        <style>
                                                            table {
                                                                border-collapse: collapse;
                                                                }            
                                                            tr td {
                                                                padding: 5px;
                                                                }            
                                                            tr th {
                                                                padding: 5px;
                                                                }            
                                                            body {
                                                                font-family: calibri;
                                                                font-size: 15px;
                                                                color: #09095d;
                                                                }
                                                        </style>            
                                                        <body>                
                                                            <p> Dear ${EmpName},</p>
                                                            <p>
                                                                This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                                ${PROJECT_NAME} is being lifted.
                                                            </p>
                                                            <p>
                                                                Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                                in securities market.
                                                            </p>
                                                            <p>
                                                                For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                            </p>
                                                            <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                            <br />
                                                            Regards,<br />
                                                            Compliance Team
                                                            <br><br>
                                                        </body>            
                                                    </html>`;
                                    await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);

                                }

                                const dlt7 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, { PROJECT_ID: projectId });
                            }


                        } else {
                            // const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                            //     attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'IS_ACTIVE'],
                            //     where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            // });

                            // console.log("AuditEmpData", AuditEmpData);

                            // for (const data of AuditEmpData) {
                            //     const { EMAILID, NAME } = data;


                            //     const employee = {
                            //         EMPLOYEE_NAME: NAME,
                            //         EMAIL_ID: EMAILID,
                            //     };

                            //     employeeData4.push(employee);
                            //     console.log("employeeData", employeeData);
                            // }
                            const AuditEmpData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
                            });
                
                            console.log("AuditEmpData", AuditEmpData);
                
                            for (const data of AuditEmpData) {
                                const { EMAILID, NAME, SHARED_BT } = data;
                
                                // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                                const user = await TBL_USER_MST.findOne({
                                    attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                                    where: { FIRSTNAME: SHARED_BT }
                                });
                
                                if (user) {
                                    const { EMAILID: USER_EMAILID } = user;
                
                                    const employee = {
                                        EMPLOYEE_NAME: NAME,
                                        EMAIL_ID: USER_EMAILID,
                                    };
                
                                    employeeData4.push(employee);
                                    console.log("employeeData4", employeeData4);
                                }
                            }

                            // Merge the contents of employeeData and employeeData1 arrays
                            const mergedEmployeeData = [...employeeData4];

                            console.log("Merged Employee Data:", mergedEmployeeData);

                            for (const employee of mergedEmployeeData) {
                                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                                const mailBody = `  <html>
                                                    <style>
                                                        table {
                                                            border-collapse: collapse;
                                                            }            
                                                        tr td {
                                                            padding: 5px;
                                                            }            
                                                        tr th {
                                                            padding: 5px;
                                                            }            
                                                        body {
                                                            font-family: calibri;
                                                            font-size: 15px;
                                                            color: #09095d;
                                                            }
                                                    </style>            
                                                    <body>                
                                                        <p> Dear ${EmpName},</p>
                                                        <p>
                                                            This is to inform you that the restriction imposed on you with regards to trading in '${scriptNamesString}' for project
                                                            ${PROJECT_NAME} is being lifted.
                                                        </p>
                                                        <p>
                                                            Further, you need to comply with relevant PIT Codes adopted by Newel, as applicable to you whilst trading
                                                            in securities market.
                                                        </p>
                                                        <p>
                                                            For any queries/concerns with regards to this mail, please connect with respective spoc.
                                                        </p>
                                                        <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                                        <br />
                                                        Regards,<br />
                                                        Compliance Team
                                                        <br><br>
                                                    </body>            
                                                </html>`;
                                await sendEmail(EmailId, `Restriction Ends - ${PROJECT_NAME}`, mailBody);
                            }
                            const dlt6 = await dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, { PROJECT_ID: projectId });

                        }





                    }
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    router.route('/GetAllAccessType')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'UPSI Access Type',
                    IS_ACTIVE: true
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
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllAccessType', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/SCRIPDESC')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            //     let quiry = ` SELECT * FROM "TBL_USER_MST"
            //  WHERE lower("FIRSTNAME")  LIKE lower('%${req.body.FIRSTNAME}%') AND "ISACTIVE" = true;`
            let quiry = `SELECT *
            FROM "TBL_USER_MST" U
            WHERE lower(U."FIRSTNAME") LIKE lower('%${encryptmodel.FIRSTNAME}%')
              AND U."ISACTIVE" = true
              AND NOT EXISTS (
                SELECT "EMPLOYEE_NAME"
                FROM "TBL_UPSI_EMPLOYEE_DETAILS" E
                WHERE lower(U."FIRSTNAME") = lower(E."EMPLOYEE_NAME") 
                AND "PROJECT_ID" = '${encryptmodel.id}'
                AND "IS_ACTIVE" = true
              );`
            let result = await connect.sequelize.query(quiry);
            if (result) {
                var EncryptLoginDetails = dataconn.encryptionAES(result[0]);
                res.status(200).json({ Success: true, Message: 'SCRIPDESC List Table Access', Data: EncryptLoginDetails });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User Has No Access Of SCRIPDESC', Data: null });
            }
        });

    router.route('/addEmp')
        .post(async function (req, res) {

            const TBL_UPSI_EMPLOYEE_DETAILS = datamodel.TBL_UPSI_EMPLOYEE_DETAILS();

            const query = await connect.sequelize.query(`select "EMPNO","PANCARDNO" from "TBL_USER_MST" where "FIRSTNAME" = '${req.body.empname}'`);
            const result = query[0][0];
            console.log("result", result);
            const empno = result.EMPNO;
            const pan = result.PANCARDNO;

            var values = {
                PROJECT_ID: req.body.ID,
                EMPLOYEE_NAME: req.body.empname,
                EMPNO: empno,
                PAN: pan,
                ACCESS_TYPE: req.body.type,
                // ACCESS_TYPE: 63,
                IS_ACTIVE: true,

            };

            dataaccess.Create(TBL_UPSI_EMPLOYEE_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'addEmp', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/deleteEmployee')
        .post(function (req, res) {
            console.log("body", req.body);

            var param = {
                ID: req.body.ID
            };
            console.log("param", param);
            const TBL_UPSI_EMPLOYEE_DETAILS = datamodel.TBL_UPSI_EMPLOYEE_DETAILS();

            dataaccess.Update(TBL_UPSI_EMPLOYEE_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: null });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_UPSI_EMPLOYEE_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'deleteEmployee', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetAllEmp/:ProjectId')
        .get(function (req, res) {

            const TBL_UPSI_EMPLOYEE_DETAILS = datamodel.TBL_UPSI_EMPLOYEE_DETAILS();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const employeeId = req.params.ProjectId;


            var param = {
                where: { PROJECT_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'PROJECT_ID', 'EMPLOYEE_NAME', 'EMPNO', 'PAN', 'ACCESS_TYPE', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'UPSI Access Type'
                        }
                    },
                    {
                        model: TBL_UPSI_PROJECT_MST,
                        attributes: ['ID']
                    }
                ],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_UPSI_EMPLOYEE_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'TBL_UPSI_EMPLOYEE_DETAILS Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_EMPLOYEE_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetDeptOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_EMPLOYEE_DETAILS Table', Data: null });
                });

        });

    router.route('/FIRSTNAME')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            let quiry = ` SELECT * FROM "TBL_USER_MST"
             WHERE lower("FIRSTNAME")  LIKE lower('%${encryptmodel.FIRSTNAME}%') AND "ISACTIVE" = true;`
            // let quiry = `SELECT *
            // FROM "TBL_USER_MST" U
            // WHERE lower(U."FIRSTNAME") LIKE lower('%${req.body.FIRSTNAME}%')
            //   AND U."ISACTIVE" = true
            //   AND NOT EXISTS (
            //     SELECT "EMPLOYEE_NAME"
            //     FROM "TBL_UPSI_EMPLOYEE_DETAILS" E
            //     WHERE lower(U."FIRSTNAME") = lower(E."EMPLOYEE_NAME") 
            //     AND "PROJECT_ID" = '${req.body.id}'
            //     AND "IS_ACTIVE" = true
            //   );`
            let result = await connect.sequelize.query(quiry);
            if (result) {
                var EncryptLoginDetails = dataconn.encryptionAES(result[0]); 
                res.status(200).json({ Success: true, Message: 'FIRSTNAME List Table Access', Data: EncryptLoginDetails });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User Has No Access Of FIRSTNAME', Data: null });
            }
        });

    router.route('/CreateUPSIAuditData')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

            const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();

            var values = {
                PROJECT_ID:encryptmodel.id,
                NAME: encryptmodel.name,
                EMP_PAN: encryptmodel.pan1,
                COMPANY_NAME: encryptmodel.company,
                COMPANY_PAN: encryptmodel.pan2,
                SHARED_BT: encryptmodel.sharename,
                SHARED_BY_PAN: encryptmodel.pan,
                SHARED_DATE: encryptmodel.date,
                RELATIONSHIP: encryptmodel.rel,
                NATURE_OF_UPSI: encryptmodel.nature,
                DOCUMNET_SOURCE: encryptmodel.doc,
                ACC_CODE: encryptmodel.acc,
                // EMAILID: req.body.email,
                EMAILID: encryptmodel.entity,
                IS_ACTIVE: true,

            };

            dataaccess.Create(TBL_UPSI_AUDIT_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'addEmp', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/deleteAudit')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();

            dataaccess.Update(TBL_UPSI_AUDIT_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null); 
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_UPSI_AUDIT_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'deleteAudit', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetAllaudit/:ProjectId')
        .get(function (req, res) {

            //     const query = `SELECT t.*,p."UPLOADFILE"
            //     FROM "TBL_UPSI_AUDIT_DETAILS" t
            // LEFT JOIN "TBL_UPSI_AUDITOR_FILE_SAVE" p ON t."PROJECT_ID" = p."PROJECT_ID" AND p."IS_ACTIVE" = true
            // WHERE t."PROJECT_ID" = '${req.params.ProjectId}' AND t."IS_ACTIVE" = true AND p."PROJECT_ID" = '${req.params.ProjectId}'`;

            const query = `SELECT t.*, p."UPLOADFILE"
             FROM "TBL_UPSI_AUDIT_DETAILS" t
             LEFT JOIN "TBL_UPSI_AUDITOR_FILE_SAVE" p
             ON t."PROJECT_ID" = p."PROJECT_ID"
             WHERE t."PROJECT_ID" = '${req.params.ProjectId}' 
             AND t."IS_ACTIVE" = true
             AND (p."IS_ACTIVE" = true OR p."UPLOADFILE" IS NULL)`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) {
                        const data = result[0];
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'UPSI Project Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access UPSI Project', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllaudit', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UPSI Project', Data: null });
                });

        });

    router.route('/SaveAuditUploadFile')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'AuditFiles'); // Use the existing folder path

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                const projectId2 = requestBody.PROJECT_NAME;

                let newFileName = `${projectId2}_${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)

                console.log('path..', newFileName);

                // writeFile(path.join(Folder_Path, newFileName), fileDetails[i].buffer); // Use the existing folder path
                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path



                writeFile(filePath, fileDetails[i].buffer);
                try {
                    // Assuming you have a Sequelize model for TBL_UPSI_PROJECT_MST, update this accordingly                
                    const TBL_UPSI_AUDITOR_FILE_SAVE = datamodel.TBL_UPSI_AUDITOR_FILE_SAVE();
                    var values = {
                        UPLOADFILE: filePath,
                        PROJECT_ID: projectId2,
                        IS_ACTIVE: true,
                        CREATED_ON: new Date(),
                    };
                    var param = {
                        PROJECT_ID: projectId2
                    }

                    const dlt1 = await dataaccess.Update(TBL_UPSI_AUDITOR_FILE_SAVE, { IS_ACTIVE: false }, param);
                    dataaccess.Create(TBL_UPSI_AUDITOR_FILE_SAVE, values)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'upsiproject saved successfully', Data: result });
                            }
                            else {

                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        }, function (err) {
                            dataconn.errorlogger('createUPSIProjectmstService', 'addEmp', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
                }
                // }
            }
        });

    router.route('/CreateSCriptData')
        .post(async function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();

            var values = {
                PROJECT_ID: encryptmodel.ID,
                SCRIPT_NAME: encryptmodel.SCRIPT_NAME,
                ISIN: encryptmodel.ISIN,
                IS_ACTIVE: true,

            };


            dataaccess.Create(TBL_UPSI_PROJECT_SCRIPT_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'upsiscript data saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'CreateSCriptData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });

        });

    router.route('/deleteScriptData')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();

            dataaccess.Update(TBL_UPSI_PROJECT_SCRIPT_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null); 
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_UPSI_PROJECT_SCRIPT_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'deleteScriptData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetAllScript/:ProjectId')
        .get(function (req, res) {

            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            // const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const employeeId = req.params.ProjectId;


            var param = {
                where: { PROJECT_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'PROJECT_ID', 'SCRIPT_NAME', 'ISIN', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_UPSI_PROJECT_MST,
                        attributes: ['ID']
                    }
                ],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_UPSI_PROJECT_SCRIPT_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_UPSI_PROJECT_SCRIPT_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_SCRIPT_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetAllScript', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_UPSI_PROJECT_SCRIPT_DETAILS Table', Data: null });
                });

        });

    router.route('/CheckDuplicateScript')
        .post(function (req, res) {
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            const { SCRIPT_NAME, ID } = encryptmodel;

            const queryConditions = {
                where: {
                    SCRIPT_NAME: SCRIPT_NAME,
                    PROJECT_ID: ID,
                    IS_ACTIVE: true
                }
            };

            dataaccess.FindOne(TBL_UPSI_PROJECT_SCRIPT_DETAILS, queryConditions).then(
                function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: "SCRIPT_NAME exists and is active for this project", Data: true });
                    } else {
                        res.status(200).json({ Success: false, Message: "SCRIPT_NAME does not exist or is not active for this project", Data: false });
                    }
                },
                function (err) {
                    dataconn.errorlogger("createUPSIProjectmstService", "CheckDuplicateScript", err);
                    res.status(200).json({ Success: false, Message: "Error occurred while checking SCRIPT_NAME", Data: null });
                }
            );
        });

    router.route('/generateAuditorblocking')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
                const projectId = encryptmodel.ID;
                await sendAuditorBlockingEmails(projectId);
                var EncryptLoginDetails = dataconn.encryptionAES(projectId);
                res.status(200).json({ Success: true, Message: 'upsiproject Entity Employee data saved and Mail Send successfully', Data: EncryptLoginDetails });
            } catch (error) {
                console.error('Error sending blocking emails:', error);

                // If an error occurs, send an error response
                res.status(200).json({ Success: false, Message: 'Error sending blocking emails', Data: null });
            }
        });

    async function sendAuditorBlockingEmails(projectId) {
        try {
            const TBL_UPSI_AUDIT_DETAILS = datamodel.TBL_UPSI_AUDIT_DETAILS();
            const TBL_UPSI_PROJECT_MST = datamodel.TBL_UPSI_PROJECT_MST();
            const TBL_UPSI_PROJECT_SCRIPT_DETAILS = datamodel.TBL_UPSI_PROJECT_SCRIPT_DETAILS();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const employeeData = [];
            // const employeeData1 = [];
            // const employeeData2 = [];
            // const employeeData3 = [];

            const SecHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_MST, {
                attributes: ['ID', 'PROJECT_NAME', 'SCRIPT_NAME', 'ISIN', 'STARTDATE', 'ENDDATE', 'IS_EQUITY', 'IS_DEPT', 'IS_ACTIVE'],
                where: { ID: projectId }
            });
            const PROJECT_NAME = SecHoldData[0].dataValues.PROJECT_NAME;
            // const SCRIPT_NAME = SecHoldData[0].dataValues.SCRIPT_NAME;

            console.log("SecHoldData", SecHoldData);


            const ScriptHoldData = await dataaccess.FindAll(TBL_UPSI_PROJECT_SCRIPT_DETAILS, {
                attributes: ['ID', 'PROJECT_ID', 'SCRIPT_NAME', 'ISIN', 'IS_ACTIVE'],
                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
            });

            console.log("ScriptHoldData", ScriptHoldData);
            const scriptNamesArray = ScriptHoldData.map(data => data.dataValues.SCRIPT_NAME);

            // Joining script names with a comma and space
            const scriptNamesString = scriptNamesArray.join(', ');

            console.log("Script Names Array:", scriptNamesArray);
            console.log("Script Names String:", scriptNamesString);

            const entityEmployeeData = await TBL_UPSI_AUDIT_DETAILS.findAll({
                attributes: ['PROJECT_ID', 'NAME', 'EMAILID', 'SHARED_BT', 'IS_ACTIVE'],
                where: { PROJECT_ID: projectId, IS_ACTIVE: true }
            });

            console.log("entityEmployeeData", entityEmployeeData);

            // for (const data of entityEmployeeData) {
            //     const { EMAILID, NAME } = data;


            //     const employee = {
            //         EMPLOYEE_NAME: NAME,
            //         EMAIL_ID: EMAILID,
            //     };

            //     employeeData.push(employee);
            //     console.log("employeeData", employeeData);
            // }
            for (const data of entityEmployeeData) {
                const { EMAILID, NAME, SHARED_BT } = data;

                // Assuming there's a relationship between SHARED_BT and some field in TBL_USER_MST
                const user = await TBL_USER_MST.findOne({
                    attributes: ['EMAILID'], // Assuming EMAILID is the field you want to retrieve
                    where: { FIRSTNAME: SHARED_BT }
                });

                if (user) {
                    const { EMAILID: USER_EMAILID } = user;

                    const employee = {
                        EMPLOYEE_NAME: NAME,
                        EMAIL_ID: USER_EMAILID,
                    };

                    employeeData.push(employee);
                    console.log("employeeData", employeeData);
                }
            }

            // Merge the contents of employeeData and employeeData1 arrays
            const mergedEmployeeData = [...employeeData];

            console.log("Merged Employee Data:", mergedEmployeeData);

            for (const employee of mergedEmployeeData) {
                const { EMPLOYEE_ID: EmpId, EMPLOYEE_NAME: EmpName, EMAIL_ID: EmailId } = employee;
                const mailBody = `  <html>
                            <style>
                                table {
                                    border-collapse: collapse;
                                    }             
                                tr td {
                                    padding: 5px;
                                    }            
                                tr th {
                                    padding: 5px;
                                    }            
                                body {
                                    font-family: calibri;
                                    font-size: 15px;
                                    color: #09095d;
                                    }
                            </style>            
                            <body>
                                <p> Dear ${EmpName},</p>
                                <p>
                                    You are hereby advised to refrain from dealing in the scrip '${scriptNamesString}' till further notice.
                                    This restriction also applies to your Immediate Relatives and Connected Persons. The restriction
                                    has been initiated in compliance with the Newel Code for Prohibition of Insider Trading in the
                                    securities of Newel Technologies Pvt. Ltd.
                                </p>
                                <p>
                                    For any queries/concerns with regards to this restriction, please connect with Aniket Yadav.For information 
                                    with regards to above mentioned Codes, please email us aniket.yadav@neweltechnologies.com
                                </p>
                                <p>Note - Do not reply to this email as this is a system generated mail.</p>
                                <br />
                                Regards,<br />
                                Compliance Team
                                <br><br>
                            </body>
                        </html>`;
                await sendEmail(EmailId, `Restriction Initiated - ${PROJECT_NAME}`, mailBody);

            }

        } catch (error) {
            console.error('Error:', error);
        }
    }


    return router;
};

module.exports = routes;

