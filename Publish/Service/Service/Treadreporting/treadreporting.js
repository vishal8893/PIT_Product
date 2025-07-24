var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var Connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
var sequelize = connect.Sequelize;
const fs = require('fs')
const path = require("path");
var multer = require("multer");
var upload = multer();
let util = require('util')
var ExcelJS = require('exceljs');
const moment = require('moment');
const XLSX = require('xlsx');

var routes = function () {

    router.route('/GetTradeapproverrecordforsingale')
        .post(async function (req, res) {
            try {
                // Decrypt the request payload


                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                console.log("encryptmodel", encryptmodel);
                // Define the query with proper SQL formatting and parameterization if possible
                let query = `SELECT 
        CASE 
          WHEN A."QuantityLot" = 'Quantity' THEN A."EqQuantity"
          WHEN A."QuantityLot" = 'Lot' THEN A."FutOpQuantityLot"
          ELSE '0'
        END AS "ApprovalQuantity",
        A."QuantityLot",
        A.*,
        B."ACC_NAME",
        B."PANNO",
        C."SYMBOL"
      FROM public."TBL_IRF_Approval_Data" A
      LEFT JOIN public."TBL_RICO_IBEATS_MST" B
        ON A."AccountCode" = B."ACC_CODE"
      LEFT JOIN public."TBL_SCRIPT_MST" C
        ON A."ISIN" = C."ISIN_CODE"
      WHERE A."EmployeeNumber" = '${encryptmodel.EMP}'  and "NatureofTrade"='${encryptmodel.Asset}' and "ApprovalStatus"='Approved'
        AND DATE(A."CREATED_ON") BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
      ORDER BY A."CREATED_ON" DESC;`;

                // Execute the query
                let EAH = await connect.sequelize.query(query);

                // Respond with encrypted data if available
                if (EAH[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(EAH[0]);
                    res.status(200).json({ Success: true, Message: 'GetTradeapproverrecordforsingale', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'No records found', Data: '' });
                }

            } catch (error) {
                console.error('Error in /GetTradeapproverrecordforsingale:', error.message);
                res.status(500).json({ Success: false, Message: 'Internal Server Error', Error: error.message });
            }
        });

    router.route('/IRFDATAsingale')
        .post(async function (req, res) {
            try {


                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                // Define the query with proper SQL formatting and parameterization if possible
                let query = `select * from public."TBL_IRF_Approval_Data" A where "TRX_NO"='${encryptmodel.TRX_NO}' and "ApprovalStatus"='Approved'
                 AND DATE(A."CREATED_ON") BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
                 ORDER BY A."CREATED_ON" DESC;`;

                // Execute the query
                let EAH = await connect.sequelize.query(query);

                // Respond with encrypted data if available
                if (EAH[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(EAH[0]);
                    res.status(200).json({ Success: true, Message: 'IRFDATAsingale', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'No records found', Data: '' });
                }

            } catch (error) {
                console.error('Error in /IRFDATAsingale:', error.message);
                res.status(500).json({ Success: false, Message: 'Internal Server Error', Error: error.message });
            }
        });


    // router.route('/Singacreatetreade')
    //     .post(function (req, res) {
    //         // console.log('busineheadsave',req.body);
    //         var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
    //         const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();
    //         const values = {
    //             EmpId: encryptmodel.EMP,
    //             PanNo: encryptmodel.PanNo,
    //             TradeDate: encryptmodel.TradeDate,
    //             Exch: encryptmodel.Exch,
    //             AccCode: encryptmodel.AccountCode,
    //             AccName: encryptmodel.AccountName,
    //             ScripCode: encryptmodel.ScripCode,
    //             ScripName: encryptmodel.ScripName,
    //             Quantity: encryptmodel.Quantity,
    //             TotalPrice: encryptmodel.TotalPrice,
    //             Mode: encryptmodel.Mode,
    //             ISIN: encryptmodel.ISIN,
    //             OpenQuantity: encryptmodel.OpenQuantity,
    //             TradedBy: encryptmodel.TradeBy,
    //             StrikePrice: encryptmodel.StrikePrice,
    //             ExpiryDate: encryptmodel.ExpiryDate,
    //             OptionType: encryptmodel.OptionType,
    //             CreatedBy: encryptmodel.EMP
    //             // CreatedDate: sequelize.NOW
    //         };
    //         console.log("busineheadvalues", values);
    //         dataaccess.Create(eirf_rico_sos_emp_mapping, values)
    //             .then(async function (result) {
    //                 console.log("resultbusiness", result);
    //                 if (result != null) {
    //                     if (encryptmodel.Mode == 'SELL') {
    //                         const updateQuery = `
    //                        UPDATE public."TBL_DP_HOLDING_DATA"
    //                       SET  
    //                       "TradeAvailableQty" = '${encryptmodel.Pendingqty}', 
    //                       "MODIFIED_BY" = '${encryptmodel.EMP}'
    //                       WHERE "EMPID" = '${encryptmodel.EMP}' 
    //                       AND "ISIN_CODE" = '${encryptmodel.ISIN}'`;

    //                         await connect.sequelize.query(updateQuery);
    //                     }
    //                     var EncryptLoginDetails = dataconn.encryptionAES(result);
    //                     res.status(200).json({ Success: true, Message: 'Data saved successfully', Data: EncryptLoginDetails });

    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('treadreportingservice', 'Singacreatetreade', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             });
    //     });

    router.route('/Singacreatetreade')
        .post(async function (req, res) {
            try {
                // ✅ Decrypt request body
                const encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();

                // ✅ Prepare values for insertion
                const values = {
                    EmpId: encryptmodel.EMP,
                    PanNo: encryptmodel.PanNo,
                    TradeDate: encryptmodel.TradeDate,
                    Exch: encryptmodel.Exch,
                    AccCode: encryptmodel.AccountCode,
                    AccName: encryptmodel.AccountName,
                    ScripCode: encryptmodel.ScripCode,
                    ScripName: encryptmodel.ScripName,
                    Quantity: encryptmodel.Quantity,
                    TotalPrice: encryptmodel.TotalPrice,
                    Mode: encryptmodel.Mode,
                    ISIN: encryptmodel.ISIN,
                    OpenQuantity: encryptmodel.OpenQuantity,
                    TradedBy: encryptmodel.TradeBy,
                    StrikePrice: encryptmodel.StrikePrice,
                    ExpiryDate: encryptmodel.ExpiryDate,
                    OptionType: encryptmodel.OptionType,
                    CreatedBy: encryptmodel.EMP
                };

                console.log("Insert Values:", values);

                // ✅ Insert into DB
                const result = await dataaccess.Create(eirf_rico_sos_emp_mapping, values);

                if (result) {
                    // ✅ If Mode is SELL → Update TradeAvailableQty
                    if (encryptmodel.Mode === 'SELL') {
                        const updateQuery = `
            UPDATE public."TBL_DP_HOLDING_DATA"
            SET 
              "TradeAvailableQty" = :pendingQty,
              "MODIFIED_BY" = :empId
            WHERE "EMPID" = :empId AND "ISIN_CODE" = :isin
          `;

                        await connect.sequelize.query(updateQuery, {
                            replacements: {
                                pendingQty: encryptmodel.Pendingqty,
                                empId: encryptmodel.EMP,
                                isin: encryptmodel.ISIN
                            }
                        });

                        console.log(`Updated TradeAvailableQty for EMPID: ${encryptmodel.EMP}, ISIN: ${encryptmodel.ISIN}`);
                    }

                    // ✅ Encrypt response data
                    const EncryptLoginDetails = dataconn.encryptionAES(result);

                    return res.status(200).json({
                        Success: true,
                        Message: 'Data saved successfully',
                        Data: EncryptLoginDetails
                    });
                } else {
                    return res.status(200).json({
                        Success: false,
                        Message: 'Error occurred while saving record',
                        Data: null
                    });
                }
            } catch (error) {
                console.error("Error in /Singacreatetreade:", error);
                dataconn.errorlogger('treadreportingservice', 'Singacreatetreade', error);
                return res.status(200).json({
                    Success: false,
                    Message: 'Error occurred while saving record: ' + error.message,
                    Data: null
                });
            }
        });


    router.route('/Gettradevalue')
        .post(async function (req, res) {
            try {


                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                // Define the query with proper SQL formatting and parameterization if possible
                let query = `select * From public."TBL_DP_HOLDING_DATA" where "EMPID"='${encryptmodel.EMP}' and "ISIN_CODE"='${encryptmodel.ISIN}' AND "IS_ACTIVE"= true`;
                console.log("query", query);

                // Execute the query
                let result = await connect.sequelize.query(query);

                // Respond with encrypted data if available
                if (result[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(result[0]);
                    res.status(200).json({ Success: true, Message: 'Gettradevalue', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'No records found', Data: '' });
                }

            } catch (error) {
                console.error('Error in /Gettradevalue:', error.message);
                res.status(500).json({ Success: false, Message: 'Internal Server Error', Error: error.message });
            }
        });

    return router;

};

module.exports = routes;