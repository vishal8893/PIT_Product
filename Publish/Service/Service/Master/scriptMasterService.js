var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var Connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllgenericdata')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: ['Exchange']
                    // GROUP_NAME: 'Applicability'
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
                    dataconn.errorlogger('scriptmstservice', 'GetAllgenericdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/GetAllnatureoftradedata')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'NatureOfTrade'
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
                    dataconn.errorlogger('scriptmstservice', 'GetAllnatureoftradedata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/GetAllScriptdata')
        .get(function (req, res) {

            const TBL_SCRIPT_MST = datamodel.TBL_SCRIPT_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['BSE_CODE', 'NSE_BSE_CODE', 'NSE_CODE', 'LOT_SIZE','ISIN_CODE', 'BLOOMBERG_CODE', 'REUTERS_CODE', 'SEDOL_CODE', 'DIVIDEND_DATE', 'RESTRICTED_RESET', 'SCRIP_DESC',
                    'HOLDING_PERIOD', 'IRF_FORMATS', 'BSE_GROUP_Name', 'EXCHANGE', 'NATURE_OF_TRADE', 'IS_ACTIVE','ID', 'TRX_NO', 'LOCATION', 'COMPANY', ],
                order: [['ID', 'DESC']]
                // include: [
                //     {
                //         model: TBL_GENERIC_MST,
                //         as: 'Exchange',
                //         attributes: ['ID', 'NAME'],
                //         where: {
                //             GROUP_NAME: ['Exchange'],
                //         },
                //     },
                //     {
                //         model: TBL_GENERIC_MST,
                //         as: 'NatureOfTrade',
                //         attributes: ['ID', 'NAME'],
                //         where: {
                //             GROUP_NAME: 'NatureOfTrade',
                //         },
                //     }
                // ],
            };
            console.log("param all", param);

            dataaccess.FindAll(TBL_SCRIPT_MST, param)
                .then(function (result) {

                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_SCRIPT_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCRIPT_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('scriptmstservice', 'GetAllScriptdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCRIPT_MST Table', Data: null });
                });
        });


    router.route('/getalldatafortrxno')
        .post(async function (req, res) {

            var reqbody = req.body;
            console.log(`Insert`, reqbody);
            var querytext = `SELECT * from get_script_masterby_id( :p_trx_no);`;
            var param = {
                replacements: {
                    p_trx_no: reqbody.TRX_NO,

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('paramforgetalldatafortrxno', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("resultgetalldatafortrxno", result)
                    res.status(200).json({ Success: true, Message: "", Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('scriptmstservice', 'getalldatafortrxno', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of get_script_masterby_id', Data: null });
                    });
        });

    router.route('/CreateScriptdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);                        
            var reqbody = encryptmodel;
            console.log(`Insert`, reqbody);
            var querytext = `SELECT * from check_nse_bse_code_exists(:nse_code,:bse_code);`;
            var param = {
                replacements: {

                    nse_code: reqbody.NSE_CODE,
                    bse_code: reqbody.BSE_CODE
                },
                type: Connect.sequelize.QueryTypes.SELECT
            }
            console.log('param', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    // result.shift();
                    console.log("result", result);
                    if (result != (0, 1) && result != (1, 0) && result != (1, 1)  && result.length > 0) {
                        // if (result != 0 && result.length > 0) {
                        var reqbody1 = encryptmodel;
                        console.log(`Insert1`, reqbody1);
                        
                        var query = `SELECT * from public."SAVE_UPDATE_SCRIPT_MASTER"( :cre_emp_code,:bse_code,:nse_bse_code,:nse_code,:lot_size,
                                        :isin_code,:bloomberg_code,:reuters_code,:sedol_code,:divident_date,:restricted_reset,:script_desc,:holding_period,
                                        :irf_formats,:bsegroupname,:exchange,:nature_of_trade,:trx_no,:is_gov_sec);`;
                        var param1 = {
                            replacements: {

                                cre_emp_code: 1,
                                bse_code: reqbody1.BSE_CODE || null,
                                nse_bse_code: reqbody1.NSE_BSE_CODE || null,
                                nse_code: reqbody1.NSE_CODE || null,
                                lot_size: Number(reqbody1.LOT_SIZE) || null,
                                // lot_size: reqbody1.LOT_SIZE,
                                isin_code: reqbody1.ISIN_CODE,
                                bloomberg_code: reqbody1.BLOOMBERG_CODE || null,
                                reuters_code: reqbody1.REUTERS_CODE || null,
                                sedol_code: reqbody1.SEDOL_CODE || null,
                                divident_date: reqbody1.DIVIDEND_DATE === null ? null : new Date(reqbody1.DIVIDEND_DATE),
                                // divident_date: new Date(reqbody1.DIVIDEND_DATE) || null,
                                restricted_reset: reqbody1.RESTRICTED_RESET || null,
                                script_desc: reqbody1.SCRIP_DESC,
                                holding_period: Number(reqbody1.HOLDING_PERIOD) || 30,
                                // holding_period: reqbody1.HOLDING_PERIOD,
                                irf_formats: reqbody1.IRF_FORMATS || '1',
                                bsegroupname: reqbody1.BSE_GROUP_Name || null,
                                exchange: reqbody1.EXCHANGE || null,
                                nature_of_trade: reqbody1.NATURE_OF_TRADE || null,
                                trx_no: reqbody1.TRX_NO || null,
                                is_gov_sec: reqbody1.is_gov_security || 'false',

                            },
                            type: Connect.sequelize.QueryTypes.SELECT

                        }
                        console.log('param1', param1);

                        Connect.sequelize.query(query, param1)
                            .then(function (result1) {
                                console.log("result1", result1)
                                var EncryptLoginDetails = dataconn.encryptionAES(result1); 
                                res.status(200).json({ Success: true, Message: "", Data: EncryptLoginDetails });
                            },
                                function (err) {
                                    dataconn.errorlogger('scriptmstservice', 'data', err);
                                    res.status(200).json({ Success: false, Message: 'User has no access of SAVE SAVE_UPDATE_SCRIPT_MASTER', Data: null });
                                });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while generating script', Data: null });

                    }

                },
                    function (err) {
                        dataconn.errorlogger('scriptmstservice', 'CreateScriptdata', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of check_nse_bse_code_exists', Data: null });
                    });
        });

    router.route('/UpdateScriptdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var reqbody = encryptmodel;
            console.log(`Update`, reqbody);
            var querytext = `SELECT * from public."SAVE_UPDATE_SCRIPT_MASTER"( :cre_emp_code,:bse_code,:nse_bse_code,:nse_code,:lot_size,
                             :isin_code,:bloomberg_code,:reuters_code,:sedol_code,:divident_date,:restricted_reset,:script_desc,:holding_period,
                             :irf_formats,:bsegroupname,:exchange,:nature_of_trade,:trx_no,:is_gov_sec);`;
            var param = {
                replacements: {
                    cre_emp_code: 1,
                    bse_code: reqbody.BSE_CODE || null,
                    nse_bse_code: reqbody.NSE_BSE_CODE || null,
                    nse_code: reqbody.NSE_CODE || null,
                    lot_size: Number(reqbody.LOT_SIZE) || null,
                    // lot_size: reqbody.LOT_SIZE,
                    isin_code: reqbody.ISIN_CODE,
                    bloomberg_code: reqbody.BLOOMBERG_CODE || null,
                    reuters_code: reqbody.REUTERS_CODE || null,
                    sedol_code: reqbody.SEDOL_CODE || null,
                    divident_date: reqbody.DIVIDEND_DATE === null ? null : new Date(reqbody.DIVIDEND_DATE),
                    // divident_date: new Date(reqbody.DIVIDEND_DATE) || null,
                    restricted_reset: reqbody.RESTRICTED_RESET || null,
                    script_desc: reqbody.SCRIP_DESC,
                    holding_period: Number(reqbody.HOLDING_PERIOD) || 30,
                    // holding_period: reqbody.HOLDING_PERIOD,
                    irf_formats: reqbody.IRF_FORMATS || '1',
                    bsegroupname: reqbody.BSE_GROUP_Name || null,
                    exchange: reqbody.EXCHANGE || null,
                    nature_of_trade: reqbody.NATURE_OF_TRADE || null,
                    // trx_no: reqbody.trx_no,
                    trx_no: reqbody.TRX_NO,
                    is_gov_sec: reqbody.is_gov_security,

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('update param', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("update result", result)
                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                    res.status(200).json({ Success: true, Message: "", Data: EncryptLoginDetails });
                },
                    function (err) {
                        dataconn.errorlogger('scriptmstservice', 'UpdateScriptdata', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of UPDATE SAVE_UPDATE_SCRIPT_MASTER', Data: null });
                    });
        });

    router.route('/Deletescriptdata')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_SCRIPT_MST = datamodel.TBL_SCRIPT_MST();
            dataaccess.Update(TBL_SCRIPT_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCRIPT_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('scriptmstservice', 'Deletescriptdata', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SCRIPT_MST Table', Data: null });
                });
        });

    return router;
}

module.exports = routes;