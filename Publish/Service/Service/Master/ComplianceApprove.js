var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { Op } = require('sequelize');
var routes = function () {


    router.route('/GetAllIRFApprovalData')
        .post(async function (req, res) {


            const encryptmodel = dataconn.decrypt(req.body.encryptmodel);


            try {
                let Querys = `SELECT * 
FROM public."TBL_IRF_Approval_Data" A
WHERE A."ApprovalStatus" ='Pending for Approve' 
  AND DATE(A."CREATED_ON") = CURRENT_DATE 
  AND A."NatureofTrade" = '${encryptmodel.Trade}' 
  AND A."CREATED_BY" = '${encryptmodel.Username}';`

                console.log("Querys", Querys);


                let result = await connect.sequelize.query(Querys);


                if (result[0] && result[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(result[0]);
                    res.status(200).json({
                        Success: true,
                        Message: 'TBL_IRF_Approval_Data List Table Access',
                        Data: EncryptLoginDetails
                    });
                } else {
                    res.status(200).json({
                        Success: false,
                        Message: 'User Has No Access Of TBL_IRF_Approval_Data List Table',
                        Data: null
                    });
                }
            } catch (err) {
                dataconn.errorlogger('ComplianceApproveservice', 'GetAllIRFApprovalData', err);
                res.status(200).json({
                    Success: false,
                    Message: 'User Has No Access Of TBL_IRF_Approval_Data Table',
                    Data: null
                });
            }
        });

    router.route('/GetAllIRFApprovalDataall')
        .get(async function (req, res) {

            try {
                let Querys = `SELECT *
FROM public."TBL_IRF_Approval_Data" A
WHERE A."ApprovalStatus" = 'Pending for Approve'
  AND DATE(A."CREATED_ON") = CURRENT_DATE`

                console.log("Querys", Querys);


                let result = await connect.sequelize.query(Querys);


                if (result[0] && result[0].length > 0) {
                    const EncryptLoginDetails = dataconn.encryptionAES(result[0]);
                    res.status(200).json({
                        Success: true,
                        Message: 'TBL_IRF_Approval_Data List Table Access',
                        Data: EncryptLoginDetails
                    });
                } else {
                    res.status(200).json({
                        Success: false,
                        Message: 'User Has No Access Of TBL_IRF_Approval_Data List Table',
                        Data: null
                    });
                }
            } catch (err) {
                dataconn.errorlogger('ComplianceApproveservice', 'GetAllIRFApprovalDataall', err);
                res.status(200).json({
                    Success: false,
                    Message: 'User Has No Access Of TBL_IRF_Approval_Data Table',
                    Data: null
                });
            }
        });

    router.route('/GetAllUserData')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = {
                // No WHERE clause, since you want all records
                order: [['ID', 'DESC']] // Optional: Order by ID descending
            };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({
                            Success: true,
                            Message: 'TBL_USER_MST List Access',
                            Data: EncryptLoginDetails
                        });
                    } else {
                        res.status(200).json({
                            Success: false,
                            Message: 'No Records Found in TBL_USER_MST',
                            Data: null
                        });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUserData', err);
                    res.status(200).json({
                        Success: false,
                        Message: 'Error Accessing TBL_USER_MST Table',
                        Data: null
                    });
                });
        });



    router.route('/Approvedata')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var values = {
                ApprovalStatus: encryptmodel.Status,
                COMPLIANCECREATED_BY: encryptmodel.UserId,
                COMPLIANCECREATED_ON: new Date()
            };
            var param = { ID: encryptmodel.ID };


            dataaccess.Update(TBL_IRF_Approval_Data, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Approvedata saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ComplianceApproveservice', 'Approvedata', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });


    router.route('/Rejectdata')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var values = {
                ApprovalStatus: encryptmodel.Status,
                COMPLIANCECREATED_BY: encryptmodel.UserId,
                RejectionReason: encryptmodel.RejectionReason,
                COMPLIANCECREATED_ON: new Date(),
                TradeAvailableQty: 0
            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_IRF_Approval_Data, values, param)
                .then(async function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        let UpdateQ = `select * from public. "TBL_DP_HOLDING_DATA" where "ISIN_CODE"='${encryptmodel.Array.ISIN}'`
                        let Result = await connect.sequelize.query(UpdateQ);


                        if (Result[0] && Result[0].length > 0) {

                            let QRTY = Number(Result[0][0].DP_QTY)
                            let UpQuery = `UPDATE  "TBL_DP_HOLDING_DATA"
                         SET "ApprovalAvailableQty" = ${QRTY} , "TradeAvailableQty"= 0
                             WHERE "ISIN_CODE"='${encryptmodel.Array.ISIN}';`
                            let resultnew = await connect.sequelize.query(UpQuery);
                        }

                        res.status(200).json({ Success: true, Message: 'Reject successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while Reject record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ComplianceApproveservice', 'Rejectdata', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while Reject record', Data: null });
                });
        });

    return router;
};

module.exports = routes;


