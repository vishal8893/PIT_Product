var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllentitylistMst')
        .get(function (req, res) {

            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'ENTITY_CODE', 'ENTITY_NAME'],order: [['ID', 'DESC']] };

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
                    dataconn.errorlogger('entitylistservice', 'GetAllentitylistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/UpdateentityMaster')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var values = {
                ENTITY_CODE: encryptmodel.ENTITY_CODE,
                ENTITY_NAME: encryptmodel.ENTITY_NAME,


                IS_ACTIVE: true,// req.body.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_ENTITY_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreateentityListMst')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var values = {
                ENTITY_CODE: encryptmodel.ENTITY_CODE,
                ENTITY_NAME: encryptmodel.ENTITY_NAME,
                IS_ACTIVE: true,//req.body.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_ENTITY_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_ENTITY_MST_Service', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

        router.route('/DeleteentitymstById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            dataaccess.Delete(TBL_ENTITY_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('entityMasterService', 'DeleteentitymstById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                });
        });

    router.route('/CheckDuplicateentity/:Value/:ID')
        .get(function (req, res) {
            console.log("green flag", req.body);
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var param = {
                where: { ENTITY_CODE: { [connect.Op.iLike]: req.params.Value }, ID: { [connect.Op.ne]: req.params.Id },IS_ACTIVE: true },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('ENTITY_CODE')), 'Count']]
            };

            dataaccess.FindAll(TBL_ENTITY_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'entityMst Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'entityMst Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('entityMstService', 'CheckDuplicateentityMst', err);
                        res.status(200).json({ Success: false, Message: 'entityMst Has No Access Of entityMst Table', Data: null });
                    });
        });


        router.route('/CheckDuplicate')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_ENTITY_MST();
            console.log(encryptmodel.ENTITY_CODE);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    ENTITY_CODE: encryptmodel.ENTITY_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("ENTITY_CODE")),
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
                            Message: "Branch already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Branch does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("BranchService", "CheckDuplicateBranch", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
            );
    
        });


        router.route('/CheckDuplicateupdate')
        .post(function (req, res) {

            const BranchMst = datamodel.TBL_ENTITY_MST();
            console.log(req.body.ENTITY_CODE);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    ENTITY_CODE: req.body.ENTITY_CODE ,
                    ENTITY_NAME: req.body.ENTITY_NAME,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: req.body.ID,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("ENTITY_CODE")),
                        "Count"
                    ],
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("ENTITY_NAME")),
                        "Count",
                    ],
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
                            Message: "Branch already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Branch does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("BranchService", "CheckDuplicateBranch", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
            );
    
        });


        router.route('/DeletegreymstById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_GREY_LIST_MST = datamodel.TBL_ENTITY_MST();
            dataaccess.Update(TBL_GREY_LIST_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GREY_LIST_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('greyMasterService', 'DeleteGgreyById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GREY_LIST_MST Table', Data: null });
                });
        });


    return router;
};

module.exports = routes;


