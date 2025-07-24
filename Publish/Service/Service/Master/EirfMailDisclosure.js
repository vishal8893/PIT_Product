var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { Op } = require('sequelize');
var Sequelize = connect.Sequelize;

var routes = function () {
    router.route('/getEirfMailDisclosure')
        .post(async function (req, res) {
            let Id = req.body.Quarter
            let YearDate = req.body.Currentyear
            // console.log("new",Id,YearDate);
            let quiry = `SELECT "b"."QuarterName","c"."FIRSTNAME" as "UserName", "a".*
            FROM public."EIRF_Disclaimer_Status" AS "a"
            LEFT JOIN "TBL_QuarterMaster" AS "b" ON "a"."QuarterID"::text = "b"."QuarterId"::text
            LEFT JOIN "TBL_USER_MST" AS "c" ON "a"."CREATED_BY"="c"."EMPNO"
			where  "a"."QuarterID" = '${Id}' AND "a"."YEAR" = '${YearDate}';`
            
            let result = await connect.sequelize.query(quiry);
            if (result) {
                res.status(200).json({ Success: true, Message: 'EirfMailDisclosure List Table Access', Data: result[0] });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User Has No Access Of EirfMailDisclosure', Data: null });
            }
        });


    router.route('/updateEirfMailDisclosure')
        .post(function (req, res) {
            const EIRF_Disclaimer_Status = datamodel.EIRF_Disclaimer_Status();
            let values = {
                IS_ACTIVE: req.body.Is_Active
            }
            var param = {
                Id: req.body.ID
            };

            dataaccess.Update(EIRF_Disclaimer_Status, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'updateEirfMailDisclosure Succefully', Data: null });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of updateEirfMailDisclosure Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('EirfMailDisclosureService', 'updateEirfMailDisclosure', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of updateEirfMailDisclosure Table', Data: null });
                });
        });

    return router;
};

module.exports = routes;