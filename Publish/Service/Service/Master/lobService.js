var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {
    router.route('/GetAllLobMst')
        .get(function (req, res) {
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = {
                where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_ID', 'SBU_ID', 'LOB_NAME', 'LOB_CODE', 'IS_ACTIVE'],order: [['ID', 'DESC']],
                include: [
                    {
                        model: TBL_SBU_MST,
                        attributes: ['ID', 'SBU_NAME'],
                        include: [{ model: TBL_BUSINESSGROUP_MST, attributes: ['ID', 'BG_NAME'] }]

                    },

                ],
                order: [['ID',"DESC"]]
            };

            dataaccess.FindAll(TBL_LOB_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_LOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('lobService', 'GetAllLobMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                });

        });


    router.route("/CheckDuplicateLob/:Value/:Id")
    .get(function (req, res) {
        const TBL_LOB_MST = datamodel.TBL_LOB_MST();
        var param = {
            where: {
                LOB_CODE: req.params.Value,
                ID: {
                    [connect.Op.ne]: req.params.Id,
                },
                IS_ACTIVE: true,
            },
            attributes: [
                [
                    connect.sequelize.fn("count", connect.sequelize.col("LOB_CODE")),
                    "Count",
                ],
            ],
        };

        dataaccess.FindAll(TBL_LOB_MST, param).then(
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
                            Message: "LOB already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "LOB does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("LobService", "CheckDuplicateLob", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Lob",
                        Data: null,
                    });
            }
        );
    });

    
    router.route('/CreateLobMst')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            var values = {
                BG_ID: encryptmodel.BG_ID,
                SBU_ID: encryptmodel.SBU_ID,
                LOB_NAME: encryptmodel.LOB_NAME,
                LOB_CODE: encryptmodel.LOB_CODE,
                IS_ACTIVE: true,
                Created_By: encryptmodel.UserId,
                // Created_Date: connect.sequelize.fn("NOW"),
            };
            console.log("values", values);
            dataaccess.Create(TBL_LOB_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'LOB saved successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('LobService', 'CreateLobMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });
    router.route('/UpdateLobMst')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            var values = {
                ID: encryptmodel.ID,
                BG_ID: encryptmodel.BG_ID,
                SBU_ID: encryptmodel.SBU_ID,
                LOB_NAME: encryptmodel.LOB_NAME,
                LOB_CODE: encryptmodel.LOB_CODE,
                IS_ACTIVE: true,
                Modified_By: encryptmodel.UserId,
                // Modified_Date: connect.sequelize.fn('NOW'),
            };
            console.log("UpdateLobValues", values)
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_LOB_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'LOB updated successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        dataconn.errorlogger('LobService', 'UpdateLobMst', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('LobService', 'UpdateLobMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/GetAllBG')
        .get(function (req, res) {

            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_NAME', 'BG_CODE'] };

            dataaccess.FindAll(TBL_BUSINESSGROUP_MST, param)

                .then(function (result) {

                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);

                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST Table Access', Data: EncryptLoginDetails });

                    }

                    else {

                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });

                    }

                }, function (err) {

                    dataconn.errorlogger('LobSevice', 'GetAllBG', err);

                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });

                });



        });
    router.route('/GetAllSBU')
        .post(function (req, res) {
            // console.log("reqsid", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();

            var param = {
                where:
                    { BG_ID: encryptmodel.BG_ID, IS_ACTIVE: true },

                attributes: ['ID', 'SBU_NAME', 'SBU_CODE']
            };
            console.log("paream", param);
            dataaccess.FindAll(TBL_SBU_MST, param)
                .then(function (result) {
                    console.log("getallresult", result);
                    if (result != null) {
                        console.log("GetAllSBU", result)
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('lobService', 'GetAllSBU', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                });

        });

    router.route('/GetLOB_ID/:ID')
        .get(function (req, res) {
            console.log('req.params.ID', req.params.ID)
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = {
                where: { ID: req.params.ID },
                include: [
                    {
                        model: TBL_SBU_MST,
                        attributes: ['SBU_NAME', 'SBU_CODE', 'ID'],
                        include: [{ model: TBL_BUSINESSGROUP_MST, attributes: ['BG_NAME', 'BG_CODE', 'ID'] }]
                    },

                ],
            };

            dataaccess.FindOne(TBL_LOB_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Lob Data', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of LOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('lobService', 'GetLOB_ID', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of LOB_MST Table', Data: null });
                });

        });


    router.route('/DeleteLOBById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            dataaccess.Update(TBL_LOB_MST,{IS_ACTIVE:false}, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('LOBService', 'DeleteLOBById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                });
        });

        router.route('/checkduplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_LOB_MST();
            // console.log(req.body.SCRIPT_NAME);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    LOB_CODE: encryptmodel.LOB_CODE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("LOB_CODE")),
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
                            Message: "lob name already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "lob does not exists",
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
                        Message: "User has no access of lob",
                        Data: null,
                    });
            }
            );
    
        });




    return router;
};

module.exports = routes;