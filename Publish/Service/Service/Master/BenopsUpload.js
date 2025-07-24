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

var routes = function () {
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

    router.route('/SaveBenposData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'BenPosUploadFile');

            console.log("Folder_Path", Folder_Path);

            fileDetails = req.files;
            console.log('fileDetails', fileDetails.length, fileDetails);
            finalData = [];

            for (let i = 0; i < fileDetails.length; i++) {
                console.log("1", fileDetails[i]);

                let newFileName = `${fileDetails[i].originalname}`;


                let writeFile = util.promisify(fs.writeFile)


                console.log('path..', newFileName);

                const filePath = path.join(Folder_Path, newFileName); // Use the existing folder path
                console.log("123", filePath); // Use the existing folder path

                await writeFile(filePath, fileDetails[i].buffer);

                if (filePath != null) {
                    // writeFile(filePath, fileDetails[i].buffer);
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.readFile(filePath);
                    const worksheet = workbook.getWorksheet(1);
                    try {
                        for (let i = 2; i <= worksheet.rowCount; i++) {                            
                            const FOLIO_NO = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const SHARE_HOLDER_NAME = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const SHARES = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const JOINT_HOLDER1 = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const JOINT_HOLDER2 = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const JOINT_HOLDER3 = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const FATHER_HUSBAND_NAME = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const ADDRESS_LINE1 = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];
                            const ADDRESS_LINE2 = worksheet.getRow(i).values[9] === undefined ? null : worksheet.getRow(i).values[9];
                            const ADDRESS_LINE3 = worksheet.getRow(i).values[10] === undefined ? null : worksheet.getRow(i).values[10];
                            const CITY_NAME = worksheet.getRow(i).values[11] === undefined ? null : worksheet.getRow(i).values[11];
                            const PINCODE = worksheet.getRow(i).values[12] === undefined ? null : worksheet.getRow(i).values[12];
                            const EMAIL_ID = worksheet.getRow(i).values[13] === undefined ? null : worksheet.getRow(i).values[13];
                            const PHONE_NO = worksheet.getRow(i).values[14] === undefined ? null : worksheet.getRow(i).values[14];
                            const PANCARD_NO = worksheet.getRow(i).values[15] === undefined ? null : worksheet.getRow(i).values[15];
                            const SECOND_HOLDER_PAN_NO = worksheet.getRow(i).values[16] === undefined ? null : worksheet.getRow(i).values[16];
                            const THIRD_HOLDER_PAN_NO = worksheet.getRow(i).values[17] === undefined ? null : worksheet.getRow(i).values[17];
                            const CATEGORY = worksheet.getRow(i).values[18] === undefined ? null : worksheet.getRow(i).values[18];
                            const STATUS = worksheet.getRow(i).values[19] === undefined ? null : worksheet.getRow(i).values[19];
                            const OCCUPATION = worksheet.getRow(i).values[20] === undefined ? null : worksheet.getRow(i).values[20];
                            const BANK_ACNO = worksheet.getRow(i).values[21] === undefined ? null : worksheet.getRow(i).values[21];
                            const BANK_NAME = worksheet.getRow(i).values[22] === undefined ? null : worksheet.getRow(i).values[22];
                            const BANK_ADDRESSLINE1 = worksheet.getRow(i).values[23] === undefined ? null : worksheet.getRow(i).values[23];
                            const BANK_ADDRESSLINE2 = worksheet.getRow(i).values[24] === undefined ? null : worksheet.getRow(i).values[24];
                            const BANK_ADDRESSLINE3 = worksheet.getRow(i).values[25] === undefined ? null : worksheet.getRow(i).values[25];
                            const BANK_ADDRESSLINE4 = worksheet.getRow(i).values[26] === undefined ? null : worksheet.getRow(i).values[26];
                            const BANK_PINCODE = worksheet.getRow(i).values[27] === undefined ? null : worksheet.getRow(i).values[27];
                            const BANK_ACTYPE = worksheet.getRow(i).values[28] === undefined ? null : worksheet.getRow(i).values[28];
                            const MICR_CODE = worksheet.getRow(i).values[29] === undefined ? null : worksheet.getRow(i).values[29];
                            const IFSC = worksheet.getRow(i).values[30] === undefined ? null : worksheet.getRow(i).values[30];
                            const NOMINEE_NAME = worksheet.getRow(i).values[31] === undefined ? null : worksheet.getRow(i).values[31];
                            const GUARDIAN_NAME = worksheet.getRow(i).values[32] === undefined ? null : worksheet.getRow(i).values[32];
                            const INVST_TYPE = worksheet.getRow(i).values[33] === undefined ? null : worksheet.getRow(i).values[33];

                            // console.log(`Cell values at row ${i}:`, dateValue, Day);
                            // console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_BENPOS_SHAREHOLDER_DETAILS = datamodel.TBL_BENPOS_SHAREHOLDER_DETAILS();

                            const createdByValue = req.body.UserId && req.body.UserId.length > 0 ? req.body.UserId[0].toString() : null;
                
                            const fromDateValue = req.body.fromDate;

                            let createdOnValue;

                            if (Array.isArray(fromDateValue)) {
                                // If it's an array, get the first element
                                createdOnValue = fromDateValue.length > 0 ? fromDateValue[0].toString() : null;
                            } else {
                                // If it's a single value, use it directly
                                createdOnValue = fromDateValue ? fromDateValue.toString() : null;
                            }


                            const query = `SELECT * FROM "TBL_BENPOS_SHAREHOLDER_DETAILS" WHERE "FOLIO_NO" = '${FOLIO_NO}' AND "AS_ON_DATE" = '${createdOnValue}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    FOLIO_NO: FOLIO_NO,
                                    SHARE_HOLDER_NAME: SHARE_HOLDER_NAME,
                                    SHARES: SHARES,
                                    JOINT_HOLDER1: JOINT_HOLDER1,
                                    JOINT_HOLDER2: JOINT_HOLDER2,
                                    JOINT_HOLDER3: JOINT_HOLDER3,
                                    FATHER_HUSBAND_NAME: FATHER_HUSBAND_NAME,
                                    ADDRESS_LINE1: ADDRESS_LINE1,
                                    ADDRESS_LINE2: ADDRESS_LINE2,
                                    ADDRESS_LINE3: ADDRESS_LINE3,
                                    CITY_NAME: CITY_NAME,
                                    PINCODE: PINCODE,
                                    EMAIL_ID: EMAIL_ID,
                                    PHONE_NO: PHONE_NO,
                                    PANCARD_NO: PANCARD_NO,
                                    SECOND_HOLDER_PAN_NO: SECOND_HOLDER_PAN_NO,
                                    THIRD_HOLDER_PAN_NO: THIRD_HOLDER_PAN_NO,
                                    CATEGORY: CATEGORY,
                                    STATUS: STATUS,
                                    OCCUPATION: OCCUPATION,
                                    BANK_ACNO: BANK_ACNO,
                                    BANK_NAME: BANK_NAME,
                                    BANK_ADDRESSLINE1: BANK_ADDRESSLINE1,
                                    BANK_ADDRESSLINE2: BANK_ADDRESSLINE2,
                                    BANK_ADDRESSLINE3: BANK_ADDRESSLINE3,
                                    BANK_ADDRESSLINE4: BANK_ADDRESSLINE4,
                                    BANK_PINCODE: BANK_PINCODE,
                                    BANK_ACTYPE: BANK_ACTYPE,
                                    MICR_CODE: MICR_CODE,
                                    IFSC: IFSC,
                                    NOMINEE_NAME: NOMINEE_NAME,
                                    GUARDIAN_NAME: GUARDIAN_NAME,
                                    INVST_TYPE: INVST_TYPE,
                                    AS_ON_DATE: createdOnValue,
                                    CREATED_BY: createdByValue
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_BENPOS_SHAREHOLDER_DETAILS, values);
                                    success = true;
                                } catch (error) {
                                    console.error("Error during database insertion:", error);
                                    res.status(200).json({ Success: false, Message: 'Error reading Excel file or inserting data', Data: null });
                                    success = false;
                                    break;
                                }
                            }


                        }

                        res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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
        });

    router.route('/getBenposData')
        .get(function (req, res) {

            const TBL_BENPOS_SHAREHOLDER_DETAILS = datamodel.TBL_BENPOS_SHAREHOLDER_DETAILS();

            var param = {
                attributes: ['FOLIO_NO', 'SHARE_HOLDER_NAME', 'SHARES', 'JOINT_HOLDER1', 'JOINT_HOLDER2', 'JOINT_HOLDER3', 'FATHER_HUSBAND_NAME', 'ADDRESS_LINE1', 'ADDRESS_LINE2', 'ADDRESS_LINE3', 'CITY_NAME', 'PINCODE', 'EMAIL_ID', 'PHONE_NO', 'PANCARD_NO', 'SECOND_HOLDER_PAN_NO', 'THIRD_HOLDER_PAN_NO', 'CATEGORY', 'STATUS', 'OCCUPATION', 'BANK_ACNO', 'BANK_NAME',
                    'BANK_ADDRESSLINE1', 'BANK_ADDRESSLINE2', 'BANK_ADDRESSLINE3', 'BANK_ADDRESSLINE4', 'BANK_PINCODE', 'BANK_ACTYPE', 'MICR_CODE', 'IFSC', 'NOMINEE_NAME', 'GUARDIAN_NAME', 'INVST_TYPE', 'AS_ON_DATE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_BENPOS_SHAREHOLDER_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);                         
                        res.status(200).json({ Success: true, Message: 'TBL_BENPOS_SHAREHOLDER_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BENPOS_SHAREHOLDER_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getBenposData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_BENPOS_SHAREHOLDER_DETAILS Table', Data: null });
                });

        });

    return router;
};

module.exports = routes;