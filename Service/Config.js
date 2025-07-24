const environmentConfig = {
    local: {
        service_port: 1339,
        ui_url: 'http://localhost:4200/pit/',
        api_url: 'http://localhost:1339/api/',
        JWT_Token_Key: 'randomkeystring',
        dbConn: {
            dbServer: 'dbdev1.neweltechnologies.in',

            // dbServer: '43.204.223.103',
            dbName: 'PIT_UAT',
            dbUser: 'dbmasteruser',
            dbPassword: 'RO?[$#D8OkY_E~;2}[g&E5j7C:bJoB`P',
        }
    },
    uat: {
        service_port: 1350,
        ui_url: 'http://localhost:4200/pit/',
        api_url: 'http://43.204.223.103:1350/api/',
        JWT_Token_Key: 'randomkeystring',
        dbConn: {
            dbServer: '43.204.223.103',
            dbName: 'PIT_UAT',
            dbUser: 'postgres',
            dbPassword: 'India@123',
        }
    },
    live: {
        service_port: 1337,
        ui_url: 'http://localhost:4200/pit/',
        api_url: 'http://localhost:1337/api/',
        JWT_Token_Key: 'randomkeystring',
        dbConn: {
            dbServer: '',
            dbName: '',
            dbUser: '',
            dbPassword: '',
        }
    }
}

// const email_smtp_config = {
//     host: "smtp.com",   //SMTP Host Address
//     port: 123,                 //SMTP PORT
//     auth: {
//         user: "",   //Username
//         pass: ""    //Password
//     }
// }

const email_smtp_config = {
    host: 'smtp.gmail.com',  //SMTP Host Address
    // port: 587,
    port: 465,   //SMTP PORT
    // secure: false,
    secure: true,
    requireTLS: true,
    auth: {        
        // user: "khilarivishu@gmail.com",        
        // pass: "bryz fxra xhgl ckkg"
        user: "newel.technical@gmail.com",
        pass: "cqcaiblynypipdun"
  
    }   
}

module.exports.company = {

    // data:{

        Company: "Newel Technologies"

    // },

}


// const environment = 'uat'; ///for uat db connection
const environment = 'local';///for  dev db connection

const finalConfig = environmentConfig[environment];



module.exports.service_port = finalConfig.service_port;
module.exports.ui_url = finalConfig.ui_url;
module.exports.api_url = finalConfig.api_url;
module.exports.dbConn = finalConfig.dbConn;
module.exports.email_smtp_config = email_smtp_config;
module.exports.JWT_Token_Key = finalConfig.JWT_Token_Key;



module.exports.Pg_Config = {
    user: finalConfig.dbConn.dbUser, //UAT
    host: finalConfig.dbConn.dbServer, //UAT
    database: finalConfig.dbConn.dbName, //UAT
    password: finalConfig.dbConn.dbPassword //UAT
}
