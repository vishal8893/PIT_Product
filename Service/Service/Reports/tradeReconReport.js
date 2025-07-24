var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const path = require('path')
const fs = require('fs')
const pdfMake = require('pdfmake');
var moment = require('moment');
const { Op, JSON } = require('sequelize');
const nodemailer = require('nodemailer');
const { log } = require('console');
let pgp = require('pg-promise')()
var config = require('../../Config');
const dbPg = pgp(config.Pg_Config)

var routes = function () {

    router.post('/Generatetrdrpt', async (req, res) => {

        try {

            // const dbPg = pgp(config.Pg_Config)

            let reportdata = [];

            // console.log("abc", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        

            const { fromDate, toDate } = encryptmodel;


            if (fromDate && toDate) {

                reportdata = await dbPg.manyOrNone(`select ui."FIRSTNAME",eirf."TradeDate" + interval '1 day' as "TradeDate",eirf."ScripCode",eirf."ScripName",eirf."ISIN",
            eirf."Quantity",eirf."TotalPrice",eirf."Mode",eirf."EirfId",eirf."EirfApprovalDate" + interval '1 day' as "EirfApprovalDate",
            eirf."EirfQuantity",eirf."IntradayVoil",eirf."NoApprovalVoil",eirf."GreaterthanApprovedVoil",
            eirf."LessthanApprovedVoil",eirf."HoldingVoil",eirf."RestrictedListVoil",eirf."GreyListVoil",
            eirf."UcLlistVoil",eirf."NoTraded",eirf."CreatedBy",eirf."CreatedDate" + interval '1 day' as "CreatedDate",eirf."UpdatedBy",eirf."UpdatedDate" + interval '1 day' as "UpdatedDate"
            from "eirf_rico_sos_processed" eirf
            inner join "TBL_USER_MST" ui on ui."EMPNO" = eirf."EmpId"
            where eirf."TradeDate" BETWEEN '${fromDate}' AND '${toDate}'`);

            } else {

                reportdata = await dbPg.manyOrNone(`select ui."FIRSTNAME",eirf."TradeDate" + interval '1 day' as "TradeDate" ,eirf."ScripCode",eirf."ScripName",eirf."ISIN",
            eirf."Quantity",eirf."TotalPrice",eirf."Mode",eirf."EirfId",eirf."EirfApprovalDate" + interval '1 day' as "EirfApprovalDate",
            eirf."EirfQuantity",eirf."IntradayVoil",eirf."NoApprovalVoil",eirf."GreaterthanApprovedVoil",
            eirf."LessthanApprovedVoil",eirf."HoldingVoil",eirf."RestrictedListVoil",eirf."GreyListVoil",
            eirf."UcLlistVoil",eirf."NoTraded",eirf."CreatedBy",eirf."CreatedDate" + interval '1 day' as "CreatedDate",eirf."UpdatedBy",eirf."UpdatedDate" + interval '1 day' as "UpdatedDate"
            from "eirf_rico_sos_processed" eirf
            inner join "TBL_USER_MST" ui on ui."EMPNO" = eirf."EmpId"`);

            }


            var EncryptLoginDetails = dataconn.encryptionAES(reportdata); 
            return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })



        } catch (error) {

            console.error("Error", error)

            return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

        }



    });

    router.post('/GenerateUsertrdrpt', async (req, res) => {

        try {

            // const dbPg = pgp(config.Pg_Config)

            let reportdata = [];

            // console.log("abc", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);  

            const { fromDate, toDate, userid } = encryptmodel;


            if (fromDate && toDate) {

                reportdata = await dbPg.manyOrNone(`select ui."FIRSTNAME",eirf."TradeDate" + interval '1 day' as "TradeDate",eirf."ScripCode",eirf."ScripName",eirf."ISIN",
            eirf."Quantity",eirf."TotalPrice",eirf."Mode",eirf."EirfId",eirf."EirfApprovalDate" + interval '1 day' as "EirfApprovalDate",
            eirf."EirfQuantity",eirf."IntradayVoil",eirf."NoApprovalVoil",eirf."GreaterthanApprovedVoil",
            eirf."LessthanApprovedVoil",eirf."HoldingVoil",eirf."RestrictedListVoil",eirf."GreyListVoil",
            eirf."UcLlistVoil",eirf."NoTraded",eirf."CreatedBy",eirf."CreatedDate" + interval '1 day' as "CreatedDate",eirf."UpdatedBy",eirf."UpdatedDate" + interval '1 day' as "UpdatedDate"
            from "eirf_rico_sos_processed" eirf
            inner join "TBL_USER_MST" ui on ui."EMPNO" = eirf."EmpId"
            where eirf."TradeDate" BETWEEN '${fromDate}' AND '${toDate}'
            AND eirf."EmpId" = '${userid}'`);

            } else {

                reportdata = await dbPg.manyOrNone(`select ui."FIRSTNAME",eirf."TradeDate" + interval '1 day' as "TradeDate" ,eirf."ScripCode",eirf."ScripName",eirf."ISIN",
            eirf."Quantity",eirf."TotalPrice",eirf."Mode",eirf."EirfId",eirf."EirfApprovalDate" + interval '1 day' as "EirfApprovalDate",
            eirf."EirfQuantity",eirf."IntradayVoil",eirf."NoApprovalVoil",eirf."GreaterthanApprovedVoil",
            eirf."LessthanApprovedVoil",eirf."HoldingVoil",eirf."RestrictedListVoil",eirf."GreyListVoil",
            eirf."UcLlistVoil",eirf."NoTraded",eirf."CreatedBy",eirf."CreatedDate" + interval '1 day' as "CreatedDate",eirf."UpdatedBy",eirf."UpdatedDate" + interval '1 day' as "UpdatedDate"
            from "eirf_rico_sos_processed" eirf
            inner join "TBL_USER_MST" ui on ui."EMPNO" = eirf."EmpId"
            where eirf."EmpId" = '${userid}'`);

            }


            var EncryptLoginDetails = dataconn.encryptionAES(reportdata); 
            return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })



        } catch (error) {

            console.error("Error", error)

            return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

        }



    });

    router.post('/GenerateBenposrpt', async (req, res) => {

        try {

            let reportdata = [];

            // console.log("abc", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 

            const { fromDate, toDate } = encryptmodel;

            if (fromDate && toDate) {

                reportdata = await dbPg.query('SELECT * FROM benpos_report($1::date, $2::date)', [fromDate, toDate]);

                var EncryptLoginDetails = dataconn.encryptionAES(reportdata); 

                return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })

            } else {

                return res.status(200).send({ Success: false, message: "Report Data not exists.", data: null })

            }



        } catch (error) {

            console.error("Error", error)
            
            return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

        }



    });

    router.post('/GenerateUsrBenposrpt', async (req, res) => {

        try {

            let reportdata = [];

            // console.log("abc", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const { fromDate, toDate, userid } = encryptmodel;

            if (fromDate && toDate) {

                reportdata = await dbPg.query('SELECT * FROM benpos_report_for_Emp($1::date, $2::date, $3::character varying)', [fromDate, toDate, userid]);

                var EncryptLoginDetails = dataconn.encryptionAES(reportdata); 
                return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })

            } else {

                return res.status(200).send({ Success: false, message: "Report Data not exists.", data: null })

            }



        } catch (error) {

            console.error("Error", error)

            return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

        }



    });

    return router;
}

module.exports = routes;