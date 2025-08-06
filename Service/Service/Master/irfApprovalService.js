var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const path = require('path')
const fs = require('fs')
const pdfMake = require('pdfmake');
var moment = require('moment');
const { Op, JSON } = require('sequelize');
const nodemailer = require('nodemailer');
const { log } = require('console');
let pgp = require('pg-promise')()
var config = require('../../Config');

var routes = function () {
  router.post('/SubmitApproval', async (req, res) => {
    // console.log("req.body", req.body);
    try {
      var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

      const data = [...encryptmodel,];

      let finalResult = [];
      let newData = config.company.Company;
      let A = 0;
      for (let i = 0; i < data.length; i++) {

        const TBL_M3_UPSI_MST = datamodel.TBL_M3_UPSI_MST();
        const TBL_IRF_Approval_Data = datamodel.TBL_IRF_Approval_Data();

        if (data[i]) {
          query = {
            where: {
              EMPLOYEE_ID: data[i].EmployeeNumber,
              IS_ACTIVE: true
            }
          };
          // console.log('00', data[i].id);
        }

        let currentDate = moment(new Date()).format('YYYY-MM-DD')
        let currentTime = new Date().toLocaleTimeString()
        let empapprovalStatus;
        let emprejectionReason;
        let greyapprovalStatus;
        let greyrejectionReason;
        let restrictapprovalStatus;
        let restrictrejectionReason;
        let projectrejectionReason;
        let projectapprovalStatus;
        let approvalStatus;
        let rejectionReason;
        let lotcountpprovalStatus;
        let lotcountrejectionReason;
        let primaryrejectionReason;
        let primaryapprovalStatus;
        // let futurecount;
        // let finalresult;
        if (data[i] && data[i].Security) {

          let upsiProjectResult = await connect.sequelize.query(`select * from public."TBL_UPSI_PROJECT_SCRIPT_DETAILS" as "A" inner join "TBL_UPSI_PROJECT_MST" as "B" ON "A"."PROJECT_ID" = "B"."ID" where "B"."IS_ACTIVE" = true AND "A"."SCRIPT_NAME" = '${data[i].Security}' AND "A"."IS_ACTIVE" = true`);
          if (upsiProjectResult[0][0] && upsiProjectResult[0][0].PROJECT_ID) {
            let projectEmpResult = await connect.sequelize.query(`select * from "TBL_PROJECT_EMPLOYEE_DETAILS" where "IS_ACTIVE" = true and "PROJECT_ID" = '${upsiProjectResult[0][0].PROJECT_ID}' and  "EMPLOYEE_ID" = '${data[i].EmployeeNumber}'`);
            let upsiEmpResult = await connect.sequelize.query(`select * from "TBL_UPSI_EMPLOYEE_DETAILS" where "IS_ACTIVE" = true and "PROJECT_ID" = '${upsiProjectResult[0][0].PROJECT_ID}' and  "EMPNO" = '${data[i].EmployeeNumber}'`);
            let upsiEntityResult = await connect.sequelize.query(`select * from "TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA" where "IS_ACTIVE" = true and "PROJECT_ID" = '${upsiProjectResult[0][0].PROJECT_ID}' and  "EMPLOYEE_ID" = '${data[i].EmployeeNumber}'`);

            if (upsiEmpResult[0][0] || projectEmpResult[0][0] || upsiEntityResult[0][0]) {
              projectapprovalStatus = 'Rejected'
              projectrejectionReason = 'Scrip blocked by Compliance Team'
            } else {
              projectapprovalStatus = 'Approved'
              projectrejectionReason = ' '
            }
          } else {
            projectapprovalStatus = 'Approved'
            projectrejectionReason = ' '
          }
        } else {
          projectapprovalStatus = 'Approved'
          projectrejectionReason = ' '
        }
        let condition = await dataaccess.FindOne(TBL_M3_UPSI_MST, query);
        if (condition !== null) {
          console.log('11');
          empapprovalStatus = 'Rejected'
          emprejectionReason = 'Employee exist in UPSI Admin table'
        } else {
          empapprovalStatus = 'Approved'
          emprejectionReason = ' '
        }

        let userMstGreyCheck = await connect.sequelize.query(`select * from public."TBL_USER_MST" where "ISACTIVE" = true and "EMPNO" = '${data[i].EmployeeNumber}'`);

        // console.log("ttttt", userMstGreyCheck[0][0]);

        if (userMstGreyCheck[0][0]) {

          if (userMstGreyCheck[0][0].GREYLIST == true) {
            if (data[i] && data[i].Security) {

              let greyListResult = await connect.sequelize.query(`select * from public."TBL_GREY_LIST_MST" where "IS_ACTIVE" = true and "SCRIPT_NAME" = '${data[i].Security}'`);

              // console.log('abvd', currentDate, greyListResult[0][0].STARTDATE);
              // console.log('grey list', greyListResult[0]);

              if (greyListResult[0][0]) {
                let greyListResultDtls = await connect.sequelize.query(`select * from "TBL_GREY_LIST_DETAILSMST" where "IS_ACTIVE" = true and "GRELISTID" = '${greyListResult[0][0].ID}' and  "EMPNO" = '${data[i].EmployeeNumber}'`);

                if (greyListResultDtls[0][0]) {
                  if (currentDate >= moment(greyListResult[0][0].STARTDATE).format('YYYY-MM-DD') && currentDate <= moment(greyListResult[0][0].ENDDATE).format('YYYY-MM-DD')) {

                    greyapprovalStatus = 'Rejected'
                    greyrejectionReason = 'Grey List'
                  } else {


                    greyapprovalStatus = 'Approved'
                    greyrejectionReason = ' '
                  }
                } else {
                  greyapprovalStatus = 'Approved'
                  greyrejectionReason = ' '
                }
              } else {
                greyapprovalStatus = 'Approved'
                greyrejectionReason = ' '
              }
            } else {

              greyapprovalStatus = 'Approved'

              greyrejectionReason = ' '

            }
          } else {

            greyapprovalStatus = 'Approved'

            greyrejectionReason = ' '

          }
        } else {

          greyapprovalStatus = 'Approved'

          greyrejectionReason = ' '

        }

        if (data[i] && data[i].Security) {
          let query3 = `select * from public."TBL_RESTRICTED_LIST_MST" where "IS_ACTIVE" = true and "SCRIPT_NAME" = '${data[i].Security}'`
          let restrictedListResult = await connect.sequelize.query(query3);
          if (restrictedListResult[0][0]) {
            if (currentDate >= restrictedListResult[0][0].STARTDATE && currentDate <= restrictedListResult[0][0].ENDDATE) {


              restrictapprovalStatus = 'Rejected'
              restrictrejectionReason = 'Restricted List'
            } else {


              restrictapprovalStatus = 'Approved'
              restrictrejectionReason = ' '
            }
          } else {
            restrictapprovalStatus = 'Approved'
            restrictrejectionReason = ' '
          }
        } else {
          restrictapprovalStatus = 'Approved'
          restrictrejectionReason = ' '
        }

        //logic for primary ipo
        if (data[i].NatureofTrade === 'PrimaryIssue') {

          let iponoquery = `select * from public."TBL_ITRADING_PRIMARY_ISSUE_MST" where "NAME_OF_ISSUE" = '${data[i].NameOfIssue}' and "IS_ACTIVE" = true;`;
          let iponoresult = await connect.sequelize.query(iponoquery);
          let queryprimary = `select * from public."TBL_PRIMARY_ISSUE_REJECTION_LIST_MST" where "IS_ACTIVE" = true and "IPOID" = '${iponoresult[0][0].IPOID}' and "EMPLOYEE_CODE" = '${data[i].EmployeeNumber}';`
          let ipoempResult = await connect.sequelize.query(queryprimary);
          if (ipoempResult[0][0]) {
            primaryapprovalStatus = 'Rejected'
            primaryrejectionReason = 'Primary Issue Rejection'
          }
          else {
            primaryapprovalStatus = 'Approved'
            primaryrejectionReason = ' '
          }
        } else {
          primaryapprovalStatus = 'Approved'
          primaryrejectionReason = ' '
        }

        //logic for RollOver       
        if (data[i].NatureofTrade === 'Future' && data[i].Transaction === 'ROLLOVER' && data[i].QuantityLot === 'Lot') {
          let query3 = `select "LOT_SIZE" from public."TBL_SCRIPT_MST" where "IS_ACTIVE" = true and "ISIN_CODE" = '${data[i].ISIN}'`
          let count = await connect.sequelize.query(query3);


          if (count[0][0]) {
            let futurecount = data[i].FutOpQuantityLot * count[0][0].LOT_SIZE;


            let query = `WITH TMPQ_CTE AS (
                          SELECT 
                              CASE 
                                  WHEN "POST_EX_AS_GMNT_LONG_QUANTITY" = 0 
                                  THEN "POST_EX_AS_GMNT_SHORT_QUANTITY" 
                                  ELSE "POST_EX_AS_GMNT_LONG_QUANTITY" 
                              END AS QUANTITY
                              FROM "TBL_FNOROLLOVER_EXPIRYDATA"
                              WHERE "IS_ACTIVE" = true 
                              AND "INSTRUMENT_TYPE" = 'FUTSTK'
                              AND "EXPIRY_DATE" = CURRENT_DATE
                          )
                          SELECT SUM(COALESCE("quantity", 0)) AS total_quantity FROM TMPQ_CTE;`;

            let count1 = await connect.sequelize.query(query);
            let finalcount = count1[0][0].total_quantity;


            if (finalcount < futurecount) {
              lotcountpprovalStatus = 'Rejected'
              lotcountrejectionReason = 'RollOver Quantity Exceeds'
            } else {
              lotcountpprovalStatus = 'Approved'
              lotcountrejectionReason = ' '
            }
          } else {
            lotcountpprovalStatus = 'Approved'
            lotcountrejectionReason = ' '
          }
        } else {
          lotcountpprovalStatus = 'Approved'
          lotcountrejectionReason = ' '
        }

        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        var seconds = new Date().getSeconds();
        var filename = data[i].AccountName + currentDate + '-' + hours + '-' + minutes + '-' + seconds;

        // var filename = data[i].AccountName + currentDate;


        if (data[i].NatureofTrade === 'Future' && data[i].Transaction === 'ROLLOVER' && data[i].QuantityLot === 'Lot') {
          if (empapprovalStatus == 'Approved' && greyapprovalStatus == 'Approved' && restrictapprovalStatus == 'Approved' && projectapprovalStatus == 'Approved' && lotcountpprovalStatus == 'Approved' && primaryapprovalStatus == 'Approved') {
            // approvalStatus = 'Approved'
            approvalStatus = data[i].AIA == 'true' ? 'Approved' : 'Pending for Approve';
            rejectionReason = ' '
            generateAndDownloadPDF(filename, data[i], newData)
            sendEmailWithPDF(filename, data[i], data[i].EmployeeNumber)
          } else {
            approvalStatus = 'Rejected'
            rejectionReason = (projectrejectionReason == ' ' ? ' ' : projectrejectionReason) + ', ' + (greyrejectionReason == ' ' ? ' ' : greyrejectionReason) + ', ' + (restrictrejectionReason == ' ' ? ' ' : restrictrejectionReason) + ', ' + (emprejectionReason == ' ' ? ' ' : emprejectionReason) + ', ' + (lotcountrejectionReason == ' ' ? ' ' : lotcountrejectionReason) + ', ' + (primaryrejectionReason == ' ' ? ' ' : primaryrejectionReason)
            generateAndDownloadPDF(filename, data[i], newData)
            sendEmailWithPDF1(filename, data[i], data[i].EmployeeNumber)
          }
        } else {
          if (empapprovalStatus == 'Approved' && greyapprovalStatus == 'Approved' && restrictapprovalStatus == 'Approved' && projectapprovalStatus == 'Approved' && primaryapprovalStatus == 'Approved') {
            approvalStatus = data[i].AIA == 'true' ? 'Approved' : 'Pending for Approve';
            rejectionReason = ' '
            generateAndDownloadPDF(filename, data[i], newData)
            sendEmailWithPDF(filename, data[i], data[i].EmployeeNumber)
          } else {
            approvalStatus = 'Rejected'
            rejectionReason = (projectrejectionReason == ' ' ? ' ' : projectrejectionReason) + ', ' + (greyrejectionReason == ' ' ? ' ' : greyrejectionReason) + ', ' + (restrictrejectionReason == ' ' ? ' ' : restrictrejectionReason) + ', ' + (emprejectionReason == ' ' ? ' ' : emprejectionReason) + ', ' + (primaryrejectionReason == ' ' ? ' ' : primaryrejectionReason)
            generateAndDownloadPDF(filename, data[i], newData)
            sendEmailWithPDF1(filename, data[i], data[i].EmployeeNumber)
          }
        }

        data[i].ApprovalStatus = approvalStatus
        // data[i].ApprovalStatus = approvalStatus
        data[i].RejectionReason = rejectionReason
        data[i].CREATED_ON = currentDate
        data[i].CRE_DATE = currentDate

        await dataaccess.Create(TBL_IRF_Approval_Data, data[i])

        finalResult.push(data[i])

        if (data[i].Transaction == 'SELL') {
          A++;

          availableQTYcalculation(data[i].EmployeeNumber, data[i].AVQTYFINAL, data[i].ISIN, A, data[i].EqQuantity, data[i].AccountCode)
        }
      }


      var EncryptLoginDetails = dataconn.encryptionAES(finalResult);
      return res.status(200).json({ Success: true, Message: 'Approval Requst Generated', Data: EncryptLoginDetails });
      // res.status(200).send("Approval Requst Generated")

    } catch (error) {
      console.error("Error", error)
      return res.status(400).send({ Success: false, Message: "Aproval Request Failed", Data: null })
    }

  })

  // router.post('/GenerateReport', async (req, res) => {
  //   try {
  //     const { fromDate, toDate } = req.body;

  //     let reportData = await connect.sequelize.query(`select  "B"."FIRSTNAME", "B"."LASTNAME", "A".* from public."TBL_IRF_Approval_Data" as "A"
  //     JOIN  public."TBL_USER_MST" AS "B" ON "A"."EmployeeNumber" = "B"."EMPNO"
  //     where "A"."CRE_DATE" BETWEEN '${fromDate}' AND '${toDate}'`);
  //     console.log("repportdata", reportData);
  //     console.log("hhhhhhhhhh", reportData[0]);
  //     return res.status(200).send({ Success: true, Message: "Report Data Sent", DOMExceptionata: reportData })

  //   } catch (error) {
  //     console.error("Error", error)
  //     return res.status(400).send({ Success: false, Message: "Report Data Failed", data: null })

  //   }

  // })


  router.post('/GenerateReport', async (req, res) => {



    try {

      const dbPg = pgp(config.Pg_Config)

      let reportdata = [];

      var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

      // console.log("abc", encryptmodel);

      const { fromDate, toDate } = encryptmodel;




      // const jsonData = req.body ;
      // const abc = jsonData.fromDate;
      // console.log("cccc",abc.toString());



      if (fromDate && toDate) {

        reportdata = await dbPg.manyOrNone(`select  "B"."FIRSTNAME", "B"."LASTNAME", "A".* from public."TBL_IRF_Approval_Data" as "A"
  
                   JOIN  public."TBL_USER_MST" AS "B" ON "A"."EmployeeNumber" = "B"."EMPNO"
  
                   where "A"."CRE_DATE" BETWEEN '${fromDate}' AND '${toDate}'`);

      } else {

        reportdata = await dbPg.manyOrNone(`select  "B"."FIRSTNAME", "B"."LASTNAME", "A".* from public."TBL_IRF_Approval_Data" as "A"
  
    JOIN  public."TBL_USER_MST" AS "B" ON "A"."EmployeeNumber" = "B"."EMPNO"`);

      }


      var EncryptLoginDetails = dataconn.encryptionAES(reportdata);
      return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })



    } catch (error) {

      console.error("Error", error)

      return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

    }



  });

  router.post('/GenerateUsrReport', async (req, res) => {



    try {

      const dbPg = pgp(config.Pg_Config)

      let reportdata = [];

      // console.log("abc", req.body);
      var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

      const { fromDate, toDate, userid } = encryptmodel;




      // const jsonData = req.body ;
      // const abc = jsonData.fromDate;
      // console.log("cccc",abc.toString());



      if (fromDate && toDate) {

        reportdata = await dbPg.manyOrNone(`select  "B"."FIRSTNAME", "B"."LASTNAME", "A".* from public."TBL_IRF_Approval_Data" as "A"
  
                   JOIN  public."TBL_USER_MST" AS "B" ON "A"."EmployeeNumber" = "B"."EMPNO"
  
                   where "A"."CRE_DATE" BETWEEN '${fromDate}' AND '${toDate}'
                   AND "A"."EmployeeNumber" = '${userid}'`);

      } else {

        reportdata = await dbPg.manyOrNone(`select  "B"."FIRSTNAME", "B"."LASTNAME", "A".* from public."TBL_IRF_Approval_Data" as "A"
  
    JOIN  public."TBL_USER_MST" AS "B" ON "A"."EmployeeNumber" = "B"."EMPNO"
    where "A"."EmployeeNumber" = '${userid}'`);

      }



      var EncryptLoginDetails = dataconn.encryptionAES(reportdata);
      return res.status(200).send({ Success: true, message: "Report Data Sent", data: EncryptLoginDetails })



    } catch (error) {

      console.error("Error", error)

      return res.status(400).send({ Success: false, message: "Report Generation Failed", data: null })

    }



  })

  // router.route('/remmail')
  //   .post(async function (req, res) {
  //     try {
  //       let query3 = `select "LOT_SIZE" from public."TBL_SCRIPT_MST" where "IS_ACTIVE" = true and "ISIN_CODE" = 'INE895W01019'`
  //       let count = await connect.sequelize.query(query3);
  //       let FutOpQuantityLot = 10;

  //       if (count[0][0]) {
  //         let futurecount = FutOpQuantityLot * count[0][0].LOT_SIZE;
  //         console.log("futurecount", futurecount);

  //         let query = `WITH TMPQ_CTE AS (
  //           SELECT 
  //               CASE 
  //                   WHEN "POST_EX_AS_GMNT_LONG_QUANTITY" = 0 
  //                   THEN "POST_EX_AS_GMNT_SHORT_QUANTITY" 
  //                   ELSE "POST_EX_AS_GMNT_LONG_QUANTITY" 
  //               END AS QUANTITY
  //               FROM "TBL_FNOROLLOVER_EXPIRYDATA"
  //               WHERE "IS_ACTIVE" = true 
  //               AND "INSTRUMENT_TYPE" = 'FUTSTK'
  //               AND "EXPIRY_DATE" = CURRENT_DATE
  //         )

  //       SELECT SUM(COALESCE("quantity", 0)) AS total_quantity
  //       FROM TMPQ_CTE;`;

  //         let count1 = await connect.sequelize.query(query);
  //         let finalresult = count1[0][0].total_quantity;
  //         console.log("finalresult", finalresult);

  //         if (finalresult < futurecount) {
  //           console.log("Success");
  //         } else {
  //           console.log("Fail");
  //         }
  //       }
  //       res.status(200).json({ message: 'Email sent successfully' });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ message: 'Error sending emails' });
  //     }
  //   });

  router.post('/SaveResponseData', async (req, res) => {
    try {
      // Extract data from req.body
      var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

      const data = encryptmodel;

      const TBL_IRF_Digitalplatform_ApprovalRes = datamodel.TBL_IRF_Digitalplatform_ApprovalRes();

      // Iterate through each item and save it individually
      for (const item of data) {

        var values = {
          AccountCode: item.AccountCode,
          Security: item.Security,
          ISIN: item.ISIN,
          Transaction: item.Transaction,
          QuantityLot: item.QuantityLot,
          EqQuantity: item.EqQuantity,
          StrikePrice: item.StrikePrice,
          Month: item.Month,
          NatureofTrade: item.NatureofTrade,
          OptionType: item.OptionType,
          type: item.type,
          msg: item.msg,
          success: item.success,
          MsgId: item.MsgId,
          srvTm: item.srvTm
        };

        await dataaccess.Create(TBL_IRF_Digitalplatform_ApprovalRes, values);
      }

      // res.status(200).send('Data successfully inserted into the table.');
      var EncryptLoginDetails = dataconn.encryptionAES(null);
      res.status(200).json({ Success: true, Message: 'Response Data Saved Succesfully', Data: EncryptLoginDetails });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      res.status(200).json({ Success: false, Message: 'Occur error during Save response Data', Data: null });
    }

  });

  router.post('/Response', (req, res) => {
    try {

      const hardcodedData = [
        { AccountCode: 'HFC0125', Security: 'panache digilife limited', ISIN: 'INE895W01019', Transaction: 'BUY', QuantityLot: 'Lot', EqQuantity: '12', StrikePrice: '100', Month: 'March', NatureofTrade: 'EQ', OptionType: '', type: 'ANy', msg: 'ANy', success: 'true', MsgId: '01', srvTm: 'ANy' },
        { AccountCode: 'HFC0125', Security: 'AMRAPALI CAPITAL AND FINANCE S', ISIN: 'INE218P01018', Transaction: 'SELL', QuantityLot: 'Quantity', EqQuantity: '400', StrikePrice: '50', Month: 'March', NatureofTrade: 'FUT', OptionType: '', type: 'ANy', msg: 'ANy', success: 'false', MsgId: '02', srvTm: '' },
        { AccountCode: 'HFC0125', Security: 'panache digilife limited', ISIN: 'INE895W01019', Transaction: 'BUY', QuantityLot: 'Lot', EqQuantity: '12', StrikePrice: '100', Month: 'March', NatureofTrade: 'OPT', OptionType: 'PE', type: 'ANy', msg: 'ANy', success: 'true', MsgId: '03', srvTm: 'ANy' },
        // Add more rows as needed
      ];
      res.status(200).json({ Success: true, Message: 'Response Data Saved Succesfully', Data: hardcodedData });
    } catch (error) {
      console.error(error);
      res.status(200).json({ Success: true, Message: 'Response Data Saved Succesfully', Data: null });
    }
  });
  return router;
}

let v1 = ''
let v2 = ''
let v3 = ''

let v4 = ''
let v5 = ''
let v6 = ''

Totalqty = []

// async function availableQTYcalculation(empno, AVQTYFINAL, ISIN, selllenth, EqQuantity) {
//   const selectQuerys = `select * From public."TBL_DP_HOLDING_DATA" where "EMPID"='${empno}' and "ISIN_CODE"='${ISIN}' and "IS_ACTIVE"=true`
//   let result = await connect.sequelize.query(selectQuerys);
//   let TableTradeAvailableQty = result[0].TradeAvailableQty

//    console.log("result[0ghghg",result[0],result[0]?.TradeAvailableQty);

//   let TolaABAPrrove = Number(EqQuantity) + Number(TableTradeAvailableQty)
//   console.log("TolaABAPrrove",TolaABAPrrove);
//   const upadate = ` UPDATE "TBL_DP_HOLDING_DATA"
//   SET "ApprovalAvailableQty" = '${AVQTYFINAL}',"TradeAvailableQty"='${TolaABAPrrove}', "MODIFIED_BY"='${empno}'
//   WHERE "EMPID"='${empno}' and "ISIN_CODE"='${ISIN}'`
//   let result1 = await connect.sequelize.query(upadate);

// }
async function availableQTYcalculation(empno, AVQTYFINAL, ISIN, sellLength, EqQuantity, AccountCode) {
  try {
    const selectQuery = `
      SELECT * 
      FROM public."TBL_DP_HOLDING_DATA" 
      WHERE "EMPID" = '${empno}' 
        AND "ISIN_CODE" = '${ISIN}' 
        AND "IS_ACTIVE" = true
    `;

    const [rows] = await connect.sequelize.query(selectQuery);

    // Check if a record was found
    if (rows.length === 0) {
      console.log("No matching record found.");
      return;
    }

    // Get TradeAvailableQty
    const TableTradeAvailableQty = Number(rows[0].TradeAvailableQty || 0);
    console.log("TradeAvailableQty from DB:", TableTradeAvailableQty);

    // Calculate updated value
    const TolaABAPrrove = Number(EqQuantity || 0) + TableTradeAvailableQty;
    console.log("Calculated TradeAvailableQty:", TolaABAPrrove);

    // Update query
    const updateQuery = `
      UPDATE public."TBL_DP_HOLDING_DATA"
      SET "ApprovalAvailableQty" = '${AVQTYFINAL}', 
          "TradeAvailableQty" = '${TolaABAPrrove}', 
          "MODIFIED_BY" = '${empno}'
      WHERE "EMPID" = '${empno}' 
        AND "ISIN_CODE" = '${ISIN}' AND "ACCOUNT_CODE" = '${AccountCode}'
    `;

    await connect.sequelize.query(updateQuery);

    console.log("Update successful for EMPID:", empno, "ISIN:", ISIN);
  } catch (error) {
    console.error("Error in availableQTYcalculation:", error);
  }
}



function generateAndDownloadPDF(filename, data, newData) {
  return new Promise((resolve, reject) => {
    // console.log('jjjjjjjjjjjjjjj', data.QuantityLot);
    let quantityLot;
    if (data.QuantityLot == 'Quantity' || data.QuantityLot == null) {
      quantityLot = data.EqQuantity;
    } else if (data.QuantityLot == 'Lot') {
      quantityLot = data.FutOpQuantityLot;
    } else {
      quantityLot = '';
    }
    // console.log('fffffffffffff', quantityLot);
    let price;
    if (data.MarketPrice == true) {
      price = 'MKT';
    } else if (data.MarketPrice == false) {
      price = data.Price;
    } else {
      price = '';
    }

    var dd = {
      content: [
        {
          style: 'tableExample',
          fontSize: 11,
          table: {
            widths: [270, 250],
            body: [
              [{ text: `${newData} GROUP - INVESTMENT REQUEST FORM`, colSpan: 2, alignment: 'center', bold: 'true', border: [true, true, true, true] }, { text: ' ', border: [true, true, true, true] }],
              [{ text: `Name of Employee: ${data.AccountName}`, border: [false, true, false, false] }, { text: `Client Code`, border: [false, true, false, false] }],
              [{ text: `Name of Company:`, border: [false, false, false, false] }, { text: `Client Name:`, border: [false, false, false, false] }],
              [{ text: `Dept. /Section`, border: [false, false, false, false] }, { text: `Date`, border: [false, false, false, false] }],
            ]
          }
        },
        `\n`,
        {
          style: 'tableExample',
          fontSize: 11,
          table: {
            widths: [80, 80, 80, 80, 80, 80],
            body: [
              [{ text: `EQUITY`, colSpan: 6, alignment: 'center', bold: 'true' }, ' ', ' ', ' ', ' ', ' '],
              [{ text: `Sr. No.`, bold: true, alignment: 'center' }, { text: `Name of Security`, bold: true, alignment: 'center' }, {
                text: `Date of earlier opposite transaction (contra trade)`, bold: true, alignment: 'center'
              }, { text: `Buy / Sell`, bold: true, alignment: 'center' }, { text: `Quantity`, bold: true, alignment: 'center' }, {
                text: `Price Limit (not including brokerage)`, bold: true, alignment: 'center'
              }],
              ['1.', `${data.Security}`, `${data.StartDate}`, `${data.Transaction}`, `${quantityLot}`, `${price}`],
            ]
          }
        },
        {
          text: [
            {
              text: `\nNote: Pre-clearance is valid for ONE day only\n\n
  Nature of Trade: Equity/IPO/FPO/Rights Issue/Others/Debt: `, bold: true, fontSize: 11,
            }, { text: `${data.NatureofTrade}\n`, decoration: 'underline', bold: true, fontSize: 11, },
            { text: `\nDECLARATION:`, bold: true, fontSize: 11, },
          ]
        },
        {
          text: `\nI hereby declare and undertake that;\n
  a) I have read and understood the Compliance Rules set by the ${newData} with regard to investments by employees and the above transaction(s) is/are not in contravention of the same.\n
  b) I am not in receipt of any “Unpublished Price Sensitive Information” meaning any information which relates directly or indirectly to the above mentioned security/securities and which if published is likely to materially affect the price of securities of the above mentioned security/securities
  \nc) In case I have access to or receive any “Unpublished Price Sensitive Information” before the execution of the transaction, I shall inform the Compliance Officer of the change in my position and I shall completely refrain from dealing in the Securities of the Client Company till the time such information becomes public.
  \nd) The intended transaction is on my account or dependent family member’s account or Concern(s), Firm(s), Company(s), HUF(s), Trust(s) or Association of persons in which the persons to whom this policy is applicable has a stake of more than 10%.
  \ne) The said transaction is not on account of any other third party.
  \nf) I have not availed any finance from any Group Company for subscribing to the IPO/FPO/Rights Issue lead managed by ${newData} or where ${newData} is Syndicate Member.
  \ng) The securities purchased shall be credited to such DP IDs as registered with the company. The securities sold shall be transferred from such DP IDs as registered with the company.
  \nh) All sell and purchase transactions in securities are for minimum holding / contra trade period, as applicable for securities held by me or my Immediate Relatives and my / their Connected Persons.
  \ni) All F & O contract shall be held by me for minimum period as applicable for securities held by me or my Immediate Relatives and my / their Connected Persons.
  \nj) I undertake to report all such decisions alongwith the reasons to Compliance for not executing or partially executing trades after obtaining the pre-clearance.
  \nk) I understand and acknowledge that should a contra trade be executed by me, inadvertently or otherwise, in violation of such a restriction, the profits from such trade shall be liable to be disgorged for remittance to SEBI for credit to the Investor Protection and Education Fund.`, fontSize: 11,
        },
        `\n`,
        {
          style: 'tableExample',
          layout: 'noBorders',
          fontSize: 11,
          table: {
            widths: [250, 200],
            body: [
              [{ text: `__________________________________`, }, { text: `_________________________________`, decoration: 'underline' },],
              [{ text: `Signature of Approver`, bold: true }, { text: `Signature of Employee`, bold: true },],
              [{ text: `Approved By : __________________________`, bold: true }, {}],
              [{ text: `Date of Approval : ______________________`, bold: true }, { text: `Compliance Control No.: _________________________`, bold: true },],
            ]
          }
        },
      ]
    }

    var fonts = {
      Roboto: {
        normal: process.cwd() + '/fonts/Calibri.ttf',
        bold: process.cwd() + '/fonts/calibrib.ttf',
        italics: process.cwd() + '/fonts/calibril.ttf',
      },
      FontAwesome: {
        normal: process.cwd() + '/fonts/fontawesome-webfont.ttf'
      }
    };

    const printer = new pdfMake(fonts);
    const pdfDoc = printer.createPdfKitDocument(dd);
    let newpath = path.join(process.cwd() + '/converteddoc1/' + filename + '.pdf')
    // console.log('jjj', newpath);
    const fileStream = fs.createWriteStream(newpath)
    console.log('jjj', fileStream);

    pdfDoc.pipe(fileStream);
    pdfDoc.end();
  });

}


async function sendEmailWithPDF(filename, data, emailid) {
  const TBL_USER_MST = datamodel.TBL_USER_MST();

  const emailData = await dataaccess.FindOne(TBL_USER_MST, {
    attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
    where: { EMPNO: emailid, ISACTIVE: true }
  });

  console.log("emaildata", emailData);
  const UserEmailId = emailData.EMAILID;
  console.log("UserEmailId", UserEmailId);

  const folderPath = path.join(process.cwd() + '/converteddoc1/' + filename + '.pdf')

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    requireTLS: true,
    secure: true,
    auth: {
      user: "newel.technical@gmail.com",
      pass: "cqcaiblynypipdun"

    }
  });
  let filename2 = filename + '.pdf'
  const mailOptions = {

    from: 'newel.technical@gmail.com', // Your email address
    to: UserEmailId, // Recipient's email address
    // to: 'rinkal@neweltechnologies.com,prasad@neweltechnologies.com',
    // cc: 'rinkal@neweltechnologies.com',
    // cc: 'aniket.yadav@neweltechnologies.com',
    subject: 'IRF Approval',
    text: `
    Hi ${data.AccountName},

    Your 1 request for the investment in ${data.NatureofTrade} has/have been approved by compliance.
    
    Your 0 request for the investment in ${data.NatureofTrade} has/have been rejected by compliance.
    
    Regards,
    
    Compliance Team..`,
    attachments: [
      {
        filename: `${filename2}`,
        path: `${folderPath}`,
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendEmailWithPDF1(filename, data, emailid) {
  const TBL_USER_MST = datamodel.TBL_USER_MST();

  const emailData = await dataaccess.FindOne(TBL_USER_MST, {
    attributes: ['ID', 'EMPNO', 'FIRSTNAME', 'LASTNAME', 'EMAILID', 'ISACTIVE'],
    where: { EMPNO: emailid, ISACTIVE: true }
  });

  console.log("emaildata", emailData);
  const UserEmailId = emailData.EMAILID;
  console.log("UserEmailId", UserEmailId);

  const folderPath = path.join(process.cwd() + '/converteddoc1/' + filename + '.pdf')

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    requireTLS: true,
    secure: true,
    auth: {
      user: "newel.technical@gmail.com",
      pass: "cqcaiblynypipdun"

    }
  });
  let filename2 = filename + '.pdf'
  const mailOptions = {

    from: 'newel.technical@gmail.com', // Your email address
    to: UserEmailId, // Recipient's email address
    // to: 'rinkal@neweltechnologies.com,prasad@neweltechnologies.com',
    // cc: 'rinkal@neweltechnologies.com',
    // cc: 'aniket.yadav@neweltechnologies.com',
    subject: 'IRF Approval',
    text: `
    Hi ${data.AccountName},

    Your 0 request for the investment in ${data.NatureofTrade} has/have been approved by compliance.
    
    Your 1 request for the investment in ${data.NatureofTrade} has/have been rejected by compliance.
    
    Regards,
    
    Compliance Team..`,
    attachments: [
      {
        filename: `${filename2}`,
        path: `${folderPath}`,
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = routes;


