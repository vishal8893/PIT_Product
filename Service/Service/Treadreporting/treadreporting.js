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
      WHERE A."EmployeeNumber" = '${encryptmodel.EMP}'  and "NatureofTrade"='${encryptmodel.Asset}' and "ApprovalStatus"='Approved' and "TradeAvailableQty" > 0 and "IS_CLOSE" is null
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
                let query = `select * from public."TBL_IRF_Approval_Data" A where "ID"='${encryptmodel.ID}' and "ApprovalStatus"='Approved'
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
    //     .post(async function (req, res) {
    //         try {
    //             // ✅ Decrypt request body
    //             const encryptmodel = dataconn.decrypt(req.body.encryptmodel);

    //             const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();

    //             // ✅ Prepare values for insertion
    //             const values = {
    //                 Segment: encryptmodel.Asset,
    //                 EmpId: encryptmodel.EMP,
    //                 PanNo: encryptmodel.PanNo,
    //                 TradeDate: encryptmodel.TradeDate,
    //                 Exch: encryptmodel.Exch,
    //                 AccCode: encryptmodel.AccountCode,
    //                 AccName: encryptmodel.AccountName,
    //                 ScripCode: encryptmodel.ScripCode,
    //                 ScripName: encryptmodel.ScriptName,
    //                 Quantity: encryptmodel.Quantity,
    //                 TotalPrice: encryptmodel.TotalPrice,
    //                 Mode: encryptmodel.Mode,
    //                 ISIN: encryptmodel.ISIN,
    //                 OpenQuantity: encryptmodel.OpenQuantity,
    //                 TradedBy: encryptmodel.TradeBy,
    //                 StrikePrice: encryptmodel.StrikePrice,
    //                 ExpiryDate: encryptmodel.ExpiryDate,
    //                 OptionType: encryptmodel.OptionType,
    //                 CreatedBy: encryptmodel.EMP,
    //                 TradedQuantity: encryptmodel.TradeQty,
    //                 PanNo: encryptmodel.PAN_NO
    //             };

    //             console.log("Insert Values:", values);

    //             // ✅ Insert into DB
    //             const result = await dataaccess.Create(eirf_rico_sos_emp_mapping, values);

    //             if (result) {
    //                 // ✅ If Mode is SELL → Update TradeAvailableQty
    //                 if (encryptmodel.Mode == 'SELL') {
    //                     const updateQuery = `UPDATE public."TBL_DP_HOLDING_DATA"
    //                                          SET 
    //                                          "TradeAvailableQty" = :pendingQty,
    //                                          "MODIFIED_BY" = :empId
    //                                           WHERE "EMPID" = :empId AND "ISIN_CODE" = :isin`;

    //                     await connect.sequelize.query(updateQuery, {
    //                         replacements: {
    //                             pendingQty: encryptmodel.Pendingqty,
    //                             empId: encryptmodel.EMP,
    //                             isin: encryptmodel.ISIN
    //                         }
    //                     });

    //                     const IRFUpdateQuery = `UPDATE "TBL_IRF_Approval_Data"
    //                                             SET "TradeAvailableQty" = '${encryptmodel.Pendingqty}'
    //                                             WHERE "ID"='${encryptmodel.ID}';`
    //                     await connect.sequelize.query(IRFUpdateQuery);

    //                 } else if (encryptmodel.Mode == 'BUY') {
    //                     const getQuery = ` select * from public. "TBL_DP_HOLDING_DATA" where "ISIN_CODE"='${encryptmodel.ISIN}' and "EMPID" = '${encryptmodel.EMP}'`
    //                     const getQueryresult = await connect.sequelize.query(getQuery);
    //                     if (getQueryresult[0] && getQueryresult[0].length > 0) {
    //                         console.log("getQueryresult[0]",Number(getQueryresult[0][0].TradeAvailableQty));

    //                         const SUMQTY = Number(encryptmodel.TradeQty) + Number(getQueryresult[0][0].TradeAvailableQty)
    //                         const QTY = Number(encryptmodel.TradeQty) + Number(getQueryresult[0][0].DP_QTY)
    //                         const updateQuery = `UPDATE public."TBL_DP_HOLDING_DATA"
    //                                          SET 
    //                                          "TradeAvailableQty" = '${SUMQTY}',"DP_QTY"='${QTY}'
    //                                          "MODIFIED_BY" = '${encryptmodel.EMP}'
    //                                           WHERE "EMPID" = '${encryptmodel.EMP}' AND "ISIN_CODE" = ${encryptmodel.ISIN}`;

    //                         await connect.sequelize.query(updateQuery);

    //                         const IRFUpdateQuery = `UPDATE "TBL_IRF_Approval_Data"
    //                                             SET "TradeAvailableQty" = '${encryptmodel.Pendingqty}'
    //                                             WHERE "ID"='${encryptmodel.ID}';`
    //                         await connect.sequelize.query(IRFUpdateQuery);
    //                     } else {

    //                         const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();
    //                         var valuec = {
    //                             EMPID: encryptmodel.EMP,
    //                             ACCOUNT_CODE: encryptmodel.AccountCode,
    //                             ACCOUNT_NAME: encryptmodel.AccountName,
    //                             ISIN_CODE: encryptmodel.ISIN,
    //                             TRX_DATE: encryptmodel.TradeDate,
    //                             DP_QTY: encryptmodel.TradeQty,
    //                             SEGMENT: encryptmodel.Asset,
    //                             IS_ACTIVE: true,
    //                             CREATED_BY: encryptmodel.EMP,
    //                             CREATED_DT: new Date(),
    //                             TradeAvailableQty: 0,
    //                             ApprovalAvailableQty: encryptmodel.TradeQty
    //                         };

    //                         dataaccess.Create(TBL_DP_HOLDING_DATA, valuec)
    //                             .then(async function (result) {
    //                                 const IRFUpdateQuery = `UPDATE "TBL_IRF_Approval_Data"
    //                                             SET "TradeAvailableQty" = 0
    //                                             WHERE "ID"='${encryptmodel.ID}';`
    //                                 await connect.sequelize.query(IRFUpdateQuery);
    //                             });
    //                     }
    //                 }
    //                 const EncryptLoginDetails = dataconn.encryptionAES(result);

    //                 return res.status(200).json({
    //                     Success: true,
    //                     Message: 'Data saved successfully',
    //                     Data: EncryptLoginDetails
    //                 });
    //             } else {
    //                 return res.status(200).json({
    //                     Success: false,
    //                     Message: 'Error occurred while saving record',
    //                     Data: null
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error in /Singacreatetreade:", error);
    //             dataconn.errorlogger('treadreportingservice', 'Singacreatetreade', error);
    //             return res.status(200).json({
    //                 Success: false,
    //                 Message: 'Error occurred while saving record: ' + error.message,
    //                 Data: null
    //             });
    //         }
    //     });
    router.route('/Singacreatetreade')
        .post(async function (req, res) {
            try {
                // ✅ Decrypt request body
                const encryptmodel = dataconn.decrypt(req.body.encryptmodel);

                const eirf_rico_sos_emp_mapping = datamodel.eirf_rico_sos_emp_mapping();

                // ✅ Prepare values for insertion
                const values = {
                    Segment: encryptmodel.Asset,
                    EmpId: encryptmodel.EMP,
                    PanNo: encryptmodel.PAN_NO,
                    TradeDate: encryptmodel.TradeDate,
                    Exch: encryptmodel.Exch,
                    AccCode: encryptmodel.AccountCode,
                    AccName: encryptmodel.AccountName,
                    ScripCode: encryptmodel.ScripCode,
                    ScripName: encryptmodel.ScriptName,
                    Quantity: encryptmodel.Quantity,
                    TotalPrice: encryptmodel.TotalPrice,
                    Mode: encryptmodel.Mode,
                    ISIN: encryptmodel.ISIN,
                    OpenQuantity: encryptmodel.OpenQuantity,
                    TradedBy: encryptmodel.TradeBy,
                    StrikePrice: encryptmodel.StrikePrice,
                    ExpiryDate: encryptmodel.ExpiryDate,
                    OptionType: encryptmodel.OptionType,
                    CreatedBy: encryptmodel.EMP,
                    TradedQuantity: encryptmodel.TradeQty
                };

                console.log("Insert Values:", values);

                // ✅ Insert into DB
                const result = await dataaccess.Create(eirf_rico_sos_emp_mapping, values);

                if (result) {
                    const empId = encryptmodel.EMP;
                    const isin = encryptmodel.ISIN;
                    const TradeDates = encryptmodel.TradeDate;
                    const AcCode = encryptmodel.AccountCode
                    if (encryptmodel.Mode === 'SELL') {
                        // ✅ Update TradeAvailableQty for SELL
                        //     const updateQuery = `
                        //     UPDATE public."TBL_DP_HOLDING_DATA"
                        //     SET 
                        //         "TradeAvailableQty" = :pendingQty,
                        //         "MODIFIED_BY" = :empId,
                        //         "TRX_DATE" = :TradeDates
                        //     WHERE 
                        //         "EMPID" = :empId AND "ISIN_CODE" = :isin AND "ACCOUNT_CODE" = :AcCode
                        // `;
                        //     await connect.sequelize.query(updateQuery, {
                        //         replacements: {
                        //             pendingQty: encryptmodel.Pendingqty,
                        //             AcCode,
                        //             empId,
                        //             isin,
                        //             TradeDates
                        //         }
                        //     });

                        //     const IRFUpdateQuery = `
                        //     UPDATE "TBL_IRF_Approval_Data"
                        //     SET "TradeAvailableQty" = :pendingQty
                        //     WHERE "ID" = :id
                        // `;
                        //     await connect.sequelize.query(IRFUpdateQuery, {
                        //         replacements: {
                        //             pendingQty: encryptmodel.Pendingqty,
                        //             id: encryptmodel.ID
                        //         }
                        //     });



                        const selectOldRecordsQuery = `
                              SELECT * 
                              FROM public."TBL_DP_HOLDING_DATA" 
                              WHERE 
                                  "EMPID" = :empno
                                  AND "ISIN_CODE" = :isin
                                  AND "ACCOUNT_CODE" = :accountCode
                                  AND "TRX_DATE" < CURRENT_DATE - INTERVAL '30 days'
                                  AND "IS_ACTIVE" = true
                              ORDER BY "TRX_DATE" DESC;
                            `;

                        const [oldRows] = await connect.sequelize.query(selectOldRecordsQuery, {
                            replacements: { empno: empId, isin: isin, accountCode: AcCode },
                        });

                        if (!oldRows.length) {
                            console.log("No old records found.");
                            return;
                        }

                        // 3. Reset all ApprovalAvailableQty and TradeAvailableQty to 0
                        for (const row of oldRows) {
                            const resetQuery = `
                                UPDATE public."TBL_DP_HOLDING_DATA"
                                SET 
                                  "TradeAvailableQty" = 0,
                                  "MODIFIED_BY" = :empno
                                WHERE "ID" = :id
                              `;

                            await connect.sequelize.query(resetQuery, {
                                replacements: { empno: empId, id: row.ID },
                            });
                        }

                        // 4. Update the most recent record with calculated quantities
                        const latestRowId = oldRows[0].ID;

                        const updateLatestQuery = `
                              UPDATE public."TBL_DP_HOLDING_DATA"
                              SET 
                                "TradeAvailableQty" = :tradeQty,
                                "MODIFIED_BY" = :empno
                              WHERE "ID" = :id
                            `;

                        await connect.sequelize.query(updateLatestQuery, {
                            replacements: {

                                tradeQty: encryptmodel.Pendingqty,
                                empno: empId,
                                id: latestRowId,
                            },
                        });

                             const IRFUpdateQuery = `
                            UPDATE "TBL_IRF_Approval_Data"
                            SET "TradeAvailableQty" = :pendingQty
                            WHERE "ID" = :id
                        `;
                            await connect.sequelize.query(IRFUpdateQuery, {
                                replacements: {
                                    pendingQty: encryptmodel.Pendingqty,
                                    id: encryptmodel.ID
                                }
                            });

                    } else if (encryptmodel.Mode === 'BUY') {
                        // ✅ Fetch existing data
                        //     const getQuery = `
                        //     SELECT * FROM public."TBL_DP_HOLDING_DATA" 
                        //     WHERE "ISIN_CODE" = :isin AND "EMPID" = :empId AND "ACCOUNT_CODE" = :AcCode
                        // `;
                        //     const getQueryResult = await connect.sequelize.query(getQuery, {
                        //         replacements: { isin, empId, AcCode },
                        //         type: connect.sequelize.QueryTypes.SELECT
                        //     });

                        const selectOldRecordsQuery = `
      SELECT * 
      FROM public."TBL_DP_HOLDING_DATA" 
      WHERE 
          "EMPID" = :empno
          AND "ISIN_CODE" = :isin
          AND "ACCOUNT_CODE" = :accountCode
          AND "TRX_DATE" < CURRENT_DATE - INTERVAL '30 days'
          AND "IS_ACTIVE" = true
      ORDER BY "TRX_DATE" DESC;
    `;

                        const [getQueryResult] = await connect.sequelize.query(selectOldRecordsQuery, {
                            replacements: { empno: empId, isin: isin, accountCode: AcCode },
                        });

                        if (getQueryResult && getQueryResult.length > 0) {
                            const existing = getQueryResult[0];

                            const SUMQTY = Number(encryptmodel.TradeQty) + Number(existing.TradeAvailableQty || 0);
                            const QTY = Number(encryptmodel.TradeQty) + Number(existing.DP_QTY || 0);
                            const APQTY = Number(encryptmodel.TradeQty) + Number(existing.ApprovalAvailableQty || 0);

                            //     const updateQuery = `
                            //     UPDATE public."TBL_DP_HOLDING_DATA"
                            //     SET 
                            //         "TradeAvailableQty" = :sumQty,
                            //         "ApprovalAvailableQty"=:apqty,
                            //         "DP_QTY" = :qty,
                            //         "MODIFIED_BY" = :empId,
                            //         "TRX_DATE" = :TradeDates
                            //     WHERE 
                            //         "EMPID" = :empId AND "ISIN_CODE" = :isin AND "ACCOUNT_CODE" = :ACCOUNT_CODE
                            // `;
                            //     await connect.sequelize.query(updateQuery, {
                            //         replacements: {
                            //             sumQty: SUMQTY,
                            //             qty: QTY,
                            //             apqty: APQTY,
                            //             ACCOUNT_CODE: encryptmodel.AccountCode,
                            //             empId,
                            //             isin,
                            //             TradeDates

                            //         }
                            //     });

                            // for (const row of getQueryResult) {
                            //     const resetQuery = `
                            //     UPDATE public."TBL_DP_HOLDING_DATA"
                            //     SET 
                            //     "ApprovalAvailableQty" = 0,
                            //     "TradeAvailableQty" = 0,
                            //     "DP_QTY" = 0,
                            //     "MODIFIED_BY" = :empno
                            //     WHERE "ID" = :id
                            //                     `;

                            //     await connect.sequelize.query(resetQuery, {
                            //         replacements: { empno: empId, id: row.ID },
                            //     });
                            // }


                            const latestRowId = getQueryResult[0].ID;
                            
                                const updateLatestQuery = `
                                  UPDATE public."TBL_DP_HOLDING_DATA"
                                  SET 
                                    "ApprovalAvailableQty" = :approvalQty,
                                    "TradeAvailableQty" = :tradeQty,
                                    "DP_QTY" = :qty,
                                    "MODIFIED_BY" = :empno
                                  WHERE "ID" = :id
                                `;
                            
                                await connect.sequelize.query(updateLatestQuery, {
                                  replacements: {
                                    approvalQty: APQTY,
                                    tradeQty: SUMQTY,
                                    qty: QTY,
                                    empno: empId,
                                     id: latestRowId
                                  },
                                });

                            const IRFUpdateQuery = `
                            UPDATE "TBL_IRF_Approval_Data"
                            SET "TradeAvailableQty" = :pendingQty
                            WHERE "ID" = :id
                        `;
                            await connect.sequelize.query(IRFUpdateQuery, {
                                replacements: {
                                    pendingQty: encryptmodel.Pendingqty,
                                    id: encryptmodel.ID
                                }
                            });

                        } else {
                            // ✅ Insert new record into TBL_DP_HOLDING_DATA
                            const TBL_DP_HOLDING_DATA = datamodel.TBL_DP_HOLDING_DATA();
                            const valuec = {
                                EMPID: empId,
                                ACCOUNT_CODE: encryptmodel.AccountCode,
                                ACCOUNT_NAME: encryptmodel.AccountName,
                                ISIN_CODE: isin,
                                TRX_DATE: encryptmodel.TradeDate,
                                DP_QTY: encryptmodel.TradeQty,
                                SEGMENT: encryptmodel.Asset,
                                IS_ACTIVE: true,
                                CREATED_BY: empId,
                                CREATED_DT: new Date(),
                                TradeAvailableQty: 0,
                                ApprovalAvailableQty: encryptmodel.TradeQty
                            };

                            await dataaccess.Create(TBL_DP_HOLDING_DATA, valuec);

                            const IRFUpdateQuery = `
                            UPDATE "TBL_IRF_Approval_Data"
                            SET "TradeAvailableQty" = 0
                            WHERE "ID" = :id
                        `;
                            await connect.sequelize.query(IRFUpdateQuery, {
                                replacements: {
                                    id: encryptmodel.ID
                                }
                            });
                        }
                    }

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

    router.route('/GetTradeData')
        .post(async function (req, res) {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                // Define the query with proper SQL formatting and parameterization if possible
                let query = `select * From public."eirf_rico_sos_emp_mapping" where "EmpId"='${encryptmodel.EMP}' order by 1 desc`;

                // Execute the query
                let result = await connect.sequelize.query(query);

                // Respond with encrypted data if available
                if (result[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(result[0]);
                    res.status(200).json({ Success: true, Message: 'GetTradeData', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'No records found', Data: '' });
                }

            } catch (error) {
                console.error('Error in /GetTradeData:', error.message);
                res.status(500).json({ Success: false, Message: 'Internal Server Error', Error: error.message });
            }
        });

    router.route('/Closerecord')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var values = {
                IS_CLOSE: true,
                TradeAvailableQty: 0
            };

            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_IRF_Approval_Data, values, param)
                .then(async function (result) {
                    if (result != null) {
                        let query = `
                                      UPDATE "TBL_DP_HOLDING_DATA"
                                      SET "TradeAvailableQty" = 0
                                      WHERE "ISIN_CODE"='${encryptmodel.ISIN}' and "ACCOUNT_CODE"='${encryptmodel.AccountCode}' and  "EMPID"='${encryptmodel.EMP}'`;

                        // Execute the query
                        let result = await connect.sequelize.query(query);
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: ' updated successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        dataconn.errorlogger('treadreportingService', 'Closerecord', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadreportingService', 'Closerecord', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    return router;

};

module.exports = routes;