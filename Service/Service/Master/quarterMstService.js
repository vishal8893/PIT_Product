var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllQuarterData')
        .get(function (req, res) {
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            var param = {
                attributes: ['QuarterId', 'QuarterName', 'CurrentActive', 'CREATED_BY', 'StartDate', 'EndDate', 'CREATED_ON', 'MODIFIED_BY', 'MODIFIED_ON'],
                order: [['QuarterId', 'DESC']],
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
                    dataconn.errorlogger('quarterMstService', 'GetAllQuarterData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_QuarterMaster', Data: null });
                });
        });

    router.route('/UpdatequarterData')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            var values = {
                CurrentActive: false
            };
            var param = { CurrentActive: true };

            dataaccess.Update(TBL_QuarterMaster, values,param)
                .then(function (result) {
                    if (result != null) {
                        var values1 = {
                            CurrentActive: encryptmodel.active
                        };
                        var param1 = { QuarterId: encryptmodel.ID };
                        dataaccess.Update(TBL_QuarterMaster, values1, param1)
                            .then(function (result1) {
                                if (result1 != null) {
                                    var EncryptLoginDetails = dataconn.encryptionAES(result1);
                                    res.status(200).json({ Success: true, Message: 'TBL_QuarterMaster updated successfully', Data: EncryptLoginDetails });
                                } else {
                                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                }

                            })

                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('quarterMstService', 'UpdatequarterData', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });


        router.route('/GetAllactivequarter')
        .get(function (req, res) {
            const TBL_QuarterMaster = datamodel.TBL_QuarterMaster();
            var param = {
                where:{
                    CurrentActive:true
                }
                // attributes: ['QuarterId', 'QuarterName', 'CurrentActive', 'CREATED_BY', 'StartDate', 'EndDate', 'CREATED_ON', 'MODIFIED_BY', 'MODIFIED_ON'],
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


    return router;
};

module.exports = routes;


