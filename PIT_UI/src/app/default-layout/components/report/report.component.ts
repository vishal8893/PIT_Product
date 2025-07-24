import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ReportComponent {

  optiontypearray: any = [
    { id: 1, name: 'IRF Approval Report' },
    { id: 1, name: 'Trade Recon Report' },
    { id: 1, name: 'Benpos Report' },
    { id: 1, name: 'other' }
  ]

  Todate: any = ''
  Fromdate: any = ''
  // optiontypearray: any
  reportdata: any = []
  Type: any
  userLoggedIn: any;
  userId: any;
  EmpNo: any;
  empname: any;
  CODE: any;
  PANCARDNO:any;
  
  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private Global: Global, private messageService: MessageService,
  ) {

  }

  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);

    this.userId = this.userLoggedIn.ID;
    this.EmpNo = this.userLoggedIn.EMPNO;
    this.empname = this.userLoggedIn.FIRSTNAME;
    this.CODE = this.userLoggedIn.CODE;
    this.PANCARDNO = this.userLoggedIn.PANCARDNO;
  }


  getreport() {

    this.reportdata = []
    if (this.Type) {
      if (this.Type == 'IRF Approval Report') {
        if (this.CODE === "Super Admin") {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                        
                      
          this.rest.postParams(this.Global.getapiendpoint() + "irf/GenerateReport", { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  FIRSTNAME: element.FIRSTNAME,
                  LASTNAME: element.LASTNAME,

                  // TRX_NO: element.TRX_NO,
                  // LOCATION: element.LOCATION,
                  // COMPANY: element.COMPANY,
                  // CRE_USER: element.CRE_USER,

                  CRE_DATE: element.CRE_DATE,

                  // UPD_USER: element.UPD_USER,
                  // UPD_DATE: element.UPD_DATE,

                  NatureofTrade: element.NatureofTrade,
                  Requestfor: element.Requestfor,
                  DependentName: element.DependentName,
                  Security: element.Security,
                  Transaction: element.Transaction,
                  Month: element.Month,
                  OptionType: element.OptionType,
                  QuantityLot: element.QuantityLot,
                  EqQuantity: element.EqQuantity,
                  FutOpQuantityLot: element.FutOpQuantityLot,
                  PricePremium: element.PricePremium,
                  StrikePrice: element.StrikePrice,
                  Position: element.Position,
                  ApprovalStatus: element.ApprovalStatus,
                  RejectionReason: element.RejectionReason,
                  DateofEarlierTransaction: element.DateofEarlierTransaction,
                  EmployeeNumber: element.EmployeeNumber,
                  ISIN: element.ISIN,
                  IsonmarketePrice: element.MarketPrice == "true" ? "Yes" : "No",
                  // EntityName: element.EntityName,
                  PrimaryIssueCategory: element.PrimaryIssueCategory,
                  Primary_Issue_Type: element.Primary_Issue_Type,
                  AcquisitionType: element.AcquisitionType,
                  CurrentTradeValue_Greater: element.CurrentTradeValue_Greater,
                  // PreviousTradeValueGreater: element.PreviousTradeValueGreater,
                  AcquiredType: element.AcquiredType,
                  RightIssueType: element.RightIssueType,
                  IEApprovalStatus: element.IEApprovalStatus,

                  // RequestNumber: element.RequestNumber,
                  // VERSION: element.VERSION,
                  // CHECK_DISCLAIMER: element.CHECK_DISCLAIMER,
                  // ESOP_TRADE_CHECK: element.ESOP_TRADE_CHECK,
                  // APP_TYPE: element.APP_TYPE,
                  // CommSource: element.CommSource,
                  // CommAcquiredThrough: element.CommAcquiredThrough,
                  // CommLocationofPurchase: element.CommLocationofPurchase,
                  // CommNameofCounterParty: element.CommNameofCounterParty,
                  // CommDimension: element.CommDimension,
                  // CommMarketName: element.CommMarketName,
                  // CommVendorDetails: element.CommVendorDetails,
                  // CommTypeofTrade: element.CommTypeofTrade,
                  // SPNCDEntity: element.SPNCDEntity,
                  // IsGWMRA: element.IsGWMRA,
                  // IS_IE_COMPLIANCE_AUTOMATE: element.IS_IE_COMPLIANCE_AUTOMATE,

                  AccountCode: element.AccountCode,
                  SPECIAL_CASE_TYPE: element.SPECIAL_CASE_TYPE,



                  // IS_ACTIVE: element.IS_ACTIVE,
                  // CREATED_BY: element.CREATED_BY,
                  // CREATED_ON: element.CREATED_ON,
                  // MODIFIED_BY: element.MODIFIED_BY,
                  // MODIFIED_ON: element.MODIFIED_ON



                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload()
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            }
          })
        } else {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
            userid: this.EmpNo
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                        
          this.rest.postParams(this.Global.getapiendpoint() + "irf/GenerateUsrReport", { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  FIRSTNAME: element.FIRSTNAME,
                  LASTNAME: element.LASTNAME,

                  // TRX_NO: element.TRX_NO,
                  // LOCATION: element.LOCATION,
                  // COMPANY: element.COMPANY,
                  // CRE_USER: element.CRE_USER,

                  CRE_DATE: element.CRE_DATE,

                  // UPD_USER: element.UPD_USER,
                  // UPD_DATE: element.UPD_DATE,

                  NatureofTrade: element.NatureofTrade,
                  Requestfor: element.Requestfor,
                  DependentName: element.DependentName,
                  Security: element.Security,
                  Transaction: element.Transaction,
                  Month: element.Month,
                  OptionType: element.OptionType,
                  QuantityLot: element.QuantityLot,
                  EqQuantity: element.EqQuantity,
                  FutOpQuantityLot: element.FutOpQuantityLot,
                  PricePremium: element.PricePremium,
                  StrikePrice: element.StrikePrice,
                  Position: element.Position,
                  ApprovalStatus: element.ApprovalStatus,
                  RejectionReason: element.RejectionReason,
                  DateofEarlierTransaction: element.DateofEarlierTransaction,
                  EmployeeNumber: element.EmployeeNumber,
                  ISIN: element.ISIN,
                  IsonmarketePrice: element.MarketPrice == "true" ? "Yes" : "No",
                  // EntityName: element.EntityName,
                  PrimaryIssueCategory: element.PrimaryIssueCategory,
                  Primary_Issue_Type: element.Primary_Issue_Type,
                  AcquisitionType: element.AcquisitionType,
                  CurrentTradeValue_Greater: element.CurrentTradeValue_Greater,
                  // PreviousTradeValueGreater: element.PreviousTradeValueGreater,
                  AcquiredType: element.AcquiredType,
                  RightIssueType: element.RightIssueType,
                  IEApprovalStatus: element.IEApprovalStatus,

                  // RequestNumber: element.RequestNumber,
                  // VERSION: element.VERSION,
                  // CHECK_DISCLAIMER: element.CHECK_DISCLAIMER,
                  // ESOP_TRADE_CHECK: element.ESOP_TRADE_CHECK,
                  // APP_TYPE: element.APP_TYPE,
                  // CommSource: element.CommSource,
                  // CommAcquiredThrough: element.CommAcquiredThrough,
                  // CommLocationofPurchase: element.CommLocationofPurchase,
                  // CommNameofCounterParty: element.CommNameofCounterParty,
                  // CommDimension: element.CommDimension,
                  // CommMarketName: element.CommMarketName,
                  // CommVendorDetails: element.CommVendorDetails,
                  // CommTypeofTrade: element.CommTypeofTrade,
                  // SPNCDEntity: element.SPNCDEntity,
                  // IsGWMRA: element.IsGWMRA,
                  // IS_IE_COMPLIANCE_AUTOMATE: element.IS_IE_COMPLIANCE_AUTOMATE,

                  AccountCode: element.AccountCode,
                  SPECIAL_CASE_TYPE: element.SPECIAL_CASE_TYPE,



                  // IS_ACTIVE: element.IS_ACTIVE,
                  // CREATED_BY: element.CREATED_BY,
                  // CREATED_ON: element.CREATED_ON,
                  // MODIFIED_BY: element.MODIFIED_BY,
                  // MODIFIED_ON: element.MODIFIED_ON



                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload()
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            }
          })
        }
      } else if (this.Type == 'Trade Recon Report') {
        if (this.CODE === "Super Admin") {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                       
          this.rest.postParams(this.Global.getapiendpoint() + "trdreport/Generatetrdrpt", { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  EmpName: element.FIRSTNAME,
                  TradeDate: element.TradeDate,
                  ScripCode: element.ScripCode,
                  ScripName: element.ScripName,
                  ISIN: element.ISIN,
                  Quantity: element.Quantity,
                  TotalPrice: element.TotalPrice,
                  Mode: element.Mode,
                  EirfId: element.EirfId,
                  EirfApprovalDate: element.EirfApprovalDate,
                  EirfQuantity: element.EirfQuantity,
                  IntradayVoil: element.IntradayVoil,
                  NoApprovalVoil: element.NoApprovalVoil,
                  GreaterthanApprovedVoil: element.GreaterthanApprovedVoil,
                  LessthanApprovedVoil: element.LessthanApprovedVoil,
                  HoldingVoil: element.HoldingVoil,
                  RestrictedListVoil: element.RestrictedListVoil,
                  GreyListVoil: element.GreyListVoil,
                  UcLlistVoil: element.UcLlistVoil,
                  NoTraded: element.NoTraded,
                  CreatedBy: element.CreatedBy,
                  CreatedDate: element.CreatedDate,
                  UpdatedBy: element.UpdatedBy,
                  UpdatedDate: element.UpdatedDate
                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload1();
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            }
          });
        } else {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
            userid: this.EmpNo
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

          this.rest.postParams(this.Global.getapiendpoint() + "trdreport/GenerateUsertrdrpt", { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  EmpName: element.FIRSTNAME,
                  TradeDate: element.TradeDate,
                  ScripCode: element.ScripCode,
                  ScripName: element.ScripName,
                  ISIN: element.ISIN,
                  Quantity: element.Quantity,
                  TotalPrice: element.TotalPrice,
                  Mode: element.Mode,
                  EirfId: element.EirfId,
                  EirfApprovalDate: element.EirfApprovalDate,
                  EirfQuantity: element.EirfQuantity,
                  IntradayVoil: element.IntradayVoil,
                  NoApprovalVoil: element.NoApprovalVoil,
                  GreaterthanApprovedVoil: element.GreaterthanApprovedVoil,
                  LessthanApprovedVoil: element.LessthanApprovedVoil,
                  HoldingVoil: element.HoldingVoil,
                  RestrictedListVoil: element.RestrictedListVoil,
                  GreyListVoil: element.GreyListVoil,
                  UcLlistVoil: element.UcLlistVoil,
                  NoTraded: element.NoTraded,
                  CreatedBy: element.CreatedBy,
                  CreatedDate: element.CreatedDate,
                  UpdatedBy: element.UpdatedBy,
                  UpdatedDate: element.UpdatedDate
                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload1();
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            }
          });
        }
      } else if (this.Type == 'Benpos Report') {
        if (this.CODE === "Super Admin") {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                      
          this.rest.postParams(this.Global.getapiendpoint() + "trdreport/GenerateBenposrpt", { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  Pan: element.NO_PANCARD,
                  Name: element.SHARE_HOLDER_NAME,
                  EmailId: element.EMAIL_ID,
                  BenposOpeningStock: element.OPENING_STOCK_BENPOS,
                  TradeType: element.TRADE_TYPE,
                  ApprovalSoughtforQty: element.APPROVAL_SOUGHT_FOR_QTY,
                  Expectedholdingbasedonapproval: element.EXPECTED_HOLDING_BASED_ON_APPROVAL,
                  ActualTradeQty: element.ACTUAL_TRADED_QTY,
                  TradedQtyasperTradereconFile: element.TRADED_QTY_AS_PER_TRADE_RECON_FILE,
                  DematHoldingasondate: element.DEMAT_HOLDING,
                  balasperBenpos: element.BAL_AS_PER_BENPOS,
                  Remarks: element.Remark
                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload2();
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
            }
          });
        } else {
          let model = {
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
            userid: this.PANCARDNO
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          
          this.rest.postParams(this.Global.getapiendpoint() + "trdreport/GenerateUsrBenposrpt", { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.data));
              Result.forEach((element: any) => {
                this.reportdata.push({
                  Pan: element.NO_PANCARD,
                  Name: element.SHARE_HOLDER_NAME,
                  EmailId: element.EMAIL_ID,
                  BenposOpeningStock: element.OPENING_STOCK_BENPOS,
                  TradeType: element.TRADE_TYPE,
                  ApprovalSoughtforQty: element.APPROVAL_SOUGHT_FOR_QTY,
                  Expectedholdingbasedonapproval: element.EXPECTED_HOLDING_BASED_ON_APPROVAL,
                  ActualTradeQty: element.ACTUAL_TRADED_QTY,
                  TradedQtyasperTradereconFile: element.TRADED_QTY_AS_PER_TRADE_RECON_FILE,
                  DematHoldingasondate: element.DEMAT_HOLDING,
                  balasperBenpos: element.BAL_AS_PER_BENPOS,
                  Remarks: element.Remark
                })
              })

              if (this.reportdata.length > 0) {
                this.excelDoWnload2();
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
                this.Type = '';
                this.Fromdate = '';
                this.Todate = '';
              }

            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No recoeds for export' });
            }
          });
        }
      } else {

      }

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Select the Type' });
    }

  }

  excelDoWnload() {
    if (this.reportdata[0]) {
      const wb = XLSX.utils.book_new();

      const sheet1 = XLSX.utils.json_to_sheet(this.reportdata);

      XLSX.utils.book_append_sheet(wb, sheet1, 'Irfa Report');

      XLSX.writeFile(wb, 'IrfReport.xlsx');


    }
  }

  excelDoWnload1() {
    if (this.reportdata[0]) {
      const wb = XLSX.utils.book_new();

      const sheet1 = XLSX.utils.json_to_sheet(this.reportdata);

      XLSX.utils.book_append_sheet(wb, sheet1, 'Trade Recon Report');

      XLSX.writeFile(wb, 'TradeReconReport.xlsx');


    }
  }

  excelDoWnload2() {
    if (this.reportdata[0]) {
      const wb = XLSX.utils.book_new();

      const sheet1 = XLSX.utils.json_to_sheet(this.reportdata);

      XLSX.utils.book_append_sheet(wb, sheet1, 'Benpos Report');

      XLSX.writeFile(wb, 'BenposReport.xlsx');


    }
  }

}

