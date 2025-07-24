var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var routes = function () {

    router.route('/GetAllgreylistMst')
        .get(async function (req, res) {

            let Query = `select              
            "A"."SCRIPT_NAME",
                "A"."ISIN",                
                "A"."STARTDATE",
                "A"."ENDDATE",
                string_agg("U"."FIRSTNAME", ',') AS "EmpName",              
                "A"."IS_ACTIVE",
                "A"."RESTRICTED",
                "A"."ID"
             from public."TBL_GREY_LIST_MST" as "A"
              
             JOIN  public."TBL_GREY_LIST_DETAILSMST" AS "B" ON "A"."ID" = "B"."GRELISTID"::bigint 
             
             JOIN  public."TBL_USER_MST" AS "U" ON"U"."EMPNO"="B"."EMPNO"
              
               where "A"."IS_ACTIVE"=true
              GROUP BY              
                "A"."SCRIPT_NAME",
                "A"."ISIN",                
                "A"."STARTDATE",
                "A"."ENDDATE",
                "A"."IS_ACTIVE",
                "A"."RESTRICTED",
                "A"."ID"
                order by "A"."ID" desc`

            let SelfData = await connect.sequelize.query(Query);
            if (SelfData[0] != null) {
                var EncryptLoginDetails = dataconn.encryptionAES(SelfData[0]); 
                res.status(200).json({ Success: true, Message: 'SelfData Accesable', Data: EncryptLoginDetails });
            } else {
                res.status(200).json({ Success: false, Message: 'SelfData Accesable', Data: null });
            }
        });

    router.route('/UpdategreyMaster')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            let Array = encryptmodel.USERID
            const TBL_GREY_LIST_DETAILSMST = datamodel.TBL_GREY_LIST_DETAILSMST();
            const TBL_GREY_LIST_MST = datamodel.TBL_GREY_LIST_MST();
            var param = { GRELISTID: encryptmodel.ID};
            dataaccess.Delete(TBL_GREY_LIST_DETAILSMST, param)
                .then(function (result) {
                    if (result != null) {
                        var values = {
                            SCRIPT_NAME: encryptmodel.SCRIPT_NAME,
                            ISIN: encryptmodel.ISIN,
                            STARTDATE: encryptmodel.STARTDATE,
                            ENDDATE: encryptmodel.ENDDATE,
                            IS_ACTIVE: true,//req.body.IS_ACTIVE,
                            MODIFIED_BY: encryptmodel.UserID,
                            MODIFIED_ON: connect.sequelize.fn("NOW")
                        };
                        var param = { ID: encryptmodel.ID, };
                        dataaccess.Update(TBL_GREY_LIST_MST, values,param)
                            .then(function (result) {
                                if (result != null) {
                                    let jsondata = JSON.stringify(result)
                                    let parsedata = JSON.parse(jsondata)
                                    let MAXID = parsedata[1][0].ID
                                    
                                    const TBL_GREY_LIST_DETAILSMST = datamodel.TBL_GREY_LIST_DETAILSMST();
                                    Array.forEach((element,index) => {
                                        let models = {
                                            GRELISTID:MAXID,
                                            EMPNO: element.EMPNO,
                                            IS_ACTIVE: true,
                                            MODIFIED_BY: encryptmodel.UserID,
                                            MODIFIED_ON: connect.sequelize.fn("NOW")
                                        }
                                        dataaccess.Create(TBL_GREY_LIST_DETAILSMST, models)
                                            .then(function (result) {
                                                if (result != null) {
                                                    if (Array.length == index + 1) {
                                                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                                                        res.status(200).json({ Success: true, Message: 'greylist saved successfully', Data: EncryptLoginDetails });
                                                    }
                                                  
                                                } else {
                                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                                }
                                            })
                                    })
            
                                }
                                else {
            
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                }
                            })
                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UpdateexpiryMaster', 'UpdateexpiryMaster', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });
    router.route('/CreategreyListMst')
        .post(function (req, res) {
            const TBL_GREY_LIST_MST = datamodel.TBL_GREY_LIST_MST();
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
            var values = {
                SCRIPT_NAME: encryptmodel.SCRIPT_NAME,
                ISIN: encryptmodel.ISIN,
                STARTDATE: encryptmodel.STARTDATE,
                ENDDATE: encryptmodel.ENDDATE,
                IS_ACTIVE: true,//req.body.IS_ACTIVE,
                CREATED_BY: encryptmodel.USERID
            };
            dataaccess.Create(TBL_GREY_LIST_MST, values)
                .then(function (result) {
                    if (result != null) {
                        let jsondata = JSON.stringify(result)
                        let parsedata = JSON.parse(jsondata)
                        let MAXID = parsedata.ID
                        
                        const TBL_GREY_LIST_DETAILSMST = datamodel.TBL_GREY_LIST_DETAILSMST();
                        let USERLISTARRAY = encryptmodel.USERLIST
                        USERLISTARRAY.forEach((element,index) => {
                            let models = {
                                GRELISTID:MAXID,
                                EMPNO: element.EMPNO,
                                IS_ACTIVE: true,
                                CREATED_BY: encryptmodel.USERID,
                              
                            }
                            dataaccess.Create(TBL_GREY_LIST_DETAILSMST, models)
                                .then(function (result) {
                                    if (result != null) {
                                        if (USERLISTARRAY.length == index + 1) {
                                            var EncryptLoginDetails = dataconn.encryptionAES(result);
                                            res.status(200).json({ Success: true, Message: 'greylist saved successfully', Data: EncryptLoginDetails });
                                        }
                                      
                                    } else {
                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    }
                                })
                        })

                    }
                    else {

                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TBL_GREY_LIST_MST_Service', 'Creategreylist', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/DeletegreymstById')
        .post(function (req, res) {
            // console.log("body", req.body);
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            var param = {
                ID: encryptmodel.ID
            };
            console.log("param", param);
            const TBL_GREY_LIST_MST = datamodel.TBL_GREY_LIST_MST();
            dataaccess.Update(TBL_GREY_LIST_MST, { IS_ACTIVE: false }, param)
                .then(function (result) {
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(null);
                        res.status(200).json({ Success: true, Message: 'Ddelte Succefully', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GREY_LIST_MST Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('greyMasterService', 'DeleteGgreyById', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_GREY_LIST_MST Table', Data: null });
                });
        });

    router.route('/checkduplicate')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const BranchMst = datamodel.TBL_GREY_LIST_MST();
            // console.log(req.body.SCRIPT_NAME);
            // console.log(req.body.IFSC_Code);
            var param = {
                where: {
                    SCRIPT_NAME: encryptmodel.SCRIPT_NAME,
                    // IFSC_Code: req.body.IFSC_Code,
                    // BankId: req.body.BankId,
                    ID: {
                        [connect.Op.ne]: encryptmodel.ID,
                    },
                    IS_ACTIVE: true,
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("SCRIPT_NAME")),
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
                                Message: "SCRIPT_NAME already exists",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "SCRIPT_NAME does not exists",
                                Data: false,
                            });
                    }
                },
                function (err) {
                    dataconn.errorlogger("greylistservice", "CheckDuplicategrey", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of SCRIPT_NAME",
                            Data: null,
                        });
                }
            );

        });




    router.route('/CheckDuplicategreylist/:Value/:Id')
        .get(function (req, res) {

            const TBL_GREY_LIST_MST = datamodel.TBL_GREY_LIST_MST();
            var param = {
                where: { SCRIPT_NAME: { [connect.Op.iLike]: req.params.Value }, ID: { [connect.Op.ne]: req.params.Id },IS_ACTIVE: true, },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('SCRIPT_NAME')), 'Count']]
            };

            dataaccess.FindAll(TBL_GREY_LIST_MST, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'greylistMst Already Exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'greylistMst Does Not Exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('greylistMstService', 'CheckDuplicategreylistMst', err);
                        res.status(200).json({ Success: false, Message: 'greylistMst Has No Access Of greylistMst Table', Data: null });
                    });
        });


    return router;
};

module.exports = routes;


