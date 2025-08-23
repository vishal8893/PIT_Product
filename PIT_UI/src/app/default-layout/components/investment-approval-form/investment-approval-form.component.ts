
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-investment-approval-form',
  templateUrl: './investment-approval-form.component.html',
  styleUrls: ['./investment-approval-form.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class InvestmentApprovalFormComponent {
  visibles: boolean = false;
  IAgreeDisclaimer: any
  tableQuarterId: any
  products: any = []
  productData: any = [];
  items: any[] | undefined;
  EFSLcodeEmployeeType;
  NonEFSLcodeEmployeeType;
  RequestorName;
  Department;
  EmployeeCode;
  selectedValue;
  selectedvalue: any = []
  selectedValue1;
  selectedValue3;
  cities;
  showtablegrid: boolean = false;
  AVQTYFINAL: any
  visible: boolean = false;
  AVQTY: any
  todate: any
  fromdate: any
  ISINNumberdisable: boolean = false;
  TRX_NO: any
  LOCATION: any
  LotSize: any
  COMPANY: any
  IRFApprovalData: any
  isVisibleEquity: boolean = false;
  isVisibleFuture: boolean = false;
  isVisibleOption: boolean = false;
  isVisiblePrimaryIssue: boolean = false;
  isVisibleDebt: boolean = false;
  isVisiblePMS: boolean = false;
  isVisibleSpecialCase: boolean = false;
  IsisVisibleReason: boolean = false;
  show: boolean = false;
  byredio: boolean = false
  userLoggedIn: any;
  isVisiblebuy: boolean = false;
  isVisiblesell: boolean = false;
  isVisiblePrimaryIssueonly: boolean = false;
  isvisibleonpostion: boolean = false;
  isVisibleqty: boolean = false;
  isvisibleonql: boolean = false;
  irfapprovaldata: boolean = false;
  Commodity: boolean = true;
  PMS: boolean = true;
  Debt: boolean = true;
  InstrumentIds: any = []
  Alltransaction: any[];
  Alltransaction1: any[];


  allAquiredthrough: any[];
  EmployeeAccountCode: any = []
  lastbtn: boolean = true;
  userId: any;
  PANNo: any
  DescCode: any
  formDataArray: any = [];
  oid = 0;
  EmployeeDescCode: any = []
  user: string
  reportdata: any = []
  date = new Date();
  currentDate = new Date();

  today: Date;
  minDate: Date;
  maxDate: Date;
  showmainForm: boolean = true;

  PancardNo = ''
  todaynew: Date = new Date();
  minDatenew: Date;
  show1: boolean = false;


  isRolloverValid: boolean = false;
  expirydata: any = [];

  SearchSecurityData: any = []
  Allnameissue: any;
  designatedstatus: any;
  Tenlacsmodel: boolean = false;
  isYesSelected: boolean = false;
  isNoSelected: boolean = false;
  checktruebox: boolean = false;
  isSellNoSelected: boolean = false;
  isSellYesSelected: boolean = false;

  Montharray = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 10, name: 'November' },
    { id: 12, name: 'December' }

  ]

  QuantityLotarray: any = [
    { id: 1, name: 'Lot' },
    { id: 2, name: 'Quantity' },
  ]

  optiontypearray: any = [
    { id: 1, name: 'Call' },
    { id: 2, name: 'Put' },
  ]

  Postionarray: any = [
    { id: 1, name: 'Fresh' },
    { id: 2, name: 'SquareOff' },
  ]

  PrimaryIssueTypearray: any = [
    { id: 1, name: '---Select---' },
    { id: 2, name: 'IPO' },
    { id: 3, name: 'FPO' },
    { id: 4, name: 'Rights Issue' },
    { id: 5, name: 'IDR' },
  ]

  PrimaryIssueTypearray1: any = [
    { id: 1, name: 'IPO' },
    { id: 2, name: 'FPO' },
    { id: 3, name: 'Rights Issue' },
    { id: 4, name: 'IDR' },
  ]

  SpecialCasearray: any = [
    { id: 1, name: 'BuyBack' },
    { id: 2, name: 'Open Offer' },
    { id: 3, name: 'Bonus' },
    { id: 4, name: 'Right Essue' },
    { id: 5, name: 'Split Essue' },
    { id: 6, name: 'Merger/DeMerger' },
    { id: 7, name: 'Holding Case' },
  ]

  irfmainForm = this.formBuilder.group({
    SearchSecurity: ['', Validators.required],
    ISINNumber: [''],
    Transaction: ['', Validators.required],
    Month: [''],
    QuantityLot: [''],
    Lot: [''],
    Postion: [''],
    Quantity: [''],
    Premium: [''],
    TypeofDebt: [''],
    BidPrice: [''],
    BidLotShares: [''],
    activemodel: [''],
    activemodel1: [''],
    Price: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
    MarketPrice: [''],
    selectedValue4: [''],
    StrikePrice: [''],
    optiontype: [''],
    PrimaryIssueType: [''],
    StartDate: [],
    Aquiredthrough: [''],
    SpecialCase: [''],
    SelltransactionDate: [''],
    Reason: [''],
    NameOfIssue: [''],
    isYesSelected: [this.isYesSelected],
    isNoSelected: [this.isNoSelected],
    Tenlacsmodel: [this.Tenlacsmodel],
    isSellNoSelected: [this.isSellNoSelected],
    isSellYesSelected: [this.isSellYesSelected],
  })
  AIA: any;



  // get isYesSelected() {return this.irfmainForm.get('isYesSelected')};
  // get checkBoxControl() {return this.irfmainForm.get('checkBoxControl')};
  get NameOfIssue() { return this.irfmainForm.get('NameOfIssue'); }
  get SearchSecurity() { return this.irfmainForm.get('SearchSecurity'); }
  get ISINNumber() { return this.irfmainForm.get('ISINNumber'); }
  get Transaction() { return this.irfmainForm.get('Transaction'); }
  get Month() { return this.irfmainForm.get('Month'); }
  get QuantityLot() { return this.irfmainForm.get('QuantityLot'); }
  get Lot() { return this.irfmainForm.get('Lot'); }
  get Postion() { return this.irfmainForm.get('Postion'); }
  get Quantity() { return this.irfmainForm.get('Quantity'); }
  get Premium() { return this.irfmainForm.get('Premium'); }
  get TypeofDebt() { return this.irfmainForm.get('TypeofDebt'); }
  get BidPrice() { return this.irfmainForm.get('BidPrice'); }
  get BidLotShares() { return this.irfmainForm.get('BidLotShares'); }
  get activemodel() { return this.irfmainForm.get('activemodel'); }
  get Price() { return this.irfmainForm.get('Price'); }
  get MarketPrice() { return this.irfmainForm.get('MarketPrice'); }
  get selectedValue4() { return this.irfmainForm.get('selectedValue4'); }
  get StrikePrice() { return this.irfmainForm.get('StrikePrice'); }
  get optiontype() { return this.irfmainForm.get('optiontype'); }
  get PrimaryIssueType() { return this.irfmainForm.get('PrimaryIssueType'); }
  get StartDate() { return this.irfmainForm.get('StartDate'); }
  get SelltransactionDate() { return this.irfmainForm.get('SelltransactionDate'); }
  get Aquiredthrough() { return this.irfmainForm.get('Aquiredthrough'); }
  get SpecialCase() { return this.irfmainForm.get('SpecialCase'); }
  get activemodel1() { return this.irfmainForm.get('activemodel1'); }
  get Reason() { return this.irfmainForm.get('Reason'); }



  constructor(
    private formBuilder: FormBuilder, private cd: ChangeDetectorRef,
    private rest: RestService, private router: Router,
    private Global: Global, private messageService: MessageService, private cdRef: ChangeDetectorRef
  ) {
    this.today = new Date();
    this.minDate = new Date(this.today);
    // this.minDate.setMonth(this.minDate.getMonth() + 1); // Set the day to the first day of the current month.
    this.minDate.setMonth(this.minDate.getMonth());
    this.maxDate = new Date(this.today);
    this.maxDate.setMonth(this.today.getMonth() + 3);
    this.maxDate.setDate(0); // Set the day to the last day

    const maxDate = new Date(this.minDate);
    maxDate.setMonth(maxDate.getMonth() + 3)
    // maxDate.setMonth(maxDate.getMonth() + 2)


    this.minDatenew = new Date();
    this.minDatenew.setMonth(this.todaynew.getMonth() - 1);




  }


  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.userId = this.userLoggedIn.ID;
    this.user = JSON.stringify(this.userId)
    this.PancardNo = this.userLoggedIn.PANCARDNO;
    this.designatedstatus = this.userLoggedIn.DSIGNATED;

    this.AIA = localStorage.getItem('AIA');

    var model = {
      EMP: this.userLoggedIn.EMPNO
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    this.rest.postParams(this.Global.getapiendpoint() + "upload/getallAproverdata", { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success == true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));

      } else {

        this.visibles = true;


      }
    })



    this.selectedValue1 = 'Self';
    this.ISINNumberdisable = true;
    this.ISINNumber?.disable()
    this.Alltransaction = [
      { id: 1, value: 'BUY' },
      { id: 2, value: 'SELL' },
    ];
    this.Alltransaction1 = [
      { id: 1, value: 'BUY' },
      { id: 2, value: 'SELL' },
      { id: 3, value: 'ROLLOVER' },
    ];
    this.allAquiredthrough = [
      { id: 1, value: '---Select---' },
      { id: 2, value: 'Primary Market' },
      { id: 3, value: 'Secondary Market' },
    ];

    // if (localStorage.getItem('formDataArray')) {
    //   this.formDataArray = JSON.parse(localStorage.getItem('formDataArray'));
    // }
    this.getallEmployeeAccountCode()
    this.getallCode()

    this.selectedValue3 = 'Equity'
    this.onRadioButtonClick('Equity')
    this.getactivequarter();
    this.getallNameofIssue();

  }

  checkRollover() {
    const today = new Date().toISOString().split('T')[0];

    this.rest.getAll(this.Global.getapiendpoint() + 'expiraydate/GetAllActiveexpirydate').pipe(
      switchMap((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.expirydata = Result;
          // console.log("getAllindivisuals", this.expirydata);

          // Check if today's date is present in the expirydata array
          this.isRolloverValid = this.checkRolloverValidity(today);

          // console.log("this.isRolloverValid", this.isRolloverValid);


          // Update options based on the condition
          this.updateOptions();
        }

        return [];
      })
    ).subscribe();
  }

  checkRolloverValidity(today: string): boolean {
    // Assuming this.expirydata is an array of objects and each object has an 'EXPIRY_DATE' property
    return this.expirydata.some(product => product.EXPIRY_DATE === today);
  }

  updateOptions(): void {
    // if (this.isVisibleFuture) {
    // Include 'ROLLOVER' only when isRolloverValid is true;
    this.Alltransaction1 = this.Alltransaction1.filter(option => option.value !== 'ROLLOVER' || this.isRolloverValid);
    // } else {
    //   // Exclude 'ROLLOVER' when not in future
    //   this.Alltransaction = this.Alltransaction.filter(option => option.value !== 'ROLLOVER');
    // }
  }

  getallEmployeeAccountCode() {
    this.EmployeeAccountCode = []
    this.InstrumentIds = []

    this.EmployeeAccountCode = []
    var model = {
      // loginid: this.userId,
      loginid: this.userLoggedIn.EMPNO
      // PAN: this.PancardNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    // console.log("accountcode", model);

    this.rest.postParams(this.Global.getapiendpoint() + "eirf/EmployeeAccountCodeself", { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success == true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        let fetchedData = Result;
        // console.log("EmployeeAccountCode", fetchedData);
        if (this.selectedValue1 == "Self") {
          fetchedData.map((i: any) => { i.Display = i.TRADING_ACCOUNT_NUMBER + ' - ' + this.userLoggedIn.FIRSTNAME; return i; });
          fetchedData.forEach((element: any) => {
            this.EmployeeAccountCode.push({
              AccountName: this.userLoggedIn.FIRSTNAME,
              AccountCode: element.TRADING_ACCOUNT_NUMBER,
              Display: element.Display,
              // ID: this.userId
              ID: this.userLoggedIn.EMPNO
            })
          })
          // this.EmployeeAccountCode = fetchedData.filter((obj: any) => {
          //   return obj.PAN_NO === this.PancardNo;
          // });
        } else {
          this.rest.postParams(this.Global.getapiendpoint() + "eirf/EmployeeAccountCodedependant", { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success == true) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              let fetchedData = Result;
              // console.log("EmployeeAccountCode", fetchedData);
              fetchedData.map((i: any) => { i.Display = i.TRADING_ACCOUNT_NUMBER + ' - ' + i.RELATIONSHIP; return i; });
              fetchedData.forEach((element: any) => {
                this.EmployeeAccountCode.push({
                  AccountName: this.userLoggedIn.FIRSTNAME,
                  AccountCode: element.TRADING_ACCOUNT_NUMBER,
                  Display: element.Display,
                  // ID: this.userId
                  ID: this.userLoggedIn.EMPNO
                })
              })
            }
          })

        }
      }
    })

  }

  getallirfdata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      this.rest.postParams(this.Global.getapiendpoint() + "eirf/SCRIPDESC", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          const result = Result.filter((a1: { SCRIP_DESC: any; }) =>
            !this.formDataArray.some((a2: { Security: any; }) => a2.Security == a1.SCRIP_DESC)
          );
          this.SearchSecurityData = result;
        }
      })
    } else {
      this.SearchSecurityData = []
    }


  }

  getallCode() {
    this.rest.getAll(this.Global.getapiendpoint() + "eirf/GetIRFData").subscribe((data: any) => {
      if (data.Success == true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.EmployeeDescCode = Result;
        // console.log("EmployeeDescCode", this.EmployeeDescCode);

      }
    })
  }

  getallNameofIssue() {
    this.rest.getAll(this.Global.getapiendpoint() + "itradingpi/GetAllNameofissue").subscribe((data: any) => {
      if (data.Success == true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Allnameissue = Result;
        // console.log("getallNameofIssue", this.Allnameissue);

      }
    })
  }

  canAddTransaction(newTransaction: 'BUY' | 'SELL') {
    const hasOpposite = this.formDataArray.some(item =>
      item.Transaction !== newTransaction
    );

    return hasOpposite;
  }

  AddToList() {
    if (this.Transaction?.value == 'SELL' && (this.selectedValue3 == 'Equity' || this.selectedValue3 == 'SpecialCase')) {
      let subdata = Number(this.AVQTYFINAL) - Number(this.Quantity?.value);
      this.AVQTYFINAL = subdata
    }

    if (this.Transaction?.value == 'SELL' && (this.selectedValue3 == 'Future' || this.selectedValue3 == 'Option')) {
      let mul = Number(this.Lot?.value) * 10
      let subdata = Number(this.AVQTYFINAL) - (mul);

      this.AVQTYFINAL = subdata
    }

    const canAdd = this.canAddTransaction(this.Transaction?.value as 'BUY' | 'SELL')
    if (canAdd) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Only allow the same transaction' });
    } else
      if (this.selectedValue3 !== 'PrimaryIssue') {
        let B: any = this.SearchSecurity.value
        if (this.PANNo) {
          if (this.Transaction?.value === 'BUY') {
            if (this.selectedValue3 !== 'Future' && this.selectedValue3 !== 'Option') {
              this.showtablegrid = true;
              var model: any = {
                Id: this.oid++,
                id: this.userId,
                TRX_NO: this.TRX_NO,
                LOCATION: this.LOCATION,
                COMPANY: this.COMPANY,
                CREATED_BY: this.userId,
                Requestfor: this.selectedValue1,
                NatureofTrade: this.selectedValue3,
                AccountCode: this.PANNo.AccountCode,
                AccountName: this.PANNo.AccountName,
                CRE_USER: this.userLoggedIn.FIRSTNAME,
                UPD_USER: this.userLoggedIn.FIRSTNAME,
                EmployeeNumber: this.userLoggedIn.EMPNO,
                DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                AcquiredType: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
              EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                allAquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                Aquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                AIA: this.AIA,
                AVQTYFINAL: this.AVQTYFINAL,
                  TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
              }
              this.formDataArray.push(model)
              // console.log(" this.formDataArray", this.formDataArray);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
              this.irfmainForm.reset();
              this.Tenlacsmodel = false;
              this.isYesSelected = false;
              this.isNoSelected = false;
              this.checktruebox = false;
              this.isSellNoSelected = false;
              this.isSellYesSelected = false;
            } else {
              if (this.Postion?.value !== 'SquareOff') {
                this.showtablegrid = true;
                var model: any = {
                  Id: this.oid++,
                  id: this.userId,
                  TRX_NO: this.TRX_NO,
                  LOCATION: this.LOCATION,
                  COMPANY: this.COMPANY,
                  CREATED_BY: this.userId,
                  Requestfor: this.selectedValue1,
                  NatureofTrade: this.selectedValue3,
                  AccountCode: this.PANNo.AccountCode,
                  AccountName: this.PANNo.AccountName,
                  CRE_USER: this.userLoggedIn.FIRSTNAME,
                  UPD_USER: this.userLoggedIn.FIRSTNAME,
                  EmployeeNumber: this.userLoggedIn.EMPNO,
                  DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                  DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                  Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                  AcquiredType: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                  projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                  ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                  Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                  NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                  Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                  QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                  FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                  Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                 EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                  allAquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                  TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                  BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                  BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                  activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                  Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                  Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                  MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                  selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                  StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                  OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                  StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                  Aquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                  PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                  AIA: this.AIA,
                  AVQTYFINAL: this.AVQTYFINAL,
                    TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                }
                this.formDataArray.push(model)
                // console.log(" this.formDataArray", this.formDataArray);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                this.irfmainForm.reset();
                this.Tenlacsmodel = false;
                this.isYesSelected = false;
                this.isNoSelected = false;
                this.checktruebox = false;
                this.isSellNoSelected = false;
                this.isSellYesSelected = false;
              } else {
                if (this.isSellYesSelected === true) {
                  const sellTransactionDate = new Date(this.StartDate?.value);

                  // Get the current date
                  const currentDate = new Date();

                  // Subtract 30 days
                  const dateBefore30Days = new Date();
                  dateBefore30Days.setDate(currentDate.getDate() - 30);

                  // Now, you can compare with the SelltransactionDate
                  if (sellTransactionDate < dateBefore30Days && sellTransactionDate < currentDate) {
                    this.showtablegrid = true;
                    var model: any = {
                      Id: this.oid++,
                      id: this.userId,
                      TRX_NO: this.TRX_NO,
                      LOCATION: this.LOCATION,
                      COMPANY: this.COMPANY,
                      CREATED_BY: this.userId,
                      Requestfor: this.selectedValue1,
                      NatureofTrade: this.selectedValue3,
                      AccountCode: this.PANNo.AccountCode,
                      AccountName: this.PANNo.AccountName,
                      CRE_USER: this.userLoggedIn.FIRSTNAME,
                      UPD_USER: this.userLoggedIn.FIRSTNAME,
                      EmployeeNumber: this.userLoggedIn.EMPNO,
                      DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                      DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                      Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                      AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                      Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                      NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                      Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                      QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                      FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                      Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                     EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                      allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                      TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                      BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                      BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                      activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                      Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                      Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                      MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                      selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                      StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                      OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                      StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                      Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                      PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                      AIA: this.AIA,
                      AVQTYFINAL: this.AVQTYFINAL,
                        TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                    }
                    this.formDataArray.push(model)
                    // console.log(" this.formDataArray", this.formDataArray);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                    this.irfmainForm.reset();
                    this.Tenlacsmodel = false;
                    this.isYesSelected = false;
                    this.isNoSelected = false;
                    this.checktruebox = false;
                    this.isSellNoSelected = false;
                    this.isSellYesSelected = false;


                  } else {
                    alert("Holding Period must be more than 30 Day(s).")
                  }
                } else {
                  this.showtablegrid = true;
                  var model: any = {
                    Id: this.oid++,
                    id: this.userId,
                    TRX_NO: this.TRX_NO,
                    LOCATION: this.LOCATION,
                    COMPANY: this.COMPANY,
                    CREATED_BY: this.userId,
                    Requestfor: this.selectedValue1,
                    NatureofTrade: this.selectedValue3,
                    AccountCode: this.PANNo.AccountCode,
                    AccountName: this.PANNo.AccountName,
                    CRE_USER: this.userLoggedIn.FIRSTNAME,
                    UPD_USER: this.userLoggedIn.FIRSTNAME,
                    EmployeeNumber: this.userLoggedIn.EMPNO,
                    DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                    DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                    Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                    AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                    Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                    NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                    Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                    QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                    FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                    Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                   EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                    allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                    TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                    BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                    BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                    activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                    Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                    Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                    MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                    selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                    StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                    OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                    StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                    Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                    // PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                    PreviousTradeValueGreater: this.isSellNoSelected === true ? 0 : null,
                    AIA: this.AIA,
                    AVQTYFINAL: this.AVQTYFINAL,
                      TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                  }
                  this.formDataArray.push(model)
                  // console.log(" this.formDataArray", this.formDataArray);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                  this.irfmainForm.reset();
                  this.Tenlacsmodel = false;
                  this.isYesSelected = false;
                  this.isNoSelected = false;
                  this.checktruebox = false;
                  this.isSellNoSelected = false;
                  this.isSellYesSelected = false;
                }
              }
            }
          } else {
            if (this.selectedValue3 !== 'Future' && this.selectedValue3 !== 'Option') {
              if (this.designatedstatus === true) {
                if (this.Aquiredthrough?.value === 'Primary Market') {
                  this.showtablegrid = true;
                  var model: any = {
                    Id: this.oid++,
                    id: this.userId,
                    TRX_NO: this.TRX_NO,
                    LOCATION: this.LOCATION,
                    COMPANY: this.COMPANY,
                    CREATED_BY: this.userId,
                    Requestfor: this.selectedValue1,
                    NatureofTrade: this.selectedValue3,
                    AccountCode: this.PANNo.AccountCode,
                    AccountName: this.PANNo.AccountName,
                    CRE_USER: this.userLoggedIn.FIRSTNAME,
                    UPD_USER: this.userLoggedIn.FIRSTNAME,
                    EmployeeNumber: this.userLoggedIn.EMPNO,
                    DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                    DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                    Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                    AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                    Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                    NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                    Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                    QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                    FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                    Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
                   EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                    allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                    TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                    BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                    BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                    activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                    Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                    Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                    MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                    selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                    StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                    OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                    StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                    Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                    PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                    AIA: this.AIA,
                    AVQTYFINAL: this.AVQTYFINAL,
                      TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                  }
                  this.formDataArray.push(model)
                  // console.log(" this.formDataArray", this.formDataArray);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                  this.irfmainForm.reset();
                  this.Tenlacsmodel = false;
                  this.isYesSelected = false;
                  this.isNoSelected = false;
                  this.checktruebox = false;
                  this.isSellNoSelected = false;
                  this.isSellYesSelected = false;

                } else {
                  const sellTransactionDate = new Date(this.SelltransactionDate?.value);

                  // Get the current date
                  const currentDate = new Date();

                  // Subtract 30 days
                  const dateBefore30Days = new Date();
                  dateBefore30Days.setDate(currentDate.getDate() - 30);

                  // Now, you can compare with the SelltransactionDate
                  if (sellTransactionDate < dateBefore30Days && sellTransactionDate < currentDate) {
                    this.showtablegrid = true;
                    var model: any = {
                      Id: this.oid++,
                      id: this.userId,
                      TRX_NO: this.TRX_NO,
                      LOCATION: this.LOCATION,
                      COMPANY: this.COMPANY,
                      CREATED_BY: this.userId,
                      Requestfor: this.selectedValue1,
                      NatureofTrade: this.selectedValue3,
                      AccountCode: this.PANNo.AccountCode,
                      AccountName: this.PANNo.AccountName,
                      CRE_USER: this.userLoggedIn.FIRSTNAME,
                      UPD_USER: this.userLoggedIn.FIRSTNAME,
                      EmployeeNumber: this.userLoggedIn.EMPNO,
                      DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                      DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                      Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                      AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                      Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                      NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                      Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                      QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                      FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                      Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
                     EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                      allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                      TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                      BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                      BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                      activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                      Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                      Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                      MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                      selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                      StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                      OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                      StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                      Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                      PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                      AIA: this.AIA,
                      AVQTYFINAL: this.AVQTYFINAL,
                        TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                    }
                    this.formDataArray.push(model)
                    // console.log(" this.formDataArray", this.formDataArray);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                    this.irfmainForm.reset();
                    this.Tenlacsmodel = false;
                    this.isYesSelected = false;
                    this.isNoSelected = false;
                    this.checktruebox = false;
                    this.isSellNoSelected = false;
                    this.isSellYesSelected = false;


                  } else {
                    alert("Holding Period must be more than 30 Day(s).")
                  }

                }
              } else {
                if (this.Aquiredthrough?.value === 'Primary Market') {
                  this.showtablegrid = true;
                  var model: any = {
                    Id: this.oid++,
                    id: this.userId,
                    TRX_NO: this.TRX_NO,
                    LOCATION: this.LOCATION,
                    COMPANY: this.COMPANY,
                    CREATED_BY: this.userId,
                    Requestfor: this.selectedValue1,
                    NatureofTrade: this.selectedValue3,
                    AccountCode: this.PANNo.AccountCode,
                    AccountName: this.PANNo.AccountName,
                    CRE_USER: this.userLoggedIn.FIRSTNAME,
                    UPD_USER: this.userLoggedIn.FIRSTNAME,
                    EmployeeNumber: this.userLoggedIn.EMPNO,
                    DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                    DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                    Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                    AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                    Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                    NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                    Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                    QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                    FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                    Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
                   EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                    allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                    TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                    BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                    BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                    activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                    Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                    Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                    MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                    selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                    StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                    OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                    StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                    Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                    PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                    AIA: this.AIA,
                    AVQTYFINAL: this.AVQTYFINAL,
                      TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                  }
                  this.formDataArray.push(model)
                  // console.log(" this.formDataArray", this.formDataArray);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                  this.irfmainForm.reset();
                  this.Tenlacsmodel = false;
                  this.isYesSelected = false;
                  this.isNoSelected = false;
                  this.checktruebox = false;
                  this.isSellNoSelected = false;
                  this.isSellYesSelected = false;

                } else {
                  // nondesg=this.designatedstatus;AcquiredType;this.isSellYesSelected  
                  if (this.isSellYesSelected === true) {
                    const sellTransactionDate = new Date(this.SelltransactionDate?.value);

                    // Get the current date
                    const currentDate = new Date();

                    // Subtract 30 days
                    const dateBefore30Days = new Date();
                    dateBefore30Days.setDate(currentDate.getDate() - 30);

                    // Now, you can compare with the SelltransactionDate
                    if (sellTransactionDate < dateBefore30Days && sellTransactionDate < currentDate) {
                      this.showtablegrid = true;
                      var model: any = {
                        Id: this.oid++,
                        id: this.userId,
                        TRX_NO: this.TRX_NO,
                        LOCATION: this.LOCATION,
                        COMPANY: this.COMPANY,
                        CREATED_BY: this.userId,
                        Requestfor: this.selectedValue1,
                        NatureofTrade: this.selectedValue3,
                        AccountCode: this.PANNo.AccountCode,
                        AccountName: this.PANNo.AccountName,
                        CRE_USER: this.userLoggedIn.FIRSTNAME,
                        UPD_USER: this.userLoggedIn.FIRSTNAME,
                        EmployeeNumber: this.userLoggedIn.EMPNO,
                        DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                        DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                        Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                        AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                        Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                        projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                        ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                        Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                        NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                        Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                        QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                        FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                        Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
                       EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                        allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                        PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                        TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                        BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                        BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                        activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                        Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                        Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                        MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                        selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                        StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                        OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                        StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                        Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                        CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                        PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                        AIA: this.AIA,
                        AVQTYFINAL: this.AVQTYFINAL,
                          TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                      }
                      this.formDataArray.push(model)
                      // console.log(" this.formDataArray", this.formDataArray);
                      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                      this.irfmainForm.reset();
                      this.Tenlacsmodel = false;
                      this.isYesSelected = false;
                      this.isNoSelected = false;
                      this.checktruebox = false;
                      this.isSellNoSelected = false;
                      this.isSellYesSelected = false;


                    } else {
                      alert("Holding Period must be more than 30 Day(s).")
                    }
                  } else {
                    this.showtablegrid = true;
                    var model: any = {
                      Id: this.oid++,
                      id: this.userId,
                      TRX_NO: this.TRX_NO,
                      LOCATION: this.LOCATION,
                      COMPANY: this.COMPANY,
                      CREATED_BY: this.userId,
                      Requestfor: this.selectedValue1,
                      NatureofTrade: this.selectedValue3,
                      AccountCode: this.PANNo.AccountCode,
                      AccountName: this.PANNo.AccountName,
                      CRE_USER: this.userLoggedIn.FIRSTNAME,
                      UPD_USER: this.userLoggedIn.FIRSTNAME,
                      EmployeeNumber: this.userLoggedIn.EMPNO,
                      DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                      DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                      Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                      AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                      Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                      NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                      Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                      QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                      FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                      Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
                     EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                      allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                      TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                      BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                      BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                      activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                      Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                      Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                      MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                      selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                      StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                      OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                      StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                      Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                      // PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                      PreviousTradeValueGreater: this.isSellNoSelected === true ? 0 : null,
                      AIA: this.AIA,
                      AVQTYFINAL: this.AVQTYFINAL,
                        TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                    }
                    this.formDataArray.push(model)
                    // console.log(" this.formDataArray", this.formDataArray);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                    this.irfmainForm.reset();
                    this.Tenlacsmodel = false;
                    this.isYesSelected = false;
                    this.isNoSelected = false;
                    this.checktruebox = false;
                    this.isSellNoSelected = false;
                    this.isSellYesSelected = false;
                  }

                }
              }
            } else {
              if (this.Postion?.value !== 'SquareOff') {
                this.showtablegrid = true;
                var model: any = {
                  Id: this.oid++,
                  id: this.userId,
                  TRX_NO: this.TRX_NO,
                  LOCATION: this.LOCATION,
                  COMPANY: this.COMPANY,
                  CREATED_BY: this.userId,
                  Requestfor: this.selectedValue1,
                  NatureofTrade: this.selectedValue3,
                  AccountCode: this.PANNo.AccountCode,
                  AccountName: this.PANNo.AccountName,
                  CRE_USER: this.userLoggedIn.FIRSTNAME,
                  UPD_USER: this.userLoggedIn.FIRSTNAME,
                  EmployeeNumber: this.userLoggedIn.EMPNO,
                  DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                  DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                  Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                  AcquiredType: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                  projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                  ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                  Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                  NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                  Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                  QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                  FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                  Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                 EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                  allAquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                  TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                  BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                  BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                  activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                  Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                  Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                  MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                  selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                  StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                  OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                  StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                  Aquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
                  CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                  PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                  AIA: this.AIA,
                  AVQTYFINAL: this.AVQTYFINAL,
                    TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                }
                this.formDataArray.push(model)
                // console.log(" this.formDataArray", this.formDataArray);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                this.irfmainForm.reset();
                this.Tenlacsmodel = false;
                this.isYesSelected = false;
                this.isNoSelected = false;
                this.checktruebox = false;
                this.isSellNoSelected = false;
                this.isSellYesSelected = false;
              } else {
                if (this.isSellYesSelected === true) {
                  const sellTransactionDate = new Date(this.StartDate?.value);

                  // Get the current date
                  const currentDate = new Date();

                  // Subtract 30 days
                  const dateBefore30Days = new Date();
                  dateBefore30Days.setDate(currentDate.getDate() - 30);

                  // Now, you can compare with the SelltransactionDate
                  if (sellTransactionDate < dateBefore30Days && sellTransactionDate < currentDate) {
                    this.showtablegrid = true;
                    var model: any = {
                      Id: this.oid++,
                      id: this.userId,
                      TRX_NO: this.TRX_NO,
                      LOCATION: this.LOCATION,
                      COMPANY: this.COMPANY,
                      CREATED_BY: this.userId,
                      Requestfor: this.selectedValue1,
                      NatureofTrade: this.selectedValue3,
                      AccountCode: this.PANNo.AccountCode,
                      AccountName: this.PANNo.AccountName,
                      CRE_USER: this.userLoggedIn.FIRSTNAME,
                      UPD_USER: this.userLoggedIn.FIRSTNAME,
                      EmployeeNumber: this.userLoggedIn.EMPNO,
                      DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                      DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                      Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                      AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                      ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                      Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                      NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                      Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                      QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                      FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                      Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                     EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                      allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                      TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                      BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                      BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                      activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                      Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                      Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                      MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                      selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                      StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                      OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                      StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                      Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                      CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                      PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                      AIA: this.AIA,
                      AVQTYFINAL: this.AVQTYFINAL,
                        TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                    }
                    this.formDataArray.push(model)
                    // console.log(" this.formDataArray", this.formDataArray);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                    this.irfmainForm.reset();
                    this.Tenlacsmodel = false;
                    this.isYesSelected = false;
                    this.isNoSelected = false;
                    this.checktruebox = false;
                    this.isSellNoSelected = false;
                    this.isSellYesSelected = false;


                  } else {
                    alert("Holding Period must be more than 30 Day(s).")
                  }
                } else {
                  this.showtablegrid = true;
                  var model: any = {
                    Id: this.oid++,
                    id: this.userId,
                    TRX_NO: this.TRX_NO,
                    LOCATION: this.LOCATION,
                    COMPANY: this.COMPANY,
                    CREATED_BY: this.userId,
                    Requestfor: this.selectedValue1,
                    NatureofTrade: this.selectedValue3,
                    AccountCode: this.PANNo.AccountCode,
                    AccountName: this.PANNo.AccountName,
                    CRE_USER: this.userLoggedIn.FIRSTNAME,
                    UPD_USER: this.userLoggedIn.FIRSTNAME,
                    EmployeeNumber: this.userLoggedIn.EMPNO,
                    DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
                    DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
                    Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? null : this.PrimaryIssueType?.value,
                    AcquiredType: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
                    ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
                    Transaction: (this.Transaction?.value == undefined) ? null : this.Transaction?.value,
                    NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
                    Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
                    QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
                    FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
                    Position: (this.Postion?.value == undefined) ? null : this.Postion?.value,
                   EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
                    allAquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
                    TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
                    BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
                    BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
                    activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
                    Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
                    Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
                    MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
                    selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
                    StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
                    OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
                    StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
                    Aquiredthrough: (this.Aquiredthrough?.value == undefined) ? null : this.Aquiredthrough?.value,
                    CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
                    // PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
                    PreviousTradeValueGreater: this.isSellNoSelected === true ? 0 : null,
                    AIA: this.AIA,
                    AVQTYFINAL: this.AVQTYFINAL,
                      TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
                  }
                  this.formDataArray.push(model)
                  // console.log(" this.formDataArray", this.formDataArray);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
                  this.irfmainForm.reset();
                  this.Tenlacsmodel = false;
                  this.isYesSelected = false;
                  this.isNoSelected = false;
                  this.checktruebox = false;
                  this.isSellNoSelected = false;
                  this.isSellYesSelected = false;
                }
              }
            }

          }
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Select Account Name' });
        }
      } else {
        if (this.PANNo) {
          this.showtablegrid = true;
          var model: any = {
            Id: this.oid++,
            id: this.userId,
            TRX_NO: this.TRX_NO,
            LOCATION: this.LOCATION,
            COMPANY: this.COMPANY,
            CREATED_BY: this.userId,
            Requestfor: this.selectedValue1,
            NatureofTrade: this.selectedValue3,
            AccountCode: this.PANNo.AccountCode,
            AccountName: this.PANNo.AccountName,
            CRE_USER: this.userLoggedIn.FIRSTNAME,
            UPD_USER: this.userLoggedIn.FIRSTNAME,
            EmployeeNumber: this.userLoggedIn.EMPNO,
            DependentName: (this.selectedValue1 == 'Self') ? null : this.PANNo.AccountName,
            DateofEarlierTransaction: (this.SelltransactionDate?.value == undefined || this.SelltransactionDate?.value == "") ? null : this.SelltransactionDate?.value,
            Primary_Issue_Type: (this.PrimaryIssueType?.value == undefined || this.PrimaryIssueType?.value == "") ? 'IPO' : this.PrimaryIssueType?.value,
            AcquiredType: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
            // Security: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
            Security: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
            // projectId: (B.SCRIP_DESC == undefined || B.SCRIP_DESC == "") ? null : B.SCRIP_DESC,
            ISIN: (this.ISINNumber?.value == undefined || this.ISINNumber?.value == "") ? null : this.ISINNumber?.value,
            Transaction: (this.Transaction?.value == undefined || this.Transaction?.value == "") ? null : this.Transaction?.value,
            NameOfIssue: (this.NameOfIssue?.value == undefined || this.NameOfIssue?.value == "") ? null : this.NameOfIssue?.value,
            Month: (this.Month?.value == undefined || this.Month?.value == "") ? null : moment(this.Month?.value).format('MMMM'),
            QuantityLot: (this.QuantityLot?.value == undefined || this.QuantityLot?.value == "") ? null : this.QuantityLot?.value,
            FutOpQuantityLot: (this.Lot?.value == undefined || this.Lot?.value == "") ? null : this.Lot?.value,
            Position: (this.Postion?.value == undefined || this.Postion?.value == "") ? null : this.Postion?.value,
           EqQuantity: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value,
            allAquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
            PricePremium: (this.Premium?.value == undefined || this.Premium?.value == "") ? null : this.Premium?.value,
            TypeofDebt: (this.TypeofDebt?.value == undefined || this.TypeofDebt?.value == "") ? null : this.TypeofDebt?.value,
            BidPrice: (this.BidPrice?.value == undefined || this.BidPrice?.value == "") ? null : this.BidPrice?.value,
            BidLotShares: (this.BidLotShares?.value == undefined || this.BidLotShares?.value == "") ? null : this.BidLotShares?.value,
            activemodel: (this.activemodel?.value == undefined || this.activemodel?.value == "") ? null : this.activemodel?.value,
            Price: (this.Price?.value == undefined || this.Price?.value == "") ? null : this.Price?.value,
            Reason: (this.Reason?.value == undefined || this.Reason?.value == "") ? null : this.Reason?.value,
            MarketPrice: (this.MarketPrice?.value == undefined || this.MarketPrice?.value == "") ? null : this.MarketPrice?.value,
            selectedValue4: (this.selectedValue4?.value == undefined || this.selectedValue4?.value == "") ? null : this.selectedValue4?.value,
            StrikePrice: (this.StrikePrice?.value == undefined || this.StrikePrice?.value == "") ? null : this.StrikePrice?.value,
            OptionType: (this.optiontype?.value == undefined || this.optiontype?.value == "") ? null : this.optiontype?.value,
            StartDate: (this.StartDate?.value == undefined || this.StartDate?.value == "") ? "" : this.StartDate?.value,
            Aquiredthrough: (this.Aquiredthrough?.value == undefined || this.Aquiredthrough?.value == "") ? null : this.Aquiredthrough?.value,
            CurrentTradeValue_Greater: this.isYesSelected === true ? 1 : (this.isNoSelected === true ? 0 : null),
            PreviousTradeValueGreater: this.isSellYesSelected === true ? 1 : (this.isSellNoSelected === true ? 0 : null),
            AIA: this.AIA,
            AVQTYFINAL: this.AVQTYFINAL,
            TradeAvailableQty: (this.Quantity?.value === undefined || this.Quantity?.value === null || this.Quantity?.value === "")
  ? Number(this.Lot?.value ?? 0) * 10
  : this.Quantity?.value
          }


          this.formDataArray.push(model);
          console.log(" this.formDataArray", this.formDataArray);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully add to list.' });
          this.irfmainForm.reset();
          this.Tenlacsmodel = false;
          this.isYesSelected = false;
          this.isNoSelected = false;
          this.checktruebox = false;
          this.isSellNoSelected = false;
          this.isSellYesSelected = false;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Select Account Name' });
        }
      }
  }

  getFormattedReasons(rejectionReasons: string): string {
    const reasonsList = rejectionReasons.split(',').map(reason => reason.trim()).filter(reason => reason !== '');

    if (reasonsList.length > 0) {
      return reasonsList.join(', ');
    } else {
      return rejectionReasons.trim();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }

  finalsave() {
    this.lastbtn = true
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(this.formDataArray));

    this.rest.postParams(this.Global.getapiendpoint() + "irf/SubmitApproval", { encryptmodel: encryptmodel }).subscribe((data: any) => {

      if (data.Success == true) {


        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result
        this.ResetMainform();
        // this.irfmainForm.reset();
        // console.log("products", this.products);

        this.irfapprovaldata = true;
        this.allfromdisble();
        this.selectedValue3 = ''
        this.showmainForm = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        // this.checkDigitalPlatformData(this.products);

        this.lastbtn = false;

      } else {
        this.formDataArray = []
        this.irfapprovaldata = false
        this.IAgreeDisclaimer = ''
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }

    })
    // })

  }

  checkDigitalPlatformData(data: any[]) {
    const approvedData: any[] = [];


    for (const item of data) {
      if (item.ApprovalStatus === "Approved") {
        let natureOfTradeCode: any;
        let optionTypeCode: any;

        switch (item.NatureofTrade) {
          case "Equity":
            natureOfTradeCode = "EQ";
            break;
          case "Future":
            natureOfTradeCode = "FUT";
            break;
          case "Option":
            natureOfTradeCode = "OPT";
            break;
          case "Debt":
            natureOfTradeCode = "DEBT";
            break;
          case "SpecialCase":
            natureOfTradeCode = "EQ";
            break;
          default:
            natureOfTradeCode = null;
            break;
        }

        switch (item.OptionType) {
          case "Put":
            optionTypeCode = "PE";
            break;
          case "Call":
            optionTypeCode = "CE";
            break;
        }

        const selectedData = {
          AccountCode: item.AccountCode,
          Data: item,
          Security: item.Security,
          ISIN: item.ISIN,
          Transaction: item.Transaction,
          QuantityLot: item.QuantityLot,
          EqQuantity: item.EqQuantity,
          StrikePrice: item.StrikePrice,
          Month: item.Month,
          NatureofTrade: natureOfTradeCode,
          OptionType: optionTypeCode
        };

        // console.log("digitaldata", selectedData);
        approvedData.push(selectedData);
      }
    }
    // Now 'approvedData' array contains only the selected properties with column names;;irf/Response
    // console.log("Approved Data:", approvedData);
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(approvedData));

    this.rest.postParams(this.Global.getDigitalapiendpoint() + "", { encryptmodel: encryptmodel }).subscribe((data: any) => {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
      this.productData = Result;
      // console.log("beforsavedataDigRes", this.productData);



      if (data.Data.length > 0) {
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(this.productData));
        this.rest.postParams(this.Global.getapiendpoint() + "irf/SaveResponseData", { encryptmodel: encryptmodel }).subscribe((data: any) => {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.productData = Result

          if (data.Success == true) {
            this.irfapprovaldata = true;
            // this.products = data.Data
            // console.log("aftersavedataDigRes", this.products);
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.irfapprovaldata = true;
            // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {
        // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }

      this.irfapprovaldata = true;
    })
  }


  Back() {
    // debugger;
    this.showmainForm = true;
    this.irfapprovaldata = false;
    this.selectedValue3 = 'Equity';
    this.onRadioButtonClick('Equity');
    // this.irfapprovaldata = false;

    // console.log("after back", this.irfapprovaldata);


  }

  ResetMainform() {
    this.showtablegrid = false;
    this.irfmainForm.reset();
    this.selectedValue1 = 'Self';
    this.formDataArray = []
    this.PANNo = ''
    this.Tenlacsmodel = false;
    this.isYesSelected = false;
    this.isNoSelected = false;
    this.checktruebox = false;
    this.isSellNoSelected = false;
    this.isSellYesSelected = false;
    // localStorage.removeItem(this.formDataArray);
  }

  onRadioButtonClick(event: any) {
    this.irfapprovaldata = false;
    if (event === 'Equity') {
      // console.log("in the 3")
      this.showmainForm = true;
      this.irfmainForm.reset();

      this.irfmainForm.get('NameOfIssue').clearValidators();
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').clearValidators();
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = true;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      this.Clearvalidation()
      this.setValidationforEquity()
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'Future') {
      // console.log("in the 4")
      this.showmainForm = true;
      this.irfmainForm.reset();

      this.irfmainForm.get('NameOfIssue').clearValidators();
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').clearValidators();
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = true;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.LotSize = ''
      this.checkRollover();


      this.Clearvalidation()
      this.thissetvalidationforFuture()
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'Option') {
      // console.log("in the 5")
      this.showmainForm = true;
      this.irfmainForm.reset();

      this.irfmainForm.get('NameOfIssue').clearValidators();
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').clearValidators();
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = true;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();

      this.Clearvalidation()
      this.setValidationForOpstion()
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'PrimaryIssue') {
      // console.log('value', this.selectedValue3);
      // console.log("in the 6")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      // Clear validators for specific controls
      this.irfmainForm.get('Transaction').clearValidators();
      this.irfmainForm.get('SearchSecurity').clearValidators();
      this.irfmainForm.get('Price').clearValidators();

      // Update validity after clearing validators
      this.irfmainForm.get('Transaction').updateValueAndValidity();
      this.irfmainForm.get('SearchSecurity').updateValueAndValidity();
      this.irfmainForm.get('Price').updateValueAndValidity();


      // Add new validators for NameOfIssue
      this.irfmainForm.get('NameOfIssue').setValidators([Validators.required]);
      // this.irfmainForm.get('PrimaryIssueType').setValidators([Validators.required]);
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      // this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').setValidators([Validators.required]);
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = true;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      this.Clearvalidation();
      // this.setValidationforPrimaryIssue()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'Commodity') {
      // console.log("in the 7")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      this.irfmainForm.get('NameOfIssue').clearValidators();
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').clearValidators();
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'PMS') {
      // console.log("in the 8")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = true;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'Debt') {
      // console.log("in the 9")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = true;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      // this.Back()
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else if (event === 'SpecialCase') {
      // console.log("in the 10")
      this.showmainForm = true;
      this.irfmainForm.reset();

      this.irfmainForm.get('NameOfIssue').clearValidators();
      this.irfmainForm.get('NameOfIssue').updateValueAndValidity();
      this.irfmainForm.get('PrimaryIssueType').clearValidators();
      this.irfmainForm.get('PrimaryIssueType').updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isVisibleSpecialCase = true
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      this.Clearvalidation()
      this.setValidtionForSpecialCase()
      // this.Back()
    }
    else if (event === 'Pledge') {
      // console.log("in the 11")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      // this.checkRollover();
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    }
    else {
      // console.log("in the 12")
      this.showmainForm = true;
      this.irfmainForm.reset();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      this.isVisibleEquity = false;
      this.isVisibleFuture = false;
      this.isVisibleOption = false;
      this.isVisiblePrimaryIssue = false;
      this.isVisibleDebt = false;
      this.isVisiblePMS = false;
      this.isVisiblebuy = false;
      this.isVisiblesell = false;
      this.isvisibleonpostion = false
      this.isvisibleonql = false
      this.isVisibleqty = false
      this.isVisiblePrimaryIssueonly = false
      this.isVisibleSpecialCase = false
      this.byredio = false
      this.show = false
      this.LotSize = ''
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
      // this.Back()
    }
  }

  SettAvQTY() {

    this.Quantity?.reset()
    this.Lot?.reset()

  }

  SettAvlot() {
    if (this.Transaction?.value == 'SELL') {
      this.Quantity?.reset()
      this.Lot?.reset()
    }
  }
  Showoppositetransaction(event: any) {
    if (this.Transaction?.value == 'BUY' && this.selectedValue3 == 'Equity' && this.designatedstatus === false) {
      this.isVisiblebuy = true;
      this.isVisiblesell = false;
      this.selectedValue4?.setValue('val1')
      this.SelltransactionDate.reset()
      this.Aquiredthrough.reset();

      // if(this.designatedstatus === false){

      // Clear validators for radio buttons
      this.irfmainForm.controls['isNoSelected'].clearValidators();
      this.irfmainForm.controls['isYesSelected'].clearValidators();

      // Update validity for radio buttons
      this.irfmainForm.controls['isNoSelected'].updateValueAndValidity();
      this.irfmainForm.controls['isYesSelected'].updateValueAndValidity();

      // Clear validators for the additional checkbox
      this.irfmainForm.controls['Tenlacsmodel'].clearValidators();

      // Update validity for the additional checkbox
      this.irfmainForm.controls['Tenlacsmodel'].updateValueAndValidity();

      this.irfmainForm.controls["SelltransactionDate"].clearValidators();
      this.irfmainForm.controls["Aquiredthrough"].clearValidators();
      this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
      this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      // Add a custom validator to check if at least one radio button is selected
      this.irfmainForm.setValidators((group) => {
        const isNoSelected = group.get('isNoSelected')?.value;
        const isYesSelected = group.get('isYesSelected')?.value;

        // Add additional required validation for 'Tenlacsmodel' if 'isYesSelected' is true
        if (isYesSelected) {
          const Tenlacsmodel = group.get('Tenlacsmodel')?.value;
          return Tenlacsmodel ? null : { TenlacsmodelRequired: true };
        }

        return isNoSelected || isYesSelected ? null : { atLeastOneRadioSelected: true };
      });
      // }

      // Update validity for the entire form
      this.irfmainForm.updateValueAndValidity();

    } else if (this.Transaction?.value == 'SELL' && this.selectedValue3 == 'Equity') {

      // this.isVisiblebuy = false;
      // // this.isVisiblesell = true;
      // this.byredio = false
      // this.selectedValue4?.setValue('val1')
      // this.SelltransactionDate.reset()
      // this.Aquiredthrough.reset()

      if (this.designatedstatus === false) {
        this.isVisiblebuy = false;
        // this.isVisiblesell = true;
        this.byredio = false
        this.selectedValue4?.setValue('val1')
        this.SelltransactionDate.reset()
        this.Aquiredthrough.reset()

        // Clear validators for radio buttons
        this.irfmainForm.controls['isSellNoSelected'].clearValidators();
        this.irfmainForm.controls['isSellYesSelected'].clearValidators();

        // Update validity for radio buttons
        this.irfmainForm.controls['isSellNoSelected'].updateValueAndValidity();
        this.irfmainForm.controls['isSellYesSelected'].updateValueAndValidity();


        // this.irfmainForm.controls["SelltransactionDate"].setValidators(Validators.required);
        // this.irfmainForm.controls["Aquiredthrough"].setValidators(Validators.required);
        // this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
        // this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();

        // Reset form validators
        this.irfmainForm.setValidators(null);
        this.irfmainForm.updateValueAndValidity();

        // Add a custom validator to check if at least one radio button is selected
        this.irfmainForm.setValidators((group) => {
          const isSellNoSelected = group.get('isSellNoSelected')?.value;
          const isSellYesSelected = group.get('isSellYesSelected')?.value;

          return isSellNoSelected || isSellYesSelected ? null : { atLeastOneRadioSelected: true };
        });

        // Update validity for the entire form
        this.irfmainForm.updateValueAndValidity();
      } else {
        this.irfmainForm.setValidators(null);
        this.isVisiblebuy = false;
        this.isVisiblesell = true;
        this.byredio = false
        this.selectedValue4?.setValue('val1')
        this.SelltransactionDate.reset()
        this.Aquiredthrough.reset()

        // this.irfmainForm.updateValueAndValidity();



        this.irfmainForm.controls["SelltransactionDate"].setValidators(Validators.required);
        this.irfmainForm.controls["Aquiredthrough"].setValidators(Validators.required);
        this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
        this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();

        // Reset form validators 
        // this.irfmainForm.setValidators(null);       
        this.irfmainForm.updateValueAndValidity();
      }


    } else {
      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      // Clear validators for the first set of radio buttons
      this.irfmainForm.controls['isSellNoSelected'].clearValidators();
      this.irfmainForm.controls['isSellYesSelected'].clearValidators();

      // Update validity for the first set of radio buttons
      this.irfmainForm.controls['isSellNoSelected'].updateValueAndValidity();
      this.irfmainForm.controls['isSellYesSelected'].updateValueAndValidity();

      // Clear validators for the second set of radio buttons
      this.irfmainForm.controls['isNoSelected'].clearValidators();
      this.irfmainForm.controls['isYesSelected'].clearValidators();

      // Update validity for the second set of radio buttons
      this.irfmainForm.controls['isNoSelected'].updateValueAndValidity();
      this.irfmainForm.controls['isYesSelected'].updateValueAndValidity();

      // Add any additional validators or conditions here if needed
      // For example, you can set a new validator for a different control
      // this.irfmainForm.controls['anotherControl'].setValidators(...);

      // Update validity for the entire form
      this.irfmainForm.updateValueAndValidity();
    }
    if (this.Transaction?.value == 'SELL') {

      var model = {
        EMP: this.userLoggedIn.EMPNO,
        ISINNumber: this.ISINNumber?.value,
        AccountCode: this.PANNo.AccountCode
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      this.rest.postParams(this.Global.getapiendpoint() + "upload/Datofaposittransaction", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          let dt = moment(Result[0].TRX_DATE).format('MM/DD/YYYY');
          this.SelltransactionDate?.setValue(dt);


        } else {

        }
      })

    } else {

    }
  }

  setdrops(event: any) {
    // debugger;
    if ((this.selectedValue3 == 'Future' || this.selectedValue3 == 'Option') && this.Postion?.value == 'Fresh') {
      // Clear validators for radio buttons
      this.irfmainForm.controls['isNoSelected'].clearValidators();
      this.irfmainForm.controls['isYesSelected'].clearValidators();

      // Update validity for radio buttons
      this.irfmainForm.controls['isNoSelected'].updateValueAndValidity();
      this.irfmainForm.controls['isYesSelected'].updateValueAndValidity();

      // Clear validators for the additional checkbox
      this.irfmainForm.controls['Tenlacsmodel'].clearValidators();

      // Update validity for the additional checkbox
      this.irfmainForm.controls['Tenlacsmodel'].updateValueAndValidity();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();

      // Add a custom validator to check if at least one radio button is selected
      this.irfmainForm.setValidators((group) => {
        const isNoSelected = group.get('isNoSelected')?.value;
        const isYesSelected = group.get('isYesSelected')?.value;

        // Add additional required validation for 'Tenlacsmodel' if 'isYesSelected' is true
        if (isYesSelected) {
          const Tenlacsmodel = group.get('Tenlacsmodel')?.value;
          return Tenlacsmodel ? null : { TenlacsmodelRequired: true };
        }

        return isNoSelected || isYesSelected ? null : { atLeastOneRadioSelected: true };
      });

      // Update validity for the entire form
      this.irfmainForm.updateValueAndValidity();

    } else {
      // Clear validators for radio buttons
      this.irfmainForm.controls['isSellNoSelected'].clearValidators();
      this.irfmainForm.controls['isSellYesSelected'].clearValidators();

      // Update validity for radio buttons
      this.irfmainForm.controls['isSellNoSelected'].updateValueAndValidity();
      this.irfmainForm.controls['isSellYesSelected'].updateValueAndValidity();

      // Reset form validators
      this.irfmainForm.setValidators(null);
      this.irfmainForm.updateValueAndValidity();


      // Add a custom validator to check if at least one radio button is selected
      this.irfmainForm.setValidators((group) => {
        const isSellNoSelected = group.get('isSellNoSelected')?.value;
        const isSellYesSelected = group.get('isSellYesSelected')?.value;

        return isSellNoSelected || isSellYesSelected ? null : { atLeastOneRadioSelected: true };
      });

      // Update validity for the entire form
      this.irfmainForm.updateValueAndValidity();
    }
  }

  yesradioselect() {
    if (this.isYesSelected) {
      this.isNoSelected = false;
      this.checktruebox = true;
    }
  }

  noradioselect() {
    if (this.isNoSelected) {
      this.isYesSelected = false;
      this.checktruebox = false;
      this.Tenlacsmodel = false;
    }
  }

  yesSellradioselect() {
    if (this.isSellYesSelected) {
      this.isSellNoSelected = false;
      if (this.Postion?.value == 'Fresh' && this.selectedValue3 == 'Future') {
        this.isvisibleonpostion = false
        this.irfmainForm.controls["StartDate"].clearValidators();
        this.irfmainForm.controls["StartDate"].updateValueAndValidity();
      } else if (this.Postion?.value == 'SquareOff' && this.selectedValue3 == 'Future') {
        this.isvisibleonpostion = true
        this.irfmainForm.controls["StartDate"].setValidators(Validators.required);
      }
      else if (this.Postion?.value == 'Fresh' && this.selectedValue3 == 'Option') {
        this.isvisibleonpostion = false
        this.irfmainForm.controls["StartDate"].clearValidators();
        this.irfmainForm.controls["StartDate"].updateValueAndValidity();
      }
      else if (this.Postion?.value == 'SquareOff' && this.selectedValue3 == 'Option') {
        this.isvisibleonpostion = true
        this.irfmainForm.controls["StartDate"].setValidators(Validators.required);
      } else if (this.Transaction?.value == 'SELL' && this.selectedValue3 == 'Equity') {
        this.isVisiblesell = true;
        this.irfmainForm.controls["SelltransactionDate"].setValidators(Validators.required);
        this.irfmainForm.controls["Aquiredthrough"].setValidators(Validators.required);
        this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
        this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();
      }
    }
  }

  noSellradioselect() {
    if (this.isSellNoSelected) {
      this.isSellYesSelected = false;
      if (this.Transaction?.value == 'SELL' && this.selectedValue3 == 'Equity') {
        this.isVisiblesell = false;
        this.irfmainForm.controls["SelltransactionDate"].clearValidators();
        this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
        this.irfmainForm.controls["Aquiredthrough"].clearValidators();
        this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();
      } else if (this.selectedValue3 == 'Future' || this.selectedValue3 == 'Option' && this.Postion?.value == 'SquareOff') {
        this.isvisibleonpostion = false;
        this.irfmainForm.controls["StartDate"].clearValidators();
        this.irfmainForm.controls["StartDate"].updateValueAndValidity();
      }


    }
  }

  oniagreebtn(event: any) {
    if (event.checked == 1) {
      this.lastbtn = false
    }
    else {
      this.lastbtn = true
    }
  }

  deletetabledata(event: any) {

    const index = this.formDataArray.findIndex((obj: any) => obj.id === event.id);
    if (index !== -1) {
      this.formDataArray.splice(index, 1);
      if (event.Transaction == 'SELL') {

        this.AVQTYFINAL = ''
      }

      localStorage.setItem('formDataArray', JSON.stringify(this.formDataArray))
    }
    else {
      return this.formDataArray;
    }
  }
  setisin(event: any) {

    let setvalue = event.SCRIP_DESC
    this.SearchSecurityData.forEach(element => {
      if (setvalue == element.SCRIP_DESC) {
        this.ISINNumber?.setValue(element.ISIN_CODE)
        this.TRX_NO = element.TRX_NO
        this.LOCATION = element.LOCATION
        this.COMPANY = element.COMPANY
        this.LotSize = element.LOT_SIZE
        this.AvailableQTY(event.SCRIP_DESC)

      } else {
        // this.ISINNumber?.setValue('')
        // this.LotSize = ''
      }
    });
  }

  setprice(event: any) {
    let val = this.MarketPrice?.value
    if (val) {
      this.Price.setValue('0')
      this.Price.disable()
    } else {
      this.Price.setValue('')
      this.Price.enable()
      this.irfmainForm.controls["Price"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
    }
  }

  hotein(data: any) {
    if (data == 'val1') {
      this.StartDate.reset()
      this.isVisiblesell = false;
      this.byredio = false
      this.irfmainForm.controls["StartDate"].clearValidators();
      this.irfmainForm.controls["StartDate"].updateValueAndValidity();
      // console.log("no");
      this.cd.detectChanges();

      // this.irfmainForm.controls["StartDate"].updateValueAndValidity();

    } else {
      this.StartDate.reset()
      this.isVisiblesell = false;
      this.byredio = true
      this.irfmainForm.controls["StartDate"].setValidators(Validators.required);
      this.irfmainForm.controls["StartDate"].updateValueAndValidity();
      // console.log("yes");
      this.cd.detectChanges();
    }
  }

  setprimaryeshutype() {
    if (this.Aquiredthrough?.value == 'Primary Market') {
      this.isVisiblePrimaryIssueonly = true
      // this.PrimaryIssueType.reset()
      this.irfmainForm.controls["PrimaryIssueType"].setValidators(Validators.required);
      this.irfmainForm.controls["PrimaryIssueType"].updateValueAndValidity();
    } else {
      this.isVisiblePrimaryIssueonly = false
      // this.PrimaryIssueType.reset()
      this.irfmainForm.controls["PrimaryIssueType"].clearValidators();
      this.irfmainForm.controls["PrimaryIssueType"].updateValueAndValidity();
    }
  }

  setquantitylot() {

    if (this.QuantityLot?.value == 'Lot' && this.selectedValue3 == 'Future') {
      this.isvisibleonql = true
      this.isVisibleqty = false
      this.Quantity.reset()

      this.irfmainForm.controls["Lot"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
      this.irfmainForm.controls["Lot"].updateValueAndValidity();

      this.irfmainForm.controls["Quantity"].clearValidators();
      this.irfmainForm.controls["Quantity"].updateValueAndValidity();

    } else if (this.QuantityLot?.value == 'Quantity' && this.selectedValue3 == 'Future') {
      this.isvisibleonql = false
      this.isVisibleqty = true

      this.irfmainForm.controls["Quantity"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
      this.irfmainForm.controls["Lot"].clearValidators();
      this.irfmainForm.controls["Lot"].updateValueAndValidity();

    } else if (this.QuantityLot?.value == 'Lot' && this.selectedValue3 == 'Option') {
      this.isvisibleonql = true
      this.isVisibleqty = false

      this.irfmainForm.controls["Lot"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
      this.irfmainForm.controls["Lot"].updateValueAndValidity();

      this.irfmainForm.controls["Quantity"].clearValidators();
      this.irfmainForm.controls["Quantity"].updateValueAndValidity();

    } else if (this.QuantityLot?.value == 'Quantity' && this.selectedValue3 == 'Option') {
      this.isvisibleonql = false
      this.isVisibleqty = true
      this.irfmainForm.controls["Quantity"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
      this.irfmainForm.controls["Lot"].clearValidators();
      this.irfmainForm.controls["Lot"].updateValueAndValidity();
    }

  }
  setlotandQuantity1(event: any) {
    console.log("Value", event.value);
    let Value = parseInt(event.value) * 10


    if (this.Transaction?.value == 'SELL') {
      if (parseInt(this.AVQTYFINAL) < Value) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please check the available QTY' });
        this.Lot?.reset()
      } else {

      }

    }
  }


  setlotandQuantity(val: any) {
    if (this.selectedValue3 == 'Option' || this.selectedValue3 == 'Future') {
      this.show1 = true
      let inputvalue = parseInt(val.value)
      // let multpalValue = val.value * 2
      let addistion = parseInt(val.value) + (parseInt(this.LotSize))
      let accumulator = parseInt(this.LotSize);
      for (let i = 1; i <= 100; i++) {
        accumulator += (parseInt(this.LotSize))
        if (accumulator == addistion || inputvalue == this.LotSize) {
          this.show1 = false
        }

      }
    }
    if (this.Transaction?.value == 'SELL') {
      if (parseInt(this.AVQTYFINAL) >= parseInt(val.value)) {

      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please check the available QTY' });
        this.Quantity?.reset()
      }
    }


  }

  setdate() {
    if (this.Postion?.value == 'Fresh' && this.selectedValue3 == 'Future') {
      this.isvisibleonpostion = false
      this.irfmainForm.controls["StartDate"].clearValidators();
      this.irfmainForm.controls["StartDate"].updateValueAndValidity();
    } else if (this.Postion?.value == 'SquareOff' && this.selectedValue3 == 'Future') {
      this.isvisibleonpostion = true
      this.irfmainForm.controls["StartDate"].setValidators(Validators.required);
    }
    else if (this.Postion?.value == 'Fresh' && this.selectedValue3 == 'Option') {
      this.isvisibleonpostion = false
      this.irfmainForm.controls["StartDate"].clearValidators();
      this.irfmainForm.controls["StartDate"].updateValueAndValidity();
    }
    else if (this.Postion?.value == 'SquareOff' && this.selectedValue3 == 'Option') {
      this.isvisibleonpostion = true
      this.irfmainForm.controls["StartDate"].setValidators(Validators.required);
    }
  }

  setpremium() {
    let val = this.activemodel?.value
    if (val) {
      this.Premium.setValue('0')
      this.Premium.disable()
    } else {
      this.Premium.setValue('')
      this.Premium.enable()

    }
  }
  setBidPrice() {
    let val = this.activemodel1?.value
    if (val) {
      this.BidPrice.setValue('0')
      this.BidPrice.disable()
    } else {
      this.BidPrice.setValue(' ')
      this.BidPrice.enable()
    }
  }

  allfromdisble() {
    this.isVisibleEquity = false;
    this.isVisibleFuture = false;
    this.isVisibleOption = false;
    this.isVisiblePrimaryIssue = false;
    this.isVisibleDebt = false;
    this.isVisiblePMS = false;
    this.isVisiblebuy = false;
    this.isVisiblesell = false;
    this.isvisibleonpostion = false
    this.isvisibleonql = false
    this.isVisibleqty = false
    this.isVisiblePrimaryIssueonly = false
    this.isVisibleSpecialCase = false
    this.byredio = false
  }

  Clearvalidation() {

    this.irfmainForm.controls["Month"].clearValidators();
    this.irfmainForm.controls["Month"].updateValueAndValidity();

    this.irfmainForm.controls["QuantityLot"].clearValidators();
    this.irfmainForm.controls["QuantityLot"].updateValueAndValidity();

    this.irfmainForm.controls["Lot"].clearValidators();
    this.irfmainForm.controls["Lot"].updateValueAndValidity();

    this.irfmainForm.controls["Postion"].clearValidators();
    this.irfmainForm.controls["Postion"].updateValueAndValidity();

    this.irfmainForm.controls["Quantity"].clearValidators();
    this.irfmainForm.controls["Quantity"].updateValueAndValidity();

    this.irfmainForm.controls["Premium"].clearValidators();
    this.irfmainForm.controls["Premium"].updateValueAndValidity();

    this.irfmainForm.controls["TypeofDebt"].clearValidators();
    this.irfmainForm.controls["TypeofDebt"].updateValueAndValidity();


    this.irfmainForm.controls["BidPrice"].clearValidators();
    this.irfmainForm.controls["BidPrice"].updateValueAndValidity();

    this.irfmainForm.controls["BidLotShares"].clearValidators();
    this.irfmainForm.controls["BidLotShares"].updateValueAndValidity();

    this.irfmainForm.controls["Price"].clearValidators();
    this.irfmainForm.controls["Price"].updateValueAndValidity();

    this.irfmainForm.controls["MarketPrice"].clearValidators();
    this.irfmainForm.controls["MarketPrice"].updateValueAndValidity();

    this.irfmainForm.controls["StrikePrice"].clearValidators();
    this.irfmainForm.controls["StrikePrice"].updateValueAndValidity();

    this.irfmainForm.controls["optiontype"].clearValidators();
    this.irfmainForm.controls["optiontype"].updateValueAndValidity();

    this.irfmainForm.controls["PrimaryIssueType"].clearValidators();
    this.irfmainForm.controls["PrimaryIssueType"].updateValueAndValidity();

    this.irfmainForm.controls["StartDate"].clearValidators();
    this.irfmainForm.controls["StartDate"].updateValueAndValidity();

    this.irfmainForm.controls["Aquiredthrough"].clearValidators();
    this.irfmainForm.controls["Aquiredthrough"].updateValueAndValidity();

    this.irfmainForm.controls["SpecialCase"].clearValidators();
    this.irfmainForm.controls["SpecialCase"].updateValueAndValidity();

    this.irfmainForm.controls["SelltransactionDate"].clearValidators();
    this.irfmainForm.controls["SelltransactionDate"].updateValueAndValidity();
  }
  setValidationforEquity() {
    this.irfmainForm.controls["Quantity"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
    this.irfmainForm.controls["Quantity"].updateValueAndValidity();
    this.irfmainForm.controls["Price"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
    this.irfmainForm.controls["Price"].updateValueAndValidity();
  }
  thissetvalidationforFuture() {
    this.irfmainForm.controls["Month"].setValidators(Validators.required);
    this.irfmainForm.controls["QuantityLot"].setValidators(Validators.required);
    this.irfmainForm.controls["Postion"].setValidators(Validators.required);
    this.irfmainForm.controls["Price"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
    this.irfmainForm.controls["Price"].updateValueAndValidity();
  }
  setValidationForOpstion() {
    this.irfmainForm.controls["Month"].setValidators(Validators.required);
    this.irfmainForm.controls["QuantityLot"].setValidators(Validators.required);
    this.irfmainForm.controls["Postion"].setValidators(Validators.required);
    this.irfmainForm.controls["Premium"].setValidators(Validators.required);
    this.irfmainForm.controls["StrikePrice"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);

  }
  setValidtionForSpecialCase() {
    this.irfmainForm.controls["Quantity"].setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
    this.irfmainForm.controls["Quantity"].updateValueAndValidity();
    this.irfmainForm.controls["SpecialCase"].setValidators(Validators.required);
  }
  setValidationforPrimaryIssue() { }


  getactivequarter() {
    var today = new Date();
    var quarter = Math.floor((today.getMonth() + 3) / 3);
    let Modelofquarter = {
      Quarter: quarter
    }
    this.rest.postParams(this.Global.getapiendpoint() + "eirf/Disclaimer", Modelofquarter).subscribe((data: any) => {
      if (data.Success == true) {
        this.tableQuarterId = data.Data.QuarterId
        let Model = {
          Quarter: this.tableQuarterId.toString(),
          Is_Active: true,
          // Createby: this.userId
          Createby: this.userLoggedIn.EMPNO
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model));

        this.rest.postParams(this.Global.getapiendpoint() + "eirf/Disclaimercheck", { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success == true) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));

          } else {
            this.visible = true;
          }
        })

      } else {

      }
    })
  }


  SubmitDisclaimer() {
    var today = new Date();
    var quarter = Math.floor((today.getMonth() + 3) / 3);
    let Model = {
      Quarter: this.tableQuarterId,
      Is_Active: true,
      // Createby: this.userId,
      Createby: this.userLoggedIn.EMPNO,
      Currentyear: moment(today).format('YYYY')
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model));

    this.rest.postParams(this.Global.getapiendpoint() + "eirf/Disclaimersubmit", { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success == true) {
        this.visible = false;
        var Result = JSON.parse(this.Global.decrypt1(data.Data));

      } else {

      }
    })
  }
  VetReason(event: any) {

    if (event == 'Holding Case') {
      this.IsisVisibleReason = true
      this.irfmainForm.controls["Reason"].setValidators(Validators.required);
      this.irfmainForm.controls['Reason'].updateValueAndValidity();
    } else {
      this.IsisVisibleReason = false
      this.irfmainForm.controls['Reason'].clearValidators();
      this.irfmainForm.controls['Reason'].updateValueAndValidity();

    }


  }

  showDialog() {
    this.router.navigate(['/pit/dark-pool']);
  }
  AvailableQTY(script: any) {

    if (this.PANNo) {
      var model = {
        EMP: this.userLoggedIn.EMPNO,
        SearchSecuritycript: this.ISINNumber?.value,
        AccountCode: this.PANNo.AccountCode
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      this.rest.postParams(this.Global.getapiendpoint() + "upload/AvailableQTY", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.AVQTY = Number(Result[0].dpqty ?? 0);
          this.AVQTYFINAL = this.AVQTY
          console.log("Resulttututut", Number(Result[0].dpqty ?? 0));

        } else {

        }
      })
    } else {
      this.irfmainForm.reset()
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Account name' });


    }

  }
}


