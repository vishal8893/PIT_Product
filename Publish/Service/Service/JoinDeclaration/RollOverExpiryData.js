var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var Connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
var sequelize = connect.Sequelize;
const fs = require('fs')
const path = require("path");
var multer = require("multer");
var upload = multer();
let util = require('util')
var ExcelJS = require('exceljs');
const moment = require('moment');


// Convert date formats to 'yyyy-mm-dd'
function formatDate(dateString) {
    const formatsToTry = ['YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];

    for (const format of formatsToTry) {
        const parsedDate = moment(dateString, format, true);
        if (parsedDate.isValid()) {
            return parsedDate.format('YYYY-MM-DD');
        }
    }

    // Return original string if no valid format is found
    return dateString;
}


var saveRollOverExpiryData = async function saveRollOverExpiryData() {

    // const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');            
    const filePath = projectData.UPLOAD_PATH;
    console.log("123", filePath);

    if (filePath != null) {

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        try {

            for (let i = 2; i <= worksheet.rowCount; i++) {

                const PositionDate = worksheet.getRow(i).values[1] === undefined ? null : formatDate(worksheet.getRow(i).values[1]);
                const SegmentIndicator = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                const SettlementType = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                const ClearingMemberCode = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                const MemberType = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                const TradingMemberCode = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                const AccountType = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                const ClientAccountCode = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];
                const InstrumentType = worksheet.getRow(i).values[9] === undefined ? null : worksheet.getRow(i).values[9];
                const Symbol = worksheet.getRow(i).values[10] === undefined ? null : worksheet.getRow(i).values[10];
                const Expirydate = worksheet.getRow(i).values[11] === undefined ? null : formatDate(worksheet.getRow(i).values[11]);
                const StrikePrice = worksheet.getRow(i).values[12] === undefined ? null : worksheet.getRow(i).values[12];
                const OptionType = worksheet.getRow(i).values[13] === undefined ? null : worksheet.getRow(i).values[13];
                const CALevel = worksheet.getRow(i).values[14] === undefined ? null : worksheet.getRow(i).values[14];
                const BroughtForwardLongQuantity = worksheet.getRow(i).values[15] === undefined ? null : worksheet.getRow(i).values[15];
                const BroughtForwardLongValue = worksheet.getRow(i).values[16] === undefined ? null : worksheet.getRow(i).values[16];
                const BroughtForwardShortQuantity = worksheet.getRow(i).values[17] === undefined ? null : worksheet.getRow(i).values[17];
                const BroughtForwardShortValue = worksheet.getRow(i).values[18] === undefined ? null : worksheet.getRow(i).values[18];
                const DayBuyOpenQuantity = worksheet.getRow(i).values[19] === undefined ? null : worksheet.getRow(i).values[19];
                const DayBuyOpenValue = worksheet.getRow(i).values[20] === undefined ? null : worksheet.getRow(i).values[20];
                const DaySellOpenQuantity = worksheet.getRow(i).values[21] === undefined ? null : worksheet.getRow(i).values[21];
                const DaySellOpenValue = worksheet.getRow(i).values[22] === undefined ? null : worksheet.getRow(i).values[22];
                const PreExAsgmntLongQuantity = worksheet.getRow(i).values[23] === undefined ? null : worksheet.getRow(i).values[23];
                const PreExAsgmntLongValue = worksheet.getRow(i).values[24] === undefined ? null : worksheet.getRow(i).values[24];
                const PreExAsgmntShortQuantity = worksheet.getRow(i).values[25] === undefined ? null : worksheet.getRow(i).values[25];
                const PreExAsgmntShortValue = worksheet.getRow(i).values[26] === undefined ? null : worksheet.getRow(i).values[26];
                const ExercisedQuantity = worksheet.getRow(i).values[27] === undefined ? null : worksheet.getRow(i).values[27];
                const AssignedQuantity = worksheet.getRow(i).values[28] === undefined ? null : worksheet.getRow(i).values[28];
                const PostExAsgmntLongQuantity = worksheet.getRow(i).values[29] === undefined ? null : worksheet.getRow(i).values[29];
                const PostExAsgmntLongValue = worksheet.getRow(i).values[30] === undefined ? null : worksheet.getRow(i).values[30];
                const PostExAsgmntShortQuantity = worksheet.getRow(i).values[31] === undefined ? null : worksheet.getRow(i).values[31];
                const PostExAsgmntShortValue = worksheet.getRow(i).values[32] === undefined ? null : worksheet.getRow(i).values[32];
                const SettlementPrice = worksheet.getRow(i).values[33] === undefined ? null : worksheet.getRow(i).values[33];
                const NetPremium = worksheet.getRow(i).values[34] === undefined ? null : worksheet.getRow(i).values[34];
                const DailyMTMSettlementValue = worksheet.getRow(i).values[35] === undefined ? null : worksheet.getRow(i).values[35];
                const FuturesFinalSettlementValue = worksheet.getRow(i).values[36] === undefined ? null : worksheet.getRow(i).values[36];
                const ExercisedAssignedValue = worksheet.getRow(i).values[37] === undefined ? null : worksheet.getRow(i).values[37];
                const IsActive = worksheet.getRow(i).values[38] === undefined ? null : worksheet.getRow(i).values[38];


                console.log(`Cell values at row ${i}:`, PositionDate, SegmentIndicator, SettlementType, ClearingMemberCode, MemberType, TradingMemberCode, AccountType, ClientAccountCode, InstrumentType, Symbol, Expirydate, StrikePrice, OptionType, CALevel, BroughtForwardLongQuantity, BroughtForwardLongValue, BroughtForwardShortQuantity, BroughtForwardShortValue, DayBuyOpenQuantity, DayBuyOpenValue, DaySellOpenQuantity, DaySellOpenValue, PreExAsgmntLongQuantity, PreExAsgmntLongValue, PreExAsgmntShortQuantity, PreExAsgmntShortValue, ExercisedQuantity, AssignedQuantity, PostExAsgmntLongQuantity, PostExAsgmntLongValue, PostExAsgmntShortQuantity, PostExAsgmntShortValue, SettlementPrice, NetPremium, DailyMTMSettlementValue, FuturesFinalSettlementValue, ExercisedAssignedValue, IsActive);
                console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                const TBL_FNOROLLOVER_EXPIRYDATA = datamodel.TBL_FNOROLLOVER_EXPIRYDATA();

                const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;

                const query = `SELECT * FROM "TBL_FNOROLLOVER_EXPIRYDATA" WHERE "SYMBOL" = '${Symbol}' AND "EXPIRY_DATE" = '${Expirydate}' AND "IS_ACTIVE" = true;`;
                const rows = await connect.sequelize.query(query);
                console.log("rows", rows[0]);

                if (rows[0].length === 0) {
                    var values = {
                        POSITION_DATE: PositionDate,
                        SEGMENT_INDICATOR: SegmentIndicator,
                        SETTLEMENT_TYPE: SettlementType,
                        CLEARING_MEMBER_CODE: ClearingMemberCode,
                        MEMBER_TYPE: MemberType,
                        TRADING_MEMBER_CODE: TradingMemberCode,
                        ACCOUNT_TYPE: AccountType,
                        CLIENT_ACCOUNT_CODE: ClientAccountCode,
                        INSTRUMENT_TYPE: InstrumentType,
                        SYMBOL: Symbol,
                        EXPIRY_DATE: Expirydate,
                        STRIKE_PRICE: StrikePrice,
                        OPTION_TYPE: OptionType,
                        CA_LEVEL: CALevel,
                        BROUGHT_FORWARD_LONG_QUANTITY: BroughtForwardLongQuantity,
                        BROUGHT_FORWARD_LONG_VALUE: BroughtForwardLongValue,
                        BROUGHT_FORWARD_SHORT_QUANTITY: BroughtForwardShortQuantity,
                        BROUGHT_FORWARD_SHORT_VALUE: BroughtForwardShortValue,
                        DAY_BUY_OPEN_QUANTITY: DayBuyOpenQuantity,
                        DAY_BUY_OPEN_VALUE: DayBuyOpenValue,
                        DAY_SELL_OPEN_QUANTITY: DaySellOpenQuantity,
                        DAY_SELL_OPEN_VALUE: DaySellOpenValue,
                        PRE_EX_AS_GMNT_LONG_QUANTITY: PreExAsgmntLongQuantity,
                        PRE_EX_AS_GMNT_LONG_VALUE: PreExAsgmntLongValue,
                        PRE_EX_AS_GMNT_SHORT_QUANTITY: PreExAsgmntShortQuantity,
                        PRE_EX_AS_GMNT_SHORT_VALUE: PreExAsgmntShortValue,
                        EXERCISED_QUANTITY: ExercisedQuantity,
                        ASSIGNED_QUANTITY: AssignedQuantity,
                        POST_EX_AS_GMNT_LONG_QUANTITY: PostExAsgmntLongQuantity,
                        POST_EX_AS_GMNT_LONG_VALUE: PostExAsgmntLongValue,
                        POST_EX_AS_GMNT_SHORT_QUANTITY: PostExAsgmntShortQuantity,
                        POST_EX_AS_GMNT_SHORT_VALUE: PostExAsgmntShortValue,
                        SETTLEMENT_PRICE: SettlementPrice,
                        NET_PREMIUM: NetPremium,
                        DAILY_MTM_SETTLEMENT_VALUE: DailyMTMSettlementValue,
                        FUTURES_FINAL_SETTLEMENT_VALUE: FuturesFinalSettlementValue,
                        EXERCISED_ASSIGNED_VALUE: ExercisedAssignedValue,
                        IS_ACTIVE: true,
                        CREATED_BY: createdByValue
                    };

                    try {
                        createdGreyListMST = await dataaccess.Create(TBL_FNOROLLOVER_EXPIRYDATA, values);
                        success = true;
                    } catch (error) {
                        console.error("Error during database insertion:", error);
                        res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                        success = false;
                        break;
                    }
                }


            }

            res.status(200).json({ Success: true, Message: 'File Updated Successfully and Data Saved Successfully', Data: filePath });

        } catch (error) {
            // Handle errors and send an error response
            console.error(error);
            res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: error });
        }
    }
    else {
        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    }

}

// Call the main function
module.exports.saveRollOverExpiryData = saveRollOverExpiryData;