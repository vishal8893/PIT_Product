var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllActiveexpirydate')
        .get(function (req, res) {

            const TBL_EXPIRY_DATE_MST = datamodel.TBL_EXPIRY_DATE_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'EXPIRY_DATE', 'IS_ACTIVE'], order: [['ID', 'DESC']] };

            dataaccess.FindAll(TBL_EXPIRY_DATE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'EXPIRY DATE Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleRoute', 'GetAllActiveRole', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Role Table', Data: null });
                });
        });

    router.route('/UpdateexpiryMaster')
        .post(function (req, res) {
            const TBL_EXPIRY_DATE_MST = datamodel.TBL_EXPIRY_DATE_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var values = {
                EXPIRY_DATE: encryptmodel.EXPIRY_DATE,
                IS_ACTIVE: encryptmodel.IS_ACTIVE,
                // MODIFIED_ON: connect.sequelize.fn('NOW'),

            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_EXPIRY_DATE_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_EXPIRY_DATE_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/CreateExpiraydate')
        .post(function (req, res) {
            const TBL_EXPIRY_DATE_MST = datamodel.TBL_EXPIRY_DATE_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var values = {
                EXPIRY_DATE: encryptmodel.EXPIRY_DATE,
                IS_ACTIVE: encryptmodel.IS_ACTIVE,
                // CREATED_ON: connect.sequelize.fn("NOW"),
            };
            dataaccess.Create(TBL_EXPIRY_DATE_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ExpirayDatemstService', 'CreateExpiraydate', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });


    router.route('/CheckDuplicateExpiraydate/:Value/:Id')
        .get(function (req, res) {

            const TBL_EXPIRY_DATE_MST = datamodel.TBL_EXPIRY_DATE_MST();
            var param = {
                where: { EXPIRY_DATE: { [connect.Op.iLike]: req.params.Value }, ID: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('EXPIRY_DATE')), 'Count']]
            };

            dataaccess.FindAll(TBL_EXPIRY_DATE_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'expirayDateMst Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'expirayDateMst Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('expirayDateMstService', 'CheckDuplicateexpirayDateMst', err);
                        res.status(200).json({ Success: false, Message: 'expirayDateMst Has No Access Of expirayDateMst Table', Data: null });
                    });
        });

    router.route('/checkduplicate')
        .post(function (req, res) {

            const BranchMst = datamodel.TBL_EXPIRY_DATE_MST();
            // console.log(req.body.ENTITY_CODE);
            // console.log(req.body.IFSC_Code);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var param = {
                where: {
                    EXPIRY_DATE: encryptmodel.EXPIRY_DATE,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("EXPIRY_DATE")),
                        "Count"
                    ],

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
                                Message: "EXPIRY_DATE already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "EXPIRY_DATE does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("expirydateservice", "checkduplicate", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of EXPIRY_DATE",
                            Data: null,
                        });
                }
            );

        });


    router.route('/DeleteroleById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                       
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_EXPIRY_DATE_MST = datamodel.TBL_EXPIRY_DATE_MST();
            dataaccess.Update(TBL_EXPIRY_DATE_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EXPIRY_DATE_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('GroupMasterService', 'DeleteGroupById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_EXPIRY_DATE_MST Table', Data: null });
                });
        });



    router.route('/Updateusermst')
        .post(function (req, res) {
            console.log("body", req.body);
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var values = {
                // ID: req.body.ID,
                // EMPNO: req.body.EMPNO,
                // FIRSTNAME: req.body.FIRSTNAME,
                // LASTNAME: req.body.LASTNAME,
                LOGINID: req.body.LOGINID,
                // DEPARTMENT: req.body.DEPARTMENT,
                // EMAILID: req.body.EMAILID,
                // DSIGNATED: req.body.DSIGNATED,
                // GREYLIST: req.body.GREYLIST,
                // TRADEREMAILIDS: req.body.TRADEREMAILIDS,
                // ISIECOMPLIANCEMEMBER: req.body.ISIECOMPLIANCEMEMBER,
                // ISRESEARCHANALYST: req.body.ISRESEARCHANALYST,
                // ISQUANTITATIVERESEARCHANALYST: req.body.ISQUANTITATIVERESEARCHANALYST,
                // ISGWMRAMEMBER: req.body.ISGWMRAMEMBER,
                // ISACTIVE: req.body.ISACTIVE,
                // // ISEBUSINESSDESIGNATEDGI:req.body.ISEBUSINESSDESIGNATEDGI,
                // EFSLDESIGNATED: req.body.EFSLDESIGNATED,
                // ISEGI: req.body.ISEGI,
                // ISETLI: req.body.ISETLI,
                // // ENTRYTYPE: req.body.ENTRYTYPE,
                // ISGM: req.body.ISGM,
                // ENTITY: req.body.ENTITY,
                // PANCARDNO: req.body.PANCARDNO,
                // // ENTITYDESIG: req.body.ENTITYDESIG,
                // DESIGNATION: req.body.DESIGNATION,
                // SBU: req.body.SBU,
                // SLOB: req.body.SLOB,
                // EMPJOINDATE: req.body.EMPJOINDATE,
                // BG: req.body.BG,
                // RESIGNDATE: req.body.RESIGNDATE,
                // RA_ID: req.body.RA_ID,
                // BUSINESSDESIGNATED: req.body.BUSINESSDESIGNATED,
                // ModifiedBy: req.body.UserID,
                // ModifiedDate: connect.sequelize.fn("NOW"),
            };
            var param = { ID: req.body.ID };
            console.log("param user", values, param);
            dataaccess.Update(TBL_USER_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST updated successfully', Data: result });
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


    return router;
};

module.exports = routes;


