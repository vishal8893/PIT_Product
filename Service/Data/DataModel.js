const { extend } = require('joi');
var connect = require('./Connect');
var sequelize = connect.sequelize;
var Sequelize = connect.Sequelize;
const Model = connect.Sequelize.Model;

//Model declaration starts

// USER AND ADMIN ROLE TABLE START
class TBL_ERROR_LOG extends Model { }
class TRD_Email_Status extends Model { }
class TBL_USER_MST extends Model { }
class TBL_USERROLE_MAP extends Model { }
class TBL_ROLE_MST extends Model { }
class TBL_UI_MST extends Model { }
class TBL_UIROLE_MAP extends Model { }
//USER AND ADMIN TABLE END

class TBL_EXPIRY_DATE_MST extends Model { }
class TBL_GREY_LIST_MST extends Model { }
class TBL_GREY_LIST_DETAILSMST extends Model { }
class TBL_RESTRICTED_LIST_MST extends Model { }
class TBL_PRIMARY_ISSUE_REJECTION_LIST_MST extends Model { }
class TBL_MATERIALSUBSIDIARY_MST extends Model { }
class TBL_ENTITY_MST extends Model { }
class TBL_BUSINESSGROUP_MST extends Model { }
class TBL_LOB_MST extends Model { }
class TBL_SBU_MST extends Model { }
class TBL_SUBLOB_MST extends Model { }
class TBL_UPSI_PROJECT_MST extends Model { }
class TBL_UPSI_PROJECT_MST_EMPLOYEEDATA extends Model { }
class TBL_PROJECT_EMPLOYEE_DETAILS extends Model { }

//rinkal code start
class TBL_TREADINGWINDOW_CLOSE_MST extends Model { }
// class TBL_TYPE_MST extends Model { }
class TBL_M3_UPSI_MST extends Model { }
// class TBL_APPL_MST extends Model { }
class TBL_UPSI_MST extends Model { }
class TBL_ENTITY_CEO_BH_MAPPING_MST extends Model { }
class TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST extends Model { }
class TBL_GENERIC_MST extends Model { }
//4 july merging
class TBL_SCRIPT_MST extends Model { }
class TBL_SCRIPT_MST_CHANGES extends Model { }
class TBL_GOVERNMENT_SECURITIES extends Model { }
class TBL_NSE_SCRIPT_DAILY extends Model { }
class TBL_BSE_SCRIPT_DAILY extends Model { }
class TBL_SCRIPT_BAK_MST_HIS extends Model { }
class TBL_SEQ_MST extends Model { }
//rinkal code 24 July
class TBL_USER_CATEGORIZATION_MST extends Model { }
class TBL_TEAM_UPLOAD_MST extends Model { }
class TBL_COMPANY_HIERARCHY_MAPPING extends Model { }
//rinkal code end
class TBL_DESGINATED_CEO_BH_MAPPING_MST extends Model { }
class TBL_DESIGNATION_MST extends Model { }
class TBL_BUSINESS_USER_MST extends Model { }
class TBL_BUSINESSHEAD_MST extends Model { }
class TBL_POB_DECLARATION extends Model { }
class TBL_POB_EMAIL_STATUS extends Model { }
// class TBL_POB_DECLARATION extends Model { }
class TBL_POB_PITCODE_ACCEPT extends Model { }
class TBL_SOS_RIGHT_MST extends Model { }
class TBL_SOS_LOGGEDIN_INFO extends Model { }
class TBL_PIT_APPLICATION_LINK extends Model { }
//rinkal code merging 1 Sep 23 start
class TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO extends Model { }
class TBL_JD_EMPLOYEE_RELATIVE_INFO extends Model { }
class TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS extends Model { }
class TBL_JD_EMP_PHYSICAL_SHARE_HOLDING extends Model { }
class TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO extends Model { }
class TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO extends Model { }
class TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS extends Model { }
class TBL_JD_10PERCENT_STAKE_OTHERS extends Model { }
class TBL_JD_STK_DP extends Model { }
class TBL_JD_EMP_DP extends Model { }
class TBL_JD_REL_DP extends Model { }
class TBL_JD_ROLE_MAPPING extends Model { }
class TBL_JD_ROLE_DETAILS extends Model { }
class TBL_JD_EDU_DETAILS extends Model { }
class TBL_JD_CONTACT_DETAILS extends Model { }
class TBL_JD_PAST_EMP_DETAILS extends Model { }
class TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO extends Model { }
class TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO extends Model { }
class TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO extends Model { }
//rinkal code merging 1 Sep 23 end
class TBL_EAH_10PERCENT_STAKE_OTHERS extends Model { }
// class TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS extends Model { }
class TBL_EAH_COMMODITY_OTHER_EXCHANGE extends Model { }
// class TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2 extends Model { }
// class TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2 extends Model { }
// class TBL_EAH_DP_EMPLOYEE extends Model { }
// class TBL_EAH_DP_RELATIVE extends Model { }
class TBL_EAH_EMAIL_STATUS extends Model { }
// class TBL_EAH_EMP_DP_ANAGRAM extends Model { }
class TBL_EAH_EMP_DP_ENTITY extends Model { }
class TBL_EAH_EMP_DP_OTHERS extends Model { }
class TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING extends Model { }
class TBL_EAH_EMPLOYEE_AGINGDATE extends Model { }
class TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO extends Model { }
// class TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS extends Model { }
class TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO extends Model { }
class TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP extends Model { }
// class TBL_EAH_EMPLOYEE_ONBEHALF extends Model { }
class TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO extends Model { }
class TBL_EAH_EMPLOYEE_QUALIFICATION_INFO extends Model { }
class TBL_EAH_EMPLOYEE_RELATIVE_INFO extends Model { }
class TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS extends Model { }
class TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO extends Model { }
class TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS extends Model { }
class TBL_EAH_EMPLOYEE_WORKEX_INFO extends Model { }
class TBL_EAH_MANCO_MASTER extends Model { }
// class TBL_EAH_REL_DP_ANAGRAM extends Model { }
class TBL_EAH_REL_DP_ENTITY extends Model { }
class TBL_EAH_REL_DP_OTHERS extends Model { }
// class TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS extends Model { }
class TBL_EAH_SCHEDULER_LOG extends Model { }
// class TBL_EAH_STAKE_DP_SHARES_HOLDINGS extends Model { }
// class TBL_EAH_STK_DP_ANAGRAM extends Model { }
class TBL_EAH_STK_DP_ENTITY extends Model { }
class TBL_EAH_STK_DP_OTHERS extends Model { }
class TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO extends Model { }
class TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO extends Model { }
class TBL_EAH_10PERCENT_STAKE_ENTITY extends Model { }
// class TBL_EAH_DP_STACK extends Model { }
class TBL_EAH_REOPEN_LOG extends Model { }
class TBL_ITRADING_PRIMARY_ISSUE_MST extends Model { }

class TBL_PCOIDetails extends Model { }
class TBL_QuarterMaster extends Model { }
class TBL_IRF_Approval_Data extends Model { }
class Tbl_Employee_AccountCode_Mapping extends Model { }
class EIRF_NON_D_USER_TRACKER extends Model { }
class EIRF_RICO_IBEATS_ResignedEmp_AccountCode extends Model { }
class EIRF_Disclaimer_Status extends Model { }

class TBL_RISKCATEGORY_MAIL extends Model { }
class TBL_RMSCATEGORY_LOG extends Model { }
class TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG extends Model { }
class TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION extends Model { }
class TBL_USERMASTER_LOG extends Model { }
class TBL_DEPENDENT_CENTRALREPO extends Model { }
class TBL_DEPENDENT_CENTRALREPO_BAK_HIS extends Model { }
class TBL_DEPENDENT_CENTRALREPO_NEW extends Model { }
class TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL extends Model { }
class TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING extends Model { }
class TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS extends Model { }
class TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA extends Model { }
class TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS extends Model { }
class TBL_SCRIPT_MST_FOR_TRADE_RECON extends Model { }
class TBL_SCOI_ACCEPT_LOG extends Model { }
class TBL_SCOI_DATA extends Model { }
class TBL_SCOI_EMAIL_SEND_STATUS extends Model { }
class TBL_UPSI_PROJECT_USER_CATEGORIZATION extends Model { }
class TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA extends Model { }
class TBL_ViolationRemarksDetails extends Model { }
class TBL_UPSI_EMPLOYEE_DETAILS extends Model { }
class TBL_UPSI_AUDIT_DETAILS extends Model { }
class TBL_UPSI_PROJECT_SCRIPT_DETAILS extends Model { }
class TBL_UPSI_AUDITOR_FILE_SAVE extends Model { }
class TBL_Holiday_Master extends Model { }
class TBL_PCOI_MAIL_SEND_LOG extends Model { }
class TBL_HELP_DESK_DATA extends Model { }
class TBL_HELP_DESK_QUERY_DATA extends Model { }

class TBL_HRMS_EMP_RELATIONINFORMATION extends Model { }
class TBL_HRMS_EMPLOYEE_INFORMATION extends Model { }
class TBL_HRMS_EMP_EMAIL extends Model { }
class TBL_HRMS_EMP_EMERGENCY_CONTACT extends Model { }
class TBL_HRMS_EMP_VOICE_DETAILS extends Model { }
class TBL_HRMS_EMP_ADDRESS extends Model { }
class TBL_HRMS_EMP_WORKEX_DATA_EAH extends Model { }
class TBL_HRMS_EMP_QUALIFICATION_DATA_EAH extends Model { }
class TBL_HRMS_EMP_NATIONALITY extends Model { }
class TBL_HRMS_COMPANY_HIERARCHY_MAPPING extends Model { }

class TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG extends Model { }
class eirf_rico_sos_emp_mapping extends Model { }
class TBL_FNOROLLOVER_EXPIRYDATA extends Model { }
class TBL_DP_HOLDING_DATA extends Model { }
class TBL_FUND_MANAGER_LISTDATA extends Model { }
class TBL_FUND_MANAGER_LISTDATA_HIS extends Model { }
class TBL_SCRIPT_AUTOMATION_LOGS extends Model { }
class TBL_FO_LOTS_DAILY extends Model { }
class EIRF_FO_3Months_LOTS_DAILY extends Model { }
class TBL_IRF_Digitalplatform_ApprovalRes extends Model { }
class TBL_UPSI_BLOCKINGFILE_LOG extends Model { }
class TBL_UPSI_VIRTUAL_SERVER_MST extends Model { }
class TBL_BENPOS_SHAREHOLDER_DETAILS extends Model { }
class ER_USER_SESSION_DETAILS extends Model { }


/////vishal///
class TBL_DP_ALLOCATION_APPROVAL extends Model { }

//USER AND ADMIN TABLE MODEL START BHUSHAN CODE///
module.exports.TBL_ERROR_LOG = function () {
    TBL_ERROR_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SERVICENAME: { type: Sequelize.STRING(100), allowNull: true },
        FUNCTIONNAME: { type: Sequelize.STRING(100), allowNull: true },
        ERROROBJECT: { type: Sequelize.TEXT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // MODIFIED_ON: { 
        //     type: Sequelize.DATE, 
        //     allowNull: true, 
        //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
        //     timezone: 'UTC' 
        //   }

        // MODIFIED_ON: { 
        //     type: Sequelize.DATE(6), 
        //     allowNull: true, 
        //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
        //   },

        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_ERROR_LOG',
            tableName: 'TBL_ERROR_LOG'
        });

    return TBL_ERROR_LOG;
}

// module.exports.TBL_USER_MST = function () {
//     TBL_USER_MST.init({
//         ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         ADD_USER: { type: Sequelize.BOOLEAN, allowNull: true },
//         LOGINID: { type: Sequelize.STRING(100), allowNull: true },
//         EMPCODE: { type: Sequelize.STRING(100), allowNull: true },
//         EMPNAME: { type: Sequelize.STRING(200), allowNull: true },
//         TITLE: { type: Sequelize.STRING(200), allowNull: true },
//         DEPARTMENT: { type: Sequelize.STRING(200), allowNull: true },
//         PHONENUMBER: { type: Sequelize.STRING(200), allowNull: true },
//         EMAILID: { type: Sequelize.STRING(100), allowNull: true },
//         DEFAULTROLEID: { type: Sequelize.INTEGER, allowNull: true },
//         PASSWORD: { type: Sequelize.STRING(100), allowNull: true },
//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_USER_MST',
//             tableName: 'TBL_USER_MST'
//         });
//     exports.TBL_USERROLE_MAP();
//     TBL_USER_MST.hasMany(TBL_USERROLE_MAP);
//     TBL_USER_MST.belongsTo(TBL_USERROLE_MAP, { foreignKey: 'ID', constraints: false, });

//     return TBL_USER_MST;
// }

module.exports.TBL_USERROLE_MAP = function () {
    TBL_USERROLE_MAP.init({
        ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        USERID: { type: Sequelize.INTEGER, allowNull: true },
        ROLEID: { type: Sequelize.INTEGER, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_USERROLE_MAP',
            tableName: 'TBL_USERROLE_MAP'
        });

    exports.TBL_ROLE_MST();
    TBL_USERROLE_MAP.belongsTo(TBL_ROLE_MST, { foreignKey: 'ROLEID' });

    return TBL_USERROLE_MAP;
}

module.exports.TBL_UI_MST = function () {
    TBL_UI_MST.init({
        ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        PARENETID: { type: Sequelize.INTEGER, allowNull: true },
        TITLE: { type: Sequelize.STRING(100), allowNull: true },
        PATH: { type: Sequelize.STRING(2000), allowNull: true },
        ICON: { type: Sequelize.STRING(2000), allowNull: true },
        CSSCLASS: { type: Sequelize.STRING(2000), allowNull: true },
        SEQUENCE: { type: Sequelize.INTEGER, allowNull: true },
        ISCHILD: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UI_MST',
            tableName: 'TBL_UI_MST'
        });

    exports.TBL_UIROLE_MAP();
    TBL_UI_MST.hasMany(TBL_UIROLE_MAP);
    TBL_UI_MST.belongsTo(TBL_UIROLE_MAP, { foreignKey: 'ID', constraints: false, });

    return TBL_UI_MST;
}

module.exports.TBL_UIROLE_MAP = function () {
    TBL_UIROLE_MAP.init({
        ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        UUID: { type: Sequelize.INTEGER, allowNull: true },
        ROLEID: { type: Sequelize.INTEGER, allowNull: true },
        VIEWER: { type: Sequelize.BOOLEAN, allowNull: true },
        MAKER: { type: Sequelize.BOOLEAN, allowNull: true },
        CHECKER: { type: Sequelize.BOOLEAN, allowNull: true },
        APPROVER: { type: Sequelize.BOOLEAN, allowNull: true },
        EDIT: { type: Sequelize.BOOLEAN, allowNull: true },
        EXPORT: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UIROLE_MAP',
            tableName: 'TBL_UIROLE_MAP'
        });

    exports.TBL_ROLE_MST();
    TBL_UIROLE_MAP.belongsTo(TBL_ROLE_MST, { foreignKey: 'ROLEID', });

    return TBL_UIROLE_MAP;
}

module.exports.TBL_ROLE_MST = function () {
    TBL_ROLE_MST.init({
        ID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        NAME: { type: Sequelize.STRING(100), allowNull: true },
        CODE: { type: Sequelize.STRING(100), allowNull: true },
        DESCRIPTION: { type: Sequelize.STRING(2000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_ROLE_MST',
            tableName: 'TBL_ROLE_MST'
        });

    return TBL_ROLE_MST;
}
//USER AND ADMIN TABLE MODEL END BHUSHAN CODE///


module.exports.TBL_EXPIRY_DATE_MST = function () {
    TBL_EXPIRY_DATE_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EXPIRY_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_EXPIRY_DATE_MST',
            tableName: 'TBL_EXPIRY_DATE_MST'
        });

    return TBL_EXPIRY_DATE_MST;
}

module.exports.TBL_GREY_LIST_MST = function () {
    TBL_GREY_LIST_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SCRIPT_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        RESTRICTED: { type: Sequelize.STRING(1), allowNull: true },
        STARTDATE: { type: Sequelize.DATE, allowNull: true },
        ENDDATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true }
    },
        {
            sequelize,
            modelName: 'TBL_GREY_LIST_MST',
            tableName: 'TBL_GREY_LIST_MST'
        });

    return TBL_GREY_LIST_MST;
}

module.exports.TBL_RESTRICTED_LIST_MST = function () {
    TBL_RESTRICTED_LIST_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SCRIPT_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        RESTRICTED: { type: Sequelize.STRING(1), allowNull: true },
        STARTDATE: { type: Sequelize.DATE, allowNull: true },
        ENDDATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_RESTRICTED_LIST_MST',
            tableName: 'TBL_RESTRICTED_LIST_MST'
        });

    return TBL_RESTRICTED_LIST_MST;
}

module.exports.TBL_PRIMARY_ISSUE_REJECTION_LIST_MST = function () {
    TBL_PRIMARY_ISSUE_REJECTION_LIST_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(15), allowNull: true },
        IPOID: { type: Sequelize.STRING(12), allowNull: true },
        RESTRICTED: { type: Sequelize.STRING(1), allowNull: true },
        IPO_NAME: { type: Sequelize.STRING(100), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_PRIMARY_ISSUE_REJECTION_LIST_MST',
            tableName: 'TBL_PRIMARY_ISSUE_REJECTION_LIST_MST'
        });

    return TBL_PRIMARY_ISSUE_REJECTION_LIST_MST;
}

module.exports.TBL_MATERIALSUBSIDIARY_MST = function () {
    TBL_MATERIALSUBSIDIARY_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        MATERIALSUBSIDIARY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        MATERIALSUBSIDIARY_NAME: { type: Sequelize.STRING(500), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_MATERIALSUBSIDIARY_MST',
            tableName: 'TBL_MATERIALSUBSIDIARY_MST'
        });

    return TBL_MATERIALSUBSIDIARY_MST;
}

module.exports.TBL_ENTITY_MST = function () {
    TBL_ENTITY_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ENTITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ENTITY_NAME: { type: Sequelize.STRING(500), allowNull: true },
        IS_BASE_ENTITY: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_ENTITY_MST',
            tableName: 'TBL_ENTITY_MST'
        });

    return TBL_ENTITY_MST;
}

module.exports.TBL_BUSINESSGROUP_MST = function () {
    TBL_BUSINESSGROUP_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BG_NAME: { type: Sequelize.STRING(500), allowNull: true },
        BG_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_BUSINESSGROUP_MST',
            tableName: 'TBL_BUSINESSGROUP_MST'
        });

    return TBL_BUSINESSGROUP_MST;
}

module.exports.TBL_SBU_MST = function () {
    TBL_SBU_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BG_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SBU_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SBU_MST',
            tableName: 'TBL_SBU_MST'
        });

    exports.TBL_BUSINESSGROUP_MST();
    TBL_SBU_MST.belongsTo(TBL_BUSINESSGROUP_MST, { foreignKey: 'BG_ID', });

    return TBL_SBU_MST;
}

module.exports.TBL_LOB_MST = function () {
    TBL_LOB_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BG_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_NAME: { type: Sequelize.STRING(500), allowNull: true },
        LOB_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_LOB_MST',
            tableName: 'TBL_LOB_MST'
        });
    exports.TBL_BUSINESSGROUP_MST();
    TBL_LOB_MST.belongsTo(TBL_BUSINESSGROUP_MST, { foreignKey: 'BG_ID', });

    exports.TBL_SBU_MST();
    TBL_LOB_MST.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    return TBL_LOB_MST;
}

module.exports.TBL_SUBLOB_MST = function () {
    TBL_SUBLOB_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BG_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        SUBLOB_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SUBLOB_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SUBLOB_MST',
            tableName: 'TBL_SUBLOB_MST'
        });
    exports.TBL_BUSINESSGROUP_MST();
    TBL_SUBLOB_MST.belongsTo(TBL_BUSINESSGROUP_MST, { foreignKey: 'BG_ID', });

    exports.TBL_SBU_MST();
    TBL_SUBLOB_MST.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    exports.TBL_LOB_MST();
    TBL_SUBLOB_MST.belongsTo(TBL_LOB_MST, { foreignKey: 'LOB_ID', });

    return TBL_SUBLOB_MST;
}

//omkar code merge start 30 May start
module.exports.TBL_USER_MST = function () {
    TBL_USER_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPNO: { type: Sequelize.STRING(50), allowNull: true },
        FIRSTNAME: { type: Sequelize.STRING(500), allowNull: true },
        LASTNAME: { type: Sequelize.STRING(50), allowNull: true },
        LOGINID: { type: Sequelize.STRING(255), allowNull: true },
        PASSWORD: { type: Sequelize.STRING(100), allowNull: true },
        DEPARTMENT: { type: Sequelize.STRING(500), allowNull: true },
        EMAILID: { type: Sequelize.STRING(255), allowNull: true },
        DSIGNATED: { type: Sequelize.BOOLEAN, allowNull: true },
        GREYLIST: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADEREMAILIDS: { type: Sequelize.STRING(550), allowNull: true },
        ISIECOMPLIANCEMEMBER: { type: Sequelize.BOOLEAN, allowNull: true },
        ISRESEARCHANALYST: { type: Sequelize.BOOLEAN, allowNull: true },
        ISQUANTITATIVERESEARCHANALYST: { type: Sequelize.BOOLEAN, allowNull: true },
        ISGWMRAMEMBER: { type: Sequelize.BOOLEAN, allowNull: true },
        ISACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        EFSLDESIGNATED: { type: Sequelize.BOOLEAN, allowNull: true },
        ISEBUSINESSDESIGNATEDGI: { type: Sequelize.BOOLEAN, allowNull: true },
        ISETLI: { type: Sequelize.BOOLEAN, allowNull: true },
        ISEGI: { type: Sequelize.BOOLEAN, allowNull: true },
        ISGM: { type: Sequelize.BOOLEAN, allowNull: true },
        ENTITY: { type: Sequelize.BIGINT, allowNull: true },
        PANCARDNO: { type: Sequelize.STRING(20), allowNull: true },
        DESIGNATION: { type: Sequelize.STRING(500), allowNull: true },
        SBU: { type: Sequelize.BIGINT, allowNull: true },
        SLOB: { type: Sequelize.BIGINT, allowNull: true },
        EMPJOINDATE: { type: Sequelize.DATE, allowNull: true },
        BG: { type: Sequelize.BIGINT, allowNull: true },
        RESIGNDATE: { type: Sequelize.DATE, allowNull: true },
        RA_ID: { type: Sequelize.STRING(50), allowNull: true },
        BUSINESSDESIGNATED: { type: Sequelize.BOOLEAN, allowNull: true },
        DEFAULTROLEID: { type: Sequelize.INTEGER, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        ENTRYTYPE: { type: Sequelize.STRING(30), allowNull: true },
        ENTITYDESIGN: { type: Sequelize.STRING(1), allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_USER_MST',
            tableName: 'TBL_USER_MST'
        });

    // exports.TBL_USERROLE_MAP();
    // TBL_USER_MST.hasMany(TBL_USERROLE_MAP);
    // TBL_USER_MST.belongsTo(TBL_USERROLE_MAP, { foreignKey: 'ID', constraints: false, });

    exports.TBL_ENTITY_MST();
    // TBL_USER_MST.hasMany(TBL_ENTITY_MST);
    TBL_USER_MST.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY' });

    exports.TBL_BUSINESSGROUP_MST();
    // TBL_USER_MST.hasMany(TBL_BUSINESSGROUP_MST);
    TBL_USER_MST.belongsTo(TBL_BUSINESSGROUP_MST, { foreignKey: 'BG' });

    exports.TBL_SBU_MST();
    // TBL_USER_MST.hasMany(TBL_SBU_MST);
    TBL_USER_MST.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU' });

    exports.TBL_SUBLOB_MST();
    // TBL_USER_MST.hasMany(TBL_SUBLOB_MST);
    TBL_USER_MST.belongsTo(TBL_SUBLOB_MST, { foreignKey: 'SLOB' });
    return TBL_USER_MST;
};
//omkar code merged end 30 may

//rinkal code start
module.exports.TBL_TREADINGWINDOW_CLOSE_MST = function () {
    TBL_TREADINGWINDOW_CLOSE_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        FROM_DATE: { type: Sequelize.DATE, allowNull: true },
        TO_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_TREADINGWINDOW_CLOSE_MST',
            tableName: 'TBL_TREADINGWINDOW_CLOSE_MST'
        });

    return TBL_TREADINGWINDOW_CLOSE_MST;
}

// module.exports.TBL_TYPE_MST = function () {
//     TBL_TYPE_MST.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         TYPE_NAME: { type: Sequelize.STRING(200), allowNull: true },
//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

//     },
//         {
//             sequelize,
//             modelName: 'TBL_TYPE_MST',
//             tableName: 'TBL_TYPE_MST'
//         });

//     return TBL_TYPE_MST;
// }

module.exports.TBL_M3_UPSI_MST = function () {
    TBL_M3_UPSI_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMP_NAME: { type: Sequelize.STRING(500), allowNull: true },
        TYPE_ID: { type: Sequelize.INTEGER, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_M3_UPSI_MST',
            tableName: 'TBL_M3_UPSI_MST'
        });

    exports.TBL_GENERIC_MST();
    TBL_M3_UPSI_MST.belongsTo(TBL_GENERIC_MST, { foreignKey: 'TYPE_ID', });

    // exports.TBL_USER_MST();
    // TBL_M3_UPSI_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_M3_UPSI_MST;
}

// module.exports.TBL_APPL_MST = function () {
//     TBL_APPL_MST.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         APPL_NAME: { type: Sequelize.STRING(200), allowNull: true },
//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

//     },
//         {
//             sequelize,
//             modelName: 'TBL_APPL_MST',
//             tableName: 'TBL_APPL_MST'
//         });

//     return TBL_APPL_MST;
// }

module.exports.TBL_UPSI_MST = function () {
    TBL_UPSI_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMP_NAME: { type: Sequelize.STRING(500), allowNull: true },
        APPL_ID: { type: Sequelize.INTEGER, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_MST',
            tableName: 'TBL_UPSI_MST'
        });

    exports.TBL_GENERIC_MST();
    TBL_UPSI_MST.belongsTo(TBL_GENERIC_MST, { foreignKey: 'APPL_ID', });

    // exports.TBL_USER_MST();
    // TBL_UPSI_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_UPSI_MST;
}

module.exports.TBL_ENTITY_CEO_BH_MAPPING_MST = function () {
    TBL_ENTITY_CEO_BH_MAPPING_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMP_NAME: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_ENTITY_CEO_BH_MAPPING_MST',
            tableName: 'TBL_ENTITY_CEO_BH_MAPPING_MST'
        });

    exports.TBL_ENTITY_MST();
    TBL_ENTITY_CEO_BH_MAPPING_MST.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    // exports.TBL_USER_MST();
    // TBL_ENTITY_CEO_BH_MAPPING_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_ENTITY_CEO_BH_MAPPING_MST;
}

module.exports.TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST = function () {
    TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMP_NAME: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        MATERIAL_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST',
            tableName: 'TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST'
        });

    // exports.TBL_USER_MST();
    // TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    exports.TBL_ENTITY_MST();
    TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_MATERIALSUBSIDIARY_MST();
    TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST.belongsTo(TBL_MATERIALSUBSIDIARY_MST, { foreignKey: 'MATERIAL_ID', });

    return TBL_ENTITY_MATERIALSUBSIDIARY_CEO_BH_MAPPING_MST;
}

module.exports.TBL_GENERIC_MST = function () {
    TBL_GENERIC_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        GROUP_NAME: { type: Sequelize.STRING(200), allowNull: true },
        NAME: { type: Sequelize.STRING(500), allowNull: true },
        GRPUP_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_GENERIC_MST',
            tableName: 'TBL_GENERIC_MST'
        });



    return TBL_GENERIC_MST;
}
// 4 July merging

module.exports.TBL_SCRIPT_MST = function () {
    TBL_SCRIPT_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TRX_NO: { type: Sequelize.STRING(50), allowNull: true },
        LOCATION: { type: Sequelize.STRING(10), allowNull: true },
        COMPANY: { type: Sequelize.STRING(10), allowNull: true },
        BSE_CODE: { type: Sequelize.STRING(10), allowNull: true },
        NSE_BSE_CODE: { type: Sequelize.STRING(100), allowNull: true },
        NSE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        LOT_SIZE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        ISIN_CODE: { type: Sequelize.STRING(12), allowNull: true },
        BLOOMBERG_CODE: { type: Sequelize.STRING(30), allowNull: true },
        REUTERS_CODE: { type: Sequelize.STRING(10), allowNull: true },
        SEDOL_CODE: { type: Sequelize.STRING(12), allowNull: true },
        DIVIDEND_DATE: { type: Sequelize.DATE, allowNull: true },
        RESTRICTED_RESET: { type: Sequelize.STRING(1), allowNull: true },
        SCRIP_DESC: { type: Sequelize.STRING(100), allowNull: true },
        HOLDING_PERIOD: { type: Sequelize.DECIMAL(5, 0), allowNull: true, defaultValue: 30 },
        IRF_FORMATS: { type: Sequelize.STRING(2), allowNull: true, defaultValue: 1 },
        BSE_GROUP_Name: { type: Sequelize.STRING(50), allowNull: true },

        EXCHANGE: { type: Sequelize.BIGINT, allowNull: true },
        NATURE_OF_TRADE: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SCRIPT_MST',
            tableName: 'TBL_SCRIPT_MST'
        });

    exports.TBL_GENERIC_MST();
    TBL_SCRIPT_MST.belongsTo(TBL_GENERIC_MST, { as: 'Exchange', foreignKey: 'EXCHANGE' });

    exports.TBL_GENERIC_MST();
    TBL_SCRIPT_MST.belongsTo(TBL_GENERIC_MST, { as: 'NatureOfTrade', foreignKey: 'NATURE_OF_TRADE' });

    return TBL_SCRIPT_MST;
}

module.exports.TBL_SCRIPT_MST_CHANGES = function () {
    TBL_SCRIPT_MST_CHANGES.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        OLD_SCRIPT_CODE: { type: Sequelize.STRING(300), allowNull: true },
        OLD_SCRIPT_NAME: { type: Sequelize.STRING(3000), allowNull: true },
        OLD_ISIN_NO: { type: Sequelize.STRING(300), allowNull: true },
        NEW_SCRIPT_CODE: { type: Sequelize.STRING(300), allowNull: true },
        NEW_SCRIPT_NAME: { type: Sequelize.STRING(3000), allowNull: true },
        NEW_ISIN_NO: { type: Sequelize.STRING(300), allowNull: true },
        ACTION: { type: Sequelize.STRING(25), allowNull: true },
        EXCHANGE: { type: Sequelize.STRING(10), allowNull: true },

        OLD_BSE_CODE: { type: Sequelize.STRING(300), allowNull: true },
        NEW_BSE_CODE: { type: Sequelize.STRING(300), allowNull: true },
        OLD_BSE_GROUP: { type: Sequelize.STRING(25), allowNull: true },
        NEW_BSE_GROUP: { type: Sequelize.STRING(25), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SCRIPT_MST_CHANGES',
            tableName: 'TBL_SCRIPT_MST_CHANGES'
        });

    return TBL_SCRIPT_MST_CHANGES;
}

module.exports.TBL_GOVERNMENT_SECURITIES = function () {
    TBL_GOVERNMENT_SECURITIES.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ISIN: { type: Sequelize.STRING(250), allowNull: true },
        NSE_CODE: { type: Sequelize.STRING(250), allowNull: true },
        BSE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        BSE_GROUP: { type: Sequelize.STRING(250), allowNull: true },
        SCRIP_NAME: { type: Sequelize.STRING(100), allowNull: true },

        TRX_NO: { type: Sequelize.STRING(250), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_GOVERNMENT_SECURITIES',
            tableName: 'TBL_GOVERNMENT_SECURITIES'
        });

    return TBL_GOVERNMENT_SECURITIES;
}

module.exports.TBL_NSE_SCRIPT_DAILY = function () {
    TBL_NSE_SCRIPT_DAILY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SYMBOL: { type: Sequelize.STRING(1000), allowNull: true },
        COMPANY_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(1000), allowNull: true },
        SERIES: { type: Sequelize.STRING(1000), allowNull: true },
        DATE_OF_LISTING: { type: Sequelize.STRING(200), allowNull: true },
        PAID_UP_VALUE: { type: Sequelize.STRING(1000), allowNull: true },
        MARKET_LOT: { type: Sequelize.STRING(1000), allowNull: true },
        FACE_VALUE: { type: Sequelize.STRING(1000), allowNull: true },

        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_NSE_SCRIPT_DAILY',
            tableName: 'TBL_NSE_SCRIPT_DAILY'
        });

    return TBL_NSE_SCRIPT_DAILY;
}

module.exports.TBL_BSE_SCRIPT_DAILY = function () {
    TBL_BSE_SCRIPT_DAILY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BSE_CODE: { type: Sequelize.STRING(150), allowNull: true },
        ISIN_NO: { type: Sequelize.STRING(150), allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(3000), allowNull: true },
        BSE_GROUP: { type: Sequelize.STRING(50), allowNull: true },
        STATUS: { type: Sequelize.STRING(50), allowNull: true },

        SCRIPT_ID: { type: Sequelize.STRING(300), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_BSE_SCRIPT_DAILY',
            tableName: 'TBL_BSE_SCRIPT_DAILY'
        });

    return TBL_BSE_SCRIPT_DAILY;
}

module.exports.TBL_SCRIPT_BAK_MST_HIS = function () {
    TBL_SCRIPT_BAK_MST_HIS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        LOG_ID: { type: Sequelize.DECIMAL(18, 0), allowNull: true },
        TRX_NO: { type: Sequelize.STRING(50), allowNull: true },
        LOCATION: { type: Sequelize.STRING(10), allowNull: true },
        COMPANY: { type: Sequelize.STRING(10), allowNull: true },

        BSE_CODE: { type: Sequelize.STRING(10), allowNull: true },
        NSE_BSE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        NSE_CODE: { type: Sequelize.STRING(100), allowNull: true },
        LOT_SIZE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        ISIN_CODE: { type: Sequelize.STRING(12), allowNull: true },
        BLOOMBERG_CODE: { type: Sequelize.STRING(30), allowNull: true },
        REUTERS_CODE: { type: Sequelize.STRING(10), allowNull: true },
        SEDOL_CODE: { type: Sequelize.STRING(12), allowNull: true },
        DIVIDEND_DATE: { type: Sequelize.DATE, allowNull: true },
        RESTRICTED_RESET: { type: Sequelize.STRING(1), allowNull: true },
        SCRIP_DESC: { type: Sequelize.STRING(100), allowNull: true },
        HOLDING_PERIOD: { type: Sequelize.DECIMAL(5, 0), allowNull: true },
        IRF_FORMATS: { type: Sequelize.STRING(2), allowNull: true },
        BSE_GROUP_Name: { type: Sequelize.STRING(50), allowNull: true },

        EXCHANGE: { type: Sequelize.BIGINT, allowNull: true },
        NATURE_OF_TRADE: { type: Sequelize.BIGINT, allowNull: true },

        CREATED_LOG_BY: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_LOG_DATE: { type: Sequelize.DATE, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SCRIPT_BAK_MST_HIS',
            tableName: 'TBL_SCRIPT_BAK_MST_HIS'
        });

    exports.TBL_GENERIC_MST();
    TBL_SCRIPT_BAK_MST_HIS.belongsTo(TBL_GENERIC_MST, { as: 'Exchange', foreignKey: 'EXCHANGE' });

    exports.TBL_GENERIC_MST();
    TBL_SCRIPT_BAK_MST_HIS.belongsTo(TBL_GENERIC_MST, { as: 'NatureOfTrade', foreignKey: 'NATURE_OF_TRADE' });

    return TBL_SCRIPT_BAK_MST_HIS;
}

module.exports.TBL_SEQ_MST = function () {
    TBL_SEQ_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        COMPANY: { type: Sequelize.STRING(10), allowNull: true },
        LOCATION: { type: Sequelize.STRING(10), allowNull: true },
        SQ_CODE: { type: Sequelize.STRING(100), allowNull: true },
        SQ_MASK: { type: Sequelize.STRING(20), allowNull: true },
        SQ_NUMBER: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SEQ_MST',
            tableName: 'TBL_SEQ_MST'
        });

    return TBL_SEQ_MST;
}
//rnikal code end

module.exports.TBL_DESIGNATION_MST = function () {
    TBL_DESIGNATION_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        DESIGNATION: { type: Sequelize.STRING(200), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_DESIGNATION_MST',
            tableName: 'TBL_DESIGNATION_MST'
        });



    return TBL_DESIGNATION_MST;
}

module.exports.TBL_BUSINESS_USER_MST = function () {
    TBL_BUSINESS_USER_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPID: { type: Sequelize.STRING(500), allowNull: true },
        BUSINESS_NAME: { type: Sequelize.STRING(100), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_BUSINESS_USER_MST',
            tableName: 'TBL_BUSINESS_USER_MST'
        });



    return TBL_BUSINESS_USER_MST;
}

module.exports.TBL_DESGINATED_CEO_BH_MAPPING_MST = function () {
    TBL_DESGINATED_CEO_BH_MAPPING_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMP_NAME: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_DESGINATED_CEO_BH_MAPPING_MST',
            tableName: 'TBL_DESGINATED_CEO_BH_MAPPING_MST'
        });

    exports.TBL_ENTITY_MST();
    TBL_DESGINATED_CEO_BH_MAPPING_MST.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    // exports.TBL_USER_MST();
    // TBL_DESGINATED_CEO_BH_MAPPING_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_DESGINATED_CEO_BH_MAPPING_MST;
}

module.exports.TBL_BUSINESSHEAD_MST = function () {
    TBL_BUSINESSHEAD_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        BG_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        SUBLOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_BUSINESSHEAD_MST',
            tableName: 'TBL_BUSINESSHEAD_MST'
        });

    exports.TBL_BUSINESSGROUP_MST();
    TBL_BUSINESSHEAD_MST.belongsTo(TBL_BUSINESSGROUP_MST, { foreignKey: 'BG_ID', });

    exports.TBL_SBU_MST();
    TBL_BUSINESSHEAD_MST.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    exports.TBL_LOB_MST();
    TBL_BUSINESSHEAD_MST.belongsTo(TBL_LOB_MST, { foreignKey: 'LOB_ID', });

    exports.TBL_SUBLOB_MST();
    TBL_BUSINESSHEAD_MST.belongsTo(TBL_SUBLOB_MST, { foreignKey: 'SUBLOB_ID', });

    return TBL_BUSINESSHEAD_MST;
}

module.exports.TBL_USER_CATEGORIZATION_MST = function () {
    TBL_USER_CATEGORIZATION_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        SUBLOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        CEO_TWO_LEVEL_DOWN: { type: Sequelize.BOOLEAN, allowNull: true },
        SVP_ABOVE: { type: Sequelize.BOOLEAN, allowNull: true },
        ALL_EMPLOYEEES: { type: Sequelize.BOOLEAN, allowNull: true },
        TEAM_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_USER_CATEGORIZATION_MST',
            tableName: 'TBL_USER_CATEGORIZATION_MST'
        });

    exports.TBL_ENTITY_MST();
    TBL_USER_CATEGORIZATION_MST.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_SBU_MST();
    TBL_USER_CATEGORIZATION_MST.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    exports.TBL_LOB_MST();
    TBL_USER_CATEGORIZATION_MST.belongsTo(TBL_LOB_MST, { foreignKey: 'LOB_ID', });

    exports.TBL_SUBLOB_MST();
    TBL_USER_CATEGORIZATION_MST.belongsTo(TBL_SUBLOB_MST, { foreignKey: 'SUBLOB_ID', });

    return TBL_USER_CATEGORIZATION_MST;
}

module.exports.TBL_TEAM_UPLOAD_MST = function () {
    TBL_TEAM_UPLOAD_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        TEAM_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_TEAM_UPLOAD_MST',
            tableName: 'TBL_TEAM_UPLOAD_MST'
        });

    // exports.TBL_USER_MST();
    // TBL_TEAM_UPLOAD_MST.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_TEAM_UPLOAD_MST;
}

module.exports.TBL_COMPANY_HIERARCHY_MAPPING = function () {
    TBL_COMPANY_HIERARCHY_MAPPING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // MAPPING_ID: { type: Sequelize.BIGINT, allowNull: true },
        CLUSTER_ID: { type: Sequelize.BIGINT, allowNull: true },
        CLUSTER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        SUBLOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_COMPANY_HIERARCHY_MAPPING',
            tableName: 'TBL_COMPANY_HIERARCHY_MAPPING'
        });

    exports.TBL_SBU_MST();
    TBL_COMPANY_HIERARCHY_MAPPING.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    exports.TBL_LOB_MST();
    TBL_COMPANY_HIERARCHY_MAPPING.belongsTo(TBL_LOB_MST, { foreignKey: 'LOB_ID', });

    exports.TBL_SUBLOB_MST();
    TBL_COMPANY_HIERARCHY_MAPPING.belongsTo(TBL_SUBLOB_MST, { foreignKey: 'SUBLOB_ID', });

    return TBL_COMPANY_HIERARCHY_MAPPING;
}
//2 aug developement

module.exports.TBL_POB_DECLARATION = function () {

    TBL_POB_DECLARATION.init({

        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },

        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },

        DECLARE_DATE: { type: Sequelize.DATE, allowNull: true },



        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },

        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },

        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },

        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },

        {

            sequelize,

            modelName: 'TBL_POB_DECLARATION',

            tableName: 'TBL_POB_DECLARATION'

        });



    // exports.TBL_USER_MST();

    // TBL_POB_DECLARATION.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });



    return TBL_POB_DECLARATION;



}

module.exports.TBL_POB_EMAIL_STATUS = function () {
    TBL_POB_EMAIL_STATUS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMAILID: { type: Sequelize.STRING(300), allowNull: true },
        EMAIL_STATUS: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_TRACKEDEMP: { type: Sequelize.STRING(1), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_POB_EMAIL_STATUS',
            tableName: 'TBL_POB_EMAIL_STATUS'
        });

    exports.TBL_USER_MST();
    TBL_POB_EMAIL_STATUS.belongsTo(TBL_USER_MST, { foreignKey: 'EMAILID', });

    // exports.TBL_USER_MST();
    // TBL_POB_EMAIL_STATUS.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_POB_EMAIL_STATUS;

}

// module.exports.TBL_POB_DECLARATION = function () {
//     TBL_POB_DECLARATION.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DECLARE_DATE: { type: Sequelize.DATE, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_POB_DECLARATION',
//             tableName: 'TBL_POB_DECLARATION'
//         });

//     exports.TBL_USER_MST();
//     TBL_POB_DECLARATION.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

//     return TBL_POB_DECLARATION;

// }

module.exports.TBL_POB_PITCODE_ACCEPT = function () {
    TBL_POB_PITCODE_ACCEPT.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        ACCEPT_DATE: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_POB_PITCODE_ACCEPT',
            tableName: 'TBL_POB_PITCODE_ACCEPT'
        });

    // exports.TBL_USER_MST();
    // TBL_POB_PITCODE_ACCEPT.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_POB_PITCODE_ACCEPT;

}

module.exports.TBL_SOS_RIGHT_MST = function () {
    TBL_SOS_RIGHT_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        APPLICATION_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SOS_RIGHT_MST',
            tableName: 'TBL_SOS_RIGHT_MST'
        });

    return TBL_SOS_RIGHT_MST;

}

module.exports.TBL_SOS_LOGGEDIN_INFO = function () {
    TBL_SOS_LOGGEDIN_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_SSO_LOGGEDIN: { type: Sequelize.STRING(50), allowNull: true },
        SSO_LOGGEDIN_DATE: { type: Sequelize.DATE, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SOS_LOGGEDIN_INFO',
            tableName: 'TBL_SOS_LOGGEDIN_INFO'
        });

    exports.TBL_USER_MST();
    TBL_SOS_LOGGEDIN_INFO.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', });

    return TBL_SOS_LOGGEDIN_INFO;

}

module.exports.TBL_PIT_APPLICATION_LINK = function () {
    TBL_PIT_APPLICATION_LINK.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EIRF_LINK: { type: Sequelize.STRING(1000), allowNull: true },
        EAH_LINK: { type: Sequelize.STRING(1000), allowNull: true },
        POB_LINK: { type: Sequelize.STRING(1000), allowNull: true },
        LANDING_PAGE_LINK: { type: Sequelize.STRING(1000), allowNull: true },

        // IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        // CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        // MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_PIT_APPLICATION_LINK',
            tableName: 'TBL_PIT_APPLICATION_LINK'
        });

    return TBL_PIT_APPLICATION_LINK;

}
//rinkal code merging 1 Sep 23 start

module.exports.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        COMPANY: { type: Sequelize.STRING(100), allowNull: true },
        EMP_JOIN_DATE: { type: Sequelize.DATE, allowNull: true },
        DEPARTMENT: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY1_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY1_SHAREHOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        // IS_EMPLOYEE_ENTITY1: { type: Sequelize.BOOLEAN, allowNull: true },
        // ENTITY2_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY2_SHAREHOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        // IS_EMPLOYEE_ENTITY2: { type: Sequelize.BOOLEAN, allowNull: true },
        SPOUSENAME: { type: Sequelize.STRING(100), allowNull: true },
        SPOUSE_IS_DEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        SUBMITTED: { type: Sequelize.BOOLEAN, allowNull: true },
        SINGLE_STATUS: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_COMMTRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMMODITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_SEC_CODE: { type: Sequelize.STRING(50), allowNull: true },
        EQ_STACK_FLAG: { type: Sequelize.BOOLEAN, allowNull: true },
        COMM_STACK_FLAG: { type: Sequelize.BOOLEAN, allowNull: true },
        STEP_ID: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO'
        });

    return TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_EMPLOYEE_RELATIVE_INFO = function () {
    TBL_JD_EMPLOYEE_RELATIVE_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(500), allowNull: true },
        RELATIONSHIP: { type: Sequelize.BIGINT, allowNull: true },
        REL_OTHER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        // ENTITY1_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY1_SHAREHOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        // IS_RELATIVE_ENTITY1: { type: Sequelize.BOOLEAN, allowNull: true },
        // ENTITY2_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY2_SHAREHOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        // IS_RELATIVE_ENTITY2: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_CODE_NONE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_CODE_NONE2: { type: Sequelize.BOOLEAN, allowNull: true },
        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        IS_DEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        FINANCIAL_INDEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_MINOR: { type: Sequelize.BOOLEAN, allowNull: true },
        PHONE: { type: Sequelize.STRING(50), allowNull: true },
        MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMTRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMSERVICE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMMODITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ID_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_RELATIVE_INFO',
            tableName: 'TBL_JD_EMPLOYEE_RELATIVE_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_EMPLOYEE_RELATIVE_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIONSHIP', });

    return TBL_JD_EMPLOYEE_RELATIVE_INFO;

}

module.exports.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = function () {
    TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        NAME_OF_CONCERN: { type: Sequelize.STRING(50), allowNull: true },
        TYPE_OF_CONCERN: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_OTHER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY1_STAKE_ACCESS: { type: Sequelize.STRING(50), allowNull: true },
        // ENTITY2_STAKE_ACCESS: { type: Sequelize.STRING(50), allowNull: true },
        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        IS_COMM_TRADE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_LTD: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_SERVICES: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS',
            tableName: 'TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'TYPE_OF_CONCERN', });

    return TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS;

}

module.exports.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = function () {
    TBL_JD_EMP_PHYSICAL_SHARE_HOLDING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(2000), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMP_PHYSICAL_SHARE_HOLDING',
            tableName: 'TBL_JD_EMP_PHYSICAL_SHARE_HOLDING'
        });

    return TBL_JD_EMP_PHYSICAL_SHARE_HOLDING;

}

module.exports.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(50), allowNull: true },
        IS_EAH_EMP_MODIFIED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO'
        });

    return TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(50), allowNull: true },
        IS_EAH_EMP_MODIFIED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_ENTITY_MST();
    TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    return TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(50), allowNull: true },
        IS_EAH_EMP_MODIFIED: { type: Sequelize.BOOLEAN, allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_JD_EMPLOYEE_RELATIVE_INFO();
    TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO.belongsTo(TBL_JD_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });

    return TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_ENTITY: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(50), allowNull: true },
        IS_EAH_EMP_MODIFIED: { type: Sequelize.BOOLEAN, allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_ENTITY_MST();
    TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_JD_EMPLOYEE_RELATIVE_INFO();
    TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_JD_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });

    return TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS = function () {
    TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        DP_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
        NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
        NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS',
            tableName: 'TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS'
        });

    return TBL_JD_EMPLOYEE_DP_SHARES_HOLDINGS;

}

module.exports.TBL_JD_10PERCENT_STAKE_OTHERS = function () {
    TBL_JD_10PERCENT_STAKE_OTHERS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        BROKER_NAME_10PERCENT: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_CODE_10PERCENT: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_10PERCENT_STAKE_OTHERS',
            tableName: 'TBL_JD_10PERCENT_STAKE_OTHERS'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_10PERCENT_STAKE_OTHERS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_JD_10PERCENT_STAKE_OTHERS.belongsTo(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });


    return TBL_JD_10PERCENT_STAKE_OTHERS;

}

module.exports.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = function () {
    TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME_10PERCENT: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_CODE_10PERCENT: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_ENTITY_MST();
    TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_JD_STK_DP = function () {
    TBL_JD_STK_DP.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        DP_ACCOUNT: { type: Sequelize.STRING(2000), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        TYPE: { type: Sequelize.STRING(2000), allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(2000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_STK_DP',
            tableName: 'TBL_JD_STK_DP'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_STK_DP.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_JD_STK_DP.belongsTo(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_JD_STK_DP;

}

module.exports.TBL_JD_EMP_DP = function () {
    TBL_JD_EMP_DP.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        DP_ACCOUNT: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(100), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        TYPE: { type: Sequelize.STRING(20), allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(2000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EMP_DP',
            tableName: 'TBL_JD_EMP_DP'
        });

    return TBL_JD_EMP_DP;

}

module.exports.TBL_JD_REL_DP = function () {
    TBL_JD_REL_DP.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        DP_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        TYPE: { type: Sequelize.STRING(2000), allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(2000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_REL_DP',
            tableName: 'TBL_JD_REL_DP'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_REL_DP.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_JD_EMPLOYEE_RELATIVE_INFO();
    TBL_JD_REL_DP.belongsTo(TBL_JD_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });


    return TBL_JD_REL_DP;

}

module.exports.TBL_JD_ROLE_MAPPING = function () {
    TBL_JD_ROLE_MAPPING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RolE_ID: { type: Sequelize.BIGINT, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_ROLE_MAPPING',
            tableName: 'TBL_JD_ROLE_MAPPING'
        });

    return TBL_JD_ROLE_MAPPING;

}

module.exports.TBL_JD_ROLE_DETAILS = function () {
    TBL_JD_ROLE_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        BG: { type: Sequelize.STRING(1000), allowNull: true },
        SBU: { type: Sequelize.STRING(1000), allowNull: true },
        LOB: { type: Sequelize.STRING(1000), allowNull: true },
        SUBLOB: { type: Sequelize.STRING(1000), allowNull: true },
        IsIE: { type: Sequelize.STRING(20), allowNull: true },
        IsEGI: { type: Sequelize.STRING(20), allowNull: true },
        IsETLI: { type: Sequelize.STRING(20), allowNull: true },
        IsGM: { type: Sequelize.STRING(20), allowNull: true },
        IsIB: { type: Sequelize.STRING(20), allowNull: true },
        IsCFI: { type: Sequelize.STRING(20), allowNull: true },
        IsEAAA: { type: Sequelize.STRING(20), allowNull: true },
        IsEARC: { type: Sequelize.STRING(20), allowNull: true },
        DESIGNATED: { type: Sequelize.STRING(20), allowNull: true },
        ROLL_OUT_YEAR: { type: Sequelize.STRING(40), allowNull: true },
        ROLE: { type: Sequelize.STRING(100), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_ROLE_DETAILS',
            tableName: 'TBL_JD_ROLE_DETAILS'
        });

    return TBL_JD_ROLE_DETAILS;

}

module.exports.TBL_JD_EDU_DETAILS = function () {
    TBL_JD_EDU_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        INSTITUTION: { type: Sequelize.STRING(500), allowNull: true },
        QUALIFICATION: { type: Sequelize.STRING(500), allowNull: true },
        SUB_QUALIFICATION: { type: Sequelize.STRING(500), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_EDU_DETAILS',
            tableName: 'TBL_JD_EDU_DETAILS'
        });

    return TBL_JD_EDU_DETAILS;

}

module.exports.TBL_JD_CONTACT_DETAILS = function () {
    TBL_JD_CONTACT_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        CONTACT_TYPE: { type: Sequelize.BIGINT, allowNull: true },
        CONATCT_NUMBER: { type: Sequelize.STRING(500), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_CONTACT_DETAILS',
            tableName: 'TBL_JD_CONTACT_DETAILS'
        });

    exports.TBL_GENERIC_MST();
    TBL_JD_CONTACT_DETAILS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'CONTACT_TYPE', });


    return TBL_JD_CONTACT_DETAILS;

}

module.exports.TBL_JD_PAST_EMP_DETAILS = function () {
    TBL_JD_PAST_EMP_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        PAST_EMPLOYERS: { type: Sequelize.STRING(200), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_JD_PAST_EMP_DETAILS',
            tableName: 'TBL_JD_PAST_EMP_DETAILS'
        });

    return TBL_JD_PAST_EMP_DETAILS;

}

//rinkal code merging 1 Sep 23 end
module.exports.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = function () {
    TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        COMPANY_NAME: { type: Sequelize.STRING(100), allowNull: true },
        DATE_OF_JOIN: { type: Sequelize.DATE, allowNull: true },
        DEPARTMENT: { type: Sequelize.STRING(50), allowNull: true },
        SPOUSENAME: { type: Sequelize.STRING(50), allowNull: true },
        SPOUSE_IS_DEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        SUBMITTED: { type: Sequelize.BOOLEAN, allowNull: true },
        ANAGRAM_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        SINGLE_STATUS: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_COMMTRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMMODITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_SEC_CODE: { type: Sequelize.STRING(50), allowNull: true },
        EQ_STACK_FLAG: { type: Sequelize.BOOLEAN, allowNull: true },
        COMM_STACK_FLAG: { type: Sequelize.BOOLEAN, allowNull: true },
        STEP_ID: { type: Sequelize.BIGINT, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_EAH_EMP_MODIFIED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO'
        });

    return TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = function () {
    TBL_EAH_EMPLOYEE_QUALIFICATION_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        INSTITUTION: { type: Sequelize.STRING(1000), allowNull: true },
        QUALIFICATION: { type: Sequelize.STRING(1000), allowNull: true },
        SUB_QUALIFICATION: { type: Sequelize.STRING(1000), allowNull: true },
        IS_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_QUALIFICATION_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_QUALIFICATION_INFO'
        });

    return TBL_EAH_EMPLOYEE_QUALIFICATION_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = function () {
    TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        AGINGDATE: { type: Sequelize.DATE, allowNull: true },
        CONTACT_TYPE: { type: Sequelize.BIGINT, allowNull: true },
        CONATCT_NUMBER: { type: Sequelize.STRING(100), allowNull: true },
        IS_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'CONTACT_TYPE', });

    return TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_WORKEX_INFO = function () {
    TBL_EAH_EMPLOYEE_WORKEX_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        PAST_EMPLOYERS: { type: Sequelize.STRING(1000), allowNull: true },
        IS_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_WORKEX_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_WORKEX_INFO'
        });

    return TBL_EAH_EMPLOYEE_WORKEX_INFO;

}

//self account
// module.exports.TBL_EAH_DP_EMPLOYEE = function () {
//     TBL_EAH_DP_EMPLOYEE.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         NAME_OF_BROKER: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_DP_EMPLOYEE',
//             tableName: 'TBL_EAH_DP_EMPLOYEE'
//         });

//     return TBL_EAH_DP_EMPLOYEE;

// }

// module.exports.TBL_EAH_EMP_DP_ANAGRAM = function () {
//     TBL_EAH_EMP_DP_ANAGRAM.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
//         SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_EMP_DP_ANAGRAM',
//             tableName: 'TBL_EAH_EMP_DP_ANAGRAM'
//         });

//     return TBL_EAH_EMP_DP_ANAGRAM;

// }

module.exports.TBL_EAH_EMP_DP_ENTITY = function () {
    TBL_EAH_EMP_DP_ENTITY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMP_DP_ENTITY',
            tableName: 'TBL_EAH_EMP_DP_ENTITY'
        });

    return TBL_EAH_EMP_DP_ENTITY;

}

module.exports.TBL_EAH_EMP_DP_OTHERS = function () {
    TBL_EAH_EMP_DP_OTHERS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        CLIENTNAME: { type: Sequelize.STRING(200), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMP_DP_OTHERS',
            tableName: 'TBL_EAH_EMP_DP_OTHERS'
        });

    return TBL_EAH_EMP_DP_OTHERS;

}

module.exports.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = function () {
    TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO'
        });

    return TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = function () {
    TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_OTHER: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(50), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_ENTITY_MST();
    TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    return TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO;

}

//dependent
module.exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO = function () {
    TBL_EAH_EMPLOYEE_RELATIVE_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(500), allowNull: true },
        RELATIONSHIP: { type: Sequelize.BIGINT, allowNull: true },
        REL_OTHER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        TRADING_CODE_NONE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_CODE_NONE2: { type: Sequelize.BOOLEAN, allowNull: true },
        ANAGRAM_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        IS_DEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_COMTRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMSERVICE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMMODITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ID_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_MINOR: { type: Sequelize.BOOLEAN, allowNull: true },
        PHONE: { type: Sequelize.STRING(50), allowNull: true },
        MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        FINANCIAL_INDEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_RELATIVE_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_RELATIVE_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_RELATIVE_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIONSHIP', });

    return TBL_EAH_EMPLOYEE_RELATIVE_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS = function () {
    TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(500), allowNull: true },
        RELATIONSHIP: { type: Sequelize.BIGINT, allowNull: true },
        REL_OTHER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        TRADING_CODE_NONE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_CODE_NONE2: { type: Sequelize.BOOLEAN, allowNull: true },
        ANAGRAM_TRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        IS_DEPENDENT: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_COMTRADE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMSERVICE_CODE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMMODITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ID_EXIST_HRMS: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS',
            tableName: 'TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS'
        });

    return TBL_EAH_EMPLOYEE_RELATIVE_INFO_DELETEDROWS;

}

// module.exports.TBL_EAH_DP_RELATIVE = function () {
//     TBL_EAH_DP_RELATIVE.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         NAME_OF_BROKER: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_DP_RELATIVE',
//             tableName: 'TBL_EAH_DP_RELATIVE'
//         });

//     exports.TBL_GENERIC_MST();
//     TBL_EAH_DP_RELATIVE.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

//     return TBL_EAH_DP_RELATIVE;

// }

// module.exports.TBL_EAH_REL_DP_ANAGRAM = function () {
//     TBL_EAH_REL_DP_ANAGRAM.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
//         SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
//         RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
//         IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_REL_DP_ANAGRAM',
//             tableName: 'TBL_EAH_REL_DP_ANAGRAM'
//         });

//     exports.TBL_GENERIC_MST();
//     TBL_EAH_REL_DP_ANAGRAM.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

//     return TBL_EAH_REL_DP_ANAGRAM;

// }
module.exports.TBL_EAH_REL_DP_ENTITY = function () {
    TBL_EAH_REL_DP_ENTITY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_REL_DP_ENTITY',
            tableName: 'TBL_EAH_REL_DP_ENTITY'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_REL_DP_ENTITY.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    TBL_EAH_REL_DP_ENTITY.belongsTo(TBL_EAH_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });


    return TBL_EAH_REL_DP_ENTITY;

}

module.exports.TBL_EAH_REL_DP_OTHERS = function () {
    TBL_EAH_REL_DP_OTHERS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },
        CLIENTNAME: { type: Sequelize.STRING(200), allowNull: true },


        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_REL_DP_OTHERS',
            tableName: 'TBL_EAH_REL_DP_OTHERS'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_REL_DP_OTHERS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    TBL_EAH_REL_DP_OTHERS.belongsTo(TBL_EAH_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });

    return TBL_EAH_REL_DP_OTHERS;

}

module.exports.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = function () {
    TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_RELATIVE_OTHERS: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO.belongsTo(TBL_EAH_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });

    return TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO;

}

module.exports.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = function () {
    TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(500), allowNull: true },
        REL_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_EMPLOYEE_ENTITY: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO',
            tableName: 'TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_GENERIC_MST, { foreignKey: 'RELATIVE_ID', });

    exports.TBL_ENTITY_MST();
    TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO.belongsTo(TBL_EAH_EMPLOYEE_RELATIVE_INFO, { foreignKey: 'REL_INFO_ID', });

    return TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO;

}

//Material Fin Rel
module.exports.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = function () {
    TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        COMPANY_NAME: { type: Sequelize.STRING(100), allowNull: true },
        MATERIAL_FIN_REL_NAME: { type: Sequelize.STRING(500), allowNull: true },
        MATERIAL_FIN_REL_MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        MATERIAL_FIN_REL_PAN: { type: Sequelize.STRING(30), allowNull: true },
        MATERIAL_FIN_REL_PHONE: { type: Sequelize.STRING(50), allowNull: true },
        PROPERTY_TYPE_ID: { type: Sequelize.BIGINT, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP',
            tableName: 'TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP.belongsTo(TBL_GENERIC_MST, { foreignKey: 'PROPERTY_TYPE_ID', });

    return TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP;

}

//10% stack
module.exports.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = function () {
    TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TYPE_OF_CONCERN: { type: Sequelize.STRING(50), allowNull: true },
        NAME_OF_CONCERN: { type: Sequelize.STRING(50), allowNull: true },
        ANAGRAM_STACK_ACC: { type: Sequelize.STRING(50), allowNull: true },
        CONCERN_OTHER_NAME: { type: Sequelize.STRING(50), allowNull: true },
        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        IS_COMM_TRADE: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_LTD: { type: Sequelize.STRING(50), allowNull: true },
        IS_COMM_SERVICES: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS',
            tableName: 'TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });


    return TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS;

}

module.exports.TBL_EAH_10PERCENT_STAKE_OTHERS = function () {
    TBL_EAH_10PERCENT_STAKE_OTHERS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        BROKER_NAME_10PERCENT: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_CODE_10PERCENT: { type: Sequelize.STRING(50), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_10PERCENT_STAKE_OTHERS',
            tableName: 'TBL_EAH_10PERCENT_STAKE_OTHERS'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_10PERCENT_STAKE_OTHERS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_EAH_10PERCENT_STAKE_OTHERS.belongsTo(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_EAH_10PERCENT_STAKE_OTHERS;

}

module.exports.TBL_EAH_10PERCENT_STAKE_ENTITY = function () {
    TBL_EAH_10PERCENT_STAKE_ENTITY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        ENTITY_NAME_10PERCENT: { type: Sequelize.STRING(2000), allowNull: true },
        TRADING_CODE_10PERCENT: { type: Sequelize.STRING(50), allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_10PERCENT_STAKE_ENTITY',
            tableName: 'TBL_EAH_10PERCENT_STAKE_ENTITY'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_10PERCENT_STAKE_ENTITY.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_ENTITY_MST();
    TBL_EAH_10PERCENT_STAKE_ENTITY.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_EAH_10PERCENT_STAKE_ENTITY.belongsTo(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_EAH_10PERCENT_STAKE_ENTITY;

}

// module.exports.TBL_EAH_DP_STACK = function () {
//     TBL_EAH_DP_STACK.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         NAME_OF_BROKER: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NUMBER: { type: Sequelize.STRING(50), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_DP_STACK',
//             tableName: 'TBL_EAH_DP_STACK'
//         });

//     exports.TBL_GENERIC_MST();
//     TBL_EAH_DP_STACK.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

//     return TBL_EAH_DP_STACK;

// }

// module.exports.TBL_EAH_STK_DP_ANAGRAM = function () {
//     TBL_EAH_STK_DP_ANAGRAM.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
//         SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_STK_DP_ANAGRAM',
//             tableName: 'TBL_EAH_STK_DP_ANAGRAM'
//         });

//     exports.TBL_GENERIC_MST();
//     TBL_EAH_STK_DP_ANAGRAM.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

//     return TBL_EAH_STK_DP_ANAGRAM;

// }

module.exports.TBL_EAH_STK_DP_ENTITY = function () {
    TBL_EAH_STK_DP_ENTITY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        AUTHORIZE_EW: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_STK_DP_ENTITY',
            tableName: 'TBL_EAH_STK_DP_ENTITY'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_STK_DP_ENTITY.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_EAH_STK_DP_ENTITY.belongsTo(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_EAH_STK_DP_ENTITY;

}

module.exports.TBL_EAH_STK_DP_OTHERS = function () {
    TBL_EAH_STK_DP_OTHERS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
        CONCERN_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        CONCERN_INFO_ID: { type: Sequelize.BIGINT, allowNull: true },
        DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
        DP_BROKER_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        PROVIDE_DEMAT: { type: Sequelize.BOOLEAN, allowNull: true },
        SHARE_HOLDING_AVAILABLE: { type: Sequelize.BOOLEAN, allowNull: true },
        TRADING_OPTION: { type: Sequelize.STRING(5), allowNull: true },
        IS_UPLOAD: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        UPLOAD_DATE: { type: Sequelize.DATE, allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_STK_DP_OTHERS',
            tableName: 'TBL_EAH_STK_DP_OTHERS'
        });

    exports.TBL_GENERIC_MST();
    TBL_EAH_STK_DP_OTHERS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'EMPLOYEE_CONCERN_ID', });

    exports.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    TBL_EAH_STK_DP_OTHERS.belongsTo(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, { foreignKey: 'CONCERN_INFO_ID', });

    return TBL_EAH_STK_DP_OTHERS;

}


//security holdigs 
// module.exports.TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS = function () {
//     TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
//         NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
//         NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },
//         RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS',
//             tableName: 'TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS'
//         });

//     return TBL_EAH_EMPLOYEE_DP_SHARES_HOLDINGS;

// }

// module.exports.TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS = function () {
//     TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
//         NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
//         NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS',
//             tableName: 'TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS'
//         });

//     return TBL_EAH_RELATIVE_DP_SHARES_HOLDINGS;

// }

// module.exports.TBL_EAH_STAKE_DP_SHARES_HOLDINGS = function () {
//     TBL_EAH_STAKE_DP_SHARES_HOLDINGS.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         EMPLOYEE_CONCERN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         DP_BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DP_ACCOUNT_NO: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
//         NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
//         NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_STAKE_DP_SHARES_HOLDINGS',
//             tableName: 'TBL_EAH_STAKE_DP_SHARES_HOLDINGS'
//         });

//     return TBL_EAH_STAKE_DP_SHARES_HOLDINGS;

// }

// module.exports.TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2 = function () {
//     TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
//         NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
//         NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2',
//             tableName: 'TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2'
//         });

//     return TBL_EAH_DETAILS_OF_EMPLOYEE_SHARES_HOLDINGS_ENTERED_FORM2;

// }

// module.exports.TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2 = function () {
//     TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         BROKER_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE_OF_SHARES: { type: Sequelize.DATE, allowNull: true },
//         NAME_OF_SECURITY: { type: Sequelize.STRING(50), allowNull: true },
//         NUMBER_OF_SHARES_PURCHASED: { type: Sequelize.BIGINT, allowNull: true },
//         RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
//         TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },
//         IS_ACCOUNT_DELETED: { type: Sequelize.BOOLEAN, allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2',
//             tableName: 'TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2'
//         });

//     return TBL_EAH_DETAILS_OF_RELATIVES_SHARES_HOLDINGS_ENTERED_FORM2;

// }
module.exports.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = function () {
    TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING',
            tableName: 'TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING'
        });

    return TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING;

}

//commodities
// module.exports.TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS = function () {
//     TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         REF_NO: { type: Sequelize.BIGINT, allowNull: true },
//         DATE_OF_TRANSACTION: { type: Sequelize.DATE, allowNull: true },
//         TYPE_OF_TRADE: { type: Sequelize.STRING(50), allowNull: true },
//         COMMODITY_NAME: { type: Sequelize.STRING(200), allowNull: true },
//         MARKET_NAME: { type: Sequelize.STRING(200), allowNull: true },
//         VENDOR_DETAILS: { type: Sequelize.STRING(200), allowNull: true },
//         QUANTITY: { type: Sequelize.BIGINT, allowNull: true },
//         UNITS: { type: Sequelize.STRING(20), allowNull: true },
//         PRICE: { type: Sequelize.DECIMAL(18, 2), allowNull: true },
//         TRANSACTION: { type: Sequelize.STRING(50), allowNull: true },
//         DATE_OF_PURCHASE: { type: Sequelize.DATE, allowNull: true },
//         REMARKS: { type: Sequelize.STRING(2000), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS',
//             tableName: 'TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS'
//         });

//     return TBL_EAH_COMMODITY_DP_SHARES_HOLDINGS;

// }
module.exports.TBL_EAH_COMMODITY_OTHER_EXCHANGE = function () {
    TBL_EAH_COMMODITY_OTHER_EXCHANGE.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        CLIENT_ID: { type: Sequelize.STRING(1000), allowNull: true },
        IS_ANY_TRADE: { type: Sequelize.BOOLEAN, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        RE_OPEN_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRANS_TYPE: { type: Sequelize.STRING(20), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_COMMODITY_OTHER_EXCHANGE',
            tableName: 'TBL_EAH_COMMODITY_OTHER_EXCHANGE'
        });

    return TBL_EAH_COMMODITY_OTHER_EXCHANGE;

}

module.exports.TBL_EAH_EMAIL_STATUS = function () {
    TBL_EAH_EMAIL_STATUS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMAILID: { type: Sequelize.STRING(500), allowNull: true },
        EMAIL_STATUS: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_TRACKED_EMP: { type: Sequelize.BOOLEAN, allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMAIL_STATUS',
            tableName: 'TBL_EAH_EMAIL_STATUS'
        });

    exports.TBL_USER_MST();
    TBL_EAH_EMAIL_STATUS.belongsTo(TBL_USER_MST, { foreignKey: 'EMPLOYEE_ID', as: 'Employee' });

    return TBL_EAH_EMAIL_STATUS;

}

module.exports.TBL_EAH_EMPLOYEE_AGINGDATE = function () {
    TBL_EAH_EMPLOYEE_AGINGDATE.init({
        // ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        AGINGDATE: { type: Sequelize.DATE, allowNull: true },

        // IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        // CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        // MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_EMPLOYEE_AGINGDATE',
            tableName: 'TBL_EAH_EMPLOYEE_AGINGDATE'
        });

    return TBL_EAH_EMPLOYEE_AGINGDATE;

}

// module.exports.TBL_EAH_EMPLOYEE_ONBEHALF = function () {
//     TBL_EAH_EMPLOYEE_ONBEHALF.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
//         ON_BEHALF_OF_EMP_ID: { type: Sequelize.STRING(50), allowNull: true },

//         IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
//         CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'TBL_EAH_EMPLOYEE_ONBEHALF',
//             tableName: 'TBL_EAH_EMPLOYEE_ONBEHALF'
//         });

//     return TBL_EAH_EMPLOYEE_ONBEHALF;

// }

module.exports.TBL_EAH_MANCO_MASTER = function () {
    TBL_EAH_MANCO_MASTER.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        DEALER_ID: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_MANCO_MASTER',
            tableName: 'TBL_EAH_MANCO_MASTER'
        });

    return TBL_EAH_MANCO_MASTER;

}

module.exports.TBL_EAH_SCHEDULER_LOG = function () {
    TBL_EAH_SCHEDULER_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        LOG_DATE: { type: Sequelize.DATE, allowNull: true },
        ERROR_MSG: { type: Sequelize.STRING(2000), allowNull: true },
        INSERT_COUNT: { type: Sequelize.BIGINT, allowNull: true },

        // IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        // CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        // MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        // MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_SCHEDULER_LOG',
            tableName: 'TBL_EAH_SCHEDULER_LOG'
        });

    return TBL_EAH_SCHEDULER_LOG;

}

module.exports.TBL_EAH_REOPEN_LOG = function () {
    TBL_EAH_REOPEN_LOG.init({
        RE_OPEN_ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RSTATUS: { type: Sequelize.STRING(100), allowNull: true },
        IS_SUBMITTED: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        // MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EAH_REOPEN_LOG',
            tableName: 'TBL_EAH_REOPEN_LOG'
        });

    return TBL_EAH_REOPEN_LOG;

}

module.exports.TBL_PCOIDetails = function () {
    TBL_PCOIDetails.init({
        TransId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EmpId: { type: Sequelize.STRING(500), allowNull: true },
        DeclarationFor: { type: Sequelize.STRING(100), allowNull: true },
        Relation: { type: Sequelize.STRING(200), allowNull: true },
        RelativeName: { type: Sequelize.STRING(500), allowNull: true },
        Entity: { type: Sequelize.STRING, allowNull: true },
        PerHolding: { type: Sequelize.STRING(1000), allowNull: true },
        TransDetails: { type: Sequelize.STRING, allowNull: true },
        Date: { type: Sequelize.DATE, allowNull: true },
        Nature: { type: Sequelize.STRING, allowNull: true },
        ValuePrice: { type: Sequelize.STRING(1000), allowNull: true },
        MarketValPrice: { type: Sequelize.STRING(1000), allowNull: true },
        SpDiscount: { type: Sequelize.STRING, allowNull: true },
        ConflictDetails: { type: Sequelize.STRING, allowNull: true },
        Remark: { type: Sequelize.STRING, allowNull: true },
        QuarterId: { type: Sequelize.BIGINT, allowNull: true },
        IsFinalSubmit: { type: Sequelize.BOOLEAN, allowNull: true },
        DIN: { type: Sequelize.STRING, allowNull: true },
        PAN: { type: Sequelize.STRING, allowNull: true },
        InterestRemark: { type: Sequelize.STRING, allowNull: true },
        BusinessNature: { type: Sequelize.STRING, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_PCOIDetails',
            tableName: 'TBL_PCOIDetails'
        });

    return TBL_PCOIDetails;

}

module.exports.TBL_QuarterMaster = function () {
    TBL_QuarterMaster.init({
        QuarterId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        QuarterName: { type: Sequelize.STRING, allowNull: true },
        CurrentActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        StartDate: { type: Sequelize.DATE, allowNull: true },
        EndDate: { type: Sequelize.DATE, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_QuarterMaster',
            tableName: 'TBL_QuarterMaster'
        });

    return TBL_QuarterMaster;

}

module.exports.TBL_IRF_Approval_Data = function () {
    TBL_IRF_Approval_Data.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TRX_NO: { type: Sequelize.STRING(500), allowNull: true },
        LOCATION: { type: Sequelize.STRING(100), allowNull: true },
        COMPANY: { type: Sequelize.STRING(100), allowNull: true },
        CRE_USER: { type: Sequelize.STRING(100), allowNull: true },
        CRE_DATE: { type: Sequelize.DATE, allowNull: true },
        UPD_USER: { type: Sequelize.STRING(100), allowNull: true },
        UPD_DATE: { type: Sequelize.DATE, allowNull: true },
        NatureofTrade: { type: Sequelize.STRING(500), allowNull: true },
        Requestfor: { type: Sequelize.STRING(100), allowNull: true },
        DependentName: { type: Sequelize.STRING(255), allowNull: true },
        Security: { type: Sequelize.STRING(100), allowNull: true },
        Transaction: { type: Sequelize.STRING(100), allowNull: true },
        Month: { type: Sequelize.STRING(300), allowNull: true },
        OptionType: { type: Sequelize.STRING(100), allowNull: true },
        QuantityLot: { type: Sequelize.STRING(100), allowNull: true },
        EqQuantity: { type: Sequelize.STRING(900), allowNull: true },
        FutOpQuantityLot: { type: Sequelize.STRING(9), allowNull: true },
        PricePremium: { type: Sequelize.STRING(900), allowNull: true },
        StrikePrice: { type: Sequelize.STRING(900), allowNull: true },
        Position: { type: Sequelize.STRING(500), allowNull: true },
        ApprovalStatus: { type: Sequelize.STRING(1000), allowNull: true },
        RejectionReason: { type: Sequelize.STRING(1000), allowNull: true },
        DateofEarlierTransaction: { type: Sequelize.STRING(800), allowNull: true },
        EmployeeNumber: { type: Sequelize.STRING(1500), allowNull: true },
        ISIN: { type: Sequelize.STRING(1200), allowNull: true },
        MarketPrice: { type: Sequelize.STRING(100), allowNull: true },
        EntityName: { type: Sequelize.STRING(500), allowNull: true },
        PrimaryIssueCategory: { type: Sequelize.STRING(300), allowNull: true },
        Primary_Issue_Type: { type: Sequelize.STRING(200), allowNull: true },
        AcquisitionType: { type: Sequelize.STRING(200), allowNull: true },
        CurrentTradeValue_Greater: { type: Sequelize.STRING(100), allowNull: true },
        PreviousTradeValueGreater: { type: Sequelize.STRING(100), allowNull: true },
        AcquiredType: { type: Sequelize.STRING(2000), allowNull: true },
        RightIssueType: { type: Sequelize.STRING(1500), allowNull: true },
        IEApprovalStatus: { type: Sequelize.STRING(1000), allowNull: true },
        RequestNumber: { type: Sequelize.STRING(900), allowNull: true },
        VERSION: { type: Sequelize.STRING(800), allowNull: true },
        CHECK_DISCLAIMER: { type: Sequelize.STRING(500), allowNull: true },
        ESOP_TRADE_CHECK: { type: Sequelize.STRING(500), allowNull: true },
        APP_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        CommSource: { type: Sequelize.STRING(200), allowNull: true },
        CommAcquiredThrough: { type: Sequelize.STRING(300), allowNull: true },
        CommLocationofPurchase: { type: Sequelize.STRING(100), allowNull: true },
        CommNameofCounterParty: { type: Sequelize.STRING(100), allowNull: true },
        CommDimension: { type: Sequelize.STRING(300), allowNull: true },
        CommMarketName: { type: Sequelize.STRING(100), allowNull: true },
        CommVendorDetails: { type: Sequelize.STRING(100), allowNull: true },
        CommTypeofTrade: { type: Sequelize.STRING(100), allowNull: true },
        SPNCDEntity: { type: Sequelize.STRING(500), allowNull: true },
        IsGWMRA: { type: Sequelize.STRING(100), allowNull: true },
        IS_IE_COMPLIANCE_AUTOMATE: { type: Sequelize.STRING(1), allowNull: true },
        AccountCode: { type: Sequelize.STRING(100), allowNull: true },
        SPECIAL_CASE_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        Reason: { type: Sequelize.STRING(500), allowNull: true },
        COMPLIANCECREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        COMPLIANCECREATED_ON: { type: Sequelize.DATE, allowNull: true },
        TradeAvailableQty:{ type: Sequelize.BIGINT, allowNull: true },
        IS_CLOSE: { type: Sequelize.BOOLEAN, allowNull: true }
    },
        {
            sequelize,
            modelName: 'TBL_IRF_Approval_Data',
            tableName: 'TBL_IRF_Approval_Data'
        });

    return TBL_IRF_Approval_Data

}

module.exports.Tbl_Employee_AccountCode_Mapping = function () {

    Tbl_Employee_AccountCode_Mapping.init({

        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },

        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },

        PAN_NO: { type: Sequelize.STRING(20), allowNull: true },

        AccountCode: { type: Sequelize.STRING(200), allowNull: true },

        AccountName: { type: Sequelize.STRING(200), allowNull: true },

        AccountCategory: { type: Sequelize.STRING(200), allowNull: true },

        AadharId: { type: Sequelize.STRING(20), allowNull: true },

        TradedBy: { type: Sequelize.STRING(500), allowNull: true },

        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },

        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },

        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },

        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },



    },



        {

            sequelize,

            modelName: 'Tbl_Employee_AccountCode_Mapping',

            tableName: 'Tbl_Employee_AccountCode_Mapping'



        });







    return Tbl_Employee_AccountCode_Mapping;







}

module.exports.TBL_ITRADING_PRIMARY_ISSUE_MST = function () {
    TBL_ITRADING_PRIMARY_ISSUE_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TRX_NO: { type: Sequelize.STRING(150), allowNull: true },
        LOCATION: { type: Sequelize.STRING(100), allowNull: true },
        IPOID: { type: Sequelize.STRING(1000), allowNull: true },
        COMPANY: { type: Sequelize.STRING(100), allowNull: true },
        NAME_OF_ISSUE: { type: Sequelize.STRING(100), allowNull: true },
        ISSUE_DESC: { type: Sequelize.STRING(1000), allowNull: true },
        OPEN_FROM_DATE: { type: Sequelize.DATE, allowNull: true },
        OPEN_TILL_DATE: { type: Sequelize.DATE, allowNull: true },
        MIN_BID_PRICE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        MAX_BID_PRICE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        LOT_SIZE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        IRF_FORMAT: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        PRIMARY_ISSUE_TYPE: { type: Sequelize.BIGINT, allowNull: true },
        PRIMARY_ISSUE_CATEGORY: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_ITRADING_PRIMARY_ISSUE_MST',
            tableName: 'TBL_ITRADING_PRIMARY_ISSUE_MST'
        });

    exports.TBL_GENERIC_MST();
    TBL_ITRADING_PRIMARY_ISSUE_MST.belongsTo(TBL_GENERIC_MST, { as: 'Type', foreignKey: 'PRIMARY_ISSUE_TYPE', });

    exports.TBL_GENERIC_MST();
    TBL_ITRADING_PRIMARY_ISSUE_MST.belongsTo(TBL_GENERIC_MST, { as: 'Category', foreignKey: 'PRIMARY_ISSUE_CATEGORY', });


    return TBL_ITRADING_PRIMARY_ISSUE_MST;
}

module.exports.TBL_UPSI_PROJECT_MST = function () {
    TBL_UPSI_PROJECT_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_NAME: { type: Sequelize.STRING(200), allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        STARTDATE: { type: Sequelize.DATE, allowNull: true },
        ENDDATE: { type: Sequelize.DATE, allowNull: true },
        TEAM: { type: Sequelize.BIGINT, allowNull: true },
        TEAMS: { type: Sequelize.STRING(200), allowNull: true },
        PTYPES: { type: Sequelize.STRING(200), allowNull: true },
        IS_EQUITY: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_DEPT: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_MST',
            tableName: 'TBL_UPSI_PROJECT_MST'
        });

    exports.TBL_GENERIC_MST();
    TBL_UPSI_PROJECT_MST.belongsTo(TBL_GENERIC_MST, { foreignKey: 'TEAM', });


    return TBL_UPSI_PROJECT_MST;
}

module.exports.TBL_UPSI_PROJECT_MST_EMPLOYEEDATA = function () {
    TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        UPLOAD_PATH: { type: Sequelize.STRING(2000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_MST_EMPLOYEEDATA',
            tableName: 'TBL_UPSI_PROJECT_MST_EMPLOYEEDATA'
        });

    exports.TBL_UPSI_PROJECT_MST();
    TBL_UPSI_PROJECT_MST_EMPLOYEEDATA.belongsTo(TBL_UPSI_PROJECT_MST, { foreignKey: 'PROJECT_ID', });


    return TBL_UPSI_PROJECT_MST_EMPLOYEEDATA;
}

module.exports.TBL_PROJECT_EMPLOYEE_DETAILS = function () {
    TBL_PROJECT_EMPLOYEE_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(1000), allowNull: true },
        EMPLOYEE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_PROJECT_EMPLOYEE_DETAILS',
            tableName: 'TBL_PROJECT_EMPLOYEE_DETAILS'
        });

    return TBL_PROJECT_EMPLOYEE_DETAILS;
}

module.exports.TBL_GREY_LIST_DETAILSMST = function () {
    TBL_GREY_LIST_DETAILSMST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        GRELISTID: { type: Sequelize.STRING(100), allowNull: true },
        EMPNO: { type: Sequelize.STRING(12), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_GREY_LIST_DETAILSMST',
            tableName: 'TBL_GREY_LIST_DETAILSMST'
        });

    return TBL_GREY_LIST_DETAILSMST;
}

module.exports.EIRF_NON_D_USER_TRACKER = function () {
    EIRF_NON_D_USER_TRACKER.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EmpNo: { type: Sequelize.STRING(100), allowNull: true },
        NonEFSLDesignated: { type: Sequelize.STRING(120), allowNull: true },
        EFSLDesignated: { type: Sequelize.STRING(120), allowNull: true },
        IsconvertedToD: { type: Sequelize.STRING(120), allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'EIRF_NON_D_USER_TRACKER',
            tableName: 'EIRF_NON_D_USER_TRACKER'
        });

    return EIRF_NON_D_USER_TRACKER;
}

module.exports.TRD_Email_Status = function () {
    TRD_Email_Status.init({
        TransId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EmpId: { type: Sequelize.STRING(120), allowNull: true },
        EmailId: { type: Sequelize.STRING(120), allowNull: true },
        EmailStatus: { type: Sequelize.STRING(100), allowNull: true },
        EmailType: { type: Sequelize.STRING(120), allowNull: true },
        EmailDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        IsTrackedEmp: { type: Sequelize.STRING(120), allowNull: true },


    },
        {
            sequelize,
            modelName: 'TRD_Email_Status',
            tableName: 'TRD_Email_Status'
        });

    return TRD_Email_Status;
}

module.exports.EIRF_RICO_IBEATS_ResignedEmp_AccountCode = function () {
    EIRF_RICO_IBEATS_ResignedEmp_AccountCode.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EmployeeID: { type: Sequelize.STRING(120), allowNull: true },
        AccCode: { type: Sequelize.STRING(120), allowNull: true },
        AccountName: { type: Sequelize.STRING(100), allowNull: true },
        PanNo: { type: Sequelize.STRING(120), allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },


    },
        {
            sequelize,
            modelName: 'EIRF_RICO_IBEATS_ResignedEmp_AccountCode',
            tableName: 'EIRF_RICO_IBEATS_ResignedEmp_AccountCode'
        });

    return EIRF_RICO_IBEATS_ResignedEmp_AccountCode;
}


module.exports.EIRF_Disclaimer_Status = function () {
    EIRF_Disclaimer_Status.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        QuarterID: { type: Sequelize.STRING(120), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        YEAR: { type: Sequelize.STRING(120), allowNull: true },

    },
        {
            sequelize,
            modelName: 'EIRF_Disclaimer_Status',
            tableName: 'EIRF_Disclaimer_Status'
        });

    return EIRF_Disclaimer_Status;
}

module.exports.TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION = function () {
    TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, allowNull: true },
        PROJECT_NAME: { type: Sequelize.STRING(200), allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        STARTDATE: { type: Sequelize.DATE, allowNull: true },
        ENDDATE: { type: Sequelize.DATE, allowNull: true },
        IS_EQUITY: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_DEPT: { type: Sequelize.BOOLEAN, allowNull: true },
        NEW_ISIN: { type: Sequelize.STRING(12), allowNull: true },
        TEAMS: { type: Sequelize.STRING(200), allowNull: true },
        PTYPES: { type: Sequelize.STRING(200), allowNull: true },
        CREATED_LOG_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION',
            tableName: 'TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION'
        });


    return TBL_UPSI_PROJECT_DETAILS_BAK_HIS_AUTOMATION;
}

module.exports.TBL_RISKCATEGORY_MAIL = function () {
    TBL_RISKCATEGORY_MAIL.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_STATUS: { type: Sequelize.STRING(200), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_RISKCATEGORY_MAIL',
            tableName: 'TBL_RISKCATEGORY_MAIL'
        });

    return TBL_RISKCATEGORY_MAIL;

}

module.exports.TBL_RMSCATEGORY_LOG = function () {
    TBL_RMSCATEGORY_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_STATUS: { type: Sequelize.STRING(1000), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_RMSCATEGORY_LOG',
            tableName: 'TBL_RMSCATEGORY_LOG'
        });

    return TBL_RMSCATEGORY_LOG;

}

module.exports.TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG = function () {
    TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_STATUS: { type: Sequelize.STRING(200), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG',
            tableName: 'TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG'
        });

    return TBL_AUTO_UPDATE_SCRIP_BLOCKINGUNBLOCKING_FILE_JOB_LOG;

}

module.exports.TBL_USERMASTER_LOG = function () {
    TBL_USERMASTER_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_STATUS: { type: Sequelize.STRING(200), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_USERMASTER_LOG',
            tableName: 'TBL_USERMASTER_LOG'
        });

    return TBL_USERMASTER_LOG;

}

module.exports.TBL_DEPENDENT_CENTRALREPO = function () {
    TBL_DEPENDENT_CENTRALREPO.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(1000), allowNull: true },
        ACC_CODE: { type: Sequelize.STRING(200), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        DATA_SOURCE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DEPENDENT_CENTRALREPO',
            tableName: 'TBL_DEPENDENT_CENTRALREPO'
        });

    return TBL_DEPENDENT_CENTRALREPO;

}

module.exports.TBL_DEPENDENT_CENTRALREPO_BAK_HIS = function () {
    TBL_DEPENDENT_CENTRALREPO_BAK_HIS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(1000), allowNull: true },
        ACC_CODE: { type: Sequelize.STRING(200), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        DATA_SOURCE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        ACTION: { type: Sequelize.STRING(50), allowNull: true },
        LOG_CREATED_DATE: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DEPENDENT_CENTRALREPO_BAK_HIS',
            tableName: 'TBL_DEPENDENT_CENTRALREPO_BAK_HIS'
        });

    return TBL_DEPENDENT_CENTRALREPO_BAK_HIS;

}

module.exports.TBL_DEPENDENT_CENTRALREPO_NEW = function () {
    TBL_DEPENDENT_CENTRALREPO_NEW.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(1000), allowNull: true },
        ACC_CODE: { type: Sequelize.STRING(200), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        DATA_SOURCE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DEPENDENT_CENTRALREPO_NEW',
            tableName: 'TBL_DEPENDENT_CENTRALREPO_NEW'
        });

    return TBL_DEPENDENT_CENTRALREPO_NEW;

}

module.exports.TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL = function () {
    TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        RELATIVE_ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        RELATIVE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(1000), allowNull: true },
        ACC_CODE: { type: Sequelize.STRING(200), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        DATA_SOURCE: { type: Sequelize.STRING(50), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL',
            tableName: 'TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL'
        });

    return TBL_DEPENDENT_CENTRALREPO_2022_23_FINAL;

}

module.exports.TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING = function () {
    TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        ACCOUNT_CODE: { type: Sequelize.STRING(100), allowNull: true },
        SERVER_ID: { type: Sequelize.BIGINT, allowNull: true },
        SERVER_NAME: { type: Sequelize.STRING(250), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        STATUS: { type: Sequelize.STRING(50), allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING',
            tableName: 'TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING'
        });

    return TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING;

}

module.exports.TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS = function () {
    TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS.init({
        HIS_ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ID: { type: Sequelize.BIGINT, allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        ACCOUNT_CODE: { type: Sequelize.STRING(100), allowNull: true },
        SERVER_ID: { type: Sequelize.BIGINT, allowNull: true },
        SERVER_NAME: { type: Sequelize.STRING(250), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        STATUS: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_LOG_DATE: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS',
            tableName: 'TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS'
        });

    return TBL_UPSI_CLIENT_VIRTUAL_SERVER_MAPPING_BAK_HIS;

}

module.exports.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA = function () {
    TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SERVER_NAME: { type: Sequelize.STRING(100), allowNull: true },
        CLIENT: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA',
            tableName: 'TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA'
        });

    return TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA;

}

module.exports.TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS = function () {
    TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS.init({
        HIS_ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ID: { type: Sequelize.BIGINT, allowNull: true },
        SERVER_NAME: { type: Sequelize.STRING(100), allowNull: true },
        CLIENT: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(50), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        CREATED_LOG_DATE: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS',
            tableName: 'TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS'
        });

    return TBL_UPSI_FTP_CLIENT_VIRTUAL_SERVER_DATA_BAK_HIS;

}

module.exports.TBL_SCRIPT_MST_FOR_TRADE_RECON = function () {
    TBL_SCRIPT_MST_FOR_TRADE_RECON.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SCRIPT_MST_ID: { type: Sequelize.BIGINT, allowNull: true },
        TRX_NO: { type: Sequelize.STRING(50), allowNull: true },
        LOCATION: { type: Sequelize.STRING(10), allowNull: true },
        COMPANY: { type: Sequelize.STRING(10), allowNull: true },
        BSE_CODE: { type: Sequelize.STRING(10), allowNull: true },
        NSE_BSE_CODE: { type: Sequelize.STRING(100), allowNull: true },
        NSE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        LOT_SIZE: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        ISIN_CODE: { type: Sequelize.STRING(12), allowNull: true },
        BLOOMBERG_CODE: { type: Sequelize.STRING(30), allowNull: true },
        REUTERS_CODE: { type: Sequelize.STRING(10), allowNull: true },
        SEDOL_CODE: { type: Sequelize.STRING(12), allowNull: true },
        DIVIDEND_DATE: { type: Sequelize.DATE, allowNull: true },
        RESTRICTED_RESET: { type: Sequelize.STRING(1), allowNull: true },
        SCRIP_DESC: { type: Sequelize.STRING(100), allowNull: true },
        HOLDING_PERIOD: { type: Sequelize.DECIMAL(5, 0), allowNull: true, defaultValue: 30 },
        IRF_FORMATS: { type: Sequelize.STRING(2), allowNull: true, defaultValue: 1 },
        BSE_GROUP_Name: { type: Sequelize.STRING(50), allowNull: true },
        EXCHANGE: { type: Sequelize.BIGINT, allowNull: true },
        NATURE_OF_TRADE: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
        CREATED_DATE_AS_TRADE_DATE: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SCRIPT_MST_FOR_TRADE_RECON',
            tableName: 'TBL_SCRIPT_MST_FOR_TRADE_RECON'
        });

    return TBL_SCRIPT_MST_FOR_TRADE_RECON;

}

// module.exports.msm015 = function () {
//     msm015.init({
//         ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         TRX_NO: { type: Sequelize.STRING(50), allowNull: true },
//         LOCATION: { type: Sequelize.STRING(10), allowNull: true },
//         COMPANY: { type: Sequelize.STRING(10), allowNull: true },
//         CREATED_BY: { type: Sequelize.STRING(10), allowNull: true },
//         CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
//         MODIFIED_BY: { type: Sequelize.STRING(10), allowNull: true },
//         MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
//         USER_FIRST_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         EMPLOYEE_NUMBER: { type: Sequelize.STRING(20), allowNull: true },
//         DEPARTMENT: { type: Sequelize.STRING(50), allowNull: true },
//         USER_CODE: { type: Sequelize.STRING(20), allowNull: true },
//         USER_CODE: { type: Sequelize.STRING(20), allowNull: true },
//         USER_LAST_NAME: { type: Sequelize.STRING(50), allowNull: true },
//         DESIGNATED: { type: Sequelize.STRING(1), allowNull: true },
//         GREY_LIST: { type: Sequelize.STRING(1), allowNull: true },
//         CLIENT_CODE: { type: Sequelize.STRING(500), allowNull: true },
//         TRADER_EMAIL_IDS: { type: Sequelize.STRING(550), allowNull: true },
//         IS_IE_COMPLIANCE_MEMBER: { type: Sequelize.STRING(50), allowNull: true },
//         IS_RESEARCH_ANALYST: { type: Sequelize.STRING(50), allowNull: true },
//         IS_QUANTITATIVE_RESEARCH_ANALYST: { type: Sequelize.STRING(50), allowNull: true },
//         IS_GWM_RA_MEMBER: { type: Sequelize.STRING(50), allowNull: true },
//     },
//         {
//             sequelize,
//             modelName: 'msm015',
//             tableName: 'msm015'
//         });

//     return msm015;

// }

module.exports.TBL_SCOI_ACCEPT_LOG = function () {
    TBL_SCOI_ACCEPT_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        QUARTER_ID: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACCEPT: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SCOI_ACCEPT_LOG',
            tableName: 'TBL_SCOI_ACCEPT_LOG'
        });

    return TBL_SCOI_ACCEPT_LOG;

}

module.exports.TBL_SCOI_DATA = function () {
    TBL_SCOI_DATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(500), allowNull: true },
        NAME: { type: Sequelize.STRING(50), allowNull: true },
        RELATION: { type: Sequelize.BIGINT, allowNull: true },
        NATURE_OF_SUBSTANTIAL_INTEREST: { type: Sequelize.BIGINT, allowNull: true },
        DIN: { type: Sequelize.STRING(20), allowNull: true },
        PAN: { type: Sequelize.STRING(20), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SCOI_DATA',
            tableName: 'TBL_SCOI_DATA'
        });

    exports.TBL_GENERIC_MST();
    TBL_SCOI_DATA.belongsTo(TBL_GENERIC_MST, { as: 'Rel', foreignKey: 'RELATION', });

    exports.TBL_GENERIC_MST();
    TBL_SCOI_DATA.belongsTo(TBL_GENERIC_MST, { as: 'Interest', foreignKey: 'NATURE_OF_SUBSTANTIAL_INTEREST', });

    return TBL_SCOI_DATA;

}

module.exports.TBL_SCOI_EMAIL_SEND_STATUS = function () {
    TBL_SCOI_EMAIL_SEND_STATUS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPNO: { type: Sequelize.STRING(50), allowNull: true },
        EMAILID: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_STATUS: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_SCOI_EMAIL_SEND_STATUS',
            tableName: 'TBL_SCOI_EMAIL_SEND_STATUS'
        });

    return TBL_SCOI_EMAIL_SEND_STATUS;

}

module.exports.TBL_UPSI_PROJECT_USER_CATEGORIZATION = function () {
    TBL_UPSI_PROJECT_USER_CATEGORIZATION.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        ENTITY_ID: { type: Sequelize.BIGINT, allowNull: true },
        SBU_ID: { type: Sequelize.BIGINT, allowNull: true },
        LOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        SUBLOB_ID: { type: Sequelize.BIGINT, allowNull: true },
        TYPE: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_USER_CATEGORIZATION',
            tableName: 'TBL_UPSI_PROJECT_USER_CATEGORIZATION'
        });

    exports.TBL_ENTITY_MST();
    TBL_UPSI_PROJECT_USER_CATEGORIZATION.belongsTo(TBL_ENTITY_MST, { foreignKey: 'ENTITY_ID', });

    exports.TBL_SBU_MST();
    TBL_UPSI_PROJECT_USER_CATEGORIZATION.belongsTo(TBL_SBU_MST, { foreignKey: 'SBU_ID', });

    exports.TBL_LOB_MST();
    TBL_UPSI_PROJECT_USER_CATEGORIZATION.belongsTo(TBL_LOB_MST, { foreignKey: 'LOB_ID', });

    exports.TBL_SUBLOB_MST();
    TBL_UPSI_PROJECT_USER_CATEGORIZATION.belongsTo(TBL_SUBLOB_MST, { foreignKey: 'SUBLOB_ID', });

    return TBL_UPSI_PROJECT_USER_CATEGORIZATION;
}

module.exports.TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA = function () {
    TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        UPSI_USER_CAT_ID: { type: Sequelize.BIGINT, allowNull: true },
        ISIN: { type: Sequelize.STRING(12), allowNull: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(1000), allowNull: true },
        EMPLOYEE_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA',
            tableName: 'TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA'
        });

    return TBL_UPSI_PROJECT_ENTITY_EMPLOYEEDATA;
}

module.exports.TBL_ViolationRemarksDetails = function () {
    TBL_ViolationRemarksDetails.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        VoilationId: { type: Sequelize.BIGINT, allowNull: true },
        Remarks: { type: Sequelize.STRING(100), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_ViolationRemarksDetails',
            tableName: 'TBL_ViolationRemarksDetails'
        });

    return TBL_ViolationRemarksDetails;


}

module.exports.TBL_UPSI_EMPLOYEE_DETAILS = function () {
    TBL_UPSI_EMPLOYEE_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPLOYEE_NAME: { type: Sequelize.STRING(500), allowNull: true },
        EMPNO: { type: Sequelize.STRING(200), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        ACCESS_TYPE: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_EMPLOYEE_DETAILS',
            tableName: 'TBL_UPSI_EMPLOYEE_DETAILS'
        });

    exports.TBL_UPSI_PROJECT_MST();
    TBL_UPSI_EMPLOYEE_DETAILS.belongsTo(TBL_UPSI_PROJECT_MST, { foreignKey: 'PROJECT_ID', });

    exports.TBL_GENERIC_MST();
    TBL_UPSI_EMPLOYEE_DETAILS.belongsTo(TBL_GENERIC_MST, { foreignKey: 'ACCESS_TYPE', });


    return TBL_UPSI_EMPLOYEE_DETAILS;
}

module.exports.TBL_UPSI_AUDIT_DETAILS = function () {
    TBL_UPSI_AUDIT_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        NAME: { type: Sequelize.STRING(500), allowNull: true },
        EMP_PAN: { type: Sequelize.STRING(200), allowNull: true },
        COMPANY_NAME: { type: Sequelize.STRING(50), allowNull: true },
        COMPANY_PAN: { type: Sequelize.STRING(50), allowNull: true },
        SHARED_BT: { type: Sequelize.STRING(50), allowNull: true },
        SHARED_BY_PAN: { type: Sequelize.STRING(50), allowNull: true },
        SHARED_DATE: { type: Sequelize.DATE, allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(50), allowNull: true },
        NATURE_OF_UPSI: { type: Sequelize.STRING(500), allowNull: true },
        DOCUMNET_SOURCE: { type: Sequelize.STRING(50), allowNull: true },
        ACC_CODE: { type: Sequelize.STRING(50), allowNull: true },
        EMAILID: { type: Sequelize.STRING(50), allowNull: true },
        // UPLOADFILE: { type: Sequelize.STRING(350), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_AUDIT_DETAILS',
            tableName: 'TBL_UPSI_AUDIT_DETAILS'
        });

    exports.TBL_UPSI_PROJECT_MST();
    TBL_UPSI_AUDIT_DETAILS.belongsTo(TBL_UPSI_PROJECT_MST, { foreignKey: 'PROJECT_ID', });


    return TBL_UPSI_AUDIT_DETAILS;
}

module.exports.TBL_UPSI_PROJECT_SCRIPT_DETAILS = function () {
    TBL_UPSI_PROJECT_SCRIPT_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(2000), allowNull: true },
        ISIN: { type: Sequelize.STRING(200), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_UPSI_PROJECT_SCRIPT_DETAILS',
            tableName: 'TBL_UPSI_PROJECT_SCRIPT_DETAILS'
        });

    exports.TBL_UPSI_PROJECT_MST();
    TBL_UPSI_PROJECT_SCRIPT_DETAILS.belongsTo(TBL_UPSI_PROJECT_MST, { foreignKey: 'PROJECT_ID', });


    return TBL_UPSI_PROJECT_SCRIPT_DETAILS;
}

module.exports.TBL_UPSI_AUDITOR_FILE_SAVE = function () {
    TBL_UPSI_AUDITOR_FILE_SAVE.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PROJECT_ID: { type: Sequelize.BIGINT, allowNull: true },
        UPLOADFILE: { type: Sequelize.STRING(2000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_AUDITOR_FILE_SAVE',
            tableName: 'TBL_UPSI_AUDITOR_FILE_SAVE'
        });

    exports.TBL_UPSI_PROJECT_MST();
    TBL_UPSI_AUDITOR_FILE_SAVE.belongsTo(TBL_UPSI_PROJECT_MST, { foreignKey: 'PROJECT_ID', });


    return TBL_UPSI_AUDITOR_FILE_SAVE;
}

module.exports.TBL_Holiday_Master = function () {
    TBL_Holiday_Master.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        DATE: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        DAY: { type: Sequelize.STRING(2000), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_Holiday_Master',
            tableName: 'TBL_Holiday_Master'
        });
    return TBL_Holiday_Master;
}

module.exports.TBL_PCOI_MAIL_SEND_LOG = function () {
    TBL_PCOI_MAIL_SEND_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPLOYEE_ID: { type: Sequelize.STRING(150), allowNull: true },
        QUARTER_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMAILID: { type: Sequelize.STRING(350), allowNull: true },
        EMAIL_STATUS: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_PCOI_MAIL_SEND_LOG',
            tableName: 'TBL_PCOI_MAIL_SEND_LOG'
        });

    return TBL_PCOI_MAIL_SEND_LOG;

}

module.exports.TBL_HRMS_EMP_RELATIONINFORMATION = function () {
    TBL_HRMS_EMP_RELATIONINFORMATION.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMP_DISPLAY_NUMBER: { type: Sequelize.STRING(20), allowNull: true },
        EMP_CALLING_NAME: { type: Sequelize.STRING(100), allowNull: true },
        PAN: { type: Sequelize.STRING(20), allowNull: true },
        DEPENDANT: { type: Sequelize.STRING(100), allowNull: true },
        EREL_RELATIONSHIP: { type: Sequelize.STRING(50), allowNull: true },
        EREL_BIRTHDAY: { type: Sequelize.DATE, allowNull: true },
        EREL_TELEPHONE: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_RELATIONINFORMATION',
            tableName: 'TBL_HRMS_EMP_RELATIONINFORMATION'
        });

    return TBL_HRMS_EMP_RELATIONINFORMATION;

}

module.exports.TBL_HRMS_EMPLOYEE_INFORMATION = function () {
    TBL_HRMS_EMPLOYEE_INFORMATION.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMP_NUMBER: { type: Sequelize.STRING(50), allowNull: true },
        EMP_ID: { type: Sequelize.STRING(50), allowNull: true },
        PAN: { type: Sequelize.STRING(50), allowNull: true },
        LOGIN_ID: { type: Sequelize.STRING(50), allowNull: true },
        EMP_TITLE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_CALLING_NAME: { type: Sequelize.STRING(50), allowNull: true },
        EMP_SURNAME: { type: Sequelize.STRING(50), allowNull: true },
        EMP_FULL_NAME: { type: Sequelize.STRING(100), allowNull: true },
        GENDER: { type: Sequelize.STRING(50), allowNull: true },
        ZONE: { type: Sequelize.STRING(50), allowNull: true },
        INFRA: { type: Sequelize.STRING(500), allowNull: true },
        CATEGORY: { type: Sequelize.STRING(50), allowNull: true },
        ENTITY: { type: Sequelize.STRING(500), allowNull: true },
        TYPE_OF_EMPLOYMENT: { type: Sequelize.STRING(50), allowNull: true },
        EMP_BLOOD_GROUP: { type: Sequelize.STRING(50), allowNull: true },
        EMP_RESIGN_DATE: { type: Sequelize.DATE, allowNull: true },
        DESIGNATION_NAME: { type: Sequelize.STRING(100), allowNull: true },
        EXTERNAL_DESIGNATION: { type: Sequelize.STRING(100), allowNull: true },
        COUNTRY: { type: Sequelize.STRING(50), allowNull: true },
        STATE: { type: Sequelize.STRING(100), allowNull: true },
        PINCODE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_DATE_JOINED: { type: Sequelize.DATE, allowNull: true },
        EMP_BIRTHDAY: { type: Sequelize.DATE, allowNull: true },
        GRP_NAME: { type: Sequelize.STRING(50), allowNull: true },
        CLUSTER: { type: Sequelize.STRING(50), allowNull: true },
        SBU: { type: Sequelize.STRING(100), allowNull: true },
        LOB: { type: Sequelize.STRING(100), allowNull: true },
        MIDDLE_NAME_FATHERS_NAME: { type: Sequelize.STRING(50), allowNull: true },
        EMPLOYMENT_STATUS: { type: Sequelize.STRING(50), allowNull: true },
        SLOB: { type: Sequelize.STRING(500), allowNull: true },
        LOCATION: { type: Sequelize.STRING(500), allowNull: true },
        EMP_PER_TELEPHONE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_PER_MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_TEM_TELEPHONE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_TEM_MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_OFFICE_MOBILE: { type: Sequelize.STRING(50), allowNull: true },
        EMP_ACTIVE_ATT_FLG: { type: Sequelize.BOOLEAN, allowNull: true },
        EMP_ACTIVE_HRM_FLG: { type: Sequelize.BOOLEAN, allowNull: true },
        EMP_OFFICE_EMAIL: { type: Sequelize.STRING(50), allowNull: true },
        CONT_DURING_WRKN: { type: Sequelize.STRING(50), allowNull: true },
        EMP_PER_EMAIL: { type: Sequelize.STRING(50), allowNull: true },
        EMP_PER_ADDRESS1: { type: Sequelize.STRING(500), allowNull: true },
        EMP_PER_ADDRESS2: { type: Sequelize.STRING(500), allowNull: true },
        EMP_PER_ADDRESS3: { type: Sequelize.STRING(500), allowNull: true },
        EMP_TEM_ADDRESS1: { type: Sequelize.STRING(500), allowNull: true },
        EMP_TEM_ADDRESS2: { type: Sequelize.STRING(500), allowNull: true },
        EMP_TEM_ADDRESS3: { type: Sequelize.STRING(500), allowNull: true },
        EMG_CONTACT: { type: Sequelize.STRING(50), allowNull: true },
        LEADERSHIP_GRP: { type: Sequelize.STRING(100), allowNull: true },
        EXIT_REASON: { type: Sequelize.STRING(500), allowNull: true },
        LEVEL1_NAME: { type: Sequelize.STRING(100), allowNull: true },
        LEVEL2_NAME: { type: Sequelize.STRING(100), allowNull: true },
        ARRIVAL_CONFORMATION_DATE: { type: Sequelize.DATE, allowNull: true },
        RA_ID: { type: Sequelize.STRING(50), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MARITAL_STATUS: { type: Sequelize.STRING(50), allowNull: true },
        BG_CODE: { type: Sequelize.STRING(50), allowNull: true },
        SBU_CODE: { type: Sequelize.STRING(50), allowNull: true },
        LOB_CODE: { type: Sequelize.STRING(50), allowNull: true },
        SUB_LOB_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ENTITY_CODE: { type: Sequelize.STRING(50), allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMPLOYEE_INFORMATION',
            tableName: 'TBL_HRMS_EMPLOYEE_INFORMATION'
        });

    return TBL_HRMS_EMPLOYEE_INFORMATION;
}

module.exports.TBL_HELP_DESK_DATA = function () {
    TBL_HELP_DESK_DATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TYPE: { type: Sequelize.STRING(150), allowNull: true },
        REQUEST_TYPE: { type: Sequelize.STRING(500), allowNull: true },
        QUERY: { type: Sequelize.STRING(2000), allowNull: true },
        EMPNO: { type: Sequelize.STRING(100), allowNull: true },
        REQID: { type: Sequelize.STRING(12), allowNull: true },
        // EMPLOYEE_ID: { type: Sequelize.BIGINT, allowNull: true },      
        // NAME: { type: Sequelize.STRING(150), allowNull: true },
        STATUS: { type: Sequelize.STRING(550), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(150), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(150), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_HELP_DESK_DATA',
            tableName: 'TBL_HELP_DESK_DATA'
        });

    return TBL_HELP_DESK_DATA;

}

module.exports.TBL_HELP_DESK_QUERY_DATA = function () {
    TBL_HELP_DESK_QUERY_DATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TBL_HELP_DESK_DATA_ID: { type: Sequelize.BIGINT, allowNull: true },
        QUERY: { type: Sequelize.STRING(2000), allowNull: true },
        NAME: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(150), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HELP_DESK_QUERY_DATA',
            tableName: 'TBL_HELP_DESK_QUERY_DATA'
        });

    return TBL_HELP_DESK_QUERY_DATA;

}

module.exports.TBL_HRMS_EMP_EMAIL = function () {
    TBL_HRMS_EMP_EMAIL.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        EMAIL_ADDRESS: { type: Sequelize.STRING(100), allowNull: true },
        IS_PRIMARY: { type: Sequelize.STRING(100), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_EMAIL',
            tableName: 'TBL_HRMS_EMP_EMAIL'
        });

    return TBL_HRMS_EMP_EMAIL;

}

module.exports.TBL_HRMS_EMP_EMERGENCY_CONTACT = function () {
    TBL_HRMS_EMP_EMERGENCY_CONTACT.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        NAME: { type: Sequelize.STRING(100), allowNull: true },
        RELATIONSHIP: { type: Sequelize.STRING(100), allowNull: true },
        PRIMARY_EMERGENCY: { type: Sequelize.STRING(100), allowNull: true },
        EMERGENCY_CONTACT_NUMBER: { type: Sequelize.STRING(100), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_EMERGENCY_CONTACT',
            tableName: 'TBL_HRMS_EMP_EMERGENCY_CONTACT'
        });

    return TBL_HRMS_EMP_EMERGENCY_CONTACT;

}

module.exports.TBL_HRMS_EMP_VOICE_DETAILS = function () {
    TBL_HRMS_EMP_VOICE_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        PHONE_TYPE: { type: Sequelize.STRING(20), allowNull: true },
        PHONE_NUMBER: { type: Sequelize.STRING(20), allowNull: true },
        AREA_CODE: { type: Sequelize.STRING(20), allowNull: true },
        COUNTRY_CODE: { type: Sequelize.STRING(20), allowNull: true },
        OFFICE_TELEPHONE_BOARD: { type: Sequelize.STRING(20), allowNull: true },
        OFFICE_EXTENSION: { type: Sequelize.STRING(20), allowNull: true },
        OFFICE_TELEPHONE_DIRECT: { type: Sequelize.STRING(20), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_VOICE_DETAILS',
            tableName: 'TBL_HRMS_EMP_VOICE_DETAILS'
        });

    return TBL_HRMS_EMP_VOICE_DETAILS;

}

module.exports.TBL_HRMS_EMP_ADDRESS = function () {
    TBL_HRMS_EMP_ADDRESS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ADDRESS_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        STREET: { type: Sequelize.STRING(500), allowNull: true },
        HOUSE_NUMBER: { type: Sequelize.STRING(500), allowNull: true },
        EXTRA_ADDRESS_LINE: { type: Sequelize.STRING(500), allowNull: true },
        CITY: { type: Sequelize.STRING(100), allowNull: true },
        STATE: { type: Sequelize.STRING(100), allowNull: true },
        PINCODE: { type: Sequelize.STRING(100), allowNull: true },
        COUNTRY: { type: Sequelize.STRING(100), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_ADDRESS',
            tableName: 'TBL_HRMS_EMP_ADDRESS'
        });

    return TBL_HRMS_EMP_ADDRESS;

}

module.exports.TBL_HRMS_EMP_WORKEX_DATA_EAH = function () {
    TBL_HRMS_EMP_WORKEX_DATA_EAH.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMP_DISPLAY_NUMBER: { type: Sequelize.STRING(20), allowNull: true },
        EMP_CALLING_NAME: { type: Sequelize.STRING(20), allowNull: true },
        PAST_COMPANY: { type: Sequelize.STRING(200), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_WORKEX_DATA_EAH',
            tableName: 'TBL_HRMS_EMP_WORKEX_DATA_EAH'
        });

    return TBL_HRMS_EMP_WORKEX_DATA_EAH;

}

module.exports.TBL_HRMS_EMP_QUALIFICATION_DATA_EAH = function () {
    TBL_HRMS_EMP_QUALIFICATION_DATA_EAH.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        UNIVERSITY: { type: Sequelize.STRING(500), allowNull: true },
        OTHER_UNIVERSITY: { type: Sequelize.STRING(500), allowNull: true },
        ACHIEVED_SCORE_IN_PERCENTAGE: { type: Sequelize.STRING(100), allowNull: true },
        HIGHEST_EDUCATION: { type: Sequelize.STRING(100), allowNull: true },
        COURSE: { type: Sequelize.STRING(500), allowNull: true },
        COURSE_TYPE: { type: Sequelize.STRING(500), allowNull: true },
        SPECIALIZATION: { type: Sequelize.STRING(500), allowNull: true },
        START_DATE: { type: Sequelize.DATE, allowNull: true },
        END_DATE: { type: Sequelize.DATE, allowNull: true },
        INSTITUTE: { type: Sequelize.STRING(500), allowNull: true },
        OTHER_INSTITUTE: { type: Sequelize.STRING(500), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(20), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_QUALIFICATION_DATA_EAH',
            tableName: 'TBL_HRMS_EMP_QUALIFICATION_DATA_EAH'
        });

    return TBL_HRMS_EMP_QUALIFICATION_DATA_EAH;

}

module.exports.TBL_HRMS_EMP_NATIONALITY = function () {
    TBL_HRMS_EMP_NATIONALITY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        COUNTRY: { type: Sequelize.STRING(30), allowNull: true },
        NATIONAL_ID_CARD_TYPE: { type: Sequelize.STRING(30), allowNull: true },
        NATIONAL_ID_NUMBER: { type: Sequelize.STRING(30), allowNull: true },
        EMPLOYEE_CODE: { type: Sequelize.STRING(30), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_EMP_NATIONALITY',
            tableName: 'TBL_HRMS_EMP_NATIONALITY'
        });

    return TBL_HRMS_EMP_NATIONALITY;

}

module.exports.TBL_HRMS_COMPANY_HIERARCHY_MAPPING = function () {
    TBL_HRMS_COMPANY_HIERARCHY_MAPPING.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        CLUSTER_ID: { type: Sequelize.STRING(50), allowNull: true },
        CLUSTER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SBU_ID: { type: Sequelize.STRING(50), allowNull: true },
        SBU_NAME: { type: Sequelize.STRING(500), allowNull: true },
        LOB_ID: { type: Sequelize.STRING(50), allowNull: true },
        LOB_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SUBLOB_ID: { type: Sequelize.STRING(50), allowNull: true },
        SUBLOB_NAME: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: 'TBL_HRMS_COMPANY_HIERARCHY_MAPPING',
            tableName: 'TBL_HRMS_COMPANY_HIERARCHY_MAPPING'
        });

    return TBL_HRMS_COMPANY_HIERARCHY_MAPPING;

}

module.exports.TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG = function () {
    TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMAIL_STATUS: { type: Sequelize.STRING(1000), allowNull: true },
        EMAIL_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG',
            tableName: 'TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG'
        });

    return TBL_EMPLOYEE_TAG_REMOVAL_MAIL_LOG;

}

module.exports.eirf_rico_sos_emp_mapping = function () {
    eirf_rico_sos_emp_mapping.init({
        TransId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EmpId: { type: Sequelize.STRING(50), allowNull: true },
        PanNo: { type: Sequelize.STRING(15), allowNull: true },
        TradeDate: { type: Sequelize.DATE, allowNull: true },
        Exch: { type: Sequelize.STRING(100), allowNull: true },
        AccCode: { type: Sequelize.STRING(500), allowNull: true },
        AccName: { type: Sequelize.STRING(1000), allowNull: true },
        ScripCode: { type: Sequelize.STRING(15), allowNull: true },
        ScripName: { type: Sequelize.STRING(1000), allowNull: true },
        Quantity: { type: Sequelize.BIGINT, allowNull: true },
        TotalPrice: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        Mode: { type: Sequelize.STRING(20), allowNull: true },
        ISIN: { type: Sequelize.STRING(15), allowNull: true },
        OpenQuantity: { type: Sequelize.BIGINT, allowNull: true },
        TradedBy: { type: Sequelize.STRING(1000), allowNull: true },
        StrikePrice: { type: Sequelize.DECIMAL(9, 0), allowNull: true },
        ExpiryDate: { type: Sequelize.DATE, allowNull: true },
        OptionType: { type: Sequelize.STRING(10), allowNull: true },
        CreatedBy: { type: Sequelize.STRING(50), allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true },
        UpdatedBy: { type: Sequelize.STRING(50), allowNull: true },
        UpdatedDate: { type: Sequelize.DATE, allowNull: true },
        TradedQuantity: { type: Sequelize.BIGINT, allowNull: true },
        Segment:{ type: Sequelize.STRING(100), allowNull: true },
    },
        {
            sequelize,
            modelName: 'eirf_rico_sos_emp_mapping',
            tableName: 'eirf_rico_sos_emp_mapping'
        });

    return eirf_rico_sos_emp_mapping;

}

module.exports.TBL_FNOROLLOVER_EXPIRYDATA = function () {
    TBL_FNOROLLOVER_EXPIRYDATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        POSITION_DATE: { type: Sequelize.DATE, allowNull: true },
        SEGMENT_INDICATOR: { type: Sequelize.STRING(100), allowNull: true },
        SETTLEMENT_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        CLEARING_MEMBER_CODE: { type: Sequelize.STRING(100), allowNull: true },
        MEMBER_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        TRADING_MEMBER_CODE: { type: Sequelize.STRING(100), allowNull: true },
        ACCOUNT_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        CLIENT_ACCOUNT_CODE: { type: Sequelize.STRING(100), allowNull: true },
        INSTRUMENT_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        SYMBOL: { type: Sequelize.STRING(50), allowNull: true },
        EXPIRY_DATE: { type: Sequelize.DATE, allowNull: true },
        STRIKE_PRICE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        OPTION_TYPE: { type: Sequelize.STRING(50), allowNull: true },
        CA_LEVEL: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        BROUGHT_FORWARD_LONG_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        BROUGHT_FORWARD_LONG_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        BROUGHT_FORWARD_SHORT_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        BROUGHT_FORWARD_SHORT_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        DAY_BUY_OPEN_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        DAY_BUY_OPEN_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        DAY_SELL_OPEN_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        DAY_SELL_OPEN_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        PRE_EX_AS_GMNT_LONG_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        PRE_EX_AS_GMNT_LONG_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        PRE_EX_AS_GMNT_SHORT_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        PRE_EX_AS_GMNT_SHORT_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        EXERCISED_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        ASSIGNED_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        POST_EX_AS_GMNT_LONG_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        POST_EX_AS_GMNT_LONG_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        POST_EX_AS_GMNT_SHORT_QUANTITY: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        POST_EX_AS_GMNT_SHORT_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        SETTLEMENT_PRICE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        NET_PREMIUM: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        DAILY_MTM_SETTLEMENT_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        FUTURES_FINAL_SETTLEMENT_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        EXERCISED_ASSIGNED_VALUE: { type: Sequelize.DECIMAL(13, 0), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_FNOROLLOVER_EXPIRYDATA',
            tableName: 'TBL_FNOROLLOVER_EXPIRYDATA'
        });

    return TBL_FNOROLLOVER_EXPIRYDATA;

}

module.exports.TBL_DP_HOLDING_DATA = function () {
    TBL_DP_HOLDING_DATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPID: { type: Sequelize.STRING(50), allowNull: true },
        FIRSTNAME: { type: Sequelize.STRING(100), allowNull: true },
        LOGIN_ID: { type: Sequelize.STRING(50), allowNull: true },
        DESIGNATED: { type: Sequelize.STRING(10), allowNull: true },
        EFSL_DESIGNATED: { type: Sequelize.STRING(10), allowNull: true },
        ACCOUNT_CODE: { type: Sequelize.STRING(50), allowNull: true },
        ACCOUNT_NAME: { type: Sequelize.STRING(100), allowNull: true },
        PAN_NO: { type: Sequelize.STRING(50), allowNull: true },
        E_BOID: { type: Sequelize.STRING(50), allowNull: true },
        ISIN_CODE: { type: Sequelize.STRING(50), allowNull: true },
        TRX_DATE: { type: Sequelize.DATE, allowNull: true },
        DP_QTY: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        SEGMENT: { type: Sequelize.STRING(100), allowNull: true },
        TradeAvailableQty: { type: Sequelize.BIGINT, allowNull: true },
        ApprovalAvailableQty: { type: Sequelize.BIGINT, allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DP_HOLDING_DATA',
            tableName: 'TBL_DP_HOLDING_DATA'
        });

    exports.TBL_SCRIPT_MST();
    TBL_DP_HOLDING_DATA.belongsTo(TBL_SCRIPT_MST, {
        foreignKey: 'ISIN_CODE',
        targetKey: 'ISIN_CODE',
        as: 'Script'
    });

    return TBL_DP_HOLDING_DATA;

}

module.exports.TBL_FUND_MANAGER_LISTDATA = function () {
    TBL_FUND_MANAGER_LISTDATA.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPNO: { type: Sequelize.STRING(50), allowNull: true },
        EMPLOYEE_NAME: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    },
        {
            sequelize,
            modelName: 'TBL_FUND_MANAGER_LISTDATA',
            tableName: 'TBL_FUND_MANAGER_LISTDATA'
        });

    return TBL_FUND_MANAGER_LISTDATA;

}

module.exports.TBL_FUND_MANAGER_LISTDATA_HIS = function () {
    TBL_FUND_MANAGER_LISTDATA_HIS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        TBL_FUND_MANAGER_LISTDATA_ID: { type: Sequelize.BIGINT, allowNull: true },
        EMPNO: { type: Sequelize.STRING(50), allowNull: true },
        EMPLOYEE_NAME: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    },
        {
            sequelize,
            modelName: 'TBL_FUND_MANAGER_LISTDATA_HIS',
            tableName: 'TBL_FUND_MANAGER_LISTDATA_HIS'
        });

    return TBL_FUND_MANAGER_LISTDATA_HIS;

}

module.exports.TBL_SCRIPT_AUTOMATION_LOGS = function () {
    TBL_SCRIPT_AUTOMATION_LOGS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        REMARK: { type: Sequelize.STRING(100), allowNull: true },
        ERROR: { type: Sequelize.STRING(100), allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_SCRIPT_AUTOMATION_LOGS',
            tableName: 'TBL_SCRIPT_AUTOMATION_LOGS'
        });
    return TBL_SCRIPT_AUTOMATION_LOGS;
}

module.exports.TBL_FO_LOTS_DAILY = function () {
    TBL_FO_LOTS_DAILY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SYMBOL: { type: Sequelize.STRING(20), allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        LOT_SIZE: { type: Sequelize.STRING(100), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_FO_LOTS_DAILY',
            tableName: 'TBL_FO_LOTS_DAILY'
        });

    return TBL_FO_LOTS_DAILY;

}

module.exports.EIRF_FO_3Months_LOTS_DAILY = function () {
    EIRF_FO_3Months_LOTS_DAILY.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SYMBOL: { type: Sequelize.STRING(255), allowNull: true },
        SCRIPT_NAME: { type: Sequelize.STRING(255), allowNull: true },
        First_Month_LOT_SIZE: { type: Sequelize.STRING(200), allowNull: true },
        First_Month: { type: Sequelize.STRING(200), allowNull: true },
        Second_Month_LOT_SIZE: { type: Sequelize.STRING(200), allowNull: true },
        Second_Month: { type: Sequelize.STRING(200), allowNull: true },
        Third_Month_LOT_SIZE: { type: Sequelize.STRING(200), allowNull: true },
        Third_Month: { type: Sequelize.STRING(200), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_BY: { type: Sequelize.BIGINT, allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.BIGINT, allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'EIRF_FO_3Months_LOTS_DAILY',
            tableName: 'EIRF_FO_3Months_LOTS_DAILY'
        });

    return EIRF_FO_3Months_LOTS_DAILY;

}

module.exports.TBL_IRF_Digitalplatform_ApprovalRes = function () {
    TBL_IRF_Digitalplatform_ApprovalRes.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        AccountCode: { type: Sequelize.STRING(100), allowNull: true },
        Security: { type: Sequelize.STRING(100), allowNull: true },
        ISIN: { type: Sequelize.STRING(1200), allowNull: true },
        Transaction: { type: Sequelize.STRING(100), allowNull: true },
        QuantityLot: { type: Sequelize.STRING(100), allowNull: true },
        EqQuantity: { type: Sequelize.STRING(900), allowNull: true },
        StrikePrice: { type: Sequelize.STRING(900), allowNull: true },
        Month: { type: Sequelize.STRING(300), allowNull: true },
        NatureofTrade: { type: Sequelize.STRING(500), allowNull: true },
        OptionType: { type: Sequelize.STRING(100), allowNull: true },
        type: { type: Sequelize.STRING(100), allowNull: true },
        msg: { type: Sequelize.STRING(1000), allowNull: true },
        success: { type: Sequelize.STRING(100), allowNull: true },
        MsgId: { type: Sequelize.STRING(1000), allowNull: true },
        srvTm: { type: Sequelize.STRING(1000), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    },
        {
            sequelize,
            modelName: 'TBL_IRF_Digitalplatform_ApprovalRes',
            tableName: 'TBL_IRF_Digitalplatform_ApprovalRes'
        });

    return TBL_IRF_Digitalplatform_ApprovalRes

}

module.exports.TBL_UPSI_BLOCKINGFILE_LOG = function () {
    TBL_UPSI_BLOCKINGFILE_LOG.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SERVER_ID: { type: Sequelize.BIGINT, allowNull: true },
        FILENAME: { type: Sequelize.STRING(1000), allowNull: true },
        DIRECTORY_PATH: { type: Sequelize.STRING(1000), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        TOTAL_RECORDS: { type: Sequelize.BIGINT, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_BLOCKINGFILE_LOG',
            tableName: 'TBL_UPSI_BLOCKINGFILE_LOG'
        });

    return TBL_UPSI_BLOCKINGFILE_LOG;

}

module.exports.TBL_UPSI_VIRTUAL_SERVER_MST = function () {
    TBL_UPSI_VIRTUAL_SERVER_MST.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SERVER_NAME: { type: Sequelize.STRING(1000), allowNull: true },
        PATH: { type: Sequelize.STRING(1000), allowNull: true },
        PATH_TYPE: { type: Sequelize.STRING(500), allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        USERID: { type: Sequelize.STRING(500), allowNull: true },
        PASSWORD: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_UPSI_VIRTUAL_SERVER_MST',
            tableName: 'TBL_UPSI_VIRTUAL_SERVER_MST'
        });

    return TBL_UPSI_VIRTUAL_SERVER_MST;

}

module.exports.TBL_BENPOS_SHAREHOLDER_DETAILS = function () {
    TBL_BENPOS_SHAREHOLDER_DETAILS.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        FOLIO_NO: { type: Sequelize.STRING(500), allowNull: true },
        SHARE_HOLDER_NAME: { type: Sequelize.STRING(500), allowNull: true },
        SHARES: { type: Sequelize.STRING(100), allowNull: true },
        JOINT_HOLDER1: { type: Sequelize.STRING(500), allowNull: true },
        JOINT_HOLDER2: { type: Sequelize.STRING(500), allowNull: true },
        JOINT_HOLDER3: { type: Sequelize.STRING(500), allowNull: true },
        FATHER_HUSBAND_NAME: { type: Sequelize.STRING(200), allowNull: true },
        ADDRESS_LINE1: { type: Sequelize.STRING(500), allowNull: true },
        ADDRESS_LINE2: { type: Sequelize.STRING(500), allowNull: true },
        ADDRESS_LINE3: { type: Sequelize.STRING(500), allowNull: true },
        CITY_NAME: { type: Sequelize.STRING(100), allowNull: true },
        PINCODE: { type: Sequelize.STRING(20), allowNull: true },
        EMAIL_ID: { type: Sequelize.STRING(50), allowNull: true },
        PHONE_NO: { type: Sequelize.STRING(30), allowNull: true },
        PANCARD_NO: { type: Sequelize.STRING(20), allowNull: true },
        SECOND_HOLDER_PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        THIRD_HOLDER_PAN_NO: { type: Sequelize.STRING(20), allowNull: true },
        CATEGORY: { type: Sequelize.STRING(20), allowNull: true },
        STATUS: { type: Sequelize.STRING(20), allowNull: true },
        OCCUPATION: { type: Sequelize.STRING(20), allowNull: true },
        BANK_ACNO: { type: Sequelize.STRING(50), allowNull: true },
        BANK_NAME: { type: Sequelize.STRING(100), allowNull: true },
        BANK_ADDRESSLINE1: { type: Sequelize.STRING(500), allowNull: true },
        BANK_ADDRESSLINE2: { type: Sequelize.STRING(500), allowNull: true },
        BANK_ADDRESSLINE3: { type: Sequelize.STRING(500), allowNull: true },
        BANK_ADDRESSLINE4: { type: Sequelize.STRING(500), allowNull: true },
        BANK_PINCODE: { type: Sequelize.STRING(50), allowNull: true },
        BANK_ACTYPE: { type: Sequelize.STRING(50), allowNull: true },
        MICR_CODE: { type: Sequelize.STRING(100), allowNull: true },
        IFSC: { type: Sequelize.STRING(50), allowNull: true },
        NOMINEE_NAME: { type: Sequelize.STRING(100), allowNull: true },
        GUARDIAN_NAME: { type: Sequelize.STRING(100), allowNull: true },
        INVST_TYPE: { type: Sequelize.STRING(30), allowNull: true },
        AS_ON_DATE: { type: Sequelize.DATE, allowNull: true },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        CREATED_ON: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_ON: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'TBL_BENPOS_SHAREHOLDER_DETAILS',
            tableName: 'TBL_BENPOS_SHAREHOLDER_DETAILS'
        });

    return TBL_BENPOS_SHAREHOLDER_DETAILS;

}

module.exports.ER_USER_SESSION_DETAILS = function () {
    ER_USER_SESSION_DETAILS.init({
        SESSION_ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        USER_ID: { type: Sequelize.DECIMAL(18, 0), allowNull: true },
        TOKEN: { type: Sequelize.TEXT, allowNull: true },
        EXP_TIME: { type: Sequelize.BIGINT, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_DATE: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    },
        {
            sequelize,
            modelName: 'ER_USER_SESSION_DETAILS',
            tableName: 'ER_USER_SESSION_DETAILS'
        });

    return ER_USER_SESSION_DETAILS;
}





module.exports.TBL_DP_ALLOCATION_APPROVAL = function () {
    TBL_DP_ALLOCATION_APPROVAL.init({
        ID: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        EMPID: { type: Sequelize.STRING(50), allowNull: true },
        FIRSTNAME: { type: Sequelize.STRING(100), allowNull: true },
        DESIGNATED: { type: Sequelize.STRING(100), allowNull: true },
        REQUEST_TYPE: { type: Sequelize.STRING(100), allowNull: true },
        IS_MAIL_SENT_FOR_APPROVAL: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACCEPTED: { type: Sequelize.BOOLEAN, allowNull: true },
        IS_ACTIVE: { type: Sequelize.BOOLEAN, allowNull: true },
        CREATED_DT: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        CREATED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_BY: { type: Sequelize.STRING(500), allowNull: true },
        MODIFIED_DT: { type: Sequelize.DATE, allowNull: true },
        REASON: { type: Sequelize.STRING(500), allowNull: true },
        COMPLIANCEREMARK: { type: Sequelize.STRING(500), allowNull: true },
    },
        {
            sequelize,
            modelName: 'TBL_DP_ALLOCATION_APPROVAL',
            tableName: 'TBL_DP_ALLOCATION_APPROVAL'
        });

    return TBL_DP_ALLOCATION_APPROVAL;

}
























