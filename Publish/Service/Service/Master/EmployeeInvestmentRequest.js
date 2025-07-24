var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { Op } = require('sequelize');
var Sequelize = connect.Sequelize;
var routes = function () {
    // router.route('/EmployeeAccountCode')
    //     .post(function (req, res) {
    //         const Tbl_Employee_AccountCode_Mapping = datamodel.Tbl_Employee_AccountCode_Mapping();
    //         var param = { where: { EMPLOYEE_ID: req.body.loginid, IS_ACTIVE: true } };
    //         dataaccess.FindAll(Tbl_Employee_AccountCode_Mapping, param)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'EmployeeAccountCode List Table Access', Data: result });
    //                 }
    //                 else {
    //                     res.status(200).json({ Success: false, Message: 'User Has No Access Of EmployeeAccountCode', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('EmployeeInvestmentRequestService', 'EmployeeAccountCode', err);
    //                 res.status(200).json({ Success: false, Message: 'User Has No Access Of EmployeeAccountCode', Data: null });
    //             });
    //     });

    router.route('/EmployeeAccountCodeAll')
        .get(function (req, res) {
            const Tbl_Employee_AccountCode_Mapping = datamodel.Tbl_Employee_AccountCode_Mapping();
            var param = { where: { IS_ACTIVE: true } };
            dataaccess.FindAll(Tbl_Employee_AccountCode_Mapping, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'EmployeeAccountCode List Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of EmployeeAccountCode', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'EmployeeAccountCode', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of EmployeeAccountCode', Data: null });
                });
        });


    router.route('/SCRIPDESC')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            let quiry = ` SELECT * FROM "TBL_SCRIPT_MST"
         WHERE lower("SCRIP_DESC")  LIKE lower('%${encryptmodel.SCRIP_DESC}%') and "IS_ACTIVE" = true;`
            let result = await connect.sequelize.query(quiry);
            if (result) {
                var EncryptLoginDetails = dataconn.encryptionAES(result[0]); 
                res.status(200).json({ Success: true, Message: 'SCRIPDESC List Table Access', Data: EncryptLoginDetails });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User Has No Access Of SCRIPDESC', Data: null });
            }
        });



    router.route('/IRFApprovalData')
        .post(function (req, res) {

            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            var values = {
                TRX_NO: req.body.projectId.TRX_NO,
                LOCATION: req.body.projectId.LOCATION,
                COMPANY: req.body.projectId.COMPANY,
                // CRE_USER:  req.body.,
                CRE_DATE: req.body.projectId.DIVIDEND_DATE,
                // UPD_USER:  req.body,
                // UPD_DATE:  req.body,
                NatureofTrade: req.body.natureoftrade,
                Requestfor: req.body.requestfor,
                // DependentName :  req.body,
                Security: req.body.projectId.SCRIP_DESC,
                Transaction: req.body.Transaction.value,
                Month: req.body.Month,
                OptionType: req.body.optiontype,
                QuantityLot: req.body.QuantityLot,
                // EqQuantity:  req.body,
                // FutOpQuantityLot:  req.body,
                // PricePremium:  req.body,
                StrikePrice: req.body.StrikePrice,
                // Position:  req.body,
                // ApprovalStatus:  req.body,
                // RejectionReason:  req.body,
                // DateofEarlierTransaction:  req.body,
                // EmployeeNumber:  req.body,
                ISIN: req.body.projectname,
                // MarketPrice: req.body.MarketPrice,
                // EntityName:  req.body,
                // PrimaryIssueCategory:  req.body,
                // Primary_Issue_Type:  req.body,
                // AcquisitionType:  req.body,
                // CurrentTradeValue_Greater: req.body,
                // PreviousTradeValueGreater:  req.body,
                // AcquiredType:  req.body,
                // RightIssueType:  req.body,
                // IEApprovalStatus:  req.body,
                // RequestNumber:  req.body,
                // VERSION:  req.body,
                // CHECK_DISCLAIMER:  req.body,
                // ESOP_TRADE_CHECK:  req.body,
                // APP_TYPE:  req.body,
                // CommSource:  req.body,
                // CommAcquiredThrough:  req.body,
                // CommLocationofPurchase:  req.body,
                // CommNameofCounterParty:  req.body,
                // CommDimension:  req.body,
                // CommMarketName:  req.body,
                // CommVendorDetails:  req.body,
                // CommTypeofTrade:  req.body,
                // SPNCDEntity: req.body,
                // IsGWMRA:  req.body,
                // IS_IE_COMPLIANCE_AUTOMATE:  req.body,
                // AccountCode:  req.body,
                // SPECIAL_CASE_TYPE:  req.body,
                // IS_ACTIVE:  req.body,
                CREATED_BY: 1,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            console.log("values", values);
            dataaccess.Create(TBL_IRF_Approval_Data, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'IRFApprovalData saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'IRFApprovalData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/GetIRFData')
        .get(function (req, res) {
            const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();
            dataaccess.FindAll(TBL_IRF_Approval_Data)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'GetIRFData List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of GetIRFData', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'GetIRFData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of GetIRFData', Data: null });
                });
        });


    router.route('/EmployeeAccountCodeself')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                         

            let query = `SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO"
            WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true
            UNION
            SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO"
            WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true`
            let SelfData = await connect.sequelize.query(query);
            // if (SelfData[0] != null) {
            if (SelfData[0].length > 0) {
                var EncryptLoginDetails = dataconn.encryptionAES(SelfData[0]);
                res.status(200).json({ Success: true, Message: 'SelfData Accesable', Data: EncryptLoginDetails });
            } else {
                let query = `SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO"
                WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}'  AND "IS_ACTIVE" = true 
                UNION
                SELECT "TRADING_ACCOUNT_NUMBER" FROM "TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO"
                WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true`
                let SelfData = await connect.sequelize.query(query);
                if (SelfData[0].length > 0) {
                    var EncryptLoginDetails = dataconn.encryptionAES(SelfData[0]);
                    res.status(200).json({ Success: true, Message: 'SelfData Accesable', Data: EncryptLoginDetails });
                } else {
                    res.status(200).json({ Success: false, Message: 'SelfData Accesable', Data: null });
                }
            }

        });

    router.route('/EmployeeAccountCodedependant')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            let query = `SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO"
            WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}'  AND "IS_ACTIVE" = true 
            UNION
            SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO"
            WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}' AND "IS_ACTIVE" = true`

            let EAH = await connect.sequelize.query(query);
            // if (EAH[0] != null) {
            if (EAH[0].length > 0){
                var EncryptLoginDetails = dataconn.encryptionAES(EAH[0]);
                res.status(200).json({ Success: true, Message: 'EAH Accesable', Data: EncryptLoginDetails });
            }
            else {
                let query = `SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO"
                 WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}'   AND "IS_ACTIVE" = true 
                 UNION
                 SELECT "TRADING_ACCOUNT_NUMBER","RELATIONSHIP" FROM "TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO"
                 WHERE "EMPLOYEE_ID" = '${encryptmodel.loginid}'  AND "IS_ACTIVE" = true`

                let JD = await connect.sequelize.query(query);
                if (JD[0].length > 0) {
                    var EncryptLoginDetails = dataconn.encryptionAES(JD[0]);
                    res.status(200).json({ Success: true, Message: 'EAH Accesable', Data: EncryptLoginDetails });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'EAH Accesable', Data: null });
                }
            }
            return;

        });



    router.route('/Disclaimer')
        .post(function (req, res) {
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            // var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var param = {

                where: {
                    // QuarterId: req.body.Quarter,
                    CurrentActive: true,

                },

            }
            dataaccess.FindOne(TBL_QuarterMaster, param)
                .then(function (result) {
                    if (result != null) {
                        // var EncryptLoginDetails = dataconn.encryptionAES(Array);
                        res.status(200).json({ Success: true, Message: 'get Disclaimer successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while get record record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'Disclaimer', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while get record record', Data: null });
                });
        });


    router.route('/Disclaimersubmit')
        .post(function (req, res) {
            
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            
            const EIRF_Disclaimer_Status = datamodel.EIRF_Disclaimer_Status();
            let param = {
                where: {
                    QuarterID: encryptmodel.Quarter.toString(),
                    YEAR: encryptmodel.Currentyear,
                    // CREATED_BY: parseInt(req.body.Createby)
                    CREATED_BY: encryptmodel.Createby

                }
            }

            dataaccess.FindOne(EIRF_Disclaimer_Status, param)
                .then(function (result) {
                    if (result != null) {
                        let r1 = JSON.stringify(result)
                        let r2 = JSON.parse(r1)
                        var values = {
                            QuarterID: encryptmodel.Quarter,
                            IS_ACTIVE: encryptmodel.Is_Active,
                            CREATED_BY: encryptmodel.Createby

                        }
                        var param = {
                            Id: r2.Id
                        };

                        dataaccess.Update(EIRF_Disclaimer_Status, values, param)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                    res.status(200).json({ Success: true, Message: 'Saving Disclaimer successfully', Data: EncryptLoginDetails });
                                }
                                else {

                                    res.status(200).json({ Success: false, Message: 'Error occurred while Saving record ', Data: null });
                                }
                            }, function (err) {
                                dataconn.errorlogger('EmployeeInvestmentRequestService', 'Disclaimersubmit', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while Saving record record', Data: null });
                            });
                    }
                    else {
                        var values = {
                            QuarterID: encryptmodel.Quarter,
                            IS_ACTIVE: encryptmodel.Is_Active,
                            CREATED_BY: encryptmodel.Createby,
                            YEAR: encryptmodel.Currentyear
                        }

                        dataaccess.Create(EIRF_Disclaimer_Status, values)
                            .then(function (result) {
                                if (result != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                    res.status(200).json({ Success: true, Message: 'Saving Disclaimer successfully', Data: EncryptLoginDetails });
                                }
                                else {

                                    res.status(200).json({ Success: false, Message: 'Error occurred while Saving record ', Data: null });
                                }
                            }, function (err) {
                                dataconn.errorlogger('EmployeeInvestmentRequestService', 'Disclaimersubmit', err);
                                res.status(200).json({ Success: false, Message: 'Error occurred while Saving record record', Data: null });
                            });
                    }
                }, function (err) {
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'Disclaimersubmit', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while Saving record record', Data: null });
                });
        });


    router.route('/Disclaimercheck')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                      
            const EIRF_Disclaimer_Status = datamodel.EIRF_Disclaimer_Status();
            var param = {
                where: {
                    QuarterID: encryptmodel.Quarter,
                    IS_ACTIVE: encryptmodel.Is_Active,
                    CREATED_BY: encryptmodel.Createby

                },


            }

            dataaccess.FindOne(EIRF_Disclaimer_Status, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'get Disclaimer successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while get record ', Data: null });
                    }
                }, function (err) {
                    console.log("err", err);
                    dataconn.errorlogger('EmployeeInvestmentRequestService', 'Disclaimercheck', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while get record record', Data: null });
                });
        });

    return router;
};

module.exports = routes;



