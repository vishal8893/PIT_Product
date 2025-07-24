var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
var routes = function () {

    router.route('/GetAllPITypeData')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: ['PIType']
                }
            };

            dataaccess.FindAll(TBL_GENERIC_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_GENERIC_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'GetAllPITypeData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/GetAllPICategoryData')
        .get(function (req, res) {

            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();

            var param = {
                attributes: ['ID', 'NAME'],
                where: {
                    GROUP_NAME: 'PICategory'
                }
            };

            dataaccess.FindAll(TBL_GENERIC_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_GENERIC_MST List Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST List Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'GetAllPICategoryData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GENERIC_MST Table', Data: null });
                });
        });

    router.route('/GetAllItradingPrimaryIssues')
        .get(function (req, res) {
            const TBL_GENERIC_MST = datamodel.TBL_GENERIC_MST();
            const TBL_ITRADING_PRIMARY_ISSUE_MST = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();
            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'TRX_NO', 'IPOID', 'LOCATION', 'COMPANY', 'NAME_OF_ISSUE', 'ISSUE_DESC', 'OPEN_FROM_DATE', 'OPEN_TILL_DATE', 'MIN_BID_PRICE', 'MAX_BID_PRICE', 'LOT_SIZE', 'IRF_FORMAT', 'PRIMARY_ISSUE_TYPE', 'PRIMARY_ISSUE_CATEGORY', 'IS_ACTIVE'],
                order: [['ID', 'DESC']],
                include: [
                    {
                        model: TBL_GENERIC_MST,
                        as: 'Type',
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: ['PIType'],
                        },
                    },
                    {
                        model: TBL_GENERIC_MST,
                        as: 'Category',
                        attributes: ['ID', 'NAME'],
                        where: {
                            GROUP_NAME: ['PICategory'],
                        },
                    }
                ],
            };

            dataaccess.FindAll(TBL_ITRADING_PRIMARY_ISSUE_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ITRADING_PRIMARY_ISSUE_MST Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ITRADING_PRIMARY_ISSUE_MST', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'GetAllItradingPrimaryIssues', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ITRADING_PRIMARY_ISSUE_MST', Data: null });
                });
        });

    router.route('/CreatItradingPrimaryIssues')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ITRADING_PRIMARY_ISSUE_MST = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();
            var values = {
                NAME_OF_ISSUE: encryptmodel.NAME_OF_ISSUE,
                ISSUE_DESC: encryptmodel.ISSUE_DESC,
                OPEN_FROM_DATE: encryptmodel.OPEN_FROM_DATE,
                OPEN_TILL_DATE: encryptmodel.OPEN_TILL_DATE,
                MIN_BID_PRICE: encryptmodel.MIN_BID_PRICE,
                MAX_BID_PRICE: encryptmodel.MAX_BID_PRICE,
                LOT_SIZE: encryptmodel.LOT_SIZE,
                PRIMARY_ISSUE_TYPE: encryptmodel.PRIMARY_ISSUE_TYPE,
                PRIMARY_ISSUE_CATEGORY: encryptmodel.PRIMARY_ISSUE_CATEGORY,
                IS_ACTIVE: true,

            };
            dataaccess.Create(TBL_ITRADING_PRIMARY_ISSUE_MST, values)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'Expiraydate saved successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'CreatItradingPrimaryIssues', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateItradingPrimaryIssues')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_ITRADING_PRIMARY_ISSUE_MST = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();
            var values = {
                NAME_OF_ISSUE: encryptmodel.NAME_OF_ISSUE,
                ISSUE_DESC: encryptmodel.ISSUE_DESC,
                OPEN_FROM_DATE: encryptmodel.OPEN_FROM_DATE,
                OPEN_TILL_DATE: encryptmodel.OPEN_TILL_DATE,
                MIN_BID_PRICE: encryptmodel.MIN_BID_PRICE,
                MAX_BID_PRICE: encryptmodel.MAX_BID_PRICE,
                LOT_SIZE: encryptmodel.LOT_SIZE,
                PRIMARY_ISSUE_TYPE: encryptmodel.PRIMARY_ISSUE_TYPE,
                PRIMARY_ISSUE_CATEGORY: encryptmodel.PRIMARY_ISSUE_CATEGORY,
                IS_ACTIVE: true,


            };
            var param = { ID: encryptmodel.ID };
            dataaccess.Update(TBL_ITRADING_PRIMARY_ISSUE_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ITRADING_PRIMARY_ISSUE_MST updated successfully', Data: EncryptLoginDetails });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'UpdateItradingPrimaryIssues', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/DeleteItradingPrimaryIssues')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);

            const TBL_ITRADING_PRIMARY_ISSUE_MST = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();
            dataaccess.Update(TBL_ITRADING_PRIMARY_ISSUE_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ITRADING_PRIMARY_ISSUE_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('itradingPrimaryIssueMaster', 'DeleteItradingPrimaryIssues', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ITRADING_PRIMARY_ISSUE_MST Table', Data: null });
                });
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();

            var param = {
                where: {
                    // NAME_OF_ISSUE: req.body.NAME_OF_ISSUE,
                    [sequelize.Op.or]: [
                        sequelize.where(sequelize.fn('LOWER', sequelize.col('NAME_OF_ISSUE')), '=', encryptmodel.NAME_OF_ISSUE.toLowerCase()),
                        sequelize.where(sequelize.fn('UPPER', sequelize.col('NAME_OF_ISSUE')), '=', encryptmodel.NAME_OF_ISSUE.toUpperCase())
                    ],
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("NAME_OF_ISSUE")),
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
                                Message: "NAME_OF_ISSUE already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "NAME_OF_ISSUE does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("itradingPrimaryIssueMaster", "CheckDuplicate", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of NAME_OF_ISSUE",
                            Data: null,
                        });
                }
            );

        });

    router.route("/CheckDuplicateprimaryissuerejection/:Value/:Id")
        .get(function (req, res) {
            const TBL_ITRADING_PRIMARY_ISSUE_MST = datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();
            var param = {
                where: {
                    NAME_OF_ISSUE: req.params.Value,
                    ID: {
                        [connect.Op.ne]: req.params.Id,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("NAME_OF_ISSUE")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(TBL_ITRADING_PRIMARY_ISSUE_MST, param).then(
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
                                Message: "itradingPrimaryIssue already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "itradingPrimaryIssue does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("itradingPrimaryIssueMaster", "CheckDuplicateprimaryissuerejection", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of itradingPrimaryIssue",
                            Data: null,
                        });
                }
            );
        });


    router.route('/GetAllNameofissue')
        .get(async function (req, res) {

            const query = `SELECT "NAME_OF_ISSUE"
            FROM "TBL_ITRADING_PRIMARY_ISSUE_MST"
            WHERE
                "IS_ACTIVE" = true
                AND (
                    "OPEN_FROM_DATE" = CURRENT_DATE
                    OR "OPEN_TILL_DATE" = CURRENT_DATE
                    OR ("OPEN_FROM_DATE" <= CURRENT_DATE AND "OPEN_TILL_DATE" >= CURRENT_DATE)
                );
            `;

            // const result = await connect.sequelize.query(query);
            // const data = result[0].NAME_OF_ISSUE
            // console.log("result",data);

            connect.sequelize.query(query)
                .then(function (result) {
                    if (result && result[0]) {
                        const data = result[0];
                        var EncryptLoginDetails = dataconn.encryptionAES(data);
                        res.status(200).json({ Success: true, Message: 'UPSI Project Data Access', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access UPSI Project', Data: null });
                    }
                })
                .catch(function (err) {
                    dataconn.errorlogger('createUPSIProjectmstService', 'GetAllProjectDetails', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of UPSI Project', Data: null });
                });
        });




    return router;
};

module.exports = routes;


