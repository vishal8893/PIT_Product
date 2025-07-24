var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");
const { log } = require('console');

// Create a nodemailer transporter
let transporter = nodemailer.createTransport({
    host: configFile.email_smtp_config.host,
    port: configFile.email_smtp_config.port,
    auth: {
        user: configFile.email_smtp_config.auth.user,
        pass: configFile.email_smtp_config.auth.pass
    }
});

// Async function to send emails
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: 'newel.technical@gmail.com',
            to,
            subject,
            html,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Email error:', error);
    }
}

async function intraday_check(Data, date) {

    try {
        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const query = `
            CREATE TEMP TABLE temp_data (
                EmpId VARCHAR(255),
                PanNo VARCHAR(255),
                TradeDate DATE,
                Exch VARCHAR(255),
                AccCode VARCHAR(255),
                AccName VARCHAR(255),
                ScripCode VARCHAR(255),
                ScripName VARCHAR(1000),
                Quantity BIGINT,
                TotalPrice NUMERIC(9,0),
                Mode VARCHAR(255),
                CreatedBy VARCHAR(255),
                CreatedDate DATE,
                UpdatedBy VARCHAR(255),
                UpdatedDate DATE,
                ISIN VARCHAR(255),
                OpenQuantity INT,
                TradedBy VARCHAR(255),
                StrikePrice VARCHAR(255),
                ExpiryDate DATE,
                OptionType VARCHAR(255),
                TransId BIGINT
            );

            INSERT INTO temp_data VALUES ${valuesPart};
            DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

            CREATE TEMP TABLE TEMP_EIRF_Rico_SOS_Processed AS
            SELECT * FROM "eirf_rico_sos_processed" WHERE false;

            INSERT INTO TEMP_EIRF_Rico_SOS_Processed("EmpId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode", "IntradayVoil", "CreatedBy", "CreatedDate", "SOSmappingId")
    SELECT t.EmpId,t.TradeDate, t.ScripCode, t.ScripName, t.ISIN, t.Quantity, t.TotalPrice, t.Mode,		
        CASE
            WHEN COALESCE(e1.BuyCount, 0) > 0 AND COALESCE(e2.SellCount, 0) > 0 THEN
                CASE
                    WHEN LOWER(t.Mode) = LOWER('Sell') THEN 'Intraday Violation'
                END 
        END AS Voilation, 
        'System', NOW(), t.TransId
    FROM (
        SELECT sos.TransId, sos.TradeDate::DATE, sos.EmpId, sos.Exch, sos.ISIN, sos.Quantity, sos.TotalPrice, sos.Mode, temp.sumTotalPrice,
            temp.sumQuantity, UM."DSIGNATED", sos.ScripCode, sos.ScripName, UM."EFSLDESIGNATED", sos.ExpiryDate 
        FROM (
            SELECT SUM(t2.TotalPrice) AS sumTotalPrice, SUM(t2.Quantity) AS sumQuantity, MIN(t1.TradeDate) AS TradeDate, t1.TransId
            FROM temp_data AS t1
            INNER JOIN temp_data AS t2 ON t1.EmpId = t2.EmpId AND t1.ScripName = t2.ScripName AND LOWER(t1.Mode) = LOWER(t2.Mode)
            WHERE t1.TradeDate::DATE = '${date}' AND t2.TradeDate::DATE = '${date}' AND t1.Exch NOT IN ('NSE', 'BSE')
            GROUP BY t1.TransId  
        ) temp
        INNER JOIN temp_data sos ON temp.TransId = sos.TransId
        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = sos.EmpId
    ) t
    LEFT JOIN (
        SELECT COUNT(1) AS BuyCount, EmpId, ScripName, ExpiryDate 
        FROM temp_data WHERE LOWER(Mode) = LOWER('Buy') AND TradeDate::DATE = '${date}' 
        GROUP BY EmpId, ScripName, ExpiryDate 
    ) e1 ON e1.EmpId = t.EmpId AND e1.ScripName = t.ScripName AND t.ExpiryDate = e1.ExpiryDate
    LEFT JOIN (
        SELECT COUNT(1) AS SellCount, EmpId, ScripName, ExpiryDate   
        FROM temp_data WHERE LOWER(Mode) = LOWER('Sell') AND TradeDate::DATE = '${date}'
        GROUP BY EmpId, ScripName, ExpiryDate
    ) e2 ON e2.EmpId = t.EmpId AND e2.ScripName = t.ScripName AND t.ExpiryDate = e2.ExpiryDate
    WHERE t.TradeDate::DATE = '${date}' 
    ORDER BY t.EmpId, ScripName, t.TradeDate;
    
    DROP TABLE temp_data;`;

        const result = await connect.sequelize.query(query);
    } catch (error) {
        const errMsg = error.message;
        console.error('Error in intraday_check:', errMsg);
    }

}

async function noApprovalCases(date, thresholdAmount, Data, Data4) {
    try {
        // ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}
        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'} , '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data4.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');

        const query = ` 
                        CREATE TEMP TABLE temp_data (
                            EmpId VARCHAR(255),
                            PanNo VARCHAR(255),
                            TradeDate DATE,
                            Exch VARCHAR(255),
                            AccCode VARCHAR(255),
                            AccName VARCHAR(255),
                            ScripCode VARCHAR(255),
                            ScripName VARCHAR(1000),
                            Quantity BIGINT,
                            TotalPrice NUMERIC(9,0),
                            Mode VARCHAR(255),
                            CreatedBy VARCHAR(255),
                            CreatedDate DATE,
                            UpdatedBy VARCHAR(255),
                            UpdatedDate DATE,
                            ISIN VARCHAR(255),
                            OpenQuantity INT,
                            TradedBy VARCHAR(255),
                            StrikePrice VARCHAR(255),
                            ExpiryDate DATE,
                            OptionType VARCHAR(255),
                            TransId BIGINT
                        );

                        INSERT INTO temp_data VALUES ${valuesPart};

                        DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};

                        DROP TABLE IF EXISTS TEMP_MSM046;

                        -- Create temporary table TEMP_MSM046
                        CREATE TEMP TABLE TEMP_MSM046 AS
                        SELECT * FROM "TBL_SCRIPT_MST_FOR_TRADE_RECON"
                        WHERE "CREATED_DATE_AS_TRADE_DATE"::date = '${date}';

                        -- If TEMP_EIRF_FO_3Months_LOTS exists, drop it
                        DROP TABLE IF EXISTS TEMP_EIRF_FO_3Months_LOTS;

                        -- Create temporary table TEMP_EIRF_FO_3Months_LOTS
                        CREATE TEMP TABLE TEMP_EIRF_FO_3Months_LOTS AS
                        (
                            SELECT "First_Month_LOT_SIZE" as LotSize, "SYMBOL", "SCRIPT_NAME", "First_Month" AS Months
                            FROM "EIRF_FO_3Months_LOTS_DAILY"
                            UNION ALL
                            SELECT "Second_Month_LOT_SIZE", "SYMBOL", "SCRIPT_NAME", "Second_Month"
                            FROM "EIRF_FO_3Months_LOTS_DAILY"
                            UNION ALL
                            SELECT "Third_Month_LOT_SIZE", "SYMBOL", "SCRIPT_NAME", "Third_Month"
                            FROM "EIRF_FO_3Months_LOTS_DAILY"
                        );

                        DROP TABLE IF EXISTS tempSOS;
                        DROP TABLE IF EXISTS tempEIRF;
                        DROP TABLE IF EXISTS tempNoApprovalVoilation;
                        DROP TABLE IF EXISTS tempEIRF1;
                        DROP TABLE IF EXISTS tempMoreLessVoilation;

                        -----------========================== For Trade Data ============================================================================	
                        CREATE TEMP TABLE tempSOS AS
                        SELECT sos.TransId, sos.TradeDate, sos.EmpId, sos.Exch, sos.ISIN, sos.Quantity, sos.TotalPrice, sos.Mode, t."sumTotalPrice",
                        t."sumQuantity", UM."DSIGNATED", sos.ScripCode, sos.ScripName,
                        UM."EFSLDESIGNATED",sos.ScripCode as symbol,sos.ExpiryDate ,TO_CHAR(sos.ExpiryDate::DATE, 'Month') as ExpMonth,		                
                        CASE WHEN sos.OptionType='FUT' THEN '' ELSE CASE WHEN sos.OptionType='CE' THEN 'Call' ELSE 'Put' END END AS optionType,
                        COALESCE(sos.StrikePrice, '0') AS StrikePrice,
                        case when sos.OptionType='FUT' then 'Future' else 'Option' end  as natureOfTrade,sos.AccCode		  
			            FROM
				            (
				                SELECT SUM(t2.TotalPrice) AS "sumTotalPrice", SUM(t2.Quantity) AS "sumQuantity", MIN(t1.TradeDate) AS "TradeDate", t1.TransId
                                FROM temp_data t1
                                INNER JOIN temp_data t2 ON t1.EmpId = t2.EmpId AND t1.ScripName =t2.ScripName AND LOWER(t1.Mode) = LOWER(t2.Mode)
                                WHERE t1.TradeDate::DATE = '${date}' AND t2.TradeDate::DATE = '${date}' AND t1.Exch not in ('NSE','BSE')
				                GROUP BY t1.TransId
				            )t
			            INNER JOIN temp_data sos ON t.TransId = sos.TransId
                        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = sos.EmpId
                        WHERE (UM."DSIGNATED" = true OR t."sumTotalPrice" >= '${thresholdAmount}')
			            ORDER BY sos.EmpId,sos.Mode, sos.TotalPrice, UM."DSIGNATED";


                        --- For getting approval data

                        

                        CREATE TEMP TABLE tempEIRF1 AS
SELECT DISTINCT * FROM (
    -- For Designated Rollover approval
    SELECT
        EIRF."CRE_DATE" AS ApprovalDate,
        EIRF."TRX_NO",
        EIRF."CRE_DATE",
        EIRF."NatureofTrade" AS NatureOfTrade,
        EIRF."Requestfor" AS RaisedFor,
        EIRF."Security" AS ScripName,
        'Buy' AS Mode,
        EIRF."QuantityLot" AS QuantityLot,
        e."EqQuantity" AS Quantity,
        EIRF."FutOpQuantityLot" AS FutOpQuantity,
        sc."LOT_SIZE" AS LotSize,
        e.FutOpQuantity AS OriginalFutOpQuantity,
        EIRF."EmployeeNumber" AS EmpId,
        EIRF."ISIN" AS ISIN,
        EIRF."Month",
        LEFT(EIRF."Month", 3) AS ExpMonth,
        EIRF."OptionType",
        EIRF."StrikePrice" AS StrikePrice,
        sc."NSE_CODE" AS Symbol,
        'Rollover' AS Rollover_Case,
        EIRF."AccountCode"
    FROM (
        SELECT
            M."NatureofTrade",
            M."Month",
            M."OptionType",
            M."StrikePrice",
            M."Transaction",
            M."EmployeeNumber",
            M."ISIN",
            MIN(M."CRE_DATE") AS CRE_DATE,
            MIN(M."TRX_NO") AS TRX_NO,
            SUM(M."EqQuantity"::numeric) AS "EqQuantity",
            SUM(app.FutOpQuantity::numeric) AS FutOpQuantity
        FROM "TBL_IRF_Approval_Data" M
        INNER JOIN (
            SELECT
                CASE
                    WHEN M1."QuantityLot" = 'Lot' THEN CAST(M1."FutOpQuantityLot" AS numeric) * CAST(FO.LotSize AS numeric)
                    ELSE CAST(M1."FutOpQuantityLot" AS numeric)
                END AS FutOpQuantity,
                M1.*
            FROM "TBL_IRF_Approval_Data" M1
            INNER JOIN TEMP_MSM046 sc11 ON sc11."ISIN_CODE" = M1."ISIN"
            INNER JOIN TEMP_EIRF_FO_3Months_LOTS FO ON FO."SYMBOL" = sc11."NSE_CODE" AND SUBSTRING(FO.Months, 1, 3) = SUBSTRING(M1."Month", 1, 3)
            WHERE M1."CRE_DATE"::DATE = '${date}' AND M1."NatureofTrade" IN ('Future', 'Option')
        ) app ON app."TRX_NO" = M."TRX_NO"
        INNER JOIN "TBL_USER_MST" ON "EMPNO" = M."EmployeeNumber"
        WHERE ("DSIGNATED" = true) AND M."CRE_DATE"::DATE = '${date}'
        AND M."NatureofTrade" IN ('Future', 'Option')
        AND M."ApprovalStatus" = 'Approved' AND (M."IEApprovalStatus" = 'Approved' OR M."IEApprovalStatus" IS NULL)
        GROUP BY M."Transaction", M."EmployeeNumber", M."ISIN", M."NatureofTrade", M."Month", M."OptionType", M."StrikePrice"
    ) e
    JOIN "TBL_IRF_Approval_Data" EIRF ON EIRF."TRX_NO" = e.TRX_NO 
    JOIN TEMP_MSM046 sc ON sc."ISIN_CODE" = EIRF."ISIN"
    JOIN TEMP_EIRF_FO_3Months_LOTS FOS ON FOS."SYMBOL" = sc."NSE_CODE" AND SUBSTRING(FOS.Months, 1, 3) = SUBSTRING(EIRF."Month", 1, 3)
    WHERE EIRF."ApprovalStatus" = 'Approved' AND (EIRF."IEApprovalStatus" = 'Approved' OR EIRF."IEApprovalStatus" IS NULL)
    AND EIRF."CRE_DATE"::DATE = '${date}'
    AND EIRF."Transaction" = 'ROLLOVER'
    AND EIRF."Month" <> TO_CHAR('${date}'::date, 'Month')

    UNION ALL

    SELECT
    EIRF."CRE_DATE" AS ApprovalDate,
    EIRF."TRX_NO",
    EIRF."CRE_DATE",
    EIRF."NatureofTrade" AS NatureOfTrade,
    EIRF."Requestfor" AS RaisedFor,
    EIRF."Security" AS ScripName,
    'Sell' AS Mode,
    EIRF."QuantityLot" AS QuantityLot,
    e."EqQuantity" AS Quantity,
    EIRF."FutOpQuantityLot" AS FutOpQuantity,
    sc."LOT_SIZE" AS LotSize,
    e.FutOpQuantity AS OriginalFutOpQuantity,
    EIRF."EmployeeNumber" AS EmpId,
    EIRF."ISIN" AS ISIN,
    TO_CHAR(EIRF."CRE_DATE", 'Month') AS Month,
    LEFT(TO_CHAR(EIRF."CRE_DATE", 'Month'), 3) AS ExpMonth,
    EIRF."OptionType",
    EIRF."StrikePrice" AS StrikePrice,
    sc."NSE_CODE" AS Symbol,
    'Rollover' AS Rollover_Case,
    EIRF."AccountCode"
FROM (
    SELECT
        M."NatureofTrade",
        M."Month",
        M."OptionType",
        M."StrikePrice",
        M."Transaction",
        M."EmployeeNumber",
        M."ISIN",
        MIN(M."CRE_DATE") AS CRE_DATE,
        MIN(M."TRX_NO") AS TRX_NO,
        SUM(M."EqQuantity"::numeric) AS "EqQuantity",
        SUM(app.FutOpQuantity::numeric) AS FutOpQuantity
    FROM "TBL_IRF_Approval_Data" M
    INNER JOIN (
        SELECT
            CASE
                WHEN M1."QuantityLot" = 'Lot' THEN CAST(M1."FutOpQuantityLot" AS numeric) * CAST(FO.LotSize AS numeric)
                ELSE CAST(M1."FutOpQuantityLot" AS numeric)
            END AS FutOpQuantity,
            M1.*
        FROM "TBL_IRF_Approval_Data" M1
        INNER JOIN TEMP_MSM046 sc11 ON sc11."ISIN_CODE" = M1."ISIN"
        INNER JOIN TEMP_EIRF_FO_3Months_LOTS FO ON FO."SYMBOL" = sc11."NSE_CODE" AND SUBSTRING(FO.Months, 1, 3) = SUBSTRING(M1."Month", 1, 3)
        WHERE M1."CRE_DATE"::DATE = '${date}' AND M1."NatureofTrade" IN ('Future', 'Option')
    ) app ON app."TRX_NO" = M."TRX_NO"
    INNER JOIN "TBL_USER_MST" ON "EMPNO" = M."EmployeeNumber"
    WHERE ("DSIGNATED" = true) AND M."CRE_DATE"::DATE = '${date}'
    AND M."NatureofTrade" IN ('Future', 'Option')
    AND M."ApprovalStatus" = 'Approved' AND (M."IEApprovalStatus" = 'Approved' OR M."IEApprovalStatus" IS NULL)
    GROUP BY M."Transaction", M."EmployeeNumber", M."ISIN", M."NatureofTrade", M."Month", M."OptionType", M."StrikePrice"
) e
JOIN "TBL_IRF_Approval_Data" EIRF ON EIRF."TRX_NO" = e.TRX_NO 
JOIN TEMP_MSM046 sc ON sc."ISIN_CODE" = EIRF."ISIN"
JOIN TEMP_EIRF_FO_3Months_LOTS FOS ON FOS."SYMBOL" = sc."NSE_CODE" AND SUBSTRING(FOS.Months, 1, 3) = SUBSTRING(EIRF."Month", 1, 3)
WHERE EIRF."ApprovalStatus" = 'Approved' AND (EIRF."IEApprovalStatus" = 'Approved' OR EIRF."IEApprovalStatus" IS NULL)
AND EIRF."CRE_DATE"::DATE = '${date}'
AND EIRF."Transaction" = 'ROLLOVER'
AND EIRF."Month" <> TO_CHAR('${date}'::date, 'Month')
--End For Designated Rollover approval

UNION ALL
--Approval data for Buy and Sell transaction
    SELECT
        EIRF."CRE_DATE" AS ApprovalDate,
        EIRF."TRX_NO",
        EIRF."CRE_DATE",
        EIRF."NatureofTrade" AS NatureOfTrade,
        EIRF."Requestfor" AS RaisedFor,
        EIRF."Security" AS ScripName,
        EIRF."Transaction" AS Mode,
        EIRF."QuantityLot" AS QuantityLot,
        e."EqQuantity" AS Quantity,
        EIRF."FutOpQuantityLot" AS FutOpQuantity,
        sc."LOT_SIZE" AS LotSize,
        e.FutOpQuantity AS OriginalFutOpQuantity,
        EIRF."EmployeeNumber" AS EmpId,
        EIRF."ISIN" AS ISIN,
        EIRF."Month",
        LEFT(EIRF."Month", 3) AS ExpMonth,
        EIRF."OptionType",
        EIRF."StrikePrice" AS StrikePrice,
        sc."NSE_CODE" AS Symbol,
        'X' AS Rollover_Case,
        EIRF."AccountCode"
    FROM (
        SELECT
            M."NatureofTrade",
            M."Month",
            M."OptionType",
            M."StrikePrice",
            M."Transaction",
            M."EmployeeNumber",
            M."ISIN",
            MIN(M."CRE_DATE") AS CRE_DATE,
            MIN(M."TRX_NO") AS TRX_NO,
            SUM(M."EqQuantity"::numeric) AS "EqQuantity",
            SUM(app.FutOpQuantity::numeric) AS FutOpQuantity
        FROM "TBL_IRF_Approval_Data" M
        INNER JOIN (
            SELECT
                CASE
                    WHEN M1."QuantityLot" = 'Lot' THEN CAST(M1."FutOpQuantityLot" AS numeric) * CAST(FO.LotSize AS numeric)
                    ELSE CAST(M1."FutOpQuantityLot" AS numeric)
                END AS FutOpQuantity,
                M1.*
            FROM "TBL_IRF_Approval_Data" M1
            INNER JOIN TEMP_MSM046 sc11 ON sc11."ISIN_CODE" = M1."ISIN"
            INNER JOIN TEMP_EIRF_FO_3Months_LOTS FO ON FO."SYMBOL" = sc11."NSE_CODE" AND SUBSTRING(FO.Months, 1, 3) = SUBSTRING(M1."Month", 1, 3)
            WHERE M1."CRE_DATE"::DATE = '${date}' AND M1."NatureofTrade" IN ('Future', 'Option')
        ) app ON app."TRX_NO" = M."TRX_NO"
        INNER JOIN "TBL_USER_MST" ON "EMPNO" = M."EmployeeNumber"
        WHERE (M."CurrentTradeValue_Greater" = '1' OR "DSIGNATED" = true OR M."PreviousTradeValueGreater" = '1') AND M."CRE_DATE"::DATE = '${date}'
            AND M."NatureofTrade" IN ('Future', 'Option')
        AND M."ApprovalStatus" = 'Approved' AND (M."IEApprovalStatus" = 'Approved' OR M."IEApprovalStatus" IS NULL)
        GROUP BY M."Transaction", M."EmployeeNumber", M."ISIN", M."NatureofTrade", M."Month", M."OptionType", M."StrikePrice"
    ) e
    JOIN "TBL_IRF_Approval_Data" EIRF ON EIRF."TRX_NO" = e.TRX_NO 
    JOIN TEMP_MSM046 sc ON sc."ISIN_CODE" = EIRF."ISIN"
    JOIN TEMP_EIRF_FO_3Months_LOTS FOS ON FOS."SYMBOL" = sc."NSE_CODE" AND SUBSTRING(FOS.Months, 1, 3) = SUBSTRING(EIRF."Month", 1, 3)
    WHERE EIRF."ApprovalStatus" = 'Approved' AND (EIRF."IEApprovalStatus" = 'Approved' OR EIRF."IEApprovalStatus" IS NULL)
    AND EIRF."CRE_DATE"::DATE = '${date}'
    AND EIRF."Transaction" <> 'ROLLOVER'
    --End Approval data for Buy and Sell transaction

    UNION ALL
    --For Non-designated with sell Greater than 5 lac but Buy in less than 5 lac
    --Start For Non-designated Rollover approval
    SELECT
        app.* 
    FROM (
        SELECT
            EIRF."CRE_DATE" AS ApprovalDate,
        EIRF."TRX_NO",
        EIRF."CRE_DATE",
        EIRF."NatureofTrade" AS NatureOfTrade,
        EIRF."Requestfor" AS RaisedFor,
        EIRF."Security" AS ScripName,
            'Buy' AS Mode,
            EIRF."QuantityLot" AS QuantityLot,
            EIRF."EqQuantity"::numeric AS Quantity,
        EIRF."FutOpQuantityLot" AS FutOpQuantity,
        sc."LOT_SIZE" AS LotSize,
            CASE
                WHEN EIRF."QuantityLot" = 'Lot' THEN CAST(EIRF."FutOpQuantityLot" AS numeric) * CAST(FO.LotSize AS numeric)
                ELSE CAST(EIRF."FutOpQuantityLot" AS numeric)
            END AS FutOpQuantity,
            EIRF."EmployeeNumber" AS EmpId,
        EIRF."ISIN" AS ISIN,
        EIRF."Month",
        LEFT(EIRF."Month", 3) AS ExpMonth,
        EIRF."OptionType",
        EIRF."StrikePrice" AS StrikePrice,
        sc."NSE_CODE" AS Symbol,
        'Rollover' AS Rollover_Case,
        EIRF."AccountCode"
        FROM
            "TBL_IRF_Approval_Data" EIRF
            INNER JOIN TEMP_MSM046 sc ON sc."ISIN_CODE" = EIRF."ISIN"
            JOIN TEMP_EIRF_FO_3Months_LOTS FO ON FO."SYMBOL" = sc."NSE_CODE" AND SUBSTRING(FO.Months, 1, 3) = SUBSTRING(EIRF."Month", 1, 3)
            INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = EIRF."EmployeeNumber"
        WHERE
            EIRF."ApprovalStatus" = 'Approved' AND (EIRF."IEApprovalStatus" = 'Approved' OR EIRF."IEApprovalStatus" IS NULL)
            AND UM."DSIGNATED" = false AND EIRF."Transaction" = 'ROLLOVER'
            AND "NatureofTrade" IN ('Future', 'Option')
            AND EIRF."CRE_DATE"::DATE = '${date}'
            AND EIRF."Transaction" = 'ROLLOVER'
            AND EIRF."Month" <> TO_CHAR('${date}'::date, 'Month')

            UNION ALL
            SELECT
                EIRF."CRE_DATE" AS ApprovalDate,
            EIRF."TRX_NO",
            EIRF."CRE_DATE",
            EIRF."NatureofTrade" AS NatureOfTrade,
            EIRF."Requestfor" AS RaisedFor,
            EIRF."Security" AS ScripName,
                'Sell' AS Mode,
                EIRF."QuantityLot" AS QuantityLot,
                EIRF."EqQuantity"::numeric AS Quantity,
            EIRF."FutOpQuantityLot" AS FutOpQuantity,
            sc."LOT_SIZE" AS LotSize,
                CASE
                    WHEN EIRF."QuantityLot" = 'Lot' THEN CAST(EIRF."FutOpQuantityLot" AS numeric) * CAST(FO.LotSize AS numeric)
                    ELSE CAST(EIRF."FutOpQuantityLot" AS numeric)
                END AS FutOpQuantity,
                EIRF."EmployeeNumber" AS EmpId,
                EIRF."ISIN" AS ISIN,
                TO_CHAR(EIRF."CRE_DATE", 'Month') AS "Month",
                LEFT(TO_CHAR(EIRF."CRE_DATE", 'Month'), 3) AS ExpMonth,
                EIRF."OptionType",
            EIRF."StrikePrice" AS StrikePrice,
            sc."NSE_CODE" AS Symbol,
            'Rollover' AS Rollover_Case,
            EIRF."AccountCode"
            FROM
                "TBL_IRF_Approval_Data" EIRF
                INNER JOIN TEMP_MSM046 sc ON sc."ISIN_CODE" = EIRF."ISIN"
                INNER JOIN TEMP_EIRF_FO_3Months_LOTS FO ON FO."SYMBOL" = sc."NSE_CODE" AND SUBSTRING(FO.Months, 1, 3) = SUBSTRING(EIRF."Month", 1, 3)
                INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = EIRF."EmployeeNumber"
            WHERE
                EIRF."ApprovalStatus" = 'Approved' AND (EIRF."IEApprovalStatus" = 'Approved' OR EIRF."IEApprovalStatus" IS NULL)
                AND UM."DSIGNATED" = false AND EIRF."Transaction" = 'ROLLOVER'
                AND EIRF."NatureofTrade" IN ('Future', 'Option')
                AND EIRF."CRE_DATE"::DATE = '${date}'
                AND EIRF."Transaction" = 'ROLLOVER'
                AND EIRF."Month" <> TO_CHAR('${date}'::date, 'Month')               

            ) app
            INNER JOIN (
                SELECT
                    EmpId,
                    TradeDate::DATE AS TradeDate,
                    SUM(TotalPrice) AS TotalPrice,
                    SUM(Quantity) AS TotalQuantity,
                    Mode,
                    symbol,
                    ExpiryDate,
                    ExpMonth,
                    optionType,
                    StrikePrice,
                    natureOfTrade,
                    AccCode
                FROM
                    tempSOS
                WHERE
                    "DSIGNATED" = false AND "sumTotalPrice" >= '${thresholdAmount}'
                GROUP BY
                    EmpId,
                    TradeDate::DATE,
                    symbol,
                    ExpiryDate,
                    ExpMonth,
                    optionType,
                    StrikePrice,
                    natureOfTrade,
                    Mode,
                    AccCode
            ) sos ON sos.EmpId = app.EmpId
            AND app.symbol = sos.Symbol
            AND sos.ExpMonth = app."Month"
            AND sos.optionType = COALESCE(app."OptionType", '')
            AND sos.natureOfTrade = app.NatureOfTrade
            AND sos.StrikePrice = app.StrikePrice
            AND LOWER(app.Mode) = LOWER(sos.Mode)
            AND app."AccountCode" = sos.AccCode
           
--End For Non Designated Rollover approval

) t
ORDER BY "CRE_DATE" DESC;

CREATE TEMP TABLE tempEIRF AS
SELECT
    EmpId,
    Symbol,
    "Month",
    "OptionType",
    natureOfTrade,
    StrikePrice,
    Mode,
    SUM(FutOpQuantity::numeric) AS FutOpQuantity,
    ScripName,
    ISIN,
    MIN("CRE_DATE") AS cre_date,
    MIN("CRE_DATE") AS ApprovalDate,
    MIN("TRX_NO") AS TRX_NO
FROM tempEIRF1
GROUP BY
    EmpId,
    Symbol,
    "Month",
    "OptionType",
    natureOfTrade,
    StrikePrice,
    Mode,
    ScripName,
    ISIN;

    CREATE TEMP TABLE tempNoApprovalVoilation AS
SELECT
    COALESCE(sos.EmpId, eirf.EmpId) AS EmpId,sos.TradeDate,sos.ScripCode,COALESCE(sos.ScripName, eirf.ScripName) AS ScripName,
                            COALESCE(sos.ISIN, eirf.ISIN) AS ISIN,sos.Quantity,sos.TotalPrice,sos."sumTotalPrice",sos."sumQuantity",COALESCE(sos.Mode, eirf.Mode) AS Mode,
    CASE
                                WHEN eirf.cre_date IS NOT NULL THEN
                                    CASE
                                        WHEN sos.TradeDate IS NOT NULL THEN
                                            CASE
                                                WHEN(EXTRACT(EPOCH FROM eirf.cre_date - sos.TradeDate)) > 0 THEN NULL
                                                ELSE 'Traded before approval'
                                            END
                                        ELSE NULL
                                    END
                                ELSE 'No approval Violation'
                            END AS NoApprovalVoilation,
                            CASE
                                WHEN sos.TradeDate IS NULL THEN 'Approval taken but not traded'
                                ELSE NULL
                            END AS NotTradedVoilation,
                            sos.TransId,eirf.TRX_NO,eirf.ApprovalDate,eirf.FutOpQuantity AS EirfQuantity
                        FROM tempEIRF eirf
                        FULL JOIN tempSOS sos
    ON eirf.EmpId = sos.EmpId
    AND sos.symbol = eirf.Symbol
    AND TRIM(sos.ExpMonth) = TRIM(eirf."Month")
    AND sos.optionType = COALESCE(eirf."OptionType", '')
    AND sos.natureOfTrade = eirf.natureOfTrade
    AND sos.StrikePrice = eirf.StrikePrice
    AND LOWER(eirf.Mode) = LOWER(sos.Mode)
    AND eirf.cre_date:: DATE = sos.TradeDate:: DATE;

                                 --not null
                                 BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode",
                                "NoApprovalVoil", "NoTraded", "CreatedBy", "CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity")  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, 
                                    src.NoApprovalVoilation,src.NotTradedVoilation, 'System', CURRENT_TIMESTAMP,src.TRX_NO,src.ApprovalDate,src.EirfQuantity
                                FROM tempNoApprovalVoilation AS src
                                WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                BEGIN;
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                                SET
                                    "NoApprovalVoil" = src.NoApprovalVoilation,
                                "NoTraded" = src.NotTradedVoilation,
                                "EirfId" = src.TRX_NO,
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempNoApprovalVoilation AS src
                                WHERE target."SOSmappingId" = src.transid
                                AND src.transid is not null;
        
                        COMMIT;
        
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'First Merge completed', CURRENT_TIMESTAMP);

                        --null
                        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode",
                                "NoApprovalVoil", "NoTraded", "CreatedBy", "CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity")  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, 
                                    src.NoApprovalVoilation,src.NotTradedVoilation, 'System', CURRENT_TIMESTAMP,src.TRX_NO,src.ApprovalDate,src.EirfQuantity
                                FROM tempNoApprovalVoilation AS src                                
                             WHERE src.transid IS NULL
                        AND NOT EXISTS (
                               SELECT 1
                               FROM TEMP_EIRF_Rico_SOS_Processed AS target
                               WHERE target."EirfId" = src.TRX_NO
                            );
                            COMMIT;
                            BEGIN;
        
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target 
                                SET
                                    "NoApprovalVoil" = src.NoApprovalVoilation,
                                "NoTraded" = src.NotTradedVoilation,
                                "EirfId" = src.TRX_NO,
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempNoApprovalVoilation AS src
                                WHERE target."EirfId" = src.TRX_NO
                                AND src.transid is null;
        
                        COMMIT;
        
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Second Merge completed', CURRENT_TIMESTAMP);



    -- Create the temporary table
    CREATE TEMP TABLE tempMoreLessVoilation AS
    SELECT
      CASE WHEN (eirf.FutOpQuantity - sos."sumQuantity") > 0 THEN 'Less than Approved Violation' END AS LessThanApprovedVoil,
      CASE WHEN (eirf.FutOpQuantity - sos."sumQuantity") < 0 THEN 'Greater than Approved Violation ' END AS GreaterThanApprovedVoil,
      COALESCE(sos.EmpId, eirf.EmpId) AS EmpId,
      sos.TradeDate,
      COALESCE(sos.ScripName, eirf.ScripName) AS ScripName,
      COALESCE(sos.ISIN, eirf.ISIN) AS ISIN,
      sos.Quantity,
      sos."sumQuantity",
      sos.TotalPrice,
      COALESCE(sos.Mode, eirf.Mode) AS Mode,
      sos.TransId,
      eirf.TRX_NO,
      eirf.ApprovalDate,
      eirf.FutOpQuantity AS EirfQuantity
    FROM tempEIRF eirf
      FULL JOIN tempSOS sos ON eirf.EmpId = sos.EmpId
        AND sos.symbol = eirf.Symbol
        AND TRIM(sos.ExpMonth) = TRIM(eirf."Month")
        AND sos.optionType = COALESCE(eirf."OptionType", '')
        AND sos.natureOfTrade = eirf.NatureOfTrade
        AND sos.StrikePrice = eirf.StrikePrice
        AND LOWER(eirf.Mode) = LOWER(sos.Mode)
        AND eirf.cre_date:: DATE = sos.TradeDate:: DATE;


        --is not null
        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ISIN", "ScripName",  "Quantity", "TotalPrice","Mode", "LessthanApprovedVoil", 
                                "GreaterthanApprovedVoil", "CreatedBy","CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity"                                                                                                         )  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.isin,src.scripname,  src.quantity, src.totalprice, src.mode, 
                                    src.LessThanApprovedVoil,src.GreaterThanApprovedVoil, 'System', CURRENT_TIMESTAMP,src.TRX_NO,src.ApprovalDate,src.EirfQuantity
                                FROM tempMoreLessVoilation AS src
                                WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;
        
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                                SET
                                    "LessthanApprovedVoil" = src.LessThanApprovedVoil,
                            "GreaterthanApprovedVoil" = src.GreaterThanApprovedVoil,
                                "EirfId" = src.TRX_NO,
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempMoreLessVoilation AS src
                                WHERE target."SOSmappingId" = src.transid
                                AND src.transid is not null;
        
                        COMMIT;


                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Third Merge completed', CURRENT_TIMESTAMP);


                        --is null
                        --null
                        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ISIN", "ScripName",  "Quantity", "TotalPrice","Mode", "LessthanApprovedVoil", 
                                "GreaterthanApprovedVoil", "CreatedBy","CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity"                                                                                                         )  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.isin,src.scripname,  src.quantity, src.totalprice, src.mode, 
                                    src.LessThanApprovedVoil,src.GreaterThanApprovedVoil, 'System', CURRENT_TIMESTAMP,src.TRX_NO,src.ApprovalDate,src.EirfQuantity
                                FROM tempMoreLessVoilation AS src
                                WHERE src.transid IS NULL
                        AND NOT EXISTS (
                               SELECT 1
                               FROM TEMP_EIRF_Rico_SOS_Processed AS target
                               WHERE target."EirfId" = src.TRX_NO
                            );
                            COMMIT;
                               BEGIN;

                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                                SET
                                    "LessthanApprovedVoil" = src.LessThanApprovedVoil,
                            "GreaterthanApprovedVoil" = src.GreaterThanApprovedVoil,
                                "EirfId" = src.TRX_NO,
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempMoreLessVoilation AS src
                                WHERE target."EirfId" = src.TRX_NO
                                AND src.transid is null;
        
                        COMMIT;
        
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Fourth Merge completed', CURRENT_TIMESTAMP);

                        
                            DROP TABLE temp_data;`;

        const result = await connect.sequelize.query(query);


    } catch (error) {
        const errMsg = error.message;
        console.error('Error in noaaprovalcases:', errMsg);
    }

}

async function restrictedlistCheck(Data, date, Data5) {
    try {
        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data5.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');

        const query = `
                        CREATE TEMP TABLE temp_data (
                            EmpId VARCHAR(255),
                            PanNo VARCHAR(255),
                            TradeDate DATE,
                            Exch VARCHAR(255),
                            AccCode VARCHAR(255),
                            AccName VARCHAR(255),
                            ScripCode VARCHAR(255),
                            ScripName VARCHAR(1000),
                            Quantity BIGINT,
                            TotalPrice NUMERIC(9,0),
                            Mode VARCHAR(255),
                            CreatedBy VARCHAR(255),
                            CreatedDate DATE,
                            UpdatedBy VARCHAR(255),
                            UpdatedDate DATE,
                            ISIN VARCHAR(255),
                            OpenQuantity INT,
                            TradedBy VARCHAR(255),
                            StrikePrice VARCHAR(255),
                            ExpiryDate DATE,
                            OptionType VARCHAR(255),
                            TransId BIGINT
                        );

                        INSERT INTO temp_data VALUES ${valuesPart};

                        DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};

                        DROP TABLE IF EXISTS TEMP_MSM046;

                        -- Create temporary table TEMP_MSM046
                        CREATE TEMP TABLE TEMP_MSM046 AS
                        SELECT * FROM "TBL_SCRIPT_MST_FOR_TRADE_RECON"
                        WHERE "CREATED_DATE_AS_TRADE_DATE"::date = '${date}';
                        
	                    DROP TABLE IF EXISTS tempRestrictedVoilation;
	
                        CREATE TEMP TABLE tempRestrictedVoilation AS
		                select M.*,R.*,
                        CASE WHEN R."ISIN" IS NULL THEN NULL ELSE 'Restricted list Violation' END AS restrictedlistvoil                         
		                FROM temp_data M
		                INNER JOIN "TBL_USER_MST" EMP ON EMP."EMPNO" = M.EmpId
		                INNER JOIN TEMP_MSM046 S on S."NSE_CODE" = M.ScripCode
		                LEFT JOIN "TBL_RESTRICTED_LIST_MST" R on R."ISIN" = S."ISIN_CODE" and R."IS_ACTIVE"= true 
		                AND '${date}' BETWEEN R."STARTDATE"::DATE and COALESCE(R."ENDDATE",'${date}')                        
		                WHERE Exch NOT IN ('NSE','BSE') 
		                AND EMP."DSIGNATED" = true and EMP."ISACTIVE" = true 
		                AND M.TradeDate::DATE = '${date}'
		                ORDER BY M.TradeDate DESC;

                        BEGIN;

                        -- Attempt to insert the data
                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed ("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode", "RestrictedListVoil", "CreatedBy", "CreatedDate")
                        SELECT 
                            src.empid, src.transid,src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, 
                            src.mode, src.restrictedlistvoil, 'System', CURRENT_TIMESTAMP
                        FROM tempRestrictedVoilation AS src
                        WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;

                        -- If a conflict occurs, update the existing row
                        UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                        SET
                            "RestrictedListVoil" = src.restrictedlistvoil,
                            "UpdatedBy" = 'System',
                            "UpdatedDate" = CURRENT_TIMESTAMP,
                            "TradeDate" =  src.tradedate::DATE + interval '1 day'

                        FROM tempRestrictedVoilation AS src
                        WHERE target."SOSmappingId" = src.transid;

                        COMMIT;

                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Fifth Merge completed', CURRENT_TIMESTAMP);

                        DROP TABLE temp_data; `;

        const result = await connect.sequelize.query(query);

    } catch (error) {
        const errMsg = error.message;
        console.error('Error in restrictedlist:', errMsg);
    }
}

async function greylistCheck(Data, date, Data6) {
    try {
        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data6.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');

        const query = `
                        CREATE TEMP TABLE temp_data (
                            EmpId VARCHAR(255),
                            PanNo VARCHAR(255),
                            TradeDate DATE,
                            Exch VARCHAR(255),
                            AccCode VARCHAR(255),
                            AccName VARCHAR(255),
                            ScripCode VARCHAR(255),
                            ScripName VARCHAR(1000),
                            Quantity BIGINT,
                            TotalPrice NUMERIC(9,0),
                            Mode VARCHAR(255),
                            CreatedBy VARCHAR(255),
                            CreatedDate DATE,
                            UpdatedBy VARCHAR(255),
                            UpdatedDate DATE,
                            ISIN VARCHAR(255),
                            OpenQuantity INT,
                            TradedBy VARCHAR(255),
                            StrikePrice VARCHAR(255),
                            ExpiryDate DATE,
                            OptionType VARCHAR(255),
                            TransId BIGINT
                        );

                        INSERT INTO temp_data VALUES ${valuesPart};

                        DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};

                        DROP TABLE IF EXISTS TEMP_MSM046;

                        -- Create temporary table TEMP_MSM046
                        CREATE TEMP TABLE TEMP_MSM046 AS
                        SELECT * FROM "TBL_SCRIPT_MST_FOR_TRADE_RECON"
                        WHERE "CREATED_DATE_AS_TRADE_DATE"::date = '${date}';

                        DROP TABLE IF EXISTS tempGreyListVoilation;
	
                        CREATE TEMP TABLE tempGreyListVoilation AS
                        select SOS.*,GL.*,CASE WHEN GL."ISIN" IS NULL THEN NULL ELSE 'Grey List Violation' END AS GreyListVoil		
                        from temp_data SOS
                        INNER JOIN "TBL_USER_MST" EMP ON EMP."EMPNO" = SOS.EmpId		
                        INNER JOIN TEMP_MSM046 S on S."NSE_CODE" = SOS.ScripCode
                        LEFT JOIN "TBL_GREY_LIST_MST" GL on GL."ISIN" = S."ISIN_CODE" and  GL."IS_ACTIVE"= true 
                        AND '${date}' BETWEEN GL."STARTDATE"::DATE AND COALESCE(GL."ENDDATE"::DATE, '${date}')        
                        WHERE Exch NOT IN ('NSE','BSE') and EMP."GREYLIST" = true
                        AND EMP."DSIGNATED" = true and EMP."ISACTIVE" = true 
                        AND SOS.TradeDate::DATE = '${date}'
                        ORDER BY SOS.TradeDate DESC;


                        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed("EmpId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode", "GreyListVoil", "CreatedBy", "CreatedDate")        
                                SELECT 
                                    src.empid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, src.GreyListVoil, 'System', CURRENT_TIMESTAMP
                                FROM tempGreyListVoilation AS src
                                WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;
        
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                                SET
                                    "GreyListVoil" = src.GreyListVoil,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempGreyListVoilation AS src
                                WHERE target."SOSmappingId" = src.transid;
        
                        COMMIT;
        
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Sixth Merge completed', CURRENT_TIMESTAMP);

                        DROP TABLE temp_data; 
                    `;

        const result = await connect.sequelize.query(query);

    } catch (error) {
        const errMsg = error.message;
        console.error('Error in greylist:', errMsg);
    }
}

async function UPSIProjectCheck(Data, date, Data7) {
    try {

        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, 
            '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, 
            ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data7.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');

        const query = `
                        CREATE TEMP TABLE temp_data (
                            EmpId VARCHAR(255),
                            PanNo VARCHAR(255),
                            TradeDate DATE,
                            Exch VARCHAR(255),
                            AccCode VARCHAR(255),
                            AccName VARCHAR(255),
                            ScripCode VARCHAR(255),
                            ScripName VARCHAR(1000),
                            Quantity BIGINT,
                            TotalPrice NUMERIC(9,0),
                            Mode VARCHAR(255),
                            CreatedBy VARCHAR(255),
                            CreatedDate DATE,
                            UpdatedBy VARCHAR(255),
                            UpdatedDate DATE,
                            ISIN VARCHAR(255),
                            OpenQuantity INT,
                            TradedBy VARCHAR(255),
                            StrikePrice VARCHAR(255),
                            ExpiryDate DATE,
                            OptionType VARCHAR(255),
                            TransId BIGINT
                        );

                        INSERT INTO temp_data VALUES ${valuesPart};

                        DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};


                    DROP TABLE IF EXISTS TEMP_MSM046;

                    -- Create temporary table TEMP_MSM046
                    CREATE TEMP TABLE TEMP_MSM046 AS
                    SELECT * FROM "TBL_SCRIPT_MST_FOR_TRADE_RECON"
                    WHERE "CREATED_DATE_AS_TRADE_DATE"::date = '${date}';

                    DROP TABLE IF EXISTS tempUPSIProj;
                    DROP TABLE IF EXISTS tempUPSIProjFinal;

	
                    -- Create temporary tables
                    -- Create temporary tables
                    CREATE TEMP TABLE tempUPSIProj AS
                    SELECT T."ISIN", T.EmpNo, COALESCE(T.CreatedDate, '1970-01-01'::timestamp) AS CreatedDate
                    FROM (
                        --check in upload file
                        SELECT SE."ISIN", PE."EMPLOYEE_ID" AS EmpNo, PE."CREATED_ON" AS CreatedDate
                        FROM "TBL_UPSI_PROJECT_MST" PD
                        INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                        INNER JOIN "TBL_PROJECT_EMPLOYEE_DETAILS" PE ON PD."ID" = PE."PROJECT_ID"
                        WHERE PD."IS_ACTIVE" = true AND PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015'
                    
                        UNION
                    
                        -- check in upsi mst
                        SELECT SE."ISIN", AD."EMPLOYEE_ID" AS EmpNo, COALESCE(AD."CREATED_ON", '1970-01-01'::timestamp) AS CreatedDate
                        FROM "TBL_UPSI_PROJECT_MST" PD
                        INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                        INNER JOIN "TBL_UPSI_MST" AD ON 
                        AD."APPL_ID" = ANY (SELECT unnest(string_to_array(PD."PTYPES", ','))::integer)
                        WHERE AD."IS_ACTIVE" = true 
                        AND PD."IS_ACTIVE" = true 
                        AND SE."IS_ACTIVE" = true 
                        AND AD."APPL_ID" <> '4' 
                        AND AD."IS_ACTIVE" = true                    
                        AND SE."ISIN" <> 'INE531F01015'
                    
                        UNION
                    
                        --check in entity
                        SELECT SE."ISIN", PE."EMPLOYEE_ID" AS EmpNo, COALESCE(PE."CREATED_ON", '1970-01-01'::timestamp) AS CreatedDate
                        FROM "TBL_UPSI_PROJECT_MST" PD
                        INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                        INNER JOIN "TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA" PE ON PD."ID"  = PE."PROJECT_ID"
                        WHERE 
                        PD."IS_ACTIVE" = true AND 
                        PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015'
                    
                        UNION
                    
                        --check in accesstype
                        SELECT SE."ISIN", PE."EMPNO" AS EmpNo, COALESCE(PE."CREATED_ON", '1970-01-01'::timestamp) AS CreatedDate
                        FROM "TBL_UPSI_PROJECT_MST" PD
                        INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                        INNER JOIN "TBL_UPSI_EMPLOYEE_DETAILS" PE ON PD."ID" = PE."PROJECT_ID"
                        WHERE PD."IS_ACTIVE" = true AND PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015'
                    ) T
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = T.EmpNo
                    WHERE UM."ISACTIVE" = true;
                     
                    -- Create final temporary table
                    CREATE TEMP TABLE tempUPSIProjFinal AS
                    SELECT SOS.*, 
                        CASE WHEN UP."ISIN" IS NULL THEN NULL ELSE 'UPSI Project Violation' END AS UCLListVoil
                    FROM temp_data SOS
                    INNER JOIN TEMP_MSM046 S ON S."NSE_CODE" = SOS.ScripCode
                    INNER JOIN tempUPSIProj UP ON UP."ISIN" = S."ISIN_CODE" AND UP.EmpNo = SOS.EmpId
                    WHERE SOS.TradeDate::DATE = '${date}'
                    AND SOS.TradeDate > UP.CreatedDate
                    AND SOS.ISIN <> 'INE531F01015'
                    AND SOS.Exch NOT IN ('NSE','BSE');

                    BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode", "UcLlistVoil", "CreatedBy", "CreatedDate"      )  

                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, src.UCLListVoil, 'System', CURRENT_TIMESTAMP
                                FROM tempUPSIProjFinal AS src
                                WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;
        
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                                SET
                                    "UcLlistVoil" = src.UCLListVoil,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempUPSIProjFinal AS src
                                WHERE target."SOSmappingId" = src.transid;
        
                        COMMIT;
        
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 0, 'Eight Merge completed', CURRENT_TIMESTAMP);

                    DROP TABLE temp_data;
        `;

        const result = await connect.sequelize.query(query);

    } catch (error) {
        const errMsg = error.message;
        console.error('Error in upsiproject:', errMsg);
    }
}

async function HoldingCheck(Data, date, Data8, thresholdAmount) {
    try {
        const valuesPart = Data.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, 
            '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, 
            ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data8.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');


        const query = `
                    CREATE TEMP TABLE temp_data (
                        EmpId VARCHAR(255),
                        PanNo VARCHAR(255),
                        TradeDate DATE,
                        Exch VARCHAR(255),
                        AccCode VARCHAR(255),
                        AccName VARCHAR(255),
                        ScripCode VARCHAR(255),
                        ScripName VARCHAR(1000),
                        Quantity BIGINT,
                        TotalPrice NUMERIC(9,0),
                        Mode VARCHAR(255),
                        CreatedBy VARCHAR(255),
                        CreatedDate DATE,
                        UpdatedBy VARCHAR(255),
                        UpdatedDate DATE,
                        ISIN VARCHAR(255),
                        OpenQuantity INT,
                        TradedBy VARCHAR(255),
                        StrikePrice VARCHAR(255),
                        ExpiryDate DATE,
                        OptionType VARCHAR(255),
                        TransId BIGINT
                    );

                    INSERT INTO temp_data VALUES ${valuesPart};

                    DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 
     
                    CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                    SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                    INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};

                    DROP TABLE TEMP_EIRF_RICO_Trades_KnockOff;

                    CREATE TEMPORARY TABLE TEMP_EIRF_RICO_Trades_KnockOff AS
                    SELECT * FROM "eirf_rico_trades_knockoff" WHERE false;

                    -- Drop tables if they exist
                    DROP TABLE IF EXISTS tmpAllTrade;
                    DROP TABLE IF EXISTS tmpTodayTrade;
                    DROP TABLE IF EXISTS tmpSONonDesg;
                    DROP TABLE IF EXISTS tmpNonDesgFresh;
                    DROP TABLE IF EXISTS TempSO;
                    DROP TABLE IF EXISTS tmpFreshTrade;
                    DROP TABLE IF EXISTS tmpAllTrade_Rollover;

                    -- Updated Script Name as OLD data doesn't contain Expirydate (added on 03-10-2023). So updating new Scripname with Expirydate column
                    UPDATE temp_data 
                    SET ScripName = 
                        CASE 
                            WHEN OptionType = 'FUT' THEN ScripCode || to_char(CAST(ExpiryDate AS DATE), 'DDMONYY') || OptionType
                            WHEN OptionType IN ('PE', 'CE') THEN ScripCode || to_char(CAST(ExpiryDate AS DATE), 'DDMONYY') || to_char(CAST(StrikePrice AS NUMERIC), 'FM99990D0') || OptionType
                            ELSE ScripName 
                        END;

                    -- Create temporary table tmpAllTrade 
                    CREATE TEMPORARY TABLE tmpAllTrade AS
                    SELECT *, 'Square Off aaaa' AS Position
                    FROM temp_data
                    WHERE Exch NOT IN ('NSE', 'BSE') AND TradeDate::DATE <= '${date}' AND OpenQuantity > 0
                    ORDER BY EmpId, ScripName, TradeDate ASC;

                    -- Update Position column in tmpAllTrade
                    UPDATE tmpAllTrade SET Position = '';

                    -- Create temporary table tmpTodayTrade
                    CREATE TEMPORARY TABLE tmpTodayTrade AS
                    SELECT *
                    FROM temp_data
                    WHERE Exch NOT IN ('NSE', 'BSE') AND TradeDate::DATE = '${date}'
                    ORDER BY EmpId, ScripName, TradeDate ASC;

                    -- Rollover buy checking
                    CREATE TEMPORARY TABLE tmpAllTrade_Rollover AS
                    SELECT *
                    FROM temp_data
                    WHERE Exch NOT IN ('NSE', 'BSE') AND TradeDate::DATE <= '${date}'
                    AND LOWER(Mode) = LOWER('Buy')
                    ORDER BY EmpId, ScripName, TradeDate ASC;

                    -- Start For finding the Position
                    DO $$ 
                    DECLARE 
                        td_TransId bigint;
                        td_EmpId varchar(50);
                        td_TradeDate timestamp;
                        td_ScripName varchar(100);
                        td_Quantity bigint;
                        td_Mode varchar(10);
                        td_TotalPrice numeric(18,2);
                        td_PreQuantity bigint;
                            BEGIN
                                FOR td_TransId, td_EmpId, td_TradeDate, td_ScripName, td_Quantity, td_Mode, td_TotalPrice IN 
                                (SELECT TransId, EmpId, TradeDate, ScripName, Quantity, Mode, TotalPrice 
                                FROM tmpTodayTrade ORDER BY TradeDate) 
                                LOOP
                                    DECLARE 
                                        all_TransId bigint;
                                        all_EmpId varchar(50);
                                        all_TradeDate timestamp;
                                        all_ScripName varchar(100);
                                        all_Quantity bigint;
                                        all_OpenQuantity bigint;
                                        all_Mode varchar(10);
                                        all_TotalPrice numeric(18,2);
                                        all_PreQuantity bigint;
                                        BEGIN
                                            DECLARE 
                                                prev_Quantity bigint;
                                                prev_Mode varchar(10);
                                                BEGIN
                                                    prev_Quantity := 0;
                                                    prev_Mode := '';                
                                                    FOR all_TransId, all_EmpId, all_TradeDate, all_ScripName, all_Quantity, all_Mode, all_TotalPrice, all_OpenQuantity IN 
                                                    (SELECT TransId, EmpId, TradeDate, ScripName, Quantity, Mode, TotalPrice, OpenQuantity 
                                                    FROM tmpAllTrade 
                                                    WHERE EmpId = td_EmpId AND ScripName = td_ScripName AND OpenQuantity > 0) 
                                                    LOOP
                                                        IF prev_Mode = '' THEN
                                                            prev_Mode := all_Mode; --sell
                                                            prev_Quantity := all_Quantity; --300
                                                        END IF;
                                                        IF prev_Mode = all_Mode THEN
                                                            prev_Quantity := prev_Quantity + all_Quantity; --600
                                                            UPDATE tmpAllTrade SET Position = 'Fresh' WHERE TransId = all_TransId;
                                                        END IF;
                                                        IF prev_Mode <> all_Mode THEN
                                                            IF prev_Quantity - all_Quantity >= 0 THEN
                                                                prev_Quantity := prev_Quantity - all_Quantity;
                                                                UPDATE tmpAllTrade SET Position = 'Square Off' WHERE TransId = all_TransId;
                                                                IF prev_Quantity = 0 THEN
                                                                    prev_Mode := all_Mode;
                                                                END IF;
                                                                ELSE
                                                                    prev_Quantity := 0;
                                                            END IF;
                                                        END IF;
                                                    END LOOP;
                                                END;
                                        END;
                                END LOOP;
                            END $$;
                    -- End For finding the Position

                    --Start For non Designated Emp Square Off trade
                    CREATE TEMP TABLE tmpSONonDesg AS
                    SELECT SO.*
                    FROM tmpAllTrade SO
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = SO.EmpId
                    WHERE Position = 'Square Off' AND TradeDate::DATE = '${date}'
                    AND UM."DSIGNATED" = false;

                    --Start For non Designated Emp Fresh trade with >5 lac
                    CREATE TEMP TABLE tmpNonDesgFresh AS
                    SELECT t.*
                    FROM (
                        SELECT EmpId,ScripName,TradeDate::DATE AS TradeDate,SUM(Quantity) AS SumQuantity,SUM(TotalPrice) AS SumTotalPrice,
                        SUM(OpenQuantity) AS SumOpenQuantity,Mode
                        FROM tmpAllTrade SO
                        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = SO.EmpId
                        WHERE
                            Position = 'Fresh' AND TradeDate::DATE < '${date}'
                            AND UM."DSIGNATED" = false
                            AND OpenQuantity > 0
                        GROUP BY EmpId, ScripName,TradeDate::DATE, Mode
                    ) t
                    WHERE SumTotalPrice >= '${thresholdAmount}'
                    ORDER BY TradeDate::DATE;
                    --End For non Designated Emp Fresh trade with >5 lac

                    --Start For All Square Off trades
                    CREATE TEMP TABLE TempSO AS
                    SELECT tmp.EmpId, tmp.TradeDate, tmp.ScripName, tmp.Quantity, tmp.TotalPrice, tmp.Mode, tmp.TransId
                    FROM (
                        SELECT EmpId,TradeDate,ScripName,Quantity,TotalPrice,Mode,TransId
                        FROM tmpAllTrade SO
                        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = SO.EmpId
                        WHERE Position = 'Square Off' AND TradeDate::DATE = '${date}'
                        AND UM."DSIGNATED" = true

                        UNION ALL 

                        SELECT EmpId,TradeDate,ScripName,Quantity,TotalPrice,Mode,TransId
                        FROM (
                            SELECT *,
                            (
                            SELECT TradeDate
                            FROM tmpNonDesgFresh
                            WHERE EmpId = SO.EmpId AND ScripName = SO.ScripName
                            LIMIT 1
                            ) AS FreshTradeDate
                            FROM tmpSONonDesg SO
                        ) t
                        WHERE FreshTradeDate IS NOT NULL
                    ) tmp
                    ORDER BY TradeDate;

                    --End For Square Off trades

                    --Start For All fresh trades
                    CREATE TEMP TABLE tmpFreshTrade AS
                    SELECT *
                    FROM tmpAllTrade
                    WHERE Position = 'Fresh' AND TradeDate::DATE < '${date}'
                    ORDER BY TradeDate DESC;

                    DO $$ 
DECLARE 
    sell_TransId BIGINT;
    sell_EmpId VARCHAR(50);
    sell_TradeDate TIMESTAMP;
    sell_ScripName VARCHAR(100);
    sell_Quantity BIGINT;
    sell_Mode VARCHAR(10);
    sell_TotalPrice DECIMAL(18, 2);
    sell_PreQuantity BIGINT;
    
    buy_TransId BIGINT;
    buy_EmpId VARCHAR(50);
    buy_TradeDate TIMESTAMP;
    buy_ScripName VARCHAR(100);
    buy_Quantity BIGINT;
    buy_OpenQuantity BIGINT;
    buy_Mode VARCHAR(10);
    buy_TotalPrice DECIMAL(18, 2);
    buy_PreQuantity BIGINT;
BEGIN
    FOR sell_TransId, sell_EmpId, sell_TradeDate, sell_ScripName, sell_Quantity, sell_Mode, sell_TotalPrice IN
        SELECT TransId, EmpId, TradeDate, ScripName, Quantity, Mode, TotalPrice FROM TempSO ORDER BY TradeDate

    LOOP
        FOR buy_TransId, buy_EmpId, buy_TradeDate, buy_ScripName, buy_Quantity, buy_Mode, buy_TotalPrice, buy_OpenQuantity IN
            SELECT TransId, EmpId, TradeDate, ScripName, Quantity, Mode, TotalPrice, OpenQuantity
            FROM tmpFreshTrade
            WHERE EmpId = sell_EmpId AND ScripName = sell_ScripName AND OpenQuantity > 0
            ORDER BY TradeDate DESC
        LOOP 
            IF buy_OpenQuantity - sell_Quantity >= 0 THEN

                -- Insert into TEMP_EIRF_RICO_Trades_KnockOff                
                INSERT INTO TEMP_EIRF_RICO_Trades_KnockOff("EmpmapBuy_Id", "EmpmapSell_Id", "BeforeUpdateQuantity", "AfterUpdateQuantity", "KnockoffDate", "SellQuantity")
                VALUES (buy_TransId, sell_TransId, buy_OpenQuantity, buy_OpenQuantity - sell_Quantity, CURRENT_DATE, sell_Quantity);
            
                -- Update tmpFreshTrade
                UPDATE tmpFreshTrade 
                SET OpenQuantity = buy_OpenQuantity - sell_Quantity 
                WHERE TransId = buy_TransId;

                sell_Quantity := 0;


                IF (
                    (
                        TO_DATE(
                            SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])),
                            'DDMONYY'
                        ) <> sell_TradeDate::DATE
                        AND EXTRACT(DAY FROM sell_TradeDate - buy_TradeDate) < 30  
                        AND NOT EXISTS (
                            SELECT 1
                            FROM "TBL_IRF_Approval_Data"
                            WHERE "NatureofTrade" = 'Future' AND "Transaction" = 'ROLLOVER'
                                AND "TRX_NO" IN (
                                    SELECT "EirfId"
                                    FROM TEMP_EIRF_Rico_SOS_Processed
                                    WHERE "EirfId" IS NOT NULL AND "HoldingVoil" IS NOT NULL AND "SOSmappingId" = sell_TransId
                                )
                                AND "CRE_DATE"::DATE BETWEEN buy_TradeDate::DATE AND sell_TradeDate::DATE
                        )
                    )
                ) THEN

                DECLARE
                BuyTradeDate_rollover DATE;
                ScripName_prevMonth VARCHAR(100);
                sellTradedate DATE;
                PrevMonthDate DATE;
                PrevScripDate DATE;
                ScripDate_prevMonth DATE;
                    BEGIN
                    
                    SELECT TO_DATE(
                        SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])),
                        'DDMONYY'
                    ) INTO BuyTradeDate_rollover  
                        FROM TEMP_EIRF_Rico_SOS_Processed
                        WHERE "SOSmappingId" = sell_TransId;

                        sellTradedate := BuyTradeDate_rollover;

                        BuyTradeDate_rollover := BuyTradeDate_rollover - INTERVAL '1 month';

                        IF EXISTS (
                            SELECT 1
                            FROM tmpAllTrade_Rollover
                            WHERE EmpId = buy_EmpId
                              AND ScripName ILIKE REPLACE(sell_ScripName, SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])), '%' || TO_CHAR(BuyTradeDate_rollover, 'MonYY'))
                              AND LOWER(Mode) = LOWER('Buy')
                            ORDER BY TradeDate
                            LIMIT 1
                        ) THEN

                        SELECT  SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])),TradeDate INTO ScripDate_prevMonth,PrevScripDate                    
                        FROM tmpAllTrade_Rollover
                        WHERE EmpId = buy_EmpId
                        AND ScripName ILIKE REPLACE(sell_ScripName, SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])), '%' || TO_CHAR(BuyTradeDate_rollover, 'MonYY'))
                        AND LOWER(Mode) = LOWER('Buy')
                        ORDER BY TradeDate
                        LIMIT 1;


                        IF CAST(buy_TradeDate AS DATE) > ScripDate_prevMonth AND ScripDate_prevMonth < sell_TradeDate AND EXTRACT(DAY FROM AGE(sell_TradeDate::DATE,buy_TradeDate::DATE)) < 30 THEN                        
                                -- Additional logic inside the true block...
                                --RAISE NOTICE 'step 1 holding';
                                UPDATE TEMP_EIRF_Rico_SOS_Processed
                                SET "HoldingVoil" = 'Holding Violation'
                                WHERE "SOSmappingId" = sell_TransId;
                        END IF;

                        ELSE
                        IF EXTRACT(DAY FROM sell_TradeDate::DATE - buy_TradeDate::DATE) < 30 THEN
                                -- Additional logic inside the false block...
                                --RAISE NOTICE 'step 2 holding';
                                UPDATE TEMP_EIRF_Rico_SOS_Processed
                                SET "HoldingVoil" = 'Holding Violation'
                                WHERE "SOSmappingId" = sell_TransId;
                        END IF;

                        END IF;

                        IF EXISTS (
                            SELECT 1
                            FROM tmpAllTrade_Rollover
                            WHERE EmpId = buy_EmpId
                            AND ScripName ILIKE REPLACE(sell_ScripName, SUBSTRING(sell_ScripName FROM (SELECT (regexp_matches(sell_ScripName, E'\\d{2}[A-Z][A-Z][A-Z]\\d{2}'))[1])), '%' || TO_CHAR(BuyTradeDate_rollover, 'MonYY'))
                                AND LOWER(Mode) = LOWER('Buy')
                               AND EXTRACT(DAY FROM AGE(sell_TradeDate::DATE,TradeDate::DATE)) < 30                                                               
                            ORDER BY TradeDate
                            LIMIT 1
                        ) THEN
                            -- Additional logic inside the false block...
                            --RAISE NOTICE 'step 3 holding';
                            UPDATE TEMP_EIRF_Rico_SOS_Processed
                            SET "HoldingVoil" = 'Holding Violation'
                            WHERE "SOSmappingId" = sell_TransId;
                        END IF;

                        END;

                
                END IF;

                

               
                
            ELSE
                                
                                -- Insert into TEMP_EIRF_RICO_Trades_KnockOff
                                INSERT INTO TEMP_EIRF_RICO_Trades_KnockOff("EmpmapBuy_Id", "EmpmapSell_Id", "BeforeUpdateQuantity", "AfterUpdateQuantity", "KnockoffDate", "SellQuantity")                                        
                                VALUES (buy_TransId, sell_TransId, buy_OpenQuantity, 0, CURRENT_DATE, sell_Quantity);

                                -- Update tmpFreshTrade
                                UPDATE tmpFreshTrade SET OpenQuantity = 0 WHERE TransId = buy_TransId;
                                sell_Quantity := sell_Quantity - buy_OpenQuantity;

            END IF;
        END LOOP;
    END LOOP;


    -- Update openQuantity and UpdatedDate in temp_data
       UPDATE temp_data
       SET OpenQuantity = temp.openQuantity, UpdatedDate = CURRENT_DATE
       FROM tmpFreshTrade temp
       WHERE temp_data.TransId = temp.TransId;


       -- Update HoldingVoil in #EIRF_Rico_SOS_Processed (Added on 05-04-2023 as Holding violation is not for BUY cases)
       UPDATE TEMP_EIRF_Rico_SOS_Processed
       SET "HoldingVoil" = NULL
       WHERE LOWER("Mode") = LOWER('Buy') AND "HoldingVoil" <> '' AND "TradeDate"::DATE >= '2022-08-01';
       --End For Holding Period logic

       -- Update trade data
       UPDATE "eirf_rico_sos_emp_mapping" a
       SET "OpenQuantity" = b.OpenQuantity, "UpdatedDate" = b.UpdatedDate
       FROM temp_data b
       WHERE a."TransId" = b.TransId;


       -- Insert into EIRF_Rico_SOS_Processed
       INSERT INTO "eirf_rico_sos_processed"("EmpId","TradeDate","ScripCode","ScripName","ISIN","Quantity","TotalPrice","Mode","SOSmappingId","EirfId","EirfApprovalDate",
       "EirfQuantity","IntradayVoil","NoApprovalVoil","GreaterthanApprovedVoil","LessthanApprovedVoil","HoldingVoil","RestrictedListVoil","GreyListVoil","UcLlistVoil",
       "NoTraded","CreatedBy","CreatedDate","UpdatedBy","UpdatedDate")
       SELECT
           "EmpId","TradeDate"::DATE + interval '1 day' AS "TradeDate","ScripCode","ScripName","ISIN","Quantity","TotalPrice","Mode","SOSmappingId","EirfId","EirfApprovalDate"+ interval '3 day' AS "EirfApprovalDate",
           "EirfQuantity","IntradayVoil","NoApprovalVoil","GreaterthanApprovedVoil","LessthanApprovedVoil","HoldingVoil","RestrictedListVoil","GreyListVoil","UcLlistVoil",
          "NoTraded","CreatedBy","CreatedDate"+ interval '3 day' AS "CreatedDate","UpdatedBy","UpdatedDate"  
       FROM TEMP_EIRF_Rico_SOS_Processed
        --WHERE "TradeDate"::DATE = '${date}';
        WHERE "TradeDate"::DATE = ('${date}'::DATE- interval '1 day')::DATE;
     
        -- Insert into EIRF_RICO_Trades_KnockOff
        INSERT INTO "eirf_rico_trades_knockoff"("EmpmapBuy_Id", "EmpmapSell_Id", "BeforeUpdateQuantity", "AfterUpdateQuantity", "KnockoffDate", "SellQuantity")
        SELECT "EmpmapBuy_Id","EmpmapSell_Id","BeforeUpdateQuantity","AfterUpdateQuantity","KnockoffDate","SellQuantity" 
       FROM TEMP_EIRF_RICO_Trades_KnockOff;


       -- Log entry
       INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
       VALUES ('${date}', 0, 'Trade Reconciliation successfully done for FnO', CURRENT_TIMESTAMP);

       
       DROP TABLE temp_data;


    
END $$;





                   
                                         

                    
                             
                   
        `;

        const result = await connect.sequelize.query(query);


    } catch (error) {
        const errMsg = error.message;
        console.error('Error in holding:', errMsg);
    }
}

async function fnoeirfRicoReconLogic(date) {
    try {

        const query = ` 
                        DROP TABLE IF EXISTS TEMP_EIRF_Rico_SOS_Emp_Mapping;
                        DROP TABLE IF EXISTS TEMP_EIRF_Rico_SOS_Processed;
                        DROP TABLE IF EXISTS TEMP_EIRF_RICO_Trades_KnockOff;
        
                        CREATE TEMP TABLE TEMP_EIRF_Rico_SOS_Emp_Mapping AS
                        SELECT * FROM "eirf_rico_sos_emp_mapping";

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        CREATE TEMPORARY TABLE TEMP_EIRF_RICO_Trades_KnockOff AS
                        SELECT * FROM "eirf_rico_trades_knockoff" WHERE false;
                        
                        -- Insert a log entry
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 1, 'Trade Reconciliation started for NFO', CURRENT_TIMESTAMP);`;

        const result = await connect.sequelize.query(query, [date]);

        const query1 = `select * from TEMP_EIRF_Rico_SOS_Emp_Mapping`;
        const result1 = await connect.sequelize.query(query1);
        const Data = result1[0];
        // console.log("Data", Data);

        const query2 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
        const result2 = await connect.sequelize.query(query2);
        const Data2 = result2[0];
        // console.log("Data2", Data2);

        const query3 = `select * from TEMP_EIRF_RICO_Trades_KnockOff`;
        const result3 = await connect.sequelize.query(query3);
        const Data3 = result3[0];
        // console.log("Data3", Data3);

        const thresholdAmount = 1000000;

        // Check if any row has TradeDate equal to the target date
        const hasMatchingRow = Data.some(row => {

            const formattedDate = row.TradeDate.toISOString().split('T')[0];
            console.log("formattedDate", formattedDate);
            return formattedDate === date && !['NSE', 'BSE'].includes(row.Exch);

        });

        if (!hasMatchingRow) {

            console.log(`No rows found with TradeDate equal to ${date}`);
            const EmailId = 'rinkal@neweltechnologies.com';
            const msg = 'Trade Reconciliation could not be proceess due to Trade data unavailiblity in SOS Employee mapping table for FnO ' + date;
            await sendEmail(EmailId, `Reminder - Trade Reconciliation Failed for- ${date}`, msg);

        } else {

            function countRowsWithTradeDate(data, targetDate) {
                const count = data.filter(row => {

                    const formattedDate1 = row.TradeDate.toISOString().split('T')[0]
                    console.log("formattedDate1", formattedDate1);

                    return formattedDate1 === targetDate && !['NSE', 'BSE'].includes(row.Exch);
                }).length;

                return count;
            }

            const resultCount = countRowsWithTradeDate(Data, date);
            console.log("resultCount", resultCount);

            if (resultCount > 150) {

                const EmailId = 'rinkal@neweltechnologies.com';
                const msg1 = 'FnO - Data exceeds the expected limit for the day. Total count : ' + resultCount;
                await sendEmail(EmailId, `Reminder - Data exceeds for Fno for - ${date}`, msg1);

            } else {
                console.log("Data not Exceeds.");
                await intraday_check(Data, date, Data2);
                const query4 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result4 = await connect.sequelize.query(query4);
                const Data4 = result4[0];
                // console.log("Data4", Data4);

                await noApprovalCases(date, thresholdAmount, Data, Data4);
                const query5 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result5 = await connect.sequelize.query(query5);
                const Data5 = result5[0];
                // console.log("Data5", Data5);                

                await restrictedlistCheck(Data, date, Data5);
                const query6 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result6 = await connect.sequelize.query(query6);
                const Data6 = result6[0];
                // console.log("Data6", Data6);

                await greylistCheck(Data, date, Data6);
                const query7 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result7 = await connect.sequelize.query(query7);
                const Data7 = result7[0];
                // console.log("Data7", Data7);

                await UPSIProjectCheck(Data, date, Data7);
                const query8 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result8 = await connect.sequelize.query(query8);
                const Data8 = result8[0];
                // console.log("Data8", Data8);

                await HoldingCheck(Data, date, Data8, thresholdAmount);
                const query9 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result9 = await connect.sequelize.query(query9);
                const Data9 = result9[0];
                console.log("Data9", Data9);
                const query10 = `select * from TEMP_EIRF_RICO_Trades_KnockOff`;
                const result10 = await connect.sequelize.query(query10);
                const Data10 = result10[0];
                console.log("Data10", Data10);
                 
                

            }

        }

    } catch (error) {
        const errMsg = error.message;
        console.error('Error in fnoeirfRicoReconLogic:', errMsg);
        // const currentDate = new Date();
        const errquery = `INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
        VALUES ('${date}', 0, '${errMsg}', CURRENT_TIMESTAMP);`;
        await connect.sequelize.query(errquery, [date, errMsg]);
        const EmailId = 'rinkal@neweltechnologies.com';
        const msg = 'Trade Reconciliation for FnO failed - ' + date + errMsg;
        // await sendEmail(EmailId, `Reminder - Trade Reconciliation Failed for- ${date}`, msg);
    }

}


// Call the main function
module.exports.fnoeirfRicoReconLogic = fnoeirfRicoReconLogic;








