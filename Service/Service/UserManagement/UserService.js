var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var commonfunc = require('../../Common/CommonFunctions');

var routes = function () {

    router.route('/GetAllUser')
        .get(function (req, res) {
            console.log("getall");

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_USERROLE_MAP = datamodel.TBL_USERROLE_MAP();
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();

            var param = {
                attributes: ['ID', 'LOGINID', 'EMPCODE', 'EMPNAME'],
                include: [
                    {
                        model: TBL_USERROLE_MAP, attributes: ['ROLEID'],
                        include: [{ model: TBL_ROLE_MST, attributes: ['CODE'] }]
                    },
                ],
                order: [['CREATED_ON']]
            };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/GetAllActiveUser')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { where: { IsActive: true }, attributes: ['ID', 'LOGINID', 'EMPNAME'] };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllActiveUser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/GetUserById/:Id')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_USERROLE_MAP = datamodel.TBL_USERROLE_MAP();
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();

            var param = {
                where: { ID: req.params.ID },
                include: [
                    { model: TBL_USERROLE_MAP, attributes: ['ROLEID'], include: [{ model: TBL_ROLE_MST, attributes: ['CODE'] }] },
                ],
                order: [['MODIFIED_ON']]
            };

            dataaccess.FindOne(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Access Table', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });

        });

    router.route('/FindAllUsers/:Text')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = {
                where: { IS_ACTIVE: true, EMPNAME: { [connect.Op.iLike]: req.params.Text + '%' } },
                attributes: ['ID', 'LOGINID', 'EMPNAME']
            };
            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'FindAllUsers', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });

        });

        router.route('/CheckDuplicateBranch2')
        .post(function (req, res) {

            const BranchMst = datamodel.TBL_USER_MST();
            // console.log(req.body.loginid);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    LOGINID: req.body.LOGINID,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: req.body.ID,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("LOGINID")),
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
                            Message: "loginid already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "loginid does not exists",
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
                        Message: "User has no access of loginid",
                        Data: null,
                    });
            }
            );
    
        });


    router.route('/CheckDuplicateUser/:Value/:ID')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = {
                where: { LoginId: { [connect.Op.iLike]: req.params.LoginId }, ID: { [connect.Op.ne]: req.params.ID } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('LOGINID')), 'Count']]
            };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'User Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('UserService', 'CheckDuplicateUser', err);
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    });
        });

    router.route('/CreateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                var PASSWORD = commonfunc.RandomString(8, '#aA');

                const TBL_USER_MST = datamodel.TBL_USER_MST();
                var values = {
                    LOGINID: req.body.LOGINID,
                    EMPCODE: req.body.EMPCODE,
                    EMPNAME: req.body.EMPNAME,
                    EMAILID: req.body.EMAILID,
                    DEFAULTROLEID: req.body.DEFAULTROLEID,
                    PASSWORD: PASSWORD,
                    IS_ACTIVE: req.body.IS_ACTIVE,
                    // CREATED_BY: req.body.UserId,
                    ADD_USER: req.body.ADD_USER
                };
                dataaccess.CreateWithTransaction(TBL_USER_MST, values, trans)
                    .then(function (result) {
                        if (result != null) {

                            const TBL_USERROLE_MAP = datamodel.TBL_USERROLE_MAP();
                            var mapRoles = [];
                            var promiseRoles = req.body.ROLEID.map(function (mapitem) { mapRoles.push({ USERID: result.ID, ROLEID: mapitem }); });

                            Promise.all(promiseRoles).then(function () {
                                dataaccess.BulkCreateWithTransaction(TBL_USERROLE_MAP, mapRoles, trans)
                                    .then((roleresult) => {
                                        trans.commit();
                                        res.status(200).json({ Success: true, Message: 'User Saved Successfully', Data: result });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('UserService', 'CreateUser', err);
                                            res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                                        });
                            });
                        }
                        else {
                            trans.rollback();
                            dataconn.errorlogger('UserService', 'CreateUser', { message: 'Error Occurred While Saving Record', stack: 'Error Occurred While Saving Record' });
                            res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                        }
                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('UserService', 'CreateUser', err);
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                    });
            });
        });

    router.route('/UpdateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const TBL_USER_MST = datamodel.TBL_USER_MST();
                var values = {
                    LOGINID: req.body.LOGINID,
                    EMPCODE: req.body.EMPCODE,
                    EMPNAME: req.body.EMPNAME,
                    EMAILID: req.body.EMAILID,
                    DEFAULTROLEID: req.body.DEFAULTROLEID,
                    PASSWORD: PASSWORD,
                    IS_ACTIVE: req.body.IS_ACTIVE,
                    // CREATED_BY: req.body.UserId,
                    ADD_USER: req.body.ADD_USER,
                    MODIFIED_ON: connect.sequelize.fn('NOW'),
                };
                var param = { ID: req.body.ID };

                dataaccess.UpdateWithTransaction(TBL_USER_MST, values, param, trans)
                    .then(function (result) {
                        if (result != null) {

                            const UserRoleMap = datamodel.TBL_USERROLE_MAP();
                            var roledeleteresult = { USERID: req.body.ID };

                            dataaccess.DeleteWithTransaction(UserRoleMap, roledeleteresult, trans)
                                .then(function (roledeleteresult) {

                                    var mapRoles = [];
                                    var promisesRoles = req.body.ROLEID.map(function (mapitem) { mapRoles.push({ USERID: req.body.ID, ROLEID: mapitem }); });

                                    Promise.all(promisesRoles).then(function () {
                                        dataaccess.BulkCreateWithTransaction(UserRoleMap, mapRoles, trans)
                                            .then((roleresult) => {
                                                trans.commit();
                                                res.status(200).json({ Success: true, Message: 'User Updated Successfully', Data: result });
                                            }, function (err) {
                                                trans.rollback();
                                                dataconn.errorlogger('UserService', 'UpdateUser', err);
                                                res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                                            });
                                    });
                                }, function (err) {
                                    trans.rollback();
                                    dataconn.errorlogger('UserService', 'UpdateUser', err);
                                    res.status(200).json({ Success: false, Message: 'Error Occurred While Updating Record', Data: null });
                                });
                        };
                    });
            });
        });


    router.route('/GetAllUserList')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { attributes: ['LOGINID', 'EMPCODE', 'EMPNAME'] };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUserList', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/CheckActiveUser/:ID')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = { where: { UserId: req.params.ID, IS_ACTIVE: true } };

            Promise.all([
                dataaccess.FindAndCountAll(TBL_USER_MST, param)
            ]).then(function (Users) {
                if (Users != null && Users.count > 0) {
                    res.status(200).json({ Success: true, Message: 'Can Not Deactivate This User, Its Already Used In User Master', Data: true });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Can Deactivate, User Is Not Used', Data: false });
                }
            }).catch(err => {
                dataconn.errorlogger('UserService', 'CheckActiveUser', err);
                res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
            });
        });

    router.route("/GetUserRolesById/:ID")
        .get(function (req, res) {

            const UserRoleMap = datamodel.TBL_USERROLE_MAP();
            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { USERID: req.params.ID },
                include: [{ model: RoleMst, attributes: ['ID', 'CODE'], where: { IS_ACTIVE: true } }]
            };

            dataaccess.FindAll(UserRoleMap, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserRolesById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route("/UpdateUserDefaultRole")
        .post(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var values = { DEFAULTROLEID: req.body.DEFAULTROLEID };
            var param = { ID: req.body.UserId };

            dataaccess.Update(TBL_USER_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Default Role Updated Successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'UpdateUserDefaultRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of User Table', Data: null });
                });
        });

    router.route('/GetAllUsers')
        .post(function (req, res) {
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { where: { ID: req.body.loginid } };
            dataaccess.FindOne(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'user_master Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Entity Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUsers', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Entity Table', Data: null });
                });

        });

    return router;
};

module.exports = routes;