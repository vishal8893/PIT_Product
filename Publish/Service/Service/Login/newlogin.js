var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection')
var connect = require('../../Data/Connect');
var tokenValidation = require('../../Common/TokenValidation');

var routes = function () {

    router.route('/AuthenticateUser')
        .post(async function (req, res) {

            let finalResponseData = [{
                'UserDetails' : '',
                'MenuDetails' : []
            }]

            // let query = `select u_m."LOGINID",u_r_m."ROLEID",u_m."PANCARDNO",u_m."EMPNO",u_m."DSIGNATED",
            // r_m."CODE",u_m."ID",u_m."DEFAULTROLEID",u_m."FIRSTNAME",u_m."LASTNAME",u_m."DEPARTMENT"
            // from "TBL_USER_MST" u_m inner join "TBL_USERROLE_MAP" u_r_m
            // on u_m."ID" = u_r_m."USERID"
            // inner join "TBL_ROLE_MST" r_m on r_m."ID" = u_r_m."ROLEID"
            // where u_m."LOGINID" = '${req.body.UserName}' and u_m."PASSWORD"= '${req.body.Password}' and r_m."IS_ACTIVE" = true`

            let query = `select u_m."LOGINID",--u_r_m."ROLEID",
            r_m."ID" as ROLEID,u_m."PANCARDNO",u_m."EMPNO",u_m."DSIGNATED",
            r_m."CODE",u_m."ID",u_m."DEFAULTROLEID",u_m."FIRSTNAME",u_m."LASTNAME",u_m."DEPARTMENT"
            from "TBL_USER_MST" u_m
            --inner join "TBL_USERROLE_MAP" u_r_m on u_m."ID" = u_r_m."USERID"
            inner join "TBL_ROLE_MST" r_m on r_m."ID" = u_m."DEFAULTROLEID"
            where u_m."LOGINID" = '${req.body.UserName}' and u_m."PASSWORD"= '${req.body.Password}' and r_m."IS_ACTIVE" = true
            and u_m."ISACTIVE" = true`

            let userlogin = await connect.sequelize.query(query);

            if (userlogin[0][0] != null) {
                console.log("userdata",userlogin[0][0]);
                finalResponseData[0]['UserDetails'] = userlogin[0][0];

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
                AND "uiroles"."ROLEID" = '${userlogin[0][0].DEFAULTROLEID}' WHERE "ui"."IS_ACTIVE" = true ORDER BY "ui"."SEQUENCE";`
                
                let menuItem = await connect.sequelize.query(query);
                console.log("query12345", query);

                if (menuItem[0].length > 0) {
                    finalResponseData[0]['MenuDetails'] = menuItem[0];
                    console.log("resu",finalResponseData[0]);
                    let jwt_token = tokenValidation.createToken(finalResponseData);

                    // let currentUserID = userlogin[0][0].EMPNO;
                    let currentUserID = finalResponseData[0]['UserDetails'].EMPNO;
                    console.log("currentUserID", currentUserID);
    
                    const checkTokenByUserId = `SELECT COUNT(*) FROM "ER_USER_SESSION_DETAILS"
                                WHERE "USER_ID" = '${currentUserID}' AND "IS_ACTIVE" = TRUE
                                GROUP BY "SESSION_ID"
                                ORDER BY "SESSION_ID" DESC`;
    
                    const checkTokenByUserIdResult = await connect.sequelize.query(checkTokenByUserId);
    
                    const ER_USER_SESSION_DETAILS = datamodel.ER_USER_SESSION_DETAILS();
    
                    if (checkTokenByUserIdResult[0].length > 0 && checkTokenByUserIdResult[0][0]['count'] > 0) {
    
                        var valuesUpdate = {
                            EXP_TIME: 0,
                            IS_ACTIVE: false,
                        };
    
                        var paramsUpdate = {
                            USER_ID: currentUserID,
                            IS_ACTIVE: true,
                        };
    
                        await dataaccess.Update(ER_USER_SESSION_DETAILS, valuesUpdate, paramsUpdate);
    
                        var valuesCreate = {
                            USER_ID: currentUserID,
                            TOKEN: jwt_token,
                            EXP_TIME: 1696959634,
                            IS_ACTIVE: true,
                        };
    
                        await dataaccess.Create(ER_USER_SESSION_DETAILS, valuesCreate);
    
                    }
                    else {
    
                        var valuesCreate = {
                            USER_ID: currentUserID,
    
                            TOKEN: jwt_token,
                            EXP_TIME: 1696959634,
                            IS_ACTIVE: true,
                        };
    
                        await dataaccess.Create(ER_USER_SESSION_DETAILS, valuesCreate);
    
                    }
    
                    res.status(200).json({ Success: true, Message: 'Authentication Accesable.', Data: jwt_token });
    
                    // res.status(200).json({ Success: true, Message: 'Authentication Accesable', Data: menuItem[0] });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'No user found', Data: null });
    
                }

               



                // res.status(200).json({ Success: true, Message: 'Authentication Accesable', Data: userlogin[0][0] });
            }
            else {
                res.status(200).json({ Success: false, Message: 'User credentials invalid', Data: null });
            }
            return;
        });

    return router;

};

module.exports = routes;