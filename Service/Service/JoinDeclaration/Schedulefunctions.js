var express = require('express');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
var cron = require('node-cron');
var intimationFunction = require('./newjoineeintimationmail');
var reminderFunction = require('./newjoineeremindermail');
var Reminder = require('./../Master/PersonalConflictofinterest');
var Intimation = require('./../Master/PersonalConflictofinterest');
var EahFunction = require('./../EAH/eahreminderintimation');
var sendRiskCategorizationMail = require('./riskCategorization');
var sendUSPRMSCategoryMail = require('./USPRMSCategory');
var sendAutoUpdateScriptBlockingUnblockingMail = require('./AutoUpdateScriptBlockingUnblockingfile');
var sendDependentCentralRepologicMail = require('./DependentCentralRepologic');
var sendSCOIQuarterlyMail = require('./SCOIQuarterlyMailSend');
var sendResignedEmpRemovalfromblockingfile = require('./ResignedEmpRemovalfromblockingfile');
var DiffScripMst = require('./DiffScripMstScheduler');
var sendExpiryMstUpdateMail = require('./updateExpiryData');
var sendRollOverExpiry = require('./RollOverExpiryData');
var sendTradeReconMail = require('./../Trade_recon/EIRFRicoReconLogic');
var sendFnoTradeReconMail = require('./../FNOTrade_recon/FnoTradeReconLogic');
var sendNWILTradeReconMail = require('./../NWILTrade_recon/NWILTradeReconLogic');
var sendTerminalDataMail = require('./readTerminalOpsScheduler');
var ScripMaster = require('./../Scrip_Automation_Scheduler/ScripMasterScheduler');
const dest = require('path');
const NSEDownloadURL = "https://archives.nseindia.com/content/equities/EQUITY_L.csv";
const BSEDownloadURL = "https://www.bseindia.com/downloads/Help/file/scrip.zip";

// Schedule the intimation emails
cron.schedule('0 19 * * *', function jobYouNeedToExecute() {
    console.log("hi everyday 7 pm reminder ");
    // intimationFunction.sendIntimationEmails();
});

// Schedule the reminder emails on Mondays at 8:00 AM
cron.schedule('0 8 * * 1', function jobYouNeedToExecute() {
    console.log("hi every monday reminder ");
    // reminderFunction.sendReminderEmails();
});

cron.schedule('29 12 * * *', function () {
    console.log("vishal khilari");
    // Reminder.reminder();
});


cron.schedule('25 11 * * *', function () {
    console.log("vishal khilari");
    // EahFunction.eachintimation();
    // EahFunction.eachreminder();
    // EahFunction.getalluser()
});



// Schedule the riskCategorization emails from Mondays to Friday  at 11:15 PM
cron.schedule('15 23 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the Risk Catrgory reminder!");
    // sendRiskCategorizationMail.sendRiskCategorizationMail();
});

// Schedule the USPRMSCategory emails from Mondays to Friday  at 11:15 PM
cron.schedule('15 23 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the USPRMS Category reminder!");
    // sendUSPRMSCategoryMail.sendUSPRMSCategoryMail();
});

// Schedule the AutoUpdateScriptBlockingUnblocking emails from Mondays to Friday  at 11:15 PM
cron.schedule('15 23 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the AutoUpdateScriptBlockingUnblocking reminder!");
    // sendAutoUpdateScriptBlockingUnblockingMail.AutoUpdateScriptBlockingUnblockingfile();
});

// Schedule the DependentCentralRepologic emails from Mondays to Friday  at 11:15 PM
cron.schedule('15 23 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the DependentCentralRepologic reminder!");
    // sendDependentCentralRepologicMail.DependentCentralRepologic();
});

// Schedule the SCOIQuarterlySend emails at first day of each quarters
cron.schedule('0 0 1 4,7,10,1 *', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the SCOIQuarterlyMailSend reminder!");
    // sendSCOIQuarterlyMail.SCOIQuarterlyMailSend();
});

// Schedule the PCOI Intimation emails at first day of each quarters
cron.schedule('0 0 1 4,7,10,1 *', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the PCOI IntimationMailSend reminder!");
    // Intimation.intimation();
});

// Schedule the resigned employee removal from blocking list 
cron.schedule('52 18 * * *', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the resigned employee removal from blocking list!");
    // sendResignedEmpRemovalfromblockingfile.sendReginedEmpremovalblockinlist();
});

// Schedule for Scrip AUtomation.
cron.schedule('8 19 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for theScript automation!");
    // ScripMaster.NSEdownloadfile(NSEDownloadURL,dest);
    // ScripMaster.BSEdownloadfile(BSEDownloadURL,dest);
});

// Schedule for DIff Scrip AUtomation.
cron.schedule('11 19 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for the Diff Script automation!");
    // DiffScripMst.ScriptMstDifferencefile();
});

// Schedule for upadte Expiry Mst.
cron.schedule('55 23 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for update the Expiry Master!");
    // sendExpiryMstUpdateMail.sendExpriyMstData();
});

// Schedule for save RollOverExpiryData
cron.schedule('30 8 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for save the RollOverExpiryData!");
    // sendRollOverExpiry.saveRollOverExpiryData();
});

// Schedule for TradeRecon
cron.schedule('47 9 * * 1-5', function jobYouNeedToExecute() {
    
    const today = new Date();
    // Extract the components of the date (year, month, day)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    // Form a string in 'YYYY-MM-DD' format ${year}-${month}-${day}
    const formattedDate = `${year}-${month}-${day}`;
    console.log("formattedDate", formattedDate);

    console.log("Hi, it's time for Trade Recon Data!");
    // sendTradeReconMail.eirfRicoReconLogic(formattedDate);
});

// Schedule for TradeRecon fno
cron.schedule('48 14 * * 1-5', function jobYouNeedToExecute() {
    
    const today = new Date();
    // Extract the components of the date (year, month, day)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    // Form a string in 'YYYY-MM-DD' format ${year}-${month}-${day}
    const formattedDate = `${year}-${month}-${day}`;
    console.log("formattedDate", formattedDate);

    console.log("Hi, it's time for Trade Recon fno Data!");
    // sendFnoTradeReconMail.fnoeirfRicoReconLogic(formattedDate);
});

// Schedule for TradeRecon NWML
cron.schedule('12 11 * * 1-5', function jobYouNeedToExecute() {
    
    const today = new Date();
    // Extract the components of the date (year, month, day)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(today.getDate()).padStart(2, '0');
    // Form a string in 'YYYY-MM-DD' format ${year}-${month}-${day}
    const formattedDate = `${year}-${month}-${day}`;
    console.log("formattedDate", formattedDate);

    console.log("Hi, it's time for Trade Recon fno Data!");
    // sendNWILTradeReconMail.NWILRicoReconLogic(formattedDate);
});

// Schedule for read terminal Ops
cron.schedule('23 13 * * 1-5', function jobYouNeedToExecute() {
    console.log("Hi, it's time for Read Terminal Ops!");
    // sendTerminalDataMail.processData();
});

