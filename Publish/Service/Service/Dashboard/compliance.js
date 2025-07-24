var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const path = require('path')
const fs = require('fs')
const pdfMake = require('pdfmake');
var moment = require('moment');
const { Op, JSON } = require('sequelize');
const nodemailer = require('nodemailer');
const { log } = require('console');
let pgp = require('pg-promise')()
var config = require('../../Config');

var routes = function () {

    router.route('/GetAllHoliday')
        .get(function (req, res) {

            const TBL_Holiday_Master = datamodel.TBL_Holiday_Master();

            dataaccess.FindAll(TBL_Holiday_Master)

                .then(function (result) {

                    if (result != null) {

                        res.status(200).json({ Success: true, Message: 'TBL_Holiday_Master Table Access', Data: result });

                    }

                    else {

                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_Holiday_Master Table', Data: null });

                    }

                }, function (err) {

                    dataconn.errorlogger('ComplianceSevice', 'GetAllHoliday', err);

                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_Holiday_Master Table', Data: null });

                });



        });


    return router;
}

module.exports = routes;