var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var Connect = require('../../Data/Connect');

var routes = function () {
    router.route('/getapplicationname')
        .post(async function (req, res) {

            var reqbody = req.body;
            console.log(`Insert`, reqbody);
            var querytext = `SELECT * from pit_get_sos_rights( :applicationname);`;
            var param = {
                replacements: {
                    applicationname: reqbody.ApplicationName,

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('paramforappname', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("resultappname", result)
                    res.status(200).json({ Success: true, Message: "", Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('joiningdeclaration', 'getapplicationname', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of pit_get_sos_rights', Data: null });
                    });
        });

    router.route('/getlemploggedininfo')
        .post(async function (req, res) {

            var reqbody = req.body;
            console.log(`Insert`, reqbody);
            var querytext = `SELECT * from get_pit_sso_loggedininfo( :employeeid);`;
            var param = {
                replacements: {
                    employeeid: reqbody.EmployeeId,

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('paramforemploggedininfo', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("resultemploggedininfo", result)
                    res.status(200).json({ Success: true, Message: "", Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('joiningdeclaration', 'getlemploggedininfo', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of get_pit_sso_loggedininfo', Data: null });
                    });
        });

    router.route('/GetAllApplink')
        .get(function (req, res) {
            const TBL_PIT_APPLICATION_LINK = datamodel.TBL_PIT_APPLICATION_LINK();

            var param = {
                attributes: ['ID', 'EIRF_LINK', 'EAH_LINK', 'POB_LINK', 'LANDING_PAGE_LINK'],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_PIT_APPLICATION_LINK, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_PIT_APPLICATION_LINK Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PIT_APPLICATION_LINK Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'GetAllApplink', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_PIT_APPLICATION_LINK Table', Data: null });
                });

        });

    router.route('/checkEmployeeEmailStatus')
        .get(function (req, res) {
            const TBL_POB_EMAIL_STATUS = datamodel.TBL_POB_EMAIL_STATUS();
            const TBL_USER_MST = datamodel.TBL_USER_MST();


            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'EMAILID', 'EMAIL_STATUS', 'EMAIL_TYPE', 'EMAIL_DATE', 'IS_TRACKEDEMP'],
                // include: [
                //     {
                //         model: TBL_USER_MST,
                //         attributes: ['ID', 'FIRSTNAME', 'EMAILID'],
                //     },

                // ],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_POB_EMAIL_STATUS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_PIT_APPLICATION_LINK Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_EMAIL_STATUS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'checkEmployeeEmailStatus', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_EMAIL_STATUS Table', Data: null });
                });

        });

    router.route('/checkPOBAcceptPIT')
        .get(function (req, res) {
            const TBL_POB_PITCODE_ACCEPT = datamodel.TBL_POB_PITCODE_ACCEPT();
            const TBL_USER_MST = datamodel.TBL_USER_MST();


            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'ACCEPT_DATE'],
                // include: [
                //     {
                //         model: TBL_USER_MST,
                //         attributes: ['ID', 'FIRSTNAME'],
                //     },

                // ],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_POB_PITCODE_ACCEPT, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_PIT_APPLICATION_LINK Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_PITCODE_ACCEPT Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'checkPOBAcceptPIT', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_PITCODE_ACCEPT Table', Data: null });
                });

        });

    router.route('/checkPOBDeclaration')
        .get(function (req, res) {
            const TBL_POB_DECLARATION = datamodel.TBL_POB_DECLARATION();
            const TBL_USER_MST = datamodel.TBL_USER_MST();

            var param = {
                attributes: ['ID', 'EMPLOYEE_ID', 'DECLARE_DATE'],
                // include: [
                //     {
                //         model: TBL_USER_MST,
                //         attributes: ['ID', 'FIRSTNAME'],
                //     },

                // ],
            };

            console.log("param", param);
            dataaccess.FindAll(TBL_POB_DECLARATION, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_PIT_APPLICATION_LINK Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_DECLARATION Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'checkPOBDeclaration', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_POB_DECLARATION Table', Data: null });
                });

        });

    router.route('/PostEAHPOBAcceptPIT')
        .post(function (req, res) {

            const TBL_POB_PITCODE_ACCEPT = datamodel.TBL_POB_PITCODE_ACCEPT();
            var values = {
                EMPLOYEE_ID: req.body.employee_Id,
                IS_ACTIVE: true,

            };

            dataaccess.Create(TBL_POB_PITCODE_ACCEPT, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'm3upsi saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('joiningdeclaration', 'PostEAHPOBAcceptPIT', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });
    return router;
}

module.exports = routes;