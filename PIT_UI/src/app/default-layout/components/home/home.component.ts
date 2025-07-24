import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
// import { Product } from '../sub-tasks/product';
// import { ProductService } from '../sub-tasks/productservice';
import { MenuItem } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import * as html2pdf from 'html2pdf.js';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Message, PrimeNGConfig } from 'primeng/api';
import { Moment } from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import {  OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { DarkPoolApprovalModel } from '../dark-pool/dark-pool-approval.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent {
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild('table1', { static: false }) table1: ElementRef;
  @ViewChild('table2', { static: false }) table2: ElementRef;
  
  userLoggedIn: any
  userId: any
  Violationdata: any = []
  holdingdata: any = []
  irf: any = []
  data: any;
  options: any;
  visible: boolean = false;
  labelsarray: any = [];
  pienoarray: any = [];
  EmpNo: any;

  //new compliance code
  ProjectCount: number;
  TotalUProjectCount: number;
  SCOICount: number;
  TotalUSCOICount: number;
  TotalUIRFCount: number;
  ViolationCount: number;
  PCOICount: number;
  TotalUPCOICount: number;
  TotalRejectIRFCount: number;
  activeProjectsData: any = [];
  allProjectsData: any = [];
  activePCOIData: any = [];
  allPCOIData: any = [];
  activeSCOIData: any = [];
  allSCOIData: any = [];
  todayIRFData: any = [];
  violationData: any = [];
  violationAwaitData: any = [];
  todayIRFRejectData: any = [];
  totalviolationData: any = [];
  showActiveProjectsTable: boolean = false;
  showAllProjectsTable: boolean = false;
  showActivePcoiData: boolean = false;
  showAllPcoiData: boolean = false;
  showActiveScoiData: boolean = false;
  showAllScoiData: boolean = false;
  showTodayIRFData: boolean = false;
  showViolationData: boolean = false;
  showViolationWaitedData: boolean = false;
  showTodayRejectIRFData: boolean = false;
  showTotalViolationData: boolean = false;
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  scoi: any = [];
  eah: any = [];
  eah1: any = [];
  pcoi1: any = [];
  scoi1: any = [];
  irf1: any = [];
  irf2: any = [];
  Violationdata1: any = [];
  upsiprojects: any = [];
  expirydatedata: any = [];
  pcoi: any = [];
  holidays: any = [];
  requestCompliance: any = [];
  requestUser: any = [];
  requestdetailsdata: any = [];
  empname: any;
  showOtherInput: boolean = false;
  TotalHelpRequest: number;
  statusNgmodel: any;
  showRequestDataTable: boolean = false;
  showQueryDataTable: boolean = false;
  statusid: any;
  querysallData: any = [];
  violationStatusData: any = [];
  showviolationStatusData: boolean = false;
  showvioStatusGrid: boolean = false;
  visiblestatusGrid: boolean = false;
  vioStatusGridData: any = [];
  employeeData: any = {};
  CODE: any;
  statusOptions = [
    { ID: 1, NAME: 'IN Progress' },
    { ID: 2, NAME: 'Completed' },
  ]
  voilationOptions = [
    { ID: 1, NAME: 'Functional' },
    { ID: 2, NAME: 'Technical' },
  ];
  requestOptions = [
    { ID: 1, NAME: 'EAH' },
    { ID: 2, NAME: 'PCOI' },
    { ID: 3, NAME: 'IRF Approval' },
    { ID: 4, NAME: 'Other' },
  ]


approvalData: DarkPoolApprovalModel[] = [];
  approvalDataLoading: boolean = false;
  userData: any;
  private destroyed$ = new Subject<void>();

  // Role-based access control
  hasAccess: boolean = false;
  isCheckingAccess: boolean = true;
  accessDeniedMessage: string = 'Access denied. Only Admin and Super Admin users can access this component.';
  rolesData: any[] = [];

  // Action tracking
  isProcessing: boolean = false;
  processingRecordId: any = null;

  // Dialog properties
  showConfirmDialog: boolean = false;
  confirmDialogAction: 'approve' | 'reject' = 'approve';
  confirmDialogTitle: string = '';
  confirmDialogMessage: string = '';
  confirmDialogConfirmLabel: string = '';
  currentRecord: DarkPoolApprovalModel | null = null;


  Voilationform = this.formBuilder.group({
    VId: [],
    // Voilation: ['', [Validators.required]],
    Voilation: [{ value: '', disabled: true }, Validators.required],
    Remark: ['', [Validators.required]],

  })

  helpdeskform = this.formBuilder.group({
    // selectedVoilation: ['', [Validators.required]],
    selectedRequestType: ['', [Validators.required]],
    query: ['', [Validators.required]],
    otherRequestType: [''],
  });

  helpdeskUpdateform = this.formBuilder.group({
    selectedstatus: ['', [Validators.required]],
    Updatequery: ['', [Validators.required]],
  });

  get selectedstatus() { return this.helpdeskUpdateform.get('selectedstatus'); }
  get Updatequery() { return this.helpdeskUpdateform.get('Updatequery'); }

  get Voilation() { return this.Voilationform.get('Voilation'); }
  get Remark() { return this.Voilationform.get('Remark'); }
  get VId() { return this.Voilationform.get('VId'); }



  // get selectedVoilation() { return this.helpdeskform.get('selectedVoilation'); }
  get selectedRequestType() { return this.helpdeskform.get('selectedRequestType'); }
  get query() { return this.helpdeskform.get('query'); }
  get otherRequestType() { return this.helpdeskform.get('otherRequestType'); }

  constructor(
    private formBuilder: FormBuilder, private router: Router,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {

  }

  //for user dashboard
  //holding details
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_json(ws, this.holdingdata, { header: ['Scrip Name', 'DP Holding', 'LTP', 'Avg. Buy Price', 'Last Trans. Value', 'Late Trade Date'] });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'holding_data.xlsx');
  }

  // exportToPDF(): void {
  //   const pdf = new jsPDF();
  //   const element = this.table.nativeElement;

  //   // Cast the pdf instance to 'any' to avoid TypeScript errors
  //   (pdf as any).autoTable({
  //     head: [['Scrip Name', 'DP Holding', 'LTP', 'Avg. Buy Price', 'Last Trans. Value', 'Late Trade Date','AccName','CreatedBy','CreatedDate','EmpId','Exch','ExpiryDate','ISIN','Mode','OpenQuantity','OptionType','PanNo','Quantity','ScripCode','StrikePrice','TradedBy','TransId','UpdatedBy','UpdatedDate']],
  //     body: this.holdingdata.map(item => [item.ScripName, item.AccCode, '9087', '10', item.TotalPrice, item.TradeDate,item.AccName,item.CreatedBy,item.CreatedDate,item.EmpId,item.Exch,item.ExpiryDate,item.ISIN,item.Mode,item.OpenQuantity,item.OptionType,item.PanNo,item.Quantity,item.ScripCode,item.StrikePrice,item.TradedBy,item.TransId,item.UpdatedBy,item.UpdatedDate])
  //   });

  //   pdf.save('holding_data.pdf');
  // }
  // exportToPDF(): void {
  //   const pdf = new jsPDF();
  
  //   // Define the headers for the table
  //   const headers = [
  //     'Scrip Name', 'DP Holding', 'LTP', 'Avg. Buy Price', 'Last Trans. Value', 'Late Trade Date',
  //     'AccName', 'CreatedBy', 'CreatedDate', 'EmpId', 'Exch', 'ExpiryDate', 'ISIN', 'Mode',
  //     'OpenQuantity', 'OptionType', 'PanNo', 'Quantity', 'ScripCode', 'StrikePrice', 'TradedBy',
  //     'TransId', 'UpdatedBy', 'UpdatedDate'
  //   ];
  
  //   // Extract the data from holdingdata
  //   const data = this.holdingdata.map(item => [
  //     item.ScripName, item.AccCode, '9087', '10', item.TotalPrice, item.TradeDate,
  //     item.AccName, item.CreatedBy, item.CreatedDate, item.EmpId, item.Exch, item.ExpiryDate,
  //     item.ISIN, item.Mode, item.OpenQuantity, item.OptionType, item.PanNo, item.Quantity,
  //     item.ScripCode, item.StrikePrice, item.TradedBy, item.TransId, item.UpdatedBy, item.UpdatedDate
  //   ]);
  
  //   // Configure column widths dynamically based on the number of columns
  //   const columnStyles: Record<number, { columnWidth: number }> = {};
  //   for (let i = 0; i < headers.length; i++) {
  //     columnStyles[i] = { columnWidth: 30 }; // Set the default width, adjust as needed
  //   }
  
  //   // Cast the pdf instance to 'any' to avoid TypeScript errors
  //   (pdf as any).autoTable({
  //     head: [headers],
  //     body: data,
  //     columnStyles: columnStyles,
  //   });
  
  //   pdf.save('holding_data.pdf');
  // }
  

  // exportToPDF(): void {
  //   // Create a container div for the scrollable table
  //   const container = document.createElement('div');
  //   container.style.overflow = 'auto'; // Enable overflow for scrollbar
  
  //   // Define the headers for the table
  //   const headers = [
  //     'Scrip Name', 'DP Holding', 'LTP', 'Avg. Buy Price', 'Last Trans. Value', 'Late Trade Date',
  //     'AccName', 'CreatedBy', 'CreatedDate', 'EmpId', 'Exch', 'ExpiryDate', 'ISIN', 'Mode',
  //     'OpenQuantity', 'OptionType', 'PanNo', 'Quantity', 'ScripCode', 'StrikePrice', 'TradedBy',
  //     'TransId', 'UpdatedBy', 'UpdatedDate'
  //   ];
  
  //   // Extract the data from holdingdata
  //   const data = this.holdingdata.map(item => [
  //     item.ScripName, item.AccCode, '9087', '10', item.TotalPrice, item.TradeDate,
  //     item.AccName, item.CreatedBy, item.CreatedDate, item.EmpId, item.Exch, item.ExpiryDate,
  //     item.ISIN, item.Mode, item.OpenQuantity, item.OptionType, item.PanNo, item.Quantity,
  //     item.ScripCode, item.StrikePrice, item.TradedBy, item.TransId, item.UpdatedBy, item.UpdatedDate
  //   ]);
  
  //   // Create the table element
  //   const table = document.createElement('table');
  //   table.classList.add('pdf-table');
  
  //   // Create the header row
  //   const headerRow = document.createElement('tr');
  //   headers.forEach(header => {
  //     const th = document.createElement('th');
  //     th.textContent = header;
  //     headerRow.appendChild(th);
  //   });
  //   table.appendChild(headerRow);
  
  //   // Create the body rows
  //   data.forEach(rowData => {
  //     const row = document.createElement('tr');
  //     rowData.forEach(cellData => {
  //       const td = document.createElement('td');
  //       td.textContent = cellData;
  //       row.appendChild(td);
  //     });
  //     table.appendChild(row);
  //   });
  
  //   // Append the table to the container
  //   container.appendChild(table);
  
  //   // Convert the HTML to PDF using html2pdf
  //   html2pdf(container, {
  //     margin: 10,
  //     filename: 'holding_data.pdf',
  //     html2canvas: { scale: 2 }, // Scale for better resolution
  //   });
  // }
  
  exportToPDF(): void {
    const pdf = new jsPDF();
  
    // Define the headers for the table
    const headers = [
      'Scrip Name', 'DP Holding', 'LTP', 'Avg. Buy Price', 'Last Trans. Value', 'Late Trade Date',
      'AccName', 'AccCode', 'Designated', 'EmpId', 'EFSLDesignated', 'E_BOID', 'Name', 'ISIN',
      'PAN', 'Login ID'
    ];
   
    // Extract the data from holdingdata
    const data = this.holdingdata.map(item => [
      item.SCRIP_DESC, item.DP_QTY, '9087', '10', item.DP_QTY, item.TRX_DATE,
      item.ACCOUNT_NAME, item.ACCOUNT_CODE, item.DESIGNATED, item.EMPID, item.EFSL_DESIGNATED, item.E_BOID,
      item.FIRSTNAME, item.ISIN_CODE, item.PAN_NO, item.LOGIN_ID
    ]);
  
    // Configure column widths dynamically based on the number of columns
    const columnStyles: Record<number, { columnWidth: number | 'auto' }> = {};
    for (let i = 0; i < headers.length; i++) {
      columnStyles[i] = { columnWidth: 'auto' as const };
    }
  
    // Split data into chunks (adjust chunkSize as needed)
    const chunkSize = 5;
    for (let i = 0; i < headers.length; i += chunkSize) {
      const chunkHeaders = headers.slice(i, i + chunkSize);
      const chunkData = data.map(row => row.slice(i, i + chunkSize));
  
      // Add a new page for each chunk (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
  
      // Cast the pdf instance to 'any' to avoid TypeScript errors
      (pdf as any).autoTable({
        head: [chunkHeaders],
        body: chunkData,
        columnStyles: columnStyles,
        styles: { overflow: 'linebreak' },
        margin: { top: 10 },
      });
    }
  
    pdf.save('holding_data.pdf');
  }
   
  ngAfterViewInit() {
    (window as any).exportToExcel = this.exportToExcel.bind(this);
    (window as any).exportToPDF = this.exportToPDF.bind(this);
    (window as any).exportToExcel1 = () => this.exportToExcel1();
    (window as any).exportToPDF1 = () => this.exportToPDF1();
    (window as any).exportToExcel2 = () => this.exportToExcel2();
    (window as any).exportToPDF2 = () => this.exportToPDF2();
  }

  //for irf
  exportToExcel1(): void {
    // Check if the table1 reference is available
    if (this.table1) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table1.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.sheet_add_json(ws, this.irf, { header: ['Name Of Security', 'Instrument Type', 'Transaction Type', 'Quantity', 'Price Limit(Not including Brokerage)', 'Status', 'Rejection Reason'] });
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'irf_data.xlsx');
    } else {
      console.error('Table reference (table1) not available.');
    }
  }

  exportToPDF1(): void {
    const pdf = new jsPDF();
  
    // Define the headers for the table
    const headers = [
      'Name Of Security', 'Instrument Type', 'Transaction Type', 'Quantity', 'Price Limit(Not including Brokerage)', 'Status',
      'Rejection Reason','APP_TYPE','AccountCode','AcquiredType','AcquisitionType','CHECK_DISCLAIMER','COMPANY','CREATED_BY','CRE_DATE',
      'CRE_USER','CommAcquiredThrough','CommDimension','CommLocationofPurchase','CommMarketName','CommNameofCounterParty','CommSource',
      'CommTypeofTrade','CommVendorDetails',,'CurrentTradeValue_Greater','DateofEarlierTransaction','DependentName','ESOP_TRADE_CHECK',
      'EmployeeNumber','EntityName','FutOpQuantityLot','ID','IEApprovalStatus','ISIN','IS_ACTIVE','IS_IE_COMPLIANCE_AUTOMATE','IsGWMRA',
      'LOCATION','MODIFIED_BY','MODIFIED_ON','MarketPrice','Month','OptionType','Position','PreviousTradeValueGreater','PricePremium',
      'PrimaryIssueCategory','Primary_Issue_Type','QuantityLot','RequestNumber','Requestfor','RightIssueType','SPECIAL_CASE_TYPE','SPNCDEntity',
      'StrikePrice','TRX_NO','UPD_DATE','UPD_USER','VERSION'
    ];
   
    // Extract the data from holdingdata
    const data = this.irf.map(item => [
      item.Security, item.NatureofTrade, item.Transaction, item.EqQuantity, '', item.ApprovalStatus,
      item.RejectionReason,item.APP_TYPE,item.AccountCode,item.AcquiredType,item.AcquisitionType,item.CHECK_DISCLAIMER,item.COMPANY,item.CREATED_BY,item.CRE_DATE,
      item.CRE_USER,item.CommAcquiredThrough,item.CommDimension,item.CommLocationofPurchase,item.CommMarketName,item.CommNameofCounterParty,item.CommSource,
      item.CommTypeofTrade,item.CommVendorDetails,item.CurrentTradeValue_Greater,item.DateofEarlierTransaction,item.DependentName,item.ESOP_TRADE_CHECK,
      item.EmployeeNumber,item.EntityName,item.FutOpQuantityLot,item.ID,item.IEApprovalStatus,item.ISIN,item.IS_ACTIVE,item.IS_IE_COMPLIANCE_AUTOMATE,item.IsGWMRA,
      item.LOCATION,item.MODIFIED_BY,item.MODIFIED_ON,item.MarketPrice,item.Month,item.OptionType,item.Position,item.PreviousTradeValueGreater,item.PricePremium,
      item.PrimaryIssueCategory,item.Primary_Issue_Type,item.QuantityLot,item.RequestNumber,item.Requestfor,item.RightIssueType,item.SPECIAL_CASE_TYPE,item.SPNCDEntity,
      item.StrikePrice,item.TRX_NO,item.UPD_DATE,item.UPD_USER,item.VERSION
    ]);

    // Configure column widths dynamically based on the number of columns
    const columnStyles: Record<number, { columnWidth: number | 'auto' }> = {};
    for (let i = 0; i < headers.length; i++) {
      columnStyles[i] = { columnWidth: 'auto' as const };
    }
  
    // Split data into chunks (adjust chunkSize as needed)
    const chunkSize = 7;
    for (let i = 0; i < headers.length; i += chunkSize) {
      const chunkHeaders = headers.slice(i, i + chunkSize);
      const chunkData = data.map(row => row.slice(i, i + chunkSize));
  
      // Add a new page for each chunk (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
  
      // Cast the pdf instance to 'any' to avoid TypeScript errors
      (pdf as any).autoTable({
        head: [chunkHeaders],
        body: chunkData,
        columnStyles: columnStyles,
        styles: { overflow: 'linebreak' },
        margin: { top: 10 },
      });
    }
  
    pdf.save('irf_data.pdf');
  }

  // for violation
  exportToExcel2(): void {
    // Check if the table1 reference is available
    if (this.table2) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table2.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // { header: ['Trade Violation', 'Scrip Name', 'Date', 'Status'] }
      XLSX.utils.sheet_add_json(ws, this.Violationdata);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Violation_data.xlsx');
    } else {
      console.error('Table reference (table2) not available.');
    }
  }

  exportToPDF2(): void {
    const pdf = new jsPDF();
  
    // Define the headers for the table
    const headers = [
      'Trade Violation', 'Scrip Name', 'Date', 'Status'
    ];
   
    // Extract the data from holdingdata
    const data = this.Violationdata.map(item => [
      item.NoApprovalVoil, item.ScripName, item.CreatedDate, item.Status
    ]);

    // Configure column widths dynamically based on the number of columns
    const columnStyles: Record<number, { columnWidth: number | 'auto' }> = {};
    for (let i = 0; i < headers.length; i++) {
      columnStyles[i] = { columnWidth: 'auto' as const };
    }
  
    // Split data into chunks (adjust chunkSize as needed)
    const chunkSize = 7;
    for (let i = 0; i < headers.length; i += chunkSize) {
      const chunkHeaders = headers.slice(i, i + chunkSize);
      const chunkData = data.map(row => row.slice(i, i + chunkSize));
  
      // Add a new page for each chunk (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
  
      // Cast the pdf instance to 'any' to avoid TypeScript errors
      (pdf as any).autoTable({
        head: [chunkHeaders],
        body: chunkData,
        columnStyles: columnStyles,
        styles: { overflow: 'linebreak' },
        margin: { top: 10 },
      });
    }
  
    pdf.save('violation_data.pdf');
  }


  ngOnInit() {
    // this.userLoggedIn = JSON.parse(sessionStorage.getItem('userLoggedIn')!);
    // const userLoggedInString = sessionStorage.getItem('userLoggedIn');
    // this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);


    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);

    this.userId = this.userLoggedIn.ID;
    this.EmpNo = this.userLoggedIn.EMPNO;
    this.empname = this.userLoggedIn.FIRSTNAME;
    this.CODE =  this.userLoggedIn.CODE;
    this.getallirfdata(this.EmpNo);
    this.getRequestData();
    this.getallholdingdata(this.EmpNo);
    this.ViolationData();
    this.getActiveEAHData();
    this.getAllEAHData();
    this.getActivePCOIData();
    this.getAllPCOIData();
    this.getActiveSCOIData();
    this.getAllSCOIData();
    this.getIrfData();
    this.getIrfRejectedData();
    this.getViolationData();
    this.getallUPSIProjectList();
    this.getallExpiryMSTList();
    this.getAllHolidayList();
    this.getAllStatusData();
    this.loadUserData();
    this.checkUserAccess()
    setTimeout(() => {
      this.pie()
    }, 1000);
  }

  decrypt(encryptedString: any) {

    let plainText = jwtDecode(encryptedString);
    return plainText;

  }

  getAllStatusData(){

    var model: any = {

      employeeid: this.EmpNo

    }

    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("statusmodel",encryptmodel);
    
    this.rest.postParams(this.Global.getapiendpoint() + `home/getstatusforclsr`,{ encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        // console.log("employeeData",Result);
        this.employeeData = Result[0]; 
        // console.log("employeeData",this.employeeData);
      }
    });    
  }

  getFormattedReasons(rejectionReasons: string): string {
    const reasonsList = rejectionReasons.split(',').map(reason => reason.trim()).filter(reason => reason !== '');
  
    if (reasonsList.length > 0) {
      return reasonsList.join(', ');
    } else {
      return rejectionReasons.trim();
    }
  }
  

  getallirfdata(emp:any) {
    // var emp = this.EmpNo;
    
    this.rest.getAll(this.Global.getapiendpoint() + `home/GetirfdataUSER/${emp}`).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.irf = Result;        
        this.irf.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
          i.FormattedRejectionReason = this.getFormattedReasons(i.RejectionReason);
        })
        // console.log("this.irf", this.irf)
      }
    });
  }

  getallholdingdata(emp:any) {

    this.rest.getAll(this.Global.getapiendpoint() + `home/Getholdingdata/${emp}`).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.holdingdata = Result;
        // console.log("this.holdingdata", this.holdingdata)
        this.holdingdata.forEach((element: any) => {
          this.labelsarray.push(element.SCRIP_DESC)
          this.pienoarray.push(element.DP_QTY)


        })
      }
    });
  }

  pie() {
    // console.log("arrray", this.labelsarray, this.pienoarray);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: this.labelsarray,
      datasets: [
        {
          data: this.pienoarray,
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'),
          documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--pink-500')
          ],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-400'),
          documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--pink-400')
          ]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          position: 'bottom',
          align: "start",
          labels: {
            usePointStyle: true,
            color: textColor

          }
        }
      }
    };


  }

  showDialog(data: any) {
    // debugger;
    let Id = data.TransId
    this.VId.setValue(Id)
    this.Voilation.setValue(data.NoApprovalVoil)
    this.visible = true;
    this.showviolationStatusData = true; 
    this.getViolationStatusData(this.VId.value);
  }

  closeDialog() {
    this.visible = false;
  }

  SubmitDisclaimer() {
    this.visible = false;
  }

  Reset() {
    this.Voilationform.reset()
  }

  ViolationData() {
    let Mode = {
      Id: this.EmpNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(Mode));
    // console.log("vioemp",encryptmodel);
    
    this.rest.postParams(this.Global.getapiendpoint() + 'home/Violationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Violationdata = Result;
        this.Violationdata = this.Violationdata.filter((i: any) => i.NoApprovalVoil !== 'null');
        this.Violationdata.map((i: any, indexof: any) => {
          i.SrNo = indexof + 1
        })
        // console.log("Violationdata", this.Violationdata);

      }
    });
  }

  navigatejd() {
    this.router.navigate(['/pit/joiningdeclaration']);

  }
  navigateEah() {
    this.router.navigate(['/pit/eah']);
  }

  navigatePCOI() {
    this.router.navigate(['/pit/pcoin']);
  }

  mavigaupsi() {

    this.router.navigate(['/pit/scoi']);
  }

  ViolationRemarkSave() {
    let model = {
      Violation: this.Voilation?.value,
      Remarks: this.Remark?.value,
      VoilationId: this.VId.value,
      // UserId: this.userId
      UserId: this.EmpNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("ViolationRemarkSave", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'home/Violationremarks', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        // this.visible = false;        
        // this.showviolationStatusData = false;
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.showviolationStatusData = true;        
        this.getViolationStatusData(this.VId.value);
        this.ViolationData();
        this.getViolationData();
        this.showProjectData('ViolationReceive');
        this.showProjectData('ViolationAwait');
        this.showProjectData('ViolationActive');
        this.Voilationform.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Remark save successfuly" });
      }
    });
  }

  getViolationStatusData(SId:any) {
    this.rest.getAll(this.Global.getapiendpoint() + `home/getViolationstatusDataBYID/${SId}`).subscribe((data) => {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
      this.violationStatusData = Result;
      this.vioStatusGridData = Result;
      this.violationStatusData.forEach((i: any, indexof: any) => {
        i.Srno = indexof + 1;
      });
      // console.log("DisplayViolationStatusData", this.violationStatusData);
      // this.showRequestDataTable = true;
    });
  }

  onEditVioStatus(product: any){
    // console.log("oneditvioStatus",product);
    // console.log(product.TransId);
    this.visiblestatusGrid = true;
    this.showvioStatusGrid = true;
    this.getViolationStatusData(product.TransId);
    
  }

  //new compliance code

  getActiveEAHData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getActiveEAHData').subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.eah = Result;
        this.eah.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.ProjectCount = this.eah.length;
        // console.log("Total Avtive EAH Count:", this.ProjectCount);
      }
    });
  }

  getAllEAHData() {
    // this.projectService.getAllProjects().subscribe((data) => {
    //   this.TotalUProjectCount = data.allProjectsCount;
    // });
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getAllEAHData').subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.eah1 = Result;
        this.eah1.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.TotalUProjectCount = this.eah1.length;
        // console.log("Total All EAH Count:", this.TotalUProjectCount);
      }
    });
  }

  getActivePCOIData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getActivePCOIData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.pcoi = Result;
        this.pcoi.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.PCOICount = this.pcoi.length;
        // console.log("Total Active PCOI Count:", this.PCOICount); // Display the count in the console
      }
    });
  }

  getAllPCOIData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getAllPCOIData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.pcoi1 = Result;
        this.pcoi1.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.TotalUPCOICount = this.pcoi1.length;
        // console.log("Total All PCOI Count:", this.TotalUPCOICount); // Display the count in the console
      }
    });
  }

  getActiveSCOIData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getActiveSCOIData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.scoi = Result;
        this.scoi.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.SCOICount = this.scoi.length;
        // console.log("Total Active SCOI Count:", this.SCOICount); // Display the count in the console
      }
    });
  }

  getAllSCOIData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getallSCOIData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.scoi1 = Result;
        this.scoi1.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.TotalUSCOICount = this.scoi1.length;
        // console.log("Total SCOI Count:", this.TotalUSCOICount); // Display the count in the console
      }
    });
  }

  getIrfData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/Getirfdata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.irf1 = Result;
        this.irf1.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf
        this.TotalUIRFCount = this.irf1.length;
        // console.log("Total IRF Count:", this.TotalUIRFCount); // Display the count in the console
      }
    });
  }

  getIrfRejectedData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/Getirfdata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.irf2 = Result;
        // Filter the data where RejectionReason is not equal to null
        this.irf2 = this.irf2.filter((item: any) => item.ApprovalStatus === "Rejected");

        this.irf2.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });

        // Counting the elements in this.irf after filtering
        this.TotalRejectIRFCount = this.irf2.length;
        // console.log("Total Rejected  IRF Count:", this.TotalRejectIRFCount); // Display the count in the console
      }
    });
  }

  getViolationData() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/Violationdata1').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Violationdata1 = Result;
        this.Violationdata1 = this.Violationdata1.filter((i: any) => i.NoApprovalVoil !== 'null');
        this.Violationdata1.map((i: any, indexof: any) => {
          i.SrNo = indexof + 1;
        });

        // Counting the elements in this.Violationdata
        this.ViolationCount = this.Violationdata1.length;
        // console.log("Total Violation Data Count:", this.ViolationCount); // Display the count in the console
      }
    });
  }

  showProjectData(projectType: string) {
    if (projectType === 'ActiveEAH') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayActiveEAHData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.activeProjectsData = Result;
        this.activeProjectsData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayActiveEAJData", this.activeProjectsData);
        this.showActiveProjectsTable = true;
        this.showAllProjectsTable = false;
        this.showActivePcoiData = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showTotalViolationData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showRequestDataTable = false;
        this.showQueryDataTable = false;
      });
    } else if (projectType === 'AllEAH') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayAllEAHData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allProjectsData = Result;
        this.allProjectsData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayAllEAJData", this.allProjectsData);
        this.showAllProjectsTable = true;
        this.showActiveProjectsTable = false;
        this.showActivePcoiData = false;
        this.showAllPcoiData = false;
        this.showQueryDataTable = false;
        this.showActiveScoiData = false;
        this.showTotalViolationData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showRequestDataTable = false;
      });
    } else if (projectType === 'PCOIActive') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayActivePCOIData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.activePCOIData = Result;
        this.activePCOIData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayActivePCOIData", this.activePCOIData);
        this.showActivePcoiData = true;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showTotalViolationData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showRequestDataTable = false;
      });
    } else if (projectType === 'PCOIAll') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayAllPCOIData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allPCOIData = Result;
        this.allPCOIData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayAllPCOIData", this.allPCOIData);
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showActivePcoiData = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = true;
        this.showActiveScoiData = false;
        this.showTotalViolationData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showRequestDataTable = false;
      });
    } else if (projectType === 'SCOIActive') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayActiveSCOIData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.activeSCOIData = Result;
        this.activeSCOIData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayActiveSCOIData", this.activeSCOIData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = true;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showTotalViolationData = false;
        this.showRequestDataTable = false;
      });
    } else if (projectType === 'SCOIAll') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/displayAllSCOIData').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allSCOIData = Result;
        this.allSCOIData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
        });
        // console.log("DisplayAllSCOIData", this.allSCOIData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showAllScoiData = true;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showTotalViolationData = false;
        this.showRequestDataTable = false;
      });
    } else if (projectType === 'ViolationReceive') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/Violationdata1').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.violationData = Result;
        // Filter the data to get only entries where the Status is "Clarification Provided"
        this.violationData = this.violationData.filter((i: any) => i.NoApprovalVoil !== 'null');
        this.violationData = this.violationData.filter((item: any) => item.Status === "Clarification Provided");
        // Add Srno to filtered data
        this.violationData.forEach((item: any, index: number) => {
          item.Srno = index + 1;
        });
        // console.log("DisplayReceiveViolationData", this.violationData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = true;
        this.showRequestDataTable = false;
        this.showTotalViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
      });
    } else if (projectType === 'TodayIRFActive') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/Getirfdata').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.todayIRFData = Result;
        this.todayIRFData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
          i.FormattedActiveRejectionReason = this.getFormattedReasons(i.RejectionReason);
        });
        // console.log("DisplaytodayIRFData", this.todayIRFData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = true;
        this.showViolationData = false;
        this.showRequestDataTable = false;
        this.showTotalViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
      });
    } else if (projectType === 'ViolationAwait') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/Violationdata1').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.violationAwaitData = Result;
        // Filter the data to get only entries where the Status is "Clarification Provided"
        this.violationAwaitData = this.violationAwaitData.filter((i: any) => i.NoApprovalVoil !== 'null');
        this.violationAwaitData = this.violationAwaitData.filter((item: any) => item.Status === "Clarification Not Provided");
        // Add Srno to filtered data
        this.violationAwaitData.forEach((item: any, index: number) => {
          item.Srno = index + 1;
        });
        // console.log("DisplayAwaitViolationData", this.violationAwaitData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showTotalViolationData = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showRequestDataTable = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = true;
        this.showTodayRejectIRFData = false;
      });
    } else if (projectType === 'TodayRejectIRF') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/Getirfdata').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.todayIRFRejectData = Result;
        // Filter the data where RejectionReason is not equal to null
        this.todayIRFRejectData = this.todayIRFRejectData.filter((item: any) => item.ApprovalStatus === "Rejected");

        this.todayIRFRejectData.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1;
          i.FormattedtodayRejectionReason = this.getFormattedReasons(i.RejectionReason);
        });
        // console.log("DisplaytodayRejectIRFData", this.todayIRFRejectData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showRequestDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = true;
        this.showTotalViolationData = false;
      });
    } else if (projectType === 'ViolationActive') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/Violationdata1').subscribe((data) => {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.totalviolationData = Result;
        this.totalviolationData = this.totalviolationData.filter((i: any) => i.NoApprovalVoil !== 'null');
        this.totalviolationData.forEach((item: any, index: number) => {
          item.Srno = index + 1;
        });
        // console.log("DisplayAllViolationData", this.totalviolationData);
        this.showActivePcoiData = false;
        this.showAllProjectsTable = false;
        this.showActiveProjectsTable = false;
        this.showQueryDataTable = false;
        this.showAllPcoiData = false;
        this.showActiveScoiData = false;
        this.showAllScoiData = false;
        this.showTodayIRFData = false;
        this.showRequestDataTable = false;
        this.showViolationData = false;
        this.showViolationWaitedData = false;
        this.showTodayRejectIRFData = false;
        this.showTotalViolationData = true;
      });
    }
  }

  closeFunction() {
    this.showActivePcoiData = false;
    this.showAllProjectsTable = false;
    this.showActiveProjectsTable = false;
    this.showAllPcoiData = false;
    this.showActiveScoiData = false;
    this.showAllScoiData = false;
    this.showTodayIRFData = false;
    this.showViolationData = false;
    this.showViolationWaitedData = false;
    this.showTodayRejectIRFData = false;
    this.showTotalViolationData = false;
    this.showRequestDataTable = false;
    this.showQueryDataTable = false;
    this.showviolationStatusData = false;
    this.showvioStatusGrid = false;
  }

  getallUPSIProjectList() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/GetAllProjectDetails').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.upsiprojects = Result;
        // console.log("getallUPSIProjectList", this.upsiprojects)
        this.upsiprojects.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1
        })
        // console.log("this.upsiprojects", this.upsiprojects)
      }
    });
  }

  getallExpiryMSTList() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/GetAllexpirymstDetails').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.expirydatedata = Result;
        // console.log("getallUPSIProjectList", this.upsiprojects)
        this.expirydatedata.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1
        })
        // console.log("this.expirydatedata", this.expirydatedata)
      }
    });
  }

  // deletebtn(project: any) {
  //   // debugger
  //   console.log("delete expiry project", project);

  //   var model: any =
  //   {
  //     ID: project.ID,
  //   }
  //   var apiUrl = '';
  //   apiUrl = 'expiraydate/DeleteroleById';
  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //     debugger;
  //     if (data.Success) {

  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
  //       // this.displayAddProject3 = false;
  //       this.getallExpiryMSTList();
  //     }
  //     else {
  //       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       // this.displayAddProject3 = false;
  //     }
  //   })
  // }

  getAllHolidayList() {
    this.rest.getAll(this.Global.getapiendpoint() + 'home/getHolidayData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.holidays = Result;
        // console.log("getallUPSIProjectList", this.upsiprojects)
        this.holidays.forEach((i: any, indexof: any) => {
          i.Srno = indexof + 1
        })
        // console.log("this.holidays", this.holidays)
      }
    });
  }

  onclickdesk() {
    this.showRequestDataTable = false;
    this.visible1 = true;
  }

  ResetHelpDesk() {
    this.helpdeskform.reset();
    this.showOtherInput = false;
  }

  getRequestData() {

    if (this.userLoggedIn.CODE !== "Super Admin") {
      this.rest.getAll(this.Global.getapiendpoint() + `home/userRequestData/${this.EmpNo}`).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.requestUser = Result;
          this.requestUser.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1;
          });

          // Counting the elements in this.irf
          this.TotalHelpRequest = this.requestUser.length;
          // console.log("Total Avtive EAH Count:", this.TotalHelpRequest);
        }
      });
    } else {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/complianceRequestData').subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.requestCompliance = Result;
          this.requestCompliance.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1;
          });

          // Counting the elements in this.irf
          this.TotalHelpRequest = this.requestCompliance.length;
          // console.log("Total Avtive EAH Count:", this.TotalHelpRequest);
        }
      });
    }
  }

  DeskquerySave() {
    let model = {
      // selectedVoilation: this.selectedVoilation.value,
      requestType: this.selectedRequestType.value,
      query: this.query?.value,
      other: this.otherRequestType?.value,
      userNO: this.EmpNo,
      userId: this.userId,
      name: this.empname,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("HelpDesk", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'home/savehelpdeskdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.helpdeskform.reset();
        this.ResetHelpDesk();
        this.visible1 = false;
        this.getRequestData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Query Submitted successfuly" });
      }
    });
  }

  onRequestTypeChange(event: any) {
    const selectedValue = event.value; // Get the selected value from the dropdown
    // Check if the selected value is 'Other', then show the additional input
    this.showOtherInput = (selectedValue === 'Other');
  }

  showRequestData(projectType: string) {
    if (projectType === 'HelpDesk') {
      if (this.userLoggedIn.CODE !== "Super Admin") {
        this.rest.getAll(this.Global.getapiendpoint() + `home/userRequestData/${this.EmpNo}`).subscribe((data) => {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.requestdetailsdata = Result;
          this.requestdetailsdata.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1;
          });
          // console.log("DisplayuserData", this.requestdetailsdata);
          this.showRequestDataTable = true;
        });
      } else {
        this.rest.getAll(this.Global.getapiendpoint() + 'home/complianceRequestData').subscribe((data) => {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.requestdetailsdata = Result;
          this.requestdetailsdata.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1;
          });
          // console.log("DisplaycomplianceData", this.requestdetailsdata);
          this.showRequestDataTable = true;
        });
      }
    }
  }

  oneditStatus(product: any) {
    // console.log("requestupdate", product);
    this.visible2 = true;
    this.showQueryDataTable = true;
    this.statusid = product.ID;
    this.getALLQueryData(this.statusid);
  }

  oneditStatusComp(product: any){
    this.visible3 = true;
    this.showQueryDataTable = true;
    this.statusid = product.ID;
    this.getALLQueryData(this.statusid);

  }

  DeskUpdateStatusSave() {
    let model = {
      status: this.selectedstatus.value,
      query1: this.Updatequery?.value,
      empid: this.EmpNo,
      id: this.statusid,
      name: this.empname,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("HelpDesk", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'home/updatehelpdeskdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.helpdeskUpdateform.reset();
        this.ResetUpdateStatus();
        this.getALLQueryData(this.statusid);
        // this.visible2 = false;
        // this.showQueryDataTable = false;
        this.showRequestData('HelpDesk');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Query Submitted successfuly" });
      }
    });
  }

  getALLQueryData(queryid: any) {
    this.rest.getAll(this.Global.getapiendpoint() + `home/getQueryDataBYID/${queryid}`).subscribe((data) => {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
      this.querysallData = Result;
      this.querysallData.forEach((i: any, indexof: any) => {
        i.Srno = indexof + 1;
      });
      // console.log("DisplayqueryData", this.querysallData);
      // this.showRequestDataTable = true;
    });
  }

  ResetUpdateStatus() {
    this.helpdeskUpdateform.reset();
  }

ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  // Load user data from token
  private loadUserData() {
    try {
      const token = sessionStorage.getItem('jwt_token');
      if (!token) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Auth Error', 
          detail: 'User token not found.' 
        });
        return;
      }

      const decodedData: any = this.Global.decrypt(token);
      const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
      this.userData = userLoggedInString ? JSON.parse(userLoggedInString) : null;
      console.log("User data from token:", this.userData);
    } catch (error) {
      console.error("Error decoding token:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Auth Error',
        detail: 'Could not decode user token.'
      });
    }
  }

  // Check user access based on role
  private checkUserAccess() {
    if (!this.userData) {
      this.hasAccess = false;
      this.isCheckingAccess = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: this.accessDeniedMessage
      });
      return;
    }

    // Get user's role code from token
    const userRoleCode = this.userData?.CODE || this.userData?.ROLECODE || this.userData?.DESIGNATED;
    console.log("User role code from token:", userRoleCode);

    if (!userRoleCode) {
      console.warn("No role code found in user data, loading roles from API to check access");
      this.loadRolesAndCheckAccess();
      return;
    }

    // Check if user role is Admin or Super Admin
    this.validateUserRole(userRoleCode);
  }

  // Load roles from API and check access
  private loadRolesAndCheckAccess() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/getallroles')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          try {
            if (response && response.Success) {
              const decryptedData = this.Global.decrypt1(response.Data);
              this.rolesData = JSON.parse(decryptedData);
              console.log("Roles data from API:", this.rolesData);

              // Try to match user with roles to determine access
              this.checkAccessWithRolesData();
            } else {
              console.error("Failed to load roles data:", response);
              this.denyAccess('Failed to validate user permissions.');
            }
          } catch (error) {
            console.error("Error processing roles data:", error);
            this.denyAccess('Error validating user permissions.');
          }
        },
        error: (error: any) => {
          console.error("Error loading roles:", error);
          this.denyAccess('Unable to validate user permissions.');
        }
      });
  }

  // Check access using roles data from API
  private checkAccessWithRolesData() {
    if (!this.rolesData || this.rolesData.length === 0) {
      this.denyAccess('No roles data available for validation.');
      return;
    }

    // Look for Admin and Super Admin roles
    const adminRole = this.rolesData.find(role => 
      role.NAME && role.NAME.toLowerCase().includes('admin') && 
      !role.NAME.toLowerCase().includes('super')
    );
    const superAdminRole = this.rolesData.find(role => 
      role.NAME && role.NAME.toLowerCase().includes('super') && 
      role.NAME.toLowerCase().includes('admin')
    );

    console.log("Found Admin role:", adminRole);
    console.log("Found Super Admin role:", superAdminRole);

    // Get user role code or ID
    const userRoleCode = this.userData?.CODE || this.userData?.ROLECODE || this.userData?.DESIGNATED;
    const userRoleId = this.userData?.ROLEID || this.userData?.ID;

    let hasValidRole = false;

    // Check by role code
    if (userRoleCode) {
      if (adminRole && (adminRole.CODE === userRoleCode || adminRole.NAME === userRoleCode)) {
        hasValidRole = true;
      }
      if (superAdminRole && (superAdminRole.CODE === userRoleCode || superAdminRole.NAME === userRoleCode)) {
        hasValidRole = true;
      }
    }

    // Check by role ID if no match by code
    if (!hasValidRole && userRoleId) {
      if (adminRole && adminRole.ID === userRoleId) {
        hasValidRole = true;
      }
      if (superAdminRole && superAdminRole.ID === userRoleId) {
        hasValidRole = true;
      }
    }

    // Check by role name patterns for common admin designations
    if (!hasValidRole) {
      const userDesignation = (this.userData?.DESIGNATED || this.userData?.CODE || '').toLowerCase();
      if (userDesignation.includes('admin') || userDesignation.includes('super')) {
        hasValidRole = true;
        console.log("Access granted based on designation pattern:", userDesignation);
      }
    }

    if (hasValidRole) {
      this.grantAccess();
    } else {
      this.denyAccess(`User role '${userRoleCode || userRoleId}' does not have access to this component.`);
    }
  }

  // Validate user role directly
  private validateUserRole(roleCode: string) {
    const normalizedRole = roleCode.toLowerCase();
    
    // Check for admin patterns
    if (normalizedRole.includes('admin') || normalizedRole.includes('super')) {
      console.log("Access granted for role:", roleCode);
      this.grantAccess();
    } else {
      this.denyAccess(`Role '${roleCode}' does not have access to this component.`);
    }
  }

  // Grant access and load data
  private grantAccess() {
    this.hasAccess = true;
    this.isCheckingAccess = false;
    console.log("Access granted - loading approval data");
    this.loadApprovalData();
  }

  // Deny access
  private denyAccess(message: string) {
    this.hasAccess = false;
    this.isCheckingAccess = false;
    this.accessDeniedMessage = message;
    console.warn("Access denied:", message);
    this.messageService.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: message
    });
  }

  // Load approval data
  loadApprovalData() {
    this.approvalDataLoading = true;
    const apiEndpoint = `${this.Global.getapiendpoint()}upload/getDPAllocationApprovalData`;
    console.log("Loading approval data from API:", apiEndpoint);

    this.rest.getAll(apiEndpoint)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.approvalDataLoading = false;
          console.log("Approval data load API request completed");
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log("Approval data API response received:", response);
          this.processApprovalDataResponse(response);
        },
        error: (error: any) => {
          console.error("Approval data load API error:", error);
          this.messageService.add({
            severity: 'error',
            summary: 'Data Load Error',
            detail: 'Could not load approval data from server.'
          });
        }
      });
  }

  // Process approval data response
  private processApprovalDataResponse(response: any) {
    try {
      console.log("Processing approval data response:", response);

      if (response && response.Success === true && response.Data) {
        console.log("Decrypting approval data using Global.decrypt1...");

        const decryptedData = this.Global.decrypt1(response.Data);
        console.log("Decrypted approval data string:", decryptedData);

        const parsedData = JSON.parse(decryptedData);
        console.log("Parsed approval data:", parsedData);        if (Array.isArray(parsedData)) {
          // Filter out records that are already approved (IS_ACCEPTED = true)
          const filteredData = parsedData.filter(item => {
            // Keep records that are not approved (IS_ACCEPTED is false, null, or undefined)
            return item.IS_ACCEPTED !== true;
          });
          
          this.approvalData = filteredData.map(item => new DarkPoolApprovalModel(item));
          
          console.log("Raw data count:", parsedData.length);
          console.log("Filtered data count (excluding approved):", filteredData.length);
          console.log("Filtered out approved records:", parsedData.length - filteredData.length);
          
          // Log the approved records that were filtered out for debugging
          const approvedRecords = parsedData.filter(item => item.IS_ACCEPTED === true);
          if (approvedRecords.length > 0) {
            console.log("Approved records filtered out:", approvedRecords.map(r => `${r.EMPID} - ${r.REQUEST_TYPE}`));
          }
        } else {
          this.approvalData = [];
        }


      } else if (response && response.Success === false) {
        console.warn("Approval data API returned error:", response);
        this.approvalData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'API Error',
          detail: response.Message || 'Failed to retrieve approval data from server.'
        });
      } else {
        console.warn("Unexpected approval data response format:", response);
        this.approvalData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Unexpected Response',
          detail: 'Received unexpected response format from server.'
        });
      }

    } catch (error) {
      console.error('Error processing approval data response:', error);
      this.approvalData = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Processing Error',
        detail: 'Failed to process approval data from server.'
      });
    }
  }

  // Approve record
  approveRecord(record: DarkPoolApprovalModel) {
    this.confirmDialogAction = 'approve';
    this.confirmDialogTitle = 'Approve Confirmation';
    this.confirmDialogMessage = `Are you sure you want to approve the ${record.REQUEST_TYPE || 'request'} for ${record.getDisplayName()}?`;
    this.confirmDialogConfirmLabel = 'Yes, Approve';
    this.currentRecord = record;
    this.showConfirmDialog = true;
  }

  // Reject record
  rejectRecord(record: DarkPoolApprovalModel) {
    this.confirmDialogAction = 'reject';
    this.confirmDialogTitle = 'Reject Confirmation';
    this.confirmDialogMessage = `Are you sure you want to reject the ${record.REQUEST_TYPE || 'request'} for ${record.getDisplayName()}?`;
    this.confirmDialogConfirmLabel = 'Yes, Reject';
    this.currentRecord = record;
    this.showConfirmDialog = true;
  }

  // Approve request button click
  approveRequest(record: DarkPoolApprovalModel) {
    this.currentRecord = record;
    this.confirmDialogAction = 'approve';
    this.confirmDialogTitle = 'Approve Request';
    this.confirmDialogMessage = `Are you sure you want to approve the ${record.REQUEST_TYPE || 'unknown'} request from ${record.FIRSTNAME || 'unknown employee'}?`;
    this.confirmDialogConfirmLabel = 'Approve';
    this.showConfirmDialog = true;
  }

  // Reject request button click
  rejectRequest(record: DarkPoolApprovalModel) {
    this.currentRecord = record;
    this.confirmDialogAction = 'reject';
    this.confirmDialogTitle = 'Reject Request';
    this.confirmDialogMessage = `Are you sure you want to reject the ${record.REQUEST_TYPE || 'unknown'} request from ${record.FIRSTNAME || 'unknown employee'}?`;
    this.confirmDialogConfirmLabel = 'Reject';
    this.showConfirmDialog = true;
  }
  // Perform approval/rejection action
  confirmDialogAccept() {
    if (!this.currentRecord) return;

    this.isProcessing = true;
    this.processingRecordId = this.currentRecord.EMPID; // Use EMPID for tracking

    try {
      const model = {
        ID: this.currentRecord.ID,
        EMPID: this.currentRecord.EMPID,
        FIRSTNAME: this.currentRecord.FIRSTNAME,
        REQUEST_TYPE: this.currentRecord.REQUEST_TYPE,
        IS_ACCEPTED: this.confirmDialogAction === 'approve',
        STATUS: this.confirmDialogAction === 'approve' ? 'APPROVED' : 'REJECTED', // Add explicit status
        MODIFIED_BY: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        MODIFIED_DT: new Date().toISOString()
      };

      console.log(`${this.confirmDialogAction === 'approve' ? 'Approving' : 'Rejecting'} record:`, model);

      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));
      const apiUrl = 'upload/updateDPAllocationApprovalData';

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isProcessing = false;
            this.processingRecordId = null;
            this.showConfirmDialog = false;
            this.currentRecord = null;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Request ${this.confirmDialogAction === 'approve' ? 'approved' : 'rejected'} successfully`
              });

              // Reload data to reflect changes
              this.loadApprovalData();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || `Failed to ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} request`
              });
            }
          },
          error: (error: any) => {
            console.error(`${this.confirmDialogAction === 'approve' ? 'Approve' : 'Reject'} API error:`, error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, `Failed to ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} request`)
            });
          }
        });

    } catch (error) {
      this.isProcessing = false;
      this.processingRecordId = null;
      console.error(`Error in ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} action:`, error);
      this.messageService.add({
        severity: 'error',
        summary: 'Action Error',
        detail: `An unexpected error occurred while ${this.confirmDialogAction === 'approve' ? 'approving' : 'rejecting'} the request`
      });
    }
  }
  // Confirm action from dialog
  confirmAction() {
    if (!this.currentRecord) {
      this.cancelAction();
      return;
    }

    this.confirmDialogAccept();
  }

  // Cancel action from dialog
  cancelAction() {
    this.showConfirmDialog = false;
    this.currentRecord = null;
  }

  // Extract error message helper
  extractErrorMessage(error: any, defaultMessage: string): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    if (error && typeof error.message === 'string') {
      return error.message;
    }
    return defaultMessage;
  }
  // Check if record can be acted upon
  canTakeAction(record: DarkPoolApprovalModel): boolean {
    // Allow action on pending records (not yet approved/rejected, active, and not deleted)
    // IS_ACCEPTED can be true (approved), false (rejected), or null/undefined (pending)
    return record.isActive() && 
           !record.isDeleted() && 
           (record.IS_ACCEPTED === null || record.IS_ACCEPTED === undefined);
  }

  // Get status badge class
  getStatusBadgeClass(record: DarkPoolApprovalModel): string {
    if (!record.isActive()) {
      return 'badge bg-secondary';
    }
    if (record.isAccepted()) {
      return 'badge bg-success';
    }
    if (record.isMailSentForApproval()) {
      return 'badge bg-warning';
    }
    return 'badge bg-info';
  }

  // Get request type badge class
  getRequestTypeBadgeClass(requestType: string): string {
    if (!requestType) return 'badge bg-secondary';
    
    switch (requestType.toLowerCase()) {
      case 'finalize':
        return 'badge bg-primary';
      case 'reset':
        return 'badge bg-warning';
      default:
        return 'badge bg-info';
    }
  }
}


