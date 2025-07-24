var express = require('express');
var router = express.Router();
const https = require('https');
const axios = require('axios');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
const { log } = require('console');
var tokenValidation = require('../../Common/TokenValidation');
var sequelize = connect.Sequelize;


var routes = function () {

    async function generateToken() {
        try {
            // const hrms_oauth2_clientid = "6kojghrgemee2rd2lmig1d55cf"; //PROD
            const hrms_oauth2_clientid = "7bljlrpss0fh3ts3u9srd73i98";  //UAT
            // const hrms_oauth2_client_secret_key = "11ei2v40lcmp05kcab29ra949sqi6gt5qs72t4f5ddo0gr8k7j4p"; //--PROD
            const hrms_oauth2_client_secret_key = "3jmjb2q38t59tctrlugc1jbo3hv7vi1cs59dslfea1hjmv94opu"; //--UAT

            // Concatenate client id and secret key
            const concatenatedString = `${hrms_oauth2_clientid}:${hrms_oauth2_client_secret_key}`;

            // Convert string to UTF-8 bytes
            const utf8Bytes = Buffer.from(concatenatedString, 'utf-8');

            // Encode UTF-8 bytes to Base64
            const encodedString = utf8Bytes.toString('base64');
            console.log(encodedString);

            // Set headers
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodedString}`,
                'Accept': 'application/json'
            };

            // const HRMS_API_PATH = "https://fiber.nuvamapis.com/oauth2/token";
            const HRMS_API_PATH = "https://fiberuat.nuvamapis.com/oauth2/token";


            // Make a request to the HRMS API path to obtain the token
            const tokenResponse = await axios.post(HRMS_API_PATH, {}, { headers });

            // Extract the token from the response
            const jwtToken = tokenResponse.data.access_token;

            return jwtToken;
        } catch (error) {
            console.error("Error while generating token or fetching data:", error);
            throw error;
        }
    }

    var checkLogin = async function checkLogin(userName) {
        try {
            // Generate token
            const token = await generateToken();

            // Define request headers
            const headers = {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900'
            };

            const params = {
                // 'redirectUrl': 'http://localhost:4200/pit/Home',
                'redirectUrl': 'https://pitarmouruat.nuvamapps.com/pit/Home',
                // 'clientId': '6kojghrgemee2rd2lmig1d55cf',
                'clientId': '64cg6av9kok6n8s9h33pfebp7o',
                'loginVia': 'Nuvama',
                // 'email':  `${userName}`,
                'email': userName,
            };

            const HRMS_API_PATH = "https://fiberuat.nuvamapis.com/auth/login";

            // Send POST request to the email sending endpoint
            const response = await axios.post(HRMS_API_PATH, params, { headers });

            console.log("Login data send successfully:", response.data);

            const data = response.data;

            // console.log("data", data);

            var encryptmodel = response.data.data;

            return encryptmodel;

        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    router.route('/NuvamaAuthenticateUser')
        .post(async function (req, res) {

            // res.status(200).json({ Success: false, Message: 'User credentials invalid', Data: null });

            const retuendata = await checkLogin(req.body.UserName);
            // console.log(retuendata);            

            // if (retuendata.status === "200") {
            if (retuendata.url != null && retuendata.url != '') {

                let finalResponseData = [{
                    'UserDetails': '',
                    'MenuDetails': []
                }]

                let query = `select u_m."LOGINID",u_r_m."ROLEID",u_m."PANCARDNO",u_m."EMPNO",u_m."DSIGNATED",
            r_m."CODE",u_m."ID",u_m."DEFAULTROLEID",u_m."FIRSTNAME",u_m."LASTNAME",u_m."DEPARTMENT"
            from "TBL_USER_MST" u_m inner join "TBL_USERROLE_MAP" u_r_m
            on u_m."ID" = u_r_m."USERID"
            inner join "TBL_ROLE_MST" r_m on r_m."ID" = u_r_m."ROLEID"
            where u_m."EMAILID" = '${req.body.UserName}' and r_m."IS_ACTIVE" = true and u_m."ISACTIVE" = true`

                let userlogin = await connect.sequelize.query(query);

                if (userlogin[0][0] != null) {
                    console.log("userdata", userlogin[0][0]);
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
                        console.log("resu", finalResponseData[0]);
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
            } else {
                res.status(200).json({ Success: false, Message: 'User credentials invalid', Data: null });
            }

            return;
        });

    return router;

};

module.exports = routes;


// Call the getData function
// module.exports.checkLogin = checkLogin;