var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');


const checkHoliday = async (date) => {
    const HolidayMaster = datamodel.TBL_Holiday_Master();
    const nextFormattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
        // Check if the date is a holiday in the HolidayMaster table
        const holiday = await HolidayMaster.findOne({
            where: {
                DATE: nextFormattedDate,
                IS_ACTIVE: true,
            },
        });

        if (holiday !== null) {
            // If holiday is found, return true
            return true;
        } else {
            // If not a holiday, check if it's a Saturday or Sunday
            const dayOfWeek = date.getDay();
            console.log("dayOfWeek",dayOfWeek);
            return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
        }
    } catch (error) {
        console.error("Error checking holiday:", error);
        throw error;
    }
};

const saveToExpiryMst = async (date) => {
    const nextFormattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // Simulating an asynchronous call to save the date to tbl_expiry_mst
    try {
        const checkquery = `SELECT * FROM "TBL_EXPIRY_DATE_MST" WHERE "EXPIRY_DATE" = '${nextFormattedDate}' AND "IS_ACTIVE" = true;`;
        const result = await connect.sequelize.query(checkquery);
        console.log("check result:", result[0]);

        if (result[0].length === 0) {
            // Update existing entries to set IS_ACTIVE to false
            const updateQuery = `UPDATE "TBL_EXPIRY_DATE_MST" SET "IS_ACTIVE" = false`;
            await connect.sequelize.query(updateQuery);

            // Insert the new entry with the given date
            const insertQuery = `INSERT INTO "TBL_EXPIRY_DATE_MST" ("EXPIRY_DATE", "IS_ACTIVE", "CREATED_ON") VALUES ('${nextFormattedDate}', true, CURRENT_TIMESTAMP)`;
            await connect.sequelize.query(insertQuery, [nextFormattedDate]);

            console.log("Saving date to tbl_expiry_mst:", nextFormattedDate);
        }
    } catch (error) {
        console.error("Error saving to tbl_expiry_mst:", error);
        throw error;
    }
};

const checkAndSaveDates = async () => {

    const today = new Date();
    today.setDate(today.getDate() + 1);

    // Formatted today's date
    // const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    console.log("Today's formatted date:", today);

    // Check if today's date is a holiday
    const isHolidayToday = await checkHoliday(today);

    if (!isHolidayToday) {
        // Save today's date to tbl_expiry_mst
        await saveToExpiryMst(today);
    } else {
        // If today is a holiday, find the next working day
        let nextDate = new Date(today);

        while (await checkHoliday(nextDate)) {
            nextDate.setDate(nextDate.getDate() + 1);
        }

        // Save the next working day to tbl_expiry_mst
        await saveToExpiryMst(nextDate);
    }
};

var sendExpriyMstData = async function sendExpriyMstData() {
    checkAndSaveDates()
        .then(() => {
            console.log("Process completed successfully.");
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


// Call the main function
module.exports.sendExpriyMstData = sendExpriyMstData;
