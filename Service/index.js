var dataconn = require('./Data/DataConnection');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var config = require('./Config');
var validateToken = require('./Common/TokenValidation');
var validateSession = require('./Common/SessionValidation');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));


// //uat server 
// const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/webdev2.neweltechnologies.in/chain.pem', 'utf8');
const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

var server = httpsServer.listen(config.service_port, function() {
    var host = server.address().address;
    var port = server.address().port;
    var datetime = new Date();
    var message = "Server :- " + host + " running on Port : - " + port + " Started at :- " + datetime;
    console.log(message);
});
// //uat server end

// CORS Middleware node.js package for connect express
// app.use(function (req, res, next) {
// 	var menthods = "GET, POST, OPTIONS";
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Methods", menthods);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization, jwt_token");

// 	if (!menthods.includes(req.method.toUpperCase())) {
// 		// console.log("xyz","stop");
// 		return res.status(200).json({});

// 	};
// 	// console.log('next');
// 	next();

// });
app.use(function (req, res, next) {
	var allowedMethods = "GET, POST"; // Dynamically set allowed methods
	var allowedHeaders = "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization, jwt_token"; // Dynamically set allowed headers
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", allowedMethods);
	res.header("Access-Control-Allow-Headers", allowedHeaders);

	if (req.method.toUpperCase() === 'OPTIONS') {
		// Preflight request, respond with 204 (No Content) and headers
		res.status(204).end();
	} else if (!allowedMethods.includes(req.method.toUpperCase())) {
		// Method not allowed, respond with 405 (Method Not Allowed)
		res.status(405).end();
	} else {
		// Regular request, continue to the next middleware
		next();
	}
});

// Service checking method
app.get("/api/sample", function (req, res) {
	res.status(200).json({ Success: true, Message: "Service Running", Data: null });
});

// Connection checking method
app.get("/api/CheckConnection", function (req, res) {
	dataconn.CheckConnection(res);
});

//Table creation Method
app.get("/api/CreateTable", function (reg, res) {
	dataconn.CreateTable(res);
});

var newlogin = require('./Service/Login/newlogin')();
app.use("/api/newlogin", newlogin);

app.all("/*", validateToken.verifyToken, validateSession.checkSession);

var errorlogService = require('./Service/ErrorLog/ErrorLogService')();
app.use("/api/errorlog", errorlogService);

var userService = require('./Service/UserManagement/UserService')();
app.use("/api/user", userService);

var uiroleService = require('./Service/UserManagement/UIRoleService')();
app.use("/api/uirolemap", uiroleService);

var MenuRoute = require('./Service/Login/MenuRoute')();
app.use("/api/newmenu", MenuRoute);

var RoleMasterService = require('./Service/UserManagement/RoleMasterService')();
app.use("/api/userrole", RoleMasterService);

var ExpirayDatemstService = require('./Service/Master/ExpirayDatemstService')();
app.use("/api/expiraydate", ExpirayDatemstService);

var greylistmstservice = require('./Service/Master/greylistMstservice')();
app.use("/api/gretlist", greylistmstservice);

var restrictedmstservice = require('./Service/Master/restrictedmstService')();
app.use("/api/restrict", restrictedmstservice);

var primaryissuerejectionmstservice = require('./Service/Master/primaryissuerejectionmstService')();
app.use("/api/primaryissue", primaryissuerejectionmstservice);

var materialsubdiaryService = require('./Service/Master/materialsubdairyService')();
app.use("/api/materialsubdiary", materialsubdiaryService);

var entitylistservice = require('./Service/Master/entityService')();
app.use("/api/entity", entitylistservice);

var businessgroupMaster = require('./Service/Master/buisnessgroupService')();
app.use("/api/businessgroup", businessgroupMaster);

var sbuservice = require('./Service/Master/sbuMasterService')();
app.use("/api/sbuservice", sbuservice);

var lobmstservice = require('./Service/Master/lobMasterService')();
app.use("/api/lob", lobmstservice);

var sublobservice = require('./Service/Master/sublobService')();
app.use("/api/sublob", sublobservice);

var lobservice = require('./Service/Master/lobService')();
app.use("/api/lobservice", lobservice);

var userMasterService = require('./Service/Master/userMstService')();
app.use("/api/user", userMasterService);

var desginatedityCEOBMapping = require('./Service/Master/desginatedceomappingService')();
app.use("/api/desgianatedmap", desginatedityCEOBMapping);

var busineheadmst = require('./Service/Master/businessheadService')();
app.use("/api/businesshead", busineheadmst);

var pbdeclartion = require('./Service/JoinDeclaration/pobdeclartionService')();
app.use("/api/pbdeclartion", pbdeclartion);


//rinkal code start

var treadingwindowcloseservice = require('./Service/Master/treadingwindowcloseservice')();
app.use("/api/treadingwindowclose", treadingwindowcloseservice);

var m3upsimstservice = require('./Service/Master/m3upsiMasterService')();
app.use("/api/meupsi", m3upsimstservice);

var upsimstservice = require('./Service/Master/upsiMstService')();
app.use("/api/upsimst", upsimstservice);

var entityceobhmappingservice = require('./Service/Master/entityceobhmappingService')();
app.use("/api/entceobhmapping", entityceobhmappingservice);

var entitymaterialsubsidiaryceobhmappingService = require('./Service/Master/entitymaterialsubsidiaryceobhmappingService')();
app.use("/api/entmaterialsub", entitymaterialsubsidiaryceobhmappingService);

var scriptMasterService = require('./Service/Master/scriptMasterService')();
app.use("/api/scriptmst", scriptMasterService);

var userCategorizationmstService = require('./Service/Master/userCategorizationmstService')();
app.use("/api/usrcategory", userCategorizationmstService);

var pitCodeAccept = require('./Service/JoinDeclaration/pitCodeAccept')();
app.use("/api/pitcodeaccess", pitCodeAccept);

var joiningDeclarationmst = require('./Service/JoinDeclaration/joiningDeclarationmst')();
app.use("/api/joindesc", joiningDeclarationmst);

var eahmst = require('./Service/EAH/eahmst')();
app.use("/api/eah", eahmst);

var itradingPrimaryIssueMaster = require('./Service/Master/itradingPrimaryIssueMaster')();
app.use("/api/itradingpi", itradingPrimaryIssueMaster);

var violationReport = require('./Service/Master/violationReport')();
app.use("/api/vioreport", violationReport);

var SubstantialInterestDeclaration = require('./Service/SCOI/SubstantialInterestDeclaration')();
app.use("/api/scoi", SubstantialInterestDeclaration);

var QuarterMstService = require('./Service/Master/quarterMstService')();
app.use("/api/quarter", QuarterMstService);

var createUPSIProjectmstService = require('./Service/Master/createUPSIProjectmstService')();
app.use("/api/createupsi", createUPSIProjectmstService);

var homepageService = require('./Service/Dashboard/home')()
app.use("/api/home", homepageService)

var ComplianceService = require('./Service/Dashboard/home')()
app.use("/api/compliance", ComplianceService)

var uploads = require('./Service/Master/uploads')();
app.use("/api/upload", uploads);

var HRMSUploads = require('./Service/Master/HRMSUploads')();
app.use("/api/hrms", HRMSUploads);

var tradeReconReport = require('./Service/Reports/tradeReconReport')();
app.use("/api/trdreport", tradeReconReport);

var BenopsUpload = require('./Service/Master/BenopsUpload')();
app.use("/api/bnpUpload", BenopsUpload);

//rinkal code end

var nodeCron = require('./Service/JoinDeclaration/Schedulefunctions');

// Vishal code Start
var PersonalConflictofinterest = require('./Service/Master/PersonalConflictofinterest')();
app.use("/api/PConinterest", PersonalConflictofinterest);

var EmployeeInvestmentRequest = require('./Service/Master/EmployeeInvestmentRequest')();
app.use("/api/eirf", EmployeeInvestmentRequest);
// Vishal code End

var EahProgressbar = require('./Service/EAH/eahprogress')()
app.use("/api/progress", EahProgressbar)

var JDProgressbar = require('./Service/JoinDeclaration/jdprogressbar')()
app.use("/api/jdprogress", JDProgressbar)

var EirfMailDisclosure = require('./Service/Master/EirfMailDisclosure')();
app.use("/api/Disclosure", EirfMailDisclosure);

var eahreminderintimationService = require('./Service/EAH/eahreminderintimation')();
app.use("/api/eahemail", eahreminderintimationService);

//vishal///
var ComplianceApprove = require('./Service/Master/ComplianceApprove')()
app.use("/api/complianceapprove", ComplianceApprove);

var TradeReporting = require('./Service/Treadreporting/treadreporting')()
app.use("/api/tradereporting", TradeReporting);
// Garima code Start
var irfApprovalService = require('./Service/Master/irfApprovalService')();
app.use("/api/irf", irfApprovalService);
// Garima code End

// { maxHeadersSize: 65536 },
// var server = app.listen(process.env.port || config.service_port, function () {
// 	var host = server.address().address;
// 	var port = server.address().port;
// 	var datetime = new Date();
// 	var message = "Server :- " + host + " running on Port : - " + port + " Started at :- " + datetime;
// 	console.log(message);
// });