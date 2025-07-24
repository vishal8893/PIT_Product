var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
var sequelize = connect.Sequelize;
var multer = require("multer");
var upload = multer();
const path = require('path');
let util = require('util')
let fs = require('fs')
var moment = require('moment');
const ejs = require('ejs');
const pdf = require('html-pdf');
// const SendEAHEmail = require('../../Common/Mailer')
const { PassThrough } = require('stream');
let responseSent = false;


var routes = function () {

    router.route('/GetUser/:EmployeeId')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'DEPARTMENT', 'PANCARDNO', 'ISACTIVE'],
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
                    dataconn.errorlogger('joiningdeclaration', 'GetUser', err);
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



    /////////////////////////////////// self details  ///////////////////////////////////////////////////////////////////
    router.route('/SaveSpouseDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                SPOUSENAME: encryptmodel.spouseName,
                SINGLE_STATUS: encryptmodel.Single_status,
                STEP_ID: 0,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'spousedata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSpouseDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //education
    router.route('/SaveEduDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                INSTITUTION: encryptmodel.institution,
                QUALIFICATION: encryptmodel.qualification,
                SUB_QUALIFICATION: encryptmodel.subQualification,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EDU_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Edudata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveEduDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateEduDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                INSTITUTION: encryptmodel.institution,
                QUALIFICATION: encryptmodel.qualification,
                SUB_QUALIFICATION: encryptmodel.subQualification,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_JD_EDU_DETAILS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Edudata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'UpdateEduDetails', err);
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
            const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();

            dataaccess.Update(TBL_JD_EDU_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EDU_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteEduById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetAllEdu/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();
            const employeeId = req.params.EmployeeId;

            var param = {
                // where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_JD_EDU_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EDU_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EDU_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetAllEdu', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EDU_DETAILS Table', Data: null });
                });

        });

    router.route('/checkduplicate')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, qualification } = encryptmodel;
                const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();

                if (!employeeId || !qualification) {
                    return res.status(400).json({ error: 'Employee ID and qualification are required.' });
                }

                const existingQualification = await TBL_JD_EDU_DETAILS.findOne({
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
            const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                PAST_EMPLOYERS: encryptmodel.pastEmp,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_PAST_EMP_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'PastEmpdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SavePastEmp', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdatePastEmpDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                PAST_EMPLOYERS: encryptmodel.pastEmp,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_JD_PAST_EMP_DETAILS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'PastEmpdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'UpdatePastEmpDetails', err);
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
            const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();

            dataaccess.Update(TBL_JD_PAST_EMP_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_PAST_EMP_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeletePastEmpById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetPastEmp/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();
            const employeeId = req.params.EmployeeId;

            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'PAST_EMPLOYERS', 'IS_ACTIVE'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_JD_PAST_EMP_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_PAST_EMP_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_PAST_EMP_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetPastEmp', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_PAST_EMP_DETAILS Table', Data: null });
                });

        });

    router.route('/checkduplicatepastemployee')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, pastEmployer } = encryptmodel;
                const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();

                if (!employeeId || !pastEmployer) {
                    return res.status(400).json({ error: 'Employee ID and past employer are required.' });
                }

                const existingPastEmployee = await TBL_JD_PAST_EMP_DETAILS.findOne({
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
    router.route('/GetAllTypeCont')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'ContactType'
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
                    dataconn.errorlogger('joiningdeclaration', 'GetAllTypeCont', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/SaveContact')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                CONTACT_TYPE: encryptmodel.contact_type,
                CONATCT_NUMBER: encryptmodel.conatct_number,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_CONTACT_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveContact', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateContDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                CONTACT_TYPE: encryptmodel.contact_type,
                CONATCT_NUMBER: encryptmodel.conatct_number,
                IS_ACTIVE: true

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_JD_CONTACT_DETAILS, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'UpdateContDetails', err);
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
            const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();

            dataaccess.Update(TBL_JD_CONTACT_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_CONTACT_DETAILS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteContById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/GetContact/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'CONTACT_TYPE', 'CONATCT_NUMBER', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_CONTACT_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_CONTACT_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_CONTACT_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetContact', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_CONTACT_DETAILS Table', Data: null });
                });

        });

    router.route('/checkduplicatecontact')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, contactNumber } = encryptmodel;
                const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();

                if (!employeeId || !contactNumber) {
                    return res.status(400).json({ error: 'Employee ID and contact number are required.' });
                }

                const existingContact = await TBL_JD_CONTACT_DETAILS.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // CONATCT_NUMBER: contactNumber,
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
            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var condition = {
                EMPLOYEE_ID: employeeId,
                IS_ACTIVE: true,
            };

            var values = {
                // ENTITY1_TRADE_CODE: req.body.EBL,
                // ENTITY2_TRADE_CODE: req.body.ESL,
                STEP_ID: 1
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, values, condition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Trading account details saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSelfAccontDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetAllBaseEntity')
        .get(function (req, res) {

            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            var param = {
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    // IS_BASE_ENTITY: true,
                    IS_ACTIVE: true
                }
            };
            dataaccess.FindAll(TBL_ENTITY_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetAllBaseEntity', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                });
        });

    router.route('/GetBEntityDetails/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/SaveBaseEntity')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_ACCOUNT_NUMBER: encryptmodel.EBL,
                ENTITY_NAME: encryptmodel.entname,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveBaseEntity', err);
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
            const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateentitytradeaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber } = encryptmodel;
                const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber) {
                    return res.status(400).json({ error: 'Employee ID and trading account number are required.' });
                }

                const existingTradingAccount = await TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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

    //Self Other Account
    router.route('/SaveSelfOther')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                BROKER_NAME: encryptmodel.brokerName,
                TRADING_ACCOUNT_NUMBER: encryptmodel.tradecode,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetSelfOther/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'TRADING_ACCOUNT_NUMBER', 'TRADING_OPTION', 'IS_ACTIVE'],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, param)
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
                    dataconn.errorlogger('joiningdeclaration', 'GetSelfOther', err);
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
            const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteSelfOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicatetradingaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber } = encryptmodel;
                const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber) {
                    return res.status(400).json({ error: 'Employee ID and trading account number are required.' });
                }

                const existingTradingAccount = await TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO.findOne({
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
    router.route('/GetAllEntity')
        .get(function (req, res) {

            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            var param = {
                attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                where: {
                    // IS_BASE_ENTITY: true,
                    IS_ACTIVE: true
                }
            };
            dataaccess.FindAll(TBL_ENTITY_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetAllEntity', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                });
        });

    router.route('/SaveSelfDemat')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                DP_BROKER_NAME: encryptmodel.brokerName,
                DP_ACCOUNT: encryptmodel.tradecode,
                TYPE: encryptmodel.type,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMP_DP, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfDematdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetSelfDemat/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'DP_ACCOUNT', 'DP_BROKER_NAME', 'TRADING_OPTION', 'TYPE', 'IS_ACTIVE'],
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
                    dataconn.errorlogger('joiningdeclaration', 'GetSelfDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMP_DP Table', Data: null });
                });

        });

    router.route('/DeleteSelfDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();

            dataaccess.Update(TBL_JD_EMP_DP, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMP_DP Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteSelfDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicatedpaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, dpAccount } = encryptmodel;
                const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();

                if (!employeeId || !dpAccount) {
                    return res.status(400).json({ error: 'Employee ID and DP account are required.' });
                }

                const existingDpAccount = await TBL_JD_EMP_DP.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        // DP_ACCOUNT: sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toLowerCase()),
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingDpAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account already exists for this employee.' });
                } else {
                    res.status(200).json({ isDuplicate: false, Message: 'DP account does not exist for this employee.' });
                }

            } catch (error) {
                console.error('Error checking for DP account:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for DP account.', Data: null });
            }
        });



    /////////////////////////////////////// Dependent account details  ///////////////////////////////////////////////////////////////
    //Dependent Other account 
    router.route('/SaveDependentOther')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                BROKER_NAME: encryptmodel.brokerName,
                TRADING_ACCOUNT_NUMBER: encryptmodel.tradecode,
                RELATIVE_ID: encryptmodel.Rtype,
                TRADING_OPTION: 'Eq',
                RELATIONSHIP: encryptmodel.relativeName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'DeptOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveDependentOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetDeptOther/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, RELATIVE_ID: Id, RELATIONSHIP: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'REL_INFO_ID', 'RELATIONSHIP', 'TRADING_ACCOUNT_NUMBER', 'SHARE_HOLDING_AVAILABLE', 'IS_EMPLOYEE_OTHER', 'TRADING_OPTION', 'IS_EAH_EMP_MODIFIED', 'RELATIVE_ID', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetDeptOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO Table', Data: null });
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
            const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteDeptOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateDeptOther')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber, relativeId, brokerName } = encryptmodel;
                const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber || !relativeId || !brokerName) {
                    return res.status(400).json({ error: 'Employee ID, trading account number, relative ID, and broker name are required.' });
                }

                // Check if the same trading account number exists for another relative of the same employee
                const existingTradingAccount = await TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.findOne({
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
                    const existingTradingAccountForSameEmployee = await TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.findOne({
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
                    // const existingTradingAccountForSameEmployeeAndRelative = await TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.findOne({
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
            const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                DP_BROKER_NAME: encryptmodel.brokerName,
                DP_ACCOUNT_NUMBER: encryptmodel.tradecode,
                RELATIVE_ID: encryptmodel.Rtype,
                TYPE: encryptmodel.type,
                TRADING_OPTION: 'Eq',
                RELATIONSHIP: encryptmodel.relativeName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_REL_DP, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'DeptDematdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveDependentDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetDeptDemat/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, RELATIVE_ID: Id, RELATIONSHIP: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'DP_ACCOUNT_NUMBER', 'REL_INFO_ID', 'RELATIONSHIP', 'DP_BROKER_NAME', 'TRADING_OPTION', 'TYPE', 'RELATIVE_ID', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_REL_DP, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_REL_DP Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_REL_DP Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetDeptDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_REL_DP Table', Data: null });
                });

        });

    router.route('/DeleteDeptDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();

            dataaccess.Update(TBL_JD_REL_DP, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_REL_DP Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteDeptDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateRelDp')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, dpAccountNumber, relativeId, dpBrokerName } = encryptmodel;
                const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();

                if (!employeeId || !dpAccountNumber || !relativeId || !dpBrokerName) {
                    return res.status(400).json({ error: 'Employee ID, DP account number, relative ID, and DP broker name are required.' });
                }

                // Check if the same DP account number exists for another relative of the same employee
                const existingDpAccount = await TBL_JD_REL_DP.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        RELATIVE_ID: {
                            [sequelize.Op.not]: relativeId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NUMBER')), '=', dpAccountNumber.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NUMBER')), '=', dpAccountNumber.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingDpAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for another relative with the same employee ID.' });
                } else {
                    // Check if the same DP account number exists for the same employee and a different relative ID
                    const existingDpAccountForSameEmployee = await TBL_JD_REL_DP.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            RELATIVE_ID: relativeId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT_NUMBER')), '=', dpAccountNumber.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT_NUMBER')), '=', dpAccountNumber.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing DP account for the same employee and relative ID
                    // const existingDpAccountForSameEmployeeAndRelative = await TBL_JD_REL_DP.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         RELATIVE_ID: relativeId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingDpAccountForSameEmployee) {
                        res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for this employee and relative.' });
                    }
                    //  else if (existingDpAccountForSameEmployeeAndRelative) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and relative ID.' });
                    // } 
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

            const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, RELATIVE_ID: Id, RELATIONSHIP: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'RELATIVE_ID', 'RELATIONSHIP', 'REL_INFO_ID', 'ENTITY_ID', 'ENTITY_NAME', 'TRADING_ACCOUNT_NUMBER', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    },
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

            dataaccess.FindAll(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetDeptBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/SaveDeptBaseEntity')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_ID: encryptmodel.Rtype,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_ACCOUNT_NUMBER: encryptmodel.EBL,
                ENTITY_NAME: encryptmodel.entname,
                TRADING_OPTION: 'Eq',
                RELATIONSHIP: encryptmodel.relativeName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveDeptBaseEntity', err);
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
            const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteDeptBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateDeptentitytradeaccount')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const { employeeId, tradingAccountNumber, relativeId } = encryptmodel;
                const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingAccountNumber || !relativeId) {
                    return res.status(400).json({ error: 'Employee ID, trading account number, relative ID, and broker name are required.' });
                }

                // Check if the same trading account number exists for another relative of the same employee
                const existingTradingAccount = await TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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
                    const existingTradingAccountForSameEmployee = await TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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
                    // const existingTradingAccountForSameEmployeeAndRelative = await TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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
    router.route('/GetAllTypeRelation')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'Relation'
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
                    dataconn.errorlogger('joiningdeclaration', 'GetAllTypeRelation', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/SaveAddDependentDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_NAME: encryptmodel.Sname,
                RELATIONSHIP: encryptmodel.relation,
                PAN_NO: encryptmodel.pan,
                IS_MINOR: encryptmodel.IsMinor,
                PHONE: encryptmodel.contact,
                MOBILE: encryptmodel.mobile,
                REL_OTHER_NAME: encryptmodel.other,
                FINANCIAL_INDEPENDENT: encryptmodel.findept,
                IS_ACTIVE: true
            };

            // Create the relative info record
            dataaccess.Create(TBL_JD_EMPLOYEE_RELATIVE_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
                        const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_REL_DP, { REL_INFO_ID: relativeInfoId },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });

                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });


    //main grid data get 
    router.route('/combineDataforDependent/:EmployeeId')
        .get(async function (req, res) {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."RELATIONSHIP",
            CASE WHEN COUNT("dp"."DP_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "DP_ACCOUNT_NUMBERS",
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
        FROM
            "TBL_JD_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN
            "TBL_JD_REL_DP" AS "dp"
        ON
            "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO" AS "emp"
        ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."ID" = "emp"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "emp"."RELATIONSHIP"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
        ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."ID" = "ent"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "ent"."RELATIONSHIP"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
        ON
            "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID","rel"."RELATIVE_NAME","rel"."IS_MINOR","rel"."FINANCIAL_INDEPENDENT"`;
            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) { // Check if there are result rows
                        const data = result[0]; // Get the result rows
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Dependent Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Dependent data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'combineDataforDependent', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of dependent Table', Data: null });
                });
        });

    //main grid data update
    router.route('/UpdateAddDependentDetails')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_JD_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                RELATIVE_NAME: encryptmodel.Sname,
                RELATIONSHIP: encryptmodel.relation,
                // ENTITY1_TRADE_CODE: req.body.EBL,
                // ENTITY2_TRADE_CODE: req.body.ESL,
                PAN_NO: encryptmodel.pan,
                IS_MINOR: encryptmodel.IsMinor,
                PHONE: encryptmodel.contact,
                MOBILE: encryptmodel.mobile,
                REL_OTHER_NAME: encryptmodel.other,
                FINANCIAL_INDEPENDENT: encryptmodel.findept,
                IS_ACTIVE: true,
                // IS_DEOENDENT,TRADING_CODE_NONE
            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
                        const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_REL_DP, { REL_INFO_ID: encryptmodel.ID },
                            { REL_INFO_ID: null, IS_ACTIVE: true, RELATIONSHIP: encryptmodel.Sname, RELATIVE_ID: encryptmodel.relation });
                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveSelfOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //main grid data delete
    router.route('/DeleteDependent')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_INFO();

            var param = {
                ID: encryptmodel.ID
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result1) {
                    if (result1 != null) {
                        const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result2) {
                    if (result2 != null) {
                        const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();

                        var dpAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            RELATIVE_ID: encryptmodel.RELATIONSHIP,
                            RELATIONSHIP: encryptmodel.REL_OTHER_NAME,
                            REL_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_REL_DP, { IS_ACTIVE: false }, dpAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (updateResult) {
                    var EncryptLoginDetails = dataconn.encryptionAES(updateResult);
                    res.status(200).json({ Success: true, Message: 'DependentDetails deleted successfully', Data: EncryptLoginDetails });
                })
                .catch(function (error) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteDependent', error);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    //married status check
    router.route('/Selfdata/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'COMPANY', 'EMP_JOIN_DATE', 'DEPARTMENT',
                    'SPOUSENAME', 'SUBMITTED', 'SPOUSE_IS_DEPENDENT', 'SINGLE_STATUS', 'STEP_ID', 'IS_ACTIVE'],
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
                    dataconn.errorlogger('joiningdeclaration', 'GetDeptOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/handlenext3click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 2
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'dpendentdata updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'handlenext3click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    ///////////////////////////////// 10% Stack account details  ////////////////////////////////////////////////////////////////////
    //Stack Entity Trade Info
    router.route('/GetStackBEntityDetails/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, EMPLOYEE_CONCERN_ID: Id, CONCERN_NAME: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'EMPLOYEE_CONCERN_ID', 'CONCERN_NAME', 'ENTITY_ID', 'ENTITY_NAME_10PERCENT', 'TRADING_CODE_10PERCENT', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME', 'ENTITY_CODE'],
                        where: {
                            // IS_BASE_ENTITY: true
                            IS_ACTIVE: true
                        }
                    },
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

            dataaccess.FindAll(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetStackBEntityDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO Table', Data: null });
                });

        });

    router.route('/SaveStackEntityInfo')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                ENTITY_ID: encryptmodel.entityid,
                TRADING_CODE_10PERCENT: encryptmodel.tradecode,
                ENTITY_NAME_10PERCENT: encryptmodel.entname,
                TRADING_OPTION: 'Eq',
                CONCERN_NAME: encryptmodel.concerName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Contactdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveStackEntityInfo', err);
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
            const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();

            dataaccess.Update(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteStackBaseEntById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/checkduplicateStackEntityInfo')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                const { employeeId, tradingCode, employeeConcernId } = encryptmodel;
                const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();

                if (!employeeId || !tradingCode || !employeeConcernId) {
                    return res.status(400).json({ error: 'Employee ID, trading code, employee concern ID, and broker name are required.' });
                }

                // Check if the same trading code exists for another concern with the same employee 
                const existingTradingCode = await TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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
                    const existingTradingAccountForSameEmployee = await TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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
                    // const existingTradingAccountForSameEmployeeAndConcern = await TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.findOne({
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

            const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                BROKER_NAME_10PERCENT: encryptmodel.brokerName,
                TRADING_CODE_10PERCENT: encryptmodel.tradecode,
                EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                TRADING_OPTION: 'Eq',
                CONCERN_NAME: encryptmodel.concerName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_10PERCENT_STAKE_OTHERS, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'StackOtherdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveStackOther', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetStackOther/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, EMPLOYEE_CONCERN_ID: Id, CONCERN_NAME: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME_10PERCENT', 'CONCERN_NAME', 'TRADING_CODE_10PERCENT', 'EMPLOYEE_CONCERN_ID', 'TRADING_OPTION', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_10PERCENT_STAKE_OTHERS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_10PERCENT_STAKE_OTHERS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_10PERCENT_STAKE_OTHERS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetStackOther', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_10PERCENT_STAKE_OTHERS Table', Data: null });
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
            const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();

            dataaccess.Update(TBL_JD_10PERCENT_STAKE_OTHERS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_10PERCENT_STAKE_OTHERS Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteStackOtherById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    // router.route('/checkduplicateStackOther')
    //     .post(async (req, res) => {
    //         try {
    //             const { employeeId, tradingCode, employeeConcernId, brokerName } = req.body;
    //             const TBL_POB_10PERCENT_STAKE_OTHERS = datamodel.TBL_POB_10PERCENT_STAKE_OTHERS();

    //             if (!employeeId || !tradingCode || !employeeConcernId || !brokerName) {
    //                 return res.status(400).json({ error: 'Employee ID, trading code, employee concern ID, and broker name are required.' });
    //             }

    //             // Check if the same trading code exists for another entry with the same employee concern ID
    //             const existingTradingCode = await TBL_POB_10PERCENT_STAKE_OTHERS.findOne({
    //                 where: {
    //                     EMPLOYEE_ID: employeeId,
    //                     EMPLOYEE_CONCERN_ID: {
    //                         [sequelize.Op.not]: employeeConcernId
    //                     },
    //                     [sequelize.Op.or]: [
    //                         sequelize.where(sequelize.fn('LOWER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toLowerCase()),
    //                         sequelize.where(sequelize.fn('UPPER', sequelize.col('TRADING_CODE_10PERCENT')), '=', tradingCode.toUpperCase())
    //                     ],
    //                     IS_ACTIVE: true
    //                 }
    //             });

    //             if (existingTradingCode) {
    //                 res.status(200).json({ isDuplicate: true, Message: 'Trading code already exists for another entry with the same employee ID.' });
    //             }
    //             else {
    //                 // Check if there is an existing entry for the same employee concern ID
    //                 const existingEntryForSameEmployeeConcern = await TBL_POB_10PERCENT_STAKE_OTHERS.findOne({
    //                     where: {
    //                         EMPLOYEE_ID: employeeId,
    //                         EMPLOYEE_CONCERN_ID: employeeConcernId,
    //                         IS_ACTIVE: true
    //                     }
    //                 });

    //                 if (existingEntryForSameEmployeeConcern) {
    //                     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee concern ID.' });
    //                 } else {
    //                     res.status(200).json({ isDuplicate: false, Message: 'Trading code does not exist for this employee concern ID.' });
    //                 }
    //             }

    //         } catch (error) {
    //             console.error('Error checking for trading code:', error);
    //             res.status(500).json({ Success: false, Message: 'An error occurred while checking for trading code.', Data: null });
    //         }
    //     });
    router.route('/checkduplicateStackOther')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                const { employeeId, tradingCode, employeeConcernId, brokerName } = encryptmodel;
                const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();

                if (!employeeId || !tradingCode || !employeeConcernId || !brokerName) {
                    return res.status(400).json({ error: 'Employee ID, trading code, employee concern ID, and broker name are required.' });
                }

                // Check if the same trading code exists for another concern with the same employee 
                const existingTradingCode = await TBL_JD_10PERCENT_STAKE_OTHERS.findOne({
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
                    const existingTradingAccountForSameEmployee = await TBL_JD_10PERCENT_STAKE_OTHERS.findOne({
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
                    // const existingTradingAccountForSameEmployeeAndConcern = await TBL_JD_10PERCENT_STAKE_OTHERS.findOne({
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

            const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                DP_BROKER_NAME: encryptmodel.brokerName,
                DP_ACCOUNT: encryptmodel.tradecode,
                TYPE: encryptmodel.type,
                EMPLOYEE_CONCERN_ID: encryptmodel.Ctype,
                TRADING_OPTION: 'Eq',
                CONCERN_NAME: encryptmodel.concerName,
                IS_ACTIVE: true

            };

            dataaccess.Create(TBL_JD_STK_DP, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'StackDematdata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveStackDemat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //get all demat account in dropdown
    // router.route('/GetDemat/:EmployeeId')
    //     .get(function (req, res) {

    //         const TBL_POB_REL_DP = datamodel.TBL_POB_REL_DP();
    //         // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
    //         var param = {
    //             attributes: ['ID', 'DP_ACCOUNT_NUMBER', 'DP_BROKER_NAME'],
    //             where: {
    //                 EMPLOYEE_ID: req.params.EmployeeId,
    //                 IS_ACTIVE: true
    //             }
    //         };
    //         dataaccess.FindAll(TBL_POB_REL_DP, param)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'TBL_POB_REL_DP List Table Access', Data: result });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_REL_DP List Table', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('joiningdeclaration', 'GetAllTypeConcern', err);
    //                 res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_REL_DP Table', Data: null });
    //             });
    //     }); 
    router.route('/GetDemat/:EmployeeId')
        .get(async function (req, res) {
            const query = `
                        SELECT "DP_ACCOUNT" AS dematNumber
                        FROM "TBL_JD_EMP_DP"
                        WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}' AND "IS_ACTIVE" = true
                        UNION
                        SELECT "DP_ACCOUNT_NUMBER" AS dematNumber
                        FROM "TBL_JD_REL_DP"
                        WHERE "EMPLOYEE_ID" = '${req.params.EmployeeId}'  AND "IS_ACTIVE" = true`;
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
                    dataconn.errorlogger('joiningdeclaration', 'GetDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Demat Details', Data: null });
                });
        });

    router.route('/GetStackDemat/:EmployeeId/:id/:name')
        .get(function (req, res) {

            const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const employeeId = req.params.EmployeeId;
            const Id = req.params.id;
            const Name = req.params.name;

            var param = {
                where: { EMPLOYEE_ID: employeeId, EMPLOYEE_CONCERN_ID: Id, CONCERN_NAME: Name, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'DP_ACCOUNT', 'CONCERN_NAME', 'DP_BROKER_NAME', 'TRADING_OPTION', 'TYPE', 'EMPLOYEE_CONCERN_ID', 'IS_ACTIVE'],
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

            dataaccess.FindAll(TBL_JD_STK_DP, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_STK_DP Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_STK_DP Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetStackDemat', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_STK_DP Table', Data: null });
                });

        });

    router.route('/DeleteStackDematById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();

            dataaccess.Update(TBL_JD_STK_DP, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_STK_DP Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteStackDematById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    // router.route('/checkduplicateStkDp')
    //     .post(async (req, res) => {
    //         try {
    //             const { employeeId, dpAccount, employeeConcernId, dpBrokerName } = req.body;
    //             const TBL_POB_STK_DP = datamodel.TBL_POB_STK_DP(); // Make sure the model is imported properly

    //             if (!employeeId || !dpAccount || !employeeConcernId || !dpBrokerName) {
    //                 return res.status(400).json({ error: 'Employee ID, DP account, employee concern ID, and DP broker name are required.' });
    //             }

    //             // Check if the same DP account exists for another entry with the same employee concern ID
    //             const existingDpAccount = await TBL_POB_STK_DP.findOne({
    //                 where: {
    //                     EMPLOYEE_ID: employeeId,
    //                     EMPLOYEE_CONCERN_ID: {
    //                         [sequelize.Op.not]: employeeConcernId
    //                     },
    //                     [sequelize.Op.or]: [
    //                         sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toLowerCase()),
    //                         sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toUpperCase())
    //                     ],
    //                     IS_ACTIVE: true
    //                 }
    //             });

    //             if (existingDpAccount) {
    //                 res.status(200).json({ isDuplicate: true, Message: 'DP account already exists for another entry with the same employee ID.' });
    //             } else {
    //                 // Check if there is an existing entry for the same employee concern ID
    //                 const existingEntryForSameEmployeeConcern = await TBL_POB_STK_DP.findOne({
    //                     where: {
    //                         EMPLOYEE_ID: employeeId,
    //                         EMPLOYEE_CONCERN_ID: employeeConcernId,
    //                         IS_ACTIVE: true
    //                     }
    //                 });

    //                 if (existingEntryForSameEmployeeConcern) {
    //                     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee concern ID.' });
    //                 } else {
    //                     res.status(200).json({ isDuplicate: false, Message: 'DP account does not exist for this employee concern ID.' });
    //                 }
    //             }

    //         } catch (error) {
    //             console.error('Error checking for DP account:', error);
    //             res.status(500).json({ Success: false, Message: 'An error occurred while checking for DP account.', Data: null });
    //         }
    //     });
    router.route('/checkduplicateStkDp')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                const { employeeId, dpAccount, employeeConcernId, dpBrokerName } = encryptmodel;
                const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();

                if (!employeeId || !dpAccount || !employeeConcernId || !dpBrokerName) {
                    return res.status(400).json({ error: 'Employee ID, DP account, employee concern ID, and DP broker name are required.' });
                }

                // Check if the same DP account exists for another concern ID with the same employee 
                const existingDpAccount = await TBL_JD_STK_DP.findOne({
                    where: {
                        EMPLOYEE_ID: employeeId,
                        EMPLOYEE_CONCERN_ID: {
                            [sequelize.Op.not]: employeeConcernId
                        },
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toLowerCase()),
                            sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toUpperCase())
                        ],
                        IS_ACTIVE: true
                    }
                });

                if (existingDpAccount) {
                    res.status(200).json({ isDuplicate: true, Message: 'DP account already exists for another concern with the same employee ID.' });
                } else {
                    // Check if the same DP account number exists for the same employee and a different concern ID
                    const existingEntryForSameEmployeeConcern = await TBL_JD_STK_DP.findOne({
                        where: {
                            EMPLOYEE_ID: employeeId,
                            EMPLOYEE_CONCERN_ID: employeeConcernId,
                            [sequelize.Op.or]: [
                                sequelize.where(sequelize.fn('LOWER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toLowerCase()),
                                sequelize.where(sequelize.fn('UPPER', sequelize.col('DP_ACCOUNT')), '=', dpAccount.toUpperCase())
                            ],
                            IS_ACTIVE: true
                        }
                    });

                    // Check if there is an existing DP account for the same employee and concern ID
                    // const existingDpAccountForSameEmployeeAndconcern = await TBL_JD_STK_DP.findOne({
                    //     where: {
                    //         EMPLOYEE_ID: employeeId,
                    //         EMPLOYEE_CONCERN_ID: employeeConcernId,
                    //         IS_ACTIVE: true
                    //     }
                    // });

                    if (existingEntryForSameEmployeeConcern) {
                        res.status(200).json({ isDuplicate: true, Message: 'DP account number already exists for this employee and concern.' });
                    }
                    //  else if (existingDpAccountForSameEmployeeAndconcern) {
                    //     res.status(200).json({ isDuplicate: true, Message: 'An entry already exists for this employee and concern ID.' });
                    // } 
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
    router.route('/GetAllTypeConcern')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'Concern'
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
                    dataconn.errorlogger('joiningdeclaration', 'GetAllTypeConcern', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/SaveAddConcernDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                NAME_OF_CONCERN: encryptmodel.Cname,
                TYPE_OF_CONCERN: encryptmodel.CType,
                PAN_NO: encryptmodel.pan,
                CONCERN_OTHER_NAME: encryptmodel.Other,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true,
            };

            dataaccess.Create(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, values)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
                        const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_10PERCENT_STAKE_OTHERS, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_STK_DP, { CONCERN_INFO_ID: relativeInfoId },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });
                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveAddConcernDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    //main grid data get
    router.route('/combineDataforConcern/:EmployeeId')
        .get(async function (req, res) {
            const query = `
            SELECT
            "rel"."ID",
            "rel"."TYPE_OF_CONCERN",
            CASE WHEN COUNT("dp"."DP_ACCOUNT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT")), ', ') ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",                           
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
             MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
        FROM
            "TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
        LEFT JOIN
            "TBL_JD_STK_DP" AS "dp"
        ON
            "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_10PERCENT_STAKE_OTHERS" AS "emp"
        ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "emp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "emp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "emp"."CONCERN_NAME"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
        ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "ent"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "ent"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "ent"."CONCERN_NAME"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
        ON
            "rel"."TYPE_OF_CONCERN" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${req.params.EmployeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID","rel"."NAME_OF_CONCERN"`;
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
                    dataconn.errorlogger('joiningdeclaration', 'combineDataforConcern', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Concern Table', Data: null });
                });
        });

    //main grid data update
    router.route('/UpdateAddConcernDetails')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
            var values = {
                EMPLOYEE_ID: encryptmodel.employeeid,
                NAME_OF_CONCERN: encryptmodel.Cname,
                TYPE_OF_CONCERN: encryptmodel.CType,
                // ENTITY1_STAKE_ACCESS: req.body.EBL,
                // ENTITY2_STAKE_ACCESS: req.body.ESL,
                PAN_NO: encryptmodel.pan,
                CONCERN_OTHER_NAME: encryptmodel.Other,
                TRADING_OPTION: 'Eq',
                IS_ACTIVE: true,
                // EMPLOYEE_CONCERN_ID
            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, values, param)
                .then(function (result) {
                    if (result != null) {
                        // Capture the ID of the newly saved record
                        var relativeInfoId = result.ID;

                        // Now, you can update the other tables using the relative name and the captured ID                    
                        const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();
                        const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
                        const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();

                        // Update other_table_1 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_2 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_10PERCENT_STAKE_OTHERS, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                        // Update other_table_3 where RELATIVE_NAME matches
                        dataaccess.Update(TBL_JD_STK_DP, { CONCERN_INFO_ID: encryptmodel.ID },
                            { CONCERN_INFO_ID: null, IS_ACTIVE: true, CONCERN_NAME: encryptmodel.Cname, EMPLOYEE_CONCERN_ID: encryptmodel.CType });

                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'SelfOtherdata saved successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'UpdateAddConcernDetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //main grid data delete, ---'Mandatory' AS Status
    router.route('/DeleteConcern')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();

            var param = {
                ID: encryptmodel.ID
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_10PERCENT_STAKE_OTHERS, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result1) {
                    if (result1 != null) {
                        const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();

                        var tradingAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, { IS_ACTIVE: false }, tradingAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (result2) {
                    if (result2 != null) {
                        const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();

                        var dpAccountParam = {
                            EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                            EMPLOYEE_CONCERN_ID: encryptmodel.RELATIONSHIP,
                            CONCERN_NAME: encryptmodel.REL_OTHER_NAME,
                            CONCERN_INFO_ID: encryptmodel.ID
                        };

                        return dataaccess.Update(TBL_JD_STK_DP, { IS_ACTIVE: false }, dpAccountParam);
                    } else {
                        throw new Error('Error occurred while deleting record');
                    }
                })
                .then(function (updateResult) {
                    var EncryptLoginDetails = dataconn.encryptionAES(updateResult);
                    res.status(200).json({ Success: true, Message: 'ConcernDetails deleted successfully', Data: EncryptLoginDetails });
                })
                .catch(function (error) {
                    dataconn.errorlogger('joiningdeclaration', 'DeleteConcern', error);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/handlenext4click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 3
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'concern updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'handlenext4click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    ///////////////////////////////////// security holdings /////////////////////////////////////////////////////////////
    router.route('/AllDP/:EmployeeId')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const query = `WITH EmpDp AS (
                SELECT	              
                    'Self' AS Relation,
                    '${encryptmodel.name}' AS Name,
                    "DP_BROKER_NAME" AS BrokerName,
                    "DP_ACCOUNT" AS DPAccount,
                    "UPLOAD_PATH" AS uploadedFile,
                    "AUTHORIZE_EW" as authorize,
                    "PROVIDE_DEMAT" AS isprovide
                FROM
                    "TBL_JD_EMP_DP" emp
                WHERE
                    "EMPLOYEE_ID" = '${req.params.EmployeeId}'
                    AND emp."IS_ACTIVE" = true
                ),

                Relatives AS (
                SELECT 
                    eri."RELATIVE_NAME" AS Name, gm."NAME" AS Relation, eri."RELATIONSHIP",eri."ID"
                FROM "TBL_JD_EMPLOYEE_RELATIVE_INFO" eri
                JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                WHERE eri."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND eri."IS_ACTIVE" = TRUE
                ),

                Concern AS (
                SELECT 
                    eri."NAME_OF_CONCERN" AS Name, gm."NAME" AS Relation, eri."TYPE_OF_CONCERN",eri."ID"
                FROM "TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" eri
                JOIN "TBL_GENERIC_MST" gm ON eri."TYPE_OF_CONCERN" = gm."ID"
                WHERE eri."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND eri."IS_ACTIVE" = TRUE
                )

                SELECT
                    EmpDp.Relation,
                    EmpDp.Name,
                    EmpDp.BrokerName,
                    EmpDp.DPAccount,
                    EmpDp.uploadedFile,
                    EmpDp.authorize,
                    EmpDp.isprovide
                FROM EmpDp
                UNION ALL
                SELECT
                    Relatives.Relation,
                    Relatives.Name,                            
                    dp."DP_BROKER_NAME" AS BrokerName,
                    dp."DP_ACCOUNT_NUMBER" AS DPAccount,
                    dp."UPLOAD_PATH" AS uploadedFile,
                    dp."AUTHORIZE_EW" AS authorize,
                    dp."PROVIDE_DEMAT" AS isprovide
                FROM Relatives
                JOIN "TBL_JD_REL_DP" dp ON Relatives."RELATIONSHIP" = dp."RELATIVE_ID" AND Relatives."ID" = dp."REL_INFO_ID"
                WHERE dp."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND dp."IS_ACTIVE" = true AND dp."IS_ACTIVE" = true
                UNION ALL
                SELECT
                    Concern.Relation,
                    Concern.Name,
                    stk_dp."DP_BROKER_NAME" AS BrokerName,
                    stk_dp."DP_ACCOUNT" AS DPAccount,
                    stk_dp."UPLOAD_PATH" AS uploadedFile,
                    stk_dp."AUTHORIZE_EW" AS authorize,
                    stk_dp."PROVIDE_DEMAT" AS isprovide
                FROM Concern
                JOIN "TBL_JD_STK_DP" stk_dp ON Concern."TYPE_OF_CONCERN" = stk_dp."EMPLOYEE_CONCERN_ID" AND Concern."ID" = stk_dp."CONCERN_INFO_ID"
                WHERE stk_dp."EMPLOYEE_ID" = '${req.params.EmployeeId}' AND stk_dp."IS_ACTIVE" = true`;
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

    router.route('/uploadfile')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname + '/.');

            console.log("Folder_Path", Folder_Path);

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

                const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
                var values = {
                    EMPLOYEE_ID: requestBody.ID,
                    DP_ACCOUNT: requestBody.ACCOUNTNO,
                    IS_ACTIVE: true,
                    UPLOAD_PATH: filepath,
                    CREATED_ON: connect.sequelize.fn("NOW"),
                };
                dataaccess.Create(TBL_JD_EMP_DP, values)
                    .then(function (result) {
                        if (result != null) {
                            res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
                        }
                        else {
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    });
            }
        })

    //upload file for self_demat
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

    //             const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_EMP_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();

    //         // dataaccess.Update(TBL_JD_EMP_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforSelf', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/SaveUploadFilePathforSelf')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {

                await fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                await fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_EMP_DP, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_EMP_DP, values, param)
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

    //             const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_EMP_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_JD_EMP_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'self updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforSelf1', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/SaveUploadFilePathforSelf1')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {

                await fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                await fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_EMP_DP, values, param)
                        .then(function (result) {
                            if (result != null) {
                                res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
                            }
                            else {
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            }
                        });
                }



            } else {

                fileDetails = req.files

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_EMP_DP, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            });
                    }
                }


            }
        });

    //upload file for rel_demat
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

    //             const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_REL_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
    //         // var values = {
    //         //     PROVIDE_DEMAT: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     AUTHORIZE_EW: null,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NUMBER: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_JD_REL_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforREL', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/SaveUploadFilePathforREL')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_REL_DP, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_REL_DP, values, param)
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

    //             const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_REL_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT_NUMBER: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_JD_REL_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforREL1', err);
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

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_REL_DP, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT_NUMBER: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_REL_DP, values, param)
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
        });


    //upload file for stk_demat
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

    //             const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
    //             var values = {
    //                 PROVIDE_DEMAT: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 AUTHORIZE_EW: null,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_STK_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
    //         // var values = {
    //         //     PROVIDE_DEMAT: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     AUTHORIZE_EW: null,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_JD_STK_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforSTK', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/SaveUploadFilePathforSTK')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
                    var values = {
                        PROVIDE_DEMAT: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        AUTHORIZE_EW: null,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_STK_DP, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
                        var values = {
                            PROVIDE_DEMAT: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            AUTHORIZE_EW: null,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_STK_DP, values, param)
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

    //             const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
    //             var values = {
    //                 AUTHORIZE_EW: false,
    //                 SHARE_HOLDING_AVAILABLE: false,
    //                 IS_UPLOAD: true,
    //                 UPLOAD_PATH: filepath,
    //                 UPLOAD_DATE: new Date()
    //             };
    //             var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

    //             dataaccess.Update(TBL_JD_STK_DP, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
    //         // var values = {
    //         //     AUTHORIZE_EW: false,
    //         //     SHARE_HOLDING_AVAILABLE: false,
    //         //     IS_UPLOAD: true,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     UPLOAD_DATE: new Date()
    //         // };
    //         // var param = { EMPLOYEE_ID: req.body.eid, DP_ACCOUNT: req.body.accnumber, IS_ACTIVE: true };

    //         // dataaccess.Update(TBL_JD_STK_DP, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SaveUploadFilePathforSTK1', err);
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

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
                    var values = {
                        AUTHORIZE_EW: false,
                        SHARE_HOLDING_AVAILABLE: false,
                        IS_UPLOAD: true,
                        UPLOAD_PATH: filepath,
                        UPLOAD_DATE: new Date()
                    };
                    var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                    dataaccess.Update(TBL_JD_STK_DP, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
                        var values = {
                            AUTHORIZE_EW: false,
                            SHARE_HOLDING_AVAILABLE: false,
                            IS_UPLOAD: true,
                            UPLOAD_PATH: filepath,
                            UPLOAD_DATE: new Date()
                        };
                        var param = { EMPLOYEE_ID: requestBody.eid, DP_ACCOUNT: requestBody.accnumber, IS_ACTIVE: true };

                        dataaccess.Update(TBL_JD_STK_DP, values, param)
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
        });



    //Authorize for self
    router.route('/SaveAuthorizeforSelf')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            var values = {
                PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_EMP_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'self updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveAuthorizeforSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    //Authorize for rel
    router.route('/SaveAuthorizeforREL')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
            var values = {
                PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NUMBER: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_REL_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveAuthorizeforREL', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    //Authorize for stk
    router.route('/SaveAuthorizeforSTK')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
            var values = {
                PROVIDE_DEMAT: false,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: true,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_STK_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveAuthorizeforSTK', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //emaillater for self
    router.route('/SaveEmailLaterSelf')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_EMP_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'self updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveEmailLaterSelf', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    //emaillater for rel
    router.route('/SaveEmailLaterREL')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT_NUMBER: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_REL_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'REL updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveEmailLaterREL', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    //Authorize for stk
    router.route('/SaveEmailLaterSTK')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
            var values = {
                PROVIDE_DEMAT: true,
                SHARE_HOLDING_AVAILABLE: false,
                AUTHORIZE_EW: null,
                IS_UPLOAD: false,
                UPLOAD_PATH: null,
                UPLOAD_DATE: null
            };
            var param = { EMPLOYEE_ID: encryptmodel.eid, DP_ACCOUNT: encryptmodel.accnumber, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_STK_DP, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'STK updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SaveEmailLaterSTK', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    //////////////////////////////////////// Physical Share Holding ////////////////////////////////////////////////
    //upload file
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


    //             const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    //             var values = {
    //                 EMPLOYEE_ID: requestBody.eid,
    //                 UPLOAD_PATH: filepath,
    //                 IS_ACTIVE: true
    //             };
    //             dataaccess.Create(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    //         // var values = {
    //         //     EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,
    //         //     IS_ACTIVE: true
    //         // };

    //         // dataaccess.Create(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'physicalshare updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'SavePhysicalShareUploadFile', err);
    //         //         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //     });
    //     });
    router.route('/SavePhysicalShareUploadFile')
        .post(upload.any(), function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
                    var values = {
                        EMPLOYEE_ID: requestBody.eid,
                        UPLOAD_PATH: filepath,
                        IS_ACTIVE: true
                    };
                    dataaccess.Create(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
                        var values = {
                            EMPLOYEE_ID: requestBody.eid,
                            UPLOAD_PATH: filepath,
                            IS_ACTIVE: true
                        };
                        dataaccess.Create(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values)
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

    //             const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    //             var values = {
    //                 // EMPLOYEE_ID: req.body.eid,
    //                 UPLOAD_PATH: filepath,

    //             };
    //             var param = {
    //                 ID: requestBody.ID,
    //                 IS_ACTIVE: true
    //             }
    //             dataaccess.Update(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: result });
    //                     }
    //                     else {
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                     }
    //                 });
    //         }
    //         // const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    //         // var values = {
    //         //     // EMPLOYEE_ID: req.body.eid,
    //         //     UPLOAD_PATH: req.body.f_path,

    //         // };
    //         // var param = {
    //         //     ID: req.body.ID,
    //         //     IS_ACTIVE: true
    //         // }

    //         // dataaccess.Update(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values, param)
    //         //     .then(function (result) {
    //         //         if (result != null) {
    //         //             res.status(200).json({ Success: true, Message: 'physicalshare updated successfully', Data: result });
    //         //         }
    //         //         else {

    //         //             res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //         //         }
    //         //     }, function (err) {
    //         //         dataconn.errorlogger('joiningdeclaration', 'UpdatePhysicalShareUploadFile', err);
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

            const Folder_Path = path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type);



            if (!fs.existsSync(path.join(Folder_Path))) {
                if (!fs.existsSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))) {
                    fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId)))
                }

                fs.mkdirSync(path.join(path.join(__dirname + '/..', requestBody.EmpId, requestBody.Type)))
                fileDetails = req.files

                finalData = [];
                for (let i = 0; i < fileDetails.length; i++) {

                    let newFileName = fileDetails[i].originalname

                    let writeFile = util.promisify(fs.writeFile)



                    writeFile(path.join(Folder_Path + '/' + newFileName),
                        fileDetails[i].buffer)
                    let filepath = (path.join(Folder_Path + '/' + newFileName))


                    const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
                    var values = {
                        // EMPLOYEE_ID: req.body.eid,
                        UPLOAD_PATH: filepath,

                    };
                    var param = {
                        ID: requestBody.ID,
                        IS_ACTIVE: true
                    }
                    dataaccess.Update(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values, param)
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

                finalData = [];

                for (let i = 0; i < fileDetails.length; i++) {
                    if (fs.existsSync(path.join(Folder_Path + '/' + fileDetails[i].originalname))) {

                        res.status(200).json({ Success: true, Message: 'File already exist please change the document .', Data: null });
                    } else {


                        let newFileName = fileDetails[i].originalname

                        let writeFile = util.promisify(fs.writeFile)



                        writeFile(path.join(Folder_Path + '/' + newFileName),
                            fileDetails[i].buffer)
                        let filepath = (path.join(Folder_Path + '/' + newFileName))


                        const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
                        var values = {
                            // EMPLOYEE_ID: req.body.eid,
                            UPLOAD_PATH: filepath,

                        };
                        var param = {
                            ID: requestBody.ID,
                            IS_ACTIVE: true
                        }
                        dataaccess.Update(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, values, param)
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
        });


    //get  upload file
    router.route('/GetPhysicalHolding/:EmployeeId')
        .get(function (req, res) {

            const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
            const employeeId = req.params.EmployeeId;

            var param = {
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'UPLOAD_PATH', 'IS_ACTIVE'],
            };
            console.log("param", param);

            dataaccess.FindAll(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_JD_EMP_PHYSICAL_SHARE_HOLDING Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMP_PHYSICAL_SHARE_HOLDING Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetPhysicalHolding', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_JD_EMP_PHYSICAL_SHARE_HOLDING Table', Data: null });
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
            const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();

            dataaccess.Update(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'TBL_JD_EMP_PHYSICAL_SHARE_HOLDING Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'DeletePSHoldingById', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while deleting record', Data: null });
                });
        });

    router.route('/handlenext5click')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var updateValues = {
                STEP_ID: 4
            };

            var updateCondition = {
                EMPLOYEE_ID: encryptmodel.employeeId,
                IS_ACTIVE: true,
            };

            dataaccess.Update(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, updateValues, updateCondition)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'concern updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'handlenext4click', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    //////////////////////////////////////////////// Submit /////////////////////////////////////////////////
    router.route('/SubmitFinaleResult')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var values = {
                SUBMITTED: true,
                STEP_ID: 5

            };
            var param = { EMPLOYEE_ID: encryptmodel.employee, IS_ACTIVE: true };

            dataaccess.Update(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Final Submit successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while final submittimg record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'SubmitFinaleResult', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while final submittimg record', Data: null });
                });
        });

    // router.route('/DocumentsDownloadfileEMP/:Id')
    //     .get(function (req, res) {
    //         console.log("1");
    //         const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    //         var param = {
    //             // where: { 
    //                 ID: req.params.Id
    //             //  }
    //         };
    //         dataaccess.FindAll(TBL_JD_EMP_DP, param)
    //             .then(function (result) {
    //                 console.log("result dwnlod",result);
    //                 if (result != null) {
    //                     res.download(result[0].UPLOAD_PATH);
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'File can not be find.', Data: null });
    //                 }
    //             },
    //                 function (err) {
    //                     dataconn.errorlogger('joiningDeclarationmstService', 'DocumentsDownloadfileEMP', err);
    //                     res.status(200).json({ Success: false, Message: 'File can not be find.', Data: null });
    //                 });
    //     });

    // router.route('/DocumentsDownloadfileEMP/:Id').get(function (req, res) {
    //     console.log("1");
    //     const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    //     var param = {
    //         ID: req.params.Id
    //     };
    //     console.log("dwnld param", param);

    //     dataaccess.FindAll(TBL_JD_EMP_DP, param).then(function (result) {
    //         console.log("result dwnlod", result);
    //         if (result != null) {
    //             // Get the last three characters from the UPLOAD_PATH
    //             const lastThreeChars = result[0].UPLOAD_PATH.slice(-3);
    //             console.log("Last three characters:", lastThreeChars);
    //             const filePath = path.join(__dirname, 'Service', lastThreeChars);
    //             console.log("filePath", filePath);

    //             res.download(filePath);
    //         } else {
    //             res.status(200).json({ Success: false, Message: 'File cannot be found.', Data: null });
    //         }
    //     }, function (err) {
    //         dataconn.errorlogger('joiningDeclarationmstService', 'DocumentsDownloadfileEMP', err);
    //         res.status(200).json({ Success: false, Message: 'File cannot be found.', Data: null });
    //     });
    // });

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


    ///////////////////////////////////////////  Download PDF  ///////////////////////////////////////////////////////
    router.route('/generate-pdf')
        .post(async function (req, res) {
            const employeeId = req.body.employeeId;

            try {
                // Call your PDF generation function
                const pdfStream = await generateEduPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="JDemployee_details.pdf"');
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
                // Call your PDF generation function
                const pdfStream = await generateSelfAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="JDselfaccount_details.pdf"');
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
                // Call your PDF generation function
                const pdfStream = await generateDeptAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="JDdependentaccount_details.pdf"');
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
                // Call your PDF generation function
                const pdfStream = await generateStackAccPDF1(employeeId);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="JD10%stack_details.pdf"');
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
                // Call your PDF generation function
                const pdfStream = await generateSecHoldingPDF1(employeeId, name);

                // Send the PDF as a response
                res.setHeader('Content-Disposition', 'attachment; filename="JDsecurity_holding.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ Success: false, Message: 'An error occurred', Error: err });
            }
        });

    async function generateEduPDF1(employeeId) {
        try {
            const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();
            const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();
            const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            const qualificationData = await dataaccess.FindAll(TBL_JD_EDU_DETAILS, {
                attributes: ['ID', 'EMPLOYEE_ID', 'INSTITUTION', 'QUALIFICATION', 'SUB_QUALIFICATION'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const workExData = await dataaccess.FindAll(TBL_JD_PAST_EMP_DETAILS, {
                attributes: ['ID', 'EMPLOYEE_ID', 'PAST_EMPLOYERS'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const contactData = await dataaccess.FindAll(TBL_JD_CONTACT_DETAILS, {
                attributes: ['ID', 'EMPLOYEE_ID', 'CONTACT_TYPE', 'CONATCT_NUMBER'],
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

            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'JDedu.ejs'), 'utf8');
            const content = ejs.render(templateContent, { FinishData: FinishData });

            // Generate PDF from the rendered HTML and return it as a buffer
            return new Promise((resolve, reject) => {
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF:", err);
                        reject(err);
                    } else {
                        // stream.pipe(fs.createWriteStream('JD.pdf'));
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
            const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
            const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
            const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            const EntityData = await dataaccess.FindAll(TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, {
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

            const OtherData = await dataaccess.FindAll(TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, {
                attributes: ['ID', 'EMPLOYEE_ID', 'BROKER_NAME', 'TRADING_ACCOUNT_NUMBER'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

            const DematData = await dataaccess.FindAll(TBL_JD_EMP_DP, {
                attributes: ['ID', 'EMPLOYEE_ID', 'DP_BROKER_NAME', 'DP_ACCOUNT'],
                where: { EMPLOYEE_ID: employeeId, IS_ACTIVE: true }
            });

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
            
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'JDselfAcc.ejs'), 'utf8');
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
            CASE WHEN COUNT("dp"."DP_ACCOUNT_NUMBER") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT_NUMBER")), ', ') ELSE '' END AS "DP_ACCOUNT_NUMBERS",
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
        FROM
            "TBL_JD_EMPLOYEE_RELATIVE_INFO" AS "rel"
        LEFT JOIN
            "TBL_JD_REL_DP" AS "dp"
        ON
            "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."ID" = "dp"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "dp"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "dp"."RELATIONSHIP"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO" AS "emp"
        ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."ID" = "emp"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "emp"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "emp"."RELATIONSHIP"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
        ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."ID" = "ent"."REL_INFO_ID"
            AND "rel"."RELATIONSHIP" = "ent"."RELATIVE_ID"
            AND "rel"."RELATIVE_NAME" = "ent"."RELATIONSHIP"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
        ON
            "rel"."RELATIONSHIP" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID","rel"."RELATIVE_NAME","rel"."IS_MINOR","rel"."FINANCIAL_INDEPENDENT"`;

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
            
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'JDdeptAcc.ejs'), 'utf8');
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
            "rel"."TYPE_OF_CONCERN",
            CASE WHEN COUNT("dp"."DP_ACCOUNT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("dp"."DP_BROKER_NAME", '-', "dp"."DP_ACCOUNT")), ', ') ELSE '' END AS "DP_ACCOUNT",
            CASE WHEN COUNT("emp"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("emp"."BROKER_NAME_10PERCENT", '-', "emp"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "TRADING_CODE_10PERCENT",                           
            CASE WHEN COUNT("ent"."TRADING_CODE_10PERCENT") > 0 THEN ARRAY_TO_STRING(ARRAY_AGG(DISTINCT CONCAT("ent"."ENTITY_NAME_10PERCENT", '-', "ent"."TRADING_CODE_10PERCENT")), ', ') ELSE '' END AS "ENTITY_CODE_10PERCENT",
             MAX("rel"."NAME_OF_CONCERN") AS "NAME_OF_CONCERN",
            MAX("rel"."CONCERN_OTHER_NAME") AS "CONCERN_OTHER_NAME",
            MAX("rel"."PAN_NO") AS "PAN_NO",
            MAX("gen"."NAME") AS "CONCERN_TYPE"
        FROM
            "TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" AS "rel"
        LEFT JOIN
            "TBL_JD_STK_DP" AS "dp"
        ON
            "rel"."EMPLOYEE_ID" = "dp"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "dp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "dp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "dp"."CONCERN_NAME"
            AND "dp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_10PERCENT_STAKE_OTHERS" AS "emp"
        ON
            "rel"."EMPLOYEE_ID" = "emp"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "emp"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "emp"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "emp"."CONCERN_NAME"
            AND "emp"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO" AS "ent"
        ON
            "rel"."EMPLOYEE_ID" = "ent"."EMPLOYEE_ID"
            AND "rel"."TYPE_OF_CONCERN" = "ent"."EMPLOYEE_CONCERN_ID"
            AND "rel"."ID" = "ent"."CONCERN_INFO_ID"
            AND "rel"."NAME_OF_CONCERN" = "ent"."CONCERN_NAME"
            AND "ent"."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_GENERIC_MST" AS "gen"
        ON
            "rel"."TYPE_OF_CONCERN" = "gen"."ID"
        WHERE
            "rel"."EMPLOYEE_ID" = '${employeeId}'
            AND "rel"."IS_ACTIVE" = true
        GROUP BY
            "rel"."ID","rel"."NAME_OF_CONCERN"`;

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
            
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'JDstackAcc.ejs'), 'utf8');
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
            const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();

            const query = `
            WITH EmpDp AS (
                SELECT	              
                    'Self' AS Relation,
                    '${name}' AS Name,
                    "DP_BROKER_NAME" AS BrokerName,
                    "DP_ACCOUNT" AS DPAccount,
                    "UPLOAD_PATH" AS uploadedFile,
                    "AUTHORIZE_EW" as authorize,
                    "PROVIDE_DEMAT" AS isprovide
                FROM
                    "TBL_JD_EMP_DP" emp
                WHERE
                    "EMPLOYEE_ID" = '${employeeId}'
                    AND emp."IS_ACTIVE" = true
                ),

                Relatives AS (
                SELECT 
                    eri."RELATIVE_NAME" AS Name, gm."NAME" AS Relation, eri."RELATIONSHIP",eri."ID"
                FROM "TBL_JD_EMPLOYEE_RELATIVE_INFO" eri
                JOIN "TBL_GENERIC_MST" gm ON eri."RELATIONSHIP" = gm."ID"
                WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                ),

                Concern AS (
                SELECT 
                    eri."NAME_OF_CONCERN" AS Name, gm."NAME" AS Relation, eri."TYPE_OF_CONCERN",eri."ID"
                FROM "TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS" eri
                JOIN "TBL_GENERIC_MST" gm ON eri."TYPE_OF_CONCERN" = gm."ID"
                WHERE eri."EMPLOYEE_ID" = '${employeeId}' AND eri."IS_ACTIVE" = TRUE
                )

                SELECT
                    EmpDp.Relation,
                    EmpDp.Name,
                    EmpDp.BrokerName,
                    EmpDp.DPAccount,
                    EmpDp.uploadedFile,
                    EmpDp.authorize,
                    EmpDp.isprovide
                FROM EmpDp
                UNION ALL
                SELECT
                    Relatives.Relation,
                    Relatives.Name,                            
                    dp."DP_BROKER_NAME" AS BrokerName,
                    dp."DP_ACCOUNT_NUMBER" AS DPAccount,
                    dp."UPLOAD_PATH" AS uploadedFile,
                    dp."AUTHORIZE_EW" AS authorize,
                    dp."PROVIDE_DEMAT" AS isprovide
                FROM Relatives
                JOIN "TBL_JD_REL_DP" dp ON Relatives."RELATIONSHIP" = dp."RELATIVE_ID" AND Relatives."ID" = dp."REL_INFO_ID"
                WHERE dp."EMPLOYEE_ID" = '${employeeId}' AND dp."IS_ACTIVE" = true AND dp."IS_ACTIVE" = true
                UNION ALL
                SELECT
                    Concern.Relation,
                    Concern.Name,
                    stk_dp."DP_BROKER_NAME" AS BrokerName,
                    stk_dp."DP_ACCOUNT" AS DPAccount,
                    stk_dp."UPLOAD_PATH" AS uploadedFile,
                    stk_dp."AUTHORIZE_EW" AS authorize,
                    stk_dp."PROVIDE_DEMAT" AS isprovide
                FROM Concern
                JOIN "TBL_JD_STK_DP" stk_dp ON Concern."TYPE_OF_CONCERN" = stk_dp."EMPLOYEE_CONCERN_ID" AND Concern."ID" = stk_dp."CONCERN_INFO_ID"
                WHERE stk_dp."EMPLOYEE_ID" = '${employeeId}' AND stk_dp."IS_ACTIVE" = true`;

            const dataRows = await connect.sequelize.query(query);
            const SecHoldData = dataRows[0];

            const phsicalData = await dataaccess.FindAll(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, {
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
            
            const templateContent = fs.readFileSync(path.join(__dirname, '..', '..', 'Template', 'JDholding.ejs'), 'utf8');
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