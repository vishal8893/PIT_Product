var Sequelize = require('sequelize');
var config = require('../Config');

/// Sequelize to connect the DB
var sequelize = new Sequelize(config.dbConn.dbName, config.dbConn.dbUser, config.dbConn.dbPassword, {
    host: config.dbConn.dbServer,
    dialect: "postgres",
    port: 5432,
    logging:false,
    define: {
        timestamps: false,
    },
    timezone: "+05:30"
    // timezone: "Asia/Kolkata"
});

var Op = Sequelize.Op;

module.exports = { sequelize: sequelize, Op: Op, Sequelize: Sequelize };
