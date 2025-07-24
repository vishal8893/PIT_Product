var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllM3&UPSIMst')
        .get(function (req, res) {

            const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'EMP_NAME', 'TYPE_ID', 'IS_ACTIVE'],
                order: [['ID', 'DESC']],
                include: [
                    // {
                    //     model: TBL_USER_MST,
                    //     attributes: ['ID', 'FIRSTNAME'],
                    // },
                    {
                        model: TBL_GENERIC_MST,
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: 'Type'
                        }
                    }

                ],

            };
            console.log("param", param);

            dataaccess.FindAll(TBL_M3_UPSI_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_M3_UPSI_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_M3_UPSI_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('m3upsiMasterService', 'GetAllM3&UPSIMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_M3_UPSI_MST Table', Data: null });
                });

        });

    router.route('/GetAllEmpgroupMst')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { attributes: ['EMPNO', 'FIRSTNAME'],where: {ISACTIVE: true}};
            console.log("parama", param);

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('m3upsiMasterService', 'GetAllEmpgroupMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });
        });

    router.route('/GetAllTypegroupMst')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            // var param = { attributes: ['ID', 'GROUP_NAME','NAME','GRPUP_ID'] };
            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'Type'
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
                    dataconn.errorlogger('m3upsiMasterService', 'GetAllTypegroupMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/CreatM3&UPSIMst')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();
            var values = {
                EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                EMP_NAME: encryptmodel.EMP_NAME,
                TYPE_ID: encryptmodel.TYPE_ID,
                IS_ACTIVE: true,

            };

            dataaccess.Create(TBL_M3_UPSI_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'm3upsi saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('m3upsiMasterService', 'CreatM3&UPSIMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/Updatem3upsiMst')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();
            var values = {
                EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                EMP_NAME: encryptmodel.EMP_NAME,
                TYPE_ID: encryptmodel.TYPE_ID,
                IS_ACTIVE: true,

            };
            var param = { ID: encryptmodel.ID };

            dataaccess.Update(TBL_M3_UPSI_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_M3_UPSI_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('m3upsiMasterService', 'Updatem3upsiMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/Deletem3upsimstById')
        .post(function (req, res) {

            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var param = {
                ID: encryptmodel.ID
            };

            console.log("param", param);
            const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();

            dataaccess.Update(TBL_M3_UPSI_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_M3_UPSI_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('m3upsiMasterService', 'Deletem3upsimstById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_M3_UPSI_MST Table', Data: null });
                });
        });

    router.route("/CheckDuplicatem3upsi/:Value/:Id")
        .get(function (req, res) {
            const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();
            var param = {
                where: {
                    EMPLOYEE_ID: req.params.Value,
                    ID: { [connect.Op.ne]: req.params.Id, },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("TYPE_ID")), "Count",],
                ],
            };

            dataaccess.FindAll(TBL_M3_UPSI_MST, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: "EMPLOYEE_ID already exists", Data: true, });
                    } else {
                        res.status(200).json({ Success: false, Message: "EMPLOYEE_ID does not exists", Data: false, });
                    }
                }, function (err) {
                    dataconn.errorlogger("m3upsiMasterService", "CheckDuplicatem3upsi", err);
                    res.status(200).json({ Success: false, Message: "User has no access of m3upsiMasterService", Data: null, });
                }
            );
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_M3_UPSI_MST();
            var param = {
                where: {
                    EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                    ID: { [connect.Op.ne]: encryptmodel.ID, },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("EMPLOYEE_ID")), "Count"],
                ]
            };
            console.log("Param", param);

            dataaccess.FindAll(BranchMst, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: "EMPLOYEE_ID already exists", Data: true, });
                    } else {
                        res.status(200).json({ Success: false, Message: "EMPLOYEE_ID does not exists", Data: false, });
                    }
                }, function (err) {
                    dataconn.errorlogger("m3upsiMasterService", "CheckDuplicatem3upsi", err);
                    res.status(200).json({ Success: false, Message: "User has no access of EMPLOYEE_ID", Data: null, });
                }
            );

        });

    return router;
};

module.exports = routes;

