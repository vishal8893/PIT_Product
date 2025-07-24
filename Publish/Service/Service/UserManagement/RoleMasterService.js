var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');
var async = require('async');
var promise = connect.Sequelize.Promise;

var routes = function () {

    router.route('/GetAllRole')
        .get(function (req, res) {

            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = { attributes: ['ID', 'NAME', 'CODE', 'DESCRIPTION', 'IS_ACTIVE'],order: [['ID', 'DESC']], };

            dataaccess.FindAll(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/GetAllActiveRole')
        .get(function (req, res) {

            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'CODE'] ,order: [['ID', 'DESC']],};

            dataaccess.FindAll(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllActiveRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/GetRoleById/:ID')
        .get(function (req, res) {

            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = { where: { ID: req.params.ID } };

            dataaccess.FindOne(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetRoleById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });

        });

    router.route('/CheckDuplicateRole/:Value/:Id')

        .get(function (req, res) {
            console.log("check req", req.param);
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = {
                where: { CODE: req.params.Value, ID: { [connect.Op.ne]: req.params.Id },IS_ACTIVE: true },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('CODE')), 'Count']]
            };
            console.log("para..", param);
            dataaccess.FindAll(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'Role Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Role Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('RoleService', 'CheckDuplicateRole', err);
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    });
        });

    router.route('/CreateRole')
        .post(function (req, res) {
            // console.log("reqbody", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var values = {
                NAME: encryptmodel.NAME,
                CODE: encryptmodel.CODE.toString().trim(),
                DESCRIPTION: encryptmodel.DESCRIPTION,
                IS_ACTIVE: encryptmodel.IS_ACTIVE,
                // CreatedBy: req.body.UserId,
            };
            dataaccess.Create(TBL_ROLE_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Saved Successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'CreateRole', { message: 'Error Occurred While Saving Record', stack: 'Error Occurred While Saving Record' });
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'CreateRole', err);
                    res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                });
        });

    router.route('/UpdateRole')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var values = {
                NAME: encryptmodel.NAME,
                CODE: encryptmodel.CODE.toString().trim(),
                DESCRIPTION: encryptmodel.DESCRIPTION,
                IS_ACTIVE: encryptmodel.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),
            };
            var param = { ID: encryptmodel.ID };
            console.log("values adn param", values, param);
            dataaccess.Update(TBL_ROLE_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Updated Successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'UpdateRole', { message: 'Error Occurred While Updating Record', stack: 'Error Occurred While Updating Record' });
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'UpdateRole', err);
                    res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                });
        });

    router.route('/GetAllRoleList')
        .get(function (req, res) {

            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = { attributes: ['CODE'] };

            dataaccess.FindAll(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Role Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRoleList', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/DeleteroleById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            dataaccess.Delete(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ROLE_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('GroupMasterService', 'DeleteGroupById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ROLE_MST Table', Data: null });
                });
        });

        router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_ROLE_MST();
            // console.log(req.body.code);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    CODE: encryptmodel.CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("CODE")),
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
                            Message: "code already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "code does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("rolemstService", "CheckDuplicaterole", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of code",
                        Data: null,
                    });
            }
            );
    
        });


    return router;;
};

module.exports = routes;