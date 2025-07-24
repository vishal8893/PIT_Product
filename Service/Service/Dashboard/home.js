var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const path = require('path')
const fs = require('fs')
const pdfMake = require('pdfmake');
var moment = require('moment');
const { Op, JSON } = require('sequelize');
// const { Op } = connect.Sequelize;
const nodemailer = require('nodemailer');
const { log } = require('console');
let pgp = require('pg-promise')()
var config = require('../../Config');
const { name } = require('ejs');
const configFile = require('../../Config');


var routes = function () {
    router.route('/Getirfdata')
        .get(function (req, res) {

            const currentDate = new Date();

            // Function to zero-fill a number (e.g., 1 => '01', 9 => '09')
            const zeroFill = (number) => (number < 10 ? '0' : '') + number;

            // Get the components of the date
            const year = currentDate.getUTCFullYear();
            const month = zeroFill(currentDate.getUTCMonth() + 1); // Months are 0-indexed
            const day = zeroFill(currentDate.getUTCDate());

            // Create the formatted date string with time set to '00:00:00+00'
            const formattedDate = `${year}-${month}-${day} 00:00:00+00`;

            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var param = {
                where: { CREATED_ON: formattedDate },

            };

            dataaccess.FindAll(TBL_IRF_Approval_Data, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_IRF_Approval_Data List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_IRF_Approval_Data List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'Getirfdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_IRF_Approval_Data', Data: null });
                });
        });

    router.route('/GetirfdataUSER/:emp')
        .get(function (req, res) {

            const currentDate = new Date();

            // Function to zero-fill a number (e.g., 1 => '01', 9 => '09')
            const zeroFill = (number) => (number < 10 ? '0' : '') + number;

            // Get the components of the date
            const year = currentDate.getUTCFullYear();
            const month = zeroFill(currentDate.getUTCMonth() + 1); // Months are 0-indexed
            const day = zeroFill(currentDate.getUTCDate());

            // Create the formatted date string with time set to '00:00:00+00'
            const formattedDate = `${year}-${month}-${day} 00:00:00+00`;

            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var param = {
                where: { CREATED_ON: formattedDate , EmployeeNumber: req.params.emp},

            };

            dataaccess.FindAll(TBL_IRF_Approval_Data, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_IRF_Approval_Data List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_IRF_Approval_Data List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'Getirfdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_IRF_Approval_Data', Data: null });
                });
        });

    router.route('/Getholdingdata/:emp')
        .get(async function (req, res) {
            // let quiry = `select * from "TBL_DP_HOLDING_DATA" where "EMPID" = '${req.params.emp}';`
            let quiry = `select dp.*,sc."SCRIP_DESC" from "TBL_DP_HOLDING_DATA" dp
            inner join "TBL_SCRIPT_MST" sc ON dp."ISIN_CODE" = sc."ISIN_CODE"
            where dp."EMPID" = '${req.params.emp}'`;
            let result = await connect.sequelize.query(quiry);
            if (result) {
                var EncryptLoginDetails = dataconn.encryptionAES(result[0]); 
                res.status(200).json({ Success: true, Message: 'EirfMailDisclosure List Table Access', Data: EncryptLoginDetails });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User Has No Access Of EirfMailDisclosure', Data: null });
            }

        });

    router.route('/Violationdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            let quiry = `select * from public."eirf_rico_sos_processed" where ("IntradayVoil"  is not null
            or "NoApprovalVoil" is not null  or "GreaterthanApprovedVoil" is not null or "LessthanApprovedVoil" is not null or "HoldingVoil" is not null or "RestrictedListVoil" is not null or
            "GreyListVoil" is not null or "UcLlistVoil" is not null 												 
                                                                 ) and  "EmpId"='${encryptmodel.Id}'  AND "CreatedDate" >= CURRENT_DATE - INTERVAL '7 days'  order by "TransId" `
            let result = await connect.sequelize.query(quiry);
            if (result[0].length > 0) {
                let Array = result[0]
                Array.map((i, indexOf) => {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    var param = {
                        where: {
                            VoilationId: parseInt(i.TransId)


                        }

                    };

                    dataaccess.FindAll(TBL_ViolationRemarksDetails, param)
                        .then(function (result) {
                            if (result != null && result.length > 0) {
                                console.log("resultnow", result);

                                i.Status = 'Clarification Provided';


                            }
                            else {
                                i.Status = 'Clarification Not Provided'

                            }
                            if (Array.length == indexOf + 1) {
                                var EncryptLoginDetails = dataconn.encryptionAES(Array); 

                                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                            }
                        });



                })

            }
            else {
                // res.status(200).json({ Success: false, Message: 'User Has No Access Of Violationdata', Data: null });
                let quiry = `select * from public."eirf_rico_sos_processed" where ("IntradayVoil"  is not null
                or "NoApprovalVoil" is not null  or "GreaterthanApprovedVoil" is not null or "LessthanApprovedVoil" is not null or "HoldingVoil" is not null or "RestrictedListVoil" is not null or
                "GreyListVoil" is not null or "UcLlistVoil" is not null 												 
                                                                     ) and  "EmpId"='${encryptmodel.Id}'  AND "CreatedDate" >= (SELECT MAX("CreatedDate") FROM public."eirf_rico_sos_processed") - INTERVAL '7 days'  order by "TransId";`;
                let result = await connect.sequelize.query(quiry);
                let Array = result[0]
                Array.map((i, indexOf) => {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    var param = {
                        where: {
                            VoilationId: parseInt(i.TransId)


                        }

                    };

                    dataaccess.FindAll(TBL_ViolationRemarksDetails, param)
                        .then(function (result) {
                            if (result != null && result.length > 0) {
                                console.log("resultnow", result);

                                i.Status = 'Clarification Provided';


                            }
                            else {
                                i.Status = 'Clarification Not Provided'

                            }
                            if (Array.length == indexOf + 1) {
                                var EncryptLoginDetails = dataconn.encryptionAES(Array); 
                                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                            }
                        });



                })
            }
        });

    router.route('/Violationremarks')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            var values = {
                VoilationId: encryptmodel.VoilationId,
                Remarks: encryptmodel.Remarks,
                IS_ACTIVE: true,
                CREATED_BY: encryptmodel.UserId,
                CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_ViolationRemarksDetails, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'Violationremarks saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('HomeService', 'Violationremarks', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/getallSCOIData')
        .get(function (req, res) {

            const TBL_SCOI_EMAIL_SEND_STATUS = datamodel.TBL_SCOI_EMAIL_SEND_STATUS();
            var param = {
                where: { EMAIL_TYPE: 'Intimation', IS_ACTIVE: true },

            };

            dataaccess.FindAll(TBL_SCOI_EMAIL_SEND_STATUS, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SCOI_EMAIL_SEND_STATUS List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCOI_EMAIL_SEND_STATUS List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'getallSCOIData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCOI_EMAIL_SEND_STATUS', Data: null });
                });
        });

    router.route('/getActiveSCOIData')
        .get(function (req, res) {

            const TBL_SCOI_ACCEPT_LOG = datamodel.TBL_SCOI_ACCEPT_LOG();
            var param = {
                where: { IS_ACCEPT: true },

            };

            dataaccess.FindAll(TBL_SCOI_ACCEPT_LOG, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SCOI_ACCEPT_LOG List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCOI_ACCEPT_LOG List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'getActiveSCOIData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCOI_ACCEPT_LOG', Data: null });
                });
        });

    router.route('/getActiveEAHData')
        .get(function (req, res) {

            const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
            var param = {
                where: { IS_ACTIVE: true, STEP_ID: 7 },

            };

            dataaccess.FindAll(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'getActiveEAHData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO', Data: null });
                });
        });

    router.route('/getAllEAHData')
        .get(function (req, res) {

            const TRD_Email_Status = datamodel.TRD_Email_Status();
            var param = {
                where: { EmailStatus: 'Success' },

            };

            dataaccess.FindAll(TRD_Email_Status, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TRD_Email_Status List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TRD_Email_Status List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'getAllEAHData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TRD_Email_Status', Data: null });
                });
        });

    router.route('/getActivePCOIData')
        .get(async function (req, res) {
            const query = `SELECT "QuarterId" FROM "TBL_QuarterMaster" where "CurrentActive"= true`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            const quarterid = result[0][0].QuarterId;
            console.log("quarterid", quarterid);


            const query1 = `(SELECT DISTINCT ON ("EmpId") * FROM "TBL_PCOIDetails" WHERE "QuarterId" = '${quarterid}' AND "IS_ACTIVE" = true ORDER BY "EmpId")`;
            const result1 = await connect.sequelize.query(query1);
            console.log("result1", result1);
            var EncryptLoginDetails = dataconn.encryptionAES(result1[0]);
            res.status(200).json({ Success: true, Message: 'TBL_PCOIDetails List Table Access', Data: EncryptLoginDetails });
        });

    router.route('/getAllPCOIData')
        .get(async function (req, res) {

            const query = `SELECT "QuarterId" FROM "TBL_QuarterMaster" where "CurrentActive"= true`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            const quarterid = result[0][0].QuarterId;
            console.log("quarterid", quarterid);

            const TBL_PCOI_MAIL_SEND_LOG = datamodel.TBL_PCOI_MAIL_SEND_LOG();
            var param = {
                where: { EMAIL_STATUS: 'Success', QUARTER_ID: quarterid },

            };

            dataaccess.FindAll(TBL_PCOI_MAIL_SEND_LOG, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_PCOI_MAIL_SEND_LOG List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PCOI_MAIL_SEND_LOG List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'getAllEAHData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PCOI_MAIL_SEND_LOG', Data: null });
                });
        });

    router.route('/displayActiveEAHData')
        .get(async function (req, res) {

            const query = `SELECT 
            eah.*,
            um."EMPNO",
            um."FIRSTNAME",
            um."LASTNAME"
        FROM 
            "TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO" eah
        JOIN 
            "TBL_USER_MST" um ON eah."EMPLOYEE_ID" = um."EMPNO"
        WHERE 
            eah."IS_ACTIVE" = true
            AND eah."STEP_ID" = 7;`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data); 

                res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/displayAllEAHData')
        .get(async function (req, res) {

            const query = `SELECT 
            eah.*,
            um."EMPNO",
            um."FIRSTNAME",
            um."LASTNAME"
        FROM 
            "TRD_Email_Status" eah
        JOIN 
            "TBL_USER_MST" um ON eah."EmpId" = um."EMPNO"
        WHERE 
            eah."EmailStatus" = 'Success';`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data); 

                res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/displayActivePCOIData')
        .get(async function (req, res) {

            const query1 = `SELECT "QuarterId" FROM "TBL_QuarterMaster" where "CurrentActive"= true`;
            const result1 = await connect.sequelize.query(query1);
            console.log("result1", result1);
            const quarterid = result1[0][0].QuarterId;
            console.log("quarterid", quarterid);

            const query = `SELECT 
            pco.*, 
            usr."EMPNO",usr."FIRSTNAME",usr."LASTNAME"
        FROM 
            (
                SELECT DISTINCT ON ("EmpId") * 
                FROM "TBL_PCOIDetails" 
                WHERE "QuarterId" = '${quarterid}' AND "IS_ACTIVE" = true 
                ORDER BY "EmpId"
            ) pco
        JOIN 
            "TBL_USER_MST" usr ON pco."EmpId" = usr."EMPNO";`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data); 

                res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/displayAllPCOIData')
        .get(async function (req, res) {

            const query1 = `SELECT "QuarterId" FROM "TBL_QuarterMaster" where "CurrentActive"= true`;
            const result1 = await connect.sequelize.query(query1);
            console.log("result1", result1);
            const quarterid = result1[0][0].QuarterId;
            console.log("quarterid", quarterid);

            const query = `SELECT 
            eah.*,
            um."EMPNO",
            um."FIRSTNAME",
            um."LASTNAME"
        FROM 
            "TBL_PCOI_MAIL_SEND_LOG" eah
        JOIN 
            "TBL_USER_MST" um ON eah."EMPLOYEE_ID" = um."EMPNO"
        WHERE 
            eah."EMAIL_STATUS" = 'Success' AND eah."QUARTER_ID" = '${quarterid}';`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data); 

                res.status(200).json({ Success: true, Message: 'TBL_PCOI_MAIL_SEND_LOG List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/displayActiveSCOIData')
        .get(async function (req, res) {

            const query = `SELECT 
            eah.*,
            um."EMPNO",
            um."FIRSTNAME",
            um."LASTNAME"
        FROM 
            "TBL_SCOI_ACCEPT_LOG" eah
        JOIN 
            "TBL_USER_MST" um ON eah."EMPLOYEE_ID" = um."EMPNO"
        WHERE 
            eah."IS_ACCEPT" = true;`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data);

                res.status(200).json({ Success: true, Message: 'TBL_SCOI_ACCEPT_LOG List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/displayAllSCOIData')
        .get(async function (req, res) {

            const query = `SELECT 
            eah.*,
            um."EMPNO",
            um."FIRSTNAME",
            um."LASTNAME"
        FROM 
            "TBL_SCOI_EMAIL_SEND_STATUS" eah
        JOIN 
            "TBL_USER_MST" um ON eah."EMPNO" = um."EMPNO"
        WHERE 
            eah."EMAIL_TYPE" = 'Intimation' AND eah."IS_ACTIVE" = true;`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data);

                res.status(200).json({ Success: true, Message: 'TBL_SCOI_EMAIL_SEND_STATUS List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/getHolidayData')
        .get(async function (req, res) {

            // const TBL_Holiday_Master = datamodel.TBL_Holiday_Master();

            // Get the current year
            const currentYear = new Date().getFullYear();
            console.log("currentYear", currentYear);




            const query = `SELECT "DATE","DAY","IS_ACTIVE"
                        FROM "TBL_Holiday_Master" 
                      WHERE EXTRACT(year FROM "DATE") = '${currentYear}';`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                var EncryptLoginDetails = dataconn.encryptionAES(data);

                res.status(200).json({ Success: true, Message: 'TBL_Holiday_Master List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
        });

    router.route('/Violationdata1')
        .get(async function (req, res) {
            // let quiry = `
            // SELECT *
            //     FROM public."eirf_rico_sos_processed"
            // WHERE("IntradayVoil" IS NOT NULL
            // OR "NoApprovalVoil" IS NOT NULL 
            // OR "GreaterthanApprovedVoil" IS NOT NULL 
            // OR "LessthanApprovedVoil" IS NOT NULL 
            // OR "HoldingVoil" IS NOT NULL 
            // OR "RestrictedListVoil" IS NOT NULL 
            // OR "GreyListVoil" IS NOT NULL 
            // OR "UcLlistVoil" IS NOT NULL) 
            // ORDER BY "EmpId", "TransId"; `
            // let quiry=`SELECT *
            // FROM public."eirf_rico_sos_processed"
            // WHERE ("IntradayVoil" IS NOT NULL
            //        OR "NoApprovalVoil" IS NOT NULL 
            //        OR "GreaterthanApprovedVoil" IS NOT NULL 
            //        OR "LessthanApprovedVoil" IS NOT NULL 
            //        OR "HoldingVoil" IS NOT NULL 
            //        OR "RestrictedListVoil" IS NOT NULL 
            //        OR "GreyListVoil" IS NOT NULL 
            //        OR "UcLlistVoil" IS NOT NULL)             
            // ORDER BY "TradeDate", "TransId";`;
            // AND "CreatedDate" >= CURRENT_DATE - INTERVAL '1 day'  -- yesterday's date
            // AND "CreatedDate" < CURRENT_DATE + INTERVAL '1 day'  -- today's date

            let quiry = `SELECT erp.*, um."FIRSTNAME"
            FROM public."eirf_rico_sos_processed" erp
            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            WHERE (erp."IntradayVoil" IS NOT NULL
                   OR erp."NoApprovalVoil" IS NOT NULL 
                   OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                   OR erp."LessthanApprovedVoil" IS NOT NULL 
                   OR erp."HoldingVoil" IS NOT NULL 
                   OR erp."RestrictedListVoil" IS NOT NULL 
                   OR erp."GreyListVoil" IS NOT NULL 
                   OR erp."UcLlistVoil" IS NOT NULL)
            AND "CreatedDate" >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            // if (result) {
            //     let Array = result[0]
            //     Array.map((i, indexOf) => {
            //         const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            //         var param = {
            //             where: {
            //                 VoilationId: parseInt(i.TransId)


            //             }

            //         };

            //         dataaccess.FindAll(TBL_ViolationRemarksDetails, param)
            //             .then(async function (result) {
            //                 if (result != null && result.length > 0) {
            //                     console.log("now", result);                                
            //                     i.Status = 'Clarification Provided';
            //                     i.remarkCreatedBy = result[0].CREATED_BY;
            //                     // i.remarkroleby = await getRoleName(result[0].CREATED_BY);

            //                 }
            //                 else {
            //                     i.Status = 'Clarification Not Provided'

            //                 }
            //                 if (Array.length == indexOf + 1) {

            //                     res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: Array });
            //                 }
            //             });



            //     })

            // }
            // else {
            //     res.status(200).json({ Success: false, Message: 'User Has No Access Of Violationdata', Data: null });
            // }
            if (result[0].length > 0) {
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE(
                                (erp."IntradayVoil" IS NOT NULL
                                OR erp."NoApprovalVoil" IS NOT NULL 
                                OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                                OR erp."LessthanApprovedVoil" IS NOT NULL 
                                OR erp."HoldingVoil" IS NOT NULL 
                                OR erp."RestrictedListVoil" IS NOT NULL 
                                OR erp."GreyListVoil" IS NOT NULL 
                                OR erp."UcLlistVoil" IS NOT NULL)
                                AND "CreatedDate" >= (SELECT MAX("CreatedDate") FROM public."eirf_rico_sos_processed") - INTERVAL '7 days'
                            )
                            ORDER BY erp."TradeDate", erp."TransId";`;
                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            }

        });

    router.route('/GetAllProjectDetails')
        .get(async function (req, res) {
            const query = `SELECT p.*
                            FROM 
                            "TBL_UPSI_PROJECT_MST" p
                            WHERE p."IS_ACTIVE" = true`;

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

    router.route('/GetAllexpirymstDetails')
        .get(async function (req, res) {
            const query = `SELECT *
                            FROM 
                            "TBL_EXPIRY_DATE_MST" where "IS_ACTIVE" = true
                            ORDER BY "ID" DESC `;

            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) {
                        const data = result[0];
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'Expiry Mst Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Expiry Mst Data', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllexpirymstDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Expiry Mst Data', Data: null });
                });
        });

    router.route('/savehelpdeskdata')
        .post(function (req, res) {
            const TBL_HELP_DESK_DATA = datamodel.TBL_HELP_DESK_DATA();

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            if (req.body.requestType === "Other") {
                var values = {
                    TYPE: encryptmodel.selectedVoilation,
                    QUERY: encryptmodel.query,
                    EMPNO: encryptmodel.userNO,
                    EMPLOYEE_ID: encryptmodel.userId,
                    NAME: encryptmodel.name,
                    REQUEST_TYPE: encryptmodel.other,
                    IS_ACTIVE: true,
                    CREATED_BY: encryptmodel.userNO,
                };

                dataaccess.Create(TBL_HELP_DESK_DATA, values)
                    .then(async function (result) {
                        if (result != null) {
                            await sendsupportMail(encryptmodel.query, encryptmodel.name, encryptmodel.other,encryptmodel.userNO);

                            var EncryptLoginDetails = dataconn.encryptionAES(result); 
                            res.status(200).json({ Success: true, Message: 'helpdeskdata saved successfully', Data: EncryptLoginDetails });
                        }
                        else {

                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }, function (err) {
                        dataconn.errorlogger('HomeService', 'savehelpdeskdata', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });

            } else {
                var values = {
                    TYPE: encryptmodel.selectedVoilation,
                    QUERY: encryptmodel.query,
                    EMPNO: encryptmodel.userNO,
                    EMPLOYEE_ID: encryptmodel.userId,
                    NAME: encryptmodel.name,
                    REQUEST_TYPE: encryptmodel.requestType,
                    IS_ACTIVE: true,
                    CREATED_BY: encryptmodel.userNO,
                };

                dataaccess.Create(TBL_HELP_DESK_DATA, values)
                    .then(async function (result) {
                        if (result != null) {
                            await sendsupportMail(encryptmodel.query, encryptmodel.name, encryptmodel.requestType,encryptmodel.userNO);
                            var EncryptLoginDetails = dataconn.encryptionAES(result); 
                            res.status(200).json({ Success: true, Message: 'helpdeskdata saved successfully', Data: EncryptLoginDetails });
                        }
                        else {

                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    }, function (err) {
                        dataconn.errorlogger('HomeService', 'savehelpdeskdata', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });
            }
        });

    async function getRoleName(createdBy) {
        let name = '';

        try {
            const query = `SELECT "TBL_ROLE_MST"."NAME"
                               FROM "TBL_USER_MST"
                               INNER JOIN "TBL_ROLE_MST" ON "TBL_USER_MST"."DEFAULTROLEID" = "TBL_ROLE_MST"."ID"
                               WHERE "TBL_USER_MST"."ID" = '${createdBy}'`;

            const resultquery = await connect.sequelize.query(query);
            name = resultquery[0][0].NAME;
        } catch (error) {
            console.error("Error occurred while executing the query:", error);
            name = '';
        }

        return name;
    }

    async function sendsupportMail(query, empno, request,id) {
        try {
            const email = await connect.sequelize.query(`SELECT "EMAILID" FROM "TBL_USER_MST" WHERE "EMPNO" = '${id}'`);
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
                             ${empno} raise a request for ${request} and raise a query is:                            
                            </td>
                            </tr>  
                            <tr>
                            <td style=''font: 15px Calibri, arial;''>                                
                            ${query}
                            </td>
                            </tr>
                            </table>                                    
                          </body>
                         </html>`;

            const errorOptions = {
                from: 'newel.technical@gmail.com',
                // to: 'rinkal@neweltechnologies.com',
                to: email[0][0].EMAILID,
                cc: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com',
                subject: 'Technical/Functional Support',
                html: errorBody,
            };

            // Send the error notification email
            const info = await transporter.sendMail(errorOptions);
            console.log('Error notification sent:', info.response);
        } catch (notificationError) {
            console.error('Error sending error notification:', notificationError);
        }
    }

    router.route('/userRequestData/:EmpNo')
        .get(function (req, res) {

            const TBL_HELP_DESK_DATA = datamodel.TBL_HELP_DESK_DATA();
            var param = {
                where: { EMPNO: req.params.EmpNo },

            };

            dataaccess.FindAll(TBL_HELP_DESK_DATA, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HELP_DESK_DATA List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HELP_DESK_DATA List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('homeservice', 'userRequestData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HELP_DESK_DATA', Data: null });
                });
        });

    router.route('/complianceRequestData')
        .get(async function (req, res) {

            const query = `SELECT * FROM "TBL_HELP_DESK_DATA" ORDER BY "ID" DESC ;`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                console.log("data", data);
                var EncryptLoginDetails = dataconn.encryptionAES(data);

                res.status(200).json({ Success: true, Message: 'TBL_HELP_DESK_DATA List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/updatehelpdeskdata')
        .post(function (req, res) {
            const TBL_HELP_DESK_DATA = datamodel.TBL_HELP_DESK_DATA();
            const TBL_HELP_DESK_QUERY_DATA = datamodel.TBL_HELP_DESK_QUERY_DATA();

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var values = {
                STATUS: encryptmodel.status,
                MODIFIED_BY: encryptmodel.empid,
            };
            var param = {
                ID: encryptmodel.id,
            };

            var values1 = {
                CREATED_BY: encryptmodel.empid,
                QUERY: encryptmodel.query1,
                NAME: encryptmodel.name,
                TBL_HELP_DESK_DATA_ID: encryptmodel.id,
            };

            dataaccess.Update(TBL_HELP_DESK_DATA, values, param)
                .then(async function (result) {
                    if (result != null) {
                       const qu=  `SELECT "REQUEST_TYPE","CREATED_BY" FROM "TBL_HELP_DESK_DATA" WHERE "ID" = '${encryptmodel.id}';`;
                        const type1 = await connect.sequelize.query(qu);
                        const type = type1[0][0].REQUEST_TYPE;
                        const eids = type1[0][0].CREATED_BY;
                        console.log("typee",type);
                        dataaccess.Create(TBL_HELP_DESK_QUERY_DATA, values1)
                            .then(async function (result) {
                                if (result != null) {
                                    await sendsupportMail(encryptmodel.query1, encryptmodel.name, type,eids);
                                    var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                    res.status(200).json({ Success: true, Message: 'helpdeskdata updated successfully', Data: EncryptLoginDetails });
                                }
                                else {

                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            }, function (err) {
                                dataconn.errorlogger('HomeService', 'updatehelpdeskdata', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                            });
                        // res.status(200).json({ Success: true, Message: 'helpdeskdata updated successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('HomeService', 'updatehelpdeskdata', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/getQueryDataBYID/:queryid')
        .get(async function (req, res) {
            console.log("queryid", req.params.queryid);

            const query = `SELECT * FROM "TBL_HELP_DESK_QUERY_DATA" WHERE "TBL_HELP_DESK_DATA_ID" = '${req.params.queryid}' ORDER BY 1 DESC ;`;
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                console.log("data", data);
                var EncryptLoginDetails = dataconn.encryptionAES(data); 

                res.status(200).json({ Success: true, Message: 'TBL_HELP_DESK_DATA List Table Access', Data: EncryptLoginDetails });
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/getViolationstatusDataBYID/:SId')
        .get(async function (req, res) {
            console.log("queryid", req.params.queryid);

            // const query = `SELECT * FROM "TBL_ViolationRemarksDetails" WHERE "VoilationId" = '${req.params.SId}' ORDER BY 1 DESC ;`;
            const query = ` SELECT V.*,U."FIRSTNAME" FROM "TBL_ViolationRemarksDetails" V 
                            LEFT JOIN "TBL_USER_MST" U
                            ON V."CREATED_BY" = U."EMPNO"
                            WHERE V."VoilationId" = '${req.params.SId}' 
                            ORDER BY 1 DESC ;`
            const result = await connect.sequelize.query(query);
            console.log("result", result);
            try {
                const result = await connect.sequelize.query(query);
                console.log("result", result);

                const data = result[0]; // Assuming the actual data is in result[0]
                console.log("data", data);
                var EncryptLoginDetails = dataconn.encryptionAES(data);

                res.status(200).json({ Success: true, Message: 'TBL_ViolationRemarksDetails List Table Access', Data: EncryptLoginDetails});
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ Success: false, Message: 'Error fetching data', Data: null });
            }
            // res.status(200).json({ Success: true, Message: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO List Table Access', Data: result });

        });

    router.route('/getstatusforclsr')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            // console.log("log",encryptmodel);

            let quiry = `SELECT 
            TO_CHAR((USR."EMPJOINDATE" + INTERVAL '30 days')::DATE, 'DD-MM-YYYY') AS joindate,
            COALESCE(JD."SUBMITTED", null) AS jdsubmit,
            COALESCE(EAH."SUBMITTED", null) AS eahsubmit,
            INITCAP(CurrentQuat."QuarterName") AS currentquatname,
            INITCAP(PreviousQuat."QuarterName") AS previousquatname,
            CASE WHEN PCOI_Current."EmpId" IS NOT NULL THEN true ELSE false END AS hasDataInCurrentQuarter,
            CASE WHEN PCOI_Previous."EmpId" IS NOT NULL THEN true ELSE false END AS hasDataInPreviousQuarter,
            CASE WHEN EXISTS (
                SELECT 1
                FROM "TBL_SCOI_ACCEPT_LOG" sal
                WHERE sal."EMPLOYEE_ID" = USR."EMPNO" AND sal."IS_ACCEPT" = true
            ) AND EXISTS (
                SELECT 1
                FROM "TBL_SCOI_DATA" s
                WHERE s."EMPLOYEE_ID" = USR."EMPNO" AND s."IS_ACTIVE" = true
            ) THEN true ELSE false END AS hasBothScoiAcceptLogAndData
            
        FROM 
            "TBL_USER_MST" USR
        LEFT JOIN 
            "TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO" JD ON USR."EMPNO" = JD."EMPLOYEE_ID" AND JD."IS_ACTIVE" = true
        LEFT JOIN 
            "TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO" EAH ON USR."EMPNO" = EAH."EMPLOYEE_ID" AND EAH."IS_ACTIVE" = true
        LEFT JOIN 
            "TBL_QuarterMaster" CurrentQuat ON CurrentQuat."CurrentActive" = true
        LEFT JOIN 
            "TBL_QuarterMaster" PreviousQuat ON 
                PreviousQuat."QuarterId" = 
                (
                    SELECT MAX("QuarterId") 
                    FROM "TBL_QuarterMaster" 
                    WHERE "QuarterId" < CurrentQuat."QuarterId"
                )
        LEFT JOIN
            "TBL_PCOIDetails" PCOI_Current ON USR."EMPNO" = PCOI_Current."EmpId" AND CurrentQuat."QuarterId" = PCOI_Current."QuarterId" AND PCOI_Current."IS_ACTIVE" = true
        LEFT JOIN
            "TBL_PCOIDetails" PCOI_Previous ON USR."EMPNO" = PCOI_Previous."EmpId" AND PreviousQuat."QuarterId" = PCOI_Previous."QuarterId" AND PCOI_Previous."IS_ACTIVE" = true
        WHERE 
            USR."ISACTIVE" = true
            AND USR."EMPNO" = '${encryptmodel.employeeid}';`

            // let result = await connect.sequelize.query(quiry);
            connect.sequelize.query(quiry)
                .then(function (result) {
                    if (result && result[0]) {
                        const data = result[0];                        
                        // const jsonData = JSON.stringify(data);                        
                        var EncryptLoginDetails = dataconn.encryptionAES(data); 
                        // console.log("data",EncryptLoginDetails);                       
                        res.status(200).json({ Success: true, Message: 'Status Data get Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'Status Data no available', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('home', 'getstatusforclsr', err);
                    res.status(200).json({ Success: false, Message: 'Status Data no available', Data: null });
                });

        });


    return router;
}

module.exports = routes;