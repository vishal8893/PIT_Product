const jwt = require("jsonwebtoken");
// const config = require("../Config");
const config = require('../Config');
const validateToken = {};

function verifyToken(req, res, next) {

    const token = req.headers["jwt_token"];
    console.log("verifyToken : ", token);

    if (!token) {
        console.log("verifyToken - JWT Token Not Found");
        return res.status(403).send({ Success: false, Message: "JWT Token Not Found" });
    }
    else {

        jwt.verify(token, config.JWT_Token_Key, function (err, decoded) {
            if (err) {
                console.log("verifyToken - Please Provide Valid Token");
                return res.status(403).send({ Success: false, Message: "Please Provide Valid Token" });
            }

            console.log("verifyToken - Done");
            next();
        });
    }

}

const createToken = (userData) => {

    console.log("createToken - userData",userData);

    const tokenobj = {
        // UserDetails: userData
        UserDetails: userData[0].UserDetails,
        // MenuDetails: userData[0].MenuDetails,
    };
    console.log("token",config.JWT_Token_Key);

    token = jwt.sign(tokenobj, config.JWT_Token_Key, {
        expiresIn: "12h",
        // expiresIn: "20m",
    });

    return token;

};

const fetchjwtvalue = (token) => {

    const tokendetails = jwt.decode(token);
    return tokendetails;

};

validateToken.createToken = createToken;
validateToken.verifyToken = verifyToken;
validateToken.fetchjwtvalue = fetchjwtvalue;
module.exports = validateToken;

