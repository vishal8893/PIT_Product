var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {
    router.route('/GetAllMenuById/:Id')
        .get(async function (req, res) {
            
            let query = `SELECT "ui"."ID", "ui"."PARENETID", "ui"."TITLE", "ui"."PATH", "ui"."ICON", "ui"."CSSCLASS", 
            "ui"."ISCHILD", "ui"."IS_ACTIVE", "uiroles"."ID" AS "uiroles.ID", "uiroles"."UUID" AS "uiroles.UUID", 
            "uiroles"."ROLEID" AS "ROLEID", "uiroles"."VIEWER" AS "uiroles.VIEWER",
            "uiroles"."MAKER" AS "uiroles.MAKER", "uiroles"."CHECKER" AS "uiroles.CHECKER",
            "uiroles"."APPROVER" AS "uiroles.APPROVER", "uiroles"."EDIT" AS "uiroles.EDIT", 
            "uiroles"."EXPORT" AS "uiroles.EXPORT", "uiroles"."UPLOAD" AS "uiroles.UPLOAD",
            "uiroles"."IS_ACTIVE" AS "uiroles.IS_ACTIVE" FROM "TBL_UI_MST" AS "ui" 
            INNER JOIN "TBL_UIROLE_MAP" AS "uiroles" ON "ui"."ID" = "uiroles"."UUID" 
            AND ("uiroles"."VIEWER" = true OR "uiroles"."MAKER" =
            true OR "uiroles"."CHECKER" = true OR "uiroles"."APPROVER" = true OR 
            "uiroles"."EDIT" = true) 
            AND "uiroles"."ROLEID" = '${req.params.Id}' WHERE "ui"."IS_ACTIVE" = true ORDER BY "ui"."SEQUENCE";`
            let menuItem = await connect.sequelize.query(query);
            console.log("query12345", query);
            if (menuItem[0].length) {
                res.status(200).json({ Success: true, Message: 'Authentication Accesable', Data: menuItem[0] });
            }
            else {
                res.status(200).json({ Success: false, Message: 'No user found', Data: null });

            }
            return;
        });

    router.route('/GetAllActiveMenu')
        .get(function (req, res) {
            const TBL_UI_MST = datamodel.TBL_UI_MST();
            var param = { where: { IS_ACTIVE: true }, attributes: ['ID', 'PARENETID', 'TITLE'], order: ['SEQUENCE'] };

            dataaccess.FindAll(TBL_UI_MST, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Menus', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('MenuService', 'GetAllActiveMenu', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                });

        });

    router.route('/GetAluiroleMenu')
        .get(function (req, res) {
            const uiMst = datamodel.uirolemap();
            var param = {
                where: { isactive: true },
                attributes: ['uuid', 'roleid', 'viewer', 'maker', 'checker', 'approver', 'edit', 'export', 'upload', 'isactive'],
                order: ['Id']
            };

            dataaccess.FindAll(uiMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Menus', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('MenuService', 'GetAllActiveMenu', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of Menu', Data: null });
                });

        });
    return router;
}
module.exports = routes;

