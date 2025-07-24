var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW } = require('sequelize');
var sequelize = connect.Sequelize;
const ejs = require('ejs');
const pdf = require('html-pdf');
const SendEAHEmail = require('../../Common/Mailer')
const fs = require('fs')
const path = require("path");
const { PassThrough } = require('stream');
let responseSent = false;
var multer = require("multer");
var upload = multer();
let util = require('util')
var moment = require('moment');


var routes = function () {

    router.route('/GetUser/:EmployeeId')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'DEPARTMENT', 'PANCARDNO', 'DSIGNATED', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetUser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });

        });

    router.route('/getStep/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'SPOUSENAME', 'SINGLE_STATUS', 'STEP_ID', 'SUBMITTED', 'SPOUSE_IS_DEPENDENT', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'getStep', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/getIDStep/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'SPOUSENAME', 'SINGLE_STATUS', 'SUBMITTED', 'STEP_ID', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_EAH_EMP_MODIFIED', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'getIDStep', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });



    /////////////////////////////////// self details   ///////////////////////////////////////////////////////////////////
    router.route('/SaveSpouseDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                SPOUSENAME: encryptmodel.spouseName,
                SINGLE_STATUS: encryptmodel.Single_status,
                STEP_ID: 0,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'spousedata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveSpouseDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateSpouseDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var values = {

                SPOUSENAME: encryptmodel.spouseName,
                SINGLE_STATUS: encryptmodel.Single_status,
                STEP_ID: 0,


            };

            var param = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                IS_ACTIVE: true
            }

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'spousedata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateSpouseDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/getSpouse/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'SPOUSENAME', 'SINGLE_STATUS', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'getSpouse', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    //education
    router.route('/SaveEduDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.empid,
                INSTITUTION: encryptmodel.inst,
                QUALIFICATION: encryptmodel.qualification,
                SUB_QUALIFICATION: encryptmodel.subQualification,
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, values)
                .then(async function (result) {
                    if (result != null) {
                        const deletequery = await connect.sequelize.query(`select * from "TBL_EAH_EMPLOYEE_QUALIFICATION_INFO" where "EMPLOYEE_ID"= '${encryptmodel.empid}'
                and "IS_ACTIVE"= true`);
                        console.log('deletequery', deletequery);
                        if (deletequery && deletequery[0] && deletequery[0].length >= 2) {
                            const rows = deletequery[0];

                            // Check if the first and second row are identical except for ID
                            const identicalRows = rows[0] && rows[1] &&
                                rows[0].EMPLOYEE_ID === rows[1].EMPLOYEE_ID &&
                                rows[0].INSTITUTION === rows[1].INSTITUTION &&
                                rows[0].QUALIFICATION === rows[1].QUALIFICATION &&
                                rows[0].SUB_QUALIFICATION === rows[1].SUB_QUALIFICATION;

                            // rows[0].CONCERN_OTHER_NAME === rows[1].CONCERN_OTHER_NAME &&

                            console.log('identicalRows', identicalRows);

                            if (identicalRows) {
                                // Delete the second row (index 1)
                                const deleteId = rows[1].ID;
                                await connect.sequelize.query(`
                            DELETE FROM "TBL_EAH_EMPLOYEE_QUALIFICATION_INFO"
                            WHERE "ID" = '${deleteId}'
                        `);
                                console.log(`Deleted duplicate row with ID: ${deleteId}`);
                            }
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Edudata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveEduDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateEduDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                INSTITUTION: encryptmodel.institution,
                QUALIFICATION: encryptmodel.qualification,
                SUB_QUALIFICATION: encryptmodel.subQualification,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Edudata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateEduDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteEduById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EDU_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteEduById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    // router.route('/GetAllEdu/:EmployeeId')
    //     .get(function (req, res) {

    //         const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
    //         const employeeId = req.params.EmployeeId;

    //         var param = {
    //             attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION', 'IS_EXIST_HRMS', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
    //             where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
    //         };

    //         console.log("param", param);
    //         dataaccess.FindAll(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, param)
    //             .then(function (result) {
    //                 console.log("result", result);
    //                 if (result != null) {
    //                     var EncryptLoginDetails = dataconn.encryptionAES(result);
    //                     res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table Access', Data: EncryptLoginDetails });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('EAH', 'GetAllEdu', err);
    //                 res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table', Data: null });
    //             });

    //     });

    router.route('/GetAllEdu/:EmployeeId')
        .get(async function (req, res) {

            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
            const employeeId = req.params.EmployeeId;

            const checkquery = `select * from  "TBL_EAH_EMPLOYEE_QUALIFICATION_INFO" where "EMPLOYEE_ID"= '${employeeId}'; `;
            const resultdata = await connect.sequelize.query(checkquery);

            console.log('resultdata[0]', resultdata[0], resultdata)

            let eahdata = resultdata[0].length > 0 ? true : false;

            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION', 'RE_OPEN_ID', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES({ result, eahdata });
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetAllEdu', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_QUALIFICATION_INFO Table', Data: null });
                });

        });

    router.route('/checkduplicate')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, qualification } = encryptmodel;
                const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();

                if (!employeeId || !qualification) {
                    return res.status(400).json({ error: 'Employee ID and qualification are required.' });
                }

                const existingQualification = await TBL_EAH_EMPLOYEE_QUALIFICATION_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // QUALIFICATION: qualification,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('QUALIFICATION')), '=', qualification.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('QUALIFICATION')), '=', qualification.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingQualification) {
                    res.status(200).json({ isDuplicate: true, Message: 'Qualification already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Qualification does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for qualification:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for qualification.', Data: null });
            }
        });

    //Past Employee
    router.route('/SavePastEmp')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                PAST_EMPLOYERS: encryptmodel.pastEmp,
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_WORKEX_INFO, values)
                .then(async function (result) {
                    if (result != null) {
                        const deletequery = await connect.sequelize.query(`select * from "TBL_EAH_EMPLOYEE_WORKEX_INFO" where "EMPLOYEE_ID"= '${encryptmodel.employeeid}'
                    and "IS_ACTIVE"= true`);
                        console.log('deletequery', deletequery);
                        if (deletequery && deletequery[0] && deletequery[0].length >= 2) {
                            const rows = deletequery[0];

                            // Check if the first and second row are identical except for ID
                            const identicalRows = rows[0] && rows[1] &&
                                rows[0].EMPLOYEE_ID === rows[1].EMPLOYEE_ID &&
                                rows[0].PAST_EMPLOYERS === rows[1].PAST_EMPLOYERS;

                            // rows[0].CONCERN_OTHER_NAME === rows[1].CONCERN_OTHER_NAME &&

                            console.log('identicalRows', identicalRows);

                            if (identicalRows) {
                                // Delete the second row (index 1)
                                const deleteId = rows[1].ID;
                                await connect.sequelize.query(`
                                DELETE FROM "TBL_EAH_EMPLOYEE_WORKEX_INFO"
                                WHERE "ID" = '${deleteId}'
                            `);
                                console.log(`Deleted duplicate row with ID: ${deleteId}`);
                            }
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'PastEmpdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SavePastEmp', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdatePastEmpDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                PAST_EMPLOYERS: encryptmodel.pastEmp,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_WORKEX_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'PastEmpdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdatePastEmpDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeletePastEmpById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_WORKEX_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_WORKEX_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeletePastEmpById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetPastEmp/:EmployeeId')
        .get(async function (req, res) {

            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
            const employeeId = req.params.EmployeeId;
            const checkquery = `select * from  "TBL_EAH_EMPLOYEE_WORKEX_INFO" where "EMPLOYEE_ID"= '${employeeId}'; `;
            const resultdata = await connect.sequelize.query(checkquery);

            console.log('resultdata[0]', resultdata[0], resultdata)

            let eahdata = resultdata[0].length > 0 ? true : false;

            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'PAST_EMPLOYERS', 'RE_OPEN_ID', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_EMPLOYEE_WORKEX_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES({ result, eahdata });
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_WORKEX_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_WORKEX_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetPastEmp', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_WORKEX_INFO Table', Data: null });
                });

        });

    router.route('/checkduplicatepastemployee')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, pastEmployer } = encryptmodel;
                const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();

                if (!employeeId || !pastEmployer) {
                    return res.status(400).json({ error: 'Employee ID and past employer are required.' });
                }

                const existingPastEmployee = await TBL_EAH_EMPLOYEE_WORKEX_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // PAST_EMPLOYERS: pastEmployer,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('PAST_EMPLOYERS')), '=', pastEmployer.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('PAST_EMPLOYERS')), '=', pastEmployer.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingPastEmployee) {
                    res.status(200).json({ isDuplicate: true, Message: 'Past employer already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Past employer does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for past employer:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for past employer.', Data: null });
            }
        });

    //Contact Details
    router.route('/SaveContact')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                CONTACT_TYPE: encryptmodel.contact_type,
                CONATCT_NUMBER: encryptmodel.conatct_number,
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, values)
                .then(async function (result) {
                    if (result != null) {
                        const deletequery = await connect.sequelize.query(`select * from "TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO" where "EMPLOYEE_ID"= '${encryptmodel.employeeid}'
                    and "IS_ACTIVE"= true`);
                        console.log('deletequery', deletequery);
                        if (deletequery && deletequery[0] && deletequery[0].length >= 2) {
                            const rows = deletequery[0];

                            // Check if the first and second row are identical except for ID
                            const identicalRows = rows[0] && rows[1] &&
                                rows[0].EMPLOYEE_ID === rows[1].EMPLOYEE_ID &&
                                rows[0].CONTACT_TYPE === rows[1].CONTACT_TYPE &&
                                rows[0].CONATCT_NUMBER === rows[1].CONATCT_NUMBER;

                            // rows[0].CONCERN_OTHER_NAME === rows[1].CONCERN_OTHER_NAME &&

                            console.log('identicalRows', identicalRows);

                            if (identicalRows) {
                                // Delete the second row (index 1)
                                const deleteId = rows[1].ID;
                                await connect.sequelize.query(`
                                DELETE FROM "TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO"
                                WHERE "ID" = '${deleteId}'
                            `);
                                console.log(`Deleted duplicate row with ID: ${deleteId}`);
                            }
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveContact', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateContDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                CONTACT_TYPE: encryptmodel.contact_type,
                CONATCT_NUMBER: encryptmodel.conatct_number,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateContDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteContById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteContById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetContact/:EmployeeId')
        .get(async function (req, res) {

            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;

            const checkquery = `select * from  "TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO" where "EMPLOYEE_ID"= '${employeeId}'; `;
            const resultdata = await connect.sequelize.query(checkquery);

            console.log('resultdata[0]', resultdata[0], resultdata)

            let eahdata = resultdata[0].length > 0 ? true : false;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'CONTACT_TYPE', 'CONATCT_NUMBER', 'RE_OPEN_ID', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'ContactType'
                        }
                    }

                ],

            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES({ result, eahdata });
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetContact', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO Table', Data: null });
                });

        });

    router.route('/checkduplicatecontact')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, contactNumber } = encryptmodel;
                const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();

                if (!employeeId || !contactNumber) {
                    return res.status(400).json({ error: 'Employee ID and contact number are required.' });
                }

                const existingContact = await TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('CONATCT_NUMBER')), '=', contactNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('CONATCT_NUMBER')), '=', contactNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingContact) {
                    res.status(200).json({ isDuplicate: true, Message: 'Contact number already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Contact number does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for contact number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for contact number.', Data: null });
            }
        });



    ///////////////////////////////////////////////// self account details //////////////////////////////////////////////////////
    router.route('/SaveSelfAccontDetails/:EmployeeId')
        .post(function (req, res) {
            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var condition = {
                EMPLOYEE_ID: employeeId,
                IS_ACTIVE: true,
            };

            var values = {
                STEP_ID: 1
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values, condition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Trading account details saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveSelfAccontDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetBEntityDetails/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER', 'SHARE_HOLDING_AVAILABLE', 'TRADING_OPTION', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    }

                ],

            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/SaveBaseEntity')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_ACCOUNT_NUMBER: encryptmodel.EBL,
                ENTITY_NAME: encryptmodel.entname,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveBaseEntity', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeleteBaseEntById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateentitytradeaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber } = encryptmodel;
                const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber) {
                    return res.status(400).json({ error: 'Employee ID and trading account number are required.' });
                }

                const existingTradingAccount = await TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //Self Other Account
    router.route('/SaveSelfOther')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                BROKER_NAME: encryptmodel.brokerName,
                TRADING_ACCOUNT_NUMBER: encryptmodel.tradecode,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetSelfOther/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'TRADING_ACCOUNT_NUMBER', 'TRADING_OPTION', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/DeleteSelfOtherById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteSelfOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicatetradingaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber } = encryptmodel;
                const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber) {
                    return res.status(400).json({ error: 'Employee ID and trading account number are required.' });
                }

                const existingTradingAccount = await TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // TRADING_ACCOUNT_NUMBER: tradingAccountNumber,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //Self Demat Acccount
    router.route('/GetJDSelfDemat/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'DP_ACCOUNT', 'DP_BROKER_NAME', 'TRADING_OPTION', 'PROVIDE_DEMAT', 'SHARE_HOLDING_AVAILABLE',
                    'IS_UPLOAD', 'UPLOAD_PATH', 'UPLOAD_DATE', 'AUTHORIZE_EW', 'IS_ACTIVE'],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_JD_EMP_DP, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMP_DP Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMP_DP Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetJDSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMP_DP Table', Data: null });
                });

        });

    router.route('/SaveJDSelfDemat')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
            const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST

            // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
            TBL_ENTITY_MST.findOne({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    ENTITY_NAME: encryptmodel.brokerName, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                    // IS_BASE_ENTITY: true
                    IS_ACTIVE: true
                }
            })
                .then(function (entity) {
                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_EMP_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            AUTHORIZE_EW: encryptmodel.authorize,
                            SHARE_HOLDING_AVAILABLE: encryptmodel.shareholding,
                            IS_UPLOAD: encryptmodel.isupload,
                            UPLOAD_PATH: encryptmodel.uploadpath,
                            UPLOAD_DATE: encryptmodel.uploaddate,
                            TRADING_OPTION: 'Eq',
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_EMP_DP_ENTITY, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'SelfDematdata saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveSelfDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_EMP_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            PROVIDE_DEMAT: encryptmodel.providedemat,
                            SHARE_HOLDING_AVAILABLE: encryptmodel.shareholding,
                            IS_UPLOAD: encryptmodel.isupload,
                            UPLOAD_PATH: encryptmodel.uploadpath,
                            UPLOAD_DATE: encryptmodel.uploaddate,
                            TRADING_OPTION: 'Eq',
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'SelfDematdata saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveJDSelfDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'SaveJDSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while checking DP_BROKER_NAME', Data: null });
                });
        });

    router.route('/SaveSelfDemat')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
            const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST

            // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
            TBL_ENTITY_MST.findOne({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    ENTITY_NAME: encryptmodel.brokerName, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                    // IS_BASE_ENTITY: true
                    IS_ACTIVE: true
                }
            })
                .then(function (entity) {
                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_EMP_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            RE_OPEN_ID: encryptmodel.reid,
                            TRADING_OPTION: 'Eq',
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_EMP_DP_ENTITY, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'SelfDematdata saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveSelfDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_EMP_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            RE_OPEN_ID: encryptmodel.reid,
                            TRADING_OPTION: 'Eq',
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'SelfDematdata saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveSelfDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'SaveSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while checking DP_BROKER_NAME', Data: null });
                });
        });

    router.route('/GetSelfDemat/:EmployeeId')
        .get(function (req, res) {
            const query = `
            SELECT * FROM (
                SELECT
                    'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "IS_ACTIVE"
                FROM "TBL_EAH_EMP_DP_OTHERS"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Eq'
                UNION ALL
                SELECT
                    'TBL_EAH_EMP_DP_ENTITY' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "IS_ACTIVE"
                FROM "TBL_EAH_EMP_DP_ENTITY"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Eq'
            ) AS combined_tables`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows 
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Self Demat Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Self Demat data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Self Demat Table', Data: null });
                });
        });

    router.route('/DeleteSelfDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const { ID, table_name } = encryptmodel; // Assuming you pass the table name along with ID in the request body

            if (!ID || !table_name) {
                res.status(400).json({ Success: false, Message: 'Invalid request body', Data: null });
                return;
            }

            const isEntityTable = (table_name === 'TBL_EAH_EMP_DP_ENTITY');
            const isOthersTable = (table_name === 'TBL_EAH_EMP_DP_OTHERS');

            if (!isEntityTable && !isOthersTable) {
                res.status(400).json({ Success: false, Message: 'Invalid table name', Data: null });
                return;
            }

            const tableName = isEntityTable ? 'TBL_EAH_EMP_DP_ENTITY' : 'TBL_EAH_EMP_DP_OTHERS';
            const TBL = datamodel[tableName]();

            var param = {
                ID: ID
            };
            console.log("param", param);

            dataaccess.Update(TBL, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: `${tableName} Has No Access`, Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'DeleteSelfDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicatedpaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, dpAccount } = encryptmodel;

                if (!employeeId || !dpAccount) {
                    return res.status(400).json({ error: 'Employee ID and DP account are required.' });
                }

                const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
                const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();

                // Check for duplicate DP_ACCOUNT in TBL_EAH_EMP_DP_ENTITY
                const entityDpAccount = await TBL_EAH_EMP_DP_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // DP_ACCOUNT_NO: dpAccount,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                // Check for duplicate DP_ACCOUNT in TBL_EAH_EMP_DP_OTHERS
                const othersDpAccount = await TBL_EAH_EMP_DP_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // DP_ACCOUNT_NO: dpAccount,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (entityDpAccount || othersDpAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'DP account does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for DP account:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for DP account.', Data: null });
            }
        });




    ///////////////////////////////////////////  Dependent account details  /////////////////////////////////////////////////////////
    // Dependent Other account 
    router.route('/SaveDependentOther')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_ID: encryptmodel.Rtype,
                BROKER_NAME: encryptmodel.brokerName,
                TRADING_ACCOUNT_NUMBER: encryptmodel.tradecode,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                RELATIONSHIP: encryptmodel.relativeName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'DeptOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveDependentOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetDeptOther/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;


            var param = {
                where: { EMPLOYEE_ID: employeeId, RELATIVE_ID: Id, RELATIONSHIP: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'REL_INFO_ID', 'RELATIONSHIP', 'TRADING_ACCOUNT_NUMBER', 'SHARE_HOLDING_AVAILABLE', 'TRANS_TYPE', 'TRADING_OPTION', 'RE_OPEN_ID', 'RELATIVE_ID', 'IS_ACCOUNT_DELETED', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'Relation'
                        }
                    },
                ],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetDeptOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/DeleteDeptOtherById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteDeptOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateDeptOther')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber, relativeId, brokerName } = encryptmodel;
                const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber || !relativeId || !brokerName) {
                    return res.status(400).json({ error: 'Employee ID, trading account number, relative ID, and broker name are required.' });
                }

                // Check if the same trading account number exists for another relative of the same employee
                const existingTradingAccount = await TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: {
                            [sequelize.Op.not]: relativeId
                        },
                        // RELATIVE_ID : relativeId,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for another relative with the same employee ID.' });
                } else {
                    // Check if the same trading account number exists for the same employee and a different relative ID
                    const existingTradingAccountForSameEmployee = await TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relativeId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing trading account for the same employee and relative ID
                    // const existingTradingAccountForSameEmployeeAndRelative = await TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         RELATIVE_ID: relativeId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingTradingAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee and relative.' });
                    }
                    //  else if (existingTradingAccountForSameEmployeeAndRelative) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and relative ID.' });
                    // }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee and relative.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //Dependent Demat account 
    router.route('/SaveDependentDemat')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
            const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST

            // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
            TBL_ENTITY_MST.findOne({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    ENTITY_NAME: encryptmodel.brokerName, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                    // IS_BASE_ENTITY: true
                    IS_ACTIVE: true
                }
            })
                .then(function (entity) {
                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            RELATIVE_ID: encryptmodel.Rtype,
                            RE_OPEN_ID: encryptmodel.reid,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: encryptmodel.relativeName,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_REL_DP_ENTITY, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveDependentDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            RELATIVE_ID: encryptmodel.Rtype,
                            RE_OPEN_ID: encryptmodel.reid,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: encryptmodel.relativeName,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveDependentDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'SaveDependentDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while checking DP_BROKER_NAME', Data: null });
                });
        });

    router.route('/GetDeptDemat/:EmployeeId/:id/:name')
        .get(function (req, res) {
            const query = `SELECT * FROM (
                SELECT
                    'TBL_EAH_REL_DP_OTHERS' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
	                "RELATIVE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
	                "RELATIONSHIP",
                    "IS_ACTIVE"
                FROM "TBL_EAH_REL_DP_OTHERS"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
	                AND "RELATIVE_ID" = '${req.params.id}'
	                AND "RELATIONSHIP" = '${req.params.name}'
                    AND "TRADING_OPTION" = 'Eq'
                UNION ALL
                SELECT
                    'TBL_EAH_REL_DP_ENTITY' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
	                "RELATIVE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
	                "RELATIONSHIP",
                    "IS_ACTIVE"
                FROM "TBL_EAH_REL_DP_ENTITY"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
	                AND "RELATIVE_ID" = '${req.params.id}'
	                AND "RELATIONSHIP" = '${req.params.name}'
                    AND "TRADING_OPTION" = 'Eq'
            ) AS combined_tables`
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows 
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Dept Demat Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Dept Demat data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetDeptDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Dept Demat Table', Data: null });
                });
        });

    router.route('/DeleteDeptDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const { ID, table_name } = encryptmodel;

            if (!ID || !table_name) {
                res.status(400).json({ Success: false, Message: 'Invalid request body', Data: null });
                return;
            }

            const isEntityTable = (table_name === 'TBL_EAH_REL_DP_ENTITY');
            const isOthersTable = (table_name === 'TBL_EAH_REL_DP_OTHERS');

            if (!isEntityTable && !isOthersTable) {
                res.status(400).json({ Success: false, Message: 'Invalid table name', Data: null });
                return;
            }

            const tableName = isEntityTable ? 'TBL_EAH_REL_DP_ENTITY' : 'TBL_EAH_REL_DP_OTHERS';
            const TBL = datamodel[tableName]();

            var param = {
                ID: ID
            };
            console.log("param", param);

            dataaccess.Update(TBL, { IS_ACTIVE: false, IS_ACCOUNT_DELETED: true }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: `${tableName} Has No Access`, Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'DeleteDeptDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateRelDp')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, dpAccountNumber, relativeId, dpBrokerName } = encryptmodel;
                const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();

                if (!employeeId || !dpAccountNumber || !relativeId || !dpBrokerName) {
                    return res.status(400).json({ error: 'Employee ID, DP account number, relative ID, and DP broker name are required.' });
                }

                // Check if the same DP account number exists for another relative of the same employee
                const existingDpEntityAccount = await TBL_EAH_REL_DP_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: {
                            [sequelize.Op.not]: relativeId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                const existingDpOtherAccount = await TBL_EAH_REL_DP_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: {
                            [sequelize.Op.not]: relativeId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingDpEntityAccount || existingDpOtherAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for another relative with the same employee ID.' });
                } else {
                    // Check if the same DP account number exists for the same employee and a different relative ID
                    const existingDpEntityAccountForSameEmployee = await TBL_EAH_REL_DP_ENTITY.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relativeId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });
                    const existingDpOtherAccountForSameEmployee = await TBL_EAH_REL_DP_OTHERS.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relativeId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccountNumber.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    if (existingDpEntityAccountForSameEmployee || existingDpOtherAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for this employee and relative.' });
                    }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'DP account number does not exist for this employee and relative.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for DP account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for DP account number.', Data: null });
            }
        });

    //Dependent Entity Trade Account
    router.route('/GetDeptBEntityDetails/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, RELATIVE_ID: Id, RELATIONSHIP: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'RELATIVE_ID', 'RELATIONSHIP', 'REL_INFO_ID', 'ENTITY_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER', 'TRADING_OPTION', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACCOUNT_DELETED', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'Relation'
                        }
                    },

                ],

            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetDeptBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/SaveDeptBaseEntity')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_ID: encryptmodel.Rtype,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_ACCOUNT_NUMBER: encryptmodel.EBL,
                ENTITY_NAME: encryptmodel.entname,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                RELATIONSHIP: encryptmodel.relativeName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveDeptBaseEntity', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeleteDeptBaseEntById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteDeptBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateDeptentitytradeaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber, relativeId } = encryptmodel;
                const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber || !relativeId) {
                    return res.status(400).json({ error: 'Employee ID, trading account number, relative ID, and broker name are required.' });
                }

                // Check if the same trading account number exists for another relative of the same employee
                const existingTradingAccount = await TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: {
                            [sequelize.Op.not]: relativeId
                        },
                        // RELATIVE_ID : relativeId,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for another relative with the same employee ID.' });
                } else {
                    // Check if the same trading account number exists for the same employee and a different relative ID
                    const existingTradingAccountForSameEmployee = await TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relativeId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_ACCOUNT_NUMBER')), '=', tradingAccountNumber.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing trading account for the same employee and relative ID
                    // const existingTradingAccountForSameEmployeeAndRelative = await TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         RELATIVE_ID: relativeId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingTradingAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee and relative.' });
                    }
                    //  else if (existingTradingAccountForSameEmployeeAndRelative) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and relative ID.' });
                    // }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee and relative.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //Relative Details Save
    router.route('/SaveAddDependentDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_NAME: encryptmodel.Sname,
                RELATIONSHIP: encryptmodel.relation,
                PAN_NO: encryptmodel.pan,
                IS_MINOR: encryptmodel.IsMinor,
                PHONE: encryptmodel.contact,
                MOBILE: encryptmodel.mobile,
                REL_OTHER_NAME: encryptmodel.other,
                RE_OPEN_ID: encryptmodel.reid,
                FINANCIAL_INDEPENDENT: encryptmodel.findept,
                IS_ACTIVE: true,
            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
                        const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_REL_DP_ENTITY, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_4 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_REL_DP_OTHERS, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //main grid data get 
    router.route('/combineDataforDependent/:EmployeeId')
        .get(async function (req, res) {

            
const checkquery = ` SELECT
            "rel"."ID",
            "rel"."RELATIONSHIP",
            CASE WHEN (
                COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
                COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
                SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
                FROM (
                    SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_OTHERS" AS "dp"
                    WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
					    AND "rel"."ID" = "dp"."REL_INFO_ID"
                        AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
                        AND "dp"."IS_ACTIVE" = true
                    
                    UNION
                    
                    SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
                    WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
					    AND "rel"."ID" = "dp_entity"."REL_INFO_ID"
                        AND "rel"."RELATIVE_NAME" = "dp_entity"."RELATIONSHIP"
                        AND "dp_entity"."IS_ACTIVE" = true
                ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT_NUMBERS",
            -- The rest of your query remains the same
            CASE WHEN COUNT("emp"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME", '-', "emp"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "TRADING_ACCOUNT_NUMBERS",
            CASE WHEN COUNT("ent"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME", '-', "ent"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "ENTITY_ACCOUNT_NUMBERS",
            MAX("rel"."RELATIVE_NAME") AS "RELATIVE_NAME",
            MAX("rel"."REL_OTHER_NAME") AS "REL_OTHER_NAME",
            "rel"."IS_MINOR" AS "IS_MINOR",
            MAX("rel"."PHONE") AS "PHONE",
            MAX("rel"."MOBILE") AS "MOBILE",
            "rel"."FINANCIAL_INDEPENDENT" AS "FINANCIAL_INDEPENDENT",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "RELATIONSHIP_NAME"
        FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" AS "emp"
            ON "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."ID" = "emp"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "emp"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
            ON "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."ID" = "ent"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "ent"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp_entity"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "dp_entity"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
            AND "dp_entity"."IS_ACTIVE" = true
        LEFT JOIN "TBL_GENERIC_MST" AS "gen"
            ON "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
        GROUP BY
            "rel"."ID", "rel"."RELATIVE_NAME", "rel"."IS_MINOR","rel"."FINANCIAL_INDEPENDENT"`;
            const resultdatas = await connect.sequelize.query(checkquery);

            console.log('resultdata[0]kk', resultdatas[0], resultdatas,req.params.EmployeeId)

            let DeptDetails = resultdatas[0].length > 0 ? true : false;
            console.log("DeptDetailsppppp",DeptDetails);
            
            const query = `
            SELECT
            "rel"."ID",
            "rel"."RELATIONSHIP",
            CASE WHEN (
                COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
                COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
                SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
                FROM (
                    SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_OTHERS" AS "dp"
                    WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
					    AND "rel"."ID" = "dp"."REL_INFO_ID"
                        AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
                        AND "dp"."IS_ACTIVE" = true
                    
                    UNION
                    
                    SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
                    WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
					    AND "rel"."ID" = "dp_entity"."REL_INFO_ID"
                        AND "rel"."RELATIVE_NAME" = "dp_entity"."RELATIONSHIP"
                        AND "dp_entity"."IS_ACTIVE" = true
                ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT_NUMBERS",
            -- The rest of your query remains the same
            CASE WHEN COUNT("emp"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME", '-', "emp"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "TRADING_ACCOUNT_NUMBERS",
            CASE WHEN COUNT("ent"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME", '-', "ent"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "ENTITY_ACCOUNT_NUMBERS",
            MAX("rel"."RELATIVE_NAME") AS "RELATIVE_NAME",
            MAX("rel"."REL_OTHER_NAME") AS "REL_OTHER_NAME",
            "rel"."IS_MINOR" AS "IS_MINOR",
            MAX("rel"."PHONE") AS "PHONE",
            MAX("rel"."MOBILE") AS "MOBILE",
            "rel"."FINANCIAL_INDEPENDENT" AS "FINANCIAL_INDEPENDENT",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "RELATIONSHIP_NAME"
        FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" AS "emp"
            ON "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."ID" = "emp"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "emp"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
            ON "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."ID" = "ent"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "ent"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp_entity"."REL_INFO_ID"
            AND "rel"."RELATIVE_NAME" = "dp_entity"."RELATIONSHIP"
            AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
            AND "dp_entity"."IS_ACTIVE" = true
        LEFT JOIN "TBL_GENERIC_MST" AS "gen"
            ON "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID", "rel"."RELATIVE_NAME", "rel"."IS_MINOR","rel"."FINANCIAL_INDEPENDENT"`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES({data,DeptDetails});
                        res.status(200).json({ Success: true, Message: 'Dependent Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Dependent data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'combineDataforDependent', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of dependent Table', Data: null });
                });
        });

    //main grid data update
    router.route('/UpdateAddDependentDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_NAME: encryptmodel.Sname,
                RELATIONSHIP: encryptmodel.relation,
                PAN_NO: encryptmodel.pan,
                IS_MINOR: encryptmodel.IsMinor,
                PHONE: encryptmodel.contact,
                MOBILE: encryptmodel.mobile,
                REL_OTHER_NAME: encryptmodel.other,
                RE_OPEN_ID: encryptmodel.reid,
                FINANCIAL_INDEPENDENT: encryptmodel.findept,
                IS_ACTIVE: true,
            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
                        const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_REL_DP_ENTITY, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_4 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_REL_DP_OTHERS, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateAddDependentDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //main grid data delete
    router.route('/DeleteDependent')
        .post(function (req, res) {
           
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();

            var param = {
                ID: encryptmodel.ID
            };
            dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result1) {
                    if (result1 != null) {
                        const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result2) {
                    if (result2 != null) {
                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();

                        var dpAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_REL_DP_OTHERS, { IS_ACTIVE: false, IS_ACCOUNT_DELETED: true }, dpAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result3) {
                    if (result3 != null) {
                        const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();

                        var dpAccountParam1 = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_REL_DP_ENTITY, { IS_ACTIVE: false, IS_ACCOUNT_DELETED: true }, dpAccountParam1);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (updateResult) {
                    var EncryptLoginDetails = dataconn.encryptionAES(updateResult);
                    res.status(200).json({ Success: true, Message: 'DependentDetails deleted successfully', Data: EncryptLoginDetails });
                })
                .catch(function (error) {
                    dataconn.errorlogger('EAH', 'DeleteDependent', error);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/SaveEntityAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
                const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
                const { employeeId, relid, entityNumber, entity, relName } = req.body;
                console.log(req.body);

                // Check if a matching ENTITY_ACCOUNT record already exists with the same combination of fields
                const existingEntityAccount = await TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        ENTITY_NAME: entity,
                        TRADING_ACCOUNT_NUMBER: entityNumber,
                        // RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_RELATIVE_INFO.findOne({
                    where: {
                        RELATIONSHIP: relid,
                        RELATIVE_NAME: relName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });

                if (existingEntityAccount) {
                    return res.status(400).json({ Success: false, Message: 'Entity Account already exists with the same combination of fields.', Data: null });
                } else if (existingEmployeeStakeRecord) {
                    let concernInfoId;
                    concernInfoId = existingEmployeeStakeRecord.ID;
                    console.log("concernInfoId", concernInfoId);
                    // Continue with saving the ENTITY_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        ENTITY_NAME: entity,
                        TRADING_ACCOUNT_NUMBER: entityNumber,
                        TRADING_OPTION: 'Eq',
                        RELATIONSHIP: relName,
                        REL_INFO_ID: concernInfoId,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                } else {

                    // Continue with saving the ENTITY_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        ENTITY_NAME: entity,
                        TRADING_ACCOUNT_NUMBER: entityNumber,
                        TRADING_OPTION: 'Eq',
                        RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                dataconn.errorlogger('EAH', 'SaveEntityAccountDetails', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error', Data: null });
            }
        });

    router.route('/SaveTradingAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
                const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
                const { employeeId, relid, trading, tradingNumber, relName } = req.body;
                console.log(req.body);

                // Check if a matching TRADING_ACCOUNT record already exists with the same TRADING_ACCOUNT_NUMBER
                const existingTradingAccount = await TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        BROKER_NAME: trading,
                        TRADING_ACCOUNT_NUMBER: tradingNumber,
                        // RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_RELATIVE_INFO.findOne({
                    where: {
                        RELATIONSHIP: relid,
                        RELATIVE_NAME: relName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });

                if (existingTradingAccount) {
                    // A matching TRADING_ACCOUNT record already exists for Employee and Relative, return an error response
                    return res.status(200).json({ Success: false, Message: 'Trading Account already exists for Employee and Relative.', Data: null });
                } else if (existingEmployeeStakeRecord) {
                    let concernInfoId;
                    concernInfoId = existingEmployeeStakeRecord.ID;
                    console.log("concernInfoId", concernInfoId);
                    // Continue with saving the TRADING_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        BROKER_NAME: trading,
                        TRADING_ACCOUNT_NUMBER: tradingNumber,
                        TRADING_OPTION: 'Eq',
                        RELATIONSHIP: relName,
                        REL_INFO_ID: concernInfoId,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                } else {

                    // Continue with saving the TRADING_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        BROKER_NAME: trading,
                        TRADING_ACCOUNT_NUMBER: tradingNumber,
                        TRADING_OPTION: 'Eq',
                        RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                dataconn.errorlogger('EAH', 'SaveTradingAccountDetails', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error', Data: null });
            }
        });

    router.route('/SaveDpAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
                const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST
                const { employeeId, relid, dp, dpNumber, relName } = req.body;
                console.log(req.body);

                // Validation
                if (!employeeId || !relid || !dp || !dpNumber) {
                    return res.status(400).json({ Success: false, Message: 'Incomplete or invalid data provided', Data: null });
                }

                // Check if a matching DP_ACCOUNT record already exists
                const existingDpEntityAccount = await TBL_EAH_REL_DP_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        DP_BROKER_NAME: dp,
                        DP_ACCOUNT_NO: dpNumber,
                        // RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    }
                });

                const existingDpOtherAccount = await TBL_EAH_REL_DP_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: relid,
                        DP_BROKER_NAME: dp,
                        DP_ACCOUNT_NO: dpNumber,
                        // RELATIONSHIP: relName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_RELATIVE_INFO.findOne({
                    where: {
                        RELATIONSHIP: relid,
                        RELATIVE_NAME: relName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });

                if (existingDpEntityAccount || existingDpOtherAccount) {
                    return res.status(200).json({ Success: false, Message: 'DP Account already exists for Employee and Relative.', Data: null });
                } else if (existingEmployeeStakeRecord) {
                    // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                    const entity = await TBL_ENTITY_MST.findOne({
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            ENTITY_NAME: dp, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    });

                    if (entity) {
                        let concernInfoId;
                        concernInfoId = existingEmployeeStakeRecord.ID;
                        console.log("concernInfoId", concernInfoId);
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: relName,
                            REL_INFO_ID: concernInfoId,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_REL_DP_ENTITY, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_OTHERS
                        let concernInfoId;
                        concernInfoId = existingEmployeeStakeRecord.ID;
                        console.log("concernInfoId", concernInfoId);
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: relName,
                            REL_INFO_ID: concernInfoId,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }

                } else {

                    // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                    const entity = await TBL_ENTITY_MST.findOne({
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            ENTITY_NAME: dp, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    });

                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: relName,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_REL_DP_ENTITY, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            IS_ACCOUNT_DELETED: false,
                            RELATIONSHIP: relName,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'DependentDemat saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                console.error('Error in SaveDpAccountDetails:', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error' });
            }
        });

    router.route('/SaveCommonDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
                const { employeeId, relid, relname, minor, mobile, pan, phone, relothername, findept } = req.body;
                console.log(req.body);

                // Check if a matching common details record already exists
                const existingRecord = await TBL_EAH_EMPLOYEE_RELATIVE_INFO.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIONSHIP: relid,
                        RELATIVE_NAME: relname,
                        // PAN_NO: pan, // Add other fields here for validation
                        // IS_MINOR: minor,
                        // PHONE: phone,
                        // MOBILE: mobile,
                        REL_OTHER_NAME: relothername,
                        IS_ACTIVE: true
                    }
                });

                if (existingRecord) {
                    // If a matching record exists, return a response indicating duplicate data
                    return res.status(200).json({ Success: false, Message: 'Duplicate Common Details', Data: null });
                }

                // If no matching record exists, create a new record
                const values = {
                    EMPLOYEE_ID: employeeId,
                    RELATIONSHIP: relid,
                    RELATIVE_NAME: relname,
                    PAN_NO: pan,
                    IS_MINOR: minor,
                    PHONE: phone,
                    MOBILE: mobile,
                    REL_OTHER_NAME: relothername,
                    FINANCIAL_INDEPENDENT: findept,
                    IS_ACTIVE: true
                };

                // Use async/await to create the record and handle errors
                const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_RELATIVE_INFO, values);

                if (result) {
                    return res.status(200).json({ Success: true, Message: 'Common data saved successfully', Data: null });
                } else {
                    return res.status(200).json({ Success: false, Message: 'Error occurred while saving', Data: null });
                }
            } catch (error) {
                // Handle any unexpected errors
                dataconn.errorlogger('EAH', 'SaveCommonDetails', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error', Data: null });
            }
        });

    router.route('/handlenext3click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 2
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'dpendentdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'handlenext3click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    ////////////////////////////////// Material Fin Rel ///////////////////////////////////////////////////////////
    router.route('/GetAllPropertyType')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'PropertyTypes'
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
                    dataconn.errorlogger('EAH', 'GetAllPropertyType', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/SaveMaterialFinRel')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                MATERIAL_FIN_REL_NAME: encryptmodel.name,
                MATERIAL_FIN_REL_MOBILE: encryptmodel.mobile,
                MATERIAL_FIN_REL_PAN: encryptmodel.pan,
                MATERIAL_FIN_REL_PHONE: encryptmodel.phone,
                RE_OPEN_ID: encryptmodel.reid,
                PROPERTY_TYPE_ID: encryptmodel.propertyid,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'MatFinRel saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveMaterialFinRel', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateMaterialFinRel')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                MATERIAL_FIN_REL_NAME: encryptmodel.name,
                MATERIAL_FIN_REL_MOBILE: encryptmodel.mobile,
                MATERIAL_FIN_REL_PAN: encryptmodel.pan,
                MATERIAL_FIN_REL_PHONE: encryptmodel.phone,
                PROPERTY_TYPE_ID: encryptmodel.propertyid,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'MatFinRel updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateMaterialFinRel', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteMaterialFinRel')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();

            dataaccess.Update(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteMaterialFinRel', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/getMateFinRel/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'COMPANY_NAME', 'MATERIAL_FIN_REL_NAME', 'MATERIAL_FIN_REL_MOBILE',
                    'MATERIAL_FIN_REL_PAN', 'MATERIAL_FIN_REL_PHONE', 'PROPERTY_TYPE_ID', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'PropertyTypes'
                        }
                    }

                ],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'getMateFinRel', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP Table', Data: null });
                });

        });

    router.route('/checkduplicateFinREl')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeid, name, pan } = encryptmodel;
                const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();

                if (!employeeid || !name || !pan) {
                    return res.status(400).json({ error: 'Employee ID and pan,name are required.' });
                }

                const existingPastEmployee = await TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP.findOne({
                    where: {
                        EMPLOYEE_ID: employeeid,
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('MATERIAL_FIN_REL_NAME')), '=', name.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('MATERIAL_FIN_REL_NAME')), '=', name.toUpperCase())
                        ],
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('MATERIAL_FIN_REL_PAN')), '=', pan.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('MATERIAL_FIN_REL_PAN')), '=', pan.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingPastEmployee) {
                    res.status(200).json({ isDuplicate: true, Message: 'Data already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'Data does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for Dat:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for Data.', Data: null });
            }
        });

    router.route('/handleMateFinRelNext')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 3
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'dpendentdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'handleMateFinRelNext', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    ///////////////////////////////// 10% Stack account details  ////////////////////////////////////////////////////////////////////
    //Stack Entity Trade Info
    router.route('/GetStackBEntityDetails/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, EMPLOYEE_CONCERN_ID: Id, CONCERN_NAME: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'EMPLOYEE_CONCERN_ID', 'CONCERN_NAME', 'ENTITY_ID', 'ENTITY_NAME_10PERCENT', 'TRADING_CODE_10PERCENT', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                include: [
                    // {
                    //     model: TBL_ENTITY_MST,
                    //     attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                    //     where: {
                    //         IS_BASE_ENTITY: true
                    //     }
                    // },
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'Concern'
                        }
                    },

                ],

            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_10PERCENT_STAKE_ENTITY, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_10PERCENT_STAKE_ENTITY Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_10PERCENT_STAKE_ENTITY Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetStackBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_10PERCENT_STAKE_ENTITY Table', Data: null });
                });

        });

    router.route('/SaveStackEntityInfo')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_CODE_10PERCENT: encryptmodel.tradecode,
                ENTITY_NAME_10PERCENT: encryptmodel.entname,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                CONCERN_NAME: encryptmodel.concerName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_10PERCENT_STAKE_ENTITY, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveStackEntityInfo', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeleteStackBaseEntById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();

            dataaccess.Update(TBL_EAH_10PERCENT_STAKE_ENTITY, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_10PERCENT_STAKE_ENTITY Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteStackBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateStackEntityInfo')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingCode, employeeConcernId } = encryptmodel;
                const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();

                if (!employeeId || !tradingCode || !employeeConcernId) {
                    return res.status(400).json({ error: 'Employee ID, trading code, employee concern ID, and broker name are required.' });
                }

                // Check if the same trading code exists for another concern with the same employee 
                const existingTradingCode = await TBL_EAH_10PERCENT_STAKE_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: {
                            [sequelize.Op.not]: employeeConcernId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingCode) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for another concern with the same employee ID.' });
                } else {
                    // Check if the same trading account number exists for the same employee and a different concern ID
                    const existingTradingAccountForSameEmployee = await TBL_EAH_10PERCENT_STAKE_ENTITY.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: employeeConcernId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing trading account for the same employee and concern ID
                    // const existingTradingAccountForSameEmployeeAndConcern = await TBL_EAH_10PERCENT_STAKE_ENTITY.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         EMPLOYEE_CONCERN_ID: employeeConcernId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingTradingAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee and concern.' });
                    }
                    //  else if (existingTradingAccountForSameEmployeeAndConcern) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and concern ID.' });
                    // }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee and concern.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //10%stack Other account 
    router.route('/SaveStackOther')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                BROKER_NAME_10PERCENT: encryptmodel.brokerName,
                TRADING_CODE_10PERCENT: encryptmodel.tradecode,
                EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                RE_OPEN_ID: encryptmodel.reid,
                TRADING_OPTION: 'Eq',
                CONCERN_NAME: encryptmodel.concerName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_EAH_10PERCENT_STAKE_OTHERS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'StackOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveStackOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetStackOther/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, EMPLOYEE_CONCERN_ID: Id, CONCERN_NAME: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME_10PERCENT', 'CONCERN_NAME', 'TRADING_CODE_10PERCENT', 'EMPLOYEE_CONCERN_ID', 'TRADING_OPTION', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'Concern'
                        }
                    },
                ],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_10PERCENT_STAKE_OTHERS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_10PERCENT_STAKE_OTHERS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_10PERCENT_STAKE_OTHERS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetStackOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_10PERCENT_STAKE_OTHERS Table', Data: null });
                });

        });

    router.route('/DeleteStackOtherById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();

            dataaccess.Update(TBL_EAH_10PERCENT_STAKE_OTHERS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_10PERCENT_STAKE_OTHERS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeleteStackOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateStackOther')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingCode, employeeConcernId, brokerName } = encryptmodel;
                const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();

                if (!employeeId || !tradingCode || !employeeConcernId || !brokerName) {
                    return res.status(400).json({ error: 'Employee ID, trading code, employee concern ID, and broker name are required.' });
                }

                // Check if the same trading code exists for another concern with the same employee 
                const existingTradingCode = await TBL_EAH_10PERCENT_STAKE_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: {
                            [sequelize.Op.not]: employeeConcernId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingTradingCode) {
                    res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for another concern with the same employee ID.' });
                } else {
                    // Check if the same trading account number exists for the same employee and a different concern ID
                    const existingTradingAccountForSameEmployee = await TBL_EAH_10PERCENT_STAKE_OTHERS.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: employeeConcernId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing trading account for the same employee and concern ID
                    // const existingTradingAccountForSameEmployeeAndConcern = await TBL_EAH_10PERCENT_STAKE_OTHERS.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         EMPLOYEE_CONCERN_ID: employeeConcernId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingTradingAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'Trading account number already exists for this employee and concern.' });
                    }
                    //  else if (existingTradingAccountForSameEmployeeAndConcern) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and concern ID.' });
                    // }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'Trading account number does not exist for this employee and concern.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for trading account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading account number.', Data: null });
            }
        });

    //10%stack demat account 
    router.route('/SaveStackDemat')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
            const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST

            // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
            TBL_ENTITY_MST.findOne({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    ENTITY_NAME: encryptmodel.brokerName, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                    // IS_BASE_ENTITY: true
                    IS_ACTIVE: true
                }
            })
                .then(function (entity) {
                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            // TYPE: req.body.type,
                            EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                            RE_OPEN_ID: encryptmodel.reid,
                            TRADING_OPTION: 'Eq',
                            CONCERN_NAME: encryptmodel.concerName,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_STK_DP_ENTITY, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'StackDemat saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveStackDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: encryptmodel.employeeid,
                            DP_BROKER_NAME: encryptmodel.brokerName,
                            DP_ACCOUNT_NO: encryptmodel.tradecode,
                            // TYPE: req.body.type,
                            EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                            TRADING_OPTION: 'Eq',
                            RE_OPEN_ID: encryptmodel.reid,
                            CONCERN_NAME: encryptmodel.concerName,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_STK_DP_OTHERS, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                                    res.status(200).json({ Success: true, Message: 'StackDemat saved successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                            .catch(function (err) {
                                dataconn.errorlogger('EAH', 'SaveStackDemat', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'SaveStackDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while checking DP_BROKER_NAME', Data: null });
                });


        });

    router.route('/GetDemat/:EmployeeId')
        .get(async function (req, res) {
            const query = `
            SELECT "DP_ACCOUNT_NO" AS dematNumber
            FROM "TBL_EAH_EMP_DP_ENTITY"
            WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}' AND "IS_ACTIVE" = true AND "TRADING_OPTION" = 'Eq'
            UNION
            SELECT "DP_ACCOUNT_NO" AS dematNumber
            FROM "TBL_EAH_EMP_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'  AND "IS_ACTIVE" = true AND "TRADING_OPTION" = 'Eq'
            UNION
            SELECT "DP_ACCOUNT_NO" AS dematNumber
            FROM "TBL_EAH_REL_DP_ENTITY"
            WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}' AND "IS_ACCOUNT_DELETED"= false  AND "IS_ACTIVE" = true AND "TRADING_OPTION" = 'Eq'
            UNION
            SELECT "DP_ACCOUNT_NO" AS dematNumber
            FROM "TBL_EAH_REL_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}' AND "IS_ACCOUNT_DELETED"= false  AND "IS_ACTIVE" = true AND "TRADING_OPTION" = 'Eq'`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Demat Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access demat data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Demat Details', Data: null });
                });
        });

    router.route('/GetStackDemat/:EmployeeId/:id/:name')
        .get(function (req, res) {
            const query = `
            SELECT * FROM (
                SELECT
                    'TBL_EAH_STK_DP_OTHERS' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
	                "EMPLOYEE_CONCERN_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "CONCERN_NAME",
                    "IS_ACTIVE"
                FROM "TBL_EAH_STK_DP_OTHERS"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "EMPLOYEE_CONCERN_ID" = '${req.params.id}'
                    AND "CONCERN_NAME" = '${req.params.name}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Eq'
                UNION ALL
                SELECT
                    'TBL_EAH_STK_DP_ENTITY' AS table_name,
                    "ID",
                    "EMPLOYEE_ID",
	                "EMPLOYEE_CONCERN_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "CONCERN_NAME",
                    "IS_ACTIVE"
                FROM "TBL_EAH_STK_DP_ENTITY"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "EMPLOYEE_CONCERN_ID" = '${req.params.id}'
                    AND "CONCERN_NAME" = '${req.params.name}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Eq'
            ) AS combined_tables`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows 
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'StackDemat Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access StackDemat data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetStackDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of StackDemat Table', Data: null });
                });
        });

    router.route('/DeleteStackDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const { ID, table_name } = encryptmodel;

            if (!ID || !table_name) {
                res.status(400).json({ Success: false, Message: 'Invalid request body', Data: null });
                return;
            }

            const isEntityTable = (table_name === 'TBL_EAH_STK_DP_ENTITY');
            const isOthersTable = (table_name === 'TBL_EAH_STK_DP_OTHERS');

            if (!isEntityTable && !isOthersTable) {
                res.status(400).json({ Success: false, Message: 'Invalid table name', Data: null });
                return;
            }

            const tableName = isEntityTable ? 'TBL_EAH_STK_DP_ENTITY' : 'TBL_EAH_STK_DP_OTHERS';
            const TBL = datamodel[tableName]();

            var param = {
                ID: ID
            };
            console.log("param", param);

            dataaccess.Update(TBL, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: `${tableName} Has No Access`, Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'DeleteStackDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });

        });

    router.route('/checkduplicateStkDp')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, dpAccount, employeeConcernId, dpBrokerName } = encryptmodel;
                const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
                const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();

                if (!employeeId || !dpAccount || !employeeConcernId || !dpBrokerName) {
                    return res.status(400).json({ error: 'Employee ID, DP account, employee concern ID, and DP broker name are required.' });
                }

                // Check if the same DP account exists for another concern ID with the same employee 
                const existingDpEntityAccount = await TBL_EAH_STK_DP_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: {
                            [sequelize.Op.not]: employeeConcernId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                const existingDpOtherAccount = await TBL_EAH_STK_DP_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: {
                            [sequelize.Op.not]: employeeConcernId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingDpEntityAccount || existingDpOtherAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account already exists for another concern with the same employee ID.' });
                } else {
                    // Check if the same DP account number exists for the same employee and a different concern ID
                    const existingEntryForSameEntityEmployeeConcern = await TBL_EAH_STK_DP_ENTITY.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: employeeConcernId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    const existingEntryForSameOtherEmployeeConcern = await TBL_EAH_STK_DP_OTHERS.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: employeeConcernId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NO')), '=', dpAccount.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });


                    if (existingEntryForSameEntityEmployeeConcern || existingEntryForSameOtherEmployeeConcern) {
                        res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for this employee and concern.' });
                    }
                    else {
                        res.status(200).json({ isDuplicate: false, Message: 'DP account number does not exist for this employee and concern.' });
                    }
                }

            } catch (error) {
                console.error('Error checking for DP account number:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for DP account number.', Data: null });
            }
        });

    //Concern Details Save
    router.route('/SaveAddConcernDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                NAME_OF_CONCERN: encryptmodel.Cname,
                EMPLOYEE_CONCERN_ID: encryptmodel.CType,
                TYPE_OF_CONCERN: encryptmodel.CTypeName,
                PAN_NO: encryptmodel.pan,
                CONCERN_OTHER_NAME: encryptmodel.Other,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true,
            };

            dataaccess.Create(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
                        const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
                        const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                        const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_10PERCENT_STAKE_ENTITY, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_10PERCENT_STAKE_OTHERS, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_STK_DP_ENTITY, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_4 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_STK_DP_OTHERS, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveAddConcernDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //main grid data get
    router.route('/combineDataforConcern/:EmployeeId')
        .get(async function (req, res) {

const checkquerystak = `
            SELECT
            "rel"."ID",
            "rel"."EMPLOYEE_CONCERN_ID",
            CASE WHEN (
            COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
            COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
            SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
            FROM (
            SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_OTHERS" AS "dp"
            WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
            AND "dp"."IS_ACTIVE" = true                    
            UNION                    
            SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp_entity"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp_entity"."CONCERN_NAME"
            AND "dp_entity"."IS_ACTIVE" = true
            ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",
            MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
            FROM
            "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_OTHERS" AS "emp"
            ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "emp"."EMPLOYEE_CONCERN_ID"
                AND "rel"."ID" = "emp"."CONCERN_INFO_ID"
                AND "rel"."NAME_OF_CONCERN" = "emp"."CONCERN_NAME"
                AND "emp"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_ENTITY" AS "ent"
            ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "ent"."EMPLOYEE_CONCERN_ID"
                AND "rel"."ID" = "ent"."CONCERN_INFO_ID"
                AND "rel"."NAME_OF_CONCERN" = "ent"."CONCERN_NAME"
                AND "ent"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
               AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
               AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
               AND "dp"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
               AND "rel"."ID" = "dp_entity"."CONCERN_INFO_ID"
               AND "rel"."NAME_OF_CONCERN" = "dp_entity"."CONCERN_NAME"
               AND "dp_entity"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
            ON
            "rel"."EMPLOYEE_CONCERN_ID" = "gen"."ID"
            WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
            GROUP BY
            "rel"."ID", "rel"."NAME_OF_CONCERN" `;
            const resultdata = await connect.sequelize.query(checkquerystak);

    
            let stakdata = resultdata[0].length > 0 ? true : false;

            const query = `
            SELECT
            "rel"."ID",
            "rel"."EMPLOYEE_CONCERN_ID",
            CASE WHEN (
            COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
            COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
            SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
            FROM (
            SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_OTHERS" AS "dp"
            WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
            AND "dp"."IS_ACTIVE" = true                    
            UNION                    
            SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp_entity"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp_entity"."CONCERN_NAME"
            AND "dp_entity"."IS_ACTIVE" = true
            ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",
            MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
            FROM
            "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_OTHERS" AS "emp"
            ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "emp"."EMPLOYEE_CONCERN_ID"
                AND "rel"."ID" = "emp"."CONCERN_INFO_ID"
                AND "rel"."NAME_OF_CONCERN" = "emp"."CONCERN_NAME"
                AND "emp"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_ENTITY" AS "ent"
            ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "ent"."EMPLOYEE_CONCERN_ID"
                AND "rel"."ID" = "ent"."CONCERN_INFO_ID"
                AND "rel"."NAME_OF_CONCERN" = "ent"."CONCERN_NAME"
                AND "ent"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
               AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
               AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
               AND "dp"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
               AND "rel"."ID" = "dp_entity"."CONCERN_INFO_ID"
               AND "rel"."NAME_OF_CONCERN" = "dp_entity"."CONCERN_NAME"
               AND "dp_entity"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
            ON
            "rel"."EMPLOYEE_CONCERN_ID" = "gen"."ID"
            WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
                AND "rel"."IS_ACTIVE" = true
            GROUP BY
            "rel"."ID", "rel"."NAME_OF_CONCERN"`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES({data,stakdata});
                        res.status(200).json({ Success: true, Message: 'Concern Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Concern data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'combineDataforConcern', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Concern Table', Data: null });
                });
        });

    //main grid data update
    router.route('/UpdateAddConcernDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                NAME_OF_CONCERN: encryptmodel.Cname,
                EMPLOYEE_CONCERN_ID: encryptmodel.CType,
                TYPE_OF_CONCERN: encryptmodel.CTypeName,
                PAN_NO: encryptmodel.pan,
                CONCERN_OTHER_NAME: encryptmodel.Other,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true,
            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, values, param)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
                        const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
                        const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                        const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_10PERCENT_STAKE_ENTITY, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_10PERCENT_STAKE_OTHERS, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_STK_DP_ENTITY, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_4 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_EAH_STK_DP_OTHERS, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'UpdateAddConcernDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //main grid data delete
    router.route('/DeleteConcern')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();

            var param = {
                ID: encryptmodel.ID
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_10PERCENT_STAKE_OTHERS, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result1) {
                    if (result1 != null) {
                        const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_10PERCENT_STAKE_ENTITY, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result2) {
                    if (result2 != null) {
                        const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();

                        var dpAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_STK_DP_OTHERS, { IS_ACTIVE: false }, dpAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result3) {
                    if (result3 != null) {
                        const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();

                        var dpAccountParam1 = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_EAH_STK_DP_ENTITY, { IS_ACTIVE: false }, dpAccountParam1);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (updateResult) {
                    var EncryptLoginDetails = dataconn.encryptionAES(updateResult);
                    res.status(200).json({ Success: true, Message: 'ConcernDetails deleted successfully', Data: EncryptLoginDetails });
                })
                .catch(function (error) {
                    dataconn.errorlogger('EAH', 'DeleteConcern', error);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/SaveSTACKEntityAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
                const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
                const { employeeId, relid, entityNumber, entity, concerName } = req.body;
                console.log(req.body);

                // Check if a matching ENTITY_ACCOUNT record already exists with the same combination of fields
                const existingEntityAccount = await TBL_EAH_10PERCENT_STAKE_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        ENTITY_NAME_10PERCENT: entity,
                        TRADING_CODE_10PERCENT: entityNumber,
                        // CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.findOne({
                    where: {
                        EMPLOYEE_CONCERN_ID: relid,
                        NAME_OF_CONCERN: concerName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });



                if (existingEntityAccount) {
                    return res.status(400).json({ Success: false, Message: 'Entity Account already exists with the same combination of fields.', Data: null });
                } else if (existingEmployeeStakeRecord) {
                    let concernInfoId;
                    concernInfoId = existingEmployeeStakeRecord.ID;
                    console.log("concernInfoId", concernInfoId);
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        ENTITY_NAME_10PERCENT: entity,
                        TRADING_CODE_10PERCENT: entityNumber,
                        TRADING_OPTION: 'Eq',
                        CONCERN_NAME: concerName,
                        CONCERN_INFO_ID: concernInfoId,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_10PERCENT_STAKE_ENTITY, values);
                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }

                } else {
                    // Continue with saving the ENTITY_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        ENTITY_NAME_10PERCENT: entity,
                        TRADING_CODE_10PERCENT: entityNumber,
                        TRADING_OPTION: 'Eq',
                        CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    };

                    console.log("concernInfoId", concernInfoId);
                    const result = await dataaccess.Create(TBL_EAH_10PERCENT_STAKE_ENTITY, values);
                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                dataconn.errorlogger('EAH', 'SaveSTACKEntityAccountDetails', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error', Data: null });
            }
        });

    router.route('/SaveSTACKTradingAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
                const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
                const { employeeId, relid, trading, tradingNumber, concerName } = req.body;
                console.log(req.body);

                // Check if a matching TRADING_ACCOUNT record already exists with the same TRADING_ACCOUNT_NUMBER
                const existingTradingAccount = await TBL_EAH_10PERCENT_STAKE_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        BROKER_NAME_10PERCENT: trading,
                        TRADING_CODE_10PERCENT: tradingNumber,
                        // CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.findOne({
                    where: {
                        EMPLOYEE_CONCERN_ID: relid,
                        NAME_OF_CONCERN: concerName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });

                if (existingTradingAccount) {
                    // A matching TRADING_ACCOUNT record already exists for Employee and Relative, return an error response
                    return res.status(200).json({ Success: false, Message: 'Trading Account already exists for Employee and Relative.', Data: null });
                } else if (existingEmployeeStakeRecord) {
                    let concernInfoId;
                    concernInfoId = existingEmployeeStakeRecord.ID;
                    console.log("concernInfoId", concernInfoId);
                    // Continue with saving the TRADING_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        BROKER_NAME_10PERCENT: trading,
                        TRADING_CODE_10PERCENT: tradingNumber,
                        TRADING_OPTION: 'Eq',
                        CONCERN_NAME: concerName,
                        CONCERN_INFO_ID: concernInfoId,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_10PERCENT_STAKE_OTHERS, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                } else {
                    // Continue with saving the TRADING_ACCOUNT record
                    const values = {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        BROKER_NAME_10PERCENT: trading,
                        TRADING_CODE_10PERCENT: tradingNumber,
                        TRADING_OPTION: 'Eq',
                        CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    };

                    const result = await dataaccess.Create(TBL_EAH_10PERCENT_STAKE_OTHERS, values);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'Entity data saved successfully', Data: result });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving Entity record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                dataconn.errorlogger('EAH', 'SaveSTACKTradingAccountDetails', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error', Data: null });
            }
        });

    router.route('/SaveSTACKDpAccountDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
                const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
                const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST
                const { employeeId, relid, dp, dpNumber, concerName } = req.body;
                console.log(req.body);

                // Validation
                if (!employeeId || !relid || !dp || !dpNumber) {
                    return res.status(400).json({ Success: false, Message: 'Incomplete or invalid data provided', Data: null });
                }

                // Check if a matching DP_ACCOUNT record already exists
                const existingDpEntityAccount = await TBL_EAH_STK_DP_ENTITY.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        DP_BROKER_NAME: dp,
                        DP_ACCOUNT_NO: dpNumber,
                        // CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    }
                });

                const existingDpOtherAccount = await TBL_EAH_STK_DP_OTHERS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        DP_BROKER_NAME: dp,
                        DP_ACCOUNT_NO: dpNumber,
                        // CONCERN_NAME: concerName,
                        IS_ACTIVE: true
                    }
                });

                const existingEmployeeStakeRecord = await TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.findOne({
                    where: {
                        EMPLOYEE_CONCERN_ID: relid,
                        NAME_OF_CONCERN: concerName,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'IS_ACTIVE'],
                });

                if (existingDpEntityAccount || existingDpOtherAccount) {
                    return res.status(200).json({ Success: false, Message: 'DP Account already exists for Employee and Relative.', Data: null });
                } else if (existingEmployeeStakeRecord) {

                    // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                    const entity = await TBL_ENTITY_MST.findOne({
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            ENTITY_NAME: dp, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    });

                    if (entity) {
                        let concernInfoId;
                        concernInfoId = existingEmployeeStakeRecord.ID;
                        console.log("concernInfoId", concernInfoId);
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            CONCERN_NAME: concerName,
                            CONCERN_INFO_ID: concernInfoId,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_STK_DP_ENTITY, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'STACKDpAccountDetails saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_OTHERS
                        let concernInfoId;
                        concernInfoId = existingEmployeeStakeRecord.ID;
                        console.log("concernInfoId", concernInfoId);
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            CONCERN_NAME: concerName,
                            CONCERN_INFO_ID: concernInfoId,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_STK_DP_OTHERS, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'STACKDpAccountDetails saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }
                } else {
                    // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                    const entity = await TBL_ENTITY_MST.findOne({
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            ENTITY_NAME: dp, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    });

                    if (entity) {
                        // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_ENTITY
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            CONCERN_NAME: concerName,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_STK_DP_ENTITY, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'STACKDpAccountDetails saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    } else {
                        // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_STK_DP_OTHERS
                        const values = {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: relid,
                            DP_BROKER_NAME: dp,
                            DP_ACCOUNT_NO: dpNumber,
                            TRADING_OPTION: 'Eq',
                            CONCERN_NAME: concerName,
                            IS_ACTIVE: true
                        };

                        const result = await dataaccess.Create(TBL_EAH_STK_DP_OTHERS, values);

                        if (result) {
                            return res.status(200).json({ Success: true, Message: 'STACKDpAccountDetails saved successfully' });
                        } else {
                            return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }
                }

            } catch (error) {
                // Handle any unexpected errors
                console.error('Error in SaveSTACKDpAccountDetails:', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error' });
            }

        });

    router.route('/SaveSTACKCommonDetails')
        .post(async function (req, res) {
            try {
                const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
                const { employeeId, relid, relname, pan, contype, othername } = req.body;
                console.log(req.body);

                // Validation
                if (!employeeId || !relid || !relname) {
                    return res.status(400).json({ Success: false, Message: 'Incomplete or invalid data provided', Data: null });
                }

                // Check if a matching common details record already exists
                const existingRecord = await TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: relid,
                        NAME_OF_CONCERN: relname,
                        // TYPE_OF_CONCERN: contype,
                        CONCERN_OTHER_NAME: othername,
                        IS_ACTIVE: true
                    }
                });

                if (existingRecord) {
                    // If a matching record exists, return a response indicating duplicate data
                    return res.status(200).json({ Success: false, Message: 'Duplicate Common Details', Data: null });
                }

                // If no matching record exists, create a new record
                const values = {
                    EMPLOYEE_ID: employeeId,
                    EMPLOYEE_CONCERN_ID: relid,
                    TYPE_OF_CONCERN: contype,
                    NAME_OF_CONCERN: relname,
                    PAN_NO: pan,
                    CONCERN_OTHER_NAME: othername,
                    IS_ACTIVE: true
                };

                // Use async/await to create the record and handle errors
                const result = await dataaccess.Create(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, values);

                if (result) {
                    return res.status(200).json({ Success: true, Message: 'Common data saved successfully', Data: null });
                } else {
                    return res.status(200).json({ Success: false, Message: 'Error occurred while saving', Data: null });
                }
            } catch (error) {
                // Handle any unexpected errors
                console.error('Error in SaveSTACKCommonDetails:', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error' });
            }
        });

    router.route('/handlenext4click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 4
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'concern updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'handlenext4click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    ///////////////////////////////////// security holdings /////////////////////////////////////////////////////////////
    router.route('/AllDP/:EmployeeId')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const query = `
            WITH EmpDp AS (	
                SELECT
                    'Self' AS Relation,
                    '${encryptmodel.name}' AS Name,
                    emp_entity."DP_BROKER_NAME" AS BrokerName,
                    emp_entity."DP_ACCOUNT_NO" AS DPAccount,
                    emp_entity."UPLOAD_PATH" AS uploadedFile,
                    emp_entity."AUTHORIZE_EW" AS authorize,
                    null AS isprovide,
                    emp_entity."ID"
                FROM
                    "TBL_EAH_EMP_DP_ENTITY" emp_entity
                WHERE
                    emp_entity."EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND emp_entity."TRADING_OPTION" = 'Eq'
                    AND emp_entity."IS_ACTIVE" = true
            
                UNION ALL
            
                SELECT
                    'Self' AS Relation,
                    '${encryptmodel.name}' AS Name,
                    emp_others."DP_BROKER_NAME" AS BrokerName,
                    emp_others."DP_ACCOUNT_NO" AS DPAccount,
                    emp_others."UPLOAD_PATH" AS uploadedFile,
                    null AS authorize,
                     emp_others."PROVIDE_DEMAT" AS isprovide,
                     emp_others."ID"
                FROM
                    "TBL_EAH_EMP_DP_OTHERS" emp_others
                WHERE
                    emp_others."EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND emp_others."TRADING_OPTION" = 'Eq'
                    AND emp_others."IS_ACTIVE" = true
                  ),
                 Relatives AS (
                        SELECT 
                        eri."RELATIVE_NAME" AS Name, gm."NAME" AS Relation, eri."RELATIONSHIP",eri."ID"
                        FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" eri
                        JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                        WHERE eri."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND eri."IS_ACTIVE" = TRUE
                  ),
                  Concern AS (
                         SELECT 
                         eri."NAME_OF_CONCERN" AS Name, gm."NAME" AS Relation, eri."EMPLOYEE_CONCERN_ID",eri."ID"
                         FROM "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" eri
                         JOIN "TBL_GENERIC_MST" gm ON eri."EMPLOYEE_CONCERN_ID" = gm."ID"
                         WHERE eri."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND eri."IS_ACTIVE" = TRUE
                   )
                   SELECT
                       EmpDp.Relation,
                       EmpDp.Name,
                       EmpDp.BrokerName,
                       EmpDp.DPAccount,
                       EmpDp.uploadedFile,
                       EmpDp.authorize,
                       EmpDp.isprovide,
                       EmpDp."ID"
                       FROM EmpDp
                    UNION ALL
                        SELECT
                        Relatives.Relation,
                        Relatives.Name,
                        dp."DP_BROKER_NAME" AS BrokerName,
                        dp."DP_ACCOUNT_NO" AS DPAccount,
                        dp."UPLOAD_PATH" AS uploadedFile,
                        dp."AUTHORIZE_EW" AS authorize,
                        null AS isprovide,
                        dp."ID"
                        FROM Relatives
                        JOIN "TBL_EAH_REL_DP_ENTITY" dp ON Relatives."RELATIONSHIP" = dp."RELATIVE_ID" AND Relatives."ID" = dp."REL_INFO_ID"
                        WHERE dp."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND dp."TRADING_OPTION" = 'Eq' AND dp."IS_ACTIVE" = true
                    UNION ALL
                        SELECT
                        Relatives.Relation,
                        Relatives.Name,
                        dp1."DP_BROKER_NAME" AS BrokerName,
                        dp1."DP_ACCOUNT_NO" AS DPAccount,
                        dp1."UPLOAD_PATH" AS uploadedFile,
                        null AS authorize,
                        dp1."PROVIDE_DEMAT" AS isprovide,
                        dp1."ID"
                        FROM Relatives
                        JOIN "TBL_EAH_REL_DP_OTHERS" dp1 ON Relatives."RELATIONSHIP" = dp1."RELATIVE_ID" AND Relatives."ID" = dp1."REL_INFO_ID"
                        WHERE dp1."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND dp1."TRADING_OPTION" = 'Eq' AND dp1."IS_ACTIVE" = true
                    UNION ALL
                        SELECT
                        Concern.Relation,
                        Concern.Name,
                        stk_dp."DP_BROKER_NAME" AS BrokerName,
                        stk_dp."DP_ACCOUNT_NO" AS DPAccount,
                        stk_dp."UPLOAD_PATH" AS uploadedFile,
                        stk_dp."AUTHORIZE_EW" AS authorize,
                        null AS isprovide,
                        stk_dp."ID"
                        FROM Concern
                        JOIN "TBL_EAH_STK_DP_ENTITY" stk_dp ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp."EMPLOYEE_CONCERN_ID" AND Concern."ID" = stk_dp."CONCERN_INFO_ID"
                        WHERE stk_dp."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND stk_dp."TRADING_OPTION" = 'Eq' AND stk_dp."IS_ACTIVE" = true
                    UNION ALL
                        SELECT
                        Concern.Relation,
                        Concern.Name,
                        stk_dp1."DP_BROKER_NAME" AS BrokerName,
                        stk_dp1."DP_ACCOUNT_NO" AS DPAccount,
                        stk_dp1."UPLOAD_PATH" AS uploadedFile,
                        null AS authorize,
                        stk_dp1."PROVIDE_DEMAT" AS isprovide,
                        stk_dp1."ID"
                        FROM Concern
                        JOIN "TBL_EAH_STK_DP_OTHERS" stk_dp1 ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp1."EMPLOYEE_CONCERN_ID" AND Concern."ID" = stk_dp1."CONCERN_INFO_ID"
                        WHERE stk_dp1."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND stk_dp1."TRADING_OPTION" = 'Eq' AND stk_dp1."IS_ACTIVE" = true`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Concern Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Concern data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'AllDP', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Concern Table', Data: null });
                });
        });

    //upload file for self_demat

    router.route('/SaveUploadFilePathforSelf')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        // AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            // AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforSelf')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 // AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //         // var values = {
    //         //     PROVIDE_DEMAT: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     // AUTHORIZE_EW: null,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforSelf', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });


    router.route('/SaveUploadFilePathforSelf1')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
                    console.log(req.body);
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
                    console.log(values);
                    console.log(param);

                    dataaccess.Update(TBL_EAH_EMP_DP_ENTITY, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
                        console.log(req.body);
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
                        console.log(values);
                        console.log(param);

                        dataaccess.Update(TBL_EAH_EMP_DP_ENTITY, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforSelf1')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
    //             console.log(req.body);
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
    //             console.log(values);
    //             console.log(param);

    //             dataaccess.Update(TBL_EAH_EMP_DP_ENTITY, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
    //         // console.log(req.body);
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };
    //         // console.log(values);
    //         // console.log(param);

    //         // dataaccess.Update(TBL_EAH_EMP_DP_ENTITY, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforSelf1', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });


    //upload file for rel_demat
    router.route('/SaveUploadFilePathforREL')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        // AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            // AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforREL')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 // AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //         // var values = {
    //         //     PROVIDE_DEMAT: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     // AUTHORIZE_EW: null,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforREL', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });


    router.route('/SaveUploadFilePathforREL1')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                    console.log(req.body);
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
                    console.log(values);
                    console.log(param);

                    dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                        console.log(req.body);
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
                        console.log(values);
                        console.log(param);

                        dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforREL1')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
    //             console.log(req.body);
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };
    //             console.log(values);
    //             console.log(param);

    //             dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
    //         // console.log(req.body);
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };
    //         // console.log(values);
    //         // console.log(param);

    //         // dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforREL1', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    //upload file for stk_demat

    router.route('/SaveUploadFilePathforSTK')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        // AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            // AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforSTK')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 // AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
    //         // var values = {
    //         //     PROVIDE_DEMAT: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     // AUTHORIZE_EW: null,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforSTK', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    router.route('/SaveUploadFilePathforSTK1')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SaveUploadFilePathforSTK1')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NO: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NO: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveUploadFilePathforSTK1', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    //Authorize for self
    router.route('/SaveAuthorizeforSelf')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
            var values = {
                // PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_EMP_DP_ENTITY, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'self updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveAuthorizeforSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //Authorize for rel
    router.route('/SaveAuthorizeforREL')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
            var values = {
                // PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveAuthorizeforREL', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //Authorize for stk
    router.route('/SaveAuthorizeforSTK')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
            var values = {
                // PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveAuthorizeforSTK', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //emaillater for self
    router.route('/SaveEmailLaterSelf')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                // AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'self updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveEmailLaterSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //emaillater for rel
    router.route('/SaveEmailLaterREL')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                // AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveEmailLaterREL', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //Authorize for stk
    router.route('/SaveEmailLaterSTK')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                // AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NO: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveEmailLaterSTK', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //jdsecurity holding
    router.route('/saveJDPhySecurityHoldRelation')
        .post(async function (req, res) {
            try {
                const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
                const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST
                const { eid, f_path, auth, broker, dpaccount } = req.body;
                console.log(req.body);

                // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                const entity = await TBL_ENTITY_MST.findOne({
                    attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                    where: {
                        ENTITY_NAME: broker, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                        // IS_BASE_ENTITY: true
                        IS_ACTIVE: true
                    }
                });

                if (entity) {
                    // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_ENTITY
                    const values = {
                        AUTHORIZE_EW: auth,
                        UPLOAD_PATH: f_path
                    };

                    const param = {
                        EMPLOYEE_ID: eid,
                        DP_BROKER_NAME: broker,
                        DP_ACCOUNT_NO: dpaccount,
                        IS_ACTIVE: true
                    }

                    const result = await dataaccess.Update(TBL_EAH_REL_DP_ENTITY, values, param);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'DependentDemat updated successfully' });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                } else {
                    // DP_BROKER_NAME does not exist in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_OTHERS

                    if (auth === null) {
                        values = {
                            PROVIDE_DEMAT: false,
                            UPLOAD_PATH: f_path,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                        }
                    } else {
                        values = {
                            PROVIDE_DEMAT: true,
                            UPLOAD_PATH: f_path,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: false,
                        }
                    }

                    const param = {
                        EMPLOYEE_ID: eid,
                        DP_BROKER_NAME: broker,
                        DP_ACCOUNT_NO: dpaccount,
                        IS_ACTIVE: true
                    }

                    const result = await dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'DependentDemat updated successfully' });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                console.error('Error in SaveDpAccountDetails:', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error' });
            }
        });

    router.route('/saveJDPhySecurityHoldOther')
        .post(async function (req, res) {
            try {
                const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
                const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
                const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST
                const { eid, f_path, auth, broker, dpaccount } = req.body;
                console.log(req.body);

                // First, check if DP_BROKER_NAME exists in TBL_ENTITY_MST
                const entity = await TBL_ENTITY_MST.findOne({
                    attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                    where: {
                        ENTITY_NAME: broker, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                        // IS_BASE_ENTITY: true
                        IS_ACTIVE: true
                    }
                });

                if (entity) {
                    // DP_BROKER_NAME exists in TBL_ENTITY_MST, save in TBL_EAH_REL_DP_ENTITY
                    const values = {
                        AUTHORIZE_EW: auth,
                        UPLOAD_PATH: f_path
                    };

                    const param = {
                        EMPLOYEE_ID: eid,
                        DP_BROKER_NAME: broker,
                        DP_ACCOUNT_NO: dpaccount,
                        IS_ACTIVE: true
                    }

                    const result = await dataaccess.Update(TBL_EAH_STK_DP_ENTITY, values, param);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'stack updated successfully' });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                } else {

                    if (auth === null) {
                        values = {
                            PROVIDE_DEMAT: false,
                            UPLOAD_PATH: f_path,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                        }
                    } else {
                        values = {
                            PROVIDE_DEMAT: true,
                            UPLOAD_PATH: f_path,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: false,
                        }
                    }

                    const param = {
                        EMPLOYEE_ID: eid,
                        DP_BROKER_NAME: broker,
                        DP_ACCOUNT_NO: dpaccount,
                        IS_ACTIVE: true
                    }

                    const result = await dataaccess.Update(TBL_EAH_STK_DP_OTHERS, values, param);

                    if (result) {
                        return res.status(200).json({ Success: true, Message: 'stack updated successfully' });
                    } else {
                        return res.status(500).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }
            } catch (error) {
                // Handle any unexpected errors
                console.error('Error in saveJDPhySecurityHoldOther:', error);
                return res.status(500).json({ Success: false, Message: 'Internal server error' });
            }
        });

    //////////////////////////////////////// Physical Share Holding ////////////////////////////////////////////////
    //upload file
    router.route('/SavePhysicalShareUploadFile')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
                    var values = {
                        EMPLOYEE_ID: requestBody.eid,
                        UPLOAD_PATH: filepath,
                        IS_ACTIVE: true
                    };

                    dataaccess.Create(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
                        var values = {
                            EMPLOYEE_ID: requestBody.eid,
                            UPLOAD_PATH: filepath,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/SavePhysicalShareUploadFile')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    //             var values = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 UPLOAD_PATH: filepath,
    //                 IS_ACTIVE: true
    //             };

    //             dataaccess.Create(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    //         // var values = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     IS_ACTIVE: true
    //         // };

    //         // dataaccess.Create(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'physicalshare updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SavePhysicalShareUploadFile', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    router.route('/UpdatePhysicalShareUploadFile')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
                    var values = {
                        // EMPLOYEE_ID: req.body.eid,
                        UPLOAD_PATH: filepath,

                    };
                    var param = {
                        ID: requestBody.ID,
                        IS_ACTIVE: true
                    }

                    dataaccess.Update(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
                        var values = {
                            // EMPLOYEE_ID: req.body.eid,
                            UPLOAD_PATH: filepath,

                        };
                        var param = {
                            ID: requestBody.ID,
                            IS_ACTIVE: true
                        }

                        dataaccess.Update(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });
    // router.route('/UpdatePhysicalShareUploadFile')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    //             var values = {
    //                 // EMPLOYEE_ID: req.body.eid,
    //                 UPLOAD_PATH: filepath,

    //             };
    //             var param = {
    //                 ID: requestBody.ID,
    //                 IS_ACTIVE: true
    //             }

    //             dataaccess.Update(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    //         // var values = {
    //         //     // EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,

    //         // };
    //         // var param = {
    //         //     ID: req.body.ID,
    //         //     IS_ACTIVE: true
    //         // }

    //         // dataaccess.Update(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'physicalshare updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'UpdatePhysicalShareUploadFile', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    router.route('/saveJDPhyShareHold')
        .post(async (req, res) => {
            try {
                const { eid, f_path } = req.body;
                const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();

                if (!eid || !f_path) {
                    return res.status(400).json({ error: 'Employee ID and physicalsharfeholding are required.' });
                }

                // Check if a record with the same EMPLOYEE_ID and UPLOAD_PATH already exists
                const duplicateRecord = await TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING.findOne({
                    where: {
                        EMPLOYEE_ID: eid,
                        UPLOAD_PATH: f_path,
                        IS_ACTIVE: true
                    }
                });

                if (duplicateRecord) {
                    res.status(200).json({ isDuplicate: true, Message: 'A duplicate record already exists. Data not saved.' });
                } else {
                    // No duplicate found, save the new record
                    const newRecord = {
                        EMPLOYEE_ID: eid,
                        UPLOAD_PATH: f_path,
                        IS_ACTIVE: true, // Set other necessary fields as well
                        // Add other fields as needed
                    };

                    const savedRecord = await TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING.create(newRecord);

                    res.status(200).json({ isDuplicate: false, Message: 'Record saved successfully.', Data: savedRecord });
                }
            } catch (error) {
                console.error('Error saving physicalsharfeholding:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while saving physicalsharfeholding.', Data: null });
            }
        });

    //get  upload file
    router.route('/GetPhysicalHolding/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'UPLOAD_PATH', 'IS_ACTIVE'],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetPhysicalHolding', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING Table', Data: null });
                });

        });

    //delete
    router.route('/DeletePSHoldingById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();

            dataaccess.Update(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'DeletePSHoldingById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/handlenext5click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 5
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'concern updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'handlenext5click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    /////////////////////////////////////////////////// Commodities ////////////////////////////////////////////////////////////////////
    router.route('/GetClientName/:EmployeeId')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const query = `
                            SELECT CONCAT(eri."RELATIVE_NAME", ' (', gm."NAME", ')') AS Name
                            FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" eri
							JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                            WHERE eri."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND eri."IS_ACTIVE" = true
                            UNION
                            SELECT '${encryptmodel.name}'|| '(Self)' AS Name`

            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'clientname Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access demat data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetClientName', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of clientname Details', Data: null });
                });
        });
    router.route('/SaveCommUploadFileForSelf')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                    console.log(req.body);

                    var values = {
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENTNAME: requestBody.clientName,
                        DP_BROKER_NAME: requestBody.comtrackParticipantName,
                        DP_ACCOUNT_NO: requestBody.comtrackId,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date(),
                        IS_UPLOAD: true,
                        PROVIDE_DEMAT: false,
                        RE_OPEN_ID: requestBody.reid,
                        TRADING_OPTION: 'Comm',
                        IS_ACTIVE: true
                    };


                    dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                        .then(async function (result) {
                            if (result != null) {
                                const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                                const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                                    where: {
                                        CLIENT_ID: requestBody.clientName,
                                        EMPLOYEE_ID: requestBody.eid
                                    }
                                });


                                if (!existingRecord) {
                                    // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                                    await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
                                }
                                res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                        console.log(req.body);

                        var values = {
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENTNAME: requestBody.clientName,
                            DP_BROKER_NAME: requestBody.comtrackParticipantName,
                            DP_ACCOUNT_NO: requestBody.comtrackId,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date(),
                            IS_UPLOAD: true,
                            PROVIDE_DEMAT: false,
                            RE_OPEN_ID: requestBody.reid,
                            TRADING_OPTION: 'Comm',
                            IS_ACTIVE: true
                        };


                        dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                            .then(async function (result) {
                                if (result != null) {
                                    const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                                    const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                                        where: {
                                            CLIENT_ID: requestBody.clientName,
                                            EMPLOYEE_ID: requestBody.eid
                                        }
                                    });


                                    if (!existingRecord) {
                                        // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                                        await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
                                    }
                                    res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId
        });

    // router.route('/SaveCommUploadFileForSelf')
    //     .post(upload.any(), async function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         // const Folder_Path = path.join(__dirname + '/.');
    //         const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //             console.log(req.body);

    //             var values = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENTNAME: requestBody.clientName,
    //                 DP_BROKER_NAME: requestBody.comtrackParticipantName,
    //                 DP_ACCOUNT_NO: requestBody.comtrackId,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date(),
    //                 IS_UPLOAD: true,
    //                 PROVIDE_DEMAT: false,
    //                 RE_OPEN_ID: requestBody.reid,
    //                 TRADING_OPTION: 'Comm',
    //                 IS_ACTIVE: true
    //             };


    //             dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
    //                 .then(async function (result) {
    //                     if (result != null) {
    //                         const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //                         const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
    //                             where: {
    //                                 CLIENT_ID: requestBody.clientName,
    //                                 EMPLOYEE_ID: requestBody.eid
    //                             }
    //                         });


    //                         if (!existingRecord) {
    //                             // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
    //                             await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
    //                         }
    //                         res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //         // console.log(req.body);

    //         // var values = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENTNAME: req.body.clientName,
    //         //     DP_BROKER_NAME: req.body.comtrackParticipantName,
    //         //     DP_ACCOUNT_NO: req.body.comtrackId,
    //         //     UPLOAD_PATH: req.body.file,
    //         //     UPLOAD_DATE: new Date(),
    //         //     IS_UPLOAD: true,
    //         //     PROVIDE_DEMAT: false,
    //         //     RE_OPEN_ID: req.body.reid,
    //         //     TRADING_OPTION: 'Comm',
    //         //     IS_ACTIVE: true
    //         // };


    //         // dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
    //         //     .then(async function (result) {
    //         //         if (result != null) {
    //         //             const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //         //             const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
    //         //                 where: {
    //         //                     CLIENT_ID: req.body.clientName,
    //         //                     EMPLOYEE_ID: req.body.eid
    //         //                 }
    //         //             });


    //         //             if (!existingRecord) {
    //         //                 // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
    //         //                 await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: req.body.clientName, EMPLOYEE_ID: req.body.eid });
    //         //             }
    //         //             res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveCommUploadFileForSelf', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //         //     });
    //     });
    router.route('/SaveCommUploadFileForRel')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                    var values = {
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENTNAME: requestBody.clientName,
                        DP_BROKER_NAME: requestBody.comtrackParticipantName,
                        DP_ACCOUNT_NO: requestBody.comtrackId,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date(),
                        IS_UPLOAD: true,
                        PROVIDE_DEMAT: false,
                        TRADING_OPTION: 'Comm',
                        RE_OPEN_ID: requestBody.reid,
                        RELATIONSHIP: requestBody.clientName,
                        IS_ACTIVE: true
                    };

                    dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
                        .then(async function (result) {
                            if (result != null) {
                                const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                                const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                                    where: {
                                        CLIENT_ID: requestBody.clientName,
                                        EMPLOYEE_ID: requestBody.eid
                                    }
                                });


                                if (!existingRecord) {
                                    // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                                    await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
                                }
                                res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                        var values = {
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENTNAME: requestBody.clientName,
                            DP_BROKER_NAME: requestBody.comtrackParticipantName,
                            DP_ACCOUNT_NO: requestBody.comtrackId,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date(),
                            IS_UPLOAD: true,
                            PROVIDE_DEMAT: false,
                            TRADING_OPTION: 'Comm',
                            RE_OPEN_ID: requestBody.reid,
                            RELATIONSHIP: requestBody.clientName,
                            IS_ACTIVE: true
                        };

                        dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
                            .then(async function (result) {
                                if (result != null) {
                                    const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                                    const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                                        where: {
                                            CLIENT_ID: requestBody.clientName,
                                            EMPLOYEE_ID: requestBody.eid
                                        }
                                    });


                                    if (!existingRecord) {
                                        // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                                        await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
                                    }
                                    res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });

    // router.route('/SaveCommUploadFileForRel')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //             var values = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENTNAME: requestBody.clientName,
    //                 DP_BROKER_NAME: requestBody.comtrackParticipantName,
    //                 DP_ACCOUNT_NO: requestBody.comtrackId,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date(),
    //                 IS_UPLOAD: true,
    //                 PROVIDE_DEMAT: false,
    //                 TRADING_OPTION: 'Comm',
    //                 RE_OPEN_ID: requestBody.reid,
    //                 RELATIONSHIP: requestBody.clientName,
    //                 IS_ACTIVE: true
    //             };

    //             dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
    //                 .then(async function (result) {
    //                     if (result != null) {
    //                         const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //                         const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
    //                             where: {
    //                                 CLIENT_ID: requestBody.clientName,
    //                                 EMPLOYEE_ID: requestBody.eid
    //                             }
    //                         });


    //                         if (!existingRecord) {
    //                             // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
    //                             await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: requestBody.clientName, EMPLOYEE_ID: requestBody.eid });
    //                         }
    //                         res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //         // var values = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENTNAME: req.body.clientName,
    //         //     DP_BROKER_NAME: req.body.comtrackParticipantName,
    //         //     DP_ACCOUNT_NO: req.body.comtrackId,
    //         //     UPLOAD_PATH: req.body.file,
    //         //     UPLOAD_DATE: new Date(),
    //         //     IS_UPLOAD: true,
    //         //     PROVIDE_DEMAT: false,
    //         //     TRADING_OPTION: 'Comm',
    //         //     RE_OPEN_ID: req.body.reid,
    //         //     RELATIONSHIP: req.body.clientName,
    //         //     IS_ACTIVE: true
    //         // };

    //         // dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
    //         //     .then(async function (result) {
    //         //         if (result != null) {
    //         //             const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //         //             const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
    //         //                 where: {
    //         //                     CLIENT_ID: req.body.clientName,
    //         //                     EMPLOYEE_ID: req.body.eid
    //         //                 }
    //         //             });


    //         //             if (!existingRecord) {
    //         //                 // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
    //         //                 await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: req.body.clientName, EMPLOYEE_ID: req.body.eid });
    //         //             }
    //         //             res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'SaveCommUploadFileForRel', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //         //     });
    //     });
    router.route('/UpdateCommUploadFileForSelf')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                    var values = {
                        UPLOAD_PATH: filepath,
                        RE_OPEN_ID: requestBody.reid,

                    };
                    var param = {
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENTNAME: requestBody.clientName,
                        DP_BROKER_NAME: requestBody.comtrackParticipantName,
                        DP_ACCOUNT_NO: requestBody.comtrackId,
                        TRADING_OPTION: 'Comm',
                        IS_ACTIVE: true
                    }

                    dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
                        var values = {
                            UPLOAD_PATH: filepath,
                            RE_OPEN_ID: requestBody.reid,

                        };
                        var param = {
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENTNAME: requestBody.clientName,
                            DP_BROKER_NAME: requestBody.comtrackParticipantName,
                            DP_ACCOUNT_NO: requestBody.comtrackId,
                            TRADING_OPTION: 'Comm',
                            IS_ACTIVE: true
                        }

                        dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });

    // router.route('/UpdateCommUploadFileForSelf')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //             var values = {
    //                 UPLOAD_PATH: filepath,
    //                 RE_OPEN_ID: requestBody.reid,

    //             };
    //             var param = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENTNAME: requestBody.clientName,
    //                 DP_BROKER_NAME: requestBody.comtrackParticipantName,
    //                 DP_ACCOUNT_NO: requestBody.comtrackId,
    //                 TRADING_OPTION: 'Comm',
    //                 IS_ACTIVE: true
    //             }

    //             dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    //         // var values = {
    //         //     UPLOAD_PATH: req.body.file,
    //         //     RE_OPEN_ID: req.body.reid,

    //         // };
    //         // var param = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENTNAME: req.body.clientName,
    //         //     DP_BROKER_NAME: req.body.comtrackParticipantName,
    //         //     DP_ACCOUNT_NO: req.body.comtrackId,
    //         //     TRADING_OPTION: 'Comm',
    //         //     IS_ACTIVE: true
    //         // }

    //         // dataaccess.Update(TBL_EAH_EMP_DP_OTHERS, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'commself updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'UpdateCommUploadFileForSelf', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/UpdateCommUploadFileForRel')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                    var values = {
                        UPLOAD_PATH: filepath,
                        RE_OPEN_ID: requestBody.reid,

                    };
                    var param = {
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENTNAME: requestBody.clientName,
                        DP_BROKER_NAME: requestBody.comtrackParticipantName,
                        DP_ACCOUNT_NO: requestBody.comtrackId,
                        TRADING_OPTION: 'Comm',
                        IS_ACTIVE: true
                    }

                    dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
                        var values = {
                            UPLOAD_PATH: filepath,
                            RE_OPEN_ID: requestBody.reid,

                        };
                        var param = {
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENTNAME: requestBody.clientName,
                            DP_BROKER_NAME: requestBody.comtrackParticipantName,
                            DP_ACCOUNT_NO: requestBody.comtrackId,
                            TRADING_OPTION: 'Comm',
                            IS_ACTIVE: true
                        }

                        dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });

    // router.route('/UpdateCommUploadFileForRel')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //             var values = {
    //                 UPLOAD_PATH: filepath,
    //                 RE_OPEN_ID: requestBody.reid,

    //             };
    //             var param = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENTNAME: requestBody.clientName,
    //                 DP_BROKER_NAME: requestBody.comtrackParticipantName,
    //                 DP_ACCOUNT_NO: requestBody.comtrackId,
    //                 TRADING_OPTION: 'Comm',
    //                 IS_ACTIVE: true
    //             }

    //             dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    //         // var values = {
    //         //     UPLOAD_PATH: req.body.file,
    //         //     RE_OPEN_ID: req.body.reid,

    //         // };
    //         // var param = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENTNAME: req.body.clientName,
    //         //     DP_BROKER_NAME: req.body.comtrackParticipantName,
    //         //     DP_ACCOUNT_NO: req.body.comtrackId,
    //         //     TRADING_OPTION: 'Comm',
    //         //     IS_ACTIVE: true
    //         // }

    //         // dataaccess.Update(TBL_EAH_REL_DP_OTHERS, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'commrel updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'UpdateCommUploadFileForRel', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    router.route('/SaveCommAuthorizeSelf')
        .post(function (req, res) {
            const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
            // console.log(req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                EMPLOYEE_ID: encryptmodel.eid,
                CLIENTNAME: encryptmodel.clientName,
                DP_BROKER_NAME: encryptmodel.comtrackParticipantName,
                DP_ACCOUNT_NO: encryptmodel.comtrackId,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null,
                IS_UPLOAD: false,
                PROVIDE_DEMAT: true,
                TRADING_OPTION: 'Comm',
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true
            };


            dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                .then(async function (result) {
                    if (result != null) {
                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                            where: {
                                CLIENT_ID: encryptmodel.clientName,
                                EMPLOYEE_ID: encryptmodel.eid
                            }
                        });


                        if (!existingRecord) {
                            // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                            await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: encryptmodel.clientName, EMPLOYEE_ID: encryptmodel.eid });
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveCommAuthorizeSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/SaveCommAuthorizeForRel')
        .post(function (req, res) {
            const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                EMPLOYEE_ID: encryptmodel.eid,
                CLIENTNAME: encryptmodel.clientName,
                DP_BROKER_NAME: encryptmodel.comtrackParticipantName,
                DP_ACCOUNT_NO: encryptmodel.comtrackId,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null,
                IS_UPLOAD: false,
                PROVIDE_DEMAT: true,
                TRADING_OPTION: 'Comm',
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true
            };

            dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
                .then(async function (result) {
                    if (result != null) {
                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                            where: {
                                CLIENT_ID: encryptmodel.clientName,
                                EMPLOYEE_ID: encryptmodel.eid
                            }
                        });


                        if (!existingRecord) {
                            // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                            await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: encryptmodel.clientName, EMPLOYEE_ID: encryptmodel.eid });
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveCommAuthorizeForRel', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/SaveCommProvLaterSelf')
        .post(function (req, res) {
            const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            // console.log(req.body);

            var values = {
                EMPLOYEE_ID: encryptmodel.eid,
                CLIENTNAME: encryptmodel.clientName,
                DP_BROKER_NAME: encryptmodel.comtrackParticipantName,
                DP_ACCOUNT_NO: encryptmodel.comtrackId,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null,
                IS_UPLOAD: false,
                PROVIDE_DEMAT: true,
                TRADING_OPTION: 'Comm',
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true
            };


            dataaccess.Create(TBL_EAH_EMP_DP_OTHERS, values)
                .then(async function (result) {
                    if (result != null) {
                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                            where: {
                                CLIENT_ID: encryptmodel.clientName,
                                EMPLOYEE_ID: encryptmodel.eid
                            }
                        });


                        if (!existingRecord) {
                            // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                            await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: encryptmodel.clientName, EMPLOYEE_ID: encryptmodel.eid });
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'commself saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveCommProvLaterSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/SaveCommProvLaterForRel')
        .post(function (req, res) {
            const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                EMPLOYEE_ID: encryptmodel.eid,
                CLIENTNAME: encryptmodel.clientName,
                DP_BROKER_NAME: encryptmodel.comtrackParticipantName,
                DP_ACCOUNT_NO: encryptmodel.comtrackId,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null,
                IS_UPLOAD: false,
                PROVIDE_DEMAT: true,
                TRADING_OPTION: 'Comm',
                RE_OPEN_ID: encryptmodel.reid,
                IS_ACTIVE: true
            };

            dataaccess.Create(TBL_EAH_REL_DP_OTHERS, values)
                .then(async function (result) {
                    if (result != null) {
                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                            where: {
                                CLIENT_ID: encryptmodel.clientName,
                                EMPLOYEE_ID: encryptmodel.eid
                            }
                        });


                        if (!existingRecord) {
                            // If the client name doesn't exist, insert it into TBL_EAH_COMMODITY_OTHER_EXCHANGE
                            await dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, { CLIENT_ID: encryptmodel.clientName, EMPLOYEE_ID: encryptmodel.eid });
                        }
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'commRel saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveCommProvLaterForRel', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetCommDetails/:EmployeeId')
        .get(function (req, res) {
            const query = `
            SELECT * FROM (
                SELECT
                    'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                    "ID",
                    "CLIENTNAME",
                    "EMPLOYEE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "UPLOAD_PATH",
	                "PROVIDE_DEMAT"                
                FROM "TBL_EAH_EMP_DP_OTHERS"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Comm'
                UNION ALL
                SELECT
                    'TBL_EAH_REL_DP_OTHERS' AS table_name,
                    "ID",
                    "CLIENTNAME",
                    "EMPLOYEE_ID",
                    "DP_ACCOUNT_NO",
                    "DP_BROKER_NAME",
                    "UPLOAD_PATH",
	                "PROVIDE_DEMAT"
                FROM "TBL_EAH_REL_DP_OTHERS"
                WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND "IS_ACTIVE" = true
                    AND "TRADING_OPTION" = 'Comm'
            ) AS combined_tables`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows  
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Commdetails Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Commdetails data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'GetCommDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Commdetails Table', Data: null });
                });
        });

    router.route('/DeleteCommById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const { ID, table_name } = encryptmodel; // Assuming you pass the table name along with ID in the request body

            if (!ID || !table_name) {
                res.status(400).json({ Success: false, Message: 'Invalid request body', Data: null });
                return;
            }

            const isEntityTable = (table_name === 'TBL_EAH_EMP_DP_OTHERS');
            const isOthersTable = (table_name === 'TBL_EAH_REL_DP_OTHERS');

            if (!isEntityTable && !isOthersTable) {
                res.status(400).json({ Success: false, Message: 'Invalid table name', Data: null });
                return;
            }

            const tableName = isEntityTable ? 'TBL_EAH_EMP_DP_OTHERS' : 'TBL_EAH_REL_DP_OTHERS';
            const TBL = datamodel[tableName]();

            var param = {
                ID: ID
            };
            console.log("param", param);

            dataaccess.Update(TBL, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: `${tableName} Has No Access`, Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('EAH', 'DeleteCommById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/handlenext6click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 6
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'concern updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'handlenext6click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //////////////////////// Comodity another grid  //////////////////////////////////////////////////
    router.route('/GetCommAnotherDetails/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
            const employeeId = req.params.EmployeeId;

            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'RE_OPEN_ID', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_COMMODITY_OTHER_EXCHANGE, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_COMMODITY_OTHER_EXCHANGE Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_COMMODITY_OTHER_EXCHANGE Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'GetCommAnotherDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_COMMODITY_OTHER_EXCHANGE Table', Data: null });
                });

        });

    router.route('/SaveCommOtherUploadFile')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                    var values = {
                        EMPLOYEE_ID: requestBody.eid,
                        UPLOAD_PATH: filepath,
                        CLIENT_ID: requestBody.name,
                        IS_ANY_TRADE: requestBody.acc || true,
                        RE_OPEN_ID: requestBody.reid,
                        TRANS_TYPE: 'Comm',
                        IS_ACTIVE: true
                    };

                    var values1 = {
                        UPLOAD_PATH: filepath,
                        IS_ANY_TRADE: requestBody.acc || true,
                        RE_OPEN_ID: requestBody.reid,
                        TRANS_TYPE: 'Comm',
                        IS_ACTIVE: true
                    };

                    var param = {
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENT_ID: requestBody.name,
                    }
                    try {
                        // Check if CLIENT_ID exists in the database
                        const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                            attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                            where: {
                                CLIENT_ID: requestBody.name, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                                EMPLOYEE_ID: requestBody.eid
                            }
                        })

                        if (existingRecord) {
                            // If CLIENT_ID exists, perform an update operation
                            dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values1, param)
                                .then(function (result) {
                                    if (result != null) {
                                        res.status(200).json({ Success: true, Message: 'commanother updated successfully', Data: result });
                                    } else {
                                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                    }
                                })
                                .catch(function (err) {
                                    dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile (Update)', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                });
                        } else {
                            // If CLIENT_ID does not exist, perform an insert operation
                            dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values)
                                .then(function (result) {
                                    if (result != null) {
                                        res.status(200).json({ Success: true, Message: 'commanother saved successfully', Data: result });
                                    }
                                    else {

                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    }
                                }, function (err) {
                                    dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                });
                        }
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
                    }
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        var values = {
                            EMPLOYEE_ID: requestBody.eid,
                            UPLOAD_PATH: filepath,
                            CLIENT_ID: requestBody.name,
                            IS_ANY_TRADE: requestBody.acc || true,
                            RE_OPEN_ID: requestBody.reid,
                            TRANS_TYPE: 'Comm',
                            IS_ACTIVE: true
                        };

                        var values1 = {
                            UPLOAD_PATH: filepath,
                            IS_ANY_TRADE: requestBody.acc || true,
                            RE_OPEN_ID: requestBody.reid,
                            TRANS_TYPE: 'Comm',
                            IS_ACTIVE: true
                        };

                        var param = {
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENT_ID: requestBody.name,
                        }
                        try {
                            // Check if CLIENT_ID exists in the database
                            const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                                attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                                where: {
                                    CLIENT_ID: requestBody.name, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                                    EMPLOYEE_ID: requestBody.eid
                                }
                            })

                            if (existingRecord) {
                                // If CLIENT_ID exists, perform an update operation
                                dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values1, param)
                                    .then(function (result) {
                                        if (result != null) {
                                            res.status(200).json({ Success: true, Message: 'commanother updated successfully', Data: result });
                                        } else {
                                            res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                        }
                                    })
                                    .catch(function (err) {
                                        dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile (Update)', err);
                                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                    });
                            } else {
                                // If CLIENT_ID does not exist, perform an insert operation
                                dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values)
                                    .then(function (result) {
                                        if (result != null) {
                                            res.status(200).json({ Success: true, Message: 'commanother saved successfully', Data: result });
                                        }
                                        else {

                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile', err);
                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    });
                            }
                        } catch (error) {
                            console.error(error);
                            res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
                        }
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });

    // router.route('/SaveCommOtherUploadFile')
    //     .post(upload.any(), async function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //             var values = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 UPLOAD_PATH: filepath,
    //                 CLIENT_ID: requestBody.name,
    //                 IS_ANY_TRADE: requestBody.acc,
    //                 RE_OPEN_ID: requestBody.reid,
    //                 TRANS_TYPE: 'Comm',
    //                 IS_ACTIVE: true
    //             };

    //             var values1 = {
    //                 UPLOAD_PATH: filepath,
    //                 IS_ANY_TRADE: requestBody.acc,
    //                 RE_OPEN_ID: requestBody.reid,
    //                 TRANS_TYPE: 'Comm',
    //                 IS_ACTIVE: true
    //             };

    //             var param = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENT_ID: requestBody.name,
    //             }
    //             try {
    //                 // Check if CLIENT_ID exists in the database
    //                 const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
    //                     attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
    //                     where: {
    //                         CLIENT_ID: requestBody.name, // Assuming ENTITY_NAME matches DP_BROKER_NAME
    //                         EMPLOYEE_ID: requestBody.eid
    //                     }
    //                 })

    //                 if (existingRecord) {
    //                     // If CLIENT_ID exists, perform an update operation
    //                     dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values1, param)
    //                         .then(function (result) {
    //                             if (result != null) {
    //                                 res.status(200).json({ Success: true, Message: 'commanother updated successfully', Data: result });
    //                             } else {
    //                                 res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                             }
    //                         })
    //                         .catch(function (err) {
    //                             dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile (Update)', err);
    //                             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                         });
    //                 } else {
    //                     // If CLIENT_ID does not exist, perform an insert operation
    //                     dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values)
    //                         .then(function (result) {
    //                             if (result != null) {
    //                                 res.status(200).json({ Success: true, Message: 'commanother saved successfully', Data: result });
    //                             }
    //                             else {

    //                                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                             }
    //                         }, function (err) {
    //                             dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile', err);
    //                             res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                         });
    //                 }
    //             } catch (error) {
    //                 console.error(error);
    //                 res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
    //             }
    //             // dataaccess.Create(TBL_JD_EMP_DP, values)
    //             //     .then(function (result) {
    //             //         if (result != null) {
    //             //             res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //             //         }
    //             //         else {
    //             //             res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             //         }
    //             //     });
    //         }


    //         // const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //         // var values = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     CLIENT_ID: req.body.name,
    //         //     IS_ANY_TRADE: req.body.acc,
    //         //     RE_OPEN_ID: req.body.reid,
    //         //     TRANS_TYPE: 'Comm',
    //         //     IS_ACTIVE: true
    //         // };

    //         // var values1 = {
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     IS_ANY_TRADE: req.body.acc,
    //         //     RE_OPEN_ID: req.body.reid,
    //         //     TRANS_TYPE: 'Comm',
    //         //     IS_ACTIVE: true
    //         // };

    //         // var param = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENT_ID: req.body.name,
    //         // }

    //     });


    router.route('/UpdateCommOtherUploadFile')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);

            console.log("Folder_Path", Folder_Path);

            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {
                    console.log("1", fileDetails[i]);
                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)

                    console.log('path..', newFileName);

                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))
                    console.log("123", path.join(Folder_Path + '/' + newFileName))

                    const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                    var values = {
                        // EMPLOYEE_ID: req.body.eid,
                        UPLOAD_PATH: filepath,
                        RE_OPEN_ID: requestBody.reid,

                    };
                    var param = {
                        // ID: req.body.ID,
                        EMPLOYEE_ID: requestBody.eid,
                        CLIENT_ID: requestBody.name,
                        IS_ACTIVE: true
                    }

                    dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files
                console.log('fileDetails', fileDetails.length, fileDetails)
                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {
                        console.log('File exists.', path.join(Folder_Path + '/' + fileDetails[i].originalname));
                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {

                        console.log("1", fileDetails[i]);
                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)

                        console.log('path..', newFileName);

                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))
                        console.log("123", path.join(Folder_Path + '/' + newFileName))

                        const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
                        var values = {
                            // EMPLOYEE_ID: req.body.eid,
                            UPLOAD_PATH: filepath,
                            RE_OPEN_ID: requestBody.reid,

                        };
                        var param = {
                            // ID: req.body.ID,
                            EMPLOYEE_ID: requestBody.eid,
                            CLIENT_ID: requestBody.name,
                            IS_ACTIVE: true
                        }

                        dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'File saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }

            // Use the fs.mkdir method to create a folder+requestBody.EmpId




        });

    // router.route('/UpdateCommOtherUploadFile')
    //     .post(upload.any(), function (req, res) {
    //         for (var key in req.body) {
    //             req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
    //         }
    //         let requestBody = req.body;
    //         let requestFiles = req.files;
    //         console.log("requestBody", requestBody, requestFiles);
    //         const Folder_Path = path.join(__dirname + '/.');

    //         console.log("Folder_Path", Folder_Path);

    //         fileDetails = req.files
    //         console.log('fileDetails', fileDetails.length, fileDetails)
    //         finalData = [];
    //         for (let i = 0; i < fileDetails.length; i++) {
    //             console.log("1", fileDetails[i]);
    //             let newFileName = fileDetails[i].originalname

    //             let writeFile = util.promisify(fs.writeFile)

    //             console.log('path..', newFileName);

    //             writeFile(path.join(Folder_Path + '/' + newFileName),
    //                 fileDetails[i].buffer)
    //             let filepath = (path.join(Folder_Path + '/' + newFileName))
    //             console.log("123", path.join(Folder_Path + '/' + newFileName))

    //             const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //             var values = {
    //                 // EMPLOYEE_ID: req.body.eid,
    //                 UPLOAD_PATH: filepath,
    //                 RE_OPEN_ID: requestBody.reid,

    //             };
    //             var param = {
    //                 // ID: req.body.ID,
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 CLIENT_ID: requestBody.name,
    //                 IS_ACTIVE: true
    //             }

    //             dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    //         // var values = {
    //         //     // EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     RE_OPEN_ID: req.body.reid,

    //         // };
    //         // var param = {
    //         //     // ID: req.body.ID,
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     CLIENT_ID: req.body.name,
    //         //     IS_ACTIVE: true
    //         // }

    //         // dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'commother updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('EAH', 'UpdateCommOtherUploadFile', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });

    router.route('/SaveCommAnotherData')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
            var values = {
                EMPLOYEE_ID: encryptmodel.eid,
                UPLOAD_PATH: null,
                CLIENT_ID: encryptmodel.name,
                IS_ANY_TRADE: encryptmodel.acc,
                RE_OPEN_ID: encryptmodel.reid,
                TRANS_TYPE: 'Comm',
                IS_ACTIVE: true
            };

            var values1 = {
                UPLOAD_PATH: null,
                IS_ANY_TRADE: encryptmodel.acc,
                RE_OPEN_ID: encryptmodel.reid,
                TRANS_TYPE: 'Comm',
                IS_ACTIVE: true
            };

            var param = {
                EMPLOYEE_ID: encryptmodel.eid,
                CLIENT_ID: encryptmodel.name,

            }

            try {
                // Check if CLIENT_ID exists in the database
                const existingRecord = await TBL_EAH_COMMODITY_OTHER_EXCHANGE.findOne({
                    attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'RE_OPEN_ID', 'TRANS_TYPE', 'IS_ACTIVE'],
                    where: {
                        CLIENT_ID: encryptmodel.name, // Assuming ENTITY_NAME matches DP_BROKER_NAME
                        EMPLOYEE_ID: encryptmodel.eid
                    }
                })

                if (existingRecord) {
                    // If CLIENT_ID exists, perform an update operation
                    dataaccess.Update(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values1, param)
                        .then(function (result) {
                            if (result != null) {
                                var EncryptLoginDetails = dataconn.encryptionAES(result);
                                res.status(200).json({ Success: true, Message: 'commanother updated successfully', Data: EncryptLoginDetails });
                            } else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                            }
                        })
                        .catch(function (err) {
                            dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile (Update)', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                        });
                } else {
                    // If CLIENT_ID does not exist, perform an insert operation
                    dataaccess.Create(TBL_EAH_COMMODITY_OTHER_EXCHANGE, values)
                        .then(function (result) {
                            if (result != null) {
                                var EncryptLoginDetails = dataconn.encryptionAES(result);
                                res.status(200).json({ Success: true, Message: 'commanother saved successfully', Data: EncryptLoginDetails });
                            } else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        })
                        .catch(function (err) {
                            dataconn.errorlogger('EAH', 'SaveCommOtherUploadFile (Create)', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ Success: false, Message: 'An error occurred', Data: null });
            }
        });

    router.route('/DocumentsDownloadfileEMP')
        .post(async function (req, res) {
            const fileName = req.body.filename;
            // const foldersBack = '../../Service';
            const filePath = path.join(__dirname, '../../Service', fileName);
            console.log("filePath", filePath);

            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                res.status(404).json({ Success: false, Message: 'File not found', Data: null });
            }
        });



    //////////////////////////////////////////////// Submit  /////////////////////////////////////////////////
    function formatDateWithoutTimezone(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    router.route('/handlefinalclick')
        .post(async function (req, res) {
            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                SUBMITTED: true,
                STEP_ID: 7,
                RE_OPEN_ID: encryptmodel.reid
            };

            var param = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            try {
                // Update TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO
                const result = await dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values, param);

                if (result != null) {
                    const TBL_EAH_REOPEN_LOG = datamodel.TBL_EAH_REOPEN_LOG();
                    const currentDateTime = new Date();
                    const formattedDateTime = formatDateWithoutTimezone(currentDateTime);

                    var values = {
                        IS_SUBMITTED: true,
                        MODIFIED_ON: formattedDateTime
                    };

                    var tradingAccountParam = {
                        EMPLOYEE_ID: encryptmodel.employeeId,
                        RE_OPEN_ID: encryptmodel.reid,
                    };

                    // Update TBL_EAH_REOPEN_LOG
                    const updateResult = await dataaccess.Update(TBL_EAH_REOPEN_LOG, values, tradingAccountParam);

                    // Now, call generateEduPDF function
                    const employeeId = encryptmodel.employeeId;
                    const name = encryptmodel.name;
                    const edupdfResult = await generateEduPDF(employeeId);
                    const selfAccPdfResult = await generateSelfAccPDF(employeeId);
                    const deptAccPdfResult = await generateDeptAccPDF(employeeId);
                    const matFinRelPdfResult = await generateMatFinRelPDF(employeeId);
                    const stackAccPdfResult = await generateStackAccPDF(employeeId);
                    const secHoldingPdfResult = await generateSecHoldingPDF(employeeId, name);
                    const commodityPdfResult = await generateCommodityPDF(employeeId);

                    var EncryptLoginDetails = dataconn.encryptionAES({ edupdfResult, selfAccPdfResult, deptAccPdfResult, matFinRelPdfResult, stackAccPdfResult, secHoldingPdfResult, commodityPdfResult });
                    res.status(200).json({ Success: true, Message: 'Final submit updated successfully,Please check your Email.', Data: EncryptLoginDetails });
                } else {
                    throw new Error('Error occurred while updating record');
                }
            } catch (error) {
                dataconn.errorlogger('EAH', 'handlefinalclick', error);
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/handlefinal1click')
        .post(async function (req, res) {
            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                SUBMITTED: true,
                STEP_ID: 7
            };

            var param = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            try {
                // Update TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO
                const updateResult = await dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values, param);

                // Now, call PDF generation functions
                const employeeId = encryptmodel.employeeId;
                const name = encryptmodel.name;
                const edupdfResult = await generateEduPDF(employeeId);
                const selfAccPdfResult = await generateSelfAccPDF(employeeId);
                const deptAccPdfResult = await generateDeptAccPDF(employeeId);
                const matFinRelPdfResult = await generateMatFinRelPDF(employeeId);
                const stackAccPdfResult = await generateStackAccPDF(employeeId);
                const secHoldingPdfResult = await generateSecHoldingPDF(employeeId, name);
                const commodityPdfResult = await generateCommodityPDF(employeeId);

                var EncryptLoginDetails = dataconn.encryptionAES({
                    edupdfResult,
                    selfAccPdfResult,
                    deptAccPdfResult,
                    matFinRelPdfResult,
                    stackAccPdfResult,
                    secHoldingPdfResult,
                    commodityPdfResult
                });

                res.status(200).json({
                    Success: true,
                    Message: 'Final submit updated successfully,Please check your Email.',
                    Data: EncryptLoginDetails
                });
            } catch (error) {
                dataconn.errorlogger('EAH', 'handlefinal1click', error);
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/getReOpenid/:EmployeeId')
        .get(function (req, res) {

            const TBL_EAH_REOPEN_LOG = datamodel.TBL_EAH_REOPEN_LOG();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['RE_OPEN_ID', 'EMPLOYEE_ID', 'IS_SUBMITTED'],
                where: { EMPLOYEE_ID: employeeId, IS_SUBMITTED: false }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_EAH_REOPEN_LOG, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);

                        res.status(200).json({ Success: true, Message: 'TBL_EAH_REOPEN_LOG Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_REOPEN_LOG Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'getReOpenid', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_REOPEN_LOG Table', Data: null });
                });

        });

    router.route('/SaveReOprnID')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_EAH_REOPEN_LOG = datamodel.TBL_EAH_REOPEN_LOG();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_SUBMITTED: false,
                RSTATUS: 'UPDATE',
                MODIFIED_BY: encryptmodel.employeeId,
            };

            dataaccess.Create(TBL_EAH_REOPEN_LOG, values)
                .then(function (result1) {
                    if (result1 != null) {
                        const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();

                        var values = {
                            SUBMITTED: false,
                            STEP_ID: null
                        };

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.employeeId,
                            IS_ACTIVE: true
                        };

                        return dataaccess.Update(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, values, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while updating record');
                    }
                })
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SaveReOprnID saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EAH', 'SaveReOprnID', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //////////////////////////////////////////// Send PDF in Mail //////////////////////////////////////////////
    const generateEduPDF = async (employeeId) => {
        try {
            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);

            const qualificationData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const workExData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_WORKEX_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'PAST_EMPLOYERS'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const contactData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'AGINGDATE', 'CONTACT_TYPE', 'CONATCT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'ContactType'
                        }
                    }
                ],
            });

            const combinedData = {
                qualification: qualificationData,
                workExperience: workExData,
                contactDetails: contactData
            };

            let Data = JSON.stringify(combinedData);
            let FinalData = JSON.parse(Data);
            let FinishData = FinalData;

            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'edu.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eah.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('details', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('details');
                        }
                    });
                }
            });
        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    };

    async function generateSelfAccPDF(employeeId) {
        try {
            const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);

            const EntityData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    }
                ],
            });

            const OtherData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'TRADING_ACCOUNT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const query = `
                    SELECT * FROM (
                        SELECT
                            'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                            "ID",
                            "EMPLOYEE_ID",
                            "DP_ACCOUNT_NO",
                            "DP_BROKER_NAME",
                            "IS_ACTIVE"
                        FROM "TBL_EAH_EMP_DP_OTHERS"
                        WHERE "EMPLOYEE_ID" = '${employeeId}'
                            AND "IS_ACTIVE" = true
                            AND "TRADING_OPTION" = 'Eq'
                        UNION ALL
                        SELECT
                            'TBL_EAH_EMP_DP_ENTITY' AS table_name,
                            "ID",
                            "EMPLOYEE_ID",
                            "DP_ACCOUNT_NO",
                            "DP_BROKER_NAME",
                            "IS_ACTIVE"
                        FROM "TBL_EAH_EMP_DP_ENTITY"
                        WHERE "EMPLOYEE_ID" = '${employeeId}'
                            AND "IS_ACTIVE" = true
                            AND "TRADING_OPTION" = 'Eq'
                    ) AS combined_tables`;

            const dataRows = await connect.sequelize.query(query);
            const DematData = dataRows[0];

            const combinedData = {
                Entity: EntityData,
                Other: OtherData,
                Demat: DematData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData);
            let FinalData = JSON.parse(Data);
            let FinishData = FinalData;
            console.log("FinishData", FinishData);

            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'selfAcc.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahSelfAcc.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('self', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('self');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });
        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    async function generateDeptAccPDF(employeeId) {
        try {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."RELATIONSHIP",
            CASE WHEN (
                COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
                COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
                SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
                FROM (
                    SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_OTHERS" AS "dp"
                    WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
                        AND "dp"."IS_ACTIVE" = true
                    
                    UNION
                    
                    SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
                    WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
                        AND "dp_entity"."IS_ACTIVE" = true
                ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT_NUMBERS",
            -- The rest of your query remains the same
            CASE WHEN COUNT("emp"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME", '-', "emp"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "TRADING_ACCOUNT_NUMBERS",
            CASE WHEN COUNT("ent"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME", '-', "ent"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "ENTITY_ACCOUNT_NUMBERS",
            MAX("rel"."RELATIVE_NAME") AS "RELATIVE_NAME",
            MAX("rel"."REL_OTHER_NAME") AS "REL_OTHER_NAME",
            "rel"."IS_MINOR" AS "IS_MINOR",
            MAX("rel"."PHONE") AS "PHONE",
            MAX("rel"."MOBILE") AS "MOBILE",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "RELATIONSHIP_NAME"
        FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" AS "emp"
            ON "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
            ON "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
            AND "dp_entity"."IS_ACTIVE" = true
        LEFT JOIN "TBL_GENERIC_MST" AS "gen"
            ON "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID", "rel"."RELATIONSHIP", "rel"."IS_MINOR"`;

            const dataRows = await connect.sequelize.query(query);
            const DeptData = dataRows[0];

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);


            const combinedData = {
                Dept: DeptData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'deptAcc.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahDependentAcc.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('dependent', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('dependent');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    async function generateMatFinRelPDF(employeeId) {
        try {
            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);

            const matfinData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, {
                attributes: ['ID', 'EMPLOYEE_ID', 'COMPANY_NAME', 'MATERIAL_FIN_REL_NAME', 'MATERIAL_FIN_REL_MOBILE',
                    'MATERIAL_FIN_REL_PAN', 'MATERIAL_FIN_REL_PHONE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const combinedData = {
                matfinRel: matfinData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'matFinRel.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahMatFin.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('matfinRel', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('matfinRel');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    async function generateStackAccPDF(employeeId) {
        try {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."EMPLOYEE_CONCERN_ID",
            CASE WHEN (
            COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
            COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
            SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
            FROM (
            SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_OTHERS" AS "dp"
            WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "dp"."IS_ACTIVE" = true                    
            UNION                    
            SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
            AND "dp_entity"."IS_ACTIVE" = true
            ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",
            MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
            FROM
            "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_OTHERS" AS "emp"
            ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "emp"."EMPLOYEE_CONCERN_ID"
                AND "emp"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_ENTITY" AS "ent"
            ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "ent"."EMPLOYEE_CONCERN_ID"
                AND "ent"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
                AND "dp"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
               AND "dp_entity"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
            ON
            "rel"."EMPLOYEE_CONCERN_ID" = "gen"."ID"
            WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
                AND "rel"."IS_ACTIVE" = true
            GROUP BY
            "rel"."ID", "rel"."EMPLOYEE_CONCERN_ID"`;

            const dataRows = await connect.sequelize.query(query);
            const StackData = dataRows[0];

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);


            const combinedData = {
                Stack: StackData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'stackAcc.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahStackAcc.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('stack', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('stack');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    async function generateSecHoldingPDF(employeeId, name) {
        try {
            const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);

            const query = `
                WITH EmpDp AS (	
                    SELECT
                        'Self' AS Relation,
                        '${name}' AS Name,
                        emp_entity."DP_BROKER_NAME" AS BrokerName,
                        emp_entity."DP_ACCOUNT_NO" AS DPAccount,
                        emp_entity."UPLOAD_PATH" AS uploadedFile,
                        emp_entity."AUTHORIZE_EW" AS authorize,
                        null AS isprovide,
                        null AS otherName
                    FROM
                        "TBL_EAH_EMP_DP_ENTITY" emp_entity
                    WHERE
                        emp_entity."EMPLOYEE_ID" = '${employeeId}'
                        AND emp_entity."TRADING_OPTION" = 'Eq'
                        AND emp_entity."IS_ACTIVE" = true
                
                    UNION ALL
                
                    SELECT
                        'Self' AS Relation,
                        '${name}' AS Name,
                        emp_others."DP_BROKER_NAME" AS BrokerName,
                        emp_others."DP_ACCOUNT_NO" AS DPAccount,
                        emp_others."UPLOAD_PATH" AS uploadedFile,
                        null AS authorize,
                         emp_others."PROVIDE_DEMAT" AS isprovide,
                        null AS otherName
                    FROM
                        "TBL_EAH_EMP_DP_OTHERS" emp_others
                    WHERE
                        emp_others."EMPLOYEE_ID" = '${employeeId}'
                        AND emp_others."TRADING_OPTION" = 'Eq'
                        AND emp_others."IS_ACTIVE" = true
                      ),
                     Relatives AS (
                            SELECT 
                            eri."RELATIVE_NAME" AS Name, gm."NAME" AS Relation, eri."RELATIONSHIP",eri."REL_OTHER_NAME" AS otherName
                            FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" eri
                            JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                            WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                      ),
                      Concern AS (
                             SELECT 
                             eri."NAME_OF_CONCERN" AS Name, gm."NAME" AS Relation, eri."EMPLOYEE_CONCERN_ID",eri."CONCERN_OTHER_NAME" AS otherName
                             FROM "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" eri
                             JOIN "TBL_GENERIC_MST" gm ON eri."EMPLOYEE_CONCERN_ID" = gm."ID"
                             WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                       )
                       SELECT
                           EmpDp.Relation,
                           EmpDp.Name,
                           EmpDp.BrokerName,
                           EmpDp.DPAccount,
                           EmpDp.uploadedFile,
                           EmpDp.authorize,
                           EmpDp.isprovide,
                           EmpDp.otherName
                           FROM EmpDp
                        UNION ALL
                            SELECT
                            Relatives.Relation,
                            Relatives.Name,
                            dp."DP_BROKER_NAME" AS BrokerName,
                            dp."DP_ACCOUNT_NO" AS DPAccount,
                            dp."UPLOAD_PATH" AS uploadedFile,
                            dp."AUTHORIZE_EW" AS authorize,
                            null AS isprovide,
                            Relatives.otherName
                            FROM Relatives
                            JOIN "TBL_EAH_REL_DP_ENTITY" dp ON Relatives."RELATIONSHIP" = dp."RELATIVE_ID"
                            WHERE dp."EMPLOYEE_ID" = '${employeeId}' AND dp."TRADING_OPTION" = 'Eq' AND dp."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Relatives.Relation,
                            Relatives.Name,
                            dp1."DP_BROKER_NAME" AS BrokerName,
                            dp1."DP_ACCOUNT_NO" AS DPAccount,
                            dp1."UPLOAD_PATH" AS uploadedFile,
                            null AS authorize,
                            dp1."PROVIDE_DEMAT" AS isprovide,
                            Relatives.otherName
                            FROM Relatives
                            JOIN "TBL_EAH_REL_DP_OTHERS" dp1 ON Relatives."RELATIONSHIP" = dp1."RELATIVE_ID"
                            WHERE dp1."EMPLOYEE_ID" = '${employeeId}' AND dp1."TRADING_OPTION" = 'Eq' AND dp1."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Concern.Relation,
                            Concern.Name,
                            stk_dp."DP_BROKER_NAME" AS BrokerName,
                            stk_dp."DP_ACCOUNT_NO" AS DPAccount,
                            stk_dp."UPLOAD_PATH" AS uploadedFile,
                            stk_dp."AUTHORIZE_EW" AS authorize,
                            null AS isprovide,
                            Concern.otherName
                            FROM Concern
                            JOIN "TBL_EAH_STK_DP_ENTITY" stk_dp ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp."EMPLOYEE_CONCERN_ID"
                            WHERE stk_dp."EMPLOYEE_ID" = '${employeeId}' AND stk_dp."TRADING_OPTION" = 'Eq' AND stk_dp."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Concern.Relation,
                            Concern.Name,
                            stk_dp1."DP_BROKER_NAME" AS BrokerName,
                            stk_dp1."DP_ACCOUNT_NO" AS DPAccount,
                            stk_dp1."UPLOAD_PATH" AS uploadedFile,
                            null AS authorize,
                            stk_dp1."PROVIDE_DEMAT" AS isprovide,
                            Concern.otherName
                            FROM Concern
                            JOIN "TBL_EAH_STK_DP_OTHERS" stk_dp1 ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp1."EMPLOYEE_CONCERN_ID"
                            WHERE stk_dp1."EMPLOYEE_ID" = '${employeeId}' AND stk_dp1."TRADING_OPTION" = 'Eq' AND stk_dp1."IS_ACTIVE" = true`;

            const dataRows = await connect.sequelize.query(query);
            const SecHoldData = dataRows[0];

            const phsicalData = await dataaccess.FindAll(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, {
                attributes: ['ID', 'EMPLOYEE_ID', 'UPLOAD_PATH',],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });



            const combinedData = {
                SecHold: SecHoldData,
                phsical: phsicalData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'holding.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahSecHolding.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('holding', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('holding');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    async function generateCommodityPDF(employeeId) {
        try {
            const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            const emailData = await dataaccess.FindOne(TBL_USER_MST, {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
                where: { EMPNO: employeeId, ISACTIVE: true }
            });

            console.log("emaildata", emailData);
            const UserEmailId = emailData.EMAILID;
            console.log("UserEmailId", UserEmailId);

            const entityData1 = await TBL_ENTITY_MST.findAll({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    // IS_BASE_ENTITY: true,
                    IS_ACTIVE: true
                }
            })

            const entityData = entityData1.map(entity => entity.ENTITY_NAME);;

            const query = `
        SELECT * FROM (
            SELECT
                'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                "ID",
                "CLIENTNAME",
                "EMPLOYEE_ID",
                "DP_ACCOUNT_NO",
                "DP_BROKER_NAME",
                "UPLOAD_PATH",
                "PROVIDE_DEMAT"                
            FROM "TBL_EAH_EMP_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${employeeId}'
                AND "IS_ACTIVE" = true
                AND "TRADING_OPTION" = 'Comm'
            UNION ALL
            SELECT
                'TBL_EAH_REL_DP_OTHERS' AS table_name,
                "ID",
                "CLIENTNAME",
                "EMPLOYEE_ID",
                "DP_ACCOUNT_NO",
                "DP_BROKER_NAME",
                "UPLOAD_PATH",
                "PROVIDE_DEMAT"
            FROM "TBL_EAH_REL_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${employeeId}'
                AND "IS_ACTIVE" = true
                AND "TRADING_OPTION" = 'Comm'
        ) AS combined_tables`;



            const dataRows = await connect.sequelize.query(query);
            const CommodityData = dataRows[0];

            const phsicalData = await dataaccess.FindAll(TBL_EAH_COMMODITY_OTHER_EXCHANGE, {
                attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });



            const combinedData = {
                Commodity: CommodityData,
                entity: entityData,
                phsical: phsicalData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            fs.readFile(path.join(__dirname, '..', '..', 'Template', 'commodity.ejs'), 'utf8', function (err, templateContent) {
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
                            stream.pipe(fs.createWriteStream('eahCommodity.pdf'));
                            console.log("PDF created successfully.");
                            SendEAHEmail.SendEAHEmail('commodity', UserEmailId);
                            // SendEAHEmail.SendEAHEmail('commodity');
                            // res.status(200).json({ Success: true, Message: 'Createeah saved successfully', Data: FinishData });
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Error:", err);
            // res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
        }
    }

    ////////////////////////////////// Download PDF ///////////////////////////////////
    router.route('/generate-pdf')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateEduPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="employee_details.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eah.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateEduPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="employee_details.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf1')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateSelfAccPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="selfaccount_details.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahSelfAcc.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateSelfAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="selfaccount_details.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf2')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateDeptAccPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="dependentaccount_details.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahDependentAcc.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateDeptAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="dependentaccount_details.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf3')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateMatFinRelPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="materialfinancial_details.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahMatFin.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateMatFinRelPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="materialfinancial_details.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf4')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateStackAccPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="10%stack_details.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahStackAcc.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateStackAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="10%stack_details.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf5')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;
            const name = req.body.name;

            try {
                // await generateSecHoldingPDF1(employeeId, name);
                // res.setHeader('Content-Disposition', 'attachment; filename="security_holding.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahSecHolding.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateSecHoldingPDF1(employeeId, name);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="security_holding.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    router.route('/generate-pdf6')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // await generateCommodityPDF1(employeeId);
                // res.setHeader('Content-Disposition', 'attachment; filename="commodity.pdf"');
                // res.setHeader('Content-Type', 'application/pdf');
                // const pdfStream = fs.createReadStream('eahCommodity.pdf');
                // pdfStream.pipe(res);

                // Call your PDF generation function
                const pdfStream = await generateCommodityPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="commodity.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    async function generateEduPDF1(employeeId) {
        try {
            const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
            const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
            const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            const qualificationData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const workExData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_WORKEX_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'PAST_EMPLOYERS'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const contactData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'AGINGDATE', 'CONTACT_TYPE', 'CONATCT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'ContactType'
                        }
                    }
                ],
            });

            const combinedData = {
                qualification: qualificationData,
                workExperience: workExData,
                contactDetails: contactData
            };

            let Data = JSON.stringify(combinedData);
            let FinalData = JSON.parse(Data);
            let FinishData = FinalData;

            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'edu.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateSelfAccPDF1(employeeId) {
        try {
            const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            const EntityData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    }
                ],
            });

            const OtherData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'TRADING_ACCOUNT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const query = `
                    SELECT * FROM (
                        SELECT
                            'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                            "ID",
                            "EMPLOYEE_ID",
                            "DP_ACCOUNT_NO",
                            "DP_BROKER_NAME",
                            "IS_ACTIVE"
                        FROM "TBL_EAH_EMP_DP_OTHERS"
                        WHERE "EMPLOYEE_ID" = '${employeeId}'
                            AND "IS_ACTIVE" = true
                            AND "TRADING_OPTION" = 'Eq'
                        UNION ALL
                        SELECT
                            'TBL_EAH_EMP_DP_ENTITY' AS table_name,
                            "ID",
                            "EMPLOYEE_ID",
                            "DP_ACCOUNT_NO",
                            "DP_BROKER_NAME",
                            "IS_ACTIVE"
                        FROM "TBL_EAH_EMP_DP_ENTITY"
                        WHERE "EMPLOYEE_ID" = '${employeeId}'
                            AND "IS_ACTIVE" = true
                            AND "TRADING_OPTION" = 'Eq'
                    ) AS combined_tables`;

            const dataRows = await connect.sequelize.query(query);
            const DematData = dataRows[0];

            const combinedData = {
                Entity: EntityData,
                Other: OtherData,
                Demat: DematData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData);
            let FinalData = JSON.parse(Data);
            let FinishData = FinalData;
            console.log("FinishData", FinishData);

            console.log("FinishData", FinishData);

            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'selfAcc.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateDeptAccPDF1(employeeId) {
        try {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."RELATIONSHIP",
            CASE WHEN (
                COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
                COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
                SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
                FROM (
                    SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_OTHERS" AS "dp"
                    WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
                        AND "dp"."IS_ACTIVE" = true
                    
                    UNION
                    
                    SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
                    FROM "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
                    WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
                        AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
                        AND "dp_entity"."IS_ACTIVE" = true
                ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT_NUMBERS",
            -- The rest of your query remains the same
            CASE WHEN COUNT("emp"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME", '-', "emp"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "TRADING_ACCOUNT_NUMBERS",
            CASE WHEN COUNT("ent"."TRADING_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME", '-', "ent"."TRADING_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "ENTITY_ACCOUNT_NUMBERS",
            MAX("rel"."RELATIVE_NAME") AS "RELATIVE_NAME",
            MAX("rel"."REL_OTHER_NAME") AS "REL_OTHER_NAME",
            "rel"."IS_MINOR" AS "IS_MINOR",
            MAX("rel"."PHONE") AS "PHONE",
            MAX("rel"."MOBILE") AS "MOBILE",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "RELATIONSHIP_NAME"
        FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO" AS "emp"
            ON "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
            ON "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN "TBL_EAH_REL_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."RELATIONSHIP" = "dp_entity"."RELATIVE_ID"
            AND "dp_entity"."IS_ACTIVE" = true
        LEFT JOIN "TBL_GENERIC_MST" AS "gen"
            ON "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID", "rel"."RELATIONSHIP", "rel"."IS_MINOR"`;

            const dataRows = await connect.sequelize.query(query);
            const DeptData = dataRows[0];


            const combinedData = {
                Dept: DeptData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);

            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'deptAcc.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateMatFinRelPDF1(employeeId) {
        try {
            const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();

            const matfinData = await dataaccess.FindAll(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, {
                attributes: ['ID', 'EMPLOYEE_ID', 'COMPANY_NAME', 'MATERIAL_FIN_REL_NAME', 'MATERIAL_FIN_REL_MOBILE',
                    'MATERIAL_FIN_REL_PAN', 'MATERIAL_FIN_REL_PHONE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const combinedData = {
                matfinRel: matfinData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);

            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'matFinRel.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateStackAccPDF1(employeeId) {
        try {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."EMPLOYEE_CONCERN_ID",
            CASE WHEN (
            COUNT(DISTINCT "dp"."DP_ACCOUNT_NO") > 0 OR
            COUNT(DISTINCT "dp_entity"."DP_ACCOUNT_NO") > 0
            ) THEN (
            SELECT ARRAY_TO_STRING(ARRAY_AGG(DISTINCT "dp_concat"), ', ')
            FROM (
            SELECT DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_OTHERS" AS "dp"
            WHERE "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "dp"."IS_ACTIVE" = true                    
            UNION                    
            SELECT DISTINCT CONCAT("dp_entity"."DP_BROKER_NAME", '-', "dp_entity"."DP_ACCOUNT_NO") AS "dp_concat"
            FROM "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            WHERE "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
            AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
            AND "dp_entity"."IS_ACTIVE" = true
            ) AS "distinct_dp"
            ) ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",
            MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
            FROM
            "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_OTHERS" AS "emp"
            ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "emp"."EMPLOYEE_CONCERN_ID"
                AND "emp"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_EAH_10PERCENT_STAKE_ENTITY" AS "ent"
            ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
                AND "rel"."EMPLOYEE_CONCERN_ID" = "ent"."EMPLOYEE_CONCERN_ID"
                AND "ent"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_OTHERS" AS "dp"
            ON "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp"."EMPLOYEE_CONCERN_ID"
                AND "dp"."IS_ACTIVE" = true
            LEFT JOIN 
            "TBL_EAH_STK_DP_ENTITY" AS "dp_entity"
            ON "rel"."EMPLOYEE_ID" = "dp_entity"."EMPLOYEE_ID"
               AND "rel"."EMPLOYEE_CONCERN_ID" = "dp_entity"."EMPLOYEE_CONCERN_ID"
               AND "dp_entity"."IS_ACTIVE" = true
            LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
            ON
            "rel"."EMPLOYEE_CONCERN_ID" = "gen"."ID"
            WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
                AND "rel"."IS_ACTIVE" = true
            GROUP BY
            "rel"."ID", "rel"."EMPLOYEE_CONCERN_ID"`;

            const dataRows = await connect.sequelize.query(query);
            const StackData = dataRows[0];


            const combinedData = {
                Stack: StackData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'stackAcc.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateSecHoldingPDF1(employeeId, name) {
        try {
            const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();

            const query = `
                WITH EmpDp AS (	
                    SELECT
                        'Self' AS Relation,
                        '${name}' AS Name,
                        emp_entity."DP_BROKER_NAME" AS BrokerName,
                        emp_entity."DP_ACCOUNT_NO" AS DPAccount,
                        emp_entity."UPLOAD_PATH" AS uploadedFile,
                        emp_entity."AUTHORIZE_EW" AS authorize,
                        null AS isprovide,
                        null AS otherName
                    FROM
                        "TBL_EAH_EMP_DP_ENTITY" emp_entity
                    WHERE
                        emp_entity."EMPLOYEE_ID" = '${employeeId}'
                        AND emp_entity."TRADING_OPTION" = 'Eq'
                        AND emp_entity."IS_ACTIVE" = true
                
                    UNION ALL
                
                    SELECT
                        'Self' AS Relation,
                        '${name}' AS Name,
                        emp_others."DP_BROKER_NAME" AS BrokerName,
                        emp_others."DP_ACCOUNT_NO" AS DPAccount,
                        emp_others."UPLOAD_PATH" AS uploadedFile,
                        null AS authorize,
                         emp_others."PROVIDE_DEMAT" AS isprovide,
                        null AS otherName
                    FROM
                        "TBL_EAH_EMP_DP_OTHERS" emp_others
                    WHERE
                        emp_others."EMPLOYEE_ID" = '${employeeId}'
                        AND emp_others."TRADING_OPTION" = 'Eq'
                        AND emp_others."IS_ACTIVE" = true
                      ),
                     Relatives AS (
                            SELECT 
                            eri."RELATIVE_NAME" AS Name, gm."NAME" AS Relation, eri."RELATIONSHIP",eri."REL_OTHER_NAME" AS otherName
                            FROM "TBL_EAH_EMPLOYEE_RELATIVE_INFO" eri
                            JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                            WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                      ),
                      Concern AS (
                             SELECT 
                             eri."NAME_OF_CONCERN" AS Name, gm."NAME" AS Relation, eri."EMPLOYEE_CONCERN_ID",eri."CONCERN_OTHER_NAME" AS otherName
                             FROM "TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" eri
                             JOIN "TBL_GENERIC_MST" gm ON eri."EMPLOYEE_CONCERN_ID" = gm."ID"
                             WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                       )
                       SELECT
                           EmpDp.Relation,
                           EmpDp.Name,
                           EmpDp.BrokerName,
                           EmpDp.DPAccount,
                           EmpDp.uploadedFile,
                           EmpDp.authorize,
                           EmpDp.isprovide,
                           EmpDp.otherName
                           FROM EmpDp
                        UNION ALL
                            SELECT
                            Relatives.Relation,
                            Relatives.Name,
                            dp."DP_BROKER_NAME" AS BrokerName,
                            dp."DP_ACCOUNT_NO" AS DPAccount,
                            dp."UPLOAD_PATH" AS uploadedFile,
                            dp."AUTHORIZE_EW" AS authorize,
                            null AS isprovide,
                            Relatives.otherName
                            FROM Relatives
                            JOIN "TBL_EAH_REL_DP_ENTITY" dp ON Relatives."RELATIONSHIP" = dp."RELATIVE_ID"
                            WHERE dp."EMPLOYEE_ID" = '${employeeId}' AND dp."TRADING_OPTION" = 'Eq' AND dp."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Relatives.Relation,
                            Relatives.Name,
                            dp1."DP_BROKER_NAME" AS BrokerName,
                            dp1."DP_ACCOUNT_NO" AS DPAccount,
                            dp1."UPLOAD_PATH" AS uploadedFile,
                            null AS authorize,
                            dp1."PROVIDE_DEMAT" AS isprovide,
                            Relatives.otherName
                            FROM Relatives
                            JOIN "TBL_EAH_REL_DP_OTHERS" dp1 ON Relatives."RELATIONSHIP" = dp1."RELATIVE_ID"
                            WHERE dp1."EMPLOYEE_ID" = '${employeeId}' AND dp1."TRADING_OPTION" = 'Eq' AND dp1."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Concern.Relation,
                            Concern.Name,
                            stk_dp."DP_BROKER_NAME" AS BrokerName,
                            stk_dp."DP_ACCOUNT_NO" AS DPAccount,
                            stk_dp."UPLOAD_PATH" AS uploadedFile,
                            stk_dp."AUTHORIZE_EW" AS authorize,
                            null AS isprovide,
                            Concern.otherName
                            FROM Concern
                            JOIN "TBL_EAH_STK_DP_ENTITY" stk_dp ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp."EMPLOYEE_CONCERN_ID"
                            WHERE stk_dp."EMPLOYEE_ID" = '${employeeId}' AND stk_dp."TRADING_OPTION" = 'Eq' AND stk_dp."IS_ACTIVE" = true
                        UNION ALL
                            SELECT
                            Concern.Relation,
                            Concern.Name,
                            stk_dp1."DP_BROKER_NAME" AS BrokerName,
                            stk_dp1."DP_ACCOUNT_NO" AS DPAccount,
                            stk_dp1."UPLOAD_PATH" AS uploadedFile,
                            null AS authorize,
                            stk_dp1."PROVIDE_DEMAT" AS isprovide,
                            Concern.otherName
                            FROM Concern
                            JOIN "TBL_EAH_STK_DP_OTHERS" stk_dp1 ON Concern."EMPLOYEE_CONCERN_ID" = stk_dp1."EMPLOYEE_CONCERN_ID"
                            WHERE stk_dp1."EMPLOYEE_ID" = '${employeeId}' AND stk_dp1."TRADING_OPTION" = 'Eq' AND stk_dp1."IS_ACTIVE" = true`;

            const dataRows = await connect.sequelize.query(query);
            const SecHoldData = dataRows[0];

            const phsicalData = await dataaccess.FindAll(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, {
                attributes: ['ID', 'EMPLOYEE_ID', 'UPLOAD_PATH',],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });



            const combinedData = {
                SecHold: SecHoldData,
                phsical: phsicalData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'holding.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }

    async function generateCommodityPDF1(employeeId) {
        try {
            const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST(); // Assuming you have a model for TBL_ENTITY_MST

            const entityData1 = await TBL_ENTITY_MST.findAll({
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    // IS_BASE_ENTITY: true,
                    IS_ACTIVE: true
                }
            })

            const entityData = entityData1.map(entity => entity.ENTITY_NAME);;

            const query = `
        SELECT * FROM (
            SELECT
                'TBL_EAH_EMP_DP_OTHERS' AS table_name,
                "ID",
                "CLIENTNAME",
                "EMPLOYEE_ID",
                "DP_ACCOUNT_NO",
                "DP_BROKER_NAME",
                "UPLOAD_PATH",
                "PROVIDE_DEMAT"                
            FROM "TBL_EAH_EMP_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${employeeId}'
                AND "IS_ACTIVE" = true
                AND "TRADING_OPTION" = 'Comm'
            UNION ALL
            SELECT
                'TBL_EAH_REL_DP_OTHERS' AS table_name,
                "ID",
                "CLIENTNAME",
                "EMPLOYEE_ID",
                "DP_ACCOUNT_NO",
                "DP_BROKER_NAME",
                "UPLOAD_PATH",
                "PROVIDE_DEMAT"
            FROM "TBL_EAH_REL_DP_OTHERS"
            WHERE "EMPLOYEE_ID" = '${employeeId}'
                AND "IS_ACTIVE" = true
                AND "TRADING_OPTION" = 'Comm'
        ) AS combined_tables`;



            const dataRows = await connect.sequelize.query(query);
            const CommodityData = dataRows[0];

            const phsicalData = await dataaccess.FindAll(TBL_EAH_COMMODITY_OTHER_EXCHANGE, {
                attributes: ['ID', 'EMPLOYEE_ID', 'CLIENT_ID', 'IS_ANY_TRADE', 'UPLOAD_PATH', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId }
            });





            const combinedData = {
                Commodity: CommodityData,
                entity: entityData,
                phsical: phsicalData
            };

            console.log("combinedData", combinedData);

            let Data = JSON.stringify(combinedData)
            let FinalData = JSON.parse(Data)
            let FinishData = FinalData
            console.log("FinishData", FinishData);
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'commodity.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        console.log("PDF created successfully.");
                        console.log(`Generating education PDF for employeeId ${employeeId}`);
                        resolve(stream);
                    }
                });
            });
        } catch (err) {
            console.error("Error:", err);
            throw err; // You can handle errors at the calling function level
        }
    }






    return router;
}

module.exports = routes;