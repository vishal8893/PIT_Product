var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/GetUIRoleMap/:ID')

        .get(function (req, res) {

            const TBL_UIROLE_MAP = datamodel.TBL_UIROLE_MAP();
            const TBL_ROLE_MST = datamodel.TBL_ROLE_MST();
            var param = {
                where: { ROLEID: req.params.ID },
                include: [
                    { model: TBL_ROLE_MST, attributes: ['CODE'], where: { IS_ACTIVE: true } },
                ]
            };
            dataaccess.FindAll(TBL_UIROLE_MAP, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'UI Role Table Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of UI Role Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UIRoleService', 'GetUIRoleMap', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UI Role Table', Data: null });
                });
        });

    router.route('/CreateUIRoleMap')
        .post(function (req, res) {
            console.log("req.body", req.body);
            connect.sequelize.transaction().then(trans => {

                const UIRoleMapModel = datamodel.TBL_UIROLE_MAP();
                var param = { ROLEID: req.body.RoleId };

                dataaccess.DeleteWithTransaction(UIRoleMapModel, param, trans)
                    .then((resultDel) => {
                        var mapParams = [];
                        var UIRoleMap = JSON.parse(req.body.UIRoleMap);
                        var promises = UIRoleMap.map(function (mapitem) {
                            mapParams.push({
                                ROLEID: req.body.RoleId,
                                UUID: mapitem.uuid,
                                VIEWER: mapitem.viewer,
                                MAKER: mapitem.maker,
                                CHECKER: mapitem.checker,
                                APPROVER: mapitem.approver,
                                EDIT: mapitem.edit,
                                EXPORT: mapitem.export,
                                UPLOAD: mapitem.upload,
                                MODIFIED_BY: req.body.UserId,
                                MODIFIED_ON: connect.sequelize.fn('NOW')
                            });
                        });

                        Promise.all(promises).then(function () {
                            dataaccess.BulkCreateWithTransaction(UIRoleMapModel, mapParams, trans)
                                .then((result) => {
                                    trans.commit();
                                    res.status(200).json({ Success: false, Message: "UI Role Config Saved Successfully", Data: result });
                                },
                                    function (err) {
                                        trans.rollback();
                                        dataconn.errorlogger('UIRoleService', 'CreateUIRoleMap', err);
                                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Record', Data: null });
                                    });
                        });
                    }, (err) => {
                        trans.rollback();
                        dataconn.errorlogger('UIRoleService', 'CreateUIRoleMap', err);
                        res.status(200).json({ Success: false, Message: 'Error Occurred While Saving Records', Data: null });

                    });
            });
        });

    return router;

};

module.exports = routes;