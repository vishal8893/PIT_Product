var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const fs = require('fs')
const path = require("path");

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

            CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
            SELECT * FROM "eirf_rico_sos_processed" WHERE false;

            CREATE TEMP TABLE temp_1 AS
            SELECT
                    SUM(t2.TotalPrice) AS "sumTotalPrice",SUM(t2.Quantity) AS "sumQuantity",MIN(t1.TradeDate) AS "TradeDate",t1.TransId
            FROM
            temp_data AS t1
            INNER JOIN temp_data AS t2 ON t1.EmpId = t2.EmpId AND t1.ISIN = t2.ISIN AND LOWER(t1.Mode) = LOWER(t2.Mode)
            WHERE
                t1.TradeDate:: DATE = '${date}' AND t2.TradeDate:: DATE = '${date}'
            GROUP BY t1.TransId;

            CREATE TEMP TABLE temp_2 AS
            SELECT
                    COUNT(1) AS "BuyCount",EmpId,ISIN
            FROM
            temp_data
            WHERE
            LOWER(Mode) = LOWER('Buy') AND TradeDate:: DATE = '${date}' AND ISIN IS NOT NULL
            GROUP BY EmpId,ISIN;

            CREATE TEMP TABLE temp_3 AS
            SELECT
                COUNT(1) AS "SellCount",EmpId,ISIN
            FROM
            temp_data
            WHERE
            LOWER(Mode) = LOWER('Sell') AND TradeDate:: DATE = '${date}' AND ISIN IS NOT NULL
            GROUP BY EmpId,ISIN;

            -- Insert into EIRF_Rico_SOS_Processed
            INSERT INTO TEMP_EIRF_Rico_SOS_Processed("EmpId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode", "IntradayVoil", "CreatedBy", "CreatedDate", "SOSmappingId")
            SELECT t.EmpId, t.TradeDate, t.ScripCode, t.ScripName, t.ISIN, t.Quantity, t.TotalPrice, t.Mode,
                CASE
                    WHEN COALESCE(e1."BuyCount", 0) > 0 AND COALESCE(e2."SellCount", 0) > 0 THEN
                    CASE
                        WHEN LOWER(t.Mode) = LOWER('Sell') THEN 'Intraday Violation'
                    END 
                END AS Voilation,
            'System',NOW(),t.TransId
            FROM
            (
                SELECT sos.TransId, sos.TradeDate::DATE, sos.EmpId, sos.Exch, sos.ISIN, sos.Quantity, sos.TotalPrice, sos.Mode, temp."sumTotalPrice",
                temp."sumQuantity", UM."DSIGNATED", sos.ScripCode, sos.ScripName
                FROM
                temp_1 temp
                INNER JOIN temp_data sos ON temp.TransId = sos.TransId
                INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = sos.EmpId
                WHERE
                sos.ISIN <> 'INE531F01015' -- Nuvama scrips
            ) t
            LEFT JOIN temp_2 e1 ON e1.EmpId = t.EmpId AND e1.ISIN = t.ISIN
            LEFT JOIN temp_3 e2 ON e2.EmpId = t.EmpId AND e2.ISIN = t.ISIN
            WHERE
                t.TradeDate:: DATE = '${date}' AND t.ISIN IS NOT NULL
            ORDER BY t.EmpId,t.ISIN,t.TradeDate;
            
            DROP TABLE temp_1;
            DROP TABLE temp_2;
            DROP TABLE temp_3;
            DROP TABLE temp_data;`;

        const result = await connect.sequelize.query(query);
    } catch (error) {
        const errMsg = error.message;
        console.error('Error in intraday_check:', errMsg);
        // Add handling for the error, such as sending an email or logging it to a file/database
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

                        DROP TABLE IF EXISTS tempSOS;
                        DROP TABLE IF EXISTS tempEIRF;
                        DROP TABLE IF EXISTS tempNoApprovalVoilation;
                        DROP TABLE IF EXISTS tempMoreLessVoilation;

                       DROP TABLE TEMP_EIRF_Rico_SOS_Processed; 

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed VALUES ${valuesPart1};

                        -- Create temporary table for trade data
                        CREATE TEMP TABLE tempSOS AS
                        SELECT sos.TransId, sos.TradeDate, sos.EmpId, sos.Exch, sos.ISIN, sos.Quantity, sos.TotalPrice, sos.Mode, t."sumTotalPrice",
                        t."sumQuantity", UM."DSIGNATED", sos.ScripCode, sos.ScripName
                        FROM (
                            SELECT SUM(t2.TotalPrice) AS "sumTotalPrice", SUM(t2.Quantity) AS "sumQuantity", MIN(t1.TradeDate) AS "TradeDate", t1.TransId
                            FROM temp_data t1
                            INNER JOIN temp_data t2 ON t1.EmpId = t2.EmpId AND t1.ISIN = t2.ISIN AND LOWER(t1.Mode) = LOWER(t2.Mode)
                            WHERE t1.TradeDate::DATE = '${date}' AND t2.TradeDate::DATE = '${date}'
                            GROUP BY t1.TransId
                        ) t
                        INNER JOIN temp_data sos ON t.TransId = sos.TransId
                        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = sos.EmpId
                        WHERE (UM."DSIGNATED" = true OR t."sumTotalPrice" >= '${thresholdAmount}') AND sos.ISIN <> 'INE531F01015'
                        ORDER BY sos.EmpId, sos.ISIN, sos.Mode, sos.TotalPrice, UM."DSIGNATED";

                        -- Create temporary table for approval data
                        CREATE TEMP TABLE tempEIRF AS
                        SELECT
                            EIRF."CRE_DATE" AS ApprovalDate,EIRF."TRX_NO",EIRF."CRE_DATE",EIRF."NatureofTrade" AS NatureOfTrade,EIRF."Requestfor" AS RaisedFor,
                            EIRF."Security" AS ScripName,EIRF."Transaction" AS Mode,EIRF."QuantityLot" AS QuantityLot,e.EqQuantity AS Quantity,"FutOpQuantityLot" AS FutOpQuantity,
                            EIRF."EmployeeNumber" AS EmpId,EIRF."ISIN" AS ISIN
                        FROM (
                            SELECT "Transaction","EmployeeNumber","ISIN",MIN("CRE_DATE") AS CRE_DATE,MIN("TRX_NO") AS TRX_NO,SUM(CAST("EqQuantity" AS numeric)) AS EqQuantity
                            FROM "TBL_IRF_Approval_Data"
                            INNER JOIN "TBL_USER_MST" ON "EMPNO" = "EmployeeNumber"
                            WHERE
                                ("CurrentTradeValue_Greater":: integer = 1 OR "DSIGNATED" = true OR "PreviousTradeValueGreater":: integer = 1) AND
                                "CRE_DATE"::DATE = '${date}' AND
                                "ISIN" IS NOT NULL AND
                                "NatureofTrade" IN ('Equity', 'Special Case', 'Debt') AND
                                "ISIN" <> 'INE531F01015' AND -- Nuvama scrips
                                "ApprovalStatus" = 'Approved' AND
                                ("IEApprovalStatus" = 'Approved' OR "IEApprovalStatus" IS NULL)
                            GROUP BY "Transaction", "EmployeeNumber", "ISIN"
                        ) e
                        INNER JOIN "TBL_IRF_Approval_Data" EIRF ON EIRF."TRX_NO" = e.TRX_NO
                        WHERE
                            "ApprovalStatus" = 'Approved' AND
                            ("IEApprovalStatus" = 'Approved' OR "IEApprovalStatus" IS NULL) AND
                            EIRF."CRE_DATE"::DATE = '${date}'

                            UNION ALL
                        
                        -- For Non-designated with sell Greater than 5 lac but Buy in less than 5 lac
                        SELECT
                            EIRF."CRE_DATE" AS ApprovalDate,EIRF."TRX_NO",EIRF."CRE_DATE",EIRF."NatureofTrade" AS NatureOfTrade,EIRF."Requestfor" AS RaisedFor,
                            EIRF."Security" AS ScripName,EIRF."Transaction" AS Mode,EIRF."QuantityLot" AS QuantityLot,e.EqQuantity AS Quantity,"FutOpQuantityLot" AS FutOpQuantity,
                            EIRF."EmployeeNumber" AS EmpId,EIRF."ISIN" AS ISIN
                        FROM (
                            SELECT "Transaction","EmployeeNumber","ISIN",MIN("CRE_DATE") AS CRE_DATE,MIN("TRX_NO") AS TRX_NO,SUM(CAST("EqQuantity" AS numeric)) AS EqQuantity
                            FROM "TBL_IRF_Approval_Data"
                            WHERE
                                "CRE_DATE"::DATE = '${date}' AND
                                "ISIN" IS NOT NULL AND
                                "NatureofTrade" IN ('Equity', 'Special Case', 'Debt') AND
                                "ISIN" <> 'INE531F01015' AND -- Nuvama scrips
                                "ApprovalStatus" = 'Approved' AND
                                ("IEApprovalStatus" = 'Approved' OR "IEApprovalStatus" IS NULL)
                            GROUP BY "Transaction", "EmployeeNumber", "ISIN"
                        ) e
                        INNER JOIN "TBL_IRF_Approval_Data" EIRF ON EIRF."TRX_NO" = e.TRX_NO
                        INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = EIRF."EmployeeNumber"
                        INNER JOIN (
                            SELECT
                                ISIN,EmpId,TradeDate::DATE AS TradeDate,SUM(TotalPrice) AS TotalPrice,SUM(Quantity) AS TotalQuantity
                                FROM tempSOS
                                WHERE
                                    "DSIGNATED" = false AND
                                    "sumTotalPrice" >= '${thresholdAmount}' AND
                                    LOWER(Mode) = LOWER('Sell')
                                    GROUP BY ISIN, EmpId, TradeDate::DATE
                        ) sos ON sos.EmpID = EIRF."EmployeeNumber" AND sos.ISIN = EIRF."ISIN" AND LOWER(EIRF."Transaction") = LOWER('Sell')
                        WHERE
                            "ApprovalStatus" = 'Approved' AND
                            ("IEApprovalStatus" = 'Approved' OR "IEApprovalStatus" IS NULL) AND
                            UM."DSIGNATED" = false AND
                            "PreviousTradeValueGreater":: integer = 0 AND
                            LOWER(EIRF."Transaction") = LOWER('Sell') AND
                            "CRE_DATE"::DATE = '${date}'
                        ORDER BY "CRE_DATE" DESC;

                        --Create temporary table for No Approval and No Traded Voilation
                        CREATE TEMP TABLE tempNoApprovalVoilation AS
                        SELECT
                            COALESCE(sos.EmpId, eirf.EmpId) AS EmpId,sos.TradeDate,sos.ScripCode,COALESCE(sos.ScripName, eirf.ScripName) AS ScripName,
                            COALESCE(sos.ISIN, eirf.ISIN) AS ISIN,sos.Quantity,sos.TotalPrice,sos."sumTotalPrice",sos."sumQuantity",COALESCE(sos.Mode, eirf.Mode) AS Mode,
                            CASE
                                WHEN eirf."CRE_DATE" IS NOT NULL THEN
                                    CASE
                                        WHEN sos.TradeDate IS NOT NULL THEN
                                            CASE
                                                WHEN(EXTRACT(EPOCH FROM eirf."CRE_DATE" - sos.TradeDate)) > 0 THEN NULL
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
                            sos.TransId,eirf."TRX_NO",eirf.ApprovalDate,eirf.Quantity AS EirfQuantity
                        FROM tempEIRF eirf
                        FULL JOIN tempSOS sos
                        ON eirf.EmpId = sos.EmpId
                        AND eirf.ISIN = sos.ISIN
                        AND LOWER(eirf.Mode) = LOWER(sos.Mode)
                        AND eirf."CRE_DATE":: DATE = sos.TradeDate:: DATE;

                        --is not null
                        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode",
                                "NoApprovalVoil", "NoTraded", "CreatedBy", "CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity")  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, 
                                    src.NoApprovalVoilation,src.NotTradedVoilation, 'System', CURRENT_TIMESTAMP,src."TRX_NO",src.ApprovalDate,src.EirfQuantity
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
                                "EirfId" = src."TRX_NO",
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                "UpdatedBy" = 'System',
                                "UpdatedDate" = CURRENT_TIMESTAMP,
                                "TradeDate" =  src.tradedate::DATE + interval '1 day'        
                                FROM tempNoApprovalVoilation AS src
                                WHERE target."SOSmappingId" = src.transid
                                AND src.transid is not null;
        
                        COMMIT;

                         --is null
                         BEGIN;
        
                         -- Attempt to insert the data
                         INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                         ("EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", "Mode",
                         "NoApprovalVoil", "NoTraded", "CreatedBy", "CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity")  
                         SELECT 
                             src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.scripcode, src.scripname, src.isin, src.quantity, src.totalprice, src.mode, 
                             src.NoApprovalVoilation,src.NotTradedVoilation, 'System', CURRENT_TIMESTAMP,src."TRX_NO",src.ApprovalDate,src.EirfQuantity
                             FROM tempNoApprovalVoilation AS src
                             WHERE src.transid IS NULL
                        AND NOT EXISTS (
                               SELECT 1
                               FROM TEMP_EIRF_Rico_SOS_Processed AS target
                               WHERE target."EirfId" = src."TRX_NO"
                            );
                            COMMIT;
                            BEGIN;
                         -- If a conflict occurs, update the existing row
                         UPDATE TEMP_EIRF_Rico_SOS_Processed AS target
                         SET
                         "NoApprovalVoil" = src.NoApprovalVoilation,
                         "NoTraded" = src.NotTradedVoilation,
                         "EirfId" = src."TRX_NO",
                         "EirfApprovalDate" = src.ApprovalDate,
                         "EirfQuantity" = src.EirfQuantity,
                         "UpdatedBy" = 'System',
                         "UpdatedDate" = CURRENT_TIMESTAMP,
                           "TradeDate" =  src.tradedate::DATE + interval '1 day'
                         FROM tempNoApprovalVoilation AS src
                         WHERE target."EirfId" = src."TRX_NO"
                         AND src.transid is null;
 
                 COMMIT;
 

    --Create temp table if not exists
                            CREATE TEMP TABLE IF NOT EXISTS tempMoreLessVoilation AS(
                            SELECT
                                CASE WHEN(eirf.Quantity - sos."sumQuantity") > 0 THEN 'Less than Approved Violation' END AS LessThanApprovedVoil,
                                CASE WHEN(eirf.Quantity - sos."sumQuantity") < 0 THEN 'Greater than Approved Violation' END AS GreaterThanApprovedVoil,
                                CASE WHEN sos.EmpId IS NULL THEN eirf.EmpId ELSE sos.EmpId END AS EmpId,sos.TradeDate,
                                CASE WHEN sos.ScripName IS NULL THEN eirf.ScripName ELSE sos.ScripName END AS ScripName,
                                CASE WHEN sos.ISIN IS NULL THEN eirf.ISIN ELSE sos.ISIN END AS ISIN,
                                sos.Quantity,sos."sumQuantity",sos.TotalPrice,
                                CASE WHEN sos.Mode IS NULL THEN eirf.Mode ELSE sos.Mode END AS Mode,
                                sos.TransId,eirf."TRX_NO",eirf.ApprovalDate,eirf.Quantity AS EirfQuantity
                            FROM tempEIRF eirf
                            FULL JOIN tempSOS sos ON eirf.EmpId = sos.EmpId AND eirf.ISIN = sos.ISIN AND LOWER(eirf.Mode) = LOWER(sos.Mode) AND eirf."CRE_DATE":: DATE = sos.TradeDate:: DATE
                            );   
                            
                            --For records with TransId not null
                            --is not null
        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ISIN", "ScripName",  "Quantity", "TotalPrice","Mode", "LessthanApprovedVoil", 
                                "GreaterthanApprovedVoil", "CreatedBy","CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity"                                                                                                         )  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.isin,src.scripname,  src.quantity, src.totalprice, src.mode, 
                                    src.LessThanApprovedVoil,src.GreaterThanApprovedVoil, 'System', CURRENT_TIMESTAMP,src."TRX_NO",src.ApprovalDate,src.EirfQuantity
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
                                UPDATE TEMP_EIRF_Rico_SOS_Processed as target 
                                SET
                                    "LessthanApprovedVoil" = src.LessThanApprovedVoil,
                            "GreaterthanApprovedVoil" = src.GreaterThanApprovedVoil,
                                "EirfId" = src."TRX_NO",
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempMoreLessVoilation AS src
                                WHERE target."SOSmappingId" = src.transid
                                AND src.transid is not null;
        
                        COMMIT;


                        --is null
                        --null
                        BEGIN;
        
                                -- Attempt to insert the data
                                INSERT INTO TEMP_EIRF_Rico_SOS_Processed
                                ("EmpId", "SOSmappingId", "TradeDate", "ISIN", "ScripName",  "Quantity", "TotalPrice","Mode", "LessthanApprovedVoil", 
                                "GreaterthanApprovedVoil", "CreatedBy","CreatedDate", "EirfId", "EirfApprovalDate", "EirfQuantity"                                                                                                         )  
                                SELECT 
                                    src.empid,src.transid, src.tradedate::DATE + interval '1 day' AS "TradeDate" , src.isin,src.scripname,  src.quantity, src.totalprice, src.mode, 
                                    src.LessThanApprovedVoil,src.GreaterThanApprovedVoil, 'System', CURRENT_TIMESTAMP,src."TRX_NO",src.ApprovalDate,src.EirfQuantity
                                FROM tempMoreLessVoilation AS src
                                WHERE src.transid IS NULL
                        AND NOT EXISTS (
                               SELECT 1
                               FROM TEMP_EIRF_Rico_SOS_Processed AS target
                               WHERE target."EirfId" = src."TRX_NO"
                            );
                            COMMIT;
                               BEGIN;
                                -- If a conflict occurs, update the existing row
                                UPDATE TEMP_EIRF_Rico_SOS_Processed as target
                                SET
                                    "LessthanApprovedVoil" = src.LessThanApprovedVoil,
                            "GreaterthanApprovedVoil" = src.GreaterThanApprovedVoil,
                                "EirfId" = src."TRX_NO",
                                "EirfApprovalDate" = src.ApprovalDate,
                                "EirfQuantity" = src.EirfQuantity,
                                    "UpdatedBy" = 'System',
                                    "UpdatedDate" = CURRENT_TIMESTAMP,
                                    "TradeDate" =  src.tradedate::DATE + interval '1 day'
        
                                FROM tempMoreLessVoilation AS src
                                WHERE target."EirfId" = src."TRX_NO"
                                AND src.transid is null;
        
                        COMMIT;

            

                            
                        
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
            return `('${row.EmpId}', '${row.PanNo}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'} , '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
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

                        DROP TABLE IF EXISTS tempRestrictedVoilation;

                        CREATE TEMP TABLE tempRestrictedVoilation AS
                        SELECT 
                            SOS.*,
                            CASE WHEN res."ISIN" IS NULL THEN NULL ELSE 'Restricted list Violation' END AS restrictedlistvoil
                        FROM temp_data SOS
                        INNER JOIN "TBL_USER_MST" EMP ON EMP."EMPNO" = SOS.EmpId
                        LEFT JOIN "TBL_RESTRICTED_LIST_MST" res ON res."ISIN" = SOS.ISIN
                        AND "IS_ACTIVE"= true AND '${date}' BETWEEN res."STARTDATE"::DATE AND COALESCE(res."ENDDATE"::DATE, '${date}')
                        WHERE EMP."DSIGNATED" = true AND SOS.TradeDate::DATE = '${date}'
                        AND SOS.ISIN <> 'INE531F01015';

                        BEGIN;
                        -- Perform the UPSERT operation on the target table
                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed(
                            "EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", 
                            "Mode", "RestrictedListVoil", "CreatedBy", "CreatedDate"
                        )
                        SELECT
                            src.EmpId, src.TransId,src.TradeDate::DATE + interval '1 day' AS "TradeDate", src.ScripCode, src.ScripName, src.ISIN, src.Quantity, src.TotalPrice, 
                            src.Mode, src.restrictedlistvoil, 'System', CURRENT_TIMESTAMP
                        FROM tempRestrictedVoilation src
                        WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;

                        -- If a conflict occurs, update the existing row
                        UPDATE TEMP_EIRF_Rico_SOS_Processed  as target                       
                        SET
                        "RestrictedListVoil" = src.restrictedlistvoil,
                        "UpdatedBy" = 'System',
                        "UpdatedDate" = CURRENT_TIMESTAMP,
                        "TradeDate" =  src.tradedate::DATE + interval '1 day'
                        FROM tempRestrictedVoilation AS src
                        WHERE target."SOSmappingId" = src.transid;

                        COMMIT;

                        DROP TABLE temp_data; 
                    `;

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

                        DROP TABLE IF EXISTS tempGreyListVoilation;

                        CREATE TEMP TABLE tempGreyListVoilation AS
                        SELECT 
                            SOS.*, 
                            GL.*,
                            CASE WHEN GL."ISIN" IS NULL THEN NULL ELSE 'Grey List Violation' END AS GreyListVoil
                        FROM temp_data SOS
                        INNER JOIN "TBL_USER_MST" EMP ON EMP."EMPNO" = SOS.EmpId
                        LEFT JOIN "TBL_GREY_LIST_MST" GL ON GL."ISIN" = SOS.ISIN
                        AND GL."IS_ACTIVE" = true 
                        AND '${date}' BETWEEN GL."STARTDATE"::DATE AND COALESCE(GL."ENDDATE"::DATE, '${date}')
                        WHERE 
                            EMP."GREYLIST" = true 
                            AND EMP."DSIGNATED" = true
                            AND SOS.TradeDate::DATE = '${date}'
                            AND SOS.ISIN <> 'INE531F01015';

                        BEGIN;
                        INSERT INTO TEMP_EIRF_Rico_SOS_Processed(
                            "EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", 
                            "Mode", "GreyListVoil", "CreatedBy", "CreatedDate"
                                
                        )
                        SELECT
                            src.EmpId, src.TransId, src.TradeDate::DATE + interval '1 day' AS "TradeDate", src.ScripCode, src.ScripName, src.ISIN, src.Quantity, src.TotalPrice, 
                            src.Mode, src.GreyListVoil, 'System', CURRENT_TIMESTAMP
                        FROM tempGreyListVoilation src
                        WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;

                        -- If a conflict occurs, update the existing row
                        UPDATE TEMP_EIRF_Rico_SOS_Processed as target 
                        SET
                            "GreyListVoil" = src.GreyListVoil,
                            "UpdatedBy" = 'System',
                            "UpdatedDate" = CURRENT_TIMESTAMP,
                            "TradeDate" =  src.tradedate::DATE + interval '1 day'
                        FROM tempGreyListVoilation AS src
                        WHERE target."SOSmappingId" = src.transid;
                        COMMIT;
                                                    

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
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
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

                    DROP TABLE IF EXISTS tempUPSIProj;
                    DROP TABLE IF EXISTS tempUPSIProjFinal;

                    -- Create temporary tables
                    CREATE TEMP TABLE tempUPSIProj AS
                    --check in upload file
                    SELECT SE."ISIN", PE."EMPLOYEE_ID" AS EmpNo, PE."CREATED_ON" AS CreatedDate
                    FROM "TBL_UPSI_PROJECT_MST" PD
                    INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                    INNER JOIN "TBL_PROJECT_EMPLOYEE_DETAILS" PE ON PD."ID" = PE."PROJECT_ID"
                    WHERE PD."IS_ACTIVE" = true AND PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015'

                    UNION

                    -- check in upsi mst
                    SELECT SE."ISIN", AD."EMPLOYEE_ID" AS EmpNo, AD."CREATED_ON" AS CreatedDate
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
                    SELECT SE."ISIN", PE."EMPLOYEE_ID" AS EmpNo, PE."CREATED_ON" AS CreatedDate
                    FROM "TBL_UPSI_PROJECT_MST" PD
                    INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                    INNER JOIN "TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA" PE ON PD."ID"  = PE."PROJECT_ID"
                    WHERE 
                    PD."IS_ACTIVE" = true AND 
                    PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015'

                    UNION
                    
                    --check in accesstype
                    SELECT SE."ISIN", PE."EMPNO" AS EmpNo, PE."CREATED_ON" AS CreatedDate
                    FROM "TBL_UPSI_PROJECT_MST" PD
                    INNER JOIN "TBL_UPSI_PROJECT_SCRIPT_DETAILS" SE ON PD."ID" = SE."PROJECT_ID" 
                    INNER JOIN "TBL_UPSI_EMPLOYEE_DETAILS" PE ON PD."ID" = PE."PROJECT_ID"
                    WHERE PD."IS_ACTIVE" = true AND PE."IS_ACTIVE" = true AND SE."IS_ACTIVE" = true AND SE."ISIN" <> 'INE531F01015';

                    -- Create final temporary table
                    CREATE TEMP TABLE tempUPSIProjFinal AS
                    SELECT SOS.*, CASE WHEN UP."ISIN" IS NULL THEN NULL ELSE 'UPSI Project Violation' END AS UCLListVoil
                    FROM temp_data SOS
                    INNER JOIN tempUPSIProj UP ON UP."ISIN" = SOS.ISIN AND UP.EmpNo = SOS.EmpId
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = SOS.EmpId
                    WHERE UM."ISACTIVE" = true
                    AND SOS.TradeDate::DATE = '${date}'
                    AND SOS.TradeDate > UP.CreatedDate:: DATE
                    AND SOS.ISIN <> 'INE531F01015';

                    BEGIN;
                    -- Merge into the target table
                    INSERT INTO TEMP_EIRF_Rico_SOS_Processed(
                        "EmpId", "SOSmappingId", "TradeDate", "ScripCode", "ScripName", "ISIN", "Quantity", "TotalPrice", 
                        "Mode", "UcLlistVoil", "CreatedBy", "CreatedDate"       
                    )
                    SELECT
                        src.EmpId, src.TransId, src.TradeDate::DATE + interval '1 day' AS "TradeDate", src.ScripCode, src.ScripName, 
                        src.ISIN, src.Quantity, src.TotalPrice, src.Mode, src.UCLListVoil, 'System', NOW()
                    FROM tempUPSIProjFinal src
                    WHERE src.transid IS NOT NULL
                                AND NOT EXISTS (
                                  SELECT 1
                                  FROM TEMP_EIRF_Rico_SOS_Processed AS target
                                  WHERE target."SOSmappingId" = src.transid
                                );
                                COMMIT;
                                 BEGIN;

                    -- If a conflict occurs, update the existing row
                    UPDATE TEMP_EIRF_Rico_SOS_Processed as target                    
                    SET
                        "UcLlistVoil" = target."UcLlistVoil" || ' ; ' || src.UCLListVoil,
                        "UpdatedBy" = 'System',
                        "UpdatedDate" = CURRENT_TIMESTAMP,
                        "TradeDate" =  src.tradedate::DATE + interval '1 day'
                        FROM tempUPSIProjFinal AS src
                        WHERE target."SOSmappingId" = src.transid;
                        COMMIT;

                         BEGIN;
                        UPDATE TEMP_EIRF_Rico_SOS_Processed a
                        SET "NoTraded" = null, "UpdatedDate" = CURRENT_DATE, "UpdatedBy" = 'System-A'
                        FROM temp_data b
                        WHERE 
                            a."EmpId" = b.EmpId 
                            AND a."ISIN" = b.ISIN 
                            AND LOWER(a."Mode") = LOWER(b.Mode) 
                            AND (a."EirfApprovalDate":: DATE + interval '2 day')::DATE = b.TradeDate:: DATE
                            AND a."NoTraded" = 'Approval taken but not traded'
                            AND a."ISIN" IS NOT NULL 
                            AND a."ISIN" <> 'INE531F01015' 
                            AND a."ISIN" <> ''
                            AND (a."EirfApprovalDate":: DATE + interval '2 day')::DATE = '${date}'  OR b.TradeDate::DATE = '${date}';
                            COMMIT;

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
            return `('${row.EmpId}', '${row.PanNo}', ${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'}, '${row.Exch}', '${row.AccCode}', '${row.AccName}', '${row.ScripCode}', '${row.ScripName}', ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}', '${row.CreatedBy}', ${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'}, ${row.UpdatedBy ? `'${row.UpdatedBy}'` : 'null'}, ${row.UpdatedDate ? `'${row.UpdatedDate.toISOString().split('T')[0]}'` : 'null'}, '${row.ISIN}', ${row.OpenQuantity}, '${row.TradedBy}', '${row.StrikePrice}', ${row.ExpiryDate ? `'${row.ExpiryDate.toISOString().split('T')[0]}'` : 'null'}, '${row.OptionType}', '${row.TransId}')`;
        }).join(', ');

        const valuesPart1 = Data8.map(row => {
            // const formattedDate = row.TradeDate.toISOString().split('T')[0];
            return `(${row.TransId}, '${row.EmpId}',${row.TradeDate ? `'${row.TradeDate.toISOString().split('T')[0]}'` : 'null'},'${row.ScripCode}', '${row.ScripName}', '${row.ISIN}', 
            ${row.Quantity}, ${row.TotalPrice}, '${row.Mode}',${row.SOSmappingId},'${row.EirfId}',${row.EirfApprovalDate ? `'${row.EirfApprovalDate.toISOString().split('T')[0]}'` : 'null'},
            ${row.EirfQuantity},'${row.IntradayVoil}','${row.NoApprovalVoil}','${row.GreaterthanApprovedVoil}', 
            '${row.LessthanApprovedVoil}', '${row.HoldingVoil}', '${row.RestrictedListVoil}', '${row.GreyListVoil}', 
            '${row.UcLlistVoil}', '${row.NoTraded}','${row.CreatedBy}',${row.CreatedDate ? `'${row.CreatedDate.toISOString().split('T')[0]}'` : 'null'})`;
        }).join(', ');

        // '${formattedDate}',


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
                    DROP TABLE IF EXISTS TempBuy;
                    DROP TABLE IF EXISTS TempSell;
                    DROP TABLE IF EXISTS Master;
                    DROP TABLE IF EXISTS tempHolding;
                    DROP TABLE IF EXISTS TempSellNonDesg;
                    DROP TABLE IF EXISTS tempbuyNonDesg;

                    -- Create TempBuy table
                    CREATE TEMP TABLE TempBuy AS
                    SELECT 
                        EmpId,TradeDate as TradeDate,ISIN,Quantity as Quantity,TotalPrice as TotalPrice,
                        ABS((TradeDate::date - current_date::date)::integer) AS DaysDiff,
                       -- (TradeDate::date - current_date::date)::integer AS DaysDiff,
                        --EXTRACT(DAY FROM (TradeDate::date - current_date::date)) AS DaysDiff,
                        --EXTRACT(DAY FROM (TradeDate::date - '${date}'::date)) AS DaysDiff,
                        'Buy' AS Mode,TransId as TransId,OpenQuantity AS OpenQuantity 
                    FROM  temp_data
                    WHERE 
                        ISIN IS NOT NULL
                        AND LOWER(Mode) = LOWER('Buy') 
                        AND ISIN <> 'INE531F01015'
                        AND OpenQuantity > 0 
                        AND TradeDate::date <= '${date}'
                    ORDER BY TradeDate;

                    --For Non Designation with (sell less than 5 lac Or greater than 5 Lac) and buy more than 5 lac
                    -- Create temp_4
                    CREATE TEMP TABLE temp_4 AS
                    SELECT 
                        TotalPrice,Quantity,TradeDate,TransId,EmpId,ISIN,Mode
                    FROM  temp_data
                    WHERE 
                        TradeDate::date = '${date}';

                    --Create temp_5
                    CREATE TEMP TABLE temp_5 AS
                    SELECT * FROM temp_4;

                    --Create temp_6
                    CREATE TEMP TABLE temp_6 AS
                    SELECT
                        SUM(t2.TotalPrice) as sumTotalPrice,
                        SUM(t2.Quantity) as sumQuantity,
                        MIN(t1.TradeDate) as TradeDate,
                        t1.TransId
                    FROM temp_4 t1
                    INNER JOIN temp_5 t2 ON t1.EmpId = t2.EmpId AND t1.ISIN = t2.ISIN AND LOWER(t1.Mode) = LOWER(t2.Mode)
                    GROUP BY t1.TransId;

                    --Create TempSellNonDesg
                    CREATE TEMP TABLE TempSellNonDesg AS
                    SELECT 
                        map.EmpId,map.TradeDate AS TradeDate,map.ISIN,map.Quantity as Quantity,map.TotalPrice as TotalPrice,
                        'Sell' as Mode,map.TransId as TransId,temp.sumTotalPrice,UM."DSIGNATED"
                    FROM temp_data map
                    INNER JOIN temp_6 as temp ON map.TransId = temp.TransId
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = map.EmpId
                    WHERE
                        map.ISIN IS NOT NULL
                        AND LOWER(map.Mode) = LOWER('Sell') 
                        AND map.TradeDate:: date = '${date}'
                        AND UM."DSIGNATED" = false
                    ORDER BY map.TradeDate;

                    --Create Temp_7
                    CREATE TEMP TABLE Temp_7 AS
                    SELECT
                        map.EmpId,map.TradeDate AS TradeDate,map.ISIN,map.Quantity as Quantity,map.TotalPrice as TotalPrice,
                        'Sell' as Mode,map.TransId as TransId,temp.sumTotalPrice,UM."DSIGNATED"
                    FROM temp_data map
                    INNER JOIN temp_6 as temp ON map.TransId = temp.TransId
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = map.EmpId
                    WHERE
                        map.ISIN IS NOT NULL
                        AND LOWER(map.Mode) = LOWER('Sell') 
                        AND map.TradeDate:: date = '${date}'
                        AND UM."DSIGNATED" = true
                    ORDER BY map.TradeDate;

                    --Drop tables
                    DROP TABLE temp_4;
                    DROP TABLE temp_5;
                    DROP TABLE temp_6;


                    --Create tempbuyNonDesg
                    CREATE TEMP TABLE tempbuyNonDesg AS
                    SELECT
                        EmpId,ISIN,TradeDate:: date as TradeDate,SUM(Quantity) AS SumQuantity,SUM(TotalPrice) AS SumTotalPrice,
                        SUM(OpenQuantity) AS SumOpenQuantity,'Buy' AS Mode
                    FROM TempBuy buy
                    INNER JOIN "TBL_USER_MST" UM ON UM."EMPNO" = buy.EmpId
                    WHERE
                        UM."DSIGNATED" = false
                    GROUP BY EmpId, ISIN, TradeDate:: date
                    HAVING
                        SUM(TotalPrice) >= '${thresholdAmount}'
                    ORDER BY TradeDate:: date;

                    --End For Non Designation with sell less than 5 lac and buy more than 5 lac


                    --For Designated
                    -- Create TempSell
                    CREATE TEMP TABLE TempSell AS
                    SELECT 
                        tmp.EmpId,tmp.TradeDate::date AS TradeDate,tmp.ISIN,tmp.Quantity as Quantity,tmp.TotalPrice AS TotalPrice,
                        'Sell' AS Mode,tmp.TransId AS TransId,tmp.sumTotalPrice
                    FROM
                        (
                            SELECT 
                                EmpId,TradeDate,ISIN,Quantity,TotalPrice,Mode,TransId,sumTotalPrice
                            FROM Temp_7
                             
                            --For Non Designation with sell less than 5 lac and buy more than 5 lac
                            UNION ALL

                            SELECT 
                                EmpId,TradeDate,ISIN,Quantity,TotalPrice,'Sell' AS Mode,TransId,sumTotalPrice
                            FROM
                                (
                                    SELECT *,
                                        (SELECT TradeDate FROM tempbuyNonDesg  WHERE EmpId = sell.EmpId AND ISIN = sell.ISIN ORDER BY TradeDate LIMIT 1) AS BuyTradeDate
                                    FROM TempSellNonDesg sell 
                                ) t
                            WHERE BuyTradeDate IS NOT NULL
                        ) tmp
                    ORDER BY TradeDate;

                    -- Drop table Temp_7
                    DROP TABLE Temp_7;
                    --End For Non Designation with sell less than 5 lac and buy more than 5 lac


                    DO $$ 
                    DECLARE
                    sell_TransId bigint;
                    sell_EmpId varchar(50);
                    sell_TradeDate timestamp;
                    sell_ISIN varchar(20);
                    sell_Quantity bigint;
                    sell_Mode varchar(10);
                    sell_TotalPrice decimal(18, 2);
                    sell_PreQuantity bigint;
                
                    buy_TransId bigint;
                    buy_EmpId varchar(50);
                    buy_TradeDate timestamp;
                    buy_ISIN varchar(20);
                    buy_Quantity bigint;
                    buy_OpenQuantity bigint;
                    buy_Mode varchar(10);
                    buy_TotalPrice decimal(18, 2);
                    buy_PreQuantity bigint;
                BEGIN
                    -- Sell cursor
                    FOR sell_TransId, sell_EmpId, sell_TradeDate, sell_ISIN, sell_Quantity, sell_Mode, sell_TotalPrice IN 
                        SELECT TransId, EmpId, TradeDate, ISIN, Quantity, Mode, TotalPrice FROM TempSell ORDER BY TradeDate
                    LOOP
                        -- Buy cursor
                        FOR buy_TransId, buy_EmpId, buy_TradeDate, buy_ISIN, buy_Quantity, buy_Mode, buy_TotalPrice, buy_OpenQuantity IN 
                            SELECT TransId, EmpId, TradeDate, ISIN, Quantity, Mode, TotalPrice, OpenQuantity 
                            FROM TempBuy  
                            WHERE EmpId = sell_EmpId AND ISIN = sell_ISIN AND OpenQuantity > 0 
                            ORDER BY TradeDate
                        LOOP
                            -- Your logic here for reconciliation
                            IF (buy_OpenQuantity - sell_Quantity >= 0) THEN
                                -- Logic when buy quantity is greater than or equal to sell quantity
                                INSERT INTO TEMP_EIRF_RICO_Trades_KnockOff("EmpmapBuy_Id", "EmpmapSell_Id", "BeforeUpdateQuantity", "AfterUpdateQuantity", "KnockoffDate", "SellQuantity")
                                VALUES (buy_TransId, sell_TransId, buy_OpenQuantity, buy_OpenQuantity - sell_Quantity, CURRENT_DATE, sell_Quantity);
                
                                UPDATE TempBuy SET OpenQuantity = buy_OpenQuantity - sell_Quantity WHERE TransId = buy_TransId;
                
                                sell_Quantity := 0;
                
                                IF (ABS(EXTRACT(DAY FROM buy_TradeDate - sell_TradeDate)) < 30) THEN
                                    UPDATE TEMP_EIRF_Rico_SOS_Processed SET "HoldingVoil" = 'Holding Violation ' WHERE "SOSmappingId" = sell_TransId;
                                END IF;
                            ELSE
                                -- Logic when sell quantity is greater than buy quantity
                                INSERT INTO TEMP_EIRF_RICO_Trades_KnockOff("EmpmapBuy_Id", "EmpmapSell_Id", "BeforeUpdateQuantity", "AfterUpdateQuantity", "KnockoffDate", "SellQuantity")
                                VALUES (buy_TransId, sell_TransId, buy_OpenQuantity, 0, CURRENT_DATE, sell_Quantity);
                
                                UPDATE TempBuy SET OpenQuantity = 0 WHERE TransId = buy_TransId;
                
                                sell_Quantity := sell_Quantity - buy_OpenQuantity;
                            END IF;
                        END LOOP;
                    END LOOP;

                    -- Update SOS table
                    UPDATE temp_data sos
                    SET OpenQuantity = temp.OpenQuantity, UpdatedDate = NOW()
                    FROM TempBuy temp
                    WHERE temp.TransId = sos.TransId;

                    --del
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

                    

                    -- Drop temporary tables
                        DROP TABLE temp_data;
                        --DROP TABLE IF EXISTS TEMP_EIRF_Rico_SOS_Processed;
                        --DROP TABLE IF EXISTS TEMP_EIRF_Rico_SOS_Processed;
                        --DROP TABLE IF EXISTS TEMP_EIRF_RICO_Trades_KnockOff;

                    -- Log entry
                    INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                    VALUES ('${date}', 0, 'Trade Reconciliation successfully done for NSE-BSE', CURRENT_TIMESTAMP);

                END $$;


        `;

        const result = await connect.sequelize.query(query);


    } catch (error) {
        const errMsg = error.message;
        console.error('Error in holding:', errMsg);
    }
}

async function eirfRicoReconLogic(date) {
    try {

        const query = ` CREATE TEMP TABLE TEMP_EIRF_Rico_SOS_Emp_Mapping AS
                        SELECT * FROM "eirf_rico_sos_emp_mapping";

                        CREATE TEMPORARY TABLE TEMP_EIRF_Rico_SOS_Processed AS
                        SELECT * FROM "eirf_rico_sos_processed" WHERE false;

                        CREATE TEMPORARY TABLE TEMP_EIRF_RICO_Trades_KnockOff AS
                        SELECT * FROM "eirf_rico_trades_knockoff" WHERE false;
                        
                        -- Insert a log entry
                        INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
                        VALUES ('${date}', 1, 'Trade Reconciliation started for NSE-BSE', CURRENT_TIMESTAMP);`;

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
            return formattedDate === date;

        });

        if (!hasMatchingRow) {

            console.log(`No rows found with TradeDate equal to ${date}`);
            const EmailId = 'rinkal@neweltechnologies.com';
            const msg = 'Trade Reconciliation could not be proceess due to Trade data unavailiblity in SOS Employee mapping table ' + date;
            await sendEmail(EmailId, `Reminder - Trade Reconciliation Failed for- ${date}`, msg);

        } else {

            function countRowsWithTradeDate(data, targetDate) {
                const count = data.filter(row => {

                    const formattedDate1 = row.TradeDate.toISOString().split('T')[0]
                    console.log("formattedDate1", formattedDate1);

                    return formattedDate1 === targetDate;
                }).length;

                return count;
            }

            const resultCount = countRowsWithTradeDate(Data, date);
            console.log("resultCount", resultCount);
            // 900

            if (resultCount > 2000) {

                const EmailId = 'rinkal@neweltechnologies.com';
                const msg1 = 'Data exceeds the expected limit for the day. Total count : ' + resultCount;
                await sendEmail(EmailId, `Reminder - Data exceeds for - ${date}`, msg1);

            } else {
                console.log("Data not Exceeds.");
                await intraday_check(Data, date, Data2);
                const query4 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result4 = await connect.sequelize.query(query4);
                const Data4 = result4[0]; 
                console.log("count",Data4.length)                              

                await noApprovalCases(date, thresholdAmount, Data, Data4);
                const query5 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result5 = await connect.sequelize.query(query5);
                const Data5 = result5[0];                
                console.log("count",Data5.length)

                await restrictedlistCheck(Data, date, Data5);
                const query6 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result6 = await connect.sequelize.query(query6);
                const Data6 = result6[0];                
                console.log("count",Data6.length)

                await greylistCheck(Data, date, Data6);
                const query7 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result7 = await connect.sequelize.query(query7);
                const Data7 = result7[0];                
                console.log("count",Data7.length)

                await UPSIProjectCheck(Data, date, Data7);
                const query8 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result8 = await connect.sequelize.query(query8);
                const Data8 = result8[0];                
                console.log("count",Data8.length)

                await HoldingCheck(Data, date, Data8, thresholdAmount);
                const query9 = `select * from TEMP_EIRF_Rico_SOS_Processed`;
                const result9 = await connect.sequelize.query(query9);
                const Data9 = result9[0];
                console.log("count",Data9.length)
                console.log("Data9", Data9);
                const query10 = `select * from TEMP_EIRF_RICO_Trades_KnockOff`;
                const result10 = await connect.sequelize.query(query10);
                const Data10 = result10[0];
                // console.log("Data10", Data10);

            }

        }

    } catch (error) {
        const errMsg = error.message;
        console.error('Error in eirfRicoReconLogic:', errMsg);
        // const currentDate = new Date();
        const errquery = `INSERT INTO "eirf_rico_tr_log_backdated_entry"("TradeDate", "ReconStatus", "StatusMessage", "CreatedDate")
        VALUES ('${date}', 0, '${errMsg}', CURRENT_TIMESTAMP);`;
        await connect.sequelize.query(errquery, [date, errMsg]);
    }
}


// Call the main function
module.exports.eirfRicoReconLogic = eirfRicoReconLogic;
