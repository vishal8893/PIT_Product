// const jwt = require("./TokenValidation");
const jwt = require('./TokenValidation');
var connect = require('../Data/Connect');
const validate = {};

const checkSession = async (req, res, next) => {
    try {

        const token = req.headers["jwt_token"];
        const decryptedData = jwt.fetchjwtvalue(token);

        console.log("checkSession - userdetail", decryptedData.UserDetails);
        console.log("jwt",decryptedData);

        let currentUserID = decryptedData.UserDetails.EMPNO;

        const checkQuery = `SELECT COUNT(*) FROM "ER_USER_SESSION_DETAILS"
      WHERE "USER_ID" = '${currentUserID}' AND "TOKEN" = '${token}' AND "IS_ACTIVE" = TRUE;`

        const sessionResult = await connect.sequelize.query(checkQuery);

        console.log("sessionResult", sessionResult);
        console.log("sessionResult[0].length", sessionResult[0].length);
        console.log("sessionResult[0][0]['count']", sessionResult[0][0]['count']);

        if (sessionResult[0].length > 0 && sessionResult[0][0]['count'] > 0) {
            next();
        }
        else {
            return res.status(403).send({ Success: false, Message: "Session Expired." });
        }

    }
    catch (errCatch) {
        console.log("checkSession - errCatch : ", errCatch);
        return res.status(403).send({ Success: false, Message: "Internal Error Occured While Validating Session." });
    }
};

validate.checkSession = checkSession;

module.exports = validate;
