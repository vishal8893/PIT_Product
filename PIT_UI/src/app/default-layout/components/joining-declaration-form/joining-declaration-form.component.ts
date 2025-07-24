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
import { EMPTY, Observable, of, switchMap, throwError } from 'rxjs';
import { ValidFileExtensions } from 'src/app/common/constant';
import { forkJoin } from 'rxjs';
import * as FileSaver from 'file-saver';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-joining-declaration-form',
  templateUrl: './joining-declaration-form.component.html',
  styleUrls: ['./joining-declaration-form.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class JoiningDeclarationFormComponent implements OnInit {
  activeIndex1: number = 0;
  selectedValue: string;
  dependentAcDetails: boolean = false;
  additionalStake: boolean = false;
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
  // PSHolds: Product[];
  // PSHold: Product;
  eachtabcount: number
  cities: any;
  selectedValueSingle: boolean = false;
  selectedValueMarried: boolean = false;
  spouseName: string = '';
  EmployeeId: any;
  LoggedInUser1: any;
  IsTrackedEmp: any;
  EmailType: any;
  singleStatus: boolean = null;
  // data: any[] = [];
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
  employeeData5: any = {}
  stepid: any;
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
  showEntDropdown3: boolean = false;
  showOtherTextbox3: boolean = false;
  rdoSelfBroker: boolean = false;
  rdoSelfBrokerOther: boolean = false;
  showEntDropdown4: boolean = false;
  showOtherTextbox4: boolean = false;
  rdoDPBrokerOther: boolean = false;
  rdoDPBroker: boolean = false;
  rdoSTKBroker: boolean = false;
  rdoSTKBrokerOther: boolean = false;
  showEntDropdown5: boolean = false;
  showOtherTextbox5: boolean = false;
  DPTypeBroker: any;
  relationSelected: boolean = false;
  concernSelected: boolean = false;
  activemodel: boolean = false;

  formData = new FormData();
  fileArray: any[] = [];
  dataSourceRefferalsUploadFile = [];
  phonedisable: boolean = false;
  mobiledisable: boolean = false;
  isdis: boolean = false;
  spousenamedisable: boolean = false;
  isdis1: boolean = false;
  dataSaved: boolean = false;


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
      label: '10% Stake Holding',
    },
    {
      label: 'Security Holding',
    },
    {
      label: 'Submit',
    }
  ];

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
    // this.LoggedInUser1 = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;

    // this.EmployeeId = this.LoggedInUser1.ID;
    this.EmployeeId = this.LoggedInUser1.EMPNO;
    this.IsTrackedEmp = this.LoggedInUser1.IS_TRACKEDEMP;
    this.EmailType = this.LoggedInUser1.EMAIL_TYPE;
    //FinancialYear = System.Configuration.ConfigurationManager.AppSettings["FinancialYear"]; remain
    this.getallbusiness();
    this.getallEdu(this.EmployeeId);
    this.getPastEmp(this.EmployeeId);
    this.getalltypeCont();
    this.getContact(this.EmployeeId);
    // this.getDependentOther(this.EmployeeId);
    // this.getDependentDemat(this.EmployeeId);
    this.getSelfDemat(this.EmployeeId);
    // this.getSelfOther(this.EmployeeId);
    this.getalltypeRelation();
    // this.getStackOther(this.EmployeeId);
    // this.getStackDemat(this.EmployeeId);
    this.getalltypeConcern();
    this.getAllData(this.EmployeeId);
    this.getDematDropdown(this.EmployeeId);
    this.getEmployeeData(this.EmployeeId);
    this.getDeptDetails(this.EmployeeId);
    this.getConcernDetails(this.EmployeeId);
    this.getAllDemat(this.EmployeeId);
    this.getPhysicalShareDetails(this.EmployeeId);
    this.getallBaseEntity();
    this.getallEntity();
    // this.getBEntity(this.EmployeeId);
    // this.getDeptBaseEntity(this.EmployeeId);
    // this.getStackBaseEntity(this.EmployeeId);
    this.getallUSTMST(this.EmployeeId);
    this.getstepid(this.EmployeeId);


  }

  async getstepid(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/getStep/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.employeeData1 = Result[0];
        // console.log("getStep", this.employeeData1);
        this.stepid = Result;
        // console.log("getStep", this.stepid);
        this.navigateNext();
      }
    });
  }

  navigateNext() {
    // debugger;
    const stid = this.employeeData1.STEP_ID;
    const s_status = this.employeeData1.SINGLE_STATUS;
    const submit = this.employeeData1.SUBMITTED;

    if (stid === "0") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      this.activeIndex1 = 1;
    } else if (stid === "1") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      // this.getBEntity(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      if (this.SelfDematmstid.length > 0) {
        this.selectedSelfDPYes = true;
        this.selectedSelfDPNo = false;
      } else {
        this.selectedSelfDPYes = false;
        this.selectedSelfDPNo = true;
      }
      this.activeIndex1 = 2;
    } else if (stid === "2") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      // this.getBEntity(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      if (this.SelfDematmstid.length > 0) {
        this.selectedSelfDPYes = true;
        this.selectedSelfDPNo = false;
      } else {
        this.selectedSelfDPYes = false;
        this.selectedSelfDPNo = true;
      }
      // this.getDeptBaseEntity(this.EmployeeId);
      // this.getDependentOther(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      this.activeIndex1 = 3;
    } else if (stid === "3") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      // this.getBEntity(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      if (this.SelfDematmstid.length > 0) {
        this.selectedSelfDPYes = true;
        this.selectedSelfDPNo = false;
      } else {
        this.selectedSelfDPYes = false;
        this.selectedSelfDPNo = true;
      }
      // this.getDependentOther(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      this.activeIndex1 = 4;
    } else if (stid === "4") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      // this.getBEntity(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      if (this.SelfDematmstid.length > 0) {
        this.selectedSelfDPYes = true;
        this.selectedSelfDPNo = false;
      } else {
        this.selectedSelfDPYes = false;
        this.selectedSelfDPNo = true;
      }
      // this.getDependentOther(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);
      this.activeIndex1 = 5;
      this.showPreview = true;
      this.isFinalSubmitValid = true;
    } else if (stid === "5") {
      this.spouseName = this.employeeData1.SPOUSENAME;
      if (s_status) {
        this.selectedValueSingle = true;
        this.selectedValueMarried = false;
        // this.spousenamedisable = true;
        // this.spouseName = null;
      } else {
        this.selectedValueSingle = false;
        this.selectedValueMarried = true;
        // this.spousenamedisable = false;
      }
      this.getallEdu(this.EmployeeId);
      this.getPastEmp(this.EmployeeId);
      this.getContact(this.EmployeeId);
      this.isdis = true;
      // this.getBEntity(this.EmployeeId);
      this.getSelfDemat(this.EmployeeId);
      this.getAllData(this.EmployeeId);
      // this.getSelfOther(this.EmployeeId);
      if (this.SelfDematmstid.length > 0) {
        this.selectedSelfDPYes = true;
        this.selectedSelfDPNo = false;
      } else {
        this.selectedSelfDPYes = false;
        this.selectedSelfDPNo = true;
      }
      // this.getDependentOther(this.EmployeeId);
      // this.getDependentDemat(this.EmployeeId);
      this.getDeptDetails(this.EmployeeId);
      // this.getStackOther(this.EmployeeId);
      // this.getStackDemat(this.EmployeeId);
      // this.getDeptBaseEntity(this.EmployeeId);
      // this.getStackBaseEntity(this.EmployeeId);
      this.getConcernDetails(this.EmployeeId);
      this.getAllDemat(this.EmployeeId);
      this.getPhysicalShareDetails(this.EmployeeId);
      this.activeIndex1 = 5;
      this.showPreview = true;
      this.isFinalSubmitValid = false;
      this.isdis1 = true;
    }
  }

  getallUSTMST(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetUser/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.employeeData = Result[0];
        this.uid = Result;
        // console.log("getUser", this.employeeData);
        // console.log("getUser", this.uid);
      }
    });
  }



  ////////////////////////////////////////////self setails////////////////////////////////////////////////////////////////////////////
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

  //next click event for self details
  handleNext1Click() {
    // debugger;
    if (this.activeIndex1 === 0) {
      var model: any = {
        employeeid: this.EmployeeId,
        Single_status: this.singleStatus,
        spouseName: this.spouseName || null,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
      // console.log("model", model);

      var apiUrl = '';
      apiUrl = 'joindesc/SaveSpouseDetails';
      if (this.edumstid.length > 0) {
        if (this.contmstid.length > 0) {
          if (this.pastempmstid.length > 0) {
            if (this.singleStatus !== null) {
              this.rest.create(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);                 
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.isdis = true;
                  this.activeIndex1 = 1;
                  this.getallbusiness();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
              })
            } else {
              alert("Please fill in all required details.");
            }
          }
          else {
            alert("Please fillup PastEmployee details")
          }
        }
        else {
          alert("Please fillup Conatct details")
        }

      }
      else {
        alert("Please fillup Education details")
      }
    }

  }

  //education details
  getallEdu(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetAllEdu/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        this.edumstid = Result;
        // console.log("getAllEdu", this.products);
        // console.log("getAllEdu", this.edumstid);
      }
    });
  }

  // createEdu() {
  //   if (this.Institution && this.Qualification && this.Sub_Qualification) {
  //     this.oneditbtn = false;
  //     var model: any = {
  //       employeeid: this.EmployeeId,
  //       institution: this.Institution,
  //       qualification: this.Qualification,
  //       subQualification: this.Sub_Qualification
  //     };
  //     console.log("model", model);
  //     var apiUrl = '';
  //     apiUrl = 'joindesc/SaveEduDetails';
  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.clearEdu();
  //         this.getallEdu(data.Data.EMPLOYEE_ID);
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //     })

  //   }
  // }
  createEdu() {
    if (this.Institution && this.Qualification && this.Sub_Qualification) {
      this.oneditbtn = false;
      var model: any = {
        employeeid: this.EmployeeId,
        institution: this.Institution,
        qualification: this.Qualification,
        subQualification: this.Sub_Qualification
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
      // console.log("model", model);

      // First, check for duplicate qualification
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        qualification: this.Qualification
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel)); 

      var checkDuplicateApiUrl = 'joindesc/checkduplicate';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 } ).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Qualification already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Qualification already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'joindesc/SaveEduDetails';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness()
              this.clearEdu();
              this.getallEdu(Result.EMPLOYEE_ID);
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

      var checkDuplicateApiUrl = 'joindesc/checkduplicate';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
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

          var updateApiUrl = 'joindesc/UpdateEduDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.clearEdu();
              this.onadd = true;
              this.getallEdu(this.EmployeeId);
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
    // console.log("product", product);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: product.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeleteEduById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getallEdu(this.EmployeeId);
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
    apiUrl = `joindesc/GetPastEmp/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.pastEmployees = Result;
        this.pastempmstid = Result;
        // console.log("getPastEmp", this.pastEmployees);
        // console.log("getPastEmp", this.pastempmstid);
      }
    });
  }

  createPastEmp() {
    if (this.Past_Emp) {
      this.oneditbtn2 = false;
      var model: any = {
        employeeid: this.EmployeeId,
        pastEmp: this.Past_Emp,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      // First, check for duplicate past employer
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        pastEmployer: this.Past_Emp
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'joindesc/checkduplicatepastemployee';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 } ).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Past employer already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Past employer already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'joindesc/SavePastEmp';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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

      var checkDuplicateApiUrl = 'joindesc/checkduplicatepastemployee';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
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

          var updateApiUrl = 'joindesc/UpdatePastEmpDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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
      apiUrl = 'joindesc/DeletePastEmpById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

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
    apiUrl = `joindesc/GetContact/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.contacts = Result;
        this.contmstid = Result;
        // console.log("getContact", this.contacts);
        // console.log("getContact", this.contmstid);
      }
    });
  }

  createCont() {
    if (this.Contact_no && this.contNgmodel && (this.Contact_no.length === 10 && /^\d+$/.test(this.Contact_no))) {
      this.oneditbtn1 = false;
      var model: any = {
        employeeid: this.EmployeeId,
        contact_type: this.contNgmodel.ID,
        conatct_number: this.Contact_no,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      // First, check for duplicate contact number
      var checkDuplicateModel: any = {
        employeeId: this.EmployeeId,
        contactNumber: this.Contact_no
      };
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

      var checkDuplicateApiUrl = 'joindesc/checkduplicatecontact';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel1 } ).subscribe((duplicateData: any) => {
        if (duplicateData.isDuplicate) {
          alert("Contact number already exists for this employee");
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Contact number already exists for this employee.' });
        } else {
          // If not a duplicate, proceed with saving
          var saveApiUrl = 'joindesc/SaveContact';
          this.rest.create(this.Global.getapiendpoint() + saveApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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

      var checkDuplicateApiUrl = 'joindesc/checkduplicatecontact';
      this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
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

          var updateApiUrl = 'joindesc/UpdateContDetails';
          this.rest.create(this.Global.getapiendpoint() + updateApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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
      this.Contact_no.markAsDirty();
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
      apiUrl = 'joindesc/DeleteContById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

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



  //////////////////////////////////////////////////////////////// self account ///////////////////////////////////////////////////////////////////////
  getallBaseEntity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllBaseEntity').subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entity1id = Result;
        // console.log("GetAllBaseEntity", this.entity1id)
      }
    });
  }

  // getBEntity(EmployeeId: any) {
  //   var apiUrl = '';
  //   apiUrl = `joindesc/GetBEntityDetails/${EmployeeId}`;
  //   this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
  //     if (data.Success) {
  //       // this.EntOthers = data.Data;
  //       // this.selfBaseEntid = data.Data;
  //       this.SelfOthers = data.Data;
  //       this.selfOthermstid = data.Data;
  //       console.log("GetBEntityDetails", this.SelfOthers);
  //       console.log("GetBEntityDetails", this.selfOthermstid);
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

  //       var checkDuplicateApiUrl = 'joindesc/checkduplicateentitytradeaccount';
  //       this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, checkDuplicateModel).subscribe((duplicateData: any) => {
  //         if (duplicateData.isDuplicate) {
  //           alert("Trading account number already exists for this employee");
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
  //         } else {

  //           var model: any = {
  //             employeeid: this.EmployeeId,
  //             EBL: this.EBL,
  //             entityid: this.ent1Ngmodel.ID,
  //             entname: this.ent1Ngmodel.ENTITY_NAME
  //           };
  //           console.log("model", model);

  //           var addApiUrl = 'joindesc/SaveBaseEntity';
  //           this.rest.create(this.Global.getapiendpoint() + addApiUrl, model).subscribe((data: any) => {
  //             if (data.Success) {
  //               console.log("data", data);
  //               this.ent1Ngmodel = null;
  //               this.EBL = null;
  //               // this.getBEntity(data.Data.EMPLOYEE_ID);
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
  //   apiUrl = 'joindesc/DeleteBaseEntById';

  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //     if (data.Success) {
  //       // this.getBEntity(this.EmployeeId);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

  //     }
  //     else {
  //       this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //     }
  //   })
  // }

  //next click event for self account details
  handleNext2Click() {
    // debugger;
    if (this.activeIndex1 === 1) {

      var model: any = {
        employeeid: this.EmployeeId,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", model);

      var apiUrl = '';
      apiUrl = `joindesc/SaveSelfAccontDetails/${this.EmployeeId}`;
      if (this.selectedSelfDPYes === true) {
        if (this.SelfDematmstid.length > 0) {
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.isdis = true;
              this.activeIndex1 = 2;
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          })
        } else {
          alert("Please fill up Demat details.")
        }
      } else {
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.isdis = true;
            this.activeIndex1 = 2;
            this.getallbusiness();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        })
      }
    }
  }

  //Trade-broker account details
  changeSelfBroker() {
    this.rdoSelfBrokerOther = false;
    this.showEntDropdown3 = true;
    this.DPTypeBroker = '';
    this.showOtherTextbox3 = false;
    this.EBL = '';
  }

  changeSelfBrokerOther() {
    this.rdoSelfBroker = false;
    this.showOtherTextbox3 = true;
    this.DPTypeBroker = 'Other';
    this.showEntDropdown3 = false;
    this.ent1Ngmodel = '';
  }

  getAllData(EmployeeId: any) {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Create observables for the API calls
    const greyListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetBEntityDetails/${EmployeeId}`);
    const restrictedListObservable = this.rest.getAll(this.Global.getapiendpoint() + `joindesc/GetSelfOther/${EmployeeId}`);

    // Use forkJoin to wait for both observables to complete
    forkJoin([greyListObservable, restrictedListObservable]).subscribe(
      ([greylistData, restrictedData]: [any, any]) => {
        if (greylistData.Success) {
        var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          // Map the grey list data and add a 'source' column with the value 'Entity List'
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

            var checkDuplicateApiUrl = 'joindesc/checkduplicateentitytradeaccount';
            this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
              if (duplicateData.isDuplicate) {
                alert("Trading account number already exists for this employee");
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
              } else {

                var model: any = {
                  employeeid: this.EmployeeId,
                  EBL: this.selftrdCode,
                  entityid: this.ent1Ngmodel.ID,
                  entname: this.ent1Ngmodel.ENTITY_NAME
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                // console.log("model", model);

                var addApiUrl = 'joindesc/SaveBaseEntity';
                this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                  if (data.Success) {
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.getallbusiness()
                    this.ent1Ngmodel = null;
                    this.selftrdCode = null;
                    this.rdoSelfBroker = null;
                    this.showEntDropdown3 = false;
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

            var checkDuplicateApiUrl = 'joindesc/checkduplicatetradingaccount';
            this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
              if (duplicateData.isDuplicate) {
                alert("Trading account number already exists for this employee");
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Trading account number already exists for this employee.' });
              } else {
                // If not a duplicate, proceed with adding
                var model: any = {
                  employeeid: this.EmployeeId,
                  brokerName: this.EBL,
                  tradecode: this.selftrdCode
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                // console.log("model", model);

                var addApiUrl = 'joindesc/SaveSelfOther';
                this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                  if (data.Success) {
                    // console.log("data", data);
                    var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.EBL = null;
                    this.rdoSelfBrokerOther = null;
                    this.selftrdCode = null;
                    this.showOtherTextbox3 = false;
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
        apiUrl = 'joindesc/DeleteBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

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
        apiUrl = 'joindesc/DeleteSelfOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
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

  //Demat account
  getallEntity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllEntity').subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allentid = Result;
        // console.log("getallEntity", this.allentid)
      }
    });
  }

  changeDPYes() {
    this.selectedSelfDPNo = false;
  }

  changeDPNo() {
    this.selectedSelfDPYes = false;
    this.rdoSelfDPEBL = false;
    this.rdoSelfDPESL = false;
    this.rdoSelfDPOther = false;
    this.otherngModel = null;
    this.showOtherTextbox1 = false;
    this.selfDPtradeNo = null;
  }

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
    apiUrl = `joindesc/GetSelfDemat/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.SelfDPs = Result;
        this.SelfDematmstid = Result;
        // console.log("getSelfDemat", this.SelfDPs);
        // console.log("getSelfDemat", this.SelfDematmstid);
      }
    });
  }

  addSelfDP() {
    // debugger;
    if (this.activeIndex1 === 1) {
      if (this.selfDPtradeNo && (this.selfDPtradeNo.length === 16 && /^\d+$/.test(this.selfDPtradeNo) && (this.allentNgmodel || this.otherngModel))) {


        // First, check for duplicate DP account
        var checkDuplicateModel: any = {
          employeeId: this.EmployeeId,
          dpAccount: this.selfDPtradeNo
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

        var checkDuplicateApiUrl = 'joindesc/checkduplicatedpaccount';
        this.rest.create(this.Global.getapiendpoint() + checkDuplicateApiUrl, { encryptmodel: encryptmodel } ).subscribe((duplicateData: any) => {
          if (duplicateData.isDuplicate) {
            alert("DP account already exists for this employee");
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'DP account already exists for this employee.' });
          } else {
            // If not a duplicate, proceed with adding
            var model: any = {
              employeeid: this.EmployeeId,
              brokerName: this.allentNgmodel.ENTITY_NAME || this.otherngModel,
              tradecode: this.selfDPtradeNo,
              type: this.DPType1 || this.allentNgmodel.ENTITY_NAME
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", model);

            var addApiUrl = 'joindesc/SaveSelfDemat';
            this.rest.create(this.Global.getapiendpoint() + addApiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallbusiness()
                this.selfDPtradeNo = null;
                this.dataSaved = true;
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
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeleteSelfDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

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



  ///////////////////////////////////////////// dependent account details //////////////////////////////////////////////////////////////////////////////////
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

  getDPBrokerAllData(EmployeeId: any, id: any, name: any) {
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
              // relativeName: this.rltNgmodel.NAME
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var apiUrlCheckDuplicate = 'joindesc/checkduplicateDeptentitytradeaccount';
            this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, { encryptmodel: encryptmodel } ).subscribe((checkData: any) => {
              if (checkData.isDuplicate) {
                alert(`${checkData.Message}`);
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
              } else {
                // if (this.rltNgmodel.NAME === 'Other') {
                var model: any = {
                  employeeid: this.EmployeeId,
                  EBL: this.depttrdCode,
                  entityid: this.ent1Ngmodel.ID,
                  entname: this.ent1Ngmodel.ENTITY_NAME,
                  Rtype: this.rltNgmodel.ID,
                  relativeName: this.name
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

                var apiUrlSave = 'joindesc/SaveDeptBaseEntity';
                this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                  if (data.Success) {
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.getallbusiness()
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
              brokerName: this.DeptEBL,
              // relativeName: this.rltNgmodel.NAME
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateModel));

            var apiUrlCheckDuplicate = 'joindesc/checkduplicateDeptOther';
            this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, { encryptmodel: encryptmodel } ).subscribe((checkData: any) => {
              if (checkData.isDuplicate) {
                alert(`${checkData.Message}`);
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
              } else {
                // if (this.rltNgmodel.NAME === 'Other') {
                var model: any = {
                  employeeid: this.EmployeeId,
                  brokerName: this.DeptEBL,
                  tradecode: this.depttrdCode,
                  Rtype: this.rltNgmodel.ID,
                  relativeName: this.name
                };
                let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                var apiUrlSave = 'joindesc/SaveDependentOther';
                this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                  if (data.Success) {
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                    this.DeptEBL = null;
                    this.depttrdCode = null;
                    this.rdoDPBrokerOther = false;
                    this.showOtherTextbox4 = false;
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
        apiUrl = 'joindesc/DeleteDeptBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallbusiness()
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
        apiUrl = 'joindesc/DeleteDeptOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

          if (data.Success) {
            // this.getDependentOther(this.EmployeeId);
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

  addDependentAcDetails() {
    this.dependentAcDetails = true;
  }

  async getEmployeeData(EmployeeId: any) {
    try {
      const apiUrl = `joindesc/Selfdata/${EmployeeId}`;
      const data = await this.rest.getAll(this.Global.getapiendpoint() + apiUrl).toPromise();
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.selfid = Result;
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }

  //next click event for dependent account details
  async handleNext3Click() {
    // debugger;
    if (this.activeIndex1 === 2) {
      const employeeIdToFind = this.EmployeeId;
      await this.getEmployeeData(this.EmployeeId);
      const employeeData = this.selfid.find(data => data.EMPLOYEE_ID === employeeIdToFind);
      if (!employeeData) {
        console.error("Employee data not found for the provided employeeId.");
        return;
      }
      const singleStatus = employeeData.SINGLE_STATUS;
      if (singleStatus !== true) {
        let hasSpouse = false;

        for (const detail of this.deptDetailtid) {
          if (detail.RELATIONSHIP_NAME === "Spouse") {
            hasSpouse = true;
            break; // No need to continue checking once a Spouse record is found
          }
        }

        if (hasSpouse) {
          var model: any = {
            employeeId: this.EmployeeId,
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          var apiUrlSave = 'joindesc/handlenext3click';
          this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.isdis = true;
              this.activeIndex1 = 3;
              this.getDematDropdown(this.EmployeeId);
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        } else {
          alert("Please add dependent details for Spouse.");
          return;
        }
      }
      else {
        var model: any = {
          employeeId: this.EmployeeId,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        var apiUrlSave = 'joindesc/handlenext3click';
        this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.isdis = true;
            this.activeIndex1 = 3;
            this.getDematDropdown(this.EmployeeId);
            this.getallbusiness();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });

      }
    }
  }

  //otheraccount
  // getDependentOther(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `joindesc/GetDeptOther/${EmployeeId}/${id}/${name}`;
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
    apiUrl = `joindesc/GetDeptDemat/${EmployeeId}/${id}/${name}`;
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
          dpBrokerName: this.allentNgmodel.ENTITY_NAME || this.Othermodel,
          // relativeName: this.RelTypeOther
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(duplicateCheckData));
        this.rest.postParams(this.Global.getapiendpoint() + 'joindesc/checkduplicateRelDp', { encryptmodel: encryptmodel } ).subscribe((dupData: any) => {
          if (dupData.isDuplicate) {
            alert(`${dupData.Message}`);
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: dupData.Message });
          } else {
            // Proceed with saving the DP account information
            // if (this.rltNgmodel.NAME === 'Other') {
            var model: any = {
              employeeid: this.EmployeeId,
              brokerName: this.allentNgmodel.ENTITY_NAME || this.Othermodel,
              tradecode: this.deptDPAccNo,
              Rtype: this.rltNgmodel.ID,
              type: this.DPType || this.allentNgmodel.ENTITY_NAME,
              relativeName: this.name
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // } else {
            //   var model: any = {
            //     employeeid: this.EmployeeId,
            //     brokerName: this.allentNgmodel.ENTITY_NAME || this.Othermodel,
            //     tradecode: this.deptDPAccNo,
            //     Rtype: this.rltNgmodel.ID,
            //     type: this.DPType || this.allentNgmodel.ENTITY_NAME,
            //     relativeName: this.rltNgmodel.NAME
            //   };
            // }
            // console.log("model", model);
            var apiUrl = 'joindesc/SaveDependentDemat';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallbusiness()
                // this.clearPastEmp();
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
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {

      var model: any =
      {
        ID: DeptDP.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeleteDeptDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getDependentDemat(this.EmployeeId, DeptDP.RELATIVE_ID, DeptDP.RELATIONSHIP);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });
    } else {

    }
  }

  //PAN
  chnageNotapplicable() {
    this.rdbNotApllied = false;
    this.rdbPan = false;
    this.PanNo = null;
    this.isPanDisable = true;
    this.PanNo = null;
    this.DeptPan = 'NotApplicable';
  }

  changeNotApplied() {
    this.rdbNotApplicable = false;
    this.rdbPan = false;
    this.PanNo = null;
    this.isPanDisable = true;
    this.PanNo = null;
    this.DeptPan = 'NotApplied';
  }

  chnagePan() {
    this.rdbNotApplicable = false;
    this.rdbNotApllied = false;
    this.isPanDisable = false;
    this.DeptPan = null;
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

  getalltypeRelation() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllTypeRelation').subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.relid = Result;
        // console.log("getAlltypeRelation", this.relid)
      }
    });
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
  //   apiUrl = `joindesc/GetDeptBEntityDetails/${EmployeeId}/${id}/${name}`;
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
  //         // relativeName: this.rltNgmodel.NAME
  //       };

  //       var apiUrlCheckDuplicate = 'joindesc/checkduplicateDeptentitytradeaccount';
  //       this.rest.postParams(this.Global.getapiendpoint() + apiUrlCheckDuplicate, checkDuplicateModel).subscribe((checkData: any) => {
  //         if (checkData.isDuplicate) {
  //           alert(`${checkData.Message}`);
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: checkData.Message });
  //         } else {
  //           // if (this.rltNgmodel.NAME === 'Other') {
  //           var model: any = {
  //             employeeid: this.EmployeeId,
  //             EBL: this.DeptEBL,
  //             entityid: this.ent1Ngmodel.ID,
  //             entname: this.ent1Ngmodel.ENTITY_NAME,
  //             Rtype: this.rltNgmodel.ID,
  //             relativeName: this.name
  //           };

  //           var apiUrlSave = 'joindesc/SaveDeptBaseEntity';
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
  //   apiUrl = 'joindesc/DeleteDeptBaseEntById';

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
    if (this.activeIndex1 === 2) {
      // if (this.name && this.rltNgmodel && (this.rdbNotApplicable || this.rdbNotApllied || (this.rdbPan && this.PanNo && this.PanNo.length === 10)) || (!this.minorNgModel || (this.minorNgModel && (this.phoneNgModel || this.mobileNgModel) && ((this.phoneNgModel.length === 10 && /^\d+$/.test(this.phoneNgModel)) || (this.mobileNgModel.length === 10 && /^\d+$/.test(this.mobileNgModel)))))) {
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
            findept: this.activemodel,
            other: this.RelTypeOther
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
            findept: this.activemodel,
            other: this.rltNgmodel.NAME
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `joindesc/SaveAddDependentDetails`;
        let hasRel = false;

        for (const detail of this.deptDematmstid) {
          if (detail.RELATIVE_ID === this.rltNgmodel.ID) {
            hasRel = true;
            break; // No need to continue checking once a Spouse record is found
          }
        }

        if (hasRel) {
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness()
              // this.activeIndex1 = 3;
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
              // this.getDependentOther(this.EmployeeId);
              // this.getDependentDemat(this.EmployeeId);
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
        alert('Please Fill up required details.');
      }

    }
  }

  getDeptDetails(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/combineDataforDependent/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.dependents = Result;
        this.deptDetailtid = Result;
        // console.log("getdeptdetails", this.dependents);
        // console.log("getdeptdetails", this.deptDetailtid);
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
      // if (this.name && this.rltNgmodel && (this.rdbNotApplicable || this.rdbNotApllied || (this.rdbPan && this.PanNo && this.PanNo.length === 10)) || (!this.minorNgModel || (this.minorNgModel && (this.phoneNgModel || this.mobileNgModel) && ((this.phoneNgModel.length === 10 && /^\d+$/.test(this.phoneNgModel)) || (this.mobileNgModel.length === 10 && /^\d+$/.test(this.mobileNgModel)))))) {
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
            ID: this.pastempid
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
            ID: this.pastempid
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `joindesc/UpdateAddDependentDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            // this.activeIndex1 = 3;
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
            // this.getDependentOther(this.EmployeeId);
            // this.getDependentDemat(this.EmployeeId);
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
    // console.log("dependent delete", dependent);
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
      apiUrl = 'joindesc/DeleteDependent';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getDeptDetails(this.EmployeeId);
          // this.getDependentOther(this.EmployeeId);
          // this.getDependentDemat(this.EmployeeId);
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
    this.DeptEBL = null;
    this.DeptESL = null;
    this.PanNo = null;
    this.rdbNotApplicable = false;
    this.rdbNotApllied = false;
    this.rdbPan = true;
    this.isPanDisable = true;
    this.deptDPAccNo = null;
    this.rdoDeptDPEBL = false;
    this.rdoDeptDPESL = false;
    this.rdoDeptDPOther = false;
    this.Othermodel = null;
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
    this.showEntDropdown4 = false;
    this.showOtherTextbox4 = false;
    this.rdoDPBrokerOther = false;
    this.rdoDPBroker = false;
    this.activemodel = false;
  }



  //////////////////////////////////////////////////////////////////// 10% stake details ///////////////////////////////////////////////////////////////
  //stack trade details
  changeStackBroker() {
    this.rdoSTKBrokerOther = false;
    this.showEntDropdown5 = true;
    this.showOtherTextbox5 = false;
    this.SatckEBL = '';
  }

  changeStackBrokerOther() {
    this.rdoSTKBroker = false;
    this.showOtherTextbox5 = true;
    this.showEntDropdown5 = false;
    this.ent1Ngmodel = '';
  }

  getSTKBrokerAllData(EmployeeId: any, id: any, name: any) {
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

  addStackOther() {
    if (this.activeIndex1 === 3) {
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

            this.rest.postParams(this.Global.getapiendpoint() + 'joindesc/checkduplicateStackEntityInfo', { encryptmodel: encryptmodel } )
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
                    concerName: this.concernName
                  };
                  let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                  // console.log("model", model);

                  this.rest.create(this.Global.getapiendpoint() + 'joindesc/SaveStackEntityInfo', { encryptmodel: encryptmodel } )
                    .subscribe((addStackOtherData: any) => {
                      if (addStackOtherData.Success) {
                      var Result = JSON.parse(this.Global.decrypt1(addStackOtherData.Data));
                        this.getallbusiness()
                        this.ent1Ngmodel = null;
                        this.SatckTradeCode = null;
                        this.showEntDropdown5 = false;
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

            this.rest.postParams(this.Global.getapiendpoint() + 'joindesc/checkduplicateStackOther', { encryptmodel: encryptmodel } )
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
                    concerName: this.concernName
                  };
                  let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
                  // console.log("model", model);

                  this.rest.create(this.Global.getapiendpoint() + 'joindesc/SaveStackOther', { encryptmodel: encryptmodel } )
                    .subscribe((addStackOtherData: any) => {
                      if (addStackOtherData.Success) {
                      var Result = JSON.parse(this.Global.decrypt1(addStackOtherData.Data));
                        // Clear fields and update data
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
        apiUrl = 'joindesc/DeleteStackBaseEntById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallbusiness()
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
        apiUrl = 'joindesc/DeleteStackOtherById';

        this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

          if (data.Success) {
            // this.getStackOther(this.EmployeeId);
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

  addAdditionalStake() {
    this.additionalStake = true;
  }

  handleNext4Click() {
    var model: any = {
      employeeId: this.EmployeeId,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrlSave = 'joindesc/handlenext4click';
    this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.activeIndex1 = 4;
        this.isdis = true;
        this.getstepid(this.EmployeeId);
        this.getallEdu(this.EmployeeId);
        this.getPastEmp(this.EmployeeId);
        this.getContact(this.EmployeeId);
        // this.getBEntity(this.EmployeeId);
        this.getSelfDemat(this.EmployeeId);
        this.getAllData(this.EmployeeId);
        // this.getSelfOther(this.EmployeeId);
        // this.getDependentOther(this.EmployeeId);
        // this.getDependentDemat(this.EmployeeId);
        this.getDeptDetails(this.EmployeeId);
        // this.getStackOther(this.EmployeeId);
        // this.getStackDemat(this.EmployeeId);
        this.getConcernDetails(this.EmployeeId);
        // this.getDeptBaseEntity(this.EmployeeId);
        // this.getStackBaseEntity(this.EmployeeId);
        this.getAllDemat(this.EmployeeId);
        this.getPhysicalShareDetails(this.EmployeeId);
        this.getallbusiness();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    });
  }

  //Stack Entity Save
  // getStackBaseEntity(EmployeeId: any, id: any, name: any) {
  //   var apiUrl = '';
  //   apiUrl = `joindesc/GetStackBEntityDetails/${EmployeeId}/${id}/${name}`;
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
  //   if (this.activeIndex1 === 3) {
  //     if (this.SatckEBL && this.conrNgmodel) {

  //       const checkDuplicateRequestBody = {
  //         employeeId: this.EmployeeId,
  //         tradingCode: this.SatckEBL,
  //         employeeConcernId: this.conrNgmodel.ID,
  //       };

  //       this.rest.postParams(this.Global.getapiendpoint() + 'joindesc/checkduplicateStackEntityInfo', checkDuplicateRequestBody)
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
  //               concerName: this.concernName
  //             };
  //             console.log("model", model);

  //             this.rest.create(this.Global.getapiendpoint() + 'joindesc/SaveStackEntityInfo', model)
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
  //   apiUrl = 'joindesc/DeleteStackBaseEntById';

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
  //   apiUrl = `joindesc/GetStackOther/${EmployeeId}/${id}/${name}`;
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

  getDematDropdown(EmployeeId: any) {
    var apiUrl = `joindesc/GetDemat/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.demaid = Result;
        // console.log("getDematDropdown", this.demaid)
      }
    });
  }

  getStackDemat(EmployeeId: any, id: any, name: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetStackDemat/${EmployeeId}/${id}/${name}`;
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

    if (this.activeIndex1 === 3) {
      if (this.demmodel && this.conrNgmodel && (this.allentNgmodel || this.stOtNgmodel)) {

        const checkDuplicateRequestBody = {
          employeeId: this.EmployeeId,
          dpAccount: this.demmodel.dematnumber,
          employeeConcernId: this.conrNgmodel.ID,
          dpBrokerName: this.allentNgmodel.ENTITY_NAME || this.stOtNgmodel
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(checkDuplicateRequestBody));

        this.rest.postParams(this.Global.getapiendpoint() + 'joindesc/checkduplicateStkDp', { encryptmodel: encryptmodel } )
          .subscribe((duplicateData: any) => {
            if (duplicateData.isDuplicate) {
              // Handle duplicate case
              alert(`${duplicateData.Message}`);
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: duplicateData.Message });
            } else {

              var model: any = {
                employeeid: this.EmployeeId,
                brokerName: this.allentNgmodel.ENTITY_NAME || this.stOtNgmodel,
                // tradecode: this.stackDpAcc,
                tradecode: this.demmodel.dematnumber,
                type: this.StackDPType || this.allentNgmodel.ENTITY_NAME,
                Ctype: this.conrNgmodel.ID,
                concerName: this.concernName
              };
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
              // console.log("model", model);

              this.rest.create(this.Global.getapiendpoint() + 'joindesc/SaveStackDemat', { encryptmodel: encryptmodel } )
                .subscribe((addStackDPDetailsData: any) => {
                  if (addStackDPDetailsData.Success) {
                  var Result = JSON.parse(this.Global.decrypt1(addStackDPDetailsData.Data));
                    this.getallbusiness()
                    // this.stackDpAcc = null;
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
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeleteStackDematById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
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
    this.SatckPanNo = null;
    this.isSatckPanDisable = true;
    this.StackPan = 'NotApplicable';
  }

  changeStackNotApplied() {
    this.stackNotApplicable = false;
    this.stackPanNgmodel = false;
    this.SatckPanNo = null;
    this.isSatckPanDisable = true;
    this.StackPan = 'NotApplied';
  }

  changetackstackPan() {
    this.stackNotApplicable = false;
    this.stackNotApplied = false;
    this.isSatckPanDisable = false;
    this.StackPan = null;
  }

  getalltypeConcern() {
    this.rest.getAll(this.Global.getapiendpoint() + 'joindesc/GetAllTypeConcern').subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.concernid = Result;
        // console.log("getAlltypeConcern", this.concernid)
      }
    });
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
    if (this.activeIndex1 === 3) {
      if (this.concernName && this.conrNgmodel && (this.stackNotApplicable || this.stackNotApplied || (this.stackPanNgmodel && this.SatckPanNo && this.SatckPanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.SatckPanNo)))) {
        this.oneditbtn5 = false;
        if (this.conrNgmodel.NAME === 'Others') {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.ConcernTypeOther
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.conrNgmodel.NAME
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `joindesc/SaveAddConcernDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallbusiness()
            // this.activeIndex1 = 3;
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
            // this.getStackOther(this.EmployeeId);
            // this.getStackDemat(this.EmployeeId);
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
    apiUrl = `joindesc/combineDataforConcern/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Concerns = Result;
        this.ConcernDetailtid = Result;
        // console.log("ConcernDetails", this.Concerns);
        // console.log("ConcernDetails", this.ConcernDetailtid);
      }
    });
  }

  oneditConcer(Concern: any) {
    // console.log("dependent on edit", Concern);
    if (this.activeIndex1 === 3) {
      this.additionalStake = true;
      this.concernSelected = true;
      this.oneditbtn5 = true;
      this.onadd5 = false;
      this.concernName = Concern.NAME_OF_CONCERN;
      this.conrNgmodel = { "ID": Concern.TYPE_OF_CONCERN, "NAME": Concern.CONCERN_TYPE };
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
      this.getStackDemat(this.EmployeeId, Concern.TYPE_OF_CONCERN, Concern.NAME_OF_CONCERN);
      this.getSTKBrokerAllData(this.EmployeeId, Concern.TYPE_OF_CONCERN, Concern.NAME_OF_CONCERN);
    }
  }

  updateConcern() {
    if (this.activeIndex1 === 3) {
      if (this.concernName && this.conrNgmodel && (this.stackNotApplicable || this.stackNotApplied || (this.stackPanNgmodel && this.SatckPanNo && this.SatckPanNo.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.SatckPanNo)))) {
        this.oneditbtn5 = false;
        if (this.conrNgmodel.NAME === 'Others') {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.ConcernTypeOther,
            ID: this.pastempid
          };
        } else {
          var model: any = {
            employeeid: this.EmployeeId,
            Cname: this.concernName,
            CType: this.conrNgmodel.ID,
            pan: this.StackPan || this.SatckPanNo,
            Other: this.conrNgmodel.NAME,
            ID: this.pastempid
          };
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        var apiUrl = '';
        apiUrl = `joindesc/UpdateAddConcernDetails`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            // this.activeIndex1 = 3;
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
            // this.getStackOther(this.EmployeeId);
            // this.getStackDemat(this.EmployeeId);
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
        RELATIONSHIP: Concern.TYPE_OF_CONCERN,
        TRADING_ACCOUNT_NUMBERS: Concern.TRADING_CODE_10PERCENT,
        DP_ACCOUNT_NUMBERS: Concern.DP_ACCOUNT,
        REL_OTHER_NAME: Concern.NAME_OF_CONCERN,
        EMPLOYEE_ID: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeleteConcern';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getConcernDetails(this.EmployeeId);
          // this.getStackOther(this.EmployeeId);
          // this.getStackDemat(this.EmployeeId);
          // this.getStackBaseEntity(this.EmployeeId);
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
    this.showEntDropdown5 = false;
    this.showOtherTextbox5 = false;
    this.showEntDropdown2 = false;
  }



  ////////////////////////////////////////   Security Holding details ///////////////////////////////////////////////////////////////////////
  getAllDemat(EmployeeId: any) {
    var model: any = {
      name: this.LoggedInUser1.FIRSTNAME,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    var apiUrl = `joindesc/AllDP/${EmployeeId}`;
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.allDPs = Result;
        this.alldid = Result;
        // console.log("getAllDemat", this.allDPs);
      }
    });
  }

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

  //Upload button
  // handleFileChange(event: Event, rowData: any): void {
  //   // debugger;

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
  //         const formData = new FormData();
  //         formData.append('file', uploadedFile);

  //         rowData.uploadedFile = uploadedFile.name;
  //         rowData.showFileName = false;
  //         rowData.status = 'Submitted';
  //         const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
  //         const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);
  //         if (rowData.relation !== null && rowData.relation.toUpperCase() === 'SELF') {
  //           if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {

  //             // this.saveFilePathToDatabase(rowData.uploadedFile, this.EmployeeId, rowData.dpaccount);
  //             var model: any = {
  //               // f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               f_path: formData,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `joindesc/SaveUploadFilePathforSelf`;
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
  //             apiUrl = `joindesc/SaveUploadFilePathforSelf1`;
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
  //             var model: any = {
  //               f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //               eid: this.EmployeeId,
  //               accnumber: rowData.dpaccount,
  //             }
  //             console.log("File path saved to database:", model);

  //             var apiUrl = '';
  //             apiUrl = `joindesc/SaveUploadFilePathforREL`;
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
  //             apiUrl = `joindesc/SaveUploadFilePathforREL1`;
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
  //             apiUrl = `joindesc/SaveUploadFilePathforSTK`;
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
  //             apiUrl = `joindesc/SaveUploadFilePathforSTK1`;
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
        // var model: any =
        // {
        //   ID: this.EmployeeId,
        //   ACCOUNTNO: rowData.dpaccount
        // }
        // console.log('folder model', model)

        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // console.log("formData", this.formData);

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforSelf", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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

      } else {
        var model: any = {
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

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforSelf1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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
    } else if (rowData.relation !== null && validRelationships.includes(rowData.relation.toUpperCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
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

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforREL", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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



      } else {
        var model: any = {
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

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforREL1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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
    } else if (rowData.relation !== null && rowData.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(rowData.relation.toLowerCase())) {
      if (rowData.brokername !== null && !entityNames.includes(rowData.brokername)) {
        var model: any = {
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

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforSTK", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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



      } else {
        var model: any = {
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

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SaveUploadFilePathforSTK1", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.getAllDemat(this.EmployeeId);
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
    }
  }

  //authorize button
  onAuthorizeClick(rowData: any) {
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
      apiUrl = `joindesc/SaveAuthorizeforSelf`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          // rowData.uploadedFile = true;
          this.showAlert = false;
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
      apiUrl = `joindesc/SaveAuthorizeforREL`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          // rowData.uploadedFile = true;
          this.showAlert = false;
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
      apiUrl = `joindesc/SaveAuthorizeforSTK`;
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          // rowData.uploadedFile = true;
          this.showAlert = false;
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
        apiUrl = `joindesc/SaveEmailLaterSelf`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
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
        apiUrl = `joindesc/SaveEmailLaterREL`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
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
        apiUrl = `joindesc/SaveEmailLaterSTK`;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
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
    var apiUrl = '';
    apiUrl = `joindesc/GetPhysicalHolding/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.PSHolds = Result;
        this.PSHolds = Result.map((entry: any) => ({
          ...entry,
          name: 'PhysicalShareHoldings'
        }));
        // console.log("physicalholding", this.PSHolds);
      }
    });
  }

  addRow() {
    this.PSHolds.push({ name: 'PhysicalShareHoldings', isMandatory: false, isRowAdded: true });
  }

  //upload Physical Share Holding
  uploadFile(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn1(rowData)
    })

  }

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

    this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/SavePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
      // console.log("data success", data.Data);
      if (data.Success) {
        // console.log("data", data);
        this.getPhysicalShareDetails(this.EmployeeId)
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

  uploadFile1(event: any, rowData: any): void {
    // console.log("handleFileChange", event.target.files);

    this.formData = new FormData();
    this.prepareFilesList(event.target.files, rowData).then((rowData) => {
      this.SubmitBtn2(rowData)
    })

  }

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

    this.rest.postParams_forupload(this.Global.getapiendpoint() + "joindesc/UpdatePhysicalShareUploadFile", this.formData).subscribe((data: any) => {
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

  // uploadFile(event: any, rowData: any): void {
  //   // debugger;
  //   const inputElement = event.target as HTMLInputElement;
  //   if(inputElement.files && inputElement.files.length) {
  //   const uploadedFile = inputElement.files[0];

  //   // Check if the file size is within the limit
  //   if (uploadedFile.size <= 5242880) {
  //     // Check if the file extension is allowed
  //     const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //     const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //     if (allowedExtensions.includes(`.${fileExtension}`)) {
  //       rowData.uploadedFile = uploadedFile.name;
  //       rowData.showFileName = false;

  //       var model: any = {
  //         f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //         eid: this.EmployeeId,
  //       }
  //       console.log("File path saved to database:", model);

  //       var apiUrl = '';
  //       apiUrl = `joindesc/SavePhysicalShareUploadFile`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     } else {
  //       // Show an error message for disallowed file extension
  //       alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //     }
  //   } else {
  //     // Show an error message for exceeding file size limit
  //     alert('File size exceeds maximum limit 5 MB.');
  //   }
  // }
  //   }

  // uploadFile1(event: any, rowData: any): void {
  //   debugger;
  //   const inputElement = event.target as HTMLInputElement;
  //   if(inputElement.files && inputElement.files.length) {
  //   const uploadedFile = inputElement.files[0];

  //   // Check if the file size is within the limit
  //   if (uploadedFile.size <= 5242880) {
  //     // Check if the file extension is allowed
  //     const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  //     const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

  //     if (allowedExtensions.includes(`.${fileExtension}`)) {
  //       rowData.uploadedFile = uploadedFile.name;
  //       rowData.showFileName = false;

  //       var model: any = {
  //         f_path: "~/UploadsFiles/Equity/" + rowData.uploadedFile,
  //         eid: this.EmployeeId,
  //         ID: rowData.ID
  //       }
  //       console.log("File path saved to database:", model);

  //       var apiUrl = '';
  //       apiUrl = `joindesc/UpdatePhysicalShareUploadFile`;
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           rowData.showFileName = data.Data[0].UPLOAD_PATH;
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         }
  //         else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       })
  //     } else {
  //       // Show an error message for disallowed file extension
  //       alert('Please upload valid file format : pdf, doc, docx, xls, xlsx, jpg, jpeg, png');
  //     }
  //   } else {
  //     // Show an error message for exceeding file size limit
  //     alert('File size exceeds maximum limit 5 MB.');
  //   }
  // }
  //   }

  //delete Physical Share Holding

  deleteRow(rowData: any) {
    // this.PSHolds.splice(rowData, 1);
    // console.log("product", rowData);
    const confirmed = window.confirm('Are you sure you want to delete?');

    if (confirmed) {
      var model: any =
      {
        ID: rowData.ID,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'joindesc/DeletePSHoldingById';

      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

        if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallbusiness()
          this.getPhysicalShareDetails(this.EmployeeId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    } else {

    }
  }

  shouldDisplayUploadButton(brokername: string): boolean {
    const entityNames: string[] = this.entity1id.map(item => item.ENTITY_NAME);

    return entityNames.includes(brokername);
  }

  handleNext5Click(allDPs: any) {
    // debugger;
    if (this.activeIndex1 === 4) {
      var model: any = {
        employeeId: this.EmployeeId,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      var apiUrlSave = 'joindesc/handlenext5click';

      if (allDPs.every(allDP => ((allDP.uploadedFile || allDP.uploadedfile) || (allDP.authorize === true || allDP.isAuthorized) || (allDP.isProvide || allDP.isprovide === true)))) {
        this.rest.create(this.Global.getapiendpoint() + apiUrlSave, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.activeIndex1 = 5;
            this.isdis = true;
            // this.getstepid(this.EmployeeId);
            this.showPreview = true;
            this.isFinalSubmitValid = true;
            this.getstepid(this.EmployeeId);
            this.getallEdu(this.EmployeeId);
            this.getPastEmp(this.EmployeeId);
            this.getContact(this.EmployeeId);
            // this.getBEntity(this.EmployeeId);
            this.getSelfDemat(this.EmployeeId);
            this.getAllData(this.EmployeeId);
            // this.getSelfOther(this.EmployeeId);
            // this.getDependentOther(this.EmployeeId);
            // this.getDependentDemat(this.EmployeeId);
            this.getDeptDetails(this.EmployeeId);
            // this.getStackOther(this.EmployeeId);
            // this.getStackDemat(this.EmployeeId);
            // this.getDeptBaseEntity(this.EmployeeId);
            // this.getStackBaseEntity(this.EmployeeId);
            this.getConcernDetails(this.EmployeeId);
            this.getAllDemat(this.EmployeeId);
            this.getPhysicalShareDetails(this.EmployeeId);
            this.getallbusiness();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });
      } else {
        this.activeIndex1 = 4;
        alert('Please fill up all fields in security holdings.');
        this.getAllDemat(this.EmployeeId);
        this.getPhysicalShareDetails(this.EmployeeId);
      }
    }

  }

  // downloadFileEMP(data: any) {
  //   console.log("downloadData",data);

  //   const validRelationships = ['FATHER', 'MOTHER', 'SPOUSE', 'SON1', 'SON2', 'DAUGHTER1', 'DAUGHTER2', 'SON3', 'SON4', 'SON', 'DAUGHTER3', 'DAUGHTER4', 'DAUGHTER', 'BROTHER', 'SISTER', 'OTHER'];
  //   if (data.relation !== null && data.relation.toUpperCase() === 'SELF') {
  //     window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP/'.concat(data.ID), '_blank');
  //   } else if (data.relation !== null && validRelationships.includes(data.relation.toUpperCase())) {
  //     window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileREL/'.concat(data.ID), '_blank');
  //   } else if (data.relation !== null && data.relation.toUpperCase() !== 'SELF' && !validRelationships.includes(data.relation.toLowerCase())) {
  //     window.open(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfilestk/'.concat(data.ID), '_blank');
  //   }
  // }

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
      this.rest.postParams1(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
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
      this.rest.postParams1(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
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
      this.rest.postParams1(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
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

    this.rest.postParams1(this.Global.getapiendpoint() + 'joindesc/DocumentsDownloadfileEMP', model, { responseType: 'blob' }).subscribe(
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



  ////////////////////////////////////////////////////////   Submit     ////////////////////////////////////////////////////
  handleTabChange(event: any) {
    this.activeIndex1 = event;
    // if (event == 0) {
    //   this.eachtabcount = 0
    // }
    // else if (event == 1) {
    //   this.eachtabcount = 20
    // }
    // else if (event == 2) {
    //   this.eachtabcount = 40
    // } else if (event == 3) {
    //   this.eachtabcount = 60
    // } else if (event == 4) {
    //   this.eachtabcount = 80
    // } else if (event == 5) {
    //   this.eachtabcount = 100
    // }
  }

  finalSubmit() {
    // debugger;
    var model: any = {
      employee: this.EmployeeId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = `joindesc/SubmitFinaleResult`;
    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        // console.log("data", data);
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        alert("Data Submitted successfully");
        this.isFinalSubmitValid = false;
        this.isdis = true;
        this.isdis1 = true;
        this.getallbusiness();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }


  getallbusiness() {
    let Model =
    {
      Id: this.EmployeeId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model));                                          

    this.rest.postParams(this.Global.getapiendpoint() + 'jdprogress/getalltabledataforprogressbar',  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.eachtabcount = Result

      }
    });
  }

  generateAndDownloadPDF1() {

    var model: any = {
      employeeId: this.EmployeeId,
      // name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'joindesc/generate-pdf';
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
      // this.showNameList = false;
    });
  }

  generateAndDownloadPDF2() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'joindesc/generate-pdf1';
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
      // this.showNameList = false;
    });
  }

  generateAndDownloadPDF3() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'joindesc/generate-pdf2';
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
      // this.showNameList = false;
    });
  }

  generateAndDownloadPDF5() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'joindesc/generate-pdf4';
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
      // this.showNameList = false;
    });
  }

  generateAndDownloadPDF6() {

    var model: any = {
      employeeId: this.EmployeeId,
      name: this.LoggedInUser1.FIRSTNAME,
    }

    var apiUrlSave = 'joindesc/generate-pdf5';
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
      // this.showNameList = false;
    });
  }
}


