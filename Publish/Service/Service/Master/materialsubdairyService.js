var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllmaterialsubdairylistMst')
        .get(function (req, res) {

            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'MATERIALSUBSIDIARY_CODE', 'MATERIALSUBSIDIARY_NAME'], order: [['ID', 'DESC']] };

            dataaccess.FindAll(TBL_MATERIALSUBSIDIARY_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_MATERIALSUBSIDIARY_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_MATERIALSUBSIDIARY_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('materialsubdairylistservice', 'GetAllmaterialsubdairylistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/UpdatematerialsubdairyMaster')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            var values = {
                MATERIALSUBSIDIARY_CODE: encryptmodel.MATERIALSUBSIDIARY_CODE,
                MATERIALSUBSIDIARY_NAME: encryptmodel.MATERIALSUBSIDIARY_NAME,


                IS_ACTIVE: true,// req.body.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_MATERIALSUBSIDIARY_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_MATERIALSUBSIDIARY_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreatematerialsubdairyListMst')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            var values = {
                MATERIALSUBSIDIARY_CODE: encryptmodel.MATERIALSUBSIDIARY_CODE,
                MATERIALSUBSIDIARY_NAME: encryptmodel.MATERIALSUBSIDIARY_NAME,
                IS_ACTIVE: true,//req.body.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_MATERIALSUBSIDIARY_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_MATERIALSUBSIDIARY_MST_Service', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeletematerialsubdairymstById')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            // console.log("body", req.body);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            dataaccess.Update(TBL_MATERIALSUBSIDIARY_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_MATERIALSUBSIDIARY_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('materialsubdairyMasterService', 'DeleteGmaterialsubdairyById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_MATERIALSUBSIDIARY_MST Table', Data: null });
                });
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const BranchMst = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            // console.log(req.body.SCRIPT_NAME);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    MATERIALSUBSIDIARY_CODE: encryptmodel.MATERIALSUBSIDIARY_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("MATERIALSUBSIDIARY_CODE")),
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
            console.log("Param", param);


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
                                Message: "MATERIALSUBSIDIARY_CODE already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "MATERIALSUBSIDIARY_CODE does not exists",
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
                            Message: "User has no access of MATERIALSUBSIDIARY_CODE",
                            Data: null,
                        });
                }
            );

        });

    router.route("/CheckDuplicatematerialsub/:Value/:Id")
        .get(function (req, res) {
            console.log("reqbodymaterial", req.body);
            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();
            var param = {
                where: {
                    MATERIALSUBSIDIARY_CODE: req.params.Value,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("MATERIALSUBSIDIARY_CODE")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(TBL_MATERIALSUBSIDIARY_MST, param).then(
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
                                Message: "materialsub already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "materialsub does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("materialsubService", "CheckDuplicatematerialsub", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of materialsub",
                            Data: null,
                        });
                }
            );
        });




    return router;
};

module.exports = routes;


