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
        const formatsToTry = ['YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD','DD/MM/YYYY'];
        
        for (const format of formatsToTry) {
            const parsedDate = moment(dateString, format, true);
            if (parsedDate.isValid()) {
                return parsedDate.format('YYYY-MM-DD');
            }
        }
    
        // Return original string if no valid format is found
        return dateString;
    }

    router.route('/getRelativeData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_RELATIONINFORMATION = datamodel.TBL_HRMS_EMP_RELATIONINFORMATION();

            var param = {
                attributes: ['EMP_DISPLAY_NUMBER', 'EMP_CALLING_NAME', 'PAN', 'DEPENDANT', 'EREL_RELATIONSHIP', 'EREL_BIRTHDAY', 'EREL_TELEPHONE', 'CREATED_ON'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_RELATIONINFORMATION, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_RELATIONINFORMATION Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_RELATIONINFORMATION Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getRelativeData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_RELATIONINFORMATION Table', Data: null });
                });

        });

    router.route('/SaveRelativeData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const EmpDisplayNumber = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const EmpCallingName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const PAN = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const Dependent = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const Relationship = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const EmpRelBirthday = worksheet.getRow(i).values[6] === undefined ? null : formatDate(worksheet.getRow(i).values[6]);
                            const EmpRelTelephone = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];

                            console.log(`Cell values at row ${i}:`, EmpDisplayNumber, EmpCallingName, PAN, Dependent, Relationship, EmpRelBirthday, EmpRelTelephone);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);


                            const TBL_HRMS_EMP_RELATIONINFORMATION = datamodel.TBL_HRMS_EMP_RELATIONINFORMATION();

                            // const query = `SELECT * FROM "TBL_HRMS_EMP_RELATIONINFORMATION" WHERE "EMP_DISPLAY_NUMBER" = '${EmpDisplayNumber}' AND "DEPENDANT" = '${Dependent}' AND "EREL_RELATIONSHIP" = '${Relationship}'`;
                            const query = `SELECT *
                            FROM "TBL_HRMS_EMP_RELATIONINFORMATION"
                            WHERE "EMP_DISPLAY_NUMBER" = '${EmpDisplayNumber}'
                              AND (("DEPENDANT" IS NULL AND "EREL_RELATIONSHIP" IS NULL)
                                   OR ("DEPENDANT" = '${Dependent}' AND "EREL_RELATIONSHIP" = '${Relationship}'));`
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    EMP_DISPLAY_NUMBER: EmpDisplayNumber,
                                    EMP_CALLING_NAME: EmpCallingName,
                                    PAN: PAN,
                                    DEPENDANT: Dependent,
                                    EREL_RELATIONSHIP: Relationship,
                                    EREL_BIRTHDAY: EmpRelBirthday,
                                    EREL_TELEPHONE: EmpRelTelephone
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_RELATIONINFORMATION, values);
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

    router.route('/getEmpInfoData')
        .get(function (req, res) {

            const TBL_HRMS_EMPLOYEE_INFORMATION = datamodel.TBL_HRMS_EMPLOYEE_INFORMATION();

            var param = {
                attributes: ['EMP_NUMBER', 'EMP_ID', 'PAN', 'LOGIN_ID', 'EMP_TITLE', 'EMP_CALLING_NAME', 'EMP_SURNAME', 'EMP_FULL_NAME', 'GENDER', 'ZONE', 'INFRA', 'CATEGORY', 'ENTITY',
                    'TYPE_OF_EMPLOYMENT', 'EMP_BLOOD_GROUP', 'EMP_RESIGN_DATE', 'DESIGNATION_NAME', 'EXTERNAL_DESIGNATION', 'COUNTRY', 'STATE', 'PINCODE', 'EMP_DATE_JOINED', 'EMP_BIRTHDAY',
                    'GRP_NAME', 'CLUSTER', 'SBU', 'LOB', 'MIDDLE_NAME_FATHERS_NAME', 'EMPLOYMENT_STATUS', 'SLOB', 'LOCATION', 'EMP_PER_TELEPHONE', 'EMP_PER_MOBILE', 'EMP_TEM_TELEPHONE', 'EMP_TEM_MOBILE',
                    'EMP_OFFICE_MOBILE', 'EMP_ACTIVE_ATT_FLG', 'EMP_ACTIVE_HRM_FLG', 'EMP_OFFICE_EMAIL', 'CONT_DURING_WRKN', 'EMP_PER_EMAIL', 'EMP_PER_ADDRESS1', 'EMP_PER_ADDRESS2', 'EMP_PER_ADDRESS3', 'EMP_TEM_ADDRESS1',
                    'EMP_TEM_ADDRESS2', 'EMP_TEM_ADDRESS3', 'EMG_CONTACT', 'LEADERSHIP_GRP', 'EXIT_REASON', 'LEVEL1_NAME', 'LEVEL2_NAME', 'ARRIVAL_CONFORMATION_DATE', 'RA_ID', 'CREATED_ON', 'MARITAL_STATUS', 'BG_CODE', 'SBU_CODE',
                    'LOB_CODE', 'SUB_LOB_CODE', 'ENTITY_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMPLOYEE_INFORMATION, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMPLOYEE_INFORMATION Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMPLOYEE_INFORMATION Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getEmpInfoData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMPLOYEE_INFORMATION Table', Data: null });
                });

        });

    router.route('/SaveEmpInfoData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const EmpNo = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const EmpID = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const PAN = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const LoginID = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const EmpTitle = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const EmpCallingName = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const EmpSurname = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const EmpFullName = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];
                            const Gender = worksheet.getRow(i).values[9] === undefined ? null : worksheet.getRow(i).values[9];
                            const Zone = worksheet.getRow(i).values[10] === undefined ? null : worksheet.getRow(i).values[10];
                            const Infra = worksheet.getRow(i).values[11] === undefined ? null : worksheet.getRow(i).values[11];
                            const Category = worksheet.getRow(i).values[12] === undefined ? null : worksheet.getRow(i).values[12];
                            const Entity = worksheet.getRow(i).values[13] === undefined ? null : worksheet.getRow(i).values[13];
                            const TypeOfEmployment = worksheet.getRow(i).values[14] === undefined ? null : worksheet.getRow(i).values[14];
                            const BloodGroup = worksheet.getRow(i).values[15] === undefined ? null : worksheet.getRow(i).values[15];
                            const ResignDate = worksheet.getRow(i).values[16] === undefined ? null : formatDate(worksheet.getRow(i).values[16]);
                            const DesignationName = worksheet.getRow(i).values[17] === undefined ? null : worksheet.getRow(i).values[17];
                            const ExternalDesignation = worksheet.getRow(i).values[18] === undefined ? null : worksheet.getRow(i).values[18];
                            const Country = worksheet.getRow(i).values[19] === undefined ? null : worksheet.getRow(i).values[19];
                            const State = worksheet.getRow(i).values[20] === undefined ? null : worksheet.getRow(i).values[20];
                            const PinCode = worksheet.getRow(i).values[21] === undefined ? null : worksheet.getRow(i).values[21];
                            const JoinedDate = worksheet.getRow(i).values[22] === undefined ? null : formatDate(worksheet.getRow(i).values[22]);
                            const BirthDate = worksheet.getRow(i).values[23] === undefined ? null : formatDate(worksheet.getRow(i).values[23]);
                            const GrpName = worksheet.getRow(i).values[24] === undefined ? null : worksheet.getRow(i).values[24];
                            const Cluster = worksheet.getRow(i).values[25] === undefined ? null : worksheet.getRow(i).values[25];
                            const SBU = worksheet.getRow(i).values[26] === undefined ? null : worksheet.getRow(i).values[26];
                            const LOB = worksheet.getRow(i).values[27] === undefined ? null : worksheet.getRow(i).values[27];
                            const MiddleFatherName = worksheet.getRow(i).values[28] === undefined ? null : worksheet.getRow(i).values[28];
                            const EmploymentStatus = worksheet.getRow(i).values[29] === undefined ? null : worksheet.getRow(i).values[29];
                            const Slob = worksheet.getRow(i).values[30] === undefined ? null : worksheet.getRow(i).values[30];
                            const Location = worksheet.getRow(i).values[31] === undefined ? null : worksheet.getRow(i).values[31];
                            const PerTelephoneNo = worksheet.getRow(i).values[32] === undefined ? null : worksheet.getRow(i).values[32];
                            const PerMobileNo = worksheet.getRow(i).values[33] === undefined ? null : worksheet.getRow(i).values[33];
                            const TempTelephoneNo = worksheet.getRow(i).values[34] === undefined ? null : worksheet.getRow(i).values[34];
                            const TempMobileNo = worksheet.getRow(i).values[35] === undefined ? null : worksheet.getRow(i).values[35];
                            const OfficeMobileNo = worksheet.getRow(i).values[36] === undefined ? null : worksheet.getRow(i).values[36];
                            const ActiveAttFlag = worksheet.getRow(i).values[37] === undefined ? null : worksheet.getRow(i).values[37];
                            const ActiveHRMSFlag = worksheet.getRow(i).values[38] === undefined ? null : worksheet.getRow(i).values[38];
                            const OfficeEmail = worksheet.getRow(i).values[39] === undefined ? null : worksheet.getRow(i).values[39];
                            const ContDuringWRKN = worksheet.getRow(i).values[40] === undefined ? null : worksheet.getRow(i).values[40];
                            const PerEmail = worksheet.getRow(i).values[41] === undefined ? null : worksheet.getRow(i).values[41];
                            const PerAddress1 = worksheet.getRow(i).values[42] === undefined ? null : worksheet.getRow(i).values[42];
                            const PerAddress2 = worksheet.getRow(i).values[43] === undefined ? null : worksheet.getRow(i).values[43];
                            const PerAddress3 = worksheet.getRow(i).values[44] === undefined ? null : worksheet.getRow(i).values[44];
                            const TempAddress1 = worksheet.getRow(i).values[45] === undefined ? null : worksheet.getRow(i).values[45];
                            const TempAddress2 = worksheet.getRow(i).values[46] === undefined ? null : worksheet.getRow(i).values[46];
                            const TempAddress3 = worksheet.getRow(i).values[47] === undefined ? null : worksheet.getRow(i).values[47];
                            const Contact = worksheet.getRow(i).values[48] === undefined ? null : worksheet.getRow(i).values[48];
                            const LeadershipGrp = worksheet.getRow(i).values[49] === undefined ? null : worksheet.getRow(i).values[49];
                            const ExitReason = worksheet.getRow(i).values[50] === undefined ? null : worksheet.getRow(i).values[50];
                            const Level1Name = worksheet.getRow(i).values[51] === undefined ? null : worksheet.getRow(i).values[51];
                            const Level2Name = worksheet.getRow(i).values[52] === undefined ? null : worksheet.getRow(i).values[52];
                            const ArrivalConformationdate = worksheet.getRow(i).values[53] === undefined ? null : worksheet.getRow(i).values[53];
                            const RAID = worksheet.getRow(i).values[54] === undefined ? null : worksheet.getRow(i).values[54];
                            const CreatedON = worksheet.getRow(i).values[55] === undefined ? null : formatDate(worksheet.getRow(i).values[55]);
                            const MaritalStatus = worksheet.getRow(i).values[56] === undefined ? null : worksheet.getRow(i).values[56];
                            const BGCode = worksheet.getRow(i).values[57] === undefined ? null : worksheet.getRow(i).values[57];
                            const SBUCode = worksheet.getRow(i).values[58] === undefined ? null : worksheet.getRow(i).values[58];
                            const LOBCode = worksheet.getRow(i).values[59] === undefined ? null : worksheet.getRow(i).values[59];
                            const SUBLOBCode = worksheet.getRow(i).values[60] === undefined ? null : worksheet.getRow(i).values[60];
                            const EntityCode = worksheet.getRow(i).values[61] === undefined ? null : worksheet.getRow(i).values[61];

                            console.log(`Cell values at row ${i}:`, EmpNo, EmpID, PAN, LoginID, EmpTitle, EmpCallingName, EmpSurname, EmpFullName, Gender, Zone, Infra, Category, Entity, TypeOfEmployment, BloodGroup, ResignDate, DesignationName, ExternalDesignation, Country, State, PinCode, JoinedDate, BirthDate, GrpName, Cluster, SBU,
                                LOB, MiddleFatherName, EmploymentStatus, Slob, Location, PerTelephoneNo, PerMobileNo, TempTelephoneNo, TempMobileNo, OfficeMobileNo, ActiveAttFlag, ActiveHRMSFlag, OfficeEmail, ContDuringWRKN, PerEmail, PerAddress1, PerAddress2, PerAddress3,
                                TempAddress1, TempAddress2, TempAddress3, Contact, LeadershipGrp, ExitReason, Level1Name, Level2Name, ArrivalConformationdate, RAID, CreatedON, MaritalStatus, BGCode, SBUCode, LOBCode, SUBLOBCode, EntityCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMPLOYEE_INFORMATION = datamodel.TBL_HRMS_EMPLOYEE_INFORMATION();

                            const query = `SELECT * FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "EMP_NUMBER" = '${EmpNo}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    EMP_NUMBER: EmpNo,
                                    EMP_ID: EmpID,
                                    PAN: PAN,
                                    LOGIN_ID: LoginID,
                                    EMP_TITLE: EmpTitle,
                                    EMP_CALLING_NAME: EmpCallingName,
                                    EMP_SURNAME: EmpSurname,
                                    EMP_FULL_NAME: EmpFullName,
                                    GENDER: Gender,
                                    ZONE: Zone,
                                    INFRA: Infra,
                                    CATEGORY: Category,
                                    ENTITY: Entity,
                                    TYPE_OF_EMPLOYMENT: TypeOfEmployment,
                                    EMP_BLOOD_GROUP: BloodGroup,
                                    EMP_RESIGN_DATE: ResignDate,
                                    DESIGNATION_NAME: DesignationName,
                                    EXTERNAL_DESIGNATION: ExternalDesignation,
                                    COUNTRY: Country,
                                    STATE: State,
                                    PINCODE: PinCode,
                                    EMP_DATE_JOINED: JoinedDate,
                                    EMP_BIRTHDAY: BirthDate,
                                    GRP_NAME: GrpName,
                                    CLUSTER: Cluster,
                                    SBU: SBU,
                                    LOB: LOB,
                                    MIDDLE_NAME_FATHERS_NAME: MiddleFatherName,
                                    EMPLOYMENT_STATUS: EmploymentStatus,
                                    SLOB: Slob,
                                    LOCATION: Location,
                                    EMP_PER_TELEPHONE: PerTelephoneNo,
                                    EMP_PER_MOBILE: PerMobileNo,
                                    EMP_TEM_TELEPHONE: TempTelephoneNo,
                                    EMP_TEM_MOBILE: TempMobileNo,
                                    EMP_OFFICE_MOBILE: OfficeMobileNo,
                                    EMP_ACTIVE_ATT_FLG: ActiveAttFlag,
                                    EMP_ACTIVE_HRM_FLG: ActiveHRMSFlag,
                                    EMP_OFFICE_EMAIL: OfficeEmail,
                                    CONT_DURING_WRKN: ContDuringWRKN,
                                    EMP_PER_EMAIL: PerEmail,
                                    EMP_PER_ADDRESS1: PerAddress1,
                                    EMP_PER_ADDRESS2: PerAddress2,
                                    EMP_PER_ADDRESS3: PerAddress3,
                                    EMP_TEM_ADDRESS1: TempAddress1,
                                    EMP_TEM_ADDRESS2: TempAddress2,
                                    EMP_TEM_ADDRESS3: TempAddress3,
                                    EMG_CONTACT: Contact,
                                    LEADERSHIP_GRP: LeadershipGrp,
                                    EXIT_REASON: ExitReason,
                                    LEVEL1_NAME: Level1Name,
                                    LEVEL2_NAME: Level2Name,
                                    ARRIVAL_CONFORMATION_DATE: ArrivalConformationdate,
                                    RA_ID: RAID,
                                    MARITAL_STATUS: MaritalStatus,
                                    BG_CODE: BGCode,
                                    SBU_CODE: SBUCode,
                                    LOB_CODE: LOBCode,
                                    SUB_LOB_CODE: SUBLOBCode,
                                    ENTITY_CODE: EntityCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMPLOYEE_INFORMATION, values);
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

    router.route('/getEmailData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_EMAIL = datamodel.TBL_HRMS_EMP_EMAIL();

            var param = {
                attributes: ['EMAIL_TYPE', 'EMAIL_ADDRESS', 'IS_PRIMARY', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_EMAIL, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_EMAIL Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_EMAIL Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getEmailData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_EMAIL Table', Data: null });
                });

        });

    router.route('/SaveEmailData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const EmailType = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const EmailAddress = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const IsPrimary = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const EmployeeCode = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];


                            console.log(`Cell values at row ${i}:`, EmailType, EmailAddress, IsPrimary, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_EMAIL = datamodel.TBL_HRMS_EMP_EMAIL();


                            const query = `SELECT * FROM "TBL_HRMS_EMP_EMAIL" WHERE "EMPLOYEE_CODE" = '${EmployeeCode}' AND "EMAIL_ADDRESS" = '${EmailAddress}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    EMAIL_TYPE: EmailType,
                                    EMAIL_ADDRESS: EmailAddress,
                                    IS_PRIMARY: IsPrimary,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_EMAIL, values);
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

    router.route('/getEmgContactData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_EMERGENCY_CONTACT = datamodel.TBL_HRMS_EMP_EMERGENCY_CONTACT();

            var param = {
                attributes: ['NAME', 'RELATIONSHIP', 'PRIMARY_EMERGENCY', 'EMERGENCY_CONTACT_NUMBER', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_EMERGENCY_CONTACT, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_EMERGENCY_CONTACT Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_EMERGENCY_CONTACT Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getEmgContactData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_EMERGENCY_CONTACT Table', Data: null });
                });

        });

    router.route('/SaveEmgContactData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const Name = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const Relationship = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const PrimaryEmergency = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const EmergencyContactNo = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const EmployeeCode = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];

                            console.log(`Cell values at row ${i}:`, Name, Relationship, PrimaryEmergency, EmergencyContactNo, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_EMERGENCY_CONTACT = datamodel.TBL_HRMS_EMP_EMERGENCY_CONTACT();


                            const query = `SELECT * FROM "TBL_HRMS_EMP_EMERGENCY_CONTACT" WHERE "EMPLOYEE_CODE" = '${EmployeeCode}' AND 
                            "EMERGENCY_CONTACT_NUMBER" = '${EmergencyContactNo}' AND "RELATIONSHIP" = '${Relationship}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    NAME: Name,
                                    RELATIONSHIP: Relationship,
                                    PRIMARY_EMERGENCY: PrimaryEmergency,
                                    EMERGENCY_CONTACT_NUMBER: EmergencyContactNo,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_EMERGENCY_CONTACT, values);
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

    router.route('/getVoiceData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_VOICE_DETAILS = datamodel.TBL_HRMS_EMP_VOICE_DETAILS();

            var param = {
                attributes: ['PHONE_TYPE', 'PHONE_NUMBER', 'AREA_CODE', 'COUNTRY_CODE', 'OFFICE_TELEPHONE_BOARD', 'OFFICE_EXTENSION', 'OFFICE_TELEPHONE_DIRECT', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_VOICE_DETAILS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_VOICE_DETAILS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_VOICE_DETAILS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getVoiceData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_VOICE_DETAILS Table', Data: null });
                });

        });

    router.route('/SaveVoiceData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const PhoneType = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const PhoneNo = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const AreaCode = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const CountryCode = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const OfficeTelephoneBoard = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const OfficeExtension = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const OfficeTelephoneDirect = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const EmployeeCode = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];

                            console.log(`Cell values at row ${i}:`, PhoneType, PhoneNo, AreaCode, CountryCode, OfficeTelephoneBoard, OfficeExtension, OfficeTelephoneDirect, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_VOICE_DETAILS = datamodel.TBL_HRMS_EMP_VOICE_DETAILS();

                            const query = `SELECT * FROM "TBL_HRMS_EMP_VOICE_DETAILS" WHERE "EMPLOYEE_CODE" = '${EmployeeCode}' AND "PHONE_NUMBER" = '${PhoneNo}';`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    PHONE_TYPE: PhoneType,
                                    PHONE_NUMBER: PhoneNo,
                                    AREA_CODE: AreaCode,
                                    COUNTRY_CODE: CountryCode,
                                    OFFICE_TELEPHONE_BOARD: OfficeTelephoneBoard,
                                    OFFICE_EXTENSION: OfficeExtension,
                                    OFFICE_TELEPHONE_DIRECT: OfficeTelephoneDirect,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_VOICE_DETAILS, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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

    router.route('/getAddressData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_ADDRESS = datamodel.TBL_HRMS_EMP_ADDRESS();

            var param = {
                attributes: ['ADDRESS_TYPE', 'STREET', 'HOUSE_NUMBER', 'EXTRA_ADDRESS_LINE', 'CITY', 'STATE', 'PINCODE', 'COUNTRY', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_ADDRESS, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result); 
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_ADDRESS Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_ADDRESS Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getAddressData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_ADDRESS Table', Data: null });
                });

        });

    router.route('/SaveAddressData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const AddressType = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const Street = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const HouseNo = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const ExtraAddressLine = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const City = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const State = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const Pincode = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const Country = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];
                            const EmployeeCode = worksheet.getRow(i).values[9] === undefined ? null : worksheet.getRow(i).values[9];

                            console.log(`Cell values at row ${i}:`, AddressType, Street, HouseNo, ExtraAddressLine, City, State, Pincode, Country, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_ADDRESS = datamodel.TBL_HRMS_EMP_ADDRESS();

                            const query = `SELECT * FROM "TBL_HRMS_EMP_ADDRESS" WHERE "ADDRESS_TYPE" = '${AddressType}' AND "EMPLOYEE_CODE" = '${EmployeeCode}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    ADDRESS_TYPE: AddressType,
                                    STREET: Street,
                                    HOUSE_NUMBER: HouseNo,
                                    EXTRA_ADDRESS_LINE: ExtraAddressLine,
                                    CITY: City,
                                    STATE: State,
                                    PINCODE: Pincode,
                                    COUNTRY: Country,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_ADDRESS, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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

    router.route('/getWorkexData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_WORKEX_DATA_EAH = datamodel.TBL_HRMS_EMP_WORKEX_DATA_EAH();

            var param = {
                attributes: ['EMP_DISPLAY_NUMBER', 'EMP_CALLING_NAME', 'PAST_COMPANY'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_WORKEX_DATA_EAH, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_WORKEX_DATA_EAH Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_WORKEX_DATA_EAH Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getWorkexData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_WORKEX_DATA_EAH Table', Data: null });
                });

        });

    router.route('/SaveWorkexData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const EmpdisplayNo = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const EmpCallingName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const PastCompany = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];

                            console.log(`Cell values at row ${i}:`, EmpdisplayNo, EmpCallingName, PastCompany);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_WORKEX_DATA_EAH = datamodel.TBL_HRMS_EMP_WORKEX_DATA_EAH();

                            const query = `SELECT * FROM "TBL_HRMS_EMP_WORKEX_DATA_EAH" WHERE "EMP_DISPLAY_NUMBER" = '${EmpdisplayNo}' AND "PAST_COMPANY" = '${PastCompany}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    EMP_DISPLAY_NUMBER: EmpdisplayNo,
                                    EMP_CALLING_NAME: EmpCallingName,
                                    PAST_COMPANY: PastCompany
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_WORKEX_DATA_EAH, values);
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

    router.route('/getQualificationData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_QUALIFICATION_DATA_EAH = datamodel.TBL_HRMS_EMP_QUALIFICATION_DATA_EAH();

            var param = {
                attributes: ['UNIVERSITY', 'OTHER_UNIVERSITY', 'ACHIEVED_SCORE_IN_PERCENTAGE', 'HIGHEST_EDUCATION', 'COURSE', 'COURSE_TYPE', 'SPECIALIZATION', 'START_DATE', 'END_DATE', 'INSTITUTE', 'OTHER_INSTITUTE', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_QUALIFICATION_DATA_EAH, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_QUALIFICATION_DATA_EAH Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_QUALIFICATION_DATA_EAH Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getQualificationData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_QUALIFICATION_DATA_EAH Table', Data: null });
                });

        });

    router.route('/SaveQualificationData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const University = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const OtherUniversity = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const Score = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const HighestEducation = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const Course = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const CourseType = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const Specialization = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const StartDate = worksheet.getRow(i).values[8] === undefined ? null : formatDate(worksheet.getRow(i).values[8]);
                            const EndDate = worksheet.getRow(i).values[9] === undefined ? null : formatDate(worksheet.getRow(i).values[9]);
                            const Institute = worksheet.getRow(i).values[10] === undefined ? null : worksheet.getRow(i).values[10];
                            const OtherInstitute = worksheet.getRow(i).values[11] === undefined ? null : worksheet.getRow(i).values[11];
                            const EmployeeCode = worksheet.getRow(i).values[12] === undefined ? null : worksheet.getRow(i).values[12];

                            console.log(`Cell values at row ${i}:`, University, OtherUniversity, Score, HighestEducation, Course, CourseType, Specialization, StartDate, EndDate, Institute, OtherInstitute, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_QUALIFICATION_DATA_EAH = datamodel.TBL_HRMS_EMP_QUALIFICATION_DATA_EAH();


                            const query = `SELECT * FROM "TBL_HRMS_EMP_QUALIFICATION_DATA_EAH" WHERE "EMPLOYEE_CODE" = '${EmployeeCode}' AND "COURSE" = '${Course}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    UNIVERSITY: University,
                                    OTHER_UNIVERSITY: OtherUniversity,
                                    ACHIEVED_SCORE_IN_PERCENTAGE: Score,
                                    HIGHEST_EDUCATION: HighestEducation,
                                    COURSE: Course,
                                    COURSE_TYPE: CourseType,
                                    SPECIALIZATION: Specialization,
                                    START_DATE: StartDate,
                                    END_DATE: EndDate,
                                    INSTITUTE: Institute,
                                    OTHER_INSTITUTE: OtherInstitute,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_QUALIFICATION_DATA_EAH, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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

    router.route('/getNationalityData')
        .get(function (req, res) {

            const TBL_HRMS_EMP_NATIONALITY = datamodel.TBL_HRMS_EMP_NATIONALITY();

            var param = {
                attributes: ['COUNTRY', 'NATIONAL_ID_CARD_TYPE', 'NATIONAL_ID_NUMBER', 'EMPLOYEE_CODE'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_EMP_NATIONALITY, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_EMP_NATIONALITY Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_NATIONALITY Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getNationalityData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_EMP_NATIONALITY Table', Data: null });
                });

        });

    router.route('/SaveNationalityData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const Country = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const NationalIDCardType = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const NationalIDNumber = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const EmployeeCode = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];

                            console.log(`Cell values at row ${i}:`, Country, NationalIDCardType, NationalIDNumber, EmployeeCode);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_EMP_NATIONALITY = datamodel.TBL_HRMS_EMP_NATIONALITY();


                            const query = `SELECT * FROM "TBL_HRMS_EMP_NATIONALITY" WHERE "EMPLOYEE_CODE" = '${EmployeeCode}' AND "NATIONAL_ID_NUMBER" = '${NationalIDNumber}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    COUNTRY: Country,
                                    NATIONAL_ID_CARD_TYPE: NationalIDCardType,
                                    NATIONAL_ID_NUMBER: NationalIDNumber,
                                    EMPLOYEE_CODE: EmployeeCode
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_EMP_NATIONALITY, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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

    router.route('/getCompanyHierMappingData')
        .get(function (req, res) {

            const TBL_HRMS_COMPANY_HIERARCHY_MAPPING = datamodel.TBL_HRMS_COMPANY_HIERARCHY_MAPPING();

            var param = {
                attributes: ['CLUSTER_ID', 'CLUSTER_NAME', 'SBU_ID', 'SBU_NAME', 'LOB_ID', 'LOB_NAME', 'SUBLOB_ID', 'SUBLOB_NAME'],
            };

            console.log("param", param);

            dataaccess.FindAll(TBL_HRMS_COMPANY_HIERARCHY_MAPPING, param)
                .then(function (result) {
                    console.log("result", result);
                    if (result != null) {
                        var EncryptLoginDetails = dataconn.encryptionAES(result);
                        res.status(200).json({ Success: true, Message: 'TBL_HRMS_COMPANY_HIERARCHY_MAPPING Table Access', Data: EncryptLoginDetails });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_COMPANY_HIERARCHY_MAPPING Table', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('uploads', 'getCompanyHierMappingData', err);
                    res.status(200).json({ Success: false, Message: 'User Has No Access Of TBL_HRMS_COMPANY_HIERARCHY_MAPPING Table', Data: null });
                });

        });

    router.route('/SaveCompanyHierMappingData')
        .post(upload.any(), async function (req, res) {
            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }
            let requestBody = req.body;
            let requestFiles = req.files;
            console.log("requestBody", requestBody, requestFiles);
            const Folder_Path = path.join(__dirname, 'HRMSUploadFiles');

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
                            const ClusterID = worksheet.getRow(i).values[1] === undefined ? null : worksheet.getRow(i).values[1];
                            const ClusterName = worksheet.getRow(i).values[2] === undefined ? null : worksheet.getRow(i).values[2];
                            const SBUID = worksheet.getRow(i).values[3] === undefined ? null : worksheet.getRow(i).values[3];
                            const SBUName = worksheet.getRow(i).values[4] === undefined ? null : worksheet.getRow(i).values[4];
                            const LOBID = worksheet.getRow(i).values[5] === undefined ? null : worksheet.getRow(i).values[5];
                            const LOBName = worksheet.getRow(i).values[6] === undefined ? null : worksheet.getRow(i).values[6];
                            const SUBLOBID = worksheet.getRow(i).values[7] === undefined ? null : worksheet.getRow(i).values[7];
                            const SUBLOBName = worksheet.getRow(i).values[8] === undefined ? null : worksheet.getRow(i).values[8];

                            console.log(`Cell values at row ${i}:`, ClusterID, ClusterName, SBUID, SBUName, LOBID, LOBName, SUBLOBID, SUBLOBName);
                            console.log(`Row data at row ${i}:`, worksheet.getRow(i).values);

                            const TBL_HRMS_COMPANY_HIERARCHY_MAPPING = datamodel.TBL_HRMS_COMPANY_HIERARCHY_MAPPING();


                            const query = `SELECT * FROM "TBL_HRMS_COMPANY_HIERARCHY_MAPPING" WHERE "CLUSTER_ID" = '${ClusterID}' AND "SBU_ID" = '${SBUID}' AND "LOB_ID" = '${LOBID}' AND "SUBLOB_ID" = '${SUBLOBID}'`;
                            const rows = await connect.sequelize.query(query);
                            console.log("rows", rows[0]);

                            if (rows[0].length === 0) {
                                var values = {
                                    CLUSTER_ID: ClusterID,
                                    CLUSTER_NAME: ClusterName,
                                    SBU_ID: SBUID,
                                    SBU_NAME: SBUName,
                                    LOB_ID: LOBID,
                                    LOB_NAME: LOBName,
                                    SUBLOB_ID: SUBLOBID,
                                    SUBLOB_NAME: SUBLOBName
                                };

                                try {
                                    createdGreyListMST = await dataaccess.Create(TBL_HRMS_COMPANY_HIERARCHY_MAPPING, values);
                                    // res.status(200).json({ Success: true, Message: 'File Updated Successfully', Data: filePath });
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


    return router;
};

module.exports = routes;