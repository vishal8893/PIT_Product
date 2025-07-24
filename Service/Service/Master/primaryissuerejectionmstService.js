var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllprimaryissuerejectionlistMst')
        .get(function (req, res) {

            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'EMPLOYEE_CODE', 'IPOID', 'IPO_NAME'], order: [['ID', 'DESC']] };

            dataaccess.FindAll(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Grey List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of grey List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('greyprimaryissuerejectionservice', 'GetAllprimaryissuerejectionlistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/Updateprimaryissuerejection')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            var values = {
                EMPLOYEE_CODE: encryptmodel.EMPLOYEE_CODE,
                IPOID: encryptmodel.IPOID,
                IPO_NAME: encryptmodel.IPO_NAME,


                IS_ACTIVE: true,// req.body.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_PRIMARY_ISSUE_REJECTION_LIST_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('primaryissuerejectionService', 'Updateprimaryissuerejection', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreatprimaryissueListMst')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            var values = {
                EMPLOYEE_CODE: encryptmodel.EMPLOYEE_CODE,
                IPOID: encryptmodel.IPOID,
                IPO_NAME: encryptmodel.IPO_NAME,
                IS_ACTIVE: true,//req.body.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_PRIMARY_ISSUE_REJECTION_LIST_MST_Service', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeleteprimaryissuerejctionById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            dataaccess.Update(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PRIMARY_ISSUE_REJECTION_LIST_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('primaryissuerejectionService', 'DeleteprimaryissuerejectionById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PRIMARY_ISSUE_REJECTION_LIST_MST Table', Data: null });
                });
        });


    router.route('/CheckDuplicate')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            // console.log(req.body.SCRIPT_NAME);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    EMPLOYEE_CODE: encryptmodel.EMPLOYEE_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("EMPLOYEE_CODE")),
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
                                Message: "EMPLOYEE_CODE already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "EMPLOYEE_CODE does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("primaryissuerejectionmstService", "CheckDuplicate", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of EMPLOYEE_CODE",
                            Data: null,
                        });
                }
            );

        });


    router.route("/CheckDuplicateprimaryissuerejection/:Value/:Id")
        .get(function (req, res) {
            const TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
            var param = {
                where: {
                    EMPLOYEE_CODE: req.params.Value,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("EMPLOYEE_CODE")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(TBL_PRIMARY_ISSUE_REJECTION_LIST_MST, param).then(
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
                                Message: "primaryissuerejection already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "primaryissuerejection does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("primaryissuerejectionService", "CheckDuplicateprimaryissuerejection", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of primaryissuerejection",
                            Data: null,
                        });
                }
            );
        });




    return router;
};

module.exports = routes;


