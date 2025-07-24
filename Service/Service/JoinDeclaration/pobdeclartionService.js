var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {
    router.route('/GetAllsubLobMst')
        .get(function (req, res) {
            const TBL_BUSINESSHEAD_MST = datamodel.TBL_BUSINESSHEAD_MST();
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();

            var param = {
                where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_ID', 'SBU_ID', 'LOB_ID','SUBLOB_ID', 'IS_ACTIVE'],
                include: [

                    {
                        model: TBL_SUBLOB_MST,
                        attributes: ['ID', 'SUBLOB_NAME']
                    },
                    {
                        model: TBL_LOB_MST,
                        attributes: ['ID', 'LOB_NAME'],
                    },
                    {
                        model: TBL_SBU_MST,
                        attributes: ['ID', 'SBU_NAME'],
                    },
                    {
                        model: TBL_BUSINESSGROUP_MST,
                        attributes: ['ID', 'BG_NAME']
                    },
                 







                ],

                
            };
            console.log("param", param);
            dataaccess.FindAll(TBL_BUSINESSHEAD_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSHEAD_MST Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'GetAllLobMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                });

        });


    router.route("/CheckDuplicateSubLob/:Value/:Id")
        .get(function (req, res) {
            const TBL_BUSINESSHEAD_MST = datamodel.TBL_BUSINESSHEAD_MST();
            var param = {
                where: {
                    SUBLOB_CODE: req.params.Value,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SUBLOB_CODE")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(TBL_BUSINESSHEAD_MST, param).then(
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
                                Message: "busonesshead already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "business head does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("busonessheadservice", "CheckDuplicateSubLob", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of busonesshead",
                            Data: null,
                        });
                }
            );
        });


    router.route('/addPBdata')
        .post(function (req, res) {
            console.log('busineheadsave',req.body);
            const TBL_POB_DECLARATION = datamodel.TBL_POB_DECLARATION();
            var values = {
                // ID: req.body.ID,
                EMPLOYEE_ID: req.body.EMPLOYEE_ID,
                DECLARE_DATE: new Date(),
            
                IS_ACTIVE: true,
                // Created_By: req.body.UserId,
                // Created_Date: connect.sequelize.fn("NOW"),
            };
            console.log("busineheadvalues", values);
            dataaccess.Create(TBL_POB_DECLARATION, values)
                .then(function (result) {
                    console.log("resultbusiness",result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_POB_DECLARATION saved successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_POB_DECLARATIONservice', 'CreateSubLobMst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });


    router.route('/UpdateSubLobMst')
        .post(function (req, res) {

            const TBL_BUSINESSHEAD_MST = datamodel.TBL_BUSINESSHEAD_MST();
            var values = {
                ID: req.body.ID,
                BG_ID: req.body.BG_ID,
                SBU_ID: req.body.SBU_ID,
                LOB_ID: req.body.LOB_ID,
                SUBLOB_ID: req.body.SUBLOB_ID,
           
                IS_ACTIVE: true,
                Modified_By: req.body.UserId,
                // Modified_Date: connect.sequelize.fn('NOW'),
            };
            console.log("UpdateSubLobMst", values)
            var param = { ID: req.body.ID };
            dataaccess.Update(TBL_BUSINESSHEAD_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'SubLOB updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('busonessheadservice', 'UpdateSubLobMst', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'UpdateLobMst', err);
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

                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST Table Access', Data: result });

                    }

                    else {

                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });

                    }

                }, function (err) {

                    dataconn.errorlogger('LobSevice', 'GetAllBG', err);

                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST Table', Data: null });

                });



        });


    router.route('/GetAllSBU/:BG_ID')
        .get(function (req, res) {
            console.log("reqsid", req.params);
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            var param = {
                where: { BG_ID: req.params.BG_ID },
                attributes: ['ID', 'SBU_NAME', 'SUBLOB_CODE']
            };

            dataaccess.FindAll(TBL_SBU_MST, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("GetAllSBU", result)
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'GetAllSBU', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                });

        });


    router.route('/GetAllLobname')
        .post(function (req, res) {
            console.log("reqsid", req.params);
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            var param = {
                where: { SBU_ID: req.body.SBU_ID },
                attributes: ['ID', 'LOB_NAME', 'LOB_CODE']
            };

            dataaccess.FindAll(TBL_LOB_MST, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("GetAllSBU", result)
                        res.status(200).json({ Success: true, Message: 'TBL_LOB_MST Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'GetAllSBU', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                });

        });


        router.route('/GetAllsubLobname')
        .post(function (req, res) {
            console.log("reqsid", req.params);
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            var param = {
                where: { LOB_ID: req.body.LOB_ID },
                attributes: ['ID', 'SUBLOB_NAME', 'SUBLOB_CODE']
            };

            dataaccess.FindAll(TBL_SUBLOB_MST, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("GetAllsubLobname", result)
                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSHEAD_MST Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'GetAllsubLobname', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                });

        });

        
    router.route('/GetSUBLOB_ID/:ID')
        .get(function (req, res) {
            console.log('req.params.ID', req.params.ID)
            const TBL_BUSINESSHEAD_MST = datamodel.TBL_BUSINESSHEAD_MST();

            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();

            var param = {
                where: { ID: req.params.ID },
                include: [
                    {
                        model: TBL_LOB_MST,
                        attributes: ['LOB_NAME', 'ID'],
                        include: [{ model: TBL_SBU_MST, attributes: ['SBU_NAME', 'ID'] }],
                        include: [{ model: TBL_BUSINESSGROUP_MST, attributes: ['BG_NAME', 'ID'] }],
                        include: [{ model: TBL_SUBLOB_MST, attributes: ['SUBLOB_NAME', 'ID'] }]
                    },

                ],
            };

            dataaccess.FindOne(TBL_BUSINESSHEAD_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'SUBTBL_BUSINESSHEAD_MSTLob Data', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'GetSUBLOB_ID', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                });

        });


    router.route('/DeletesubLOBById')
        .post(function (req, res) {
            console.log("body", req.body);
            var param = {
                ID: req.body.ID
            };
            console.log("param", param);
            const TBL_BUSINESSHEAD_MST = datamodel.TBL_BUSINESSHEAD_MST();
            dataaccess.Delete(TBL_BUSINESSHEAD_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: null });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('busonessheadservice', 'DeletesubLOBById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSHEAD_MST Table', Data: null });
                });
        });


    router.route('/GetAllEmpgroupMst1')
        .get(function (req, res) {




            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = { attributes: ['ID', 'EMPNAME'] };

            console.log("parama", param);

            dataaccess.FindAll(TBL_USER_MST, param)

                .then(function (result) {

                    console.log("result", result);

                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST List Table Access', Data: result });

                    }

                    else {

                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST List Table', Data: null });

                    }

                }, function (err) {

                    dataconn.errorlogger('m3upsiMasterService', 'GetAllEmpgroupMst', err);

                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });

                });

        });


    router.route('/GetAllEmpgroupMst')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = { where: { ISACTIVE: true }, attributes: ['ID', 'FIRSTNAME'] };

            dataaccess.FindAll(TBL_USER_MST, param)

                .then(function (result) {

                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST Table Access', Data: result });

                    }

                    else {

                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });

                    }

                }, function (err) {

                    dataconn.errorlogger('LobSevice', 'GetAllBG', err);

                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });

                });



        });


        router.route('/CheckDuplicate')
        .post(function (req, res) {

            const BranchMst = datamodel.TBL_BUSINESSHEAD_MST();
            console.log(req.body.SUBLOB_ID);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    SUBLOB_ID: req.body.SUBLOB_ID,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: req.body.ID,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SUBLOB_ID")),
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
                            Message: "SUBLOB_ID already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "SUBLOB_ID does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("busonessheadservice", "CheckDuplicatesublobid", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of SUBLOB_CODE",
                        Data: null,
                    });
            }
            );
    
        });

    return router;
};

module.exports = routes;