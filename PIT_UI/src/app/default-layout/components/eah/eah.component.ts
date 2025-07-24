import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { Message, PrimeNGConfig } from 'primeng/api';
import { Moment } from 'moment';
import * as _Moment from 'moment';
import { Product } from 'src/app/common/product';
import { CheckboxModule } from 'primeng/checkbox';
import { EMPTY, Observable, forkJoin, from, of, switchMap, throwError } from 'rxjs';
import { catchError, concatMap, toArray } from 'rxjs/operators';
import { ValidFileExtensions } from 'src/app/common/constant';


@Component({
  selector: 'app-eah',
  templateUrl: './eah.component.html',
  styleUrls: ['./eah.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class EAHComponent implements OnInit {
  activeIndex1: number = 0;
  selectedValue: string;
  dependentAcDetails: boolean = false;
  additionalStake: boolean = false;
  materialdetails: boolean = false;
  products: Product[];
  product: Product;
  pastEmployees: Product[];
  pastEmp: Product;
  contacts: Product[];
  contact: Product;
  dependents: Product[];
  dependent: Product;
  DeptOthers: Product[];
  DeptOther: Product;
  DeptDPs: Product[];
  DeptDP: Product;
  SelfOthers: Product[];
  SelfOther: Product;
  SelfDPs: Product[];
  SelfDP: Product;
  StackOthers: Product[];
  StackOther: Product;
  StackDPs: Product[];
  StackDP: Product;
  Concerns: Product[];
  Concern: Product;
  allDPs: Product[];
  allDP: Product;
  FinRels: Product[];
  FinRel: Product;
  cities: any;
  selectedValueSingle: boolean = false;
  selectedValueMarried: boolean = false;
  spouseName: string = '';
  EmployeeId: any;
  LoggedInUser1: any;
  IsTrackedEmp: any;
  EmailType: any;
  singleStatus: boolean = null;
  eachtabcount: number
  Institution: any;
  Qualification: any;
  Sub_Qualification: any;
  Past_Emp: any;
  Contact_no: any;
  contNgmodel: any;
  contid: any;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  oneditbtn1: boolean = false;
  onadd1: boolean = true;
  oneditbtn2: boolean = false;
  onadd2: boolean = true;
  oneditbtn4: boolean = false;
  onadd4: boolean = true;
  oneditbtn5: boolean = false;
  onadd5: boolean = true;
  oneditbtn6: boolean = false;
  onadd6: boolean = true;
  eduid: any;
  empid: any;
  contactid: any;
  pastempid: any;
  selectedYes: boolean = false;
  selectedNo: boolean = false;
  EBL: any;
  ESL: any;
  selfbrName: any;
  selftrdCode: any;
  selectedSelfDPYes: boolean = false;
  selectedSelfDPNo: boolean = true;
  rdoSelfDPEBL: boolean = false;
  rdoSelfDPESL: boolean = false;
  rdoSelfDPOther: boolean = false;
  otherngModel: any;
  showOtherTextbox1: boolean = false;
  selfDPtradeNo: any;
  DPType1: any;
  DPBroker1: any;
  rdbNotApplicable: boolean = false;
  rdbNotApllied: boolean = false;
  rdbPan: boolean = true;
  name: any;
  rltNgmodel: any;
  DeptEBL: any;
  DeptESL: any;
  deptbName: any;
  depttrdCode: any;
  rdoDeptDPEBL: boolean = false;
  rdoDeptDPESL: boolean = false;
  rdoDeptDPOther: boolean = false;
  showOtherTextbox: boolean = false;
  Othermodel: any;
  DPType: any;
  DPBroker: any;
  deptDPAccNo: any;
  PanNo: any;
  relid: any;
  isPanDisable: boolean = false;
  DeptPan: any;
  concernName: any;
  concernid: any;
  conrNgmodel: any;
  stackNotApplicable: boolean = false;
  stackNotApplied: boolean = false;
  stackPanNgmodel: boolean = true;
  SatckPanNo: any;
  isSatckPanDisable: boolean = false;
  SatckEBL: any;
  SatckESL: any;
  SatckBRName: any;
  SatckTradeCode: any;
  rdoSatckDPEBL: boolean = false;
  rdoSatckDPESL: boolean = false;
  rdoSatckDPOther: boolean = false;
  showOtherTextbox2: boolean = false;
  stOtNgmodel: any;
  StackDPType: any;
  StackDPBroker: any;
  stackDpAcc: any;
  StackPan: any;
  uid: any;
  employeeData: any = {};
  employeeData1: any = {};
  employeeData2: any = {};
  employeeData3: any = {};

  stepid: any;
  step1id: any;
  edumstid: any;
  pastempmstid: any;
  contmstid: any;
  selfOthermstid: any;
  SelfDematmstid: any;
  selfid: any;
  deptothermstid: any;
  deptDematmstid: any;
  deptDetailtid: any;
  dempid: any;
  stackothermstid: any;
  StackDematmstid: any;
  ConcernDetailtid: any;
  minorNgModel: boolean = false;
  phoneNgModel: any;
  mobileNgModel: any;
  RelTypeOther: any;
  showOtherInput: boolean = false;
  showOtherConcernInput: boolean = false;
  ConcernTypeOther: any;
  alldid: any;
  demmodel: any;
  demaid: any;
  showPreview: boolean = false;
  uploadedFile: File | null = null;
  dataList: any[] = [];
  showFileName = false;
  isAuthorized: boolean = false;
  PSHolds: any[] = [];
  isFinalSubmitValid: boolean = false;
  showAlert: boolean = false;
  alertRowData: any;

  entity1id: any;
  ent1Ngmodel: any;
  EntOthers: Product[];
  EntOther: Product;
  selfBaseEntid: any;
  showEntDropdown: boolean = false;
  allentid: any;
  allentNgmodel: any;

  DeptEntOthers: Product[];
  DeptEntOther: Product;
  DeptBaseEntid: any;
  showEntDropdown1: boolean = false;
  showEntDropdown2: boolean = false;

  StackEntOthers: Product[];
  StackEntOther: Product;
  StackBaseEntid: any;

  FinName: any;
  panNgModel: any;
  phoneModel: any;
  mobileModel: any;
  finrelid: any;
  finrelempid: any;

  Commodities: Product[];
  Commoditie: Product;
  clientid: any;
  clientmodel: any;
  ecommodel: boolean = false;
  comtrademodel: boolean = false;
  otmodel: boolean = false;
  otextngmodel: any;
  isSDisable: boolean = false;
  commidmodel: any;
  CommName: any;
  showEntDropdown5: boolean = false;
  showAuthBtn: boolean = true;
  showProvideBtn: boolean = false;
  showAlert1: boolean = false;
  commid: any;



  eduData: any[];
  pastEmpData: any[];
  contactData: any[];
  entityData: any[];
  selfOtherData: any[];
  selfDematData: any[];
  DeptDetailsData: any[];
  JDConcernData: any[];
  physicalShareHoldingData: any[];
  JDAllDematData: any[];

  entityNames: string[] = [];
  showremsg: boolean = false;
  showAlert2: boolean = false;
  showdebtn: boolean = false;
  showAlert3: boolean = false;
  stepid2: any;
  reopenid: any;
  reOpenID: any;
  reopenid1: any;
  isdis: boolean = false;
  showAlert4: boolean = false;
  showAlert5: boolean = false;
  showNameList = false;
  secGrids: Product[];
  secGrid: Product;
  displayClientNames: boolean = true;
  namesArray: any[] = [];
  selectedValuesYes: boolean[] = new Array(this.namesArray.length).fill(false);
  selectedValuesNo: boolean[] = new Array(this.namesArray.length).fill(false);
  comother: any;

  relationSelected: boolean = false;
  concernSelected: boolean = false;
  formData = new FormData();
  fileArray: any[] = [];
  dataSourceRefferalsUploadFile = [];

  rdoSelfBroker: boolean = false;
  rdoSelfBrokerOther: boolean = false;
  showEntDropdown3: boolean = false;
  showOtherTextbox3: boolean = false;
  rdoDPBroker: boolean = false;
  rdoDPBrokerOther: boolean = false;
  showEntDropdown4: boolean = false;
  showOtherTextbox4: boolean = false;
  rdoSTKBroker: boolean = false;
  rdoSTKBrokerOther: boolean = false;
  showEntDropdown6: boolean = false;
  showOtherTextbox5: boolean = false;
  activemodel: boolean = false;
  propertyid: any;
  protypeNgmodel: any;
  phonedisable: boolean = false;
  mobiledisable: boolean = false;
  spousenamedisable: boolean = false;
  items = [
    {
      label: 'Basic Info',
      // command: (event: any) => ();
    },
    {
      label: 'Account Info',
    },
    {
      label: 'Dependent Account',
    },
    {
      label: 'Material Fin Rel',
    },
    {
      label: '10% Stake Holding',
    },
    {
      label: 'Security Holding',
    },
    {
      label: 'Commodities',
    },
    {
      label: 'Submit',
    }
  ];
  dataSaved: boolean = false;
  dataSaved1: boolean = false;
  dataSaved2: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,

  ) {
  }

  ngOnInit() {
    this.oneditbtn = false;
    this.oneditbtn1 = false;
    this.oneditbtn2 = false;
    this.oneditbtn4 = false;
    this.oneditbtn5 = false;
    this.oneditbtn6 = false;
    // this.LoggedInUser1 = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // this.EmployeeId = this.LoggedInUser1.ID;
    this.EmployeeId = this.LoggedInUser1.EMPNO;
    this.getallbusiness()
    this.getallUSTMST(this.EmployeeId);
    this.getJDSelf(this.EmployeeId);
    this.getEAHSpouse(this.EmployeeId);
    // this.getallJDEdu(this.EmployeeId);
    this.getallEdu(this.EmployeeId);
    // this.getJDPastEmp(this.EmployeeId);
    this.getPastEmp(this.EmployeeId);
    this.getalltypeCont();
    // this.getJDContact(this.EmployeeId);
    this.getContact(this.EmployeeId);
    this.getallBaseEntity();
    this.getallEntity();
    this.getJDBEntity(this.EmployeeId);
    // this.getBEntity(this.EmployeeId);
    this.getAllJDData(this.EmployeeId);
    this.getAllData(this.EmployeeId);
    this.getJDSelfOther(this.EmployeeId);
    // this.getSelfOther(this.EmployeeId);
    this.getJDSelfDemat(this.EmployeeId);
    this.getSelfDemat(this.EmployeeId);
    this.getalltypeRelation();
    // this.getDependentOther(this.EmployeeId);
    // this.getDependentDemat(this.EmployeeId);
    // this.getDeptBaseEntity(this.EmployeeId);
    // this.getJDDeptDetails(this.EmployeeId);
    this.getDeptDetails(this.EmployeeId);
    this.getallPropertyType();
    this.getMaterialFinRel(this.EmployeeId);
    this.getalltypeConcern();
    this.getDematDropdown(this.EmployeeId);
    // this.getStackBaseEntity(this.EmployeeId);
    // this.getStackOther(this.EmployeeId);
    // this.getStackDemat(this.EmployeeId);
    // this.getJDConcernDetails(this.EmployeeId);
    this.getConcernDetails(this.EmployeeId);
    this.getJDAllDemat(this.EmployeeId);
    this.getJDPhysicalShareDetails(this.EmployeeId);
    this.getAllDemat(this.EmployeeId);
    this.getPhysicalShareDetails(this.EmployeeId);
    this.getClientDropdown(this.EmployeeId);
    this.getCommDetails(this.EmployeeId);
    this.getCommAnotherDetails(this.EmployeeId);
    this.getReOpenId(this.EmployeeId);
    this.getstepid(this.EmployeeId);

  }

  getallUSTMST(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetUser/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.employeeData = Result[0];
        this.uid = Result;
        // console.log("getallUSTMST", this.employeeData);
        // console.log("getallUSTMST", this.uid);
      }
    });
  }

  getstepid(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/getIDStep/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.employeeData3 = Result[0];
        this.step1id = Result;
        // console.log("getStep", this.step1id);
        this.navigateNext();
      }
    });
  }

  navigateNext() {
    const stid = this.employeeData3.STEP_ID;
    const submit = this.employeeData3.SUBMITTED;

    if (stid === "0") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.activeIndex1 = 1;
    } else if (stid === "1") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.activeIndex1 = 2;
    } else if (stid === "2") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getDematDropdown(this.EmployeeId);
      this.getallPropertyType();
      this.activeIndex1 = 3;
    } else if (stid === "3") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getallPropertyType();
      this.getDematDropdown(this.EmployeeId);
      this.getMaterialFinRel(this.EmployeeId);
      this.activeIndex1 = 4;
    } else if (stid === "4") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getDematDropdown(this.EmployeeId);
      this.getallPropertyType();
      this.getMaterialFinRel(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);

      this.activeIndex1 = 5;
    } else if (stid === "5") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getDematDropdown(this.EmployeeId);
      this.getallPropertyType();
      this.getMaterialFinRel(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);
      this.getClientDropdown(this.EmployeeId);
      this.getCommDetails(this.EmployeeId);
      this.getCommAnotherDetails(this.EmployeeId);

      this.activeIndex1 = 6;
    } else if (stid === "6") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getDematDropdown(this.EmployeeId);
      this.getallPropertyType();
      this.getMaterialFinRel(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);
      this.getClientDropdown(this.EmployeeId);
      this.getCommDetails(this.EmployeeId);
      this.getCommAnotherDetails(this.EmployeeId);

      this.activeIndex1 = 7;
      this.showPreview = true;
      this.isFinalSubmitValid = true;
    } else if (stid === "7") {
      this.getEAHSpouse(this.EmployeeId);
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      // this.getBEntity(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.getDematDropdown(this.EmployeeId);
      this.getallPropertyType();
      this.getMaterialFinRel(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);
      this.getClientDropdown(this.EmployeeId);
      this.getCommDetails(this.EmployeeId);
      this.getCommAnotherDetails(this.EmployeeId);

      this.activeIndex1 = 7;
      this.showPreview = true;
      this.isFinalSubmitValid = false;
      this.showremsg = true;
      // this.showdebtn = true;
      this.isdis = true;

    }

  }

  async getReOpenId(EmployeeId: any) {
    try {
      const apiUrl = `eah/getReOpenid/${EmployeeId}`;
      const data = await this.rest.getAll(this.Global.getapiendpoint() + apiUrl).toPromise();
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.reopenid = Result;
        this.reopenid1 = Result ? Result[0].RE_OPEN_ID : null;
        // this.reOpenID = data.Data.RE_OPEN_ID;
        // console.log("reoprnid", this.reopenid);

      } else {
        this.reopenid = null;
      }
    }
    catch (error) {
      console.error("Error fetching employee data:", error);
    }

  }

  ////////////////////////////////////////////self setails////////////////////////////////////////////////////////////////////////////
  linkshow() {
    this.showAlert4 = true;
  }

  onOKClick() {
    this.showAlert4 = false;
  }

  getJDSelf(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/getStep/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.employeeData1 = Result[0];
        this.stepid = Result;
        // console.log("getJDSelf", this.stepid);
        const s_status = this.employeeData1.SINGLE_STATUS;
        this.spouseName = this.employeeData1.SPOUSENAME;
        if (s_status) {
          this.selectedValueSingle = true;
          this.selectedValueMarried = false;
        } else {
          this.selectedValueSingle = false;
          this.selectedValueMarried = true;
        }
      }
    });
  }

  getallJDEdu(EmployeeId: any) {
    debugger
    var apiUrl = '';
    apiUrl = `joindesc/GetAllEdu/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        this.eduData = Result;
        this.edumstid = Result;
        this.saveEduData(this.eduData)
        this.getallEdu(EmployeeId)

        // console.log("getallJDEdu", this.products);
        // console.log("getallJDEdu", this.eduData);
        // console.log("getallJDEdu", this.edumstid);
      }
    });
  }

  getJDPastEmp(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetPastEmp/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.pastEmployees = Result;
        this.pastEmpData = Result;
        this.pastempmstid = Result;
        this.savePastEmpData(this.pastEmpData);
        this.getPastEmp(EmployeeId)
        // console.log("getJDPastEmp", this.pastEmployees);
        // console.log("getJDPastEmp", this.pastempmstid);
      }
    });
  }

  getJDContact(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetContact/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.contacts = Result;
        this.contactData = Result;
        this.contmstid = Result;
        this.saveContactData(this.contactData)
        this.getContact(EmployeeId);
        // console.log("getJDContact", this.contacts);
        // console.log("getJDContact", this.contmstid);
      }
    });
  }

  async getEAHSpouse(EmployeeId: any) {
    try {
      const apiUrl = `eah/getSpouse/${EmployeeId}`;
      const data = await this.rest.getAll(this.Global.getapiendpoint() + apiUrl).toPromise();
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.stepid2 = Result;
        if (Result.length > 0) {
          this.employeeData2 = Result[0];
          // console.log("getEAHSpouse", this.stepid2);
          const s_status = this.employeeData2.SINGLE_STATUS;
          this.spouseName = this.employeeData2.SPOUSENAME;
          if (s_status) {
            this.selectedValueSingle = true;
            this.selectedValueMarried = false;
          } else {
            this.selectedValueSingle = false;
            this.selectedValueMarried = true;
          }
        } else {
          this.getJDSelf(EmployeeId);
        }
      }
    }
    catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }

  //radiobutton for single
  handleChangeSingle() {
    if (this.selectedValueSingle) {
      this.selectedValueMarried = false;
      this.spouseName = '';
      this.singleStatus = true;
      this.spousenamedisable = true;
    }
  }

  //radio button for married
  handleChangeMarried() {
    if (this.selectedValueMarried) {
      this.selectedValueSingle = false;
      this.singleStatus = false;
      this.spousenamedisable = false;
    }
  }

  //next click event for self details  EMPLOYEE_ID

  async handleNext1Click() {
    // debugger;
    if (this.activeIndex1 === 0) {
      const id = this.stepid.find(data => data.EMPLOYEE_ID === this.EmployeeId);
      await this.getEAHSpouse(this.EmployeeId);
      // const id1 = this.stepid2.find(data => data.EMPLOYEE_ID === this.EmployeeId)
      // console.log(id1);

      var model: any = {
        employeeid: this.EmployeeId,
        Single_status: id.SINGLE_STATUS,
        spouseName: this.employeeData1.SPOUSENAME,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      var apiUrl = '';
      apiUrl = 'eah/SaveSpouseDetails';

      var apiUrl1 = '';
      apiUrl1 = 'eah/UpdateSpouseDetails';

      if (this.stepid2.length > 0) {
        this.rest.create(this.Global.getapiendpoint() + apiUrl1, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            if (this.employeeData.DSIGNATED === true) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.activeIndex1 = 1;
              this.getEAHSpouse(this.EmployeeId);
              this.getallEdu(this.EmployeeId);
              this.getPastEmp(this.EmployeeId);
              this.getContact(this.EmployeeId);
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.activeIndex1 = 2;
              this.getEAHSpouse(this.EmployeeId);
              this.getallEdu(this.EmployeeId);
              this.getPastEmp(this.EmployeeId);
              this.getContact(this.EmployeeId);
              // this.getBEntity(this.EmployeeId);
              // this.getSelfOther(this.EmployeeId);
              this.getAllData(this.EmployeeId);
              this.getSelfDemat(this.EmployeeId);
              this.getallbusiness();

            }
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })

      }
      else {
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            const eduData = this.eduData;
            const pastEmpData = this.pastEmpData;
            const contactData = this.contactData;
            this.saveEduData(eduData);
            this.savePastEmpData(pastEmpData);
            this.saveContactData(contactData);
            const JDConcernData = this.JDConcernData;
            this.saveJDConcernDataData(JDConcernData);
            if (this.employeeData.DSIGNATED === true) {
              // console.log("data", data);
              this.activeIndex1 = 1;
              this.getEAHSpouse(this.EmployeeId);
              this.getallEdu(this.EmployeeId);
              this.getPastEmp(this.EmployeeId);
              this.getContact(this.EmployeeId);
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.activeIndex1 = 2;
              this.getEAHSpouse(this.EmployeeId);
              this.getallEdu(this.EmployeeId);
              this.getPastEmp(this.EmployeeId);
              this.getContact(this.EmployeeId);
              const entityData = this.entityData;
              const selfOtherData = this.selfOtherData;
              const selfDematData = this.selfDematData;
              this.saveEntityData(entityData);
              this.saveSelfOtherData(selfOtherData);
              this.saveSelfDematData(selfDematData);
              const JDConcernData = this.JDConcernData;
              this.saveJDConcernDataData(JDConcernData);
              // this.getBEntity(this.EmployeeId);
              // this.getSelfOther(this.EmployeeId);
              this.getAllData(this.EmployeeId);
              this.getSelfDemat(this.EmployeeId);
              this.getallbusiness();
            }
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    }

  }

  //   saveEduData(eduData: any[]) {


  //     const observables = eduData.map((eduItem: any) => {
  //       const checkDuplicateModel: any = {
  //         employeeId: this.EmployeeId,
  //         qualification: eduItem.QUALIFICATION,
  //       };
  //       let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));                                            

  //       // const checkDuplicateApiUrl = 'eah/checkduplicate';
  //  console.log('gfhghghghghg3');
  //       // Create an observable for the duplicate check
  //       const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + { encryptmodel: encryptmodel } , checkDuplicateModel);

  //       return duplicateCheck$.pipe(
  //         switchMap((duplicateData: any) => {
  //           if (duplicateData.isDuplicate) {
  //                 console.log('gfhghghghghg1');
  //             // If it's a duplicate, skip saving this row
  //             return EMPTY;
  //           } else {
  //                 console.log('gfhghghghghg2');
  //             // If not a duplicate, proceed to save the education record
  //             const model: any = {
  //               empid: this.EmployeeId,
  //               inst: eduItem.INSTITUTION,
  //               qualification: eduItem.QUALIFICATION,
  //               subQualification: eduItem.SUB_QUALIFICATION,
  //             };
  //             let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                            

  //             // Create an observable for saving the record
  //             const apiUrl = 'eah/SaveEduDetails';
  //             const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } );

  //             return saveRecord$;
  //           }
  //         })
  //       );
  //     });

  //     // Use forkJoin to run all observables in parallel
  //     forkJoin(observables).subscribe(
  //       (responses: any[]) => {
  //         // Handle success
  //         // console.log("Responses", responses);

  //         // Assuming you want to show a success message when all records are saved successfully
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
  //       },
  //       (error: any) => {
  //         // Handle errors
  //         console.error("Error", error);

  //         // Display an error message for duplicate records
  //         if (typeof error === 'string') {
  //           alert(error);
  //         } else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
  //         }
  //       }
  //     );
  //   }


  saveEduData(eduData: any[]) {
    from(eduData).pipe(
      concatMap((eduItem: any) => {
        const checkDuplicateModel = {
          employeeId: this.EmployeeId,
          qualification: eduItem.QUALIFICATION,
        };
        const encryptedDuplicateModel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));
        const duplicateCheck$ = this.rest.create(
          this.Global.getapiendpoint() + 'eah/checkduplicate',
          { encryptmodel: encryptedDuplicateModel }
        );

        return duplicateCheck$.pipe(
          switchMap((duplicateData: any) => {
            if (duplicateData.isDuplicate) {
              console.log('Duplicate found, skipping...');
              return EMPTY;
            } else {
              console.log('No duplicate, saving...');
              const model = {
                empid: this.EmployeeId,
                inst: eduItem.INSTITUTION,
                qualification: eduItem.QUALIFICATION,
                subQualification: eduItem.SUB_QUALIFICATION,
              };
              const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));
              const saveRecord$ = this.rest.create(
                this.Global.getapiendpoint() + 'eah/SaveEduDetails',
                { encryptmodel: encryptedModel }
              );
              return saveRecord$;
            }
          }),
          catchError((err) => {
            console.error('Error processing item:', err);
            return EMPTY; // Skip the item on error
          })
        );
      }),
      toArray() // Collect all non-empty results
    ).subscribe({
      next: (responses: any[]) => {

      },
      error: (error: any) => {
        console.error('Final error', error);

      }
    });
  }


  savePastEmpData(pastEmpData: any[]) {
    const observables = pastEmpData.map((eduItem: any) => {
      const checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        pastEmployer: eduItem.PAST_EMPLOYERS
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      const checkDuplicateApiUrl = 'eah/checkduplicatepastemployee';

      // Create an observable for the duplicate check
      const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel });

      return duplicateCheck$.pipe(
        switchMap((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            // If it's a duplicate, skip saving this row
            return EMPTY;
          } else {
            // If not a duplicate, proceed to save the education record
            const model: any = {
              employeeid: this.EmployeeId,
              pastEmp: eduItem.PAST_EMPLOYERS,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

            // Create an observable for saving the record
            const apiUrl = 'eah/SavePastEmp';
            const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });

            return saveRecord$;
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );

  }

  saveContactData(contactData: any[]) {
    const observables = contactData.map((eduItem: any) => {
      const checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        contactNumber: eduItem.CONATCT_NUMBER
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      const checkDuplicateApiUrl = 'eah/checkduplicatecontact';

      // Create an observable for the duplicate check
      const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel });

      return duplicateCheck$.pipe(
        switchMap((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            // If it's a duplicate, skip saving this row
            return EMPTY;
          } else {
            // If not a duplicate, proceed to save the education record
            const model: any = {
              employeeid: this.EmployeeId,
              contact_type: eduItem.CONTACT_TYPE,
              conatct_number: eduItem.CONATCT_NUMBER,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

            // Create an observable for saving the record
            const apiUrl = 'eah/SaveContact';
            const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });

            return saveRecord$;
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );

  }

  //education details
  getallEdu(EmployeeId: any) {
    debugger
    var apiUrl = '';
    apiUrl = `eah/GetAllEdu/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.result.length > 0 || Result.eahdata == true) {
          this.products = Result.result;
          this.edumstid = Result.result;
          // console.log("getAllEdu", this.products);
          // console.log("getAllEdu", this.edumstid);
        } else {
          this.getallJDEdu(EmployeeId);
        }
      }
    });
  }


  async createEdu() {
    await this.getReOpenId(this.EmployeeId);
    if (this.Institution && this.Qualification && this.Sub_Qualification) {
      this.oneditbtn = false;
      var model: any = {
        empid: this.EmployeeId,
        inst: this.Institution,
        qualification: this.Qualification,
        subQualification: this.Sub_Qualification,
        reid: this.reopenid1

      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      // First, check for duplicate qualification
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        qualification: this.Qualification
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicate';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Qualification already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Qualification already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'eah/SaveEduDetails';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness()
              this.clearEdu();
              this.getallEdu(Result.EMPLOYEE_ID);
              // this.getallJDEdu(this.EmployeeId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      alert('Please fill in all required fields: Institution, Qualification, and Sub-Qualification.');
    }

  }

  onEditEdu(product: any) {
    // console.log("product on edit", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.Institution = product.INSTITUTION;
    this.Qualification = product.QUALIFICATION;
    this.Sub_Qualification = product.SUB_QUALIFICATION
    this.eduid = product.ID
    this.empid = product.EMPLOYEE_ID
  }

  updateEdu() {
    if (this.Institution && this.Qualification && this.Sub_Qualification) {
      this.oneditbtn = false;

      // First, check for duplicate qualification
      var checkDuplicateModel: any = {
        employeeId: this.empid,
        qualification: this.Qualification
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicate';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Qualification already exists for this employee");
          this.oneditbtn = true;
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Qualification already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with updating
          var model: any = {
            employeeid: this.empid,
            institution: this.Institution,
            qualification: this.Qualification,
            subQualification: this.Sub_Qualification,
            ID: this.eduid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", model);

          var updateApiUrl = 'eah/UpdateEduDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.clearEdu();
              this.onadd = true;
              this.getallEdu(this.EmployeeId);
              // this.getallJDEdu(this.EmployeeId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      alert('Please fill in all required fields: Institution, Qualification, and Sub-Qualification.');
    }
  }

  deleteEdu(product: any) {
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {

      var model: any =
      {
        ID: product.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteEduById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getallEdu(this.EmployeeId);
          // this.getallJDEdu(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  clearEdu() {
    this.Institution = null;
    this.Qualification = null;
    this.Sub_Qualification = null;
    this.oneditbtn = false;
    this.onadd = true;
  }

  //pastemployee details
  getPastEmp(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetPastEmp/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.result.length > 0 || Result.eahdata === true) {
          this.pastEmployees = Result.result;
          this.pastempmstid = Result.result;
          // console.log("getPastEmp", this.pastEmployees);
          // console.log("getPastEmp", this.pastempmstid);
        } else {
          this.getJDPastEmp(EmployeeId);
        }
      }
    });
  }

  createPastEmp() {
    // await this.getReOpenId(this.EmployeeId);
    if (this.Past_Emp) {
      this.oneditbtn2 = false;
      var model: any = {
        employeeid: this.EmployeeId,
        pastEmp: this.Past_Emp,
        reid: this.reopenid1
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      // First, check for duplicate past employer
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        pastEmployer: this.Past_Emp
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicatepastemployee';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Past employer already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Past employer already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'eah/SavePastEmp';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness()
              this.clearPastEmp();
              this.getPastEmp(Result.EMPLOYEE_ID);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      alert('Please fill in required field: Past Employers.');
    }
  }

  onEditPastEmp(pastEmp: any) {
    // console.log("product on edit", pastEmp);
    this.oneditbtn2 = true;
    this.onadd2 = false;
    this.oncancel = true;
    this.Past_Emp = pastEmp.PAST_EMPLOYERS;
    this.pastempid = pastEmp.ID
    this.empid = pastEmp.EMPLOYEE_ID
  }

  updatePastEmp() {
    if (this.Past_Emp) {
      this.oneditbtn2 = false;

      // First, check for duplicate past employer
      var checkDuplicateModel: any = {
        employeeId: this.empid,
        pastEmployer: this.Past_Emp
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicatepastemployee';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Past employer already exists for this employee");
          this.oneditbtn2 = true;
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Past employer already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with updating
          this.oneditbtn2 = false;
          var model: any = {
            employeeid: this.empid,
            pastEmp: this.Past_Emp,
            ID: this.pastempid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", model);

          var updateApiUrl = 'eah/UpdatePastEmpDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.clearPastEmp();
              this.onadd2 = true;
              this.getPastEmp(this.EmployeeId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      alert('Please fill in required field: Past Employers.');
    }
  }

  deletePastEmp(pastEmp: any) {
    // console.log("product", pastEmp);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: pastEmp.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeletePastEmpById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getPastEmp(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  clearPastEmp() {
    this.Past_Emp = null;
    this.oneditbtn2 = false;
    this.onadd2 = true;

  }

  //contact details
  getalltypeCont() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllTypeCont').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.contid = Result;
        // console.log("getAlltypeCont", this.contid)
      }
    });
  }

  getContact(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetContact/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.result.length > 0 || Result.eahdata === true) {
          this.contacts = Result.result;
          this.contmstid = Result.result;
          // console.log("getContact", this.contacts);
          // console.log("getContact", this.contmstid);
        } else {
          this.getJDContact(EmployeeId);
        }
      }
    });
  }

  createCont() {
    if (this.Contact_no && this.contNgmodel && (this.Contact_no.length == 10 && /^\d+$/.test(this.Contact_no))) {
      this.oneditbtn1 = false;
      var model: any = {
        employeeid: this.EmployeeId,
        contact_type: this.contNgmodel.ID,
        conatct_number: this.Contact_no,
        reid: this.reopenid1
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      // First, check for duplicate contact number
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        contactNumber: this.Contact_no
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicatecontact';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Contact number already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Contact number already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'eah/SaveContact';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness()
              this.clearCont();
              this.getContact(Result.EMPLOYEE_ID);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      // this.Contact_no.markAsDirty();
      alert("Please fill in all required fields: Contact No, Contact Type.");
    }
  }



  onEditCont(contact: any) {
    // console.log("product on edit", contact);
    this.oneditbtn1 = true;
    this.onadd1 = false;
    this.oncancel = true;
    this.contNgmodel = { "ID": contact.TBL_GENERIC_MST.ID, "NAME": contact.TBL_GENERIC_MST.NAME };
    this.Contact_no = contact.CONATCT_NUMBER;
    this.contactid = contact.ID
    this.empid = contact.EMPLOYEE_ID
  }

  updateCont() {
    if (this.Contact_no && this.contNgmodel && (this.Contact_no.length === 10 && /^\d+$/.test(this.Contact_no))) {
      this.oneditbtn1 = false;

      // First, check for duplicate contact number
      var checkDuplicateModel: any = {
        employeeId: this.empid,
        contactNumber: this.Contact_no
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'eah/checkduplicatecontact';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Contact number already exists for this employee");
          this.oneditbtn1 = true;
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Contact number already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with updating
          var model: any = {
            employeeid: this.empid,
            contact_type: this.contNgmodel.ID,
            conatct_number: this.Contact_no,
            ID: this.contactid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", model);

          var updateApiUrl = 'eah/UpdateContDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.clearCont();
              this.onadd1 = true;
              this.getContact(this.EmployeeId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      });
    } else {
      // this.Contact_no.markAsDirty();
      alert("Please fill in all required fields: Contact No,Contact Type.");
    }
  }

  deleteCont(contact: any) {
    // console.log("product", contact);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: contact.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteContById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getContact(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  clearCont() {
    this.contNgmodel = null;
    this.Contact_no = null;
    this.oneditbtn1 = false;
    this.onadd1 = true;
  }



  /////////////////////////////////////// Self Account /////////////////////////////////////////////////////////////////////////////////////////
  getallBaseEntity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllBaseEntity').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entity1id = Result;
        // console.log("GetAllBaseEntity", this.entity1id)
        this.entityNames = this.entity1id?.map(item => item.ENTITY_NAME) || [];
        // console.log(this.entityNames);

      }
    });
  }

  getallEntity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllEntity').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allentid = Result;
        // console.log("getallEntity", this.allentid)
      }
    });
  }

  getJDBEntity(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetBEntityDetails/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.EntOthers = Result;
        this.entityData = Result;
        this.selfBaseEntid = Result;
        // console.log("getJDBEntity", this.EntOthers);
        // console.log("getJDBEntity", this.selfBaseEntid);
      }
    });
  }

  getJDSelfOther(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetSelfOther/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.SelfOthers = Result;
        this.selfOtherData = Result;
        this.selfOthermstid = Result;
        // console.log("getJDSelfOther", this.SelfOthers);
        // console.log("getJDSelfOther", this.selfOthermstid);
      }
    });
  }

  getJDSelfDemat(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetJDSelfDemat/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.SelfDPs = Result;
        this.selfDematData = Result;
        this.SelfDematmstid = Result;
        // console.log("getJDSelfDemat", this.SelfDPs);
        // console.log("getJDSelfDemat", this.SelfDematmstid);
      }
    });
  }

  //next click event for self account details
  handleNext2Click() {
    if (this.activeIndex1 === 1) {

      var model: any = {
        employeeid: this.EmployeeId,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      var apiUrl = '';
      apiUrl = `eah/SaveSelfAccontDetails/${this.EmployeeId}`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          const entityData = this.entityData;
          const selfOtherData = this.selfOtherData;
          const selfDematData = this.selfDematData;
          this.saveEntityData(entityData);
          this.saveSelfOtherData(selfOtherData);
          this.saveSelfDematData(selfDematData);
          this.activeIndex1 = 2;
          this.getEAHSpouse(this.EmployeeId);
          this.getallEdu(this.EmployeeId);
          this.getPastEmp(this.EmployeeId);
          this.getContact(this.EmployeeId);
          // this.getBEntity(this.EmployeeId);
          // this.getSelfOther(this.EmployeeId);
          this.getAllData(this.EmployeeId);
          this.getSelfDemat(this.EmployeeId);
          this.getallbusiness();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }
  }

  saveEntityData(entityData: any[]) {
    const observables = entityData.map((eduItem: any) => {
      const checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        tradingAccountNumber: eduItem.TRADING_ACCOUNT_NUMBER,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      const checkDuplicateApiUrl = 'eah/checkduplicateentitytradeaccount';

      // Create an observable for the duplicate check
      const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel });

      return duplicateCheck$.pipe(
        switchMap((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            // If it's a duplicate, skip saving this row
            return EMPTY;
          } else {
            // If not a duplicate, proceed to save the education record
            const model: any = {
              employeeid: this.EmployeeId,
              EBL: eduItem.TRADING_ACCOUNT_NUMBER,
              entityid: eduItem.TBL_ENTITY_MST.ID,
              entname: eduItem.ENTITY_NAME,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

            // Create an observable for saving the record
            const apiUrl = 'eah/SaveBaseEntity';
            const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });

            return saveRecord$;
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );
  }

  saveSelfOtherData(selfOtherData: any[]) {
    const observables = selfOtherData.map((eduItem: any) => {
      const checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        tradingAccountNumber: eduItem.TRADING_ACCOUNT_NUMBER
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      const checkDuplicateApiUrl = 'eah/checkduplicatetradingaccount';

      // Create an observable for the duplicate check
      const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel });

      return duplicateCheck$.pipe(
        switchMap((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            // If it's a duplicate, skip saving this row
            return EMPTY;
          } else {
            // If not a duplicate, proceed to save the education record
            const model: any = {
              employeeid: this.EmployeeId,
              brokerName: eduItem.BROKER_NAME,
              tradecode: eduItem.TRADING_ACCOUNT_NUMBER,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

            // Create an observable for saving the record
            const apiUrl = 'eah/SaveSelfOther';
            const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });

            return saveRecord$;
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );

  }

  saveSelfDematData(selfDematData: any[]) {
    const observables = selfDematData.map((eduItem: any) => {
      const checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        dpAccount: eduItem.DP_ACCOUNT
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      const checkDuplicateApiUrl = 'eah/checkduplicatedpaccount';

      // Create an observable for the duplicate check
      const duplicateCheck$ = this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel });

      return duplicateCheck$.pipe(
        switchMap((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            // If it's a duplicate, skip saving this row
            return EMPTY;
          } else {
            // If not a duplicate, proceed to save the education record
            const model: any = {
              employeeid: this.EmployeeId,
              brokerName: eduItem.DP_BROKER_NAME,
              tradecode: eduItem.DP_ACCOUNT,
              authorize: eduItem.AUTHORIZE_EW,
              shareholding: eduItem.SHARE_HOLDING_AVAILABLE,
              isupload: eduItem.IS_UPLOAD,
              uploadpath: eduItem.UPLOAD_PATH,
              uploaddate: eduItem.UPLOAD_DATE,
              providedemat: eduItem.PROVIDE_DEMAT
              // type: eduItem.TYPE,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // Create an observable for saving the record
            const apiUrl = 'eah/SaveJDSelfDemat';
            const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });

            return saveRecord$;
          }
        })
      );
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );

  }

  //Base Entity
  // getBEntity(EmployeeId: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetBEntityDetails/${EmployeeId}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       if (data.Data.length > 0) {
  //         this.EntOthers = data.Data;
  //         this.selfBaseEntid = data.Data;
  //         console.log("GetBEntityDetails", this.EntOthers);
  //         console.log("GetBEntityDetails", this.selfBaseEntid);
  //       } else {
  //         this.getJDBEntity(EmployeeId);
  //       }
  //     }
  //   });
  // }

  // addEntity1Other() {
  //   // debugger;
  //   if (this.activeIndex1 === 1) {
  //     if (this.ent1Ngmodel && this.EBL) {

  //       // First, check for duplicate trading account number
  //       var checkDuplicateModel: any = {
  //         employeeId: this.EmployeeId,
  //         tradingAccountNumber: this.EBL
  //       };

  //       var checkDuplicateApiUrl = 'eah/checkduplicateentitytradeaccount';
  //       this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, checkDuplicateModel).subscribe((duplicateData: any) => {
  //         if (duplicateData.isDuplicate) {
  //           alert("Trading account number already exists for this employee");
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
  //         } else {

  //           var model: any = {
  //             employeeid: this.EmployeeId,
  //             EBL: this.EBL,
  //             entityid: this.ent1Ngmodel.ID,
  //             entname: this.ent1Ngmodel.ENTITY_NAME,
  //             reid: this.reopenid1
  //           };
  //           console.log("model", model);

  //           var addApiUrl = 'eah/SaveBaseEntity';
  //           this.rest.create(this.Global.getapiendpoint() + addApiUrl, model).subscribe((data: any) => {
  //             if (data.Success) {
  //               console.log("data", data);
  //               this.ent1Ngmodel = null;
  //               this.EBL = null;
  //               this.getBEntity(data.Data.EMPLOYEE_ID);
  //               this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //             } else {
  //               this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
  // }

  // deleteEntOther(EntOther: any) {
  //   console.log("product", EntOther);
  //   var model: any =
  //   {
  //     ID: EntOther.ID,
  //   }

  //   var apiUrl = '';
  //   apiUrl = 'eah/DeleteBaseEntById';

  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //     if (data.Success) {
  //       this.getBEntity(this.EmployeeId);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

  //     }
  //     else {
  //       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //     }
  //   })
  // }

  //Other account
  // getSelfOther(EmployeeId: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetSelfOther/${EmployeeId}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       if (data.Data.length > 0) {
  //         this.SelfOthers = data.Data;
  //         this.selfOthermstid = data.Data;
  //         console.log("getSelfOther", this.SelfOthers);
  //         console.log("getSelfOther", this.selfOthermstid);
  //       } else {
  //         this.getJDSelfOther(EmployeeId);
  //       }
  //     }
  //   });
  // }





  //self demat
  changeSelfEBL() {
    this.rdoSelfDPOther = false;
    this.showEntDropdown = true;
    this.DPType1 = '';
    this.showOtherTextbox1 = false;
    this.otherngModel = '';
  }

  changeSelfOther() {
    this.rdoSelfDPEBL = false;
    this.rdoSelfDPESL = false;
    this.showOtherTextbox1 = true;
    this.DPType1 = 'Other';
    this.showEntDropdown = false;
    this.allentNgmodel = '';
  }

  getSelfDemat(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetSelfDemat/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.length > 0) {
          this.SelfDPs = Result;
          this.SelfDematmstid = Result;
          // console.log("getSelfDemat", this.SelfDPs);
          // console.log("getSelfDemat", this.SelfDematmstid);
        } else {
          this.getJDSelfDemat(EmployeeId);
        }
      }
    });
  }

  addSelfDP() {
    // debugger;
    if (this.activeIndex1 === 1) {
      if (this.selfDPtradeNo && (this.allentNgmodel || this.otherngModel) && (this.selfDPtradeNo.length === 16 && /^\d+$/.test(this.selfDPtradeNo))) {

        // First, check for duplicate DP account 
        var checkDuplicateModel: any = {
          employeeId: this.EmployeeId,
          dpAccount: this.selfDPtradeNo
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

        var checkDuplicateApiUrl = 'eah/checkduplicatedpaccount';
        this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            alert("DP account already exists for this employee");
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'DP account already exists for this employee.' });
          } else {
            // If not a duplicate, proceed with adding
            var model: any = {
              employeeid: this.EmployeeId,
              brokerName: this.allentNgmodel.ENTITY_NAME || this.otherngModel,
              tradecode: this.selfDPtradeNo,
              type: this.DPType1 || this.allentNgmodel.ENTITY_NAME,
              reid: this.reopenid1
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", model);

            var addApiUrl = 'eah/SaveSelfDemat';
            this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallbusiness()
                this.selfDPtradeNo = null;
                this.dataSaved = true;
                // this.selfDPtradeNoInput.control.dirty(null);
                // Clear the error message for selfDPtradeNo
                // if (this.selfDPtradeNoInput) {
                //   this.selfDPtradeNoInput.control.setErrors(null);
                // }
                this.rdoSelfDPEBL = false;
                this.rdoSelfDPESL = false;
                this.rdoSelfDPOther = false;
                this.otherngModel = null;
                this.showOtherTextbox1 = false;
                this.showEntDropdown = false;
                this.allentNgmodel = null;
                this.getSelfDemat(Result.EMPLOYEE_ID);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
            });
          }
        });
      } else {
        // this.selfDPtradeNo.markAsDirty();
        alert('Please fill in all required fields: DP Name,DP ID.');
      }
    }
  }

  deleteSelfDP(SelfDP: any) {
    // console.log("product", SelfDP);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: SelfDP.ID,
        table_name: SelfDP.table_name,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteSelfDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getSelfDemat(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }

  }

  //new Broker
  getAllJDData(EmployeeId: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetBEntityDetails/${EmployeeId}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetSelfOther/${EmployeeId}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME: item.ENTITY_NAME, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        this.SelfOthers = combinedData; // Assign the combined data to your grid's data source
        // console.log("Combined Data", this.SelfOthers);
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }

  changeSelfBroker() {
    this.rdoSelfBrokerOther = false;
    this.showEntDropdown3 = true;
    // this.DPTypeBroker = '';
    this.showOtherTextbox3 = false;
    this.EBL = '';
  }

  changeSelfBrokerOther() {
    this.rdoSelfBroker = false;
    this.showOtherTextbox3 = true;
    // this.DPTypeBroker = 'Other';
    this.showEntDropdown3 = false;
    this.ent1Ngmodel = '';
  }

  getAllData(EmployeeId: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetBEntityDetails/${EmployeeId}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetSelfOther/${EmployeeId}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME: item.ENTITY_NAME, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        if (combinedData.length > 0) {
          this.SelfOthers = combinedData; // Assign the combined data to your grid's data source
          // console.log("Combined Data", this.SelfOthers);
        } else {
          this.getAllJDData(EmployeeId);
        }
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }
  addselfOther() {
    if (this.activeIndex1 === 1) {
      const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
      if (this.ent1Ngmodel != null) {
        if (entityNames.includes(this.ent1Ngmodel.ENTITY_NAME)) {
          if (this.ent1Ngmodel && this.selftrdCode) {
            var checkDuplicateModel: any = {
              employeeId: this.EmployeeId,
              tradingAccountNumber: this.selftrdCode
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var checkDuplicateApiUrl = 'eah/checkduplicateentitytradeaccount';
            this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
              if (duplicateData.isDuplicate) {
                alert("Trading account number already exists for this employee");
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
              } else {

                var model: any = {
                  employeeid: this.EmployeeId,
                  EBL: this.selftrdCode,
                  entityid: this.ent1Ngmodel.ID,
                  entname: this.ent1Ngmodel.ENTITY_NAME,
                  reid: this.reopenid1
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                // console.log("model", model);

                var addApiUrl = 'eah/SaveBaseEntity';
                this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                  if (data.Success) {
                    var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.getallbusiness()
                    this.ent1Ngmodel = null;
                    this.selftrdCode = null;
                    this.showEntDropdown3 = false;
                    this.rdoSelfBroker = false;
                    this.getAllData(Result.EMPLOYEE_ID);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                  } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                  }
                });
              }
            });
          } else {
            alert('Please fill in all required fields: Broker Name,UCC/PMS Code.');
          }
        } else {
          if (this.EBL && this.selftrdCode) {
            // First, check for duplicate trading account number
            var checkDuplicateModel: any = {
              employeeId: this.EmployeeId,
              tradingAccountNumber: this.selftrdCode
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var checkDuplicateApiUrl = 'eah/checkduplicatetradingaccount';
            this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
              if (duplicateData.isDuplicate) {
                alert("Trading account number already exists for this employee");
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
              } else {
                // If not a duplicate, proceed with adding
                var model: any = {
                  employeeid: this.EmployeeId,
                  brokerName: this.EBL,
                  tradecode: this.selftrdCode,
                  reid: this.reopenid1
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                // console.log("model", model);

                var addApiUrl = 'eah/SaveSelfOther';
                this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                  if (data.Success) {
                    var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.getallbusiness()
                    this.EBL = null;
                    this.selftrdCode = null;
                    this.showOtherTextbox3 = false;
                    this.rdoSelfBrokerOther = false;
                    this.getAllData(Result.EMPLOYEE_ID);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                  } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                  }
                });
              }
            });
          } else {
            alert('Please fill in all required fields: Broker Name,UCC/PMS Code.');
          }
        }
      } else {
        alert('Please fill in all required fields: Broker Name,UCC/PMS Code.');
      }
    }
  }
  deleteSelfOther(SelfOther: any) {
    // console.log("product", SelfOther);
    if (SelfOther.source === 'Entity List') {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: SelfOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallbusiness()
            this.getAllData(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    } else {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: SelfOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteSelfOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallbusiness()
            this.getAllData(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    }
  }



  ///////////////////////////////////////////// dependent account details //////////////////////////////////////////////////////////////////////////////////
  addDependentAcDetails() {
    this.dependentAcDetails = true;
  }

  getJDDeptDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/combineDataforDependent/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.dependents = Result;
        this.DeptDetailsData = Result;
        this.deptDetailtid = Result;

        this.saveDeptDetailsData(this.deptDetailtid)
        this.getDeptDetails(EmployeeId)
        // console.log("getJDDeptDetails", this.dependents);
        // console.log("getJDDeptDetails", this.deptDetailtid);
      }
    });
  }

  //next click event for dependent account details
  handleNext3Click() {
    // debugger;
    if (this.activeIndex1 === 2) {
      var model: any = {
        employeeId: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrlSave = 'eah/handlenext3click';
      this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          const DeptDetailsData = this.DeptDetailsData;
          this.saveDeptDetailsData(DeptDetailsData);
          const JDConcernData = this.JDConcernData;
          this.saveJDConcernDataData(JDConcernData);
          if (this.employeeData.DSIGNATED === true) {
            // console.log("data", data);
            this.activeIndex1 = 3;
            this.getEAHSpouse(this.EmployeeId);
            this.getallEdu(this.EmployeeId);
            this.getPastEmp(this.EmployeeId);
            this.getContact(this.EmployeeId);
            // this.getBEntity(this.EmployeeId);
            // this.getSelfOther(this.EmployeeId);
            this.getAllData(this.EmployeeId);
            this.getSelfDemat(this.EmployeeId);
            // this.getDependentDemat(this.EmployeeId);
            // this.getDependentOther(this.EmployeeId);
            // this.getDeptBaseEntity(this.EmployeeId);
            this.getDeptDetails(this.EmployeeId);
            this.getDematDropdown(this.EmployeeId);
            this.getallPropertyType();
            this.getallbusiness();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.activeIndex1 = 4;
            this.getEAHSpouse(this.EmployeeId);
            this.getallEdu(this.EmployeeId);
            this.getPastEmp(this.EmployeeId);
            this.getContact(this.EmployeeId);
            // this.getBEntity(this.EmployeeId);
            // this.getSelfOther(this.EmployeeId);
            this.getAllData(this.EmployeeId);
            this.getSelfDemat(this.EmployeeId);
            // this.getDependentDemat(this.EmployeeId);
            // this.getDependentOther(this.EmployeeId);
            // this.getDeptBaseEntity(this.EmployeeId);
            this.getDeptDetails(this.EmployeeId);
            this.getDematDropdown(this.EmployeeId);
            this.getallbusiness();
          }
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }
  }

  saveDeptDetailsData(DeptDetailsData: any[]) {
    const processedData = new Set();
    const commonDetailsMap = new Map(); // Store saved common details
    const observables = DeptDetailsData.map((eduItem: any) => {
      // Create an array to hold all observables for dp, entity, and trading
      const dpEntityTradingObservables = [];

      // Define the employeeId for this iteration
      const employeeId = this.EmployeeId;

      // Define common details model
      const commonModel: any = {
        employeeId: employeeId,
        minor: eduItem.IS_MINOR,
        mobile: eduItem.MOBILE,
        pan: eduItem.PAN_NO,
        phone: eduItem.PHONE,
        relid: eduItem.RELATIONSHIP,
        relname: eduItem.RELATIVE_NAME,
        relothername: eduItem.REL_OTHER_NAME,
        findept: eduItem.FINANCIAL_INDEPENDENT,
      };

      // Check if common details are already saved for this eduItem
      let commonObservable: Observable<any>;
      const commonDataKey = `${employeeId}-${eduItem.RELATIONSHIP}`;
      if (commonDetailsMap.has(commonDataKey)) {
        commonObservable = of(commonDetailsMap.get(commonDataKey));
      } else {
        commonObservable = this.rest.create(this.Global.getapiendpoint() + 'eah/SaveCommonDetails', commonModel).pipe(
          catchError((error) => {
            // Handle duplicate data error
            console.error(`Error saving Common Details: ${error}`);
            return of({ Success: false, Message: 'Duplicate Common Details or Error occurred', Data: null });
          })
        );
      }


      // Save DP_ACCOUNT_NUMBERS
      const dpAccountNumbers = eduItem.DP_ACCOUNT_NUMBERS.split(',');
      dpAccountNumbers.forEach((dpAccount) => {
        const dpParts = dpAccount.trim().split('-');
        const dp = dpParts[0];
        const dpNumber = dpParts[1];

        // Create observables for saving the records
        const dpApiUrl = 'eah/SaveDpAccountDetails';

        const dpModel: any = {
          employeeId: employeeId,
          relid: eduItem.RELATIONSHIP,
          dp: dp,
          dpNumber: dpNumber,
          relName: eduItem.RELATIVE_NAME,
        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.RELATIONSHIP}-${dp}-${dpNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + dpApiUrl, dpModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving DP Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate DP Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            forkJoin([dpObservable, commonObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });


      // Save ENTITY_ACCOUNT_NUMBERS
      const entityAccountNumbers = eduItem.ENTITY_ACCOUNT_NUMBERS.split(',');
      entityAccountNumbers.forEach((entityAccount) => {
        const entityParts = entityAccount.trim().split('-');
        const entity = entityParts[0];
        const entityNumber = entityParts[1];

        // Create observables for saving the records
        const entityApiUrl = 'eah/SaveEntityAccountDetails';

        const entityModel: any = {
          employeeId: employeeId,
          relid: eduItem.RELATIONSHIP,
          entity: entity,
          entityNumber: entityNumber,
          relName: eduItem.RELATIVE_NAME,
        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.RELATIONSHIP}-${entity}-${entityNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + entityApiUrl, entityModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving ENTITY Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate ENTITY Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            // forkJoin([dpObservable, commonObservable])
            forkJoin([dpObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });

      // Save TRADING_ACCOUNT_NUMBERS
      const tradingAccountNumbers = eduItem.TRADING_ACCOUNT_NUMBERS.split(',');
      tradingAccountNumbers.forEach((tradingAccount) => {
        const tradingParts = tradingAccount.trim().split('-');
        const trading = tradingParts[0];
        const tradingNumber = tradingParts[1];

        // Create observables for saving the records
        const tradingApiUrl = 'eah/SaveTradingAccountDetails';


        const tradingModel: any = {
          employeeId: employeeId,
          relid: eduItem.RELATIONSHIP,
          trading: trading,
          tradingNumber: tradingNumber,
          relName: eduItem.RELATIVE_NAME,
        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.RELATIONSHIP}-${trading}-${tradingNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + tradingApiUrl, tradingModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving DP Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate DP Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            // forkJoin([dpObservable, commonObservable])
            forkJoin([dpObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });

      // ...

      // Use forkJoin to run all observables for dp, entity, and trading details in parallel
      return forkJoin(dpEntityTradingObservables);
    });

    // Use forkJoin to run all observables in parallel for each educational item
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses (DP, Entity, and Trading)", responses);

        // Assuming you want to show a success message when all records are saved successfully
        const successResponses = responses.filter((response) => response.every((res) => res.Success));
        if (successResponses.length === responses.length) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Some records could not be saved' });
        }
      },
      (error: any) => {
        // Handle errors
        console.error("Error (DP, Entity, and Trading)", error);

        // Display an error message for any errors that occur during record creation
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );
  }

  getalltypeRelation() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllTypeRelation').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.relid = Result;
        // console.log("getAlltypeRelation", this.relid)
      }
    });
  }

  //otheraccount
  // getDependentOther(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetDeptOther/${EmployeeId}/${id}/${name}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.DeptOthers = data.Data;
  //       this.deptothermstid = data.Data;
  //       console.log("getDependentOther", this.DeptOthers);
  //       console.log("getDependentOther", this.deptothermstid);
  //     }
  //   });
  // }

  //Demat account
  changeDPEBL() {
    this.rdoDeptDPOther = false;
    this.showEntDropdown1 = true;
    this.DPType = '';
    this.showOtherTextbox = false;
    this.Othermodel = '';
  }

  changeOther() {
    this.rdoDeptDPEBL = false;
    this.showOtherTextbox = true;
    this.DPType = 'Other';
    this.showEntDropdown1 = false;
    this.allentNgmodel = '';

  }

  getDependentDemat(EmployeeId: any, id: any, name: any) {
    var apiUrl = '';
    apiUrl = `eah/GetDeptDemat/${EmployeeId}/${id}/${name}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.DeptDPs = Result;
        this.deptDematmstid = Result;
        // console.log("getDependentDemat", this.DeptDPs);
        // console.log("getDependentDemat", this.deptDematmstid);
      }
    });
  }

  addDeptDP() {
    if (this.activeIndex1 === 2) {
      if (this.deptDPAccNo && this.rltNgmodel && (this.allentNgmodel || this.Othermodel) && (this.deptDPAccNo.length === 16 && /^\d+$/.test(this.deptDPAccNo))) {
        // Check if the DP account number is duplicate
        const duplicateCheckData = {
          employeeId: this.EmployeeId,
          dpAccountNumber: this.deptDPAccNo,
          relativeId: this.rltNgmodel.ID,
          dpBrokerName: this.allentNgmodel.ENTITY_NAME || this.Othermodel
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(duplicateCheckData));

        this.rest.postParams(this.Global.getapiendpoint() + 'eah/checkduplicateRelDp', { encryptmodel: encryptmodel }).subscribe((dupData: any) => {
          if (dupData.isDuplicate) {
            alert(`${dupData.Message}`);
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: dupData.Message });
          } else {
            // Proceed with saving the DP account information
            var model: any = {
              employeeid: this.EmployeeId,
              brokerName: this.allentNgmodel.ENTITY_NAME || this.Othermodel,
              tradecode: this.deptDPAccNo,
              Rtype: this.rltNgmodel.ID,
              reid: this.reopenid1,
              relativeName: this.name
              // type: this.DPType || this.allentNgmodel.ENTITY_NAME
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

            // console.log("model", model);
            var apiUrl = 'eah/SaveDependentDemat';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.deptDPAccNo = null;
                this.dataSaved = true;
                this.rdoDeptDPEBL = false;
                this.rdoDeptDPESL = false;
                this.rdoDeptDPOther = false;
                this.Othermodel = null;
                this.showOtherTextbox = false;
                this.showEntDropdown1 = false;
                this.allentNgmodel = null;
                // this.getDependentDemat(data.Data.EMPLOYEE_ID);
                this.getDependentDemat(Result.EMPLOYEE_ID, Result.RELATIVE_ID, Result.RELATIONSHIP);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
            });
          }
        });
      } else {
        // this.deptDPAccNo.markAsDirty();
        alert('Please fill in all required fields: DP Name,DP ID.');
      }
    }
  }

  deleteDeptDP(DeptDP: any) {
    // console.log("product", DeptDP);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: DeptDP.ID,
        table_name: DeptDP.table_name
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteDeptDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          // this.getDependentDemat(this.EmployeeId);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getDependentDemat(this.EmployeeId, DeptDP.RELATIVE_ID, DeptDP.RELATIONSHIP);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  //PAN
  chnageNotapplicable() {
    this.rdbNotApllied = false;
    this.rdbPan = false;
    this.PanNo = '';
    this.isPanDisable = true;
    this.PanNo = '';
    this.DeptPan = 'NotApplicable';
  }

  changeNotApplied() {
    this.rdbNotApplicable = false;
    this.rdbPan = false;
    this.PanNo = '';
    this.isPanDisable = true;
    this.PanNo = '';
    this.DeptPan = 'NotApplied';
  }

  chnagePan() {
    this.rdbNotApplicable = false;
    this.rdbNotApllied = false;
    this.isPanDisable = false;
    this.DeptPan = '';
  }

  toggleRadioButton() {
    const disabledRelationships = ['Mother', 'Father', 'Spouse'];

    // Check if the selected relationship is in the disabled list
    if (!disabledRelationships.includes(this.rltNgmodel?.NAME)) {
      // Toggle the "Minor" radio button only if the selected relationship is not in the disabled list
      this.minorNgModel = !this.minorNgModel;
    }

    this.phoneNgModel = '';
    this.mobileNgModel = '';
  }

  isMinorDisabled(): boolean {
    // Define the relationships that should disable the <div>
    const disabledRelationships = ['Mother', 'Father', 'Spouse'];

    // Check if the selected relationship is in the disabled list
    const isDisabled = disabledRelationships.includes(this.rltNgmodel?.NAME);

    if (isDisabled) {
      this.phoneNgModel = '';
      this.mobileNgModel = '';
      this.phonedisable = true;
      this.mobiledisable = true;
    } else {
      this.phonedisable = false;
      this.mobiledisable = false;
    }

    return isDisabled;
  }

  onDropdownChange() {
    this.relationSelected = !!this.rltNgmodel;
    this.showOtherInput = this.rltNgmodel.NAME === 'Other';
    if (this.showOtherInput) {
      this.RelTypeOther = ''; // Clear the "Other" input field
      this.phonedisable = false;
      this.mobiledisable = false;
    }
    if (this.relationSelected) {
      this.getDPBrokerAllData(this.EmployeeId, this.rltNgmodel.ID, this.name);
      this.getDependentDemat(this.EmployeeId, this.rltNgmodel.ID, this.name);
    }
  }

  //Deptenitysave
  // getDeptBaseEntity(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetDeptBEntityDetails/${EmployeeId}/${id}/${name}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.DeptEntOthers = data.Data;
  //       this.DeptBaseEntid = data.Data;
  //       console.log("getDeptBaseEntity", this.DeptEntOthers);
  //       console.log("getDeptBaseEntity", this.DeptBaseEntid);
  //     }
  //   });
  // }

  // addDeptEntity1Other() {
  //   if (this.activeIndex1 === 2) {
  //     if (this.ent1Ngmodel && this.DeptEBL && this.rltNgmodel) {
  //       const checkDuplicateModel = {
  //         employeeId: this.EmployeeId,
  //         tradingAccountNumber: this.DeptEBL,
  //         relativeId: this.rltNgmodel.ID,
  //       };

  //       var apiUrlCheckDuplicate = 'eah/checkduplicateDeptentitytradeaccount';
  //       this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, checkDuplicateModel).subscribe((checkData: any) => {
  //         if (checkData.isDuplicate) {
  //           alert(`${checkData.Message}`);
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
  //         } else {
  //           var model: any = {
  //             employeeid: this.EmployeeId,
  //             EBL: this.DeptEBL,
  //             entityid: this.ent1Ngmodel.ID,
  //             entname: this.ent1Ngmodel.ENTITY_NAME,
  //             Rtype: this.rltNgmodel.ID,
  //             reid: this.reopenid1,
  //             relativeName: this.name
  //           };

  //           var apiUrlSave = 'eah/SaveDeptBaseEntity';
  //           this.rest.create(this.Global.getapiendpoint() + apiUrlSave, model).subscribe((data: any) => {
  //             if (data.Success) {
  //               this.ent1Ngmodel = null;
  //               this.DeptEBL = null;
  //               // this.getDeptBaseEntity(data.Data.EMPLOYEE_ID);
  //               this.getDeptBaseEntity(data.Data.EMPLOYEE_ID, data.Data.RELATIVE_ID, data.Data.RELATIONSHIP);
  //               // this.getDependentOther(data.Data.EMPLOYEE_ID);
  //               this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //             } else {
  //               this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //             }
  //           });
  //         }
  //       });

  //     } else {
  //       alert("Please select Relation Type");
  //     }
  //   }
  // }

  // deleteDeptEntOther(DeptEntOther: any) {
  //   console.log("product", DeptEntOther);
  //   var model: any =
  //   {
  //     ID: DeptEntOther.ID,
  //   }

  //   var apiUrl = '';
  //   apiUrl = 'eah/DeleteDeptBaseEntById';

  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //     if (data.Success) {
  //       // this.getDeptBaseEntity(this.EmployeeId);
  //       this.getDeptBaseEntity(this.EmployeeId, DeptEntOther.RELATIVE_ID, DeptEntOther.RELATIONSHIP);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

  //     }
  //     else {
  //       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //     }
  //   })
  // }

  //click event on adddependent button
  saveDeptDetails() {
    // debugger;
    if (this.activeIndex1 === 2) {
      // if (this.name && this.rltNgmodel && (this.rdbNotApplicable || this.rdbNotApllied || (this.rdbPan && this.PanNo)) || (!this.minorNgModel || (this.minorNgModel && (this.phoneNgModel || this.mobileNgModel)))) {
      if (
        this.name &&
        this.rltNgmodel &&
        (this.rdbNotApplicable || this.rdbNotApllied || (this.rdbPan && this.PanNo && this.PanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.PanNo))) &&
        (!this.minorNgModel ||
          (this.minorNgModel &&
            (
              // (this.phoneNgModel || this.mobileNgModel) &&
              (
                (
                  this.phoneNgModel &&
                  this.mobileNgModel &&
                  (this.phoneNgModel.length === 10 && /^\d+$/.test(this.phoneNgModel)) &&
                  (this.mobileNgModel.length === 10 && /^\d+$/.test(this.mobileNgModel))
                ) ||
                (
                  this.phoneNgModel &&
                  !this.mobileNgModel &&
                  this.phoneNgModel.length === 10 &&
                  /^\d+$/.test(this.phoneNgModel)
                ) ||
                (
                  !this.phoneNgModel &&
                  this.mobileNgModel &&
                  this.mobileNgModel.length === 10 &&
                  /^\d+$/.test(this.mobileNgModel)
                )
              )
            )
          )
        )
      ) {
        this.oneditbtn4 = false;
        if (this.rltNgmodel.NAME === 'Other') {
          var model: any = {
            employeeid: this.EmployeeId,
            Sname: this.name,
            relation: this.rltNgmodel.ID,
            pan: this.DeptPan || this.PanNo,
            IsMinor: this.minorNgModel,
            contact: this.phoneNgModel || null,
            mobile: this.mobileNgModel || null,
            other: this.RelTypeOther,
            findept: this.activemodel,
            reid: this.reopenid1
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Sname: this.name,
            relation: this.rltNgmodel.ID,
            pan: this.DeptPan || this.PanNo,
            IsMinor: this.minorNgModel,
            contact: this.phoneNgModel || null,
            mobile: this.mobileNgModel || null,
            other: this.rltNgmodel.NAME,
            findept: this.activemodel,
            reid: this.reopenid1
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `eah/SaveAddDependentDetails`;
        let hasRel = false;

        for (const detail of this.deptDematmstid) {
          if (detail.RELATIVE_ID === this.rltNgmodel.ID) {
            hasRel = true;
            break; // No need to continue checking once a Spouse record is found
          }
        }

        if (hasRel) {
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.relationSelected = false;
              this.name = null;
              this.rltNgmodel = null;
              this.DeptESL = null;
              this.DeptEBL = null;
              this.rdbNotApplicable = false;
              this.rdbNotApllied = false;
              this.rdbPan = false;
              this.PanNo = null;
              this.isPanDisable = true;
              this.dependentAcDetails = false;
              this.minorNgModel = false;
              this.phoneNgModel = null;
              this.RelTypeOther = null;
              this.mobileNgModel = null;
              this.showOtherInput = false;
              this.activemodel = false;
              this.getDeptDetails(this.EmployeeId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          })
        } else {
          alert("Please fillup Demat Details.");
          // return;
        }
      }
      else {
        // this.PanNo.markAsDirty();
        // this.phoneNgModel.markAsDirty();
        // this.mobileNgModel.markAsDirty();
        alert("Please Fill up required details.")
      }

    }
  }

  getDeptDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/combineDataforDependent/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        console.log('Result.DeptDetails', Result)
        if (Result.length > 0 || Result.DeptDetails == true) {
          this.dependents = Result.data;
          this.deptDetailtid = Result.data;
          console.log("getdeptdetails", this.dependents);
          console.log("getdeptdetails", this.deptDetailtid);
        } else {
          this.getJDDeptDetails(EmployeeId);
        }
      }
    });
  }

  oneditDependent(dependent: any) {
    // debugger;
    // console.log("dependent on edit", dependent);
    this.dependentAcDetails = true;
    this.relationSelected = true;
    this.oneditbtn4 = true;
    this.onadd4 = false;
    this.name = dependent.RELATIVE_NAME;
    this.activemodel = dependent.FINANCIAL_INDEPENDENT;
    this.rltNgmodel = { "ID": dependent.RELATIONSHIP, "NAME": dependent.RELATIONSHIP_NAME };
    if (this.rltNgmodel.NAME === "Other") {
      this.showOtherInput = true;
      this.RelTypeOther = dependent.REL_OTHER_NAME;
    }
    const valuePan = dependent.PAN_NO;
    if (valuePan === "NotApplicable") {
      this.rdbNotApplicable = true;
      this.rdbNotApllied = false;
      this.rdbPan = false;
    } else if (valuePan === "NotApplied") {
      this.rdbNotApllied = true;
      this.rdbNotApplicable = false;
      this.rdbPan = false;
    } else {
      this.rdbPan = true;
      this.rdbNotApplicable = false;
      this.rdbNotApllied = false;
      this.PanNo = dependent.PAN_NO;
    }
    this.minorNgModel = dependent.IS_MINOR;
    this.phoneNgModel = dependent.PHONE;
    this.mobileNgModel = dependent.MOBILE;
    this.getDPBrokerAllData(this.EmployeeId, dependent.RELATIONSHIP, dependent.RELATIVE_NAME);
    this.getDependentDemat(this.EmployeeId, dependent.RELATIONSHIP, dependent.RELATIVE_NAME);
    this.pastempid = dependent.ID;
  }

  updateDEpt() {
    if (this.activeIndex1 === 2) {
      // if (this.name && this.rltNgmodel) {
      if (
        this.name &&
        this.rltNgmodel &&
        (this.rdbNotApplicable || this.rdbNotApllied || (this.rdbPan && this.PanNo && this.PanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.PanNo))) &&
        (!this.minorNgModel ||
          (this.minorNgModel &&
            (
              // (this.phoneNgModel || this.mobileNgModel) &&
              (
                (
                  this.phoneNgModel &&
                  this.mobileNgModel &&
                  (this.phoneNgModel.length === 10 && /^\d+$/.test(this.phoneNgModel)) &&
                  (this.mobileNgModel.length === 10 && /^\d+$/.test(this.mobileNgModel))
                ) ||
                (
                  this.phoneNgModel &&
                  !this.mobileNgModel &&
                  this.phoneNgModel.length === 10 &&
                  /^\d+$/.test(this.phoneNgModel)
                ) ||
                (
                  !this.phoneNgModel &&
                  this.mobileNgModel &&
                  this.mobileNgModel.length === 10 &&
                  /^\d+$/.test(this.mobileNgModel)
                )
              )
            )
          )
        )
      ) {
        this.oneditbtn4 = false;
        if (this.rltNgmodel.NAME === 'Other') {
          var model: any = {
            employeeid: this.EmployeeId,
            Sname: this.name,
            relation: this.rltNgmodel.ID,
            pan: this.DeptPan || this.PanNo,
            IsMinor: this.minorNgModel,
            contact: this.phoneNgModel || null,
            mobile: this.mobileNgModel || null,
            other: this.RelTypeOther,
            ID: this.pastempid,
            findept: this.activemodel,
            reid: this.reopenid1
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Sname: this.name,
            relation: this.rltNgmodel.ID,
            pan: this.DeptPan || this.PanNo,
            IsMinor: this.minorNgModel,
            contact: this.phoneNgModel || null,
            mobile: this.mobileNgModel || null,
            other: this.rltNgmodel.NAME,
            ID: this.pastempid,
            findept: this.activemodel,
            reid: this.reopenid1
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `eah/UpdateAddDependentDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.name = null;
            this.rltNgmodel = null;
            this.DeptESL = null;
            this.DeptEBL = null;
            this.rdbNotApplicable = false;
            this.rdbNotApllied = false;
            this.rdbPan = false;
            this.PanNo = null;
            this.minorNgModel = false,
              this.phoneNgModel = null,
              this.mobileNgModel = null,
              this.isPanDisable = true;
            this.RelTypeOther = null;
            this.showOtherInput = false;
            this.onadd4 = true;
            this.dependentAcDetails = false;
            this.relationSelected = false;
            this.activemodel = false;
            this.getDeptDetails(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
      else {
        // this.PanNo.markAsDirty();
        // this.phoneNgModel.markAsDirty();
        // this.mobileNgModel.markAsDirty();
        alert("Pleasae fill up required  Detail")
      }

    }
  }

  deleteDependent(dependent: any) {
    console.log("product", dependent);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: dependent.ID,
        RELATIONSHIP: dependent.RELATIONSHIP,
        TRADING_ACCOUNT_NUMBERS: dependent.TRADING_ACCOUNT_NUMBERS,
        DP_ACCOUNT_NUMBERS: dependent.DP_ACCOUNT_NUMBERS,
        REL_OTHER_NAME: dependent.RELATIVE_NAME,
        EMPLOYEE_ID: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteDependent';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getDeptDetails(this.EmployeeId);
          // this.getDependentDemat(this.EmployeeId);
          // this.getDependentOther(this.EmployeeId);
          // this.getDeptBaseEntity(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }

  }

  //reset
  resetDept() {
    this.name = null;
    this.rltNgmodel = null;
    this.showEntDropdown1 = false;
    this.DeptEBL = null;
    this.DeptESL = null;
    this.PanNo = '';
    this.rdbNotApplicable = false;
    this.rdbNotApllied = false;
    this.rdbPan = true;
    this.isPanDisable = true;
    this.deptDPAccNo = null;
    this.rdoDeptDPEBL = false;
    this.rdoDeptDPESL = false;
    this.rdoDeptDPOther = false;
    this.Othermodel = '';
    this.showOtherTextbox = false;
    this.deptbName = null;
    this.depttrdCode = null;
    this.minorNgModel = false;
    this.phoneNgModel = null;
    this.mobileNgModel = null;
    this.RelTypeOther = null;
    this.ent1Ngmodel = null;
    this.showOtherInput = false;
    this.relationSelected = false;
    this.oneditbtn4 = false;
    this.onadd4 = true;
    this.rdoDPBroker = false;
    this.rdoDPBrokerOther = false;
    this.showEntDropdown4 = false;
    this.showOtherTextbox4 = false;
    this.activemodel = false;
  }

  DeptPrevBtn() {
    if (this.employeeData.DSIGNATED === true) {
      this.activeIndex1 = 1;
    } else {
      this.activeIndex1 = 0;
    }
  }

  //new broker
  changeDPBroker() {
    this.rdoDPBrokerOther = false;
    this.showEntDropdown4 = true;
    this.showOtherTextbox4 = false;
    this.DeptEBL = '';
  }
  changeDPBrokerOther() {
    this.rdoDPBroker = false;
    this.showOtherTextbox4 = true;
    this.showEntDropdown4 = false;
    this.ent1Ngmodel = '';
  }
  getJDDPBrokerAllData(EmployeeId: any, id: any, name: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetDeptBEntityDetails/${EmployeeId}/${id}/${name}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetDeptOther/${EmployeeId}/${id}/${name}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME: item.ENTITY_NAME, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        this.DeptOthers = combinedData; // Assign the combined data to your grid's data source
        // console.log("DPBroker Combined Data", this.DeptOthers);
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }
  getDPBrokerAllData(EmployeeId: any, id: any, name: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetDeptBEntityDetails/${EmployeeId}/${id}/${name}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetDeptOther/${EmployeeId}/${id}/${name}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME: item.ENTITY_NAME, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        if (combinedData.length > 0) {

          this.DeptOthers = combinedData; // Assign the combined data to your grid's data source
          // console.log("DPBroker Combined Data", this.DeptOthers);
        } else {
          this.getJDDPBrokerAllData(EmployeeId, id, name);
        }
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }
  addDeptOther() {
    if (this.activeIndex1 === 2) {
      const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
      if (this.ent1Ngmodel != null) {
        if (entityNames.includes(this.ent1Ngmodel.ENTITY_NAME)) {
          if (this.ent1Ngmodel && this.depttrdCode && this.rltNgmodel) {
            const checkDuplicateModel = {
              employeeId: this.EmployeeId,
              tradingAccountNumber: this.depttrdCode,
              relativeId: this.rltNgmodel.ID,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var apiUrlCheckDuplicate = 'eah/checkduplicateDeptentitytradeaccount';
            this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, { encryptmodel: encryptmodel }).subscribe((checkData: any) => {
              if (checkData.isDuplicate) {
                alert(`${checkData.Message}`);
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
              } else {
                var model: any = {
                  employeeid: this.EmployeeId,
                  EBL: this.depttrdCode,
                  entityid: this.ent1Ngmodel.ID,
                  entname: this.ent1Ngmodel.ENTITY_NAME,
                  Rtype: this.rltNgmodel.ID,
                  reid: this.reopenid1,
                  relativeName: this.name
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

                var apiUrlSave = 'eah/SaveDeptBaseEntity';
                this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                  if (data.Success) {
                    var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.ent1Ngmodel = null;
                    this.depttrdCode = null;
                    this.showEntDropdown4 = false;
                    this.rdoDPBroker = false;
                    this.getDPBrokerAllData(Result.EMPLOYEE_ID, Result.RELATIVE_ID, Result.RELATIONSHIP);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                  } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                  }
                });
              }
            });

          } else {
            alert('Please fill in all required fields: Broker Name,UCC,PMS Code,DP ID,Relation.');
          }
        } else {
          if (this.DeptEBL && this.depttrdCode && this.rltNgmodel) {
            const checkDuplicateModel = {
              employeeId: this.EmployeeId,
              tradingAccountNumber: this.depttrdCode,
              relativeId: this.rltNgmodel.ID,
              brokerName: this.DeptEBL
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var apiUrlCheckDuplicate = 'eah/checkduplicateDeptOther';
            this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, { encryptmodel: encryptmodel }).subscribe((checkData: any) => {
              if (checkData.isDuplicate) {
                alert(`${checkData.Message}`);
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
              } else {
                var model: any = {
                  employeeid: this.EmployeeId,
                  brokerName: this.DeptEBL,
                  tradecode: this.depttrdCode,
                  Rtype: this.rltNgmodel.ID,
                  reid: this.reopenid1,
                  relativeName: this.name
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

                var apiUrlSave = 'eah/SaveDependentOther';
                this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                  if (data.Success) {
                    var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.DeptEBL = null;
                    this.depttrdCode = null;
                    this.showOtherTextbox4 = false;
                    this.rdoDPBrokerOther = false;
                    this.getDPBrokerAllData(Result.EMPLOYEE_ID, Result.RELATIVE_ID, Result.RELATIONSHIP);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                  } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                  }
                });
              }
            });

          } else {
            alert('Please fill in all required fields: Broker Name,UCC,PMS Code,DP ID,Relation.');
          }
        }
      } else {
        alert('Please fill in all required fields: Broker Name,UCC,PMS Code,DP ID,Relation.');
      }
    }
  }
  deleteDeptOther(DeptOther: any) {
    // console.log("product", DeptOther);
    if (DeptOther.source === 'Entity List') {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: DeptOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteDeptBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getDPBrokerAllData(this.EmployeeId, DeptOther.RELATIVE_ID, DeptOther.RELATIONSHIP);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    } else {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: DeptOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteDeptOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getDPBrokerAllData(this.EmployeeId, DeptOther.RELATIVE_ID, DeptOther.RELATIONSHIP);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    }
  }



  ///////////////////////////////////////////// Material Fin Rel //////////////////////////////////////////////////////////////////////////////////
  addMaterialFinRelDetails() {
    this.materialdetails = true;
  }

  handleNext4Click() {
    // debugger;
    if (this.activeIndex1 === 3) {
      var model: any = {
        employeeId: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrlSave = 'eah/handleMateFinRelNext';
      this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.activeIndex1 = 4;
          this.getEAHSpouse(this.EmployeeId);
          this.getallEdu(this.EmployeeId);
          this.getPastEmp(this.EmployeeId);
          this.getContact(this.EmployeeId);
          // this.getBEntity(this.EmployeeId);
          // this.getSelfOther(this.EmployeeId);
          this.getAllData(this.EmployeeId);
          this.getSelfDemat(this.EmployeeId);
          // this.getDependentDemat(this.EmployeeId);
          // this.getDependentOther(this.EmployeeId);
          // this.getDeptBaseEntity(this.EmployeeId);
          this.getDeptDetails(this.EmployeeId);
          this.getDematDropdown(this.EmployeeId);
          this.getMaterialFinRel(this.EmployeeId);
          this.getallbusiness();

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }
  }

  getallPropertyType() {
    this.rest.getAll(this.Global.getapiendpoint() + 'eah/GetAllPropertyType').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.propertyid = Result;
        // console.log("getallPropertyType", this.propertyid)
      }
    });
  }

  getMaterialFinRel(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/getMateFinRel/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.FinRels = Result;
        this.finrelid = Result;
        // console.log("getMaterialFinRel", this.FinRels);
        // console.log("getMaterialFinRel", this.finrelid);
      }
    });
  }

  AddMaterialFinRel() {
    if (this.activeIndex1 === 3) {
      if (this.FinName && (this.panNgModel && this.panNgModel.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.panNgModel)) &&
        // ((this.phoneModel) || (this.mobileModel)) 
        (
          (
            (
              this.phoneModel &&
              this.mobileModel &&
              (this.phoneModel.length === 10 && /^\d+$/.test(this.phoneModel)) &&
              (this.mobileModel.length === 10 && /^\d+$/.test(this.mobileModel))
            ) ||
            (
              this.phoneModel &&
              !this.mobileModel &&
              this.phoneModel.length === 10 &&
              /^\d+$/.test(this.phoneModel)
            ) ||
            (
              !this.phoneModel &&
              this.mobileModel &&
              this.mobileModel.length === 10 &&
              /^\d+$/.test(this.mobileModel)
            )
          )
        )
        && this.protypeNgmodel) {
        this.oneditbtn6 = false;
        var model: any = {
          employeeid: this.EmployeeId,
          name: this.FinName,
          pan: this.panNgModel,
          phone: this.phoneModel,
          mobile: this.mobileModel,
          propertyid: this.protypeNgmodel.ID,
          reid: this.reopenid1
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var checkDuplicateApiUrl = 'eah/checkduplicateFinREl';
        this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel }).subscribe((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            alert("Data already exists for this employee");
            // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Qualification already exists for this employee.' });
          } else {
            var apiUrl = '';
            apiUrl = `eah/SaveMaterialFinRel`;
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.FinName = null;
                this.dataSaved = true;
                this.dataSaved1 = true;
                this.dataSaved2 = true;
                this.panNgModel = null;
                this.protypeNgmodel = null;
                this.phoneModel = null;
                this.mobileModel = null;
                this.materialdetails = false;
                this.getMaterialFinRel(this.EmployeeId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
            })
          }
        })
      }
      else {
        // this.panNgModel.markAsDirty();
        // this.phoneModel.markAsDirty();
        // this.mobileModel.markAsDirty();
        alert("Pleasae fillup required Details.")
      }

    }
  }

  oneditFinRel(FinRel: any) {
    // console.log("FinRel on edit", FinRel);
    this.materialdetails = true;
    this.oneditbtn6 = true;
    this.onadd6 = false;
    this.FinName = FinRel.MATERIAL_FIN_REL_NAME;
    this.panNgModel = FinRel.MATERIAL_FIN_REL_PAN;
    this.phoneModel = FinRel.MATERIAL_FIN_REL_PHONE;
    this.mobileModel = FinRel.MATERIAL_FIN_REL_MOBILE;
    this.protypeNgmodel = { "ID": FinRel.TBL_GENERIC_MST.ID, "NAME": FinRel.TBL_GENERIC_MST.NAME };
    this.finrelempid = FinRel.ID;

  }

  UpdateMaterialFinRel() {
    if (this.activeIndex1 === 3) {
      if (this.FinName && (this.panNgModel && this.panNgModel.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.panNgModel)) &&
        //  (this.phoneModel || this.mobileModel) 
        (
          (
            (
              this.phoneModel &&
              this.mobileModel &&
              (this.phoneModel.length === 10 && /^\d+$/.test(this.phoneModel)) &&
              (this.mobileModel.length === 10 && /^\d+$/.test(this.mobileModel))
            ) ||
            (
              this.phoneModel &&
              !this.mobileModel &&
              this.phoneModel.length === 10 &&
              /^\d+$/.test(this.phoneModel)
            ) ||
            (
              !this.phoneModel &&
              this.mobileModel &&
              this.mobileModel.length === 10 &&
              /^\d+$/.test(this.mobileModel)
            )
          )
        )
        && this.protypeNgmodel) {
        this.oneditbtn6 = false;
        var model: any = {
          employeeid: this.EmployeeId,
          name: this.FinName,
          pan: this.panNgModel,
          phone: this.phoneModel,
          mobile: this.mobileModel,
          propertyid: this.protypeNgmodel.ID,
          ID: this.finrelempid
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `eah/UpdateMaterialFinRel`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.FinName = null;
            this.protypeNgmodel = null;
            this.panNgModel = null;
            this.phoneModel = null;
            this.mobileModel = null;
            this.onadd6 = true;
            this.materialdetails = false;
            this.getMaterialFinRel(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })

      }
      else {
        // this.panNgModel.markAsDirty();
        // this.phoneModel.markAsDirty();
        // this.mobileModel.markAsDirty();
        alert("Pleasae fillup required Detail")
      }

    }
  }

  deleteFinRel(FinRel: any) {
    // console.log("product", FinRel);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: FinRel.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteMaterialFinRel';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getMaterialFinRel(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  FinRelReset() {
    this.FinName = null;
    this.panNgModel = null;
    this.phoneModel = null;
    this.mobileModel = null;
    this.protypeNgmodel = null;
  }



  //////////////////////////////////////////////////////////////////// 10% stake details ///////////////////////////////////////////////////////////////
  addAdditionalStake() {
    this.additionalStake = true;
  }

  getJDConcernDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/combineDataforConcern/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Concerns = Result;
        this.JDConcernData = Result;
        this.ConcernDetailtid = Result;
        this.saveJDConcernDataData(this.ConcernDetailtid)
        this.getConcernDetails(EmployeeId)
        // console.log("getJDConcernDetails", this.Concerns);
        // console.log("getJDConcernDetails", this.ConcernDetailtid);
      }
    });
  }

  getalltypeConcern() {
    // debugger;
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllTypeConcern').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.concernid = Result;
        // console.log("getAlltypeConcern", this.concernid)
      }
    });
  }

  getDematDropdown(EmployeeId: any) {
    var apiUrl = `eah/GetDemat/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.demaid = Result;
        // console.log("getDematDropdown", this.demaid)
      }
    });
  }

  handleNext5Click() {

    var model: any = {
      employeeId: this.EmployeeId,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrlSave = 'eah/handlenext4click';
    this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        const JDConcernData = this.JDConcernData;
        this.saveJDConcernDataData(JDConcernData);
        const JDAllDematData = this.JDAllDematData;
        this.saveJDAllDematData(JDAllDematData);
        this.activeIndex1 = 5;
        this.getEAHSpouse(this.EmployeeId);
        this.getallEdu(this.EmployeeId);
        this.getPastEmp(this.EmployeeId);
        this.getContact(this.EmployeeId);
        // this.getBEntity(this.EmployeeId);
        // this.getSelfOther(this.EmployeeId);
        this.getAllData(this.EmployeeId);
        this.getSelfDemat(this.EmployeeId);
        // this.getDependentDemat(this.EmployeeId);
        // this.getDependentOther(this.EmployeeId);
        // this.getDeptBaseEntity(this.EmployeeId);
        this.getDeptDetails(this.EmployeeId);
        this.getDematDropdown(this.EmployeeId);
        this.getMaterialFinRel(this.EmployeeId);
        // this.getStackBaseEntity(this.EmployeeId);
        // this.getStackDemat(this.EmployeeId);
        // this.getStackOther(this.EmployeeId);
        this.getConcernDetails(this.EmployeeId);
        this.getAllDemat(this.EmployeeId);
        this.getPhysicalShareDetails(this.EmployeeId);
        this.getallbusiness();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    });
  }

  saveJDConcernDataData(JDConcernData: any[]) {
    const processedData = new Set();
    const commonDetailsMap = new Map(); // Store saved common details
    const observables = JDConcernData.map((eduItem: any) => {
      // Create an array to hold all observables for dp, entity, and trading
      const dpEntityTradingObservables = [];

      // Define the employeeId for this iteration
      const employeeId = this.EmployeeId;

      // Define common details model
      const commonModel: any = {
        employeeId: employeeId,
        contype: eduItem.CONCERN_TYPE,
        pan: eduItem.PAN_NO,
        relid: eduItem.TYPE_OF_CONCERN,
        relname: eduItem.NAME_OF_CONCERN,
        othername: eduItem.CONCERN_OTHER_NAME,
      };


      // Check if common details are already saved for this eduItem
      let commonObservable: Observable<any>;
      const commonDataKey = `${employeeId}-${eduItem.TYPE_OF_CONCERN}`;
      if (commonDetailsMap.has(commonDataKey)) {
        commonObservable = of(commonDetailsMap.get(commonDataKey));
      } else {
        commonObservable = this.rest.create(this.Global.getapiendpoint() + 'eah/SaveSTACKCommonDetails', commonModel).pipe(
          catchError((error) => {
            // Handle duplicate data error
            console.error(`Error saving Common Details: ${error}`);
            return of({ Success: false, Message: 'Duplicate Common Details or Error occurred', Data: null });
          })
        );
      }


      // Save DP_ACCOUNT_NUMBERS
      const dpAccountNumbers = eduItem.DP_ACCOUNT.split(',');
      dpAccountNumbers.forEach((dpAccount) => {
        const dpParts = dpAccount.trim().split('-');
        const dp = dpParts[0];
        const dpNumber = dpParts[1];

        // Create observables for saving the records
        const dpApiUrl = 'eah/SaveSTACKDpAccountDetails';

        const dpModel: any = {
          employeeId: employeeId,
          relid: eduItem.TYPE_OF_CONCERN,
          dp: dp,
          dpNumber: dpNumber,
          concerName: eduItem.NAME_OF_CONCERN,

        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.TYPE_OF_CONCERN}-${dp}-${dpNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + dpApiUrl, dpModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving DP Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate DP Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            forkJoin([dpObservable, commonObservable])
            // forkJoin([dpObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });

      // Save ENTITY_ACCOUNT_NUMBERS
      const entityAccountNumbers = eduItem.ENTITY_CODE_10PERCENT.split(',');
      entityAccountNumbers.forEach((entityAccount) => {
        const entityParts = entityAccount.trim().split('-');
        const entity = entityParts[0];
        const entityNumber = entityParts[1];

        // Create observables for saving the records
        const entityApiUrl = 'eah/SaveSTACKEntityAccountDetails';

        const entityModel: any = {
          employeeId: employeeId,
          relid: eduItem.TYPE_OF_CONCERN,
          entity: entity,
          entityNumber: entityNumber,
          concerName: eduItem.NAME_OF_CONCERN,
        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.TYPE_OF_CONCERN}-${entity}-${entityNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + entityApiUrl, entityModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving ENTITY Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate ENTITY Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            // forkJoin([dpObservable, commonObservable])
            forkJoin([dpObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });

      // Save TRADING_ACCOUNT_NUMBERS
      const tradingAccountNumbers = eduItem.TRADING_CODE_10PERCENT.split(',');
      tradingAccountNumbers.forEach((tradingAccount) => {
        const tradingParts = tradingAccount.trim().split('-');
        const trading = tradingParts[0];
        const tradingNumber = tradingParts[1];

        // Create observables for saving the records
        const tradingApiUrl = 'eah/SaveSTACKTradingAccountDetails';


        const tradingModel: any = {
          employeeId: employeeId,
          relid: eduItem.TYPE_OF_CONCERN,
          trading: trading,
          tradingNumber: tradingNumber,
          concerName: eduItem.NAME_OF_CONCERN,
        };

        // Create a unique dataKey based on employeeId, RELATIONSHIP, dp, and dpNumber
        const dataKey = `${employeeId}-${eduItem.TYPE_OF_CONCERN}-${trading}-${tradingNumber}`;

        // Check if the data has already been processed, if so, skip it
        if (!processedData.has(dataKey)) {
          const dpObservable = this.rest.create(this.Global.getapiendpoint() + tradingApiUrl, tradingModel).pipe(
            catchError((error) => {
              // Handle duplicate data error
              console.error(`Error saving DP Account: ${error}`);
              return of({ Success: false, Message: 'Duplicate DP Account or Error occurred', Data: null });
            })
          );

          // Push all observables into dpEntityTradingObservables
          dpEntityTradingObservables.push(
            // forkJoin([dpObservable, commonObservable])
            forkJoin([dpObservable])
          );

          // Add the data to the set of processed data
          processedData.add(dataKey);
        }
      });

      // ...

      // Use forkJoin to run all observables for dp, entity, and trading details in parallel
      return forkJoin(dpEntityTradingObservables);
    });

    // Use forkJoin to run all observables in parallel for each educational item
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses (DP, Entity, and Trading)", responses);

        // Assuming you want to show a success message when all records are saved successfully
        const successResponses = responses.filter((response) => response.every((res) => res.Success));
        if (successResponses.length === responses.length) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Some records could not be saved' });
        }
      },
      (error: any) => {
        // Handle errors
        console.error("Error (DP, Entity, and Trading)", error);

        // Display an error message for any errors that occur during record creation
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );
  }

  //Stack Entity Save
  // getStackBaseEntity(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetStackBEntityDetails/${EmployeeId}/${id}/${name}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.StackEntOthers = data.Data;
  //       this.StackBaseEntid = data.Data;
  //       console.log("getStackBaseEntity", this.StackEntOthers);
  //       console.log("getStackBaseEntity", this.StackBaseEntid);
  //     }
  //   });
  // }

  // addStackEntity1Other() {
  //   debugger;
  //   if (this.activeIndex1 === 4) {
  //     if (this.SatckEBL && this.conrNgmodel) {

  //       const checkDuplicateRequestBody = {
  //         employeeId: this.EmployeeId,
  //         tradingCode: this.SatckEBL,
  //         employeeConcernId: this.conrNgmodel.ID,
  //       };

  //       this.rest.postParams(this.Global.getapiendpoint() + 'eah/checkduplicateStackEntityInfo', checkDuplicateRequestBody)
  //         .subscribe((duplicateData: any) => {
  //           if (duplicateData.isDuplicate) {
  //             // Handle duplicate case
  //             alert(`${duplicateData.Message}`);
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: duplicateData.Message });
  //           } else {
  //             // Proceed to addStackOther if no duplicate
  //             var model: any = {
  //               employeeid: this.EmployeeId,
  //               tradecode: this.SatckEBL,
  //               entityid: this.ent1Ngmodel.ID,
  //               entname: this.ent1Ngmodel.ENTITY_NAME,
  //               Ctype: this.conrNgmodel.ID,
  //               reid: this.reopenid1,
  //               concerName: this.concernName
  //             };
  //             console.log("model", model);

  //             this.rest.create(this.Global.getapiendpoint() + 'eah/SaveStackEntityInfo', model)
  //               .subscribe((addStackOtherData: any) => {
  //                 if (addStackOtherData.Success) {
  //                   // Clear fields and update data
  //                   this.ent1Ngmodel = null;
  //                   this.SatckEBL = null;
  //                   // this.getStackBaseEntity(addStackOtherData.Data.EMPLOYEE_ID);
  //                   this.getStackBaseEntity(addStackOtherData.Data.EMPLOYEE_ID, addStackOtherData.Data.EMPLOYEE_CONCERN_ID, addStackOtherData.Data.CONCERN_NAME);
  //                   this.messageService.add({ severity: 'success', summary: 'Success', detail: addStackOtherData.Message });
  //                 } else {
  //                   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: addStackOtherData.Message });
  //                 }
  //               });
  //           }
  //         });
  //     } else {
  //       alert('Please select Concern Type');
  //     }
  //   }
  // }

  // deleteStackEntOther(StackEntOther: any) {
  //   console.log("product", StackEntOther);
  //   var model: any =
  //   {
  //     ID: StackEntOther.ID,
  //   }

  //   var apiUrl = '';
  //   apiUrl = 'eah/DeleteStackBaseEntById';

  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //     if (data.Success) {
  //       // this.getStackBaseEntity(this.EmployeeId);
  //       this.getStackBaseEntity(this.EmployeeId, StackEntOther.EMPLOYEE_CONCERN_ID, StackEntOther.CONCERN_NAME);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

  //     }
  //     else {
  //       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //     }
  //   })
  // }

  //Other Account
  // getStackOther(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `eah/GetStackOther/${EmployeeId}/${id}/${name}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.StackOthers = data.Data;
  //       this.stackothermstid = data.Data;
  //       console.log("getStackOther", this.StackOthers);
  //       console.log("getStackOther", this.stackothermstid);
  //     }
  //   });
  // }


  //Demat Account
  changeStackEBL() {
    this.rdoSatckDPOther = false;
    this.showEntDropdown2 = true;
    this.StackDPType = '';
    this.showOtherTextbox2 = false;
    this.stOtNgmodel = '';
  }

  changeStackOther() {
    this.rdoSatckDPEBL = false;
    this.showOtherTextbox2 = true;
    this.StackDPType = 'Other';
    this.allentNgmodel = '';
    this.showEntDropdown2 = false;
  }

  getStackDemat(EmployeeId: any, id: any, name: any) {
    var apiUrl = '';
    apiUrl = `eah/GetStackDemat/${EmployeeId}/${id}/${name}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.StackDPs = Result;
        this.StackDematmstid = Result;
        // console.log("getSatckDP", this.StackDPs);
        // console.log("getSatckDP", this.StackDematmstid);
      }
    });
  }

  addStackDPDetails() {
    // debugger;
    if (this.activeIndex1 === 4) {
      if (this.demmodel && this.conrNgmodel && (this.allentNgmodel || this.stOtNgmodel)) {

        const checkDuplicateRequestBody = {
          employeeId: this.EmployeeId,
          dpAccount: this.demmodel.dematnumber,
          employeeConcernId: this.conrNgmodel.ID,
          dpBrokerName: this.allentNgmodel.ENTITY_NAME || this.stOtNgmodel
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateRequestBody));

        this.rest.postParams(this.Global.getapiendpoint() + 'eah/checkduplicateStkDp', { encryptmodel: encryptmodel })
          .subscribe((duplicateData: any) => {
            if (duplicateData.isDuplicate) {
              // Handle duplicate case
              alert(`${duplicateData.Message}`);
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: duplicateData.Message });
            } else {

              var model: any = {
                employeeid: this.EmployeeId,
                brokerName: this.allentNgmodel.ENTITY_NAME || this.stOtNgmodel,
                tradecode: this.demmodel.dematnumber,
                type: this.StackDPType || this.allentNgmodel.ENTITY_NAME,
                Ctype: this.conrNgmodel.ID,
                reid: this.reopenid1,
                concerName: this.concernName
              };
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
              // console.log("model", model);

              this.rest.create(this.Global.getapiendpoint() + 'eah/SaveStackDemat', { encryptmodel: encryptmodel })
                .subscribe((addStackDPDetailsData: any) => {
                  if (addStackDPDetailsData.Success) {
                    var Result = JSON.parse(this.Global.decrypt1(addStackDPDetailsData.Data));
                    this.demmodel = null;
                    this.rdoSatckDPEBL = false;
                    this.rdoSatckDPESL = false;
                    this.rdoSatckDPOther = false;
                    this.stOtNgmodel = null;
                    this.showOtherTextbox2 = false;
                    this.allentNgmodel = null;
                    this.showEntDropdown2 = false;
                    // this.getStackDemat(addStackDPDetailsData.Data.EMPLOYEE_ID);
                    this.getStackDemat(Result.EMPLOYEE_ID, Result.EMPLOYEE_CONCERN_ID, Result.CONCERN_NAME);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: addStackDPDetailsData.Message });
                  } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: addStackDPDetailsData.Message });
                  }
                });
            }
          });
      } else {
        alert('Please fill in all required fields: DP Name,DP ID,Type Of Concern.');
      }
    }
  }

  deleteStackDP(StackDP: any) {
    // console.log("product", StackDP);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: StackDP.ID,
        table_name: StackDP.table_name
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteStackDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          // this.getStackDemat(this.EmployeeId);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getStackDemat(this.EmployeeId, StackDP.EMPLOYEE_CONCERN_ID, StackDP.CONCERN_NAME);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  //PAN
  changeStackNotApplicable() {
    this.stackNotApplied = false;
    this.stackPanNgmodel = false;
    this.SatckPanNo = '';
    this.isSatckPanDisable = true;
    this.StackPan = 'NotApplicable';
  }

  changeStackNotApplied() {
    this.stackNotApplicable = false;
    this.stackPanNgmodel = false;
    this.SatckPanNo = '';
    this.isSatckPanDisable = true;
    this.StackPan = 'NotApplied';
  }

  changetackstackPan() {
    this.stackNotApplicable = false;
    this.stackNotApplied = false;
    this.isSatckPanDisable = false;
    this.StackPan = '';
  }

  onDropdownConcernChange() {
    this.concernSelected = !!this.conrNgmodel;
    this.showOtherConcernInput = this.conrNgmodel.NAME === 'Others';
    if (this.showOtherConcernInput) {
      this.ConcernTypeOther = ''; // Clear the "Other" input field
    }
    if (this.concernSelected) {
      this.getSTKBrokerAllData(this.EmployeeId, this.conrNgmodel.ID, this.concernName);
      this.getStackDemat(this.EmployeeId, this.conrNgmodel.ID, this.concernName);
    }
  }

  //click event on addconcern button
  AddConcerSatckDetails() {
    if (this.activeIndex1 === 4) {
      if (this.concernName && this.conrNgmodel && (this.stackNotApplicable || this.stackNotApplied || (this.stackPanNgmodel && this.SatckPanNo && this.SatckPanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.SatckPanNo)))) {
        this.oneditbtn5 = false;
        if (this.conrNgmodel.NAME === 'Others') {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            CTypeName: this.conrNgmodel.NAME,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.ConcernTypeOther
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            CTypeName: this.conrNgmodel.NAME,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.conrNgmodel.NAME
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `eah/SaveAddConcernDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.concernSelected = false;
            this.concernName = null;
            this.conrNgmodel = null;
            this.SatckEBL = null;
            this.SatckESL = null;
            this.stackNotApplicable = false;
            this.stackNotApplied = false;
            this.stackPanNgmodel = false;
            this.SatckPanNo = null;
            this.isSatckPanDisable = true;
            this.additionalStake = false;
            this.ConcernTypeOther = null;
            this.showOtherConcernInput = false;
            this.getConcernDetails(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
      else {
        // this.SatckPanNo.markAsDirty();
        alert('Please fill in all required details.');

      }

    }
  }

  getConcernDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/combineDataforConcern/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.length > 0 || Result.stakdata == true) {
          this.Concerns = Result.data;
          this.ConcernDetailtid = Result.data;
          // console.log("ConcernDetails", this.Concerns);
          // console.log("ConcernDetails", this.ConcernDetailtid);
        } else {
          this.getJDConcernDetails(EmployeeId);
        }
      }
    });
  }

  oneditConcer(Concern: any) {
    // console.log("concern on edit", Concern);
    if (this.activeIndex1 === 4) {
      this.additionalStake = true;
      this.concernSelected = true;
      this.oneditbtn5 = true;
      this.onadd5 = false;
      this.concernName = Concern.NAME_OF_CONCERN;
      this.conrNgmodel = { "ID": Concern.EMPLOYEE_CONCERN_ID, "NAME": Concern.CONCERN_TYPE };
      if (this.conrNgmodel.NAME === "Others") {
        this.showOtherConcernInput = true;
        this.ConcernTypeOther = Concern.CONCERN_OTHER_NAME;
      }
      if (Concern.PAN_NO === "NotApplicable") {
        this.stackNotApplicable = true;
        this.stackNotApplied = false;
        this.stackPanNgmodel = false;
      } else if (Concern.PAN_NO === 'NotApplied') {
        this.stackNotApplied = true;
        this.stackNotApplicable = false;
        this.stackPanNgmodel = false;
      } else {
        this.stackPanNgmodel = true;
        this.stackNotApplicable = false;
        this.stackNotApplied = false;
        this.SatckPanNo = Concern.PAN_NO;
      }
      this.pastempid = Concern.ID;
      this.getStackDemat(this.EmployeeId, Concern.EMPLOYEE_CONCERN_ID, Concern.NAME_OF_CONCERN);
      this.getSTKBrokerAllData(this.EmployeeId, Concern.EMPLOYEE_CONCERN_ID, Concern.NAME_OF_CONCERN);
    }
  }

  updateConcern() {
    if (this.activeIndex1 === 4) {
      if (this.concernName && this.conrNgmodel && (this.stackNotApplicable || this.stackNotApplied || (this.stackPanNgmodel && this.SatckPanNo && this.SatckPanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.SatckPanNo)))) {
        this.oneditbtn5 = false;
        if (this.conrNgmodel.NAME === 'Others') {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            CTypeName: this.conrNgmodel.NAME,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.ConcernTypeOther,
            ID: this.pastempid
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            CTypeName: this.conrNgmodel.NAME,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.conrNgmodel.NAME,
            ID: this.pastempid
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `eah/UpdateAddConcernDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.concernName = null;
            this.conrNgmodel = null;
            this.SatckEBL = null;
            this.SatckESL = null;
            this.stackNotApplicable = false;
            this.stackNotApplied = false;
            this.stackPanNgmodel = false;
            this.SatckPanNo = null;
            this.isSatckPanDisable = true;
            this.ConcernTypeOther = null;
            this.showOtherConcernInput = false;
            this.additionalStake = false;
            this.onadd5 = true;
            this.concernSelected = false;
            this.getConcernDetails(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
      else {
        // this.SatckPanNo.markAsDirty();
        alert('Please fill in all required details.');

      }

    }
  }

  deleteConcern(Concern: any) {
    // console.log("product", Concern);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: Concern.ID,
        RELATIONSHIP: Concern.EMPLOYEE_CONCERN_ID,
        TRADING_ACCOUNT_NUMBERS: Concern.TRADING_CODE_10PERCENT,
        DP_ACCOUNT_NUMBERS: Concern.DP_ACCOUNT,
        REL_OTHER_NAME: Concern.NAME_OF_CONCERN,
        EMPLOYEE_ID: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteConcern';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getConcernDetails(this.EmployeeId);
          // this.getStackBaseEntity(this.EmployeeId);
          // this.getStackDemat(this.EmployeeId);
          // this.getStackOther(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }

  }

  //reset
  resetStack() {
    this.concernName = null;
    this.conrNgmodel = null;
    this.showEntDropdown2 = false;
    this.SatckEBL = null;
    this.SatckESL = null;
    this.stackNotApplicable = false;
    this.stackNotApplied = false;
    this.stackPanNgmodel = false;
    this.SatckPanNo = null;
    this.demmodel = null;
    this.rdoSatckDPEBL = false;
    this.rdoSatckDPESL = false;
    this.rdoSatckDPOther = false;
    this.stOtNgmodel = null;
    this.showOtherTextbox2 = false;
    this.SatckBRName = null;
    this.ConcernTypeOther = null;
    this.showOtherConcernInput = false;
    this.SatckTradeCode = null;
    this.isSatckPanDisable = true;
    this.concernSelected = false;
    this.oneditbtn5 = false;
    this.onadd5 = true;
    this.rdoSTKBroker = false;
    this.rdoSTKBrokerOther = false;
    this.showEntDropdown6 = false;
    this.showOtherTextbox5 = false;
  }

  StackPrevBtn() {
    if (this.employeeData.DSIGNATED === true) {
      this.activeIndex1 = 3;
    } else {
      this.activeIndex1 = 2;
    }
  }

  //new Broker
  changeStackBroker() {
    this.rdoSTKBrokerOther = false;
    this.showEntDropdown6 = true;
    this.showOtherTextbox5 = false;
    this.SatckEBL = '';
  }
  changeStackBrokerOther() {
    this.rdoSTKBroker = false;
    this.showOtherTextbox5 = true;
    this.showEntDropdown6 = false;
    this.ent1Ngmodel = '';
  }
  getJDSTKBrokerAllData(EmployeeId: any, id: any, name: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetStackBEntityDetails/${EmployeeId}/${id}/${name}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetStackOther/${EmployeeId}/${id}/${name}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME_10PERCENT: item.ENTITY_NAME_10PERCENT, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        this.StackOthers = combinedData; // Assign the combined data to your grid's data source
        // console.log("DPBroker Combined Data", this.StackOthers);
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }
  getSTKBrokerAllData(EmployeeId: any, id: any, name: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetStackBEntityDetails/${EmployeeId}/${id}/${name}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `eah/GetStackOther/${EmployeeId}/${id}/${name}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
          // Map the grey list data and add a 'source' column with the value 'Entity List'
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          const greyListDataWithSource = Result.map(item => ({ BROKER_NAME_10PERCENT: item.ENTITY_NAME_10PERCENT, source: 'Entity List', ...item }));
          combinedData.push(...greyListDataWithSource);
        }

        if (restrictedData.Success) {
          // Map the restricted list data and add a 'source' column with the value 'Other List'
          var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
          const restrictedDataWithSource = Result.map(item => ({ source: 'Other List', ...item }));
          combinedData.push(...restrictedDataWithSource);
        }

        if (combinedData.length > 0) {
          this.StackOthers = combinedData; // Assign the combined data to your grid's data source
          // console.log("DPBroker Combined Data", this.StackOthers);
        } else {
          this.getJDSTKBrokerAllData(EmployeeId, id, name);
        }
      },
      error => {
        // Handle any errors that may occur during the API calls
        console.error("Error:", error);
      }
    );
  }
  addStackOther() {
    if (this.activeIndex1 === 4) {
      const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
      if (this.ent1Ngmodel != null) {
        if (entityNames.includes(this.ent1Ngmodel.ENTITY_NAME)) {
          if (this.SatckTradeCode && this.ent1Ngmodel && this.conrNgmodel) {

            const checkDuplicateRequestBody = {
              employeeId: this.EmployeeId,
              tradingCode: this.SatckTradeCode,
              employeeConcernId: this.conrNgmodel.ID,
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateRequestBody));

            this.rest.postParams(this.Global.getapiendpoint() + 'eah/checkduplicateStackEntityInfo', { encryptmodel: encryptmodel })
              .subscribe((duplicateData: any) => {
                if (duplicateData.isDuplicate) {
                  // Handle duplicate case
                  alert(`${duplicateData.Message}`);
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: duplicateData.Message });
                } else {
                  // Proceed to addStackOther if no duplicate
                  var model: any = {
                    employeeid: this.EmployeeId,
                    tradecode: this.SatckTradeCode,
                    entityid: this.ent1Ngmodel.ID,
                    entname: this.ent1Ngmodel.ENTITY_NAME,
                    Ctype: this.conrNgmodel.ID,
                    reid: this.reopenid1,
                    concerName: this.concernName
                  };
                  let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                  // console.log("model", model);

                  this.rest.create(this.Global.getapiendpoint() + 'eah/SaveStackEntityInfo', { encryptmodel: encryptmodel })
                    .subscribe((addStackOtherData: any) => {
                      if (addStackOtherData.Success) {
                        // Clear fields and update data
                        var Result = JSON.parse(this.Global.decrypt1(addStackOtherData.Data));
                        this.ent1Ngmodel = null;
                        this.SatckTradeCode = null;
                        this.showEntDropdown6 = false;
                        this.rdoSTKBroker = false;
                        this.getSTKBrokerAllData(Result.EMPLOYEE_ID, Result.EMPLOYEE_CONCERN_ID, Result.CONCERN_NAME);
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: addStackOtherData.Message });
                      } else {
                        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: addStackOtherData.Message });
                      }
                    });
                }
              });
          } else {
            alert('Please fill in all required fields: Broker Name,UCC/PMS Code,Type Of Concern.');
          }
        } else {
          if (this.SatckEBL && this.SatckTradeCode && this.conrNgmodel) {

            const checkDuplicateRequestBody = {
              employeeId: this.EmployeeId,
              tradingCode: this.SatckTradeCode,
              employeeConcernId: this.conrNgmodel.ID,
              brokerName: this.SatckEBL
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateRequestBody));

            this.rest.postParams(this.Global.getapiendpoint() + 'eah/checkduplicateStackOther', { encryptmodel: encryptmodel })
              .subscribe((duplicateData: any) => {
                if (duplicateData.isDuplicate) {
                  // Handle duplicate case
                  alert(`${duplicateData.Message}`);
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: duplicateData.Message });
                } else {
                  // Proceed to addStackOther if no duplicate
                  var model: any = {
                    employeeid: this.EmployeeId,
                    brokerName: this.SatckEBL,
                    tradecode: this.SatckTradeCode,
                    Ctype: this.conrNgmodel.ID,
                    reid: this.reopenid1,
                    concerName: this.concernName
                  };
                  let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                  // console.log("model", model);

                  this.rest.create(this.Global.getapiendpoint() + 'eah/SaveStackOther', { encryptmodel: encryptmodel })
                    .subscribe((addStackOtherData: any) => {
                      if (addStackOtherData.Success) {
                        // Clear fields and update data
                        var Result = JSON.parse(this.Global.decrypt1(addStackOtherData.Data));
                        this.SatckEBL = null;
                        this.SatckTradeCode = null;
                        this.showOtherTextbox5 = false;
                        this.rdoSTKBrokerOther = false;
                        this.getSTKBrokerAllData(Result.EMPLOYEE_ID, Result.EMPLOYEE_CONCERN_ID, Result.CONCERN_NAME);
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: addStackOtherData.Message });
                      } else {
                        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: addStackOtherData.Message });
                      }
                    });
                }
              });
          } else {
            alert('Please fill in all required fields: Broker Name,UCC/PMS Code,Type Of Concern.');
          }
        }
      } else {
        alert('Please fill in all required fields: Broker Name,UCC/PMS Code,Type Of Concern.');
      }
    }
  }
  deleteStackOther(StackOther: any) {
    // console.log("product", StackOther);
    if (StackOther.source === 'Entity List') {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: StackOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteStackBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getSTKBrokerAllData(this.EmployeeId, StackOther.EMPLOYEE_CONCERN_ID, StackOther.CONCERN_NAME);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    } else {
      const confirmed = window.confirm('Are you sure you want to delete?');

      if (confirmed) {
        var model: any =
        {
          ID: StackOther.ID,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'eah/DeleteStackOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getSTKBrokerAllData(this.EmployeeId, StackOther.EMPLOYEE_CONCERN_ID, StackOther.CONCERN_NAME);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {

      }
    }
  }



  ////////////////////////////////////////   Security Holding details ///////////////////////////////////////////////////////////////////////
  getJDAllDemat(EmployeeId: any) {
    var model: any = {
      name: this.LoggedInUser1.FIRSTNAME,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = `joindesc/AllDP/${EmployeeId}`;
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allDPs = Result;
        this.JDAllDematData = Result;
        this.alldid = Result;
        // console.log("getJDAllDemat", this.allDPs);
      }
    });
  }

  getJDPhysicalShareDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetPhysicalHolding/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.PSHolds = Result;
        this.physicalShareHoldingData = Result;
        this.PSHolds = Result.map((entry: any) => ({
          ...entry,
          name: 'Physical Share Holdings'
        }));
        // console.log("getJDPhysicalShareDetails", this.PSHolds);
      }
    });
  }

  getAllDemat(EmployeeId: any) {
    var model: any = {
      name: this.LoggedInUser1.FIRSTNAME,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = `eah/AllDP/${EmployeeId}`;
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.length > 0) {
          this.allDPs = Result;
          this.alldid = Result;
          // console.log("getAllDemat", this.allDPs);
        }
        else {
          this.getJDAllDemat(EmployeeId);
        }
      }
    });
  }

  //Upload button
  // handleFileChange(event: Event, rowData: any): void {
  //   debugger;
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the file size is within the limit
  //     if (uploadedFile.size <= 5242880) {
  //       // Check if the file extension is allowed
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //       const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';
  //       rowData.status = 'Submitted';

  //       if (allowedExtensions.includes(`.${fileExtension}`)) {
  //         rowData.uploadedFile = uploadedFile.name;
  //         rowData.showFileName = false;
  //         rowData.status = 'Submitted';
  //         const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
  //         const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
  //         if (rowData.relation !== null && rowData.relation.toUpperCase() === 'SELF') {
  //           if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {

  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforSelf`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           } else {
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforSelf1`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           }
  //         } else if (rowData.relation !== null && validRelationships.includes(rowData.relation.toUpperCase())) {
  //           if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
  //             // (rowData.brokername.toUpperCase() !== "ENTITY1" && rowData.brokername.toUpperCase() !== "ENTITY2")
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount,
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforREL`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           } else {
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforREL1`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           }
  //         } else if (rowData.relation !== null && rowData.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(rowData.relation.toLowerCase())) {
  //           if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforSTK`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           } else {
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `eah/SaveUploadFilePathforSTK1`;
  //             this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //               if (data.Success) {
  //                 console.log("data", data);
  //                 rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //               }
  //               else {
  //                 this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //               }
  //             })

  //           }
  //         }
  //       } else {
  //         // Show an error message for disallowed file extension
  //         alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //       }
  //     } else {
  //       // Show an error message for exceeding file size limit
  //       alert('File size exceeds maximum limit 5 MB.');
  //     }
  //   }
  // }

  handleFileChange(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn(rowData)
    })

  }

  prepareFilesList(files: Array<any>, rowData) {
    return new Promise<void>((resolve, reject) => {
      // console.log("prepareFilesList");
      this.formData = new FormData();
      for (const item of files) {
        var extn = item.name.substr(item.name.lastIndexOf('.'), item.name.length).toLowerCase();
        let fileSize = item.size;
        if (!ValidFileExtensions.includes(extn)) {
          break;
        }
        // console.log("Document Size Should Be Less Than 1MB");
        this.fileArray.push(item);
        this.formData.append('files', item);
        // console.log("Formdata", this.formData)
        // console.log("fileArray", this.fileArray)
        let tableDetails: any = [];
        this.fileArray.forEach((element: any, index: any) => {
          tableDetails.push({ Index: index, Name: element.name })
        });

        // console.log("tableDetails", tableDetails)

        this.dataSourceRefferalsUploadFile = tableDetails;
        resolve(rowData)
      }
    })

  }

  SubmitBtn(rowData: any) {
    // this.filepresentCount = []
    // this.flag = 0

    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);

    let parsedData = JSON.parse(tabledata);
    rowData.uploadedFile = parsedData[0].Name;
    rowData.showFileName = false;
    rowData.status = 'Submitted';

    const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
    const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
    if (rowData.relation !== null && rowData.relation.toUpperCase() === 'SELF') {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          // f_path: formData,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        // console.log("File path saved to database:", model);

        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforSelf", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });

      } else {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        // console.log("File path saved to database:", model);
        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforSelf1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });

      }
    } else if (rowData.relation !== null && validRelationships.includes(rowData.relation.toUpperCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount,
        }
        // console.log("File path saved to database:", model);
        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforREL", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });


      } else {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        // console.log("File path saved to database:", model);
        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforREL1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });


      }
    } else if (rowData.relation !== null && rowData.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(rowData.relation.toLowerCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        // console.log("File path saved to database:", model);
        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforSTK", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });

      } else {
        var model: any = {
          // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
          Type: 'SecurityHoldingDetails',
          EmpId: this.employeeData.EMPNO,
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        // console.log("File path saved to database:", model);
        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveUploadFilePathforSTK1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            rowData.showFileName = data.Data[0].UPLOAD_PATH;
            this.getAllDemat(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert('file can not be uploaded..check the path..');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
            this.dataSourceRefferalsUploadFile = []
            this.fileArray = []
          }
        });

      }
    }
  }

  //authorize button
  onAuthorizeClick(rowData: any) {
    // debugger;
    this.alertRowData = rowData;
    this.showAlert = true;
  }

  onAlertAuthorizeClick() {
    const rowData = this.alertRowData;
    rowData.isAuthorized = true;
    const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];

    if (rowData.relation !== null && rowData.relation.toUpperCase() === 'SELF') {
      var model: any = {
        eid: this.EmployeeId,
        accnumber: rowData.dpaccount
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("File path saved to database:", model);

      var apiUrl = '';
      apiUrl = `eah/SaveAuthorizeforSelf`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.showAlert = false;
          this.getAllDemat(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else if (rowData.relation !== null && validRelationships.includes(rowData.relation.toUpperCase())) {
      var model: any = {
        eid: this.EmployeeId,
        accnumber: rowData.dpaccount
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("File path saved to database:", model);

      var apiUrl = '';
      apiUrl = `eah/SaveAuthorizeforREL`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.showAlert = false;
          this.getAllDemat(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else if (rowData.relation !== null && rowData.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(rowData.relation.toLowerCase())) {
      var model: any = {
        eid: this.EmployeeId,
        accnumber: rowData.dpaccount
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("File path saved to database:", model);

      var apiUrl = '';
      apiUrl = `eah/SaveAuthorizeforSTK`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.showAlert = false;
          this.getAllDemat(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }
  }

  onCloseClick() {
    this.showAlert = false; // Hide the alert
  }


  //button email later
  btnEmailLater_Click(rowData: any) {
    // debugger;
    rowData.isProvide = true;
    const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
    const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
    if (rowData.relation !== null && rowData.relation.toUpperCase() === 'SELF') {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("File path saved to database:", model);

        var apiUrl = '';
        apiUrl = `eah/SaveEmailLaterSelf`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getAllDemat(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    } else if (rowData.relation !== null && validRelationships.includes(rowData.relation.toUpperCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("File path saved to database:", model);

        var apiUrl = '';
        apiUrl = `eah/SaveEmailLaterREL`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getAllDemat(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    } else if (rowData.relation !== null && rowData.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(rowData.relation.toLowerCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
          eid: this.EmployeeId,
          accnumber: rowData.dpaccount
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("File path saved to database:", model);

        var apiUrl = '';
        apiUrl = `eah/SaveEmailLaterSTK`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getAllDemat(this.EmployeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    }
  }

  getPhysicalShareDetails(EmployeeId: any) {
    // debugger;
    var apiUrl = '';
    apiUrl = `eah/GetPhysicalHolding/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (Result.length > 0) {
          this.PSHolds = Result;
          this.PSHolds = Result.map((entry: any) => ({
            ...entry,
            name: 'Physical Share Holdings'
          }));
          // console.log("physicalholding", this.PSHolds);
        }
        else {
          this.getJDPhysicalShareDetails(EmployeeId);
        }
      }
    });
  }

  addRow() {
    this.PSHolds.push({ name: 'Physical Share Holdings', isMandatory: false, isRowAdded: true });
  }

  //upload Physical Share Holding
  // uploadFile(event: any, rowData: any): void {
  //   // debugger;
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the file size is within the limit
  //     if (uploadedFile.size <= 5242880) {
  //       // Check if the file extension is allowed
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //       const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //       if (allowedExtensions.includes(`.${fileExtension}`)) {
  //         rowData.uploadedFile = uploadedFile.name;
  //         rowData.showFileName = false;

  //         var model: any = {
  //           f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //           eid: this.EmployeeId,
  //         }
  //         console.log("File path saved to database:", model);

  //         var apiUrl = '';
  //         apiUrl = `eah/SavePhysicalShareUploadFile`;
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //         })
  //       } else {
  //         // Show an error message for disallowed file extension
  //         alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //       }
  //     } else {
  //       // Show an error message for exceeding file size limit
  //       alert('File size exceeds maximum limit 5 MB.');
  //     }
  //   }
  // }

  uploadFile(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn1(rowData)
    })

  }
  // SubmitBtn1(rowData: any) {
  //   debugger;
  //   this.dataSourceRefferalsUploadFile.forEach((element: any) => {
  //     this.formData.append('files', element.Name);
  //     console.log("this.formData", this.formData);

  //   });
  //   let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
  //   console.log("this.formData", tabledata);

  //   let parsedData = JSON.parse(tabledata);
  //   rowData.uploadedFile = parsedData[0].Name;
  //   rowData.showFileName = false;
  //   rowData.status = 'Submitted';

  //   var model: any = {
  //     // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //     Type: 'PhysicalShareHoldings',
  //     EmpId: this.employeeData.EMPNO,
  //     eid: this.EmployeeId,
  //   }
  //   console.log("File path saved to database:", model);

  //   for (var key in model) {
  //     this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
  //   }

  //   console.log("formData", this.formData);

  //   this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SavePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
  //     console.log("data success", data.Data);
  //     if (data.Success) {
  //       console.log("data", data);
  //       rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //       this.getPhysicalShareDetails(this.EmployeeId);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //     }
  //     else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
  //       this.dataSourceRefferalsUploadFile = []
  //       this.fileArray = []
  //     }
  //   });

  // }
  SubmitBtn1(rowData: any) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);

    let parsedData = JSON.parse(tabledata);
    rowData.uploadedFile = parsedData[0].Name;
    rowData.showFileName = false;
    rowData.status = 'Submitted';

    var model: any = {
      Type: 'PhysicalShareHoldings',
      EmpId: this.employeeData.EMPNO,
      eid: this.EmployeeId,
      accnumber: rowData.dpaccount,

    }
    // console.log("File path saved to database:", model);

    for (var key in model) {
      this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
    }

    // console.log("formData", this.formData);

    this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SavePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
      // console.log("data success", data.Data);
      if (data.Success) {
        // console.log("data", data);
        this.getPhysicalShareDetails(this.EmployeeId);
        alert(data.Message);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        rowData.showFileName = data.Data[0].UPLOAD_PATH;

      }
      else {
        alert('file can not be uploaded..check the path..');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
        this.dataSourceRefferalsUploadFile = []
        this.fileArray = []
      }
    });

  }

  // uploadFile1(event: any, rowData: any): void {
  //   // debugger;
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the file size is within the limit
  //     if (uploadedFile.size <= 5242880) {
  //       // Check if the file extension is allowed
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //       const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //       if (allowedExtensions.includes(`.${fileExtension}`)) {
  //         rowData.uploadedFile = uploadedFile.name;
  //         rowData.showFileName = false;

  //         var model: any = {
  //           f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //           eid: this.EmployeeId,
  //           ID: rowData.ID
  //         }
  //         console.log("File path saved to database:", model);

  //         var apiUrl = '';
  //         apiUrl = `eah/UpdatePhysicalShareUploadFile`;
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //         })
  //       } else {
  //         // Show an error message for disallowed file extension
  //         alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //       }
  //     } else {
  //       // Show an error message for exceeding file size limit
  //       alert('File size exceeds maximum limit 5 MB.');
  //     }
  //   }
  // }

  uploadFile1(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn2(rowData)
    })

  }
  // SubmitBtn2(rowData: any) {
  //   debugger;
  //   this.dataSourceRefferalsUploadFile.forEach((element: any) => {
  //     this.formData.append('files', element.Name);
  //     console.log("this.formData", this.formData);

  //   });
  //   let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
  //   console.log("this.formData", tabledata);

  //   let parsedData = JSON.parse(tabledata);
  //   rowData.uploadedFile = parsedData[0].Name;
  //   rowData.showFileName = false;
  //   rowData.status = 'Submitted';

  //   var model: any = {
  //     // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //     Type: 'PhysicalShareHoldings',
  //     EmpId: this.employeeData.EMPNO,
  //     eid: this.EmployeeId,
  //     ID: rowData.ID
  //   }
  //   console.log("File path saved to database:", model);

  //   for (var key in model) {
  //     this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
  //   }

  //   console.log("formData", this.formData);

  //   this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/UpdatePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
  //     console.log("data success", data.Data);
  //     if (data.Success) {
  //       console.log("data", data);
  //       // rowData.showFileName = data.Data[0].UPLOAD_PATH;        
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //       // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //       this.getPhysicalShareDetails(this.EmployeeId);        
  //     }
  //     else {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
  //       this.dataSourceRefferalsUploadFile = []
  //       this.fileArray = []
  //     }
  //     this.getPhysicalShareDetails(this.EmployeeId);
  //   });


  // }
  SubmitBtn2(rowData: any) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);

    let parsedData = JSON.parse(tabledata);
    rowData.uploadedFile = parsedData[0].Name;
    rowData.showFileName = false;
    rowData.status = 'Submitted';

    var model: any = {
      // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
      Type: 'PhysicalShareHoldings',
      EmpId: this.employeeData.EMPNO,
      eid: this.EmployeeId,
      accnumber: rowData.dpaccount,
      ID: rowData.ID,
    }
    // console.log("File path saved to database:", model);

    for (var key in model) {
      this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
    }

    // console.log("formData", this.formData);

    this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/UpdatePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
      // console.log("data success", data.Data);
      if (data.Success) {
        // console.log("data", data);
        this.getPhysicalShareDetails(this.EmployeeId);
        alert(data.Message);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        rowData.showFileName = data.Data[0].UPLOAD_PATH;

      }
      else {
        alert('file can not be uploaded..check the path..');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
        this.dataSourceRefferalsUploadFile = []
        this.fileArray = []
      }
    });

  }

  //delete Physical Share Holding
  deleteRow(rowData: any) {
    // debugger;
    // console.log("product", rowData);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: rowData.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeletePSHoldingById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getPhysicalShareDetails(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
          this.getallbusiness();

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  handleNext6Click(allDPs: any) {
    // debugger;
    if (this.activeIndex1 === 5) {
      if (allDPs.every(allDP => ((allDP.uploadedFile || allDP.uploadedfile) || (allDP.authorize === true || allDP.isAuthorized) || (allDP.isProvide || allDP.isprovide === true)))) {

        var model: any = {
          employeeId: this.EmployeeId,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrlSave = 'eah/handlenext5click';

        this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            const physicalShareHoldingData = this.physicalShareHoldingData;
            this.savePhysicalShareHoldingData(physicalShareHoldingData);
            this.getAllDemat(this.EmployeeId);
            this.activeIndex1 = 6;
            this.getEAHSpouse(this.EmployeeId);
            this.getallEdu(this.EmployeeId);
            this.getPastEmp(this.EmployeeId);
            this.getContact(this.EmployeeId);
            // this.getBEntity(this.EmployeeId);
            // this.getSelfOther(this.EmployeeId);
            this.getAllData(this.EmployeeId);
            this.getSelfDemat(this.EmployeeId);
            // this.getDependentDemat(this.EmployeeId);
            // this.getDependentOther(this.EmployeeId);
            // this.getDeptBaseEntity(this.EmployeeId);
            this.getDeptDetails(this.EmployeeId);
            this.getDematDropdown(this.EmployeeId);
            this.getMaterialFinRel(this.EmployeeId);
            // this.getStackBaseEntity(this.EmployeeId);
            // this.getStackDemat(this.EmployeeId);
            // this.getStackOther(this.EmployeeId);
            this.getConcernDetails(this.EmployeeId);
            this.getAllDemat(this.EmployeeId);
            this.getPhysicalShareDetails(this.EmployeeId);
            this.getClientDropdown(this.EmployeeId);
            this.getCommDetails(this.EmployeeId);
            this.getCommAnotherDetails(this.EmployeeId);
            this.getallbusiness();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });

      } else {
        this.activeIndex1 = 5;
        this.getAllDemat(this.EmployeeId);
        this.getPhysicalShareDetails(this.EmployeeId);
      }
    }

  }

  saveJDAllDematData(JDAllDematData: any[]) {
    const validRelationships = ['father', 'mother', 'spouse', 'son1', 'son2', 'daughter1', 'daughter2', 'son3', 'son4', 'son', 'daughter3', 'daughter4', 'daughter', 'brother', 'sister', 'other']
    const observables = JDAllDematData.map((item: any) => {
      const relation = item.relation.toLowerCase();
      let apiUrl = '';

      if (relation === 'self') {
        // Skip calling the API for "self" relationship
        return of(null); // Return an observable that immediately completes
      } else if (validRelationships.includes(relation)) {
        apiUrl = 'eah/saveJDPhySecurityHoldRelation';
      } else {
        apiUrl = 'eah/saveJDPhySecurityHoldOther';
      }

      const model: any = {
        eid: this.EmployeeId,
        f_path: item.uploadedfile,
        auth: item.authorize,
        broker: item.brokername,
        dpaccount: item.dpaccount,
        // Add other properties as needed
      };

      return this.rest.create(this.Global.getapiendpoint() + apiUrl, model);
    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Filter out null responses (skipped "self" relationships)
        const validResponses = responses.filter(response => response !== null);

        if (validResponses.length > 0) {
          // Assuming you want to show a success message when records are saved successfully
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Records saved successfully' });
        } else {
          // No valid records to save
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No valid records to save' });
        }
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );
  }

  savePhysicalShareHoldingData(physicalShareHoldingData: any[]) {
    const observables = physicalShareHoldingData.map((eduItem: any) => {
      const model: any = {
        eid: this.EmployeeId,
        f_path: eduItem.UPLOAD_PATH,
      };

      const apiUrl = 'eah/saveJDPhyShareHold';
      const saveRecord$ = this.rest.create(this.Global.getapiendpoint() + apiUrl, model);

      return saveRecord$;

    });

    // Use forkJoin to run all observables in parallel
    forkJoin(observables).subscribe(
      (responses: any[]) => {
        // Handle success
        // console.log("Responses", responses);

        // Assuming you want to show a success message when all records are saved successfully
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All records saved successfully' });
      },
      (error: any) => {
        // Handle errors
        console.error("Error", error);

        // Display an error message for duplicate records
        if (typeof error === 'string') {
          alert(error);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'An error occurred while saving records' });
        }
      }
    );
  }

  shouldDisplayUploadButton(brokername: string): boolean {
    const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);

    return entityNames.includes(brokername);
  }

  downloadFileEMP(data: any) {
    // console.log("downloadData", data);
    let filename;

    const uploadPathObject = data.uploadedfile;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // Splitting the path by 'Service' and keeping the last part
      const parts = fullPath.split('Service').slice(-1)[0];

      if (parts.length > 0) {
        filename = parts.trim();
      } else {
        // Handling if path manipulation failed
        // console.log('Path manipulation failed.');
      }
    } else {
      // Handle if uploadPathObject is not a string
    }

    const model = {
      filename: filename
    };
    // console.log("dwnlmodel", model);



    const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
    if (data.relation !== null && data.relation.toUpperCase() === 'SELF') {
      // window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP/'.concat(data.ID), '_blank');
      this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const filenameParts = filename.split('\\');
          const lastPart = filenameParts[filenameParts.length - 1];
          a.download = lastPart;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading the file', error);
        }
      );
    } else if (data.relation !== null && validRelationships.includes(data.relation.toUpperCase())) {
      // window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileREL/'.concat(data.ID), '_blank');
      this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const filenameParts = filename.split('\\');
          const lastPart = filenameParts[filenameParts.length - 1];
          a.download = lastPart;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading the file', error);
        }
      );
    } else if (data.relation !== null && data.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(data.relation.toLowerCase())) {
      // window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfilestk/'.concat(data.ID), '_blank');
      this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const filenameParts = filename.split('\\');
          const lastPart = filenameParts[filenameParts.length - 1];
          a.download = lastPart;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading the file', error);
        }
      );
    }
  }

  downloadFileREL(data: any) {
    // console.log("downloadPhysicalData", data);
    let filename;

    const uploadPathObject = data.UPLOAD_PATH;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // Splitting the path by 'Service' and keeping the last part
      const parts = fullPath.split('Service').slice(-1)[0];

      if (parts.length > 0) {
        filename = parts.trim();
      } else {
        // Handling if path manipulation failed
        // console.log('Path manipulation failed.');
      }
    } else {
      // Handle if uploadPathObject is not a string
    }

    const model = {
      filename: filename
    };
    // console.log("dwnlPhysicalmodel", model);

    this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filenameParts = filename.split('\\');
        const lastPart = filenameParts[filenameParts.length - 1];
        a.download = lastPart;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );

  }



  ////////////////////////////////////////   Commodities  ///////////////////////////////////////////////////////////////////////
  getClientDropdown(EmployeeId: any) {
    var model: any = {
      name: this.LoggedInUser1.FIRSTNAME,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = `eah/GetClientName/${EmployeeId}`;
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.clientid = Result;
        // console.log("getClientDropdown", this.clientid)
      }
    });
  }

  changeECComm() {
    this.otmodel = false;
    this.showEntDropdown5 = true;
    this.otextngmodel = '';
    this.isSDisable = false;
    this.showAuthBtn = true;
    this.showProvideBtn = false;
  }

  changeCommOther() {
    this.ecommodel = false;
    this.isSDisable = true;
    this.showEntDropdown5 = false;
    this.allentNgmodel = '';
    this.showAuthBtn = false;
    this.showProvideBtn = true;
  }

  // handleCommFileChange(event: Event, rowData: any): void {
  //   debugger;
  //   const inputElement = event.target as HTMLInputElement;

  //   // Check if a file is selected
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the selected client name is "Self"
  //     if (/\(Self\)/.test(this.clientmodel.name)) {
  //       // Prepare the data object with the selected file and other information from the footer
  //       const newData = {
  //         eid: this.EmployeeId,
  //         clientName: this.clientmodel.name,
  //         comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
  //         comtrackId: this.commidmodel,
  //         file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
  //         reid: this.reopenid1,
  //       };

  //       console.log("File path saved to database:", newData);

  //       var apiUrl = '';
  //       apiUrl = `eah/SaveCommUploadFileForSelf`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           this.clearFooterFields();
  //           this.showProvideBtn = false;
  //           this.showAuthBtn = true;
  //           this.getCommDetails(this.EmployeeId);
  //           this.getCommAnotherDetails(this.EmployeeId);
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     } else {
  //       const newData = {
  //         eid: this.EmployeeId,
  //         clientName: this.clientmodel.name,
  //         comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
  //         comtrackId: this.commidmodel,
  //         file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
  //         reid: this.reopenid1,
  //       };

  //       console.log("File path saved to database:", newData);

  //       var apiUrl = '';
  //       apiUrl = `eah/SaveCommUploadFileForRel`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           this.clearFooterFields();
  //           this.showProvideBtn = false;
  //           this.showAuthBtn = true;
  //           this.getCommDetails(this.EmployeeId);
  //           this.getCommAnotherDetails(this.EmployeeId);
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     }
  //   }
  // }
  handleCommFileChange(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);
    if (this.clientmodel && (this.allentNgmodel || this.otextngmodel) && this.commidmodel) {
      this.formData = new FormData();
      this.prepareFilesList(event.target.files, rowData).then((rowData) => {
        this.SubmitBtn3(rowData)
      })
    }
    else {
      alert('Please fill in required details:ClientName,Comtrade Partcipant Name,Comtrade Id.');
    }

  }
  SubmitBtn3(rowData: any) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);

    if (/\(Self\)/.test(this.clientmodel.name)) {
      // Prepare the data object with the selected file and other information from the footer
      const model = {
        Type: 'Commodity Details',
        EmpId: this.employeeData.EMPNO,
        eid: this.EmployeeId,
        clientName: this.clientmodel.name,
        comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
        comtrackId: this.commidmodel,
        // file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
        reid: this.reopenid1,
      };

      // console.log("File path saved to database:", model);
      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      // console.log("formData", this.formData);
      this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveCommUploadFileForSelf", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.clearFooterFields();
          this.showProvideBtn = false;
          this.showAuthBtn = true;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert('file can not be uploaded..check the path..');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
          this.dataSourceRefferalsUploadFile = []
          this.fileArray = []
        }
      });


      // var apiUrl = '';
      // apiUrl = `eah/SaveCommUploadFileForSelf`;
      // this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
      //   if (data.Success) {
      //     console.log("data", data);
      //     this.clearFooterFields();
      //     this.showProvideBtn = false;
      //     this.showAuthBtn = true;
      //     this.getCommDetails(this.EmployeeId);
      //     this.getCommAnotherDetails(this.EmployeeId);
      //     this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      //   }
      //   else {
      //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      //   }
      // })
    } else {
      const model = {
        Type: 'Commodity Details',
        EmpId: this.employeeData.EMPNO,
        eid: this.EmployeeId,
        clientName: this.clientmodel.name,
        comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
        comtrackId: this.commidmodel,
        // file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
        reid: this.reopenid1,
      };

      // console.log("File path saved to database:", model);

      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      // console.log("formData", this.formData);
      this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveCommUploadFileForRel", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.clearFooterFields();
          this.showProvideBtn = false;
          this.showAuthBtn = true;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert('file can not be uploaded..check the path..');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
          this.dataSourceRefferalsUploadFile = []
          this.fileArray = []
        }
      });


      // var apiUrl = '';
      // apiUrl = `eah/SaveCommUploadFileForRel`;
      // this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
      //   if (data.Success) {
      //     console.log("data", data);
      //     this.clearFooterFields();
      //     this.showProvideBtn = false;
      //     this.showAuthBtn = true;
      //     this.getCommDetails(this.EmployeeId);
      //     this.getCommAnotherDetails(this.EmployeeId);
      //     this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      //   }
      //   else {
      //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      //   }
      // })
    }

  }

  // uploadComm(event: Event, rowData: any) {
  //   debugger;
  //   const inputElement = event.target as HTMLInputElement;

  //   // Check if a file is selected
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the selected client name is "Self"
  //     if (/\(Self\)/.test(rowData.CLIENTNAME)) {
  //       // Prepare the data object with the selected file and other information from the footer
  //       const newData = {
  //         eid: rowData.EMPLOYEE_ID,
  //         clientName: rowData.CLIENTNAME,
  //         comtrackParticipantName: rowData.DP_BROKER_NAME,
  //         comtrackId: rowData.DP_ACCOUNT_NO,
  //         file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
  //         reid: this.reopenid1,
  //       };

  //       console.log("File path saved to database:", newData);

  //       var apiUrl = '';
  //       apiUrl = `eah/UpdateCommUploadFileForSelf`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           this.clearFooterFields();
  //           this.showProvideBtn = false;
  //           this.showAuthBtn = true;
  //           this.getCommDetails(this.EmployeeId);
  //           this.getCommAnotherDetails(this.EmployeeId);
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     } else {
  //       const newData = {
  //         eid: rowData.EMPLOYEE_ID,
  //         clientName: rowData.CLIENTNAME,
  //         comtrackParticipantName: rowData.DP_BROKER_NAME,
  //         comtrackId: rowData.DP_ACCOUNT_NO,
  //         file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
  //         reid: this.reopenid1,
  //       };

  //       console.log("File path saved to database:", newData);

  //       var apiUrl = '';
  //       apiUrl = `eah/UpdateCommUploadFileForRel`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, newData).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           this.clearFooterFields();
  //           this.showProvideBtn = false;
  //           this.showAuthBtn = true;
  //           this.getCommDetails(this.EmployeeId);
  //           this.getCommAnotherDetails(this.EmployeeId);
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     }
  //   }
  // }

  uploadComm(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn4(rowData)
    })

  }

  SubmitBtn4(rowData: any) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);

    if (/\(Self\)/.test(rowData.CLIENTNAME)) {
      // Prepare the data object with the selected file and other information from the footer
      const model = {
        Type: 'Commodity Details',
        EmpId: this.employeeData.EMPNO,
        eid: rowData.EMPLOYEE_ID,
        clientName: rowData.CLIENTNAME,
        comtrackParticipantName: rowData.DP_BROKER_NAME,
        comtrackId: rowData.DP_ACCOUNT_NO,
        // file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
        reid: this.reopenid1,
      };

      // console.log("File path saved to database:", model);
      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      // console.log("formData", this.formData);
      this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/UpdateCommUploadFileForSelf", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.clearFooterFields();
          this.showProvideBtn = false;
          this.showAuthBtn = true;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert('file can not be uploaded..check the path..');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
          this.dataSourceRefferalsUploadFile = []
          this.fileArray = []
        }
      });

    } else {
      const model = {
        Type: 'Commodity Details',
        EmpId: this.employeeData.EMPNO,
        eid: rowData.EMPLOYEE_ID,
        clientName: rowData.CLIENTNAME,
        comtrackParticipantName: rowData.DP_BROKER_NAME,
        comtrackId: rowData.DP_ACCOUNT_NO,
        // file: "~/UploadsFiles/Commodity/" + uploadedFile.name,
        reid: this.reopenid1,
      };
      // console.log("File path saved to database:", model);

      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      // console.log("formData", this.formData);
      this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/UpdateCommUploadFileForRel", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.clearFooterFields();
          this.showProvideBtn = false;
          this.showAuthBtn = true;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert('file can not be uploaded..check the path..');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
          this.dataSourceRefferalsUploadFile = []
          this.fileArray = []
        }
      });

    }

  }

  clearFooterFields(): void {
    this.clientmodel = null;
    this.ecommodel = false;
    this.allentNgmodel = null;
    this.otmodel = false;
    this.otextngmodel = '';
    this.commidmodel = '';
    this.showEntDropdown5 = false;
    this.isSDisable = false;
  }

  onCommAuthorizeClick(rowData: any) {
    if (this.clientmodel && (this.allentNgmodel || this.otextngmodel) && this.commidmodel) {
      this.showAlert1 = true;
    } else {
      alert('Please fill in required details:ClientName,Comtrade Partcipant Name,Comtrade Id.');
    }
  }

  onCommAlertAuthorizeClick() {
    if (/\(Self\)/.test(this.clientmodel.name)) {
      // Prepare the data object with the selected file and other information from the footer
      const newData = {
        eid: this.EmployeeId,
        clientName: this.clientmodel.name,
        comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
        comtrackId: this.commidmodel,
        reid: this.reopenid1,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(newData));

      // console.log("File path saved to database:", newData);

      var apiUrl = '';
      apiUrl = `eah/SaveCommAuthorizeSelf`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.clearFooterFields();
          this.showAlert1 = false;
          this.showProvideBtn = false;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.showAuthBtn = true;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert(data.Message);
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {
      const newData = {
        eid: this.EmployeeId,
        clientName: this.clientmodel.name,
        comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
        comtrackId: this.commidmodel,
        reid: this.reopenid1,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(newData));

      // console.log("File path saved to database:", newData);

      var apiUrl = '';
      apiUrl = `eah/SaveCommAuthorizeForRel`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.clearFooterFields();
          this.showProvideBtn = false;
          this.showAlert1 = false;
          this.showAuthBtn = true;
          this.showEntDropdown5 = false;
          this.isSDisable = false;
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          alert(data.Message);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          alert(data.Message);
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }
  }

  onCloseClick1() {
    this.showAlert1 = false; // Hide the alert
  }

  btnCommEmailLater_Click(rowData: any) {
    if (this.clientmodel && (this.allentNgmodel || this.otextngmodel) && this.commidmodel) {
      if (/\(Self\)/.test(this.clientmodel.name)) {
        // Prepare the data object with the selected file and other information from the footer
        const newData = {
          eid: this.EmployeeId,
          clientName: this.clientmodel.name,
          comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
          comtrackId: this.commidmodel,
          reid: this.reopenid1,
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(newData));

        // console.log("File path saved to database:", newData);

        var apiUrl = '';
        apiUrl = `eah/SaveCommProvLaterSelf`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.clearFooterFields();
            this.showProvideBtn = false;
            this.showAuthBtn = true;
            this.showEntDropdown5 = false;
            this.isSDisable = false;
            this.getCommDetails(this.EmployeeId);
            this.getCommAnotherDetails(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert(data.Message);
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      } else {
        const newData = {
          eid: this.EmployeeId,
          clientName: this.clientmodel.name,
          comtrackParticipantName: this.allentNgmodel.ENTITY_NAME || this.otextngmodel,
          comtrackId: this.commidmodel,
          reid: this.reopenid1,
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(newData));

        // console.log("File path saved to database:", newData);

        var apiUrl = '';
        apiUrl = `eah/SaveCommProvLaterForRel`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.clearFooterFields();
            this.showProvideBtn = false;
            this.showAuthBtn = true;
            this.showEntDropdown5 = false;
            this.isSDisable = false;
            this.getCommDetails(this.EmployeeId);
            this.getCommAnotherDetails(this.EmployeeId);
            alert(data.Message);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            alert(data.Message);
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    } else {
      alert('Please fill in required details:ClientName,Comtrade Partcipant Name,Comtrade Id.');
    }
  }

  getCommDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetCommDetails/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Commodities = Result;
        this.commid = Result;
        // console.log("getCommDetails", this.Commodities);
        // console.log("getCommDetails", this.commid);
      }
    });
  }

  deleteCommRow(Commoditie: any) {
    // console.log("product", Commoditie);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: Commoditie.ID,
        table_name: Commoditie.table_name,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eah/DeleteCommById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getCommDetails(this.EmployeeId);;
          this.getallbusiness()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }

  }

  handleNext7Click() {
    if (this.activeIndex1 === 6) {
      var model: any = {
        employeeId: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrlSave = 'eah/handlenext6click';
      this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.activeIndex1 = 7;
          this.showPreview = true;
          this.isFinalSubmitValid = true;
          this.getEAHSpouse(this.EmployeeId);
          this.getallEdu(this.EmployeeId);
          this.getPastEmp(this.EmployeeId);
          this.getContact(this.EmployeeId);
          // this.getBEntity(this.EmployeeId);
          // this.getSelfOther(this.EmployeeId);
          this.getAllData(this.EmployeeId);
          this.getSelfDemat(this.EmployeeId);
          // this.getDependentDemat(this.EmployeeId);
          // this.getDependentOther(this.EmployeeId);
          // this.getDeptBaseEntity(this.EmployeeId);
          this.getDeptDetails(this.EmployeeId);
          // this.getDematDropdown(this.EmployeeId);
          this.getMaterialFinRel(this.EmployeeId);
          // this.getStackBaseEntity(this.EmployeeId);
          // this.getStackDemat(this.EmployeeId);
          // this.getStackOther(this.EmployeeId);
          this.getConcernDetails(this.EmployeeId);
          this.getAllDemat(this.EmployeeId);
          this.getPhysicalShareDetails(this.EmployeeId);
          // this.getClientDropdown(this.EmployeeId);
          this.getCommDetails(this.EmployeeId);
          this.getCommAnotherDetails(this.EmployeeId);
          this.getallbusiness();
          this.showremsg = false;
          // this.showdebtn = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });

    }
  }



  //second Grid secGrid: any[]; // Your data array

  getCommAnotherDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `eah/GetCommAnotherDetails/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.secGrids = Result;
        // console.log("getCommAnotherDetails", this.secGrids);
      }
    });
  }

  selectYes(index: number) {
    this.selectedValuesYes[index] = true;
    this.selectedValuesNo[index] = false; // Set "No" to false
    this.comother = true;
  }

  selectNo(index: number, secGrid: any) {
    this.selectedValuesYes[index] = false; // Set "Yes" to false
    this.selectedValuesNo[index] = true;
    this.comother = false;
    this.saveCommAnother(secGrid);
    // console.log(index);
  }


  shouldShowUploadButton(index: number): boolean {
    return this.selectedValuesYes[index];
  }

  saveCommAnother(rowData: any) {
    // debugger;
    var model: any = {
      name: rowData.CLIENT_ID,
      acc: this.comother,
      eid: this.EmployeeId,
      reid: this.reopenid1,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("File path saved to database:", model);

    var apiUrl = '';
    apiUrl = `eah/SaveCommAnotherData`;
    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        // console.log("data", data);
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        // rowData.showFileName = data.Data[0].UPLOAD_PATH;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  // uploadCommOther(event: any, secGrid: any): void {
  //   debugger;
  //   console.log(secGrid);

  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the file size is within the limit
  //     if (uploadedFile.size <= 5242880) {
  //       // Check if the file extension is allowed
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //       const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //       if (allowedExtensions.includes(`.${fileExtension}`)) {
  //         secGrid.uploadedFile = uploadedFile.name;
  //         secGrid.showFileName = false;

  //         var model: any = {
  //           f_path: "~/UploadsFiles/Commodity/" + secGrid.uploadedFile,
  //           name: secGrid.CLIENT_ID,
  //           acc: this.comother,
  //           eid: this.EmployeeId,
  //           reid: this.reopenid1,
  //         }
  //         console.log("File path saved to database:", model);

  //         var apiUrl = '';
  //         apiUrl = `eah/SaveCommOtherUploadFile`;
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             secGrid.showFileName = data.Data[0].UPLOAD_PATH;
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //         })
  //       } else {
  //         // Show an error message for disallowed file extension
  //         alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //       }
  //     } else {
  //       // Show an error message for exceeding file size limit
  //       alert('File size exceeds maximum limit 5 MB.');
  //     }
  //   }
  // }

  uploadCommOther(event: any, secGrid: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, secGrid).then((secGrid) => {
      this.SubmitBtn5(secGrid)
    })

  }

  SubmitBtn5(secGrid) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);
    let parsedData = JSON.parse(tabledata);

    secGrid.uploadedFile = parsedData[0].Name;
    secGrid.showFileName = false;

    var model: any = {
      // f_path: "~/UploadsFiles/Commodity/" + secGrid.uploadedFile,
      Type: 'CommodityAnotherDetails',
      EmpId: this.employeeData.EMPNO,
      name: secGrid.CLIENT_ID,
      acc: this.comother,
      eid: this.EmployeeId,
      reid: this.reopenid1,
    }

    // console.log("File path saved to database:", model);
    for (var key in model) {
      this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
    }

    // console.log("formData", this.formData);
    this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/SaveCommOtherUploadFile", this.formData).subscribe((data: any) => {
      // console.log("data success", data.Data);
      if (data.Success) {
        // console.log("data", data);
        secGrid.showFileName = data.Data[0].UPLOAD_PATH;
        this.getCommAnotherDetails(this.EmployeeId);
        alert(data.Message);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      }
      else {
        alert('file can not be uploaded..check the path..');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
        this.dataSourceRefferalsUploadFile = []
        this.fileArray = []
      }
    });



  }

  // uploadCommOther1(event: any, secGrid: any): void {
  //   debugger;
  //   console.log(secGrid);

  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length) {
  //     const uploadedFile = inputElement.files[0];

  //     // Check if the file size is within the limit
  //     if (uploadedFile.size <= 5242880) {
  //       // Check if the file extension is allowed
  //       const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //       const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //       if (allowedExtensions.includes(`.${fileExtension}`)) {
  //         secGrid.uploadedFile = uploadedFile.name;
  //         secGrid.showFileName = false;

  //         var model: any = {
  //           f_path: "~/UploadsFiles/Commodity/" + secGrid.uploadedFile,
  //           name: secGrid.CLIENT_ID,
  //           acc: this.comother,
  //           eid: this.EmployeeId,
  //           reid: this.reopenid1,
  //         }
  //         console.log("File path saved to database:", model);

  //         var apiUrl = '';
  //         apiUrl = `eah/UpdateCommOtherUploadFile`;
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             secGrid.showFileName = data.Data[0].UPLOAD_PATH;
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //         })
  //       } else {
  //         // Show an error message for disallowed file extension
  //         alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //       }
  //     } else {
  //       // Show an error message for exceeding file size limit
  //       alert('File size exceeds maximum limit 5 MB.');
  //     }
  //   }
  // }
  uploadCommOther1(event: any, secGrid: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, secGrid).then((secGrid) => {
      this.SubmitBtn6(secGrid)
    })

  }

  SubmitBtn6(secGrid) {
    this.dataSourceRefferalsUploadFile.forEach((element: any) => {
      this.formData.append('files', element.Name);
      // console.log("this.formData", this.formData);

    });
    let tabledata = JSON.stringify(this.dataSourceRefferalsUploadFile);
    // console.log("this.formData", tabledata);
    let parsedData = JSON.parse(tabledata);

    secGrid.uploadedFile = parsedData[0].Name;
    secGrid.showFileName = false;

    var model: any = {
      // f_path: "~/UploadsFiles/Commodity/" + secGrid.uploadedFile,
      Type: 'CommodityAnotherDetails',
      EmpId: this.employeeData.EMPNO,
      name: secGrid.CLIENT_ID,
      acc: this.comother,
      eid: this.EmployeeId,
      reid: this.reopenid1,
    }

    // console.log("File path saved to database:", model);
    for (var key in model) {
      this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
    }

    // console.log("formData", this.formData);
    this.rest.postParams_forupload(this.Global.getapiendpoint() + "eah/UpdateCommOtherUploadFile", this.formData).subscribe((data: any) => {
      // console.log("data success", data.Data);
      if (data.Success) {
        // console.log("data", data);
        secGrid.showFileName = data.Data[0].UPLOAD_PATH;
        this.getCommAnotherDetails(this.EmployeeId);
        alert(data.Message);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      }
      else {
        alert('file can not be uploaded..check the path..');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file can not be uploaded..check the path..' });
        this.dataSourceRefferalsUploadFile = []
        this.fileArray = []
      }
    });



  }

  downloadFileCOMM(data: any) {
    // console.log("downloadPhysicalData", data);
    let filename;

    const uploadPathObject = data.UPLOAD_PATH;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // Splitting the path by 'Service' and keeping the last part
      const parts = fullPath.split('Service').slice(-1)[0];

      if (parts.length > 0) {
        filename = parts.trim();
      } else {
        // Handling if path manipulation failed
        // console.log('Path manipulation failed.');
      }
    } else {
      // Handle if uploadPathObject is not a string
    }

    const model = {
      filename: filename
    };
    // console.log("dwnlPhysicalmodel", model);

    this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filenameParts = filename.split('\\');
        const lastPart = filenameParts[filenameParts.length - 1];
        a.download = lastPart;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );

  }

  downloadFileCOMMAnother(data: any) {
    // console.log("downloadPhysicalData", data);
    let filename;

    const uploadPathObject = data.UPLOAD_PATH;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // Splitting the path by 'Service' and keeping the last part
      const parts = fullPath.split('Service').slice(-1)[0];

      if (parts.length > 0) {
        filename = parts.trim();
      } else {
        // Handling if path manipulation failed
        // console.log('Path manipulation failed.');
      }
    } else {
      // Handle if uploadPathObject is not a string
    }

    const model = {
      filename: filename
    };
    // console.log("dwnlPhysicalmodel", model);

    this.rest.postParams1(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filenameParts = filename.split('\\');
        const lastPart = filenameParts[filenameParts.length - 1];
        a.download = lastPart;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );

  }




  ///////////////////////////////   Submit ///////////////////////////////////
  handleTabChange(event: any) {
    // console.log("event", event);

    this.activeIndex1 = event;
    // if (event == 0) {
    //   this.eachtabcount = 0
    // }
    // else if (event == 1) {
    //   this.eachtabcount = 14.28
    //   console.log("event", event);
    // }
    // else if (event == 2) {
    //   this.eachtabcount = 28.57
    // } else if (event == 3) {
    //   this.eachtabcount = 42.85
    // } else if (event == 4) {
    //   this.eachtabcount = 57.14
    // } else if (event == 5) {
    //   this.eachtabcount = 71.42
    // } else if (event == 6) {
    //   this.eachtabcount = 85.71
    // } else if (event == 7) {
    //   this.eachtabcount = 100
    // }
  }

  submit() {
    this.showAlert2 = true;
  }

  onclickno() {
    this.showAlert2 = false;
  }

  async finalSubmit() {
    // debugger;
    if (this.activeIndex1 === 7) {
      this.showAlert2 = false;

      await this.getReOpenId(this.EmployeeId);
      const redata = this.reopenid.find(data => data.EMPLOYEE_ID === this.EmployeeId);

      if (redata) {

        var model: any = {
          employeeId: this.EmployeeId,
          reid: redata.RE_OPEN_ID,
          name: this.LoggedInUser1.FIRSTNAME,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrlSave = 'eah/handlefinalclick';
        this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.isdis = true;

            this.showPreview = true;
            this.isFinalSubmitValid = false;
            this.showremsg = true;
            this.getallbusiness();
            // this.showdebtn = true;
            this.getReOpenId(this.EmployeeId);
            // alert(`${data.Message}`);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });
      } else {
        var model: any = {
          employeeId: this.EmployeeId,
          name: this.LoggedInUser1.FIRSTNAME,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrlSave = 'eah/handlefinal1click';
        this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.isdis = true;
            this.showAlert2 = false;
            this.showPreview = true;
            this.isFinalSubmitValid = false;
            this.showremsg = true;
            this.getallbusiness();
            // this.showdebtn = true;
            // alert(`${data.Message}`);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });
      }
    }

  }

  msgreopenshow() {
    this.showAlert3 = true;
  }

  reopen() {
    this.showAlert3 = false;
    this.showAlert5 = true;
  }

  reopennono() {
    this.showAlert3 = false;
  }

  onOKClick1() {
    var model: any = {
      employeeId: this.EmployeeId,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrlSave = 'eah/SaveReOprnID';
    this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.isdis = false;
        this.showAlert5 = false;
        this.activeIndex1 = 0;
        this.getReOpenId(this.EmployeeId);
        this.getallbusiness();
        this.getEAHSpouse(this.EmployeeId);
        this.getallEdu(this.EmployeeId);
        this.getPastEmp(this.EmployeeId);
        this.getContact(this.EmployeeId);
        // this.getBEntity(this.EmployeeId);
        // this.getSelfOther(this.EmployeeId);
        this.getAllData(this.EmployeeId);
        this.getSelfDemat(this.EmployeeId);
        // this.getDependentDemat(this.EmployeeId);
        // this.getDependentOther(this.EmployeeId);
        // this.getDeptBaseEntity(this.EmployeeId);
        this.getDeptDetails(this.EmployeeId);
        this.getDematDropdown(this.EmployeeId);
        this.getMaterialFinRel(this.EmployeeId);
        // this.getStackBaseEntity(this.EmployeeId);
        // this.getStackDemat(this.EmployeeId);
        // this.getStackOther(this.EmployeeId);
        this.getConcernDetails(this.EmployeeId);
        this.getAllDemat(this.EmployeeId);
        this.getPhysicalShareDetails(this.EmployeeId);
        this.getClientDropdown(this.EmployeeId);
        this.getCommDetails(this.EmployeeId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    });

  }

  // Method to initiate PDF generation and download
  generateAndDownloadPDF1() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'self_details.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF2() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf1';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selfaccount_details.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF3() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf2';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dependentaccount_details.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF4() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf3';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'materialfinancial_details.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF5() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf4';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '10%stack_details.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF6() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf5';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'security_holding.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  generateAndDownloadPDF7() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'eah/generate-pdf6';
    this.rest.postParams1(this.Global.getapiendpoint() + apiUrlSave, model, { responseType: 'blob' }).subscribe((data: Blob) => {
      // Create a blob from the response data
      const blob = new Blob([data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'commodity.pdf'; // Specify the desired filename
      document.body.appendChild(a);
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      this.showNameList = false;
    });
  }

  downloadFile(data: any) {
    // console.log("data", data);

    const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
    // if (data.relation !== null && data.relation.toUpperCase() === 'SELF') {
    window.open(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileEMP/'.concat(data.ID), '_blank');
    // } else if(data.relation !== null && validRelationships.includes(data.relation.toUpperCase())) {
    //   window.open(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfileREL/'.concat(data.ID), '_blank');
    // // }else if(data.relation !== null && data.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(data.relation.toLowerCase())){
    //   window.open(this.Global.getapiendpoint() + 'eah/DocumentsDownloadfilestk/'.concat(data.ID), '_blank');
    // // }
  }

  getallbusiness() {
    let Model =
    {
      Id: this.EmployeeId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model));

    this.rest.postParams(this.Global.getapiendpoint() + 'progress/getalltabledataforprogressbar', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.eachtabcount = Result

      }
    });
  }
}










