var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllTreadingWindowClose')
        .get(function (req, res) {

            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();

            var param = { attributes: ['ID', 'FROM_DATE', 'TO_DATE', 'IS_ACTIVE'],order: [['ID', 'DESC']] };
            console.log("param all", param);

            dataaccess.FindAll(TBL_TREADINGWINDOW_CLOSE_MST, param)
                .then(function (result) {

                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Treading Window Close Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TREADINGWINDOW_CLOSE_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadingwindowcloseservice', 'GetAllTreadingWindowClose', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TREADINGWINDOW_CLOSE_MST Table', Data: null });
                });
        });

    router.route('/GetAllActiveTreadingWindowClose')
        .get(function (req, res) {

            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'FROM_DATE', 'TO_DATE'],order: [['ID', 'DESC']] };
            console.log("param all active", param)

            dataaccess.FindAll(TBL_TREADINGWINDOW_CLOSE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Treading Window Close Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TREADINGWINDOW_CLOSE_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadingwindowcloseservice', 'GetAllActiveTreadingWindowClose', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TREADINGWINDOW_CLOSE_MST Table', Data: null });
                });
        });

    router.route('/CreateTradingWindowClose')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
            var values = {
                FROM_DATE: encryptmodel.FROM_DATE,
                TO_DATE: encryptmodel.TO_DATE,
                IS_ACTIVE: true,

            };

            dataaccess.Create(TBL_TREADINGWINDOW_CLOSE_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_TREADINGWINDOW_CLOSE_MST saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadingwindowcloseservice', 'CreateTradingWindowClose', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateTradingWindowClose')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
            var values = {
                FROM_DATE: encryptmodel.FROM_DATE,
                TO_DATE: encryptmodel.TO_DATE,
                IS_ACTIVE: true,

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_TREADINGWINDOW_CLOSE_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_TREADINGWINDOW_CLOSE_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadingwindowcloseservice', 'UpdateTradingWindowClose', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteTreadingWindowCloseById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();

            dataaccess.Update(TBL_TREADINGWINDOW_CLOSE_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'TBL_TREADINGWINDOW_CLOSE_MST Has No Access', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('treadingwindowcloseservice', 'DeleteTreadingWindowCloseById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TREADINGWINDOW_CLOSE_MST Table', Data: null });
                });
        });

    router.route("/CheckDuplicateTWC/:Value/:Id")
        .get(function (req, res) {
            const TBL_TREADINGWINDOW_CLOSE_MST = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
            var param = {
                where: {
                    FROM_DATE: req.params.Value,
                    ID: {[connect.Op.ne]: req.params.Id,},
                    IS_ACTIVE : true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("TO_DATE")),"Count",],
                ],
            };

            dataaccess.FindAll(TBL_TREADINGWINDOW_CLOSE_MST, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({Success: true,Message: "FROM_DATE already exists",Data: true,});
                    } else {
                        res.status(200).json({Success: false,Message: "FROM_DATE does not exists",Data: false,});
                    }
                },function (err) {
                    dataconn.errorlogger("treadingwindowcloseservice", "CheckDuplicateTWC", err);
                    res.status(200).json({Success: false,Message: "User has no access of treadingwindowcloseservice",Data: null,});
                }
            );
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
            var param = {
                where: {
                    FROM_DATE: encryptmodel.FROM_DATE,
                    ID: {[connect.Op.ne]: encryptmodel.ID,},
                    IS_ACTIVE: true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("FROM_DATE")),"Count"],
                ]
            };
            console.log("Param", param);

            dataaccess.FindAll(BranchMst, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({Success: true,Message: "FROM_DATE already exists",Data: true,});
                    } else {
                        res.status(200).json({Success: false,Message: "FROM_DATE does not exists",Data: false,});
                    }
                },function (err) {
                    dataconn.errorlogger("treadingwindowcloseservice", "CheckDuplicateTWC", err);
                    res.status(200).json({Success: false,Message: "User has no access of FROM_DATE",Data: null,});
                }
            );

        });

    return router;
};

module.exports = routes;