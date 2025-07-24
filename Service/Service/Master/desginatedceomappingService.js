var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAlldesginatedCEOBMlist')
        .get(function (req, res) {

            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'EMPLOYEE_ID', 'EMP_NAME', 'ENTITY_ID', 'IS_ACTIVE'],
                order: [['ID', 'DESC']],
                include: [
                    // {
                    //     model: TBL_USER_MST,
                    //     attributes: ['ID', 'FIRSTNAME'],
                    // },
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME']
                    }

                ],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_DESGINATED_CEO_BH_MAPPING_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_DESGINATED_CEO_BH_MAPPING_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DESGINATED_CEO_BH_MAPPING_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('desginatedceomappingService', 'GetAlldesginatedCEOBMlist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DESGINATED_CEO_BH_MAPPING_MST Table', Data: null });
                });

        });

    router.route('/GetAllEmpgroupMst')
        .get(function (req, res) {
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { attributes: ['EMPNO', 'FIRSTNAME'],where: { ISACTIVE: true} };
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
                    dataconn.errorlogger('desginatedceomappingService', 'GetAllEmpgroupMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });
        });

    router.route('/GetAllentitylist')
        .get(function (req, res) {

            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var param = {
                attributes: ['ID', 'ENTITY_NAME'],
                // where: { IS_ACTIVE: true }
            };

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
                    dataconn.errorlogger('desginatedceomappingService', 'GetAllentitylist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                });
        });

    router.route('/CreatdesginatedCEOBM')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            var values = {
                EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                EMP_NAME: encryptmodel.EMP_NAME, 
                ENTITY_ID: encryptmodel.ENTITY_ID,
                IS_ACTIVE: true,

            };
            dataaccess.Create(TBL_DESGINATED_CEO_BH_MAPPING_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'desginatedityCEOBMapping saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('desginatedceomappingService', 'CreatdesginatedCEOBM', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdatedesginatedCEOBM')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            var values = {
                EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                EMP_NAME: encryptmodel.EMP_NAME,
                ENTITY_ID: encryptmodel.ENTITY_ID,
                IS_ACTIVE: true,

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_DESGINATED_CEO_BH_MAPPING_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_DESGINATED_CEO_BH_MAPPING_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('desginatedceomappingService', 'UpdatedesginatedCEOBM', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeletedesginatedCEOBMById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            dataaccess.Update(TBL_DESGINATED_CEO_BH_MAPPING_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Delete Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DESGINATED_CEO_BH_MAPPING_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('desginatedceomappingService', 'DeletedesginatedCEOBMById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_DESGINATED_CEO_BH_MAPPING_MST Table', Data: null });
                });
        });

    router.route('/CheckDuplicatedesginatedCEOBMst/:EMPLOYEE_ID/:ENTITY_ID/:ID')
        .get(function (req, res) {

            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            var param = {
                where: { EMPLOYEE_ID: { [connect.Op.iLike]: req.params.EMPLOYEE_ID }, ENTITY_ID: { [connect.Op.iLike]: req.params.ENTITY_ID }, ID: { [connect.Op.ne]: req.params.ID }, IS_ACTIVE: true },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('EMPLOYEE_ID')), 'Count']]
            };

            dataaccess.FindAll(TBL_DESGINATED_CEO_BH_MAPPING_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'TBL_DESGINATED_CEO_BH_MAPPING_MST Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'TBL_DESGINATED_CEO_BH_MAPPING_MST Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('desginatedceomappingService', 'CheckDuplicatedesginatedCEOBMst', err);
                        res.status(200).json({ Success: false, Message: 'TBL_DESGINATED_CEO_BH_MAPPING_MST Has No Access', Data: null });
                    });
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            console.log(req.body.EMPLOYEE_ID);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    EMPLOYEE_ID: encryptmodel.EMPLOYEE_ID,
                    IS_ACTIVE: true,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("EMPLOYEE_ID")),
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
                                Message: "EMPLOYEE_ID already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "EMPLOYEE_ID does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("busonessheadservice", "CheckDuplicateEMPLOYEE_ID", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of EMPLOYEE_ID",
                            Data: null,
                        });
                }
            );

        });

    return router;
}

module.exports = routes;