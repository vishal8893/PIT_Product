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
const nodemailer = require('nodemailer');
const { log } = require('console');
var config = require('../../Config');

var routes = function () {

    router.route('/GetAllProjectName')
    .post(async function (req, res) {
        var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
        // const query = `SELECT "PROJECT_NAME" FROM "TBL_UPSI_PROJECT_MST" where "IS_ACTIVE"= true order by "ID" desc`;
        let query = ` SELECT "PROJECT_NAME","ID" FROM "TBL_UPSI_PROJECT_MST"
         WHERE lower("PROJECT_NAME")  LIKE lower('%${encryptmodel.PROJECT_NAME}%') and "IS_ACTIVE" = true;`

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
                dataconn.errorlogger('createUPSIProjectmstService', 'GetAllProjectName', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of UPSI Project', Data: null });
            });
    });

    router.route('/GenerateNWILReport')
    .post(async function (req, res) {
        var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
        // const query = `SELECT "PROJECT_NAME" FROM "TBL_UPSI_PROJECT_MST" where "IS_ACTIVE"= true order by "ID" desc`;
        let query = `WITH CombinedData AS (
            SELECT PM."PROJECT_NAME", PS."SCRIPT_NAME", PS."ISIN", UED."EMPNO", UED."IS_CHANGE" 
            FROM "TBL_UPSI_PROJECT_MST" PM 
            LEFT JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" PS 
            ON PS."PROJECT_ID" = PM."ID" AND PS."IS_ACTIVE" = true
            LEFT JOIN "TBL_UPSI_EMPLOYEE_DETAILS" UED 
            ON UED."PROJECT_ID" = PM."ID" AND UED."IS_ACTIVE" = true
            WHERE PM."IS_ACTIVE" = true AND PM."ID" = '${encryptmodel.ID}'
        
            UNION
        
            SELECT PM."PROJECT_NAME", PS."SCRIPT_NAME", PS."ISIN", UED."EMPLOYEE_ID" AS "EMPNO", UED."IS_CHANGE" 
            FROM "TBL_UPSI_PROJECT_MST" PM 
            LEFT JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" PS 
            ON PS."PROJECT_ID" = PM."ID" AND PS."IS_ACTIVE" = true
            LEFT JOIN "TBL_PROJECT_EMPLOYEE_DETAILS" UED 
            ON UED."PROJECT_ID" = PM."ID" AND UED."IS_ACTIVE" = true
            WHERE PM."IS_ACTIVE" = true AND PM."ID" = '${encryptmodel.ID}'
        
            UNION
        
            SELECT PM."PROJECT_NAME", PS."SCRIPT_NAME", PS."ISIN", UPE."EMPLOYEE_ID" AS "EMPNO", UPE."IS_CHANGE" 
            FROM "TBL_UPSI_PROJECT_MST" PM 
            LEFT JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" PS 
            ON PS."PROJECT_ID" = PM."ID" AND PS."IS_ACTIVE" = true
            LEFT JOIN "TBL_UPSI_PROJECT_USER_CATEGORIZATION" UED 
            ON UED."PROJECT_ID" = PM."ID" AND UED."IS_ACTIVE" = true
            LEFT JOIN "TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA" UPE 
            ON UPE."PROJECT_ID" = PM."ID" AND UPE."IS_ACTIVE" = true AND UPE."UPSI_USER_CAT_ID" = UED."ID"
            WHERE PM."IS_ACTIVE" = true AND PM."ID" = '${encryptmodel.ID}'

            UNION
        
            SELECT PM."PROJECT_NAME", PS."SCRIPT_NAME", PS."ISIN", UM."EMPNO", 'Block' AS "IS_CHANGE" 
            FROM "TBL_UPSI_PROJECT_MST" PM 
            LEFT JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" PS 
            ON PS."PROJECT_ID" = PM."ID" AND PS."IS_ACTIVE" = true 
	        LEFT JOIN "TBL_USER_MST" UM ON UM."EMPNO" = PM."CREATED_BY"
            WHERE PM."IS_ACTIVE" = true AND PM."ID" = '${encryptmodel.ID}'
	
	        UNION
        
            SELECT PM."PROJECT_NAME", PS."SCRIPT_NAME", PS."ISIN", SPLIT_PART(PM."PROJECT_HEAD", '-', 2) AS "EMPNO", 'Block' AS "IS_CHANGE" 
            FROM "TBL_UPSI_PROJECT_MST" PM 
            LEFT JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" PS 
            ON PS."PROJECT_ID" = PM."ID" AND PS."IS_ACTIVE" = true 
	        LEFT JOIN "TBL_USER_MST" UM ON UM."EMPNO" = SPLIT_PART(PM."PROJECT_HEAD", '-', 2)
            WHERE PM."IS_ACTIVE" = true AND PM."ID" = '${encryptmodel.ID}'
        )
        SELECT DISTINCT "PROJECT_NAME", "SCRIPT_NAME", "ISIN", "EMPNO", "IS_CHANGE"
        FROM CombinedData;`

        connect.sequelize.query(query)
            .then(function (result) {
                if (result && result[0]) {
                    const data = result[0];
                    console.log('123',data)
                    var EncryptLoginDetails = dataconn.encryptionAES(data);
                    res.status(200).json({ Success: true, Message: 'UPSI Project Data Access', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access UPSI Project', Data: null });
                }
            })
            .catch(function (err) {
                dataconn.errorlogger('createUPSIProjectmstService', 'GenerateNWILReport', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of UPSI Project', Data: null });
            });
    });


    return router;
}

module.exports = routes;