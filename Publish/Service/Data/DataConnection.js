var connect = require('./Connect');
var datamodel = require('./DataModel');
var dataaccess = require('./DataAccess');
var CryptoJS = require('crypto-js');

/// CheckConnection function used to check a database connection using API
module.exports.CheckConnection = function (res) {
    connect.sequelize
        .authenticate()
        .then(function (result) {
            res.status(200).json({ Success: true, Message: 'Connection has been establised successfully', Data: null });
        }, function (err) {
            res.status(200).json({ Success: false, Message: 'Unable to connect to the database : ' + err, Data: null });
        });
}

/// CreateTable function used to create Database tables using API
module.exports.CreateTable = function (res) {

    //Usermangement tables starts
    datamodel.TBL_ERROR_LOG();
    datamodel.TBL_ROLE_MST();
    datamodel.TBL_UIROLE_MAP();
    datamodel.TBL_UI_MST();
    datamodel.TBL_USERROLE_MAP();
    datamodel.TBL_USER_MST();
    datamodel.TBL_EXPIRY_DATE_MST();
    datamodel.TBL_GREY_LIST_MST();
    datamodel.TBL_RESTRICTED_LIST_MST();
    datamodel.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST();
    datamodel.TBL_MATERIALSUBSIDIARY_MST();
    datamodel.TBL_ENTITY_MST();
    datamodel.TBL_LOB_MST();
    datamodel.TBL_SBU_MST();
    datamodel.TBL_SUBLOB_MST();
    datamodel.TBL_BUSINESSGROUP_MST();
    datamodel.TBL_TREADINGWINDOW_CLOSE_MST();
    // datamodel.TBL_TYPE_MST();
    datamodel.TBL_M3_UPSI_MST();
    // datamodel.TBL_APPL_MST();
    datamodel.TBL_UPSI_MST();
    datamodel.TBL_ENTITY_CEO_BH_MAPPING_MST();
    datamodel.TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST();
    datamodel.TBL_GENERIC_MST();
    // datamodel.TBL_LOB_MST();
    // datamodel.
    datamodel.TBL_SCRIPT_MST();
    datamodel.TBL_SCRIPT_MST_CHANGES();
    datamodel.TBL_GOVERNMENT_SECURITIES();
    datamodel.TBL_NSE_SCRIPT_DAILY();
    datamodel.TBL_BSE_SCRIPT_DAILY();
    datamodel.TBL_SCRIPT_BAK_MST_HIS();
    datamodel.TBL_SEQ_MST();
    datamodel.TBL_DESIGNATION_MST();
    datamodel.TBL_BUSINESS_USER_MST();
    datamodel.TBL_DESGINATED_CEO_BH_MAPPING_MST();
    datamodel.TBL_BUSINESSHEAD_MST();

    datamodel.TBL_USER_CATEGORIZATION_MST();
    datamodel.TBL_TEAM_UPLOAD_MST();
    datamodel.TBL_COMPANY_HIERARCHY_MAPPING();
    datamodel.TBL_POB_DECLARATION();

    datamodel.TBL_POB_EMAIL_STATUS();
    // datamodel.TBL_POB_DECLARATION();
    datamodel.TBL_POB_PITCODE_ACCEPT();
    datamodel.TBL_SOS_RIGHT_MST();
    datamodel.TBL_SOS_LOGGEDIN_INFO();
    datamodel.TBL_PIT_APPLICATION_LINK();

    //rinkal code merging 1 Sep 23 start

    datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
    datamodel.TBL_JD_EMPLOYEE_RELATIVE_INFO();
    datamodel.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
    datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
    datamodel.TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS();
    datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
    datamodel.TBL_JD_STK_DP();
    datamodel.TBL_JD_EMP_DP();
    datamodel.TBL_JD_REL_DP();
    datamodel.TBL_JD_ROLE_MAPPING();
    datamodel.TBL_JD_ROLE_DETAILS();
    datamodel.TBL_JD_EDU_DETAILS();
    datamodel.TBL_JD_CONTACT_DETAILS();
    datamodel.TBL_JD_PAST_EMP_DETAILS();
    datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
    datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
    datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();

    //rinkal code merging 1 Sep 23 end
    datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
    // datamodel.TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS();
    datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    // datamodel.TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2();
    // datamodel.TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2();
    // datamodel.TBL_EAH_DP_EMPLOYEE();
    // datamodel.TBL_EAH_DP_RELATIVE();
    datamodel.TBL_EAH_EMAIL_STATUS();
    // datamodel.TBL_EAH_EMP_DP_ANAGRAM();
    datamodel.TBL_EAH_EMP_DP_ENTITY();
    datamodel.TBL_EAH_EMP_DP_OTHERS();
    datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    datamodel.TBL_EAH_EMPLOYEE_AGINGDATE();
    datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
    // datamodel.TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS();
    datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
    datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
    // datamodel.TBL_EAH_EMPLOYEE_ONBEHALF();
    datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
    datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
    datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS();
    datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
    datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
    datamodel.TBL_EAH_MANCO_MASTER();
    // datamodel.TBL_EAH_REL_DP_ANAGRAM();
    datamodel.TBL_EAH_REL_DP_ENTITY();
    datamodel.TBL_EAH_REL_DP_OTHERS();
    // datamodel.TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS();
    datamodel.TBL_EAH_SCHEDULER_LOG();
    // datamodel.TBL_EAH_STAKE_DP_SHARES_HOLDINGS();
    // datamodel.TBL_EAH_STK_DP_ANAGRAM();
    datamodel.TBL_EAH_STK_DP_ENTITY();
    datamodel.TBL_EAH_STK_DP_OTHERS();
    datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
    datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
    datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
    // datamodel.TBL_EAH_DP_STACK();
    datamodel.TBL_EAH_REOPEN_LOG();
    datamodel.TBL_PCOIDetails();
    datamodel.TBL_QuarterMaster();
    datamodel.TBL_IRF_Approval_Data();
    datamodel.Tbl_Employee_AccountCode_Mapping();
    datamodel.TBL_ITRADING_PRIMARY_ISSUE_MST();


    datamodel.TBL_UPSI_PROJECT_MST();
    datamodel.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA();
    datamodel.TBL_PROJECT_EMPLOYEE_DETAILS();
    datamodel.TBL_GREY_LIST_DETAILSMST()
    datamodel.EIRF_NON_D_USER_TRACKER()
    datamodel.TRD_Email_Status()
    datamodel.EIRF_RICO_IBEATS_ResignedEmp_AccountCode()
    datamodel.EIRF_Disclaimer_Status()


    datamodel.TBL_RISKCATEGORY_MAIL();
    datamodel.TBL_RMSCATEGORY_LOG();
    datamodel.TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG();
    datamodel.TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION();
    datamodel.TBL_USERMASTER_LOG();
    datamodel.TBL_DEPENDENT_CENTRALREPO();
    datamodel.TBL_DEPENDENT_CENTRALREPO_BAK_HIS();
    datamodel.TBL_DEPENDENT_CENTRALREPO_NEW();
    datamodel.TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL();
    datamodel.TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING();
    datamodel.TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS();
    datamodel.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA();
    datamodel.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS();
    datamodel.TBL_SCRIPT_MST_FOR_TRADE_RECON();
    datamodel.TBL_SCOI_ACCEPT_LOG();
    datamodel.TBL_SCOI_DATA();
    datamodel.TBL_SCOI_EMAIL_SEND_STATUS();

    datamodel.TBL_UPSI_PROJECT_USER_CATEGORIZATION();
    datamodel.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA();

    datamodel.TBL_ViolationRemarksDetails()
    datamodel.TBL_UPSI_AUDITOR_FILE_SAVE();
    datamodel.TBL_Holiday_Master();
    datamodel.TBL_HRMS_EMP_RELATIONINFORMATION();
    datamodel.TBL_HRMS_EMPLOYEE_INFORMATION();
    datamodel.TBL_PCOI_MAIL_SEND_LOG();
    datamodel.TBL_HELP_DESK_DATA();
    datamodel.TBL_HELP_DESK_QUERY_DATA();

    datamodel.TBL_HRMS_EMP_EMAIL();
    datamodel.TBL_HRMS_EMP_EMERGENCY_CONTACT();
    datamodel.TBL_HRMS_EMP_VOICE_DETAILS();
    datamodel.TBL_HRMS_EMP_ADDRESS();
    datamodel.TBL_HRMS_EMP_WORKEX_DATA_EAH();
    datamodel.TBL_HRMS_EMP_QUALIFICATION_DATA_EAH();
    datamodel.TBL_HRMS_EMP_NATIONALITY();
    datamodel.TBL_HRMS_COMPANY_HIERARCHY_MAPPING();
    datamodel.TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG();
    datamodel.eirf_rico_sos_emp_mapping();
    datamodel.TBL_FNOROLLOVER_EXPIRYDATA();
    datamodel.TBL_DP_HOLDING_DATA();
    datamodel.TBL_FUND_MANAGER_LISTDATA();
    datamodel.TBL_FUND_MANAGER_LISTDATA_HIS();
    datamodel.TBL_SCRIPT_AUTOMATION_LOGS();
    datamodel.TBL_FO_LOTS_DAILY();
    datamodel.EIRF_FO_3Months_LOTS_DAILY();
    datamodel.TBL_IRF_Digitalplatform_ApprovalRes();
    datamodel.TBL_UPSI_BLOCKINGFILE_LOG();
    datamodel.TBL_UPSI_VIRTUAL_SERVER_MST();
    datamodel.TBL_BENPOS_SHAREHOLDER_DETAILS();
    datamodel.ER_USER_SESSION_DETAILS();

    ////vishal////

    datamodel.TBL_DP_ALLOCATION_APPROVAL();
    connect.sequelize.sync()
        .then(() => {
            res.status(200).json({ Success: true, Message: 'Tables Created Successfully', Data: null });
        })
}

/// errorlogger function used to insert error logs into Error log table
module.exports.errorlogger = function (servicename, functionname, errorobj) {

    var err = 'Message : ' + errorobj.message + '\n' + 'Stack : ' + errorobj.stack;

    var values = {
        ServiceName: servicename,
        FunctionName: functionname,
        ErrorObject: err
    };

    dataaccess.Create(datamodel.TBL_ERROR_LOG(), values)
        .then(function (result) {
            console.log(JSON.stringify(result));
        }, function (err) {
            console.log('Error: ' + JSON.stringify(err));
        });
}

module.exports.decrypt = function (value) {

    console.log(value);

    const bytes = CryptoJS.AES.decrypt(value, 'newel');

    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    console.log(plaintext, "PLAINTEXT");

    try {
        // Attempt to parse the decrypted plaintext as JSON
        const parsedData = JSON.parse(plaintext);
        return parsedData;
    } catch (error) {
        console.error("Error parsing decrypted plaintext as JSON:", error);
        return null; // Return null or handle the error as needed
    }

    // return plaintext;

}

// module.exports.encryptionAES = function (value) {

//     // console.log("Code", value);

//     var ciphertext = CryptoJS.AES.encrypt(value, 'newel');

//     //console.log("outputstring", ciphertext);

//     return ciphertext.toString();

// }
module.exports.encryptionAES = function (value) {
    // Convert the value to a JSON string if it's not already
    const jsonString = typeof value === 'string' ? value : JSON.stringify(value);

    // Encrypt the JSON string
    var ciphertext = CryptoJS.AES.encrypt(jsonString, 'newel');

    // Return the encrypted string
    return ciphertext.toString();
}

