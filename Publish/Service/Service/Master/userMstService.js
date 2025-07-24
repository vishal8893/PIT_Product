var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/GetAlluser')

    router.route('/GetAllUSerdata1')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var param = {
                where: { ISACTIVE: true },
                attributes: [
                    'ID',
                    'EMPNO',
                    'FIRSTNAME',
                    'LASTNAME',
                    'LOGINID',
                    'PASSWORD',
                    'DEPARTMENT',
                    'EMAILID',
                    'DSIGNATED',
                    'GREYLIST',
                    'TRADEREMAILIDS',
                    'ISIECOMPLIANCEMEMBER',
                    'ISRESEARCHANALYST',
                    'ISQUANTITATIVERESEARCHANALYST',
                    'ISGWMRAMEMBER',
                    'ISACTIVE',
                    'EFSLDESIGNATED',
                    'ISEBUSINESSDESIGNATEDGI',
                    'ISETLI',
                    'ISEGI',
                    'ISGM',
                    'ENTITY',
                    'PANCARDNO',
                    'DESIGNATION',
                    'SBU',
                    'SLOB',
                    'EMPJOINDATE',
                    'BG',
                    'RESIGNDATE',
                    'RA_ID',
                    'BUSINESSDESIGNATED',
                    'DEFAULTROLEID'
                ],
                order: [['ID', 'DESC']],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_CODE'],

                        // include: [{

                        //     model: TBL_TYPE_MST, attributes: ['ID', 'TYPE_NAME']

                        // }],
                    },

                    {
                        model: TBL_SUBLOB_MST, attributes: ['ID', 'SUBLOB_CODE']
                    },
                    {
                        model: TBL_SBU_MST, attributes: ['ID', 'SBU_CODE']
                    },
                    {
                        model: TBL_BUSINESSGROUP_MST, attributes: ['ID', 'BG_NAME']
                    }


                ],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_USER_MST, param)
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



    router.route('/GetAllUSerdata')
        .get(function (req, res) {
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = {
                where: { ISACTIVE: true }, attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'LOGINID', 'DEPARTMENT', 'EMAILID'
                    , 'DESIGNATED', 'GREYLIST', 'TRADEREMAILIDS', 'ISIECOMPLIANCEMEMBER', 'ISRESEARCHANALYST', 'ISQUANTITATIVERESEARCHANALYST', 'ISGWMRAMEMBER', 'ISACTIVE'
                    , 'EFSLDESIGNATED', 'ISEGI', 'ISETLI', 'ENTRYTYPE', 'ISGM', 'ENTITY', 'PANCARDNO'
                    , 'ENTITYDESIG', 'DESIGNATION', 'SBU', 'SLOB', 'EMPJOINDATE', 'BG', 'RESIGNDATE', 'RA_ID', 'BUSINESSDESIGNATED'],
                    order: [['ID', 'DESC']],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_CODE'],
                        include: [{
                            model: TBL_SUBLOB_MST, attributes: ['ID', 'SUBLOB_CODE'],
                            include: [{ model: TBL_SBU_MST, attributes: ['ID', 'SBU_CODE'] }],
                            include: [{ model: TBL_BUSINESSGROUP_MST, attributes: ['ID', 'BG_NAME'] }],



                        }],


                    },

                ],

            };
            // console.log("param", param);
            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SUBLOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('subuserservice', 'GetAllLobMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                });

        });


    // .get(function (req, res) {
    //     const TBL_USER_MST = datamodel.TBL_USER_MST();

    //     var param = {
    //         attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'LOGINID', 'DEPARTMENT', 'EMAILID'
    //         , 'DESIGNATED', 'GREYLIST', 'TRADEREMAILIDS', 'ISIECOMPLIANCEMEMBER', 'ISRESEARCHANALYST', 'ISQUANTITATIVERESEARCHANALYST', 'ISGWMRAMEMBER', 'ISACTIVE'
    //         , 'EFSLDESIGNATED', 'ISEGI', 'ISETLI', 'ENTRYTYPE', 'ISGM', 'ENTITY', 'PANCARDNO'
    //         , 'ENTITYDESIG', 'DESIGNATION', 'SBU', 'SLOB', 'EMPJOINDATE', 'BG', 'RESIGNDATE', 'RA_ID', 'BUSINESSDESIGNATED'],
    //     };

    //     dataaccess.FindAll(TBL_USER_MST, param)
    //         .then(function (result) {
    //             // console.log("result",result);
    //             if (result != null) {

    //                 res.status(200).json({ Success: true, Message: 'TBL_USER_MST Table Access', Data: result });
    //             }
    //             else {
    //                 res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
    //             }
    //         }, function (err) {
    //             dataconn.errorlogger('user_MasterSevice', 'GetAlluser', err);
    //             res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
    //         });

    // });

    router.route('/GetAlluser')
        .get(function (req, res) {
            
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = {
                attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'LOGINID', 'DEPARTMENT', 'EMAILID'
                    , 'DESIGNATED', 'GREYLIST', 'TRADEREMAILIDS', 'ISIECOMPLIANCEMEMBER', 'ISRESEARCHANALYST', 'ISQUANTITATIVERESEARCHANALYST', 'ISGWMRAMEMBER', 'ISACTIVE'
                    , 'EFSLDESIGNATED', 'ISEGI', 'ISETLI', 'ENTRYTYPE', 'ISGM', 'ENTITY', 'PANCARDNO'
                    , 'ENTITYDESIG', 'DESIGNATION', 'SBU', 'SLOB', 'EMPJOINDATE', 'BG', 'RESIGNDATE', 'RA_ID', 'BUSINESSDESIGNATED'],
                    order: [['ID', 'DESC']],
            };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    // console.log("result",result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('user_MasterSevice', 'GetAlluser', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });

        });


    router.route('/GetusermstbyID/:ID')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = { where: { ID: req.params.ID } };

            dataaccess.FindOne(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST Data', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usermasterserice', 'GetusermstbyID', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });

        });



    router.route('/Saveusermstdetails')
        .post(function (req, res) {
            // console.log("Saveusermstdetails", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var values = {
                EMPNO: encryptmodel.EMPNO,
                FIRSTNAME: encryptmodel.FIRSTNAME,
                LASTNAME: encryptmodel.LASTNAME,
                LOGINID: encryptmodel.LOGINID,
                DEPARTMENT: encryptmodel.DEPARTMENT,
                EMAILID: encryptmodel.EMAILID,
                DSIGNATED: encryptmodel.DSIGNATED,
                GREYLIST: encryptmodel.GREYLIST,
                TRADEREMAILIDS: encryptmodel.TRADEREMAILIDS,
                ISIECOMPLIANCEMEMBER: encryptmodel.ISIECOMPLIANCEMEMBER,
                ISRESEARCHANALYST: encryptmodel.ISRESEARCHANALYST,
                ISQUANTITATIVERESEARCHANALYST: encryptmodel.ISQUANTITATIVERESEARCHANALYST,
                ISGWMRAMEMBER: encryptmodel.ISGWMRAMEMBER,
                ISACTIVE: encryptmodel.ISACTIVE,
                // ISEBUSINESSDESIGNATEDGI:req.body.ISEBUSINESSDESIGNATEDGI,
                EFSLDESIGNATED: encryptmodel.EFSLDESIGNATED,
                ISEGI: encryptmodel.ISEGI,
                ISETLI: encryptmodel.ISETLI,
                // ENTRYTYPE: req.body.ENTRYTYPE,
                ISGM: encryptmodel.ISGM,
                ENTITY: encryptmodel.ENTITY,
                PANCARDNO: encryptmodel.PANCARDNO,
                // ENTITYDESIG: req.body.ENTITYDESIG,
                DESIGNATION: encryptmodel.DESIGNATION,
                SBU: encryptmodel.SBU,
                SLOB: encryptmodel.SLOB,
                EMPJOINDATE: encryptmodel.EMPJOINDATE,
                BG: encryptmodel.BG,
                RESIGNDATE: null,
                RA_ID: encryptmodel.RA_ID,
                BUSINESSDESIGNATED: encryptmodel.BUSINESSDESIGNATED,
                DEFAULTROLEID: encryptmodel.DEFAULTROLEID,
                // CreatedBy: req.body.UserID,
                // CreatedDate: connect.sequelize.fn("NOW"),
            };

            console.log("Saveusermstdetails values", values);
            dataaccess.Create(TBL_USER_MST, values)
                .then(function (result) {
                    // console.log("result",result);
                    if (result != null) {
                        console.log("result1", result)
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST saved successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('user_MasterSevice', 'Saveusermstdetails', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });





    router.route('/Updateusermst')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var values = {
                // ID: req.body.ID,
                EMPNO: encryptmodel.EMPNO,
                FIRSTNAME: encryptmodel.FIRSTNAME,
                LASTNAME: encryptmodel.LASTNAME,
                LOGINID: encryptmodel.LOGINID,
                DEPARTMENT: encryptmodel.DEPARTMENT,
                EMAILID: encryptmodel.EMAILID,
                DSIGNATED: encryptmodel.DSIGNATED,
                GREYLIST: encryptmodel.GREYLIST,
                TRADEREMAILIDS: encryptmodel.TRADEREMAILIDS,
                ISIECOMPLIANCEMEMBER: encryptmodel.ISIECOMPLIANCEMEMBER,
                ISRESEARCHANALYST: encryptmodel.ISRESEARCHANALYST,
                ISQUANTITATIVERESEARCHANALYST: encryptmodel.ISQUANTITATIVERESEARCHANALYST,
                ISGWMRAMEMBER: encryptmodel.ISGWMRAMEMBER,
                ISACTIVE: encryptmodel.ISACTIVE,
                // ISEBUSINESSDESIGNATEDGI:req.body.ISEBUSINESSDESIGNATEDGI,
                EFSLDESIGNATED: encryptmodel.EFSLDESIGNATED,
                ISEGI: encryptmodel.ISEGI,
                ISETLI: encryptmodel.ISETLI,
                // ENTRYTYPE: req.body.ENTRYTYPE,
                ISGM: encryptmodel.ISGM,
                ENTITY: encryptmodel.ENTITY,
                PANCARDNO: encryptmodel.PANCARDNO,
                // ENTITYDESIG: req.body.ENTITYDESIG,
                DESIGNATION: encryptmodel.DESIGNATION,
                SBU: encryptmodel.SBU,
                SLOB: encryptmodel.SLOB,
                EMPJOINDATE: encryptmodel.EMPJOINDATE,
                BG: encryptmodel.BG,
                RESIGNDATE: encryptmodel.RESIGNDATE,
                RA_ID: encryptmodel.RA_ID,
                BUSINESSDESIGNATED: encryptmodel.BUSINESSDESIGNATED,
                DEFAULTROLEID: encryptmodel.DEFAULTROLEID,
                // ModifiedBy: req.body.UserID,
                // ModifiedDate: connect.sequelize.fn("NOW"),
            };
            var param = { ID: encryptmodel.ID };
            console.log("param user", values, param);
            dataaccess.Update(TBL_USER_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {
                        dataconn.errorlogger('user_MasterSevice', 'UpdateSeries', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('user_MasterSevice', 'UpdateSeries', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });



    router.route('/updateuser')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var values = {
                EMPNO: encryptmodel.EMPNO,
                FIRSTNAME: encryptmodel.FIRSTNAME,
                LASTNAME: encryptmodel.LASTNAME,
                LOGINID: encryptmodel.LOGINID,
                DEPARTMENT: encryptmodel.DEPARTMENT,
                EMAILID: encryptmodel.EMAILID,
                DSIGNATED: encryptmodel.DSIGNATED,
                GREYLIST: encryptmodel.GREYLIST,
                TRADEREMAILIDS: encryptmodel.TRADEREMAILIDS,
                ISIECOMPLIANCEMEMBER: encryptmodel.ISIECOMPLIANCEMEMBER,
                ISRESEARCHANALYST: encryptmodel.ISRESEARCHANALYST,
                ISQUANTITATIVERESEARCHANALYST: encryptmodel.ISQUANTITATIVERESEARCHANALYST,
                ISGWMRAMEMBER: encryptmodel.ISGWMRAMEMBER,
                ISACTIVE: encryptmodel.ISACTIVE,
                // ISEBUSINESSDESIGNATEDGI:req.body.ISEBUSINESSDESIGNATEDGI,
                EFSLDESIGNATED: encryptmodel.EFSLDESIGNATED,
                ISEGI: encryptmodel.ISEGI,
                ISETLI: encryptmodel.ISETLI,
                // ENTRYTYPE: req.body.ENTRYTYPE,
                ISGM: encryptmodel.ISGM,
                ENTITY: encryptmodel.ENTITY,
                PANCARDNO: encryptmodel.PANCARDNO,
                // ENTITYDESIG: req.body.ENTITYDESIG,
                DESIGNATION: encryptmodel.DESIGNATION,
                SBU: encryptmodel.SBU,
                SLOB: encryptmodel.SLOB,
                EMPJOINDATE: encryptmodel.EMPJOINDATE,
                BG: encryptmodel.BG,
                RESIGNDATE: encryptmodel.RESIGNDATE,
                RA_ID: encryptmodel.RA_ID,
                BUSINESSDESIGNATED: encryptmodel.BUSINESSDESIGNATED,

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_USER_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });






    router.route('/DeleteusermstByID')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            dataaccess.Update(TBL_USER_MST, { ISACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('userMasterService', 'DeleteusermstByID', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST Table', Data: null });
                });
        });


    router.route("/CheckDuplicatelogin/:Value/:Id")
        .get(function (req, res) {
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = {
                where: {
                    LOGINID: req.params.Value,
                    ISACTIVE: true,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SBU_NAME")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(TBL_SBU_MST, param).then(
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
                                Message: "sbu already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "sbu does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("sbuService", "CheckDuplicatesbu", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of sbu",
                            Data: null,
                        });
                }
            );
        });


    router.route('/GetAllbusinessgroupMst')
        .get(function (req, res) {

            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var param = { attributes: ['ID', 'BG_NAME'], where: { IS_ACTIVE: true } };

            dataaccess.FindAll(TBL_BUSINESSGROUP_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESSGROUP_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESSGROUP_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('businessgroupservice', 'GetAllbusinessgroupMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });


    router.route('/GetAllsbulistMst')
        .get(function (req, res) {

            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = {
                where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_ID', 'SBU_NAME', 'SBU_CODE'],
                include: [
                    { model: TBL_BUSINESSGROUP_MST, attributes: ['BG_NAME', 'ID'], where: { IS_ACTIVE: true } },
                ]

            };

            dataaccess.FindAll(TBL_SBU_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('sbulistservice', 'GetAllsbulistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });




    router.route('/GetAllsubLobMst')
        .get(function (req, res) {
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();

            var param = {
                where: { IS_ACTIVE: true }, attributes: ['ID', 'BG_ID', 'SBU_ID', 'LOB_ID', 'SUBLOB_NAME', 'SUBLOB_CODE', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_LOB_MST,
                        attributes: ['ID', 'LOB_NAME'],
                        include: [{
                            model: TBL_SBU_MST, attributes: ['ID', 'SBU_NAME'],
                            include: [{ model: TBL_BUSINESSGROUP_MST, attributes: ['ID', 'BG_NAME'] }]


                        }],


                    },

                ],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_SUBLOB_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SUBLOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('subuserservice', 'GetAllLobMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
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
                    dataconn.errorlogger('userservice', 'GetAllSBU', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                });

        });


    router.route('/GetAllsubLobname')
        .post(function (req, res) {
            // console.log("reqsid", req.params);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_LOB_MST = datamodel.TBL_SUBLOB_MST();
            var param = {
                where: { SBU_ID: encryptmodel.SBU_ID, IS_ACTIVE: true },
                attributes: ['ID', 'SUBLOB_NAME', 'SUBLOB_CODE']
            };

            dataaccess.FindAll(TBL_LOB_MST, param)
                .then(function (result) {
                    if (result != null) {
                        console.log("GetAllsubLobname", result)
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SUBLOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('userservice', 'GetAllsubLobname', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                });

        });


    router.route('/getallentity')
        .get(function (req, res) {
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'ENTITY_CODE', 'ENTITY_NAME']
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
                    dataconn.errorlogger('entitylistservice', 'GetAllentitylistMst', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/getallroles')
        .get(function (req, res) {
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'NAME', 'CODE']
            };

            dataaccess.FindAll(TBL_ROLE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ROLE_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ROLE_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('entitylistservice', 'getallroles', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });


    router.route('/getallUserbygraylistActive')
        .get(function (req, res) {
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = {
                where: { GREYLIST: true , ISACTIVE: true},
                attributes: ['ID', 'EMPNO', 'FIRSTNAME']
            };

            dataaccess.FindAll(TBL_USER_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('USERmastservice', 'getallUserbygraylistActive', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });



    return router;
};

module.exports = routes;


