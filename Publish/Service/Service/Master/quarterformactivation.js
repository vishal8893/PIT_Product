var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;

var routes = function () {

    router.route('/GetAllactivequarter')
        .get(function (req, res) {
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            var param = {
                where: {
                    CurrentActive: true
                }
            };

            dataaccess.FindAll(TBL_QuarterMaster, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_QuarterMaster Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('quarterMstService', 'GetAllactivequarter', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster', Data: null });
                });
        });

    router.route('/GetAllquarterformdata')
        .get(function (req, res) {
            const TBL_Quarter_Form_Activation_Master = datamodel.TBL_Quarter_Form_Activation_Master();
            var param = {
                attributes: ['ID', 'QuarterId', 'QuarterName', 'StartDate', 'EndDate', 'Year', 'CurrentActive', 'CREATED_BY', 'CREATED_ON', 'MODIFIED_BY', 'MODIFIED_ON'],
                order: [['ID', 'DESC']],
            };

            dataaccess.FindAll(TBL_Quarter_Form_Activation_Master, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_Quarter_Form_Activation_Master Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_Quarter_Form_Activation_Master', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('quarterMstService', 'GetAllQuarterData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_Quarter_Form_Activation_Master', Data: null });
                });
        });

    router.route('/CreatequarterData')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_Quarter_Form_Activation_Master = datamodel.TBL_Quarter_Form_Activation_Master();

            var values = {
                QuarterName: encryptmodel.quartrename,
                StartDate: encryptmodel.startdate,
                CREATED_BY: encryptmodel.createdby,
                Year: encryptmodel.year,
                EndDate: encryptmodel.enddate,
                QuarterId: encryptmodel.currquatid
            };

            dataaccess.Create(TBL_Quarter_Form_Activation_Master, values)
                .then(function (result) {
                    if (result != null) {

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_Quarter_Form_Activation_Master created successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('quarterMstService', 'CreatequarterData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/checkduplicate')
        .post(async (req, res) => {
            try {
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                console.log(encryptmodel)

                const TBL_Quarter_Form_Activation_Master = datamodel.TBL_Quarter_Form_Activation_Master();
                var param = {
                    where: {
                        [sequelize.Op.or]: [
                            sequelize.where(sequelize.fn('LOWER', sequelize.col('QuarterName')), '=', encryptmodel.quartrename),
                        ],
                        Year: encryptmodel.year
                    }
                };

                dataaccess.FindOne(TBL_Quarter_Form_Activation_Master, param)
                    .then(function (result) {
                        if (result != null) {
                            res.status(200).json({ isDuplicate: true, Message: 'Quarter already exists for this year.' });
                        }
                        else {
                            res.status(200).json({ isDuplicate: false, Message: 'Quarter does not exist for this year.' });
                        }
                    }, function (err) {
                        dataconn.errorlogger('APService', 'GetAlltablerecordbyverifier', err);
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of quarter table', Data: null });
                    });

            } catch (error) {
                console.error('Error checking for qualification:', error);
                res.status(500).json({ Success: false, Message: 'An error occurred while checking for quarter.', Data: null });
            }
        });

    router.route('/UpdatequarterData')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            // console.log('updaterecord',encryptmodel);
            const TBL_Quarter_Form_Activation_Master = datamodel.TBL_Quarter_Form_Activation_Master();

            var values = {
                QuarterName: encryptmodel.quartrename,
                StartDate: encryptmodel.startdate,
                MODIFIED_BY: encryptmodel.modifiedby,
                Year: encryptmodel.year,
                EndDate: encryptmodel.enddate,
                QuarterId: encryptmodel.currquatid
            };

            var param = {
                ID: encryptmodel.ID
            }

            dataaccess.Update(TBL_Quarter_Form_Activation_Master, values, param)
                .then(function (result) {
                    if (result != null) {

                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_Quarter_Form_Activation_Master updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('quarterMstService', 'UpdatequarterData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });


    return router;
};

module.exports = routes;


