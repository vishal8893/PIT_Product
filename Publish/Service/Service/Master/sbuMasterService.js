var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllsbulistMst')
        .get(function (req, res) {

            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = { 
                where: { IS_ACTIVE: true }, attributes: ['ID','BG_ID', 'SBU_NAME','SBU_CODE'],order: [['ID', 'DESC']],
            include: [
                { model: TBL_BUSINESSGROUP_MST, attributes: ['ID','BG_NAME'], },
            ]
        
        };

            dataaccess.FindAll(TBL_SBU_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('sbulistservice', 'GetAllsbulistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

        
    router.route('/GetAllbusinessgroupMst')
    .get(function (req, res) {

        const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
        var param = {attributes: ['ID', 'BG_NAME'],where: {IS_ACTIVE: true} };

        dataaccess.FindAll(TBL_BUSINESSGROUP_MST, param)
            .then(function (result) {
                if (result != null) {
                    var EncryptLoginDetails = dataconn.encryptionAES(result);
                    res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST List Table Access', Data: EncryptLoginDetails });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST List Table', Data: null });
                }
            }, function (err) {
                dataconn.errorlogger('businessgroupservice', 'GetAllbusinessgroupMst', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
            });
    });

        router.route('/UpdatesbuMaster')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            var values = {
                BG_ID: encryptmodel.BG_ID,
                SBU_NAME: encryptmodel.SBU_NAME,
                SBU_CODE: encryptmodel.SBU_CODE,
              

                IS_ACTIVE:true,// req.body.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),
    
            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_SBU_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {
    
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreatesbuListMst')
        .post(function (req, res) {
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var values = {
                BG_ID: encryptmodel.BG_ID,
                SBU_NAME: encryptmodel.SBU_NAME,
                SBU_CODE: encryptmodel.SBU_CODE,
                IS_ACTIVE:true,//req.body.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_SBU_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_SBU_MST_Service', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

        router.route('/DeletesbumstById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            dataaccess.Update(TBL_SBU_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('sbuMasterService', 'DeleteGsbuById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                });
        });

  
        router.route("/CheckDuplicatesbu/:Value/:Id")
        .get(function (req, res) {
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            var param = {
                where: {
                    SBU_CODE: req.params.Value,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SBU_NAME")),
                        "Count",
                    ],
                ],
            };
    
            dataaccess.FindAll(TBL_SBU_MST, param).then(
                function (result) {
                    if (
                        result != null &&
                        result.length > 0 &&
                        result[0].dataValues.Count != null &&
                        result[0].dataValues.Count > 0
                    ) {
                        res
                            .status(200)
                            .json({
                                Success: true,
                                Message: "sbu already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "sbu does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("sbuService", "CheckDuplicatesbu", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of sbu",
                            Data: null,
                        });
                }
            );
        });

        router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_SBU_MST();
            // console.log(req.body.SBU_CODE);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    SBU_CODE: encryptmodel.SBU_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SBU_CODE")),
                        "Count"
                    ],
                    // [
                    //     connect.sequelize.fn("count", connect.sequelize.col("IFSC_Code")),
                    //     "Count",
                    // ],
                    // [
                    //     connect.sequelize.fn("count", connect.sequelize.col("BankId")),
                    //     "Count",
                    // ],
                ]
            };
            console.log("Param",param);

            
            dataaccess.FindAll(BranchMst, param).then(
            function (result) {
                if (
                    result != null &&
                    result.length > 0 &&
                    result[0].dataValues.Count != null &&
                    result[0].dataValues.Count > 0
                ) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "SBU_CODE already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "SBU_CODE does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("sbuService", "CheckDuplicatesbu", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of SBU_CODE",
                        Data: null,
                    });
            }
            );
    
        });

    return router;
};

module.exports = routes;


