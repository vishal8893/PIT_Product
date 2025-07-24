var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var Connect = require('../../Data/Connect');
var connect = require('../../Data/Connect');

var routes = function () {

    router.route('/GetAllUserCatlist')
        .get(function (req, res) {
            const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();

            var param = {
                where: { IS_ACTIVE: true },
                attributes: ['ID', 'ENTITY_ID', 'SBU_ID', 'LOB_ID', 'SUBLOB_ID', 'CEO_TWO_LEVEL_DOWN', 'SVP_ABOVE', 'ALL_EMPLOYEEES', 'TEAM_ID', 'IS_ACTIVE'],
                order: [['ID', 'DESC']],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME'],
                    },
                    {
                        model: TBL_SBU_MST,
                        attributes: ['ID', 'SBU_NAME']
                    },
                    {
                        model: TBL_LOB_MST,
                        attributes: ['ID', 'LOB_NAME']
                    },
                    {
                        model: TBL_SUBLOB_MST,
                        attributes: ['ID', 'SUBLOB_NAME']
                    }

                ],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_USER_CATEGORIZATION_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_USER_CATEGORIZATION_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'GetAllUserCatlist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                });

        });

    router.route('/GetAllUSerdata1')
        .get(function (req, res) {

            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            const TBL_BUSINESSGROUP_MST = datamodel.TBL_BUSINESSGROUP_MST();
            var param = {
                where: {ISACTIVE:true},
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

    router.route('/GetAllDesignate')
        .get(function (req, res) {
            const TBL_DESGINATED_CEO_BH_MAPPING_MST = datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var param = {where: {IS_ACTIVE:true},
                attributes: ['ID', 'EMPLOYEE_ID', 'EMP_NAME', 'ENTITY_ID', 'IS_ACTIVE'],
                include: [
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME'],
                    },
                    // {
                    //     model: TBL_USER_MST,
                    //     attributes: ['ID', 'FIRSTNAME']
                    // },
                ],

            };            
            console.log("param", param);
            dataaccess.FindAll(TBL_DESGINATED_CEO_BH_MAPPING_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_USER_CATEGORIZATION_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'GetAllDesignate', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                });

        });

    router.route('/GetAllEntCEOBMlist')
        .get(function (req, res) {

            const TBL_ENTITY_CEO_BH_MAPPING_MST = datamodel.TBL_ENTITY_CEO_BH_MAPPING_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();

            var param = {where: {IS_ACTIVE:true},
                attributes: ['ID', 'EMPLOYEE_ID', 'EMP_NAME', 'ENTITY_ID', 'IS_ACTIVE'],
                include: [
                    // {
                    //     model: TBL_USER_MST,
                    //     attributes: ['ID', 'FIRSTNAME'],
                    // },
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME']
                    }

                ],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_ENTITY_CEO_BH_MAPPING_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_CEO_BH_MAPPING_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_CEO_BH_MAPPING_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('entityceobhmappingservice', 'GetAllEntCEOBMlist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_CEO_BH_MAPPING_MST Table', Data: null });
                });

        });

    router.route('/GetAllEntMatSubCEOBHlist')
        .get(function (req, res) {
            const TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST = datamodel.TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST();
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            const TBL_MATERIALSUBSIDIARY_MST = datamodel.TBL_MATERIALSUBSIDIARY_MST();

            var param = { where: {IS_ACTIVE:true},
                attributes: ['ID', 'EMPLOYEE_ID', 'EMP_NAME', 'ENTITY_ID', 'MATERIAL_ID', 'IS_ACTIVE'],
                include: [
                    // {
                    //     model: TBL_USER_MST,
                    //     attributes: ['ID', 'FIRSTNAME'],
                    // },
                    {
                        model: TBL_ENTITY_MST,
                        attributes: ['ID', 'ENTITY_NAME']
                    },
                    {
                        model: TBL_MATERIALSUBSIDIARY_MST,
                        attributes: ['ID', 'MATERIALSUBSIDIARY_NAME']
                    }

                ],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('entitymstsubceobhmappingservice', 'GetAllEntMatSubCEOBHlist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table', Data: null });
                });

        });

    router.route('/GetAlldesignation')
        .get(function (req, res) {
            const TBL_DESIGNATION_MST = datamodel.TBL_DESIGNATION_MST();

            var param = {
                attributes: ['ID', 'DESIGNATION', 'IS_ACTIVE'],

            };
            console.log("param", param);
            dataaccess.FindAll(TBL_DESIGNATION_MST, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('entitymstsubceobhmappingservice', 'GetAllEntMatSubCEOBHlist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST Table', Data: null });
                });

        });

    router.route('/GetAllentitylist')
        .get(function (req, res) {

            const TBL_ENTITY_MST = datamodel.TBL_ENTITY_MST();
            var param = {where: {IS_ACTIVE:true}, attributes: ['ID', 'ENTITY_NAME'] };

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
                    dataconn.errorlogger('usercategorizationservice', 'GetAllentitylist', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_ENTITY_MST Table', Data: null });
                });
        });

    router.route('/GetAllSBU')
        .get(function (req, res) {

            const TBL_SBU_MST = datamodel.TBL_SBU_MST();
            var param = {where: {IS_ACTIVE:true}, attributes: ['ID', 'SBU_NAME'] };

            dataaccess.FindAll(TBL_SBU_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SBU_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'GetAllSBU', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SBU_MST Table', Data: null });

                });
        });

    router.route('/GetAllLob')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_LOB_MST = datamodel.TBL_LOB_MST();
            var param = {
                where: { SBU_ID: encryptmodel.SBU_ID,IS_ACTIVE:true },
                attributes: ['ID', 'LOB_NAME']
            };

            dataaccess.FindAll(TBL_LOB_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_LOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'GetAllLob', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_LOB_MST Table', Data: null });
                });

        });

    router.route('/GetAllSubLob')
        .post(function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_SUBLOB_MST = datamodel.TBL_SUBLOB_MST();
            var param = {
                where: { LOB_ID: encryptmodel.LOB_ID,IS_ACTIVE:true },
                attributes: ['ID', 'SUBLOB_NAME']
            };

            dataaccess.FindAll(TBL_SUBLOB_MST, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_SUBLOB_MST Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'GetAllSubLob', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_SUBLOB_MST Table', Data: null });
                });

        });

    router.route('/CreatUserCat')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
            var values = {
                ENTITY_ID: encryptmodel.ENTITY_ID,
                SBU_ID: encryptmodel.SBU_ID,
                LOB_ID: encryptmodel.LOB_ID,
                SUBLOB_ID: encryptmodel.SUBLOB_ID,
                CEO_TWO_LEVEL_DOWN: encryptmodel.CEO_TWO_LEVEL_DOWN,
                SVP_ABOVE: encryptmodel.SVP_ABOVE,
                ALL_EMPLOYEEES: encryptmodel.ALL_EMPLOYEEES,
                TEAM_ID: encryptmodel.TEAM_ID || null,
                CREATED_BY: encryptmodel.CREATED_BY || null,
                IS_ACTIVE: true,

            };
            dataaccess.Create(TBL_USER_CATEGORIZATION_MST, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_USER_CATEGORIZATION_MST saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'CreatUserCat', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    // router.route('/UpdateUserCat')
    //     .post(function (req, res) {
    //         const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
    //         var values = {
    //             ENTITY_ID: req.body.ENTITY_ID,
    //             SBU_ID: req.body.SBU_ID,
    //             LOB_ID: req.body.LOB_ID,
    //             SUBLOB_ID: req.body.SUBLOB_ID,
    //             CEO_TWO_LEVEL_DOWN: req.body.CEO_TWO_LEVEL_DOWN,
    //             SVP_ABOVE: req.body.SVP_ABOVE,
    //             ALL_EMPLOYEEES: req.body.ALL_EMPLOYEEES,
    //             TEAM_ID: null,
    //             IS_ACTIVE: true,

    //         };
    //         var param = { ID: req.body.ID };
    //         dataaccess.Update(TBL_USER_CATEGORIZATION_MST, values, param)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'TBL_USER_CATEGORIZATION_MST updated successfully', Data: result });
    //                 }
    //                 else {

    //                     res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('usercategorizationservice', 'UpdateUserCat', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //             });
    //     });

    router.route('/DeleteUserCatById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);

            const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
            dataaccess.Update(TBL_USER_CATEGORIZATION_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Updated Successfully', Data: EncryptLoginDetails });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'DeleteUserCatById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_USER_CATEGORIZATION_MST Table', Data: null });
                });
        });

    router.route('/getresultent')
        .post(async function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var reqbody = encryptmodel;
            console.log(`Insert`, reqbody);
            var querytext = `select * from eirf_upsi_map_entity_master(:query_no,:employee_id,:entity_id,:trans_id,:cre_user);`;
            var param = {
                replacements: {
                    query_no: 4,
                    employee_id: reqbody.employee_id || null,
                    entity_id: reqbody.ENTITY_ID,
                    trans_id: null,
                    cre_user: reqbody.cre_user || null

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('paramforgetresult', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("getresult", result)
                    res.status(200).json({ Success: true, Message: "", Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('usercategorizationservice', 'getresultent', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of eirf_upsi_map_entity_master', Data: null });
                    });
        });

    router.route('/getresultentmatsubdairy')
        .post(async function (req, res) {

            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var reqbody = encryptmodel;
            console.log(`Insert`, reqbody);
            var querytext = `select * from public."EIRF_UPSI_MAP_ENTITY_Materialsubsidiary"(:queryno,:employeeid,:entity_id,:materialsubsidiary_id,:transid,:cre_user);`;
            var param = {
                replacements: {
                    queryno: 4,
                    employeeid: reqbody.employeeid,
                    entity_id: reqbody.ENTITY_ID,
                    materialsubsidiary_id: reqbody.materialsubsidiary_id,
                    transid: null,
                    cre_user: reqbody.cre_user

                },
                type: Connect.sequelize.QueryTypes.SELECT

            }
            console.log('paramforgetresultentmat', param);

            Connect.sequelize.query(querytext, param)
                .then(function (result) {
                    console.log("getresultentmat", result)
                    res.status(200).json({ Success: true, Message: "", Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('usercategorizationservice', 'getresultentmatsubdairy', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of EIRF_UPSI_MAP_ENTITY_Materialsubsidiary', Data: null });
                    });
        });

    router.route('/getUserUploadTeam')
        .post(async function (req, res) {
            try {
                const TBL_TEAM_UPLOAD_MST = datamodel.TBL_TEAM_UPLOAD_MST();
                var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
                const employeeId = encryptmodel.employeeId;

                const userUploadTeam = {
                    where: {
                        EMPLOYEE_ID: employeeId,
                        IS_ACTIVE: true
                    },
                    attributes: ['ID', 'EMPLOYEE_ID', 'TEAM_ID', 'IS_ACTIVE']
                };

                console.log("param", userUploadTeam);

                const result = await dataaccess.FindAll(TBL_TEAM_UPLOAD_MST, userUploadTeam);

                console.log("result", result);

                if (result != null && result.length > 0) {
                    res.status(200).json({ Success: true, Message: 'TBL_TEAM_UPLOAD_MST Table Access', Data: result });
                } else {
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_TEAM_UPLOAD_MST Table', Data: null });
                }
            } catch (err) {
                dataconn.errorlogger('usercategorizationservice', 'getUserUploadTeam', err);
                res.status(500).json({ Success: false, Message: 'Internal Server Error', Data: null });
            }
        });

    router.route("/CheckDuplicateUSCat/:Value/:Id")
        .get(function (req, res) {
            const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
            var param = {
                where: {
                    ID: { [connect.Op.ne]: req.params.Id },
                    IS_ACTIVE: true
                },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("ENTITY_ID")), "Count"]
                ]
            };

            if (req.params.Value) {
                param.where.ENTITY_ID = req.params.Value;
            } else if (req.params.Value) {
                param.where.SBU_ID = req.params.Value;
            }

            dataaccess.FindAll(TBL_USER_CATEGORIZATION_MST, param).then(
                function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: "ENTITY_ID already exists", Data: true });
                    } else {
                        res.status(200).json({ Success: false, Message: "ENTITY_ID does not exist", Data: false });
                    }
                },
                function (err) {
                    dataconn.errorlogger("usercategorizationservice", "CheckDuplicateUSCat", err);
                    res.status(200).json({ Success: false, Message: "User has no access to usercategorizationservice", Data: null });
                }
            );
        });

    router.route('/CheckDuplicate')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            const TBL_USER_CATEGORIZATION_MST = datamodel.TBL_USER_CATEGORIZATION_MST();
            var param = {
                where: { IS_ACTIVE: true },
                attributes: [
                    [connect.sequelize.fn("count", connect.sequelize.col("ENTITY_ID")), "EntityCount"],
                    [connect.sequelize.fn("count", connect.sequelize.col("SBU_ID")), "SBUCount"]
                ]
            };

            if (encryptmodel.ENTITY_ID && !encryptmodel.SBU_ID) {
                param.where.ENTITY_ID = encryptmodel.ENTITY_ID;
            } else if (!encryptmodel.ENTITY_ID && encryptmodel.SBU_ID) {
                param.where.SBU_ID = encryptmodel.SBU_ID;
            } else {
                res.status(200).json({ Success: false, Message: "Please provide either ENTITY_ID or SBU_ID", Data: null });
                return;
            }

            console.log("Param", param);

            dataaccess.FindAll(TBL_USER_CATEGORIZATION_MST, param).then(
                function (result) {
                    if (result != null && result.length > 0) {
                        const entityCount = result[0].dataValues.EntityCount;
                        const sbuCount = result[0].dataValues.SBUCount;

                        if (entityCount > 0) {
                            res.status(200).json({ Success: true, Message: "ENTITY_ID already exists", Data: true });
                        } else if (sbuCount > 0) {
                            res.status(200).json({ Success: true, Message: "SBU_ID already exists", Data: true });
                        } else {
                            res.status(200).json({ Success: false, Message: "ID does not exist", Data: false });
                        }
                    } else {
                        res.status(200).json({ Success: false, Message: "ID does not exist", Data: false });
                    }
                },
                function (err) {
                    dataconn.errorlogger("usercategorizationservice", "CheckDuplicate", err);
                    res.status(200).json({ Success: false, Message: "Error occurred while checking ID", Data: null });
                }
            );
        });

    router.route('/CreatbussinessUSRMST')
        .post(function (req, res) {
            const model1 = req.body;
            const TBL_BUSINESS_USER_MST = datamodel.TBL_BUSINESS_USER_MST();
            var values = {
                EMPID: model1.lstUser.find((user) => user.EMPNO).EMPNO,
                BUSINESS_NAME:  model1.lstUser.find((user) => user.BG).BG,
                CREATED_BY: model1.CRE_USER,
                IS_ACTIVE: true,

            };
            var param = { ID: model1.CRE_USER };
            dataaccess.Create(TBL_BUSINESS_USER_MST, values,param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_BUSINESS_USER_MST saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'CreatbussinessUSRMST', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });

        });

    router.route('/deletebussinessUSRMST')
        .post(function (req, res) {
            const model1 = req.body;
            const TBL_BUSINESS_USER_MST = datamodel.TBL_BUSINESS_USER_MST();
            var values = {
                EMPID:  model1.lstUser.find((user) => user.EMPNO).EMPNO,
                BUSINESS_NAME: model1.lstUser.find((user) => user.BG).BG,
                CREATED_BY: model1.CRE_USER,                
            };
            var param = { ID: model1.CRE_USER };
            dataaccess.Update(TBL_BUSINESS_USER_MST, { IS_ACTIVE: false }, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Updated Successfully', Data: null });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESS_USER_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'deletebussinessUSRMST', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BUSINESS_USER_MST Table', Data: null });
                });
        });

    router.route('/updateusrmst')
        .post(function (req, res) {
            const model1 = req.body;
            const TBL_USER_MST = datamodel.TBL_USER_MST();
            var values = {
                // EMPNO: model1.lstUser.find((user) => user.EMPNO).EMPNO,
                BUSINESSDESIGNATED:model1.lstUser.find((user) => user.BUSINESSDESIGNATED).BUSINESSDESIGNATED,
                MODIFIED_BY: model1.CRE_USER,
                IS_ACTIVE: true,

            };
            var param = { EMPNO: model1.CRE_USER };
            dataaccess.Update(TBL_USER_MST, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'TBL_USER_MST saved successfully', Data: result });
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('usercategorizationservice', 'updateusrmst', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });

        });


    return router;
};

module.exports = routes;