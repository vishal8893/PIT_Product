var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var connect = require('../../Data/Connect');
var sequelize = connect.Sequelize;
const configFile = require('../../Config');
const newMail = require('../../Common/NewMailer');
const fs = require('fs');
const path = require("path");


// Function to query data
async function GetUserDetailsAutomate(EmpID) {
    try {

        const query = `
            BEGIN;

            --For Trade Recon
                -- Update entity code
                DO $$ 
                    BEGIN

                    -- Drop temporary table if it exists
                    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'tempentity') THEN
                        DROP TABLE tempentity;
                    END IF;  
                                     
                    -- Create temporary table
                    CREATE TEMP TABLE tempentity AS
                    SELECT DISTINCT "ENTITY", "ENTITY_CODE" FROM "TBL_HRMS_EMPLOYEE_INFORMATION";

                    -- Update EIRF_UPSI_ENTITYEMPLOYEEMaterialsubsidiaryMAPPING
                    --UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    --SET a."ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --WHERE a.EntityName = b."ENTITY" AND COALESCE(a."ENTITY_ID", '') = '';                    

                    --UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    --SET "ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE" 
                    --WHERE c."ENTITY_NAME" = b."ENTITY"
                    --AND COALESCE("ENTITY_ID", '') = '';

                    UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    SET "ENTITY_ID" = b."ENTITY_CODE"::bigint
                    FROM (
                        SELECT a."ENTITY_ID", c."ENTITY_NAME"
                        FROM "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                        JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE"
                        WHERE COALESCE(a."ENTITY_ID"::varchar, '') = ''
                    ) AS a_temp    
                    JOIN tempentity AS b 
                    on a_temp."ENTITY_NAME" = b."ENTITY"
                    WHERE COALESCE(a."ENTITY_ID"::varchar, '') = '';

                    -- Update EIRF_UPSI_ENTITYEMPLOYEEMaterialsubsidiaryMAPPING for MaterialsubsidiaryNameCode
                    --UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    --SET a."MATERIAL_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --WHERE a.MaterialsubsidiaryName = b."ENTITY" AND COALESCE(a."MATERIAL_ID", '') = '';
                    --UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    --SET a."MATERIAL_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --JOIN "TBL_MATERIALSUBSIDIARY_MST" AS c ON a."MATERIAL_ID"::varchar = c."MATERIALSUBSIDIARY_CODE" 
                    --WHERE c."MATERIALSUBSIDIARY_NAME" = b."ENTITY"
                    --AND COALESCE(a."MATERIAL_ID", '') = '';

                    UPDATE "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                    SET "MATERIAL_ID" = b."ENTITY_CODE"::bigint
                    FROM (
                        SELECT a."MATERIAL_ID", c."MATERIALSUBSIDIARY_NAME"
                        FROM "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" AS a
                        JOIN "TBL_MATERIALSUBSIDIARY_MST" AS c ON a."MATERIAL_ID"::varchar = c."MATERIALSUBSIDIARY_CODE"
                        WHERE COALESCE(a."MATERIAL_ID"::varchar, '') = ''
                    ) AS a_temp    
                    JOIN tempentity AS b 
                    on a_temp."MATERIALSUBSIDIARY_NAME" = b."ENTITY"
                    WHERE COALESCE(a."MATERIAL_ID"::varchar, '') = '';

                    -- Update EIRF_UPSI_ENTITYEMPLOYEEMAPPING
                   -- UPDATE "TBL_ENTITY_CEO_BH_MAPPING_MST" AS a
                    --SET a."ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --WHERE a.EntityName = b."ENTITY" AND COALESCE(a."ENTITY_ID", '') = '';
                    --UPDATE "TBL_ENTITY_CEO_BH_MAPPING_MST" AS a
                    --SET a."ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE" 
                    --WHERE c."ENTITY_NAME" = b."ENTITY" AND COALESCE(a."ENTITY_ID", '') = '';

                    UPDATE "TBL_ENTITY_CEO_BH_MAPPING_MST" AS a
                    SET "ENTITY_ID" = b."ENTITY_CODE"::bigint
                    FROM (
                        SELECT a."ENTITY_ID", c."ENTITY_NAME"
                        FROM "TBL_ENTITY_CEO_BH_MAPPING_MST" AS a
                        JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE"
                        WHERE COALESCE(a."ENTITY_ID"::varchar, '') = ''
                    ) AS a_temp    
                    JOIN tempentity AS b 
                    on a_temp."ENTITY_NAME" = b."ENTITY"
                    WHERE COALESCE(a."ENTITY_ID"::varchar, '') = '';

                    -- Update EIRF_DESIGUSER_ENTITYEMPLOYEEMAPPING                    
                    --UPDATE "TBL_DESGINATED_CEO_BH_MAPPING_MST" AS a
                    --SET a."ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --WHERE a.EntityName = b."ENTITY" AND COALESCE(a."ENTITY_ID", '') = '';
                    --UPDATE "TBL_DESGINATED_CEO_BH_MAPPING_MST" AS a
                    --SET a."ENTITY_ID" = b."ENTITY_CODE"
                    --FROM tempentity AS b
                    --JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE" 
                    --WHERE c."ENTITY_NAME" = b."ENTITY" AND COALESCE(a."ENTITY_ID", '') = '';

                    UPDATE "TBL_DESGINATED_CEO_BH_MAPPING_MST" AS a
                    SET "ENTITY_ID" = b."ENTITY_CODE"::bigint
                    FROM (
                        SELECT a."ENTITY_ID", c."ENTITY_NAME"
                        FROM "TBL_DESGINATED_CEO_BH_MAPPING_MST" AS a
                        JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE"
                        WHERE COALESCE(a."ENTITY_ID"::varchar, '') = ''
                    ) AS a_temp    
                    JOIN tempentity AS b 
                    on a_temp."ENTITY_NAME" = b."ENTITY"
                    WHERE COALESCE(a."ENTITY_ID"::varchar, '') = ''; 

                END $$;


                -- Truncate table
                TRUNCATE TABLE "TBL_USER_MST_FOR_TRADERECO";

                -- Insert into EIRF_USER_MASTER_FOR_TradeReco                
                INSERT INTO "TBL_USER_MST_FOR_TRADERECO"("EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST","TRADEREMAILIDS",
                    "ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI",
                    "ISETLI","ENTRYTYPE","ISGM","ENTITY","PANCARDNO","ENTITYDESIGN","SBU","SLOB","EMPJOINDATE",
                    "BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED")
                SELECT "EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST","TRADEREMAILIDS",
                    "ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY",CURRENT_TIMESTAMP AS "CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI",
                    "ISETLI","ENTRYTYPE","ISGM","ENTITY","PANCARDNO","ENTITYDESIGN","SBU","SLOB","EMPJOINDATE",
                    "BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED"
                FROM "TBL_USER_MST";


                CREATE TEMP TABLE Temp_Emp AS
                SELECT * FROM (
                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE ("DESIGNATION_NAME" IN ('CEO & MD', 'Executive Director & Group COO', 'Executive Director', 'President and CFO', 'President and CEO Insurance', 'President', 'Senior Executive Vice President', 'Executive Vice President', 'Senior Vice President') OR 
                        "EXTERNAL_DESIGNATION" IN ('CEO & MD', 'Executive Director & Group COO', 'Executive Director', 'President and CFO', 'President and CEO Insurance', 'President', 'Senior Executive Vice President', 'Executive Vice President', 'Senior Vice President')) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'  
                    AND "RA_ID" IN (SELECT "EMP_ID" FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "RA_ID" IN ('20921') AND "EMP_ACTIVE_HRM_FLG" = true) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%' 
                    AND "RA_ID" IN ('20921') 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'  
                    AND "RA_ID" IN (SELECT "EMP_ID" FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "RA_ID" IN ('03026') AND "EMP_ACTIVE_HRM_FLG" = true) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%' 
                    AND "RA_ID" IN ('03026') 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'  
                    AND "RA_ID" IN (SELECT "EMP_ID" FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "RA_ID" IN ('03306') AND "EMP_ACTIVE_HRM_FLG" = true) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%' 
                    AND "RA_ID" IN ('03306') 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'  
                    AND "RA_ID" IN (SELECT "EMP_ID" FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "RA_ID" IN ('01211') AND "EMP_ACTIVE_HRM_FLG" = true) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%' 
                    AND "RA_ID" IN ('01211') 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'  
                    AND "RA_ID" IN (SELECT "EMP_ID" FROM "TBL_HRMS_EMPLOYEE_INFORMATION" WHERE "RA_ID" IN ('02478') AND "EMP_ACTIVE_HRM_FLG" = true) 
                    AND "EMP_ACTIVE_HRM_FLG" = true

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer') 
                    AND "EMP_ID" NOT LIKE '%[A-Z]%' 
                    AND "RA_ID" IN ('02478') 
                    AND "EMP_ACTIVE_HRM_FLG" = true
                    AND "CLUSTER" = 'Wealth Management' 

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE ("EXTERNAL_DESIGNATION" LIKE '%head%' OR "EXTERNAL_DESIGNATION" LIKE '%Head%')
                    AND "EMP_ACTIVE_HRM_FLG" = true
                    AND "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer')

                    UNION

                    SELECT DISTINCT "EMP_ID", "LOGIN_ID", "ENTITY"
                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION"
                    WHERE "EMP_ACTIVE_HRM_FLG" = true
                    AND (
                        "SBU" IN (SELECT DISTINCT "FUNCTIONS" FROM "TBL_DP_HOLDING_EMP_DATA" WHERE COALESCE("FUNCTIONS", '') <> '')
                        OR "LOB" IN (SELECT DISTINCT "FUNCTIONS" FROM "TBL_DP_HOLDING_EMP_DATA" WHERE COALESCE("FUNCTIONS", '') <> '')
                    )
                    AND "TYPE_OF_EMPLOYMENT" IN ('Permanent', 'Intern', 'Retainer')
                    AND "EMP_ID" NOT LIKE '%[A-Z]%'
                ) AS t;


                TRUNCATE TABLE "TBL_USER_MASTER_AUTOMATE";


                INSERT INTO "TBL_USER_MASTER_AUTOMATE"("EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST","TRADEREMAILIDS",
                    "ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI",
                    "ISETLI","ENTRYTYPE","ISGM","ENTITY","PANCARDNO","ENTITYDESIGN","DESIGNATION","SBU","SLOB","EMPJOINDATE",
                    "BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED")
                SELECT
                    SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) AS "EMPNO", 
                    "EMP_FULL_NAME" AS "FIRSTNAME",
                    NULL AS "LASTNAME",
                    "LOGIN_ID",
                    "LOB" AS "DEPARTMENT",
                    emp_office_email AS "EMAILID",
                    CASE
                        WHEN "EMP_ID" IN (SELECT DISTINCT "EMP_ID" FROM Temp_Emp) THEN true
                        WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
                            OR "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComDesignated') THEN true
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'GWM_RA')
                            AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'GWM_RA') THEN true
                        ELSE false
                    END AS "DSIGNATED",
                    CASE
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
                        WHEN "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
                        WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
                            AND "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DsgLOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey')
                            AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
                        ELSE false
                    END AS "GREYLIST",
                    'nwm.emptrading@nuvama.com' AS "TRADEREMAILIDS",
                    CASE
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IEMember') THEN true
                        WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
                            AND "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DsgLOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IEMember') THEN true
                        ELSE false
                    END AS "ISIECOMPLIANCEMEMBER",
                    CASE
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'Research_Analyst')
                            AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'Research_Analyst') THEN true
                        ELSE false
                    END AS "ISRESEARCHANALYST",
                    CASE
                        WHEN "EMP_ID" IN ('00214', '01007', '09618') THEN true
                        ELSE false
                    END AS "ISQUANTITATIVERESEARCHANALYST",
                    CASE
                        WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'GWM_RA')
                            AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'GWM_RA') THEN true
                        ELSE false
                    END AS "ISGWMRAMEMBER",
                    CASE
                        WHEN "EMP_ACTIVE_HRM_FLG" = true THEN true
                        ELSE false
                    END AS "ISACTIVE",
                    --'system' AS "CREATED_BY",
                    1 AS "CREATED_BY",
                    CURRENT_TIMESTAMP AS "CREATED_ON",
                    NULL AS "MODIFIED_BY",
                    NULL AS "MODIFIED_ON",  
                    CASE
                        WHEN "EMP_ID" IN (SELECT DISTINCT "EMP_ID" FROM Temp_Emp) THEN true
                        ELSE false
                    END AS "EFSLDESIGNATED",
                    CASE
                        WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" = 'IsEGI') THEN true
                        ELSE false
                    END AS "ISEGI",       
                    CASE
                        WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" = 'IsETLI') THEN true
                        ELSE false
                    END AS "ISETLI", 
                    'Automate' AS "ENTRYTYPE",
                    CASE
                        WHEN "SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = "SBU_CODE" AND "MEMBER" = 'IsGM') THEN true
                        ELSE false
                    END AS "ISGM",
                    --"ENTITY",
                    CASE 
                        WHEN "ENTITY" IN (SELECT "ENTITY_NAME" FROM "TBL_ENTITY_MST") 
                            THEN (SELECT "ID" FROM "TBL_ENTITY_MST" WHERE "ENTITY_NAME" = "ENTITY")
                        ELSE NULL
                    END AS "ENTITY",
                    pan,
                    NULL,
                    "DESIGNATION_NAME",
                    --"SBU",
                    CASE 
                        WHEN "SBU" IN (SELECT "SBU_NAME" FROM "TBL_SBU_MST") 
                            THEN (SELECT "ID" FROM "TBL_SBU_MST" WHERE "SBU_NAME" = "SBU")
                        ELSE NULL
                    END AS "SBU",
                    --"SLOB",
                    --CASE 
                        --WHEN "SLOB" IN (SELECT "SUBLOB_NAME" FROM "TBL_SUBLOB_MST") 
                            --THEN (SELECT "ID" FROM "TBL_SUBLOB_MST" WHERE "SUBLOB_NAME" = "SLOB")
                        --ELSE NULL
                    --END AS "SLOB",
                    ST."ID" as "SLOB",
                    "EMP_DATE_JOINED",
                    --"CLUSTER",
                    CASE 
                        WHEN "CLUSTER" IN (SELECT "BG_NAME" FROM "TBL_BUSINESSGROUP_MST") 
                            THEN (SELECT "ID" FROM "TBL_BUSINESSGROUP_MST" WHERE "BG_NAME" = "CLUSTER")
                        ELSE NULL
                    END AS "CLUSTER",
                    "EMP_RESIGN_DATE",                      
                    SUBSTRING("RA_ID" FROM position('[^0]' IN "RA_ID")) AS "RA_ID",
                    CASE
                        WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" IN ('EAAA'))
                            OR "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" IN ('EARC'))
                            OR "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IB')
                            OR "SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = "SBU_CODE" AND "MEMBER" = 'CMA') THEN true
                        ELSE false
                    END AS "BUSINESSDESIGNATED"
                FROM vw_hrms_employee_information_usermaster as HE
                INNER JOIN "TBL_SUBLOB_MST" as ST ON ST."SUBLOB_NAME" = HE."SLOB"
                WHERE "EMP_ID" !~ '[A-Z]'
                    --AND SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = COALESCE('${EmpID}', (SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID"))))
                    AND "ENTITY" NOT IN ('Gallagher Insurance Brokers Private Limited')
                    AND "ENTITY" IN ('Nuvama Wealth Management Limited (Formerly Edelweiss Securities Limited)',
                                    'Nuvama Wealth Management Limited',
                                    'Nuvama Wealth Management Ltd',
                                    'Nuvama Wealth Management Ltd.',
                                    'Edelweiss Securities Limited',
                                    'Edelweiss Finance & Investments Limited',
                                    'Nuvama Wealth Finance Limited',
                                    'Nuvama Wealth Finance Ltd.',
                                    'Edelweiss Broking Limited',
                                    'Nuvama Wealth And Investment Limited',
                                    'Edelweiss Custodial Services Limited',
                                    'Nuvama Clearing Services Limited',
                                    'EDELWEISS SECURITIES (IFSC) LIMITED',
                                    'Nuvama Capital Services (IFSC) Limited',
                                    'ESL Securities Limited',
                                    'Nuvama Asset Management Limited',
                                    'Edelweiss Capital Services Limited',
                                    'Nuvama Custodial Services Limited',
                                    'Nuvama Investment Advisors (Hongkong) Private Limited',
                                    'Nuvama Financial Services (UK) Limited',
                                    'Nuvama Investment Advisors LLC',
                                    'Nuvama Investment Advisors Private Limited',
                                    'Edelweiss Financial Services Inc',
                                    'Nuvama Financial Services Inc',
                                    'Nuvama And Cushman & Wakefield Management Private Limited')
                    AND "TYPE_OF_EMPLOYMENT" LIKE '%Permanent%';

                    UPDATE "TBL_USER_MASTER_EXCEPTION" AS EX
                    SET "ISACTIVE" = UM."ISACTIVE"
                    FROM "TBL_USER_MASTER_AUTOMATE" AS UM
                    WHERE EX."EMPNO" = UM."EMPNO"
                    AND EX."ISACTIVE" = true;

                    --Log for User Master for Business                    
                    UPDATE "TBL_BUSINESS_USER_MST"
                    SET "IS_ACTIVE" = FALSE, "MODIFIED_ON" = CURRENT_TIMESTAMP
                    WHERE "BUSINESS_NAME" IN ('EAAA', 'EARC', 'IB', 'CMA', 'GM');

                    UPDATE "TBL_BUSINESS_USER_MST"                    
                    SET "IS_ACTIVE" = FALSE, "MODIFIED_ON" = CURRENT_TIMESTAMP
                    WHERE "BUSINESS_NAME" LIKE '% BuisnessHead%';


                    --Log for User Master for Business                                      
                    INSERT INTO "TBL_BUSINESS_USER_MST" ("EMPID", "BUSINESS_NAME", "CREATED_BY", "CREATED_ON", "IS_ACTIVE", "FROM_FLAG")
                    SELECT a."EMPNO", 'EAAA', 'System', CURRENT_TIMESTAMP, true, 'L'
                    FROM "TBL_USER_MASTER_AUTOMATE" a
                    INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b ON SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = a."EMPNO"  
                    WHERE b."ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = b."ENTITY_CODE" AND "MEMBER" = 'EAAA')

                    UNION ALL

                    SELECT a."EMPNO", 'EARC', 'System', CURRENT_TIMESTAMP, true, 'L'
                    FROM "TBL_USER_MASTER_AUTOMATE" a
                    INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b ON SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = a."EMPNO"
                    WHERE b."ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = b."ENTITY_CODE" AND "MEMBER" = 'EARC')

                    UNION ALL

                    SELECT a."EMPNO", 'IB', 'System', CURRENT_TIMESTAMP, true, 'L'
                    FROM "TBL_USER_MASTER_AUTOMATE" a
                    INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b ON SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = a."EMPNO"
                    WHERE b."LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = b."LOB_CODE" AND "MEMBER" = 'IB')

                    UNION ALL

                    SELECT a."EMPNO", 'CMA', 'System', CURRENT_TIMESTAMP, true, 'L'
                    FROM "TBL_USER_MASTER_AUTOMATE" a
                    INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b ON SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = a."EMPNO"
                    WHERE b."SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = b."SBU_CODE" AND "MEMBER" = 'CMA')

                    UNION ALL
 
                    SELECT a."EMPNO", 'GM', 'System', CURRENT_TIMESTAMP, true, 'L'
                    FROM "TBL_USER_MASTER_AUTOMATE" a
                    INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b ON SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = a."EMPNO"
                    WHERE b."SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = b."SBU_CODE" AND "MEMBER" = 'IsGM');  

            COMMIT;`;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("GetUserDetailsAutomate", data);

        await updateUserFromAutomate(EmpID);
        await USPInsertNonDTracker();

    } catch (error) {
        console.error('Error creating attachment file:', error);
        await sendErrorNotification1('Error creating attachment file', error);
        // return null;
    }
}

async function updateUserFromAutomate(empId) {

    try {
        // console.log(empId);

        const query = `            
                -- Insert into EIRF_USER_MASTER_BAK_HIS;CREATED_LOG_BY, CREATED_LOG_DATE,'System', CURRENT_TIMESTAMP  
                INSERT INTO "TBL_USER_MST_AUDIT" ("USER_MST_ID","EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST",
                    "TRADEREMAILIDS","ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI",
                    "ISETLI","ENTRYTYPE","ISGM","ENTITY","PANCARDNO","ENTITYDESIGN","SBU","SLOB",
                    "EMPJOINDATE","BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED")
                SELECT
                    "ID","EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST",
                    "TRADEREMAILIDS","ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI",
                    "ISETLI","ENTRYTYPE","ISGM","ENTITY","PANCARDNO","ENTITYDESIGN","SBU","SLOB",
                    "EMPJOINDATE","BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED"     
                FROM "TBL_USER_MST";
            
                -- Update EIRF_User_Master
                UPDATE "TBL_USER_MST"
                SET "ISACTIVE" = false
                WHERE "EMPNO" NOT IN (
                    SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true
                ); 
                --AND "EMPNO" = COALESCE('${empId}',"EMPNO");

                -- Update EIRF_User_Master with values from EIRF_User_Master_Automate
                UPDATE "TBL_USER_MST" AS emp
                SET
                    "FIRSTNAME" = tempEmp."FIRSTNAME",
                    "LASTNAME" = tempEmp."LASTNAME",
                    "LOGINID" = tempEmp."LOGINID",
                    "DEPARTMENT" = tempEmp."DEPARTMENT",
                    "EMAILID" = tempEmp."EMAILID",
                    "DSIGNATED" = tempEmp."DSIGNATED",
                    "GREYLIST" = tempEmp."GREYLIST",
                    "TRADEREMAILIDS" = tempEmp."TRADEREMAILIDS",
                    "ISIECOMPLIANCEMEMBER" = tempEmp."ISIECOMPLIANCEMEMBER",
                    "ISRESEARCHANALYST" = tempEmp."ISRESEARCHANALYST",
                    "ISQUANTITATIVERESEARCHANALYST" = tempEmp."ISQUANTITATIVERESEARCHANALYST",
                    "ISGWMRAMEMBER" = tempEmp."ISGWMRAMEMBER",
                    "ISACTIVE" = tempEmp."ISACTIVE",
                    --"MODIFIED_BY" = 'System',
                    "MODIFIED_BY" = 1,
                    "MODIFIED_ON" = CURRENT_TIMESTAMP,
                    "EFSLDESIGNATED" = tempEmp."EFSLDESIGNATED",
                    "ISEGI" = tempEmp."ISEGI",
                    "ISETLI" = tempEmp."ISETLI",
                    "ENTRYTYPE" = tempEmp."ENTRYTYPE",
                    "ISGM" = tempEmp."ISGM",
                    "PANCARDNO" = tempEmp."PANCARDNO",
                    "ENTITY" = tempEmp."ENTITY",
                    "DESIGNATION" = tempEmp."DESIGNATION",
                    "SBU" = tempEmp."SBU",
                    "SLOB" = tempEmp."SLOB",
                    "EMPJOINDATE" = tempEmp."EMPJOINDATE",
                    "BG" = tempEmp."BG",
                    "RESIGNDATE" = tempEmp."RESIGNDATE",
                    "RA_ID" = tempEmp."RA_ID",
                    "BUSINESSDESIGNATED" = tempEmp."BUSINESSDESIGNATED"
                FROM "TBL_USER_MASTER_AUTOMATE" AS tempEmp
                WHERE emp."EMPNO" = tempEmp."EMPNO"
                AND
                    tempEmp."EMPNO" NOT IN (
                        SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true
                    );
                --AND emp."EMPNO" = COALESCE('${empId}', emp."EMPNO");

                -- Update EIRF_User_Master for exception master active employees
                UPDATE "TBL_USER_MST" AS emp
                SET
                    "DEPARTMENT" = tempEmp."DEPARTMENT",
                    "ISIECOMPLIANCEMEMBER" = tempEmp."ISIECOMPLIANCEMEMBER",
                    "ISRESEARCHANALYST" = tempEmp."ISRESEARCHANALYST",
                    "ISQUANTITATIVERESEARCHANALYST" = tempEmp."ISQUANTITATIVERESEARCHANALYST",
                    "ISGWMRAMEMBER" = tempEmp."ISGWMRAMEMBER",
                    "ISACTIVE" = tempEmp."ISACTIVE",
                    --"MODIFIED_BY" = 'System',
                    "MODIFIED_BY" = 1,
                    "MODIFIED_ON" = CURRENT_TIMESTAMP,
                    "ISEGI" = tempEmp."ISEGI",
                    "ISETLI" = tempEmp."ISETLI",
                    "ENTRYTYPE" = tempEmp."ENTRYTYPE",
                    "ISGM" = tempEmp."ISGM",
                    "PANCARDNO" = tempEmp."PANCARDNO",
                    "ENTITY" = tempEmp."ENTITY",
                    "DESIGNATION" = tempEmp."DESIGNATION",
                    "SBU" = tempEmp."SBU",
                    "SLOB" = tempEmp."SLOB",
                    "BG" = tempEmp."BG",
                    "RESIGNDATE" = tempEmp."RESIGNDATE",
                    "RA_ID" = tempEmp."RA_ID",
                    "BUSINESSDESIGNATED" = tempEmp."BUSINESSDESIGNATED",
                    "EMAILID" = tempEmp."EMAILID",
                    "LOGINID" = tempEmp."LOGINID"
                FROM "TBL_USER_MASTER_AUTOMATE" AS tempEmp
                WHERE emp."EMPNO" = tempEmp."EMPNO"
                AND
                    tempEmp."EMPNO" IN (
                        SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true
                    );
                   -- AND emp."EMPNO" = COALESCE('${empId}', emp."EMPNO");

                    -- Update EIRF_User_Master with NWML Designated/Designated exception master employee data
                    UPDATE "TBL_USER_MST" as emp
                    SET
                        "DSIGNATED" = emp_des."DSIGNATED",                     
                        "EFSLDESIGNATED" = emp_des."EFSLDESIGNATED"                     
                    FROM "TBL_USER_MASTER_AUTOMATE" AS tempEmp,                
                          "TBL_USER_MASTER_DESIGNATED_EXCEPTION" AS emp_des
                    WHERE
                        emp."ISACTIVE" = true
                        AND emp."EMPNO" = tempEmp."EMPNO"
                        AND emp_des."EMPNO" = emp."EMPNO";

                        -- Insert into EIRF_User_Master
                INSERT INTO "TBL_USER_MST" ("EMPNO","FIRSTNAME","LASTNAME","LOGINID","DEPARTMENT","EMAILID","DSIGNATED","GREYLIST","TRADEREMAILIDS",
                    "ISIECOMPLIANCEMEMBER","ISRESEARCHANALYST","ISQUANTITATIVERESEARCHANALYST","ISGWMRAMEMBER",
                    "ISACTIVE","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","EFSLDESIGNATED","ISEGI","ISETLI","ENTRYTYPE",
                    "ISGM","ENTITY","PANCARDNO","DESIGNATION","SBU","SLOB","EMPJOINDATE","BG","RESIGNDATE","RA_ID","BUSINESSDESIGNATED","DEFAULTROLEID"
                    
                )
                SELECT
                    tempEmp."EMPNO", tempEmp."FIRSTNAME", tempEmp."LASTNAME", tempEmp."LOGINID", tempEmp."DEPARTMENT",
                    tempEmp."EMAILID", tempEmp."DSIGNATED", tempEmp."GREYLIST", tempEmp."TRADEREMAILIDS",
                    tempEmp."ISIECOMPLIANCEMEMBER", tempEmp."ISRESEARCHANALYST", tempEmp."ISQUANTITATIVERESEARCHANALYST",
                    tempEmp."ISGWMRAMEMBER", tempEmp."ISACTIVE", tempEmp."CREATED_BY", tempEmp."CREATED_ON", tempEmp."MODIFIED_BY",
                    tempEmp."MODIFIED_ON", tempEmp."EFSLDESIGNATED", tempEmp."ISEGI", tempEmp."ISETLI", tempEmp."ENTRYTYPE",
                    tempEmp."ISGM", tempEmp."ENTITY", tempEmp."PANCARDNO", tempEmp."DESIGNATION", tempEmp."SBU", tempEmp."SLOB",
                    tempEmp."EMPJOINDATE", tempEmp."BG", tempEmp."RESIGNDATE", tempEmp."RA_ID", tempEmp."BUSINESSDESIGNATED",1 -- DEFAULTROLEID hardcoded to role user.
                FROM "TBL_USER_MST" AS emp
                RIGHT JOIN "TBL_USER_MASTER_AUTOMATE" AS tempEmp ON emp."EMPNO" = tempEmp."EMPNO"
                WHERE
                    emp."EMPNO" IS NULL
                    AND tempEmp."EMPNO" NOT IN (
                        SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true
                    );
            
                -- Execute additional procedures
                --PERFORM EIRF_UPSI_EmpIdentificationLogic();
                --PERFORM EIRF_UserCategorization_Activate();

                -- Discontinue users from EGIBL ENTITY
                --UPDATE "TBL_USER_MST"
                --SET "ISACTIVE" = false
                --WHERE "ENTITY" = 'Gallagher Insurance Brokers Private Limited';
                UPDATE "TBL_USER_MST"
                SET "ISACTIVE" = false
                WHERE "ENTITY"::varchar IN (
                    SELECT "ENTITY_CODE"
                        FROM "TBL_ENTITY_MST"
                        WHERE "ENTITY_NAME" = 'Gallagher Insurance Brokers Private Limited'
                    );

                    -- Delete records from PIT_Employee_Module_Mapping                
                DELETE FROM "TBL_PIT_EMPLOYEE_MODULE_MAPPING" WHERE "MODULE_NAME" = 'EIRF';
            
                -- Hardcoded update for PANKAJ ABHNAG LOGIN
                UPDATE "TBL_USER_MST" SET "ISACTIVE" = true WHERE "EMPNO" = '15654';
            
                -- Insert records into PIT_Employee_Module_Mapping                
                INSERT INTO "TBL_PIT_EMPLOYEE_MODULE_MAPPING" ("EMP_ID", "MODULE_NAME", "IS_ACTIVE", "CREATED_BY", "CREATED_ON")
                SELECT "EMPNO", 'EIRF', true, '26531', CURRENT_TIMESTAMP FROM "TBL_USER_MST" WHERE "ISACTIVE" = true;
            
                -- Insert into EIRF_UserMaster_Log
                INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE")
                VALUES ('User Master updated from Automate list', CURRENT_TIMESTAMP);
            
        `;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("updateUserFromAutomate", data);

        await upsiEmpIdentificationLogic();
        await UserCategorizationActivate();

    } catch (err) {
        console.error('Error executing SQL query:', err);

        // Handle the error and send email
        // const errMsg = err.message || 'Unknown error occurred';
        await sendErrorNotification('Error creating attachment file', err);

    }
}

async function upsiEmpIdentificationLogic() {
    try {

        const query = `                    
                        --For EFSL designated type
                        UPDATE "TBL_USER_MST" AS u
                        SET "EFSLDESIGNATED" = tbl."efsl_designated"
                        FROM (
                                --SELECT "EMPLOYEE_ID","EMP_NAME",entityname,true::boolean AS "efsl_designated"                                
                                --FROM "TBL_ENTITY_CEO_BH_MAPPING_MST"
                                --WHERE "IS_ACTIVE" = true
                                --AND "entityname" = 'Nuvama Wealth Management Limited'
                                SELECT a."EMPLOYEE_ID",a."EMP_NAME",c."ENTITY_NAME",true::boolean AS "efsl_designated"                                
                                FROM "TBL_ENTITY_CEO_BH_MAPPING_MST" a
                                JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE" 
                                WHERE a."IS_ACTIVE" = true
                                AND c."ENTITY_NAME" = 'Nuvama Wealth Management Limited'

                                UNION ALL
    
                                SELECT substring(hr."EMP_ID" FROM position('%[^0]%' IN hr."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                                hr."EMP_FULL_NAME" AS "EMP_NAME",hr."ENTITY",true::boolean AS "efsl_designated"
                                FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                INNER JOIN "TBL_ENTITY_CEO_BH_MAPPING_MST" c 
                                ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                AND c."ENTITY_ID"::varchar = hr."ENTITY_CODE"
                                WHERE
                                    hr."EMP_ACTIVE_HRM_FLG" = true
                                    AND c."IS_ACTIVE" = true
                                    AND hr."ENTITY" = 'Nuvama Wealth Management Limited'

                                    UNION ALL
                                 
                                    SELECT substring(h."EMP_ID" FROM position('%[^0]%' IN h."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                                    h."EMP_FULL_NAME" AS "EMP_NAME",h."ENTITY",true::boolean AS "efsl_designated"
                                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION" h
                                    INNER JOIN (
                                        SELECT *
                                        FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                        INNER JOIN "TBL_ENTITY_CEO_BH_MAPPING_MST" c 
                                        ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                        AND c."ENTITY_ID"::varchar = hr."ENTITY_CODE"
                                        WHERE
                                            hr."EMP_ACTIVE_HRM_FLG" = true
                                            AND hr."ENTITY" = 'Nuvama Wealth Management Limited'
                                            AND c."IS_ACTIVE" = true
                                       ) t ON substring(t."EMP_ID" FROM position('%[^0]%' IN t."EMP_ID") FOR 30) = substring(h."RA_ID" FROM position('%[^0]%' IN h."RA_ID") FOR 30) 
                                    AND t."ENTITY_CODE" = h."ENTITY_CODE"
                                    WHERE
                                        h."EMP_ACTIVE_HRM_FLG" = true
                                        AND h."ENTITY" = 'Nuvama Wealth Management Limited'    
                                
                        ) tbl
                        WHERE
                            u."EMPNO" = tbl."EMPLOYEE_ID"
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true)
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_DESIGNATED_EXCEPTION");

                            --For Non EFSL designated type
                        UPDATE "TBL_USER_MST" AS u
                        SET "DSIGNATED" = tbl."non_efsl_designated"
                        FROM (
                                SELECT a."EMPLOYEE_ID",a."EMP_NAME",c."ENTITY_NAME",true::boolean AS "non_efsl_designated"
                                FROM "TBL_ENTITY_CEO_BH_MAPPING_MST" a
                                JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE" 
                                WHERE a."IS_ACTIVE" = true
                                AND c."ENTITY_NAME" <> 'Nuvama Wealth Management Limited'
    
                                UNION ALL
    
                                SELECT substring(hr."EMP_ID" FROM position('%[^0]%' IN hr."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                                hr."EMP_FULL_NAME" AS "EMP_NAME",hr."ENTITY",true::boolean AS "non_efsl_designated"
                                FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                INNER JOIN "TBL_ENTITY_CEO_BH_MAPPING_MST" c 
                                ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                AND c."ENTITY_ID"::varchar = hr."ENTITY_CODE"
                                WHERE
                                    hr."EMP_ACTIVE_HRM_FLG" = true
                                    AND c."IS_ACTIVE" = true
                                    AND hr."ENTITY" <> 'Nuvama Wealth Management Limited'
    
                                UNION ALL
    
                                SELECT substring(h."EMP_ID" FROM position('%[^0]%' IN h."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                                h."EMP_FULL_NAME" AS "EMP_NAME",h."ENTITY",true::boolean AS "non_efsl_designated"
                                FROM "TBL_HRMS_EMPLOYEE_INFORMATION" h
                                INNER JOIN (
                                    SELECT *
                                    FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                    INNER JOIN "TBL_ENTITY_CEO_BH_MAPPING_MST" c 
                                    ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                    AND c."ENTITY_ID"::varchar = hr."ENTITY_CODE"
                                    WHERE
                                        hr."EMP_ACTIVE_HRM_FLG" = true
                                        AND hr."ENTITY" <> 'Nuvama Wealth Management Limited'
                                        AND c."IS_ACTIVE" = true
                                ) t ON substring(t."EMP_ID" FROM position('%[^0]%' IN t."EMP_ID") FOR 30) = substring(h."RA_ID" FROM position('%[^0]%' IN h."RA_ID") FOR 30) 
                                AND t."ENTITY_CODE" = h."ENTITY_CODE"
                                WHERE
                                    h."EMP_ACTIVE_HRM_FLG" = true
                                    AND h."ENTITY" <> 'Nuvama Wealth Management Limited'
                        ) AS tbl
                        WHERE
                            u."EMPNO" = tbl."EMPLOYEE_ID"
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true)
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_DESIGNATED_EXCEPTION");


                            --For EFSL designated type Materialsubsidiary 
                        UPDATE "TBL_USER_MST" AS u
                        SET "EFSLDESIGNATED" = tbl."efsl_designated"
                        FROM (
                            SELECT "EMPLOYEE_ID","EMP_NAME",c."ENTITY_NAME",b."MATERIALSUBSIDIARY_NAME",true::boolean AS "efsl_designated"
                            FROM "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" a
                            JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE"
                            JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON a."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"  
                            WHERE
                                a."IS_ACTIVE" = true
                                AND c."ENTITY_NAME" = 'Nuvama Wealth Management Limited'
    
                            UNION ALL
    
                            SELECT substring(hr."EMP_ID" FROM position('%[^0]%' IN hr."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                            hr."EMP_FULL_NAME" AS "EMP_NAME",hr."ENTITY",b."MATERIALSUBSIDIARY_NAME",true::boolean AS "efsl_designated"
                            FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                            INNER JOIN "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" c 
                            JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON c."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"  
                            ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                            AND c."MATERIAL_ID"::varchar = hr."ENTITY_CODE"
                            WHERE
                                hr."EMP_ACTIVE_HRM_FLG" = true
                                AND c."IS_ACTIVE" = true
                                AND hr."ENTITY" = 'Nuvama Wealth Management Limited'
    
                            UNION ALL
    
                            SELECT substring(h."EMP_ID" FROM position('%[^0]%' IN h."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                            h."EMP_FULL_NAME" AS "EMP_NAME",h."ENTITY",t."MATERIALSUBSIDIARY_NAME",true::boolean AS "efsl_designated"
                            FROM "TBL_HRMS_EMPLOYEE_INFORMATION" h
                            INNER JOIN (
                                SELECT *
                                FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                INNER JOIN "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" c 
                                JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON c."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"  
                                ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                AND c."MATERIAL_ID"::varchar = hr."ENTITY_CODE"
                                WHERE
                                    hr."EMP_ACTIVE_HRM_FLG" = true
                                    AND hr."ENTITY" = 'Nuvama Wealth Management Limited'
                                    AND c."IS_ACTIVE" = true
                            ) t ON substring(t."EMP_ID" FROM position('%[^0]%' IN t."EMP_ID") FOR 30) = substring(h."RA_ID" FROM position('%[^0]%' IN h."RA_ID") FOR 30) 
                            AND t."ENTITY_CODE" = h."ENTITY_CODE"
                            WHERE
                                h."EMP_ACTIVE_HRM_FLG" = true
                        ) AS tbl
                        WHERE
                            u."EMPNO" = tbl."EMPLOYEE_ID"
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true)
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_DESIGNATED_EXCEPTION");


                            --For Non EFSL designated type Materialsubsidiary
                        UPDATE "TBL_USER_MST" AS u
                        SET "DSIGNATED" = tbl."non_efsl_designated"
                        FROM (
                            SELECT a."EMPLOYEE_ID",a."EMP_NAME",c."ENTITY_NAME",b."MATERIALSUBSIDIARY_NAME",true::boolean AS "non_efsl_designated"
                            FROM "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" a
                            JOIN "TBL_ENTITY_MST" AS c ON a."ENTITY_ID"::varchar = c."ENTITY_CODE"
                            JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON a."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"  
                            WHERE
                                a."IS_ACTIVE" = true
                                AND c."ENTITY_NAME" = 'Nuvama Wealth Management Limited'
    
                            UNION ALL
    
                            SELECT substring(hr."EMP_ID" FROM position('%[^0]%' IN hr."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                            hr."EMP_FULL_NAME" AS "EMP_NAME",hr."ENTITY",b."MATERIALSUBSIDIARY_NAME",true::boolean AS "non_efsl_designated"
                            FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                            INNER JOIN "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" c 
                            JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON c."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"  
                            ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                            AND c."MATERIAL_ID"::varchar = hr."ENTITY_CODE"
                            WHERE
                                hr."EMP_ACTIVE_HRM_FLG" = true
                                AND c."IS_ACTIVE" = true
                                AND hr."ENTITY" <> 'Nuvama Wealth Management Limited'
    
                            UNION ALL
    
                            SELECT substring(h."EMP_ID" FROM position('%[^0]%' IN h."EMP_ID") FOR 30) AS "EMPLOYEE_ID",
                            h."EMP_FULL_NAME" AS "EMP_NAME",h."ENTITY",t."MATERIALSUBSIDIARY_NAME",true::boolean AS "non_efsl_designated"
                            FROM "TBL_HRMS_EMPLOYEE_INFORMATION" h
                            INNER JOIN (
                                SELECT *
                                FROM "TBL_HRMS_EMPLOYEE_INFORMATION" hr
                                INNER JOIN "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" c 
                                JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON c."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE" 
                                ON c."EMPLOYEE_ID" = substring(hr."RA_ID" FROM position('%[^0]%' IN hr."RA_ID") FOR 30) 
                                AND c."MATERIAL_ID"::varchar = hr."ENTITY_CODE"
                                WHERE
                                    hr."EMP_ACTIVE_HRM_FLG" = true
                                    AND hr."ENTITY" <> 'Nuvama Wealth Management Limited'
                                    AND c."IS_ACTIVE" = true
                            ) t ON substring(t."EMP_ID" FROM position('%[^0]%' IN t."EMP_ID") FOR 30) = substring(h."RA_ID" FROM position('%[^0]%' IN h."RA_ID") FOR 30) 
                            AND t."ENTITY_CODE" = h."ENTITY_CODE"
                            WHERE
                                h."EMP_ACTIVE_HRM_FLG" = true
                        ) AS tbl
                        WHERE
                            u."EMPNO" = tbl."EMPLOYEE_ID"
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true)
                            AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_DESIGNATED_EXCEPTION");


                            --For EFSL designated type M3 and EFSL UPSI team master
                            UPDATE "TBL_USER_MST" AS u
                            SET "EFSLDESIGNATED" = tbl."efsl_designated"
                            FROM (
                                SELECT DISTINCT "EMPLOYEE_ID", "EMP_NAME", true::boolean AS "efsl_designated"
                                FROM "TBL_M3_UPSI_MST"
                                WHERE "IS_ACTIVE" = true
                            ) AS tbl
                            WHERE
                                u."EMPNO" = tbl."EMPLOYEE_ID"
                                AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_EXCEPTION" WHERE "ISACTIVE" = true)
                                AND u."EMPNO" NOT IN (SELECT "EMPNO" FROM "TBL_USER_MASTER_DESIGNATED_EXCEPTION");


                                --Business Designated By Business Head master and one level down on 18 jul 2019
                                -- Update U.BusinessDesignated where U.EmpNo = B.EmployeeId                                
                                UPDATE "TBL_USER_MST" AS U
                                SET "BUSINESSDESIGNATED" = true
                                FROM "TBL_BUSINESSHEAD_MST" AS B
                                INNER JOIN "TBL_TEAM_MST" AS T ON B."TEAM_ID" = T."ID"
                                WHERE B."IS_ACTIVE" = true
                                AND T."IS_ACTIVE" = true
                                AND U."ISACTIVE" = true
                                AND U."EMPNO" = B."EMPLOYEE_ID";

                                -- Update U.BusinessDesignated where U.RA_Id = B.EmployeeId                        
                        UPDATE "TBL_USER_MST" AS U
                        SET "BUSINESSDESIGNATED" = true
                        FROM "TBL_BUSINESSHEAD_MST" AS B
                        INNER JOIN "TBL_TEAM_MST" AS T ON B."TEAM_ID" = T."ID"
                        WHERE B."IS_ACTIVE" = true
                        AND T."IS_ACTIVE" = true
                        AND U."ISACTIVE" = true
                        AND U."RA_ID" = B."EMPLOYEE_ID";

                        -- Insert into EIRF_Business_UserMaster for U.EmpNo = B.EmployeeId                        
                        INSERT INTO "TBL_BUSINESS_USER_MST" ("EMPID", "BUSINESS_NAME", "CREATED_BY", "CREATED_ON", "IS_ACTIVE", "FROM_FLAG")
                        SELECT U."EMPNO", T."TEAM_NAME" || 'BuisnessHead', 'System', CURRENT_TIMESTAMP, true, 'P'
                        FROM "TBL_BUSINESSHEAD_MST" AS B
                        INNER JOIN "TBL_TEAM_MST" AS T ON B."TEAM_ID" = T."ID"
                        INNER JOIN "TBL_USER_MST" AS U ON U."EMPNO" = B."EMPLOYEE_ID"
                        WHERE B."IS_ACTIVE" = true
                        AND T."IS_ACTIVE" = true
                        AND U."ISACTIVE" = true;

                        -- Insert into EIRF_Business_UserMaster for U.RA_Id = B.EmployeeId                        
                        INSERT INTO "TBL_BUSINESS_USER_MST" ("EMPID", "BUSINESS_NAME", "CREATED_BY", "CREATED_ON", "IS_ACTIVE", "FROM_FLAG")
                        SELECT U."EMPNO", T."TEAM_NAME" || 'BuisnessHead', 'System', CURRENT_TIMESTAMP, true, 'P'
                        FROM "TBL_BUSINESSHEAD_MST" AS B
                        INNER JOIN "TBL_TEAM_MST" AS T ON B."TEAM_ID" = T."ID"
                        INNER JOIN "TBL_USER_MST" AS U ON U."RA_ID" = B."EMPLOYEE_ID"
                        WHERE B."IS_ACTIVE" = true
                        AND T."IS_ACTIVE" = true
                        AND U."ISACTIVE" = true;


                        --Upload user master designated to update Y/N in BusinessDesignated column
                        -- Update T1 set T1.BusinessDesignated='N'                        
                        UPDATE "TBL_USER_MST" AS T1
                        SET "BUSINESSDESIGNATED" = false
                        FROM "TBL_TEAM_USER_MST" AS T2
                        WHERE T1."EMPNO" = T2."EMPLOYEE_ID"
                        AND T1."ISACTIVE" = true
                        AND T2."IS_ACTIVE" = false;


                        -- Update T1 set T1.BusinessDesignated='Y'                        
                        UPDATE "TBL_USER_MST" AS T1
                        SET "BUSINESSDESIGNATED" = true
                        FROM "TBL_TEAM_USER_MST" AS T2
                        WHERE T1."EMPNO" = T2."EMPLOYEE_ID"
                        AND T1."ISACTIVE" = true
                        AND T2."IS_ACTIVE" = true;


                        -- Update T3 set T3.IsActive=0                        
                        UPDATE "TBL_BUSINESS_USER_MST" AS T3
                        SET "IS_ACTIVE" = false
                        FROM "TBL_USER_MST" AS T1
                        INNER JOIN "TBL_TEAM_USER_MST" AS T2 ON T1."EMPNO" = T2."EMPLOYEE_ID"
                        WHERE T2."EMPLOYEE_ID" = T3."EMPID"
                        AND T1."ISACTIVE" = true
                        AND T2."IS_ACTIVE" = false;


                        -- Update T3 set T3.IsActive=1                        
                        UPDATE "TBL_BUSINESS_USER_MST" AS T3
                        SET "IS_ACTIVE" = true
                        FROM "TBL_USER_MST" AS T1
                        INNER JOIN "TBL_TEAM_USER_MST" AS T2 ON T1."EMPNO" = T2."EMPLOYEE_ID"
                        WHERE T2."EMPLOYEE_ID" = T3."EMPID"
                        AND T1."ISACTIVE" = true
                        AND T2."IS_ACTIVE" = true;  

                `;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("upsiEmpIdentificationLogic", data);

    } catch (err) {
        console.error('Error executing SQL query:', err);

    }
}

async function UserCategorizationActivate(){
    try {

        const query = `
                    DO $$
                        DECLARE
                            team_record RECORD; 
                            teamid INT;
                            teamname VARCHAR(1000);
                             
                            BEGIN
                            -- Fetch all teamid and teamname values from eirf_user_categorization and eirf_team_master tables                            
                                FOR team_record IN                                    
                                    SELECT uc."TEAM_ID", tm."TEAM_NAME" 
                                    FROM "TBL_USER_CATEGORIZATION_MST" uc 
                                    INNER JOIN "TBL_TEAM_MST" tm ON uc."TEAM_ID" = tm."ID" 
                                    WHERE uc."IS_ACTIVE" = true AND tm."IS_ACTIVE" = true
    
                                    LOOP
                                        -- Assign values from the current row to variables
                                        teamid := team_record."TEAM_ID";
                                        teamname := team_record.teamname;
        
                                        -- Drop temporary tables if they exist
                                        DROP TABLE IF EXISTS usermaster, ceo2leveldownentity, svpaboveentity, allemployeesentity,
                                            svpabovesbu, allemployesbu, svpabovesbulob, allemployesbulob,
                                            svpabovesbulobsublob, allemployesbusbulobsublob, designation, tempentity,
                                            activateemployee;

                                        -- Create temporary table #usermaster
                                        CREATE TEMP TABLE usermaster AS
                                        SELECT hr.*, b."BG_CODE", b."SBU_CODE", b."LOB_CODE", b."SUB_LOB_CODE", b."ENTITY_CODE"
                                        FROM "TBL_USER_MST" hr
                                        INNER JOIN "TBL_HRMS_EMPLOYEE_INFORMATION" b 
                                        ON (regexp_replace(hr."EMPNO", '^[^0-9]*', '')::int) = (regexp_replace(b."EMP_ID", '^[^0-9]*', '')::int); 
                                        --substring(hr."EMPNO" from (select (regexp_replace(hr."EMPNO", '^[0]*', ''))::int::text for ordinality limit 1)) = substring(b."EMP_ID" from (select (regexp_replace(b."EMP_ID", '^[0]*', ''))::int::text for ordinality limit 1))

                                        -- Create temporary table #ceo2leveldownentity                                        
                                        CREATE TEMP TABLE ceo2leveldownentity AS
                                        SELECT b."ENTITY_NAME", a."ENTITY_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST" AS a
                                        JOIN "TBL_ENTITY_MST" AS b ON a."ENTITY_ID"::varchar = b."ENTITY_CODE"                                                            
                                        WHERE a."TEAM_ID" = teamid AND a."CEO_TWO_LEVEL_DOWN" = true AND a."IS_ACTIVE" = true AND b."ENTITY_NAME" IS NOT NULL;

                                        -- Create temporary table #svpaboveentity
                                        CREATE TEMP TABLE svpaboveentity AS
                                        SELECT b."ENTITY_NAME", a."ENTITY_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST" AS a
                                        JOIN "TBL_ENTITY_MST" AS b ON a."ENTITY_ID"::varchar = b."ENTITY_CODE"                                                            
                                        WHERE a."TEAM_ID" = teamid AND a."SVP_ABOVE" = true AND a."IS_ACTIVE" = true AND b."ENTITY_NAME" IS NOT NULL;
             
                                        -- Create temporary table #allemployeesentity
                                        CREATE TEMP TABLE allemployeesentity AS
                                        SELECT b."ENTITY_NAME", a."ENTITY_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST" AS a
                                        JOIN "TBL_ENTITY_MST" AS b ON a."ENTITY_ID"::varchar = b."ENTITY_CODE"                                                            
                                        WHERE a."TEAM_ID" = teamid AND a."ALL_EMPLOYEEES" = true AND a."IS_ACTIVE" = true AND b."ENTITY_NAME" IS NOT NULL;
             
                                        -- Create temporary table #svpabovesbu
                                        CREATE TEMP TABLE svpabovesbu AS
                                        SELECT "SBU_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "SVP_ABOVE" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NULL AND "SUBLOB_ID" IS NULL;
             
                                        -- Create temporary table #allemployesbu
                                        CREATE TEMP TABLE allemployesbu AS
                                        SELECT "SBU_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "ALL_EMPLOYEEES" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NULL AND "SUBLOB_ID" IS NULL;
             
                                        -- Create temporary table #svpabovesbulob
                                        CREATE TEMP TABLE svpabovesbulob AS
                                        SELECT "SBU_ID", "LOB_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "SVP_ABOVE" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NOT NULL AND "SUBLOB_ID" IS NULL;
             
                                        -- Create temporary table #allemployesbulob
                                        CREATE TEMP TABLE allemployesbulob AS
                                        SELECT "SBU_ID", "LOB_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "ALL_EMPLOYEEES" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NOT NULL AND "SUBLOB_ID" IS NULL;
             
                                        -- Create temporary table #svpabovesbulobsublob
                                        CREATE TEMP TABLE svpabovesbulobsublob AS
                                        SELECT "SBU_ID", "LOB_ID", "SUBLOB_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "SVP_ABOVE" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NOT NULL AND "SUBLOB_ID" IS NOT NULL;
             
                                        -- Create temporary table #allemployesbusbulobsublob
                                        CREATE TEMP TABLE allemployesbusbulobsublob AS
                                        SELECT "SBU_ID", "LOB_ID", "SUBLOB_ID"
                                        FROM "TBL_USER_CATEGORIZATION_MST"
                                        WHERE "TEAM_ID" = teamid AND "ALL_EMPLOYEEES" = true AND "IS_ACTIVE" = true AND "SBU_ID" IS NOT NULL 
                                        AND "LOB_ID" IS NOT NULL AND "SUBLOB_ID" IS NOT NULL;
             
                                        -- Create temporary table #designation                                        
                                        CREATE TEMP TABLE designation AS
                                        SELECT "DESIGNATION"
                                        FROM "TBL_DESIGNATION_MST"
                                        WHERE "IS_ACTIVE" = true;

                                        -- Create temporary table #tempentity                                        
                                        CREATE TEMP TABLE tempentity AS
                                        SELECT "ENTITY_NAME", "EMPLOYEE_ID", "ENTITY_ID"
                                        FROM (
                                            SELECT b."ENTITY_NAME", ue."EMPLOYEE_ID", ue."ENTITY_ID"
                                            FROM "TBL_ENTITY_CEO_BH_MAPPING_MST" ue
                                            INNER JOIN ceo2leveldownentity dw ON ue."ENTITY_ID" = dw."ENTITY_ID"
                                            JOIN "TBL_ENTITY_MST" AS b ON ue."ENTITY_ID"::varchar = b."ENTITY_CODE"
                                            WHERE ue."IS_ACTIVE" = true
                             
                                            UNION ALL
                             
                                            SELECT b."MATERIALSUBSIDIARY_NAME" as "ENTITY_NAME", ue."EMPLOYEE_ID", ue."MATERIAL_ID" as "ENTITY_ID"
                                            FROM "TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST" ue
                                            INNER JOIN ceo2leveldownentity dw ON ue."MATERIAL_ID" = dw."ENTITY_ID"
                                            JOIN "TBL_MATERIALSUBSIDIARY_MST" AS b ON ue."MATERIAL_ID"::varchar = b."MATERIALSUBSIDIARY_CODE"
                                            WHERE ue."IS_ACTIVE" = true
                             
                                            UNION ALL
                                            
                                            SELECT b."ENTITY_NAME", ue."EMPLOYEE_ID", ue."ENTITY_ID" as "ENTITY_ID"
                                            FROM "TBL_DESGINATED_CEO_BH_MAPPING_MST" ue
                                            INNER JOIN ceo2leveldownentity dw ON ue."ENTITY_ID" = dw."ENTITY_ID"
                                            JOIN "TBL_ENTITY_MST" AS b ON ue."ENTITY_ID"::varchar = b."ENTITY_CODE"
                                            WHERE ue."TEAM_ID" = teamid AND ue."IS_ACTIVE" = true
                                        ) temp;


                                        -- Create temporary table #activateemployee and populate it
                                        CREATE TEMP TABLE activateemployee AS
                                        SELECT "EMPNO"
                                        FROM (
                                            -- Subquery 1
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN tempentity C ON C."EMPLOYEE_ID" = um."EMPNO"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 2
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN tempentity C ON C."EMPLOYEE_ID" = um."RA_ID" AND C."ENTITY_ID" = um."ENTITY_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 3
                                            SELECT um1."EMPNO"
                                            FROM usermaster um1
                                            INNER JOIN (
                                                SELECT *
                                                FROM "TBL_USER_MST" um
                                                INNER JOIN tempentity C ON C."EMPLOYEE_ID" = um."RA_ID" AND C."ENTITY_ID" = um."ENTITY"
                                                WHERE um.IsActive = 'Y'
                                            ) t ON t."EMPNO" = um1."RA_ID" AND t.EntityCode = um1.ENTITY_CODE
                                            WHERE um1."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 4
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN designation de ON um."DESIGNATION" = de."DESIGNATION"
                                            INNER JOIN svpaboveentity sv ON sv."ENTITY_ID" = um."ENTITY_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 5
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN allemployeesentity sv ON sv."ENTITY_ID" = um."ENTITY_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 6
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN designation de ON um."DESIGNATION" = de."DESIGNATION"
                                            INNER JOIN svpabovesbu sv ON sv."SBU_ID" = um."SBU_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 7
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN allemployesbu sv ON sv."SBU_ID" = um."SBU_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 8
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN designation de ON um."DESIGNATION" = de."DESIGNATION"
                                            INNER JOIN svpabovesbulob sv ON sv."SBU_ID" = um."SBU_CODE" AND sv."LOB_ID" = um."LOB_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 9
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN allemployesbulob sv ON sv."SBU_ID" = um."SBU_CODE" AND sv."LOB_ID" = um."LOB_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 10
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN designation de ON um."DESIGNATION" = de."DESIGNATION"
                                            INNER JOIN svpabovesbulob sv ON sv."SBU_ID" = um."SBU_CODE" AND sv."LOB_ID" = um."LOB_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 11
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN designation de ON um."DESIGNATION" = de."DESIGNATION"
                                            INNER JOIN svpabovesbulobsublob sv ON sv."SBU_ID" = um."SBU_CODE" AND sv."LOB_ID" = um."LOB_CODE" AND sv."SUBLOB_ID" = um."SUB_LOB_CODE"
                                            WHERE um."ISACTIVE" = true
    
                                            UNION ALL
    
                                            -- Subquery 12
                                            SELECT um."EMPNO"
                                            FROM usermaster um
                                            INNER JOIN allemployesbusbulobsublob sv ON sv."SBU_ID" = um."SBU_CODE" AND sv."LOB_ID" = um."LOB_CODE" AND sv."SUBLOB_ID" = um."SUB_LOB_CODE"
                                            WHERE um."ISACTIVE" = true
                                        ) Emp;

                                        UPDATE "TBL_USER_MST" um
                                        SET "BUSINESSDESIGNATED" = true
                                        FROM activateemployee ae                                        
                                        WHERE um."EMPNO" = ae."EMPNO" AND um."ISACTIVE" = true;
 
                                        UPDATE "TBL_BUSINESS_USER_MST"
                                        SET "IS_ACTIVE" = false, "MODIFIED_ON" = CURRENT_TIMESTAMP
                                        WHERE "BUSINESS_NAME" = teamname || 'Employee Categorization';

                                        UPDATE "TBL_BUSINESS_USER_MST" AS bm
                                        SET "IS_ACTIVE" = true, "MODIFIED_ON" = CURRENT_TIMESTAMP
                                        FROM activateemployee AS ae
                                        WHERE bm."EMPID" = ae."EMPNO" 
                                        AND bm."BUSINESS_NAME" = teamname || 'Employee Categorization';

                                        INSERT INTO "TBL_BUSINESS_USER_MST"("EMPID", "BUSINESS_NAME", "IS_ACTIVE", "CREATED_BY", "CREATED_ON")                                    
                                        SELECT ae."EMPNO", teamname || 'Employee Categorization', 1, 1809, CURRENT_TIMESTAMP
                                        FROM activateemployee AS ae
                                        WHERE ae."EMPNO" NOT IN (
                                            SELECT "EMPID" 
                                            FROM "TBL_BUSINESS_USER_MST" 
                                            WHERE "BUSINESS_NAME" = teamname || 'Employee Categorization'
                                        );

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'usermaster') THEN
                                            DROP TABLE IF EXISTS usermaster;
                                        END IF; 

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ceo2leveldownentity') THEN
                                            DROP TABLE IF EXISTS ceo2leveldownentity;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'svpaboveentity') THEN
                                            DROP TABLE IF EXISTS svpaboveentity;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'allemployeesentity') THEN
                                            DROP TABLE IF EXISTS allemployeesentity;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'svpabovesbu') THEN
                                            DROP TABLE IF EXISTS svpabovesbu;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'allemployesbu') THEN
                                            DROP TABLE IF EXISTS allemployesbu;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'svpabovesbulob') THEN
                                            DROP TABLE IF EXISTS svpabovesbulob;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'allemployesbulob') THEN
                                            DROP TABLE IF EXISTS allemployesbulob;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'svpabovesbulobsublob') THEN
                                            DROP TABLE IF EXISTS svpabovesbulobsublob;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'allemployesbusbulobsublob') THEN
                                            DROP TABLE IF EXISTS allemployesbusbulobsublob;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'designation') THEN
                                            DROP TABLE IF EXISTS designation;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'tempentity') THEN
                                            DROP TABLE IF EXISTS tempentity;
                                        END IF;

                                        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'activateemployee') THEN
                                            DROP TABLE IF EXISTS activateemployee;
                                        END IF;                                          

                                        RAISE NOTICE 'Processing team: %', teamname;
        
                                    END LOOP;

                    END $$;
                `;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("UserCategorizationActivate", data);

    } catch (err) {
        console.error('Error executing SQL query:', err);

        // Handle the error and send email
        await sendErrorNotification3('Error creating attachment file', err);

    }
}

async function USPInsertNonDTracker() {

    try {

        const query = `
            
                INSERT INTO "EIRF_NON_D_USER_TRACKER_BAK_HIS" ("EmpNo","NonEFSLDesignated","EFSLDesignated","IsconvertedToD","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON","CREATED_LOG_BY","CREATED_LOG_DATE")
                SELECT "EmpNo","NonEFSLDesignated","EFSLDesignated","IsconvertedToD","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON",'System' AS "CREATED_LOG_BY",CURRENT_TIMESTAMP AS "CREATED_LOG_DATE"
                FROM "EIRF_NON_D_USER_TRACKER";

                INSERT INTO "EIRF_NON_D_USER_TRACKER" ("EmpNo","NonEFSLDesignated","EFSLDesignated","IsconvertedToD","CREATED_BY","CREATED_ON","MODIFIED_BY","MODIFIED_ON")                
                SELECT VM."EMPNO",CASE WHEN VM."DSIGNATED" = true THEN 'Y' ELSE 'N' END AS "NonEFSLDesignated",
                        CASE WHEN VM."EFSLDESIGNATED" = true THEN 'Y' ELSE 'N' END AS "EFSLDesignated",'N','System',CURRENT_TIMESTAMP,NULL,NULL
                FROM "TBL_USER_MST" VM
                LEFT JOIN "EIRF_NON_D_USER_TRACKER" T ON VM."EMPNO" = T."EmpNo"
                WHERE
                    T."EmpNo" IS NULL
                    AND VM."DSIGNATED" = false 
                    AND VM."EFSLDESIGNATED" = false
                    AND VM."ISACTIVE" = true;

                    UPDATE "EIRF_NON_D_USER_TRACKER" AS T
                    SET "IsconvertedToD" =  CASE 
                                                WHEN U."DSIGNATED" = true THEN 'Y'
                                                WHEN U."EFSLDESIGNATED" = true THEN 'Y'
                                                ELSE 'N' 
                                            END,
                        "MODIFIED_BY" = 'System',
                        "MODIFIED_ON" = CURRENT_TIMESTAMP
                    FROM "TBL_USER_MST" AS U
                    WHERE 
                        T."EmpNo" = U."EMPNO" 
                        AND T."IsconvertedToD" = 'N';
                        
                        INSERT INTO "msm015" ("LOCATION", "COMPANY", "CREATED_BY", "CREATED_ON", "MODIFIED_BY", "MODIFIED_ON", "USER_FIRST_NAME", "EMPLOYEE_NUMBER", "DEPARTMENT", "EMP_JOIN_DATE", 
                        "USER_CODE", "USER_LAST_NAME", "DESIGNATED", "GREY_LIST", "CLIENT_CODE", "TRADER_EMAIL_IDS", "PAN_CARD_NO")
                    SELECT 'MUMBAI','EDELADBPM','ADMIN',CURRENT_TIMESTAMP,'ADMIN',CURRENT_TIMESTAMP,b."FIRSTNAME",b."EMPNO",b."DEPARTMENT",b."EMPJOINDATE",
                        NULL,'',CASE 
                                    WHEN b."DSIGNATED" = true THEN 'Y'
                                    WHEN b."EFSLDESIGNATED" = true THEN 'Y'
                                    ELSE 'N' 
                                END AS "IsconvertedToD",'N',e."ENTITY_NAME",b."EMAILID",b."PANCARDNO" 
                    FROM "TBL_USER_MST" AS b
                    LEFT JOIN "TBL_ENTITY_MST" AS e ON b."ENTITY"::varchar = e."ENTITY_CODE" 
                    WHERE  
                        b."EMPNO" IN (SELECT "EmpNo" FROM "EIRF_NON_D_USER_TRACKER" WHERE "IsconvertedToD" = 'Y')
                        AND b."EMPNO" NOT IN (SELECT "EmpId" FROM "TRD_Email_Status" WHERE "EmailType" = 'Intimation' AND "IsTrackedEmp" IS NULL)
                        AND b."EMPNO" NOT IN (SELECT "EMPLOYEE_NUMBER" FROM "msm015")
                        --AND "ENTITY" <> 'Gallagher Insurance Brokers Private Limited';
                        AND b."ENTITY"::varchar NOT IN (
                            SELECT "ENTITY_CODE"
                                FROM "TBL_ENTITY_MST"
                                WHERE "ENTITY_NAME" = 'Gallagher Insurance Brokers Private Limited'
                            );

                        UPDATE "msm015" AS a 
                        SET "DESIGNATED" = 'Y',
                            "MODIFIED_ON" = CURRENT_TIMESTAMP,
                            "CLIENT_CODE" = e."ENTITY_NAME",
                            "DEPARTMENT" = b."DEPARTMENT"
                        FROM "TBL_USER_MST" AS b
                        INNER JOIN "TBL_ENTITY_MST" AS e ON b."ENTITY"::varchar = e."ENTITY_CODE" 
                        WHERE 
                            a."EMPLOYEE_NUMBER" = b."EMPNO" 
                            AND a."DESIGNATED" = 'N' 
                            AND a."EMPLOYEE_NUMBER" IN (SELECT "EmpNo" FROM "EIRF_NON_D_USER_TRACKER" WHERE "IsconvertedToD" = 'Y');

                            DELETE FROM "msm015" WHERE "CLIENT_CODE" = 'Gallagher Insurance Brokers Private Limited';

                            DELETE FROM "msm015"
                    WHERE "CLIENT_CODE" NOT IN (
                                            'Nuvama Wealth Management Limited (Formerly Edelweiss Securities Limited)',
                                            'Nuvama Wealth Management Limited',
                                            'Nuvama Wealth Management Ltd',
                                            'Nuvama Wealth Management Ltd.',
                                            'Edelweiss Securities Limited',
                                            'Edelweiss Finance & Investments Limited',
                                            'Nuvama Wealth Finance Limited',
                                            'Nuvama Wealth Finance Ltd.',
                                            'Edelweiss Broking Limited',
                                            'Nuvama Wealth And Investment Limited',
                                            'Edelweiss Custodial Services Limited',
                                            'Nuvama Clearing Services Limited',
                                            'EDELWEISS SECURITIES (IFSC) LIMITED',
                                            'Nuvama Capital Services (IFSC) Limited',
                                            'ESL Securities Limited',
                                            'Nuvama Asset Management Limited',
                                            'Edelweiss Capital Services Limited',
                                            'Nuvama Custodial Services Limited',
                                            'Nuvama Investment Advisors (Hongkong) Private Limited',
                                            'Nuvama Financial Services (UK) Limited',
                                            'Nuvama Investment Advisors LLC',
                                            'Nuvama Investment Advisors Private Limited',
                                            'Edelweiss Financial Services Inc',
                                            'Nuvama Financial Services Inc',
                                            'Nuvama And Cushman & Wakefield Management Private Limited'
                                        );

                INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE") 
                VALUES ('Non Designated User Tracker updated from Automate list',CURRENT_TIMESTAMP);

        `;

        const result = await connect.sequelize.query(query);
        const data = result[0];
        console.log("USPInsertNonDTracker", data);

    } catch (err) {
        console.error('Error executing SQL query:', err);

        // Handle the error and send email
        // const errMsg = err.message || 'Unknown error occurred';
        await sendErrorNotification2('Error creating attachment file', err);

    }
}

// Function to send email for updateUserFromAutomate
async function sendErrorNotification(errorMessage, error) {
    try {
        // Create the transporter for sending error notifications
        let transporter = nodemailer.createTransport({
            host: configFile.email_smtp_config.host,
            port: configFile.email_smtp_config.port,
            auth: {
                user: configFile.email_smtp_config.auth.user,
                pass: configFile.email_smtp_config.auth.pass
            }
        });


        const errorBody = `<html>
                        <body>
                        <table>
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>
                        An error occurred:
                        </td>
                        </tr>  
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>    
                        ${error}
                        </td>
                        </tr>
                        </table>                                    
                      </body>
                     </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - User Master Automate update has failed',
            html: errorBody,
        };

        // Send the error notification email
        // const info = await transporter.sendMail(errorOptions);
        // console.log('Error notification sent:', info.response);
        const info = await newMail.sendEmail(errorOptions.from, errorOptions.to, null, errorOptions.subject, errorOptions.html, null);
        console.log('Error notification sent:', info);


        try {
            const insertQuery = `INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE")
                                VALUES ('${error}',CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(insertQuery, [error]);
            console.log('Data saved successfully!');

        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}

// Function to send email for get user details automate
async function sendErrorNotification1(errorMessage, error) {
    try {
        // Create the transporter for sending error notifications
        let transporter = nodemailer.createTransport({
            host: configFile.email_smtp_config.host,
            port: configFile.email_smtp_config.port,
            auth: {
                user: configFile.email_smtp_config.auth.user,
                pass: configFile.email_smtp_config.auth.pass
            }
        });


        const errorBody = `<html>
                        <body>
                        <table>
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>
                        An error occurred:
                        </td>
                        </tr>  
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>    
                        ${error}
                        </td>
                        </tr>
                        </table>                                    
                      </body>
                     </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - User Details Automate Failed',
            html: errorBody,
        };

        // Send the error notification email
        // const info = await transporter.sendMail(errorOptions);
        // console.log('Error notification sent:', info.response);
        const info = await newMail.sendEmail(errorOptions.from, errorOptions.to, null, errorOptions.subject, errorOptions.html, null);
        console.log('Error notification sent:', info);


        try {
            const insertQuery = `INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE") 
                                VALUES ('${error}',CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(insertQuery, [error]);
            console.log('Data saved successfully!');

        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}

// Function to send email for non d tracker
async function sendErrorNotification2(errorMessage, error) {
    try {
        // Create the transporter for sending error notifications
        let transporter = nodemailer.createTransport({
            host: configFile.email_smtp_config.host,
            port: configFile.email_smtp_config.port,
            auth: {
                user: configFile.email_smtp_config.auth.user,
                pass: configFile.email_smtp_config.auth.pass
            }
        });


        const errorBody = `<html>
                        <body>
                        <table>
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>
                        An error occurred:
                        </td>
                        </tr>  
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>    
                        ${error}
                        </td>
                        </tr>
                        </table>                                    
                      </body>
                     </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - Non Designated User Tracker Automate update has failed',
            html: errorBody,
        };

        // Send the error notification email
        // const info = await transporter.sendMail(errorOptions);
        // console.log('Error notification sent:', info.response);
        const info = await newMail.sendEmail(errorOptions.from, errorOptions.to, null, errorOptions.subject, errorOptions.html, null);
        console.log('Error notification sent:', info);


        try {
            const insertQuery = `INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE") 
                                VALUES ('${error}',CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(insertQuery, [error]);
            console.log('Data saved successfully!');

        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}

// Function to send email for UserCategorizationActivate
async function sendErrorNotification3(errorMessage, error) {
    try {
        // Create the transporter for sending error notifications
        let transporter = nodemailer.createTransport({
            host: configFile.email_smtp_config.host,
            port: configFile.email_smtp_config.port,
            auth: {
                user: configFile.email_smtp_config.auth.user,
                pass: configFile.email_smtp_config.auth.pass
            }
        });


        const errorBody = `<html>
                        <body>
                        <table>
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>
                        An error occurred:
                        </td>
                        </tr>  
                        <tr>
                        <td style=''font: 15px Calibri, arial;''>    
                        ${error}
                        </td>
                        </tr>
                        </table>                                    
                      </body>
                     </html>`;

        const errorOptions = {
            from: 'newel.technical@gmail.com',
            to: 'aniket.yadav@neweltechnologies.com,prasad@neweltechnologies.com,rinkal@neweltechnologies.com',
            subject: 'EIRF - User Categorization Failed',
            html: errorBody,
        };

        // Send the error notification email
        // const info = await transporter.sendMail(errorOptions);
        // console.log('Error notification sent:', info.response);
        const info = await newMail.sendEmail(errorOptions.from, errorOptions.to, null, errorOptions.subject, errorOptions.html, null);
        console.log('Error notification sent:', info);


        try {
            const insertQuery = `INSERT INTO "EIRF_USERMASTER_LOG" ("LOG_DESC", "LOG_DATE") 
                                VALUES ('${error}',CURRENT_TIMESTAMP)`;

            await connect.sequelize.query(insertQuery, [error]);
            console.log('Data saved successfully!');

        } catch (queryError) {
            console.error('Error saving data:', queryError);
        }
    } catch (notificationError) {
        console.error('Error sending error notification:', notificationError);
    }
}


// Call the main function
module.exports.GetUserDetailsAutomate = GetUserDetailsAutomate;

// SELECT
//                     SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) AS "EMPNO", 
//                     "EMP_FULL_NAME" AS "FIRSTNAME",
//                     NULL AS "LASTNAME",
//                     "LOGIN_ID",
//                     "LOB" AS "DEPARTMENT",
//                     "EMP_OFFICE_EMAIL" AS "EMAILID",
//                     CASE
//                         WHEN "EMP_ID" IN (SELECT DISTINCT "EMP_ID" FROM Temp_Emp) THEN true
//                         WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
//                             OR "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComDesignated') THEN true
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'GWM_RA')
//                             AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'GWM_RA') THEN true
//                         ELSE false
//                     END AS "DSIGNATED",
//                     CASE
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
//                         WHEN "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
//                         WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
//                             AND "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DsgLOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'ComGrey')
//                             AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'ComGrey') THEN true
//                         ELSE false
//                     END AS "GREYLIST",
//                     'nwm.emptrading@nuvama.com' AS "TRADEREMAILIDS",
//                     CASE
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IEMember') THEN true
//                         WHEN "DESIGNATION_NAME" IN (SELECT "NAME" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DESIGNATION' AND "NAME" = "DESIGNATION_NAME" AND "MEMBER" = 'ComDesignated')
//                             AND "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'DsgLOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IEMember') THEN true
//                         ELSE false
//                     END AS "ISIECOMPLIANCEMEMBER",
//                     CASE
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'Research_Analyst')
//                             AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'Research_Analyst') THEN true
//                         ELSE false
//                     END AS "ISRESEARCHANALYST",
//                     CASE
//                         WHEN "EMP_ID" IN ('00214', '01007', '09618') THEN true
//                         ELSE false
//                     END AS "ISQUANTITATIVERESEARCHANALYST",
//                     CASE
//                         WHEN "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'GWM_RA')
//                             AND "SUB_LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SLOB' AND "CODE" = "SUB_LOB_CODE" AND "MEMBER" = 'GWM_RA') THEN true
//                         ELSE false
//                     END AS "ISGWMRAMEMBER",
//                     CASE
//                         WHEN "EMP_ACTIVE_HRM_FLG" = true THEN true
//                         ELSE false
//                     END AS "ISACTIVE",
//                     --'system' AS "CREATED_BY",
//                     1 AS "CREATED_BY",
//                     CURRENT_TIMESTAMP AS "CREATED_ON",
//                     NULL AS "MODIFIED_BY",
//                     NULL AS "MODIFIED_ON",  
//                     CASE
//                         WHEN "EMP_ID" IN (SELECT DISTINCT "EMP_ID" FROM Temp_Emp) THEN true
//                         ELSE false
//                     END AS "EFSLDESIGNATED",
//                     CASE
//                         WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" = 'IsEGI') THEN true
//                         ELSE false
//                     END AS "ISEGI",       
//                     CASE
//                         WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" = 'IsETLI') THEN true
//                         ELSE false
//                     END AS "ISETLI", 
//                     'Automate' AS "ENTRYTYPE",
//                     CASE
//                         WHEN "SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = "SBU_CODE" AND "MEMBER" = 'IsGM') THEN true
//                         ELSE false
//                     END AS "ISGM",
//                     --"ENTITY",
//                     CASE 
//                         WHEN "ENTITY" IN (SELECT "ENTITY_NAME" FROM "TBL_ENTITY_MST") 
//                             THEN (SELECT "ID" FROM "TBL_ENTITY_MST" WHERE "ENTITY_NAME" = "ENTITY")
//                         ELSE NULL
//                     END AS "ENTITY",
//                     "PAN",
//                     NULL,
//                     "DESIGNATION_NAME",
//                     --"SBU",
//                     CASE 
//                         WHEN "SBU" IN (SELECT "SBU_NAME" FROM "TBL_SBU_MST") 
//                             THEN (SELECT "ID" FROM "TBL_SBU_MST" WHERE "SBU_NAME" = "SBU")
//                         ELSE NULL
//                     END AS "SBU",
//                     --"SLOB",
//                     --CASE 
//                         --WHEN "SLOB" IN (SELECT "SUBLOB_NAME" FROM "TBL_SUBLOB_MST") 
//                             --THEN (SELECT "ID" FROM "TBL_SUBLOB_MST" WHERE "SUBLOB_NAME" = "SLOB")
//                         --ELSE NULL
//                     --END AS "SLOB",
//                     ST."ID" as "SLOB",
//                     "EMP_DATE_JOINED",
//                     --"CLUSTER",
//                     CASE 
//                         WHEN "CLUSTER" IN (SELECT "BG_NAME" FROM "TBL_BUSINESSGROUP_MST") 
//                             THEN (SELECT "ID" FROM "TBL_BUSINESSGROUP_MST" WHERE "BG_NAME" = "CLUSTER")
//                         ELSE NULL
//                     END AS "CLUSTER",
//                     "EMP_RESIGN_DATE",                      
//                     SUBSTRING("RA_ID" FROM position('[^0]' IN "RA_ID")) AS "RA_ID",
//                     CASE
//                         WHEN "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" IN ('EAAA'))
//                             OR "ENTITY_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'ENTITY' AND "CODE" = "ENTITY_CODE" AND "MEMBER" IN ('EARC'))
//                             OR "LOB_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'LOB' AND "CODE" = "LOB_CODE" AND "MEMBER" = 'IB')
//                             OR "SBU_CODE" IN (SELECT "CODE" FROM "TBL_M_DESIGNATION_LOB" WHERE "TYPE" = 'SBU' AND "CODE" = "SBU_CODE" AND "MEMBER" = 'CMA') THEN true
//                         ELSE false
//                     END AS "BUSINESSDESIGNATED"
//                 FROM "TBL_HRMS_EMPLOYEE_INFORMATION" as HE
//                 INNER JOIN "TBL_SUBLOB_MST" as ST ON ST."SUBLOB_NAME" = HE."SLOB"
//                 WHERE "EMP_ID" !~ '[A-Z]'
//                     --AND SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID")) = COALESCE('${EmpID}', (SUBSTRING("EMP_ID" FROM position('[^0]' IN "EMP_ID"))))
//                     AND "ENTITY" NOT IN ('Gallagher Insurance Brokers Private Limited')
//                     AND "ENTITY" IN ('Nuvama Wealth Management Limited (Formerly Edelweiss Securities Limited)',
//                                     'Nuvama Wealth Management Limited',
//                                     'Nuvama Wealth Management Ltd',
//                                     'Nuvama Wealth Management Ltd.',
//                                     'Edelweiss Securities Limited',
//                                     'Edelweiss Finance & Investments Limited',
//                                     'Nuvama Wealth Finance Limited',
//                                     'Nuvama Wealth Finance Ltd.',
//                                     'Edelweiss Broking Limited',
//                                     'Nuvama Wealth And Investment Limited',
//                                     'Edelweiss Custodial Services Limited',
//                                     'Nuvama Clearing Services Limited',
//                                     'EDELWEISS SECURITIES (IFSC) LIMITED',
//                                     'Nuvama Capital Services (IFSC) Limited',
//                                     'ESL Securities Limited',
//                                     'Nuvama Asset Management Limited',
//                                     'Edelweiss Capital Services Limited',
//                                     'Nuvama Custodial Services Limited',
//                                     'Nuvama Investment Advisors (Hongkong) Private Limited',
//                                     'Nuvama Financial Services (UK) Limited',
//                                     'Nuvama Investment Advisors LLC',
//                                     'Nuvama Investment Advisors Private Limited',
//                                     'Edelweiss Financial Services Inc',
//                                     'Nuvama Financial Services Inc',
//                                     'Nuvama And Cushman & Wakefield Management Private Limited')
//                     AND "TYPE_OF_EMPLOYMENT" LIKE '%Permanent%';









