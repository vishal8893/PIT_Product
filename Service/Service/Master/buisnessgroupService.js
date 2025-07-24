var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllbusinessgroupMst')
        .get(function (req, res) {

            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_NAME','BG_CODE'],order: [['ID', 'DESC']] };

            dataaccess.FindAll(TBL_BUSINESSGROUP_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'businessgroup Has No Access Of TBL_BUSINESSGROUP_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('businessgroupservice', 'GetAllbusinessgroupMst', err);
                    res.status(200).json({ Success: false, Message: 'businessgroup Has No Access Of Role Table', Data: null });
                });
        });

        router.route('/UpdatebusinessgroupMaster')
        .post(function (req, res) {
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var values = {
                BG_NAME: encryptmodel.BG_NAME,
                BG_CODE: encryptmodel.BG_CODE,
              

                IS_ACTIVE:true,// req.body.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),
    
            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_BUSINESSGROUP_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {
    
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreatebusinessgroupMst')
        .post(function (req, res) {
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var values = {
                BG_NAME: encryptmodel.BG_NAME,
                BG_CODE: encryptmodel.BG_CODE,
                IS_ACTIVE:true,//req.body.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_BUSINESSGROUP_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_BUSINESSGROUP_MST_Service', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

        router.route('/DeletebusinessgroupmstById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            dataaccess.Update(TBL_BUSINESSGROUP_MST,{IS_ACTIVE: false},param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'businessgroup Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('businessgroupMasterService', 'DeleteGbusinessgroupById', err);
                    res.status(200).json({ Success: false, Message: 'businessgroup Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });
                });
        });

        router.route('/CheckDuplicatebusiness/:Value/:Id')
        .get(function (req, res) {

            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var param = {
                where: { BG_CODE: { [connect.Op.iLike]: req.params.Value }, ID: { [connect.Op.ne]: req.params.Id },IS_ACTIVE: true },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('BG_NAME')), 'Count']]
            };

            dataaccess.FindAll(TBL_BUSINESSGROUP_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'businessgroup Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'businessgroup Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('businessgroupService', 'CheckDuplicatebusinessgroup', err);
                        res.status(200).json({ Success: false, Message: 'businessgroup Has No Access Of businessgroup Table', Data: null });
                    });
        });

        router.route('/checkduplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_BUSINESSGROUP_MST();
            console.log(encryptmodel.ENTITY_CODE);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    BG_CODE: encryptmodel.BG_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("BG_CODE")),
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



    return router;
};

module.exports = routes;


