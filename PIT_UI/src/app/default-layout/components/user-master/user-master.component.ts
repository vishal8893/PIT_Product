import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
// import { Product } from '../sub-tasks/product';
// import { ProductService } from '../sub-tasks/productservice';
import { MenuItem } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { Message, PrimeNGConfig } from 'primeng/api';
import { Moment } from 'moment';
import * as _Moment from 'moment';
import { Product } from 'src/app/common/product';
import { CheckboxModule } from 'primeng/checkbox';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css'],
  providers: [MessageService, ConfirmationService]
})
// export class UserMasterComponent {
export class UserMasterComponent implements OnInit {
  @ViewChild('dt') dt: Table;

  cities: { name: string; code: string; }[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  customers: any[];
  activemodel: any;
  empnameNgmodel: any;
  fristnameNgmodel: any;
  lastnameNgmodel: any;
  loginidNgmodel: any;
  departmentNgmodel: any;
  emialNgmodel: any;
  desginatedNgModel: any;
  greylistNgmodel: any;
  tradeemildidsNgmodel: any;
  is_ieComoliancememberNgmodel: boolean = false;

  Is_ResearchAnalysNgModel: boolean = false;
  is_qytreasaerchAnalystNgmodel: boolean = false;
  isGMNgModel: boolean = false;
  isactiveNgmodel: boolean = false;
  isefslNgmodel: boolean = false;
  isegiNgmodel: boolean = false;
  isetilNgModel: boolean = false;
  entryTypeNgModel: any;
  isGmNgModel: boolean = false;
  is_bsuinessanalystNgmodel: boolean = false;

  isBuisneeDesignatedNgModle: boolean = false;
  isBuisneeDesignatedegiNgModle: boolean = false;


  pancardNgModel: any;
  entityNgModel: any;
  desginationNgModel: any;
  sbuNgModel: any;

  slobNgModel: any;
  empjoinNgModel: any;
  bgNgModel: any

  resigndateNgModel: any;

  raNgModel: any;
  businessids: any;
  products: any;
  roleid: any;
  finallobitem: any;
  finalItems: any;
  entitids: any;
  userform: FormGroup;
  roleNgModel: any;
  rolesids: any;
  calendarEnabled: boolean = false;
  // }

  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.userform = this.formBuilder.group({

      empnocotroller: ['', [Validators.required]],
      fristname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      loginid: ['', [Validators.required]],
      departmenet: ['', [Validators.required]],
      emailid: ['', [Validators.required]],
      traderemailid: ['', [Validators.required]],
      entitytype: ['', [Validators.required]],
      pancardno: ['', [Validators.required]],
      desgination: ['', [Validators.required]],
      bgname: ['', [Validators.required]],
      sbuname: ['', [Validators.required]],
      sbulobcode: ['', [Validators.required]],
      empjoindate: ['', [Validators.required]],
      resigndate: [{value: '', disabled: true}],
      raid: ['', [Validators.required]],
      roletype: ['', [Validators.required]],
      // businessdesignated: [this.isBuisneeDesignatedNgModle],
      // desginated: [this.desginatedNgModel],
      greylist: [this.greylistNgmodel],
      // isgm: [this.isGmNgModel],
      // iscompliancemember: [this.is_ieComoliancememberNgmodel],
      // isresearch: [this.Is_ResearchAnalysNgModel],
      // isquantativeresearch: [this.is_qytreasaerchAnalystNgmodel],
      // isgwramember: [this.isGMNgModel],
      // efsldesginated: [this.isefslNgmodel],
      // isegi: [this.isegiNgmodel],
      // isetli: [this.isetilNgModel],

      // activecontroller: [this.isactiveNgmodel],
      activecontroller: [
        this.isactiveNgmodel,
        [(control: AbstractControl) => {
          if (control.value !== null && control.value !== false) {
            return null; // Validation passes
          } else {
            return { invalidValue: true }; // Validation fails
          }
        }]
      ]
    })
  }

  exportToExcel(): void {
    // Check if dt is defined and has a value
    if (this.dt && this.dt.el && this.dt.el.nativeElement) {
      // Get the table element from p-table
      const table: HTMLTableElement = this.dt.el.nativeElement.querySelector('table');

      // Convert the table to a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

      // Create a new workbook and add the worksheet to it
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.sheet_add_json(ws, this.products, { header: [] });
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Save the workbook as an Excel file
      XLSX.writeFile(wb, 'userMst_data.xlsx');
    } else {
      console.error('p-table reference is not defined.');
    }
   
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    // this.productService.getProductsSmall().then(data => this.products = data);
    // this.Lobid = localStorage.getItem('lobid');
    //  this.crw
    // this.onadd=true;
    this.oneditbtn = false;
    // this.calendarEnabled = false;
    this.getalluserdata();
    this.getallbusiness();
    this.getallentity();
    this.getallrole();
    // this.getallsublob();
  }

  // handleCheckboxChange() {
  //   if (this.activemodel === null) {
  //     this.activemodel = false;
  //   } else {
  //     this.activemodel = true //!this.activemodel;
  //   }
  // }

  getallbusiness() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/GetAllbusinessgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.businessids = Result;
        // console.log("getAllbusiness", this.businessids)
      }
    });
  }

  getalluserdata() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/GetAllUSerdata1').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getalluserdata", this.products)
      }
    });
  }

  getallentity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/getallentity').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entitids = Result;
        // console.log("getallentity", this.entitids)
      }
    });
  }

  getallrole() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/getallroles').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.rolesids = Result;
        // console.log("getallroles", this.rolesids)
      }
    });
  }

  // getallsublob() {
  //   this.rest.getAll(this.Global.getapiendpoint() + 'user/GetAllsubLobMst').subscribe((data: any) => {
  //     if (data.Success) {
  //       this.products = data.Data;
  //       console.log("getAllindivisuals", this.products)
  //     }
  //   });
  // }

  onchangeevent(bgid: any) {
    // debugger;


    var model: any = {
      BG_ID: bgid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("bg model", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'user/GetAllSBU/', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finalItems = Result
        // console.log('finalItems', this.finalItems)
      }
    })
  }

  // onchangeevent(event: any) {
  //   // debugger;

  //   this.editflag=0
  //         this.editflag1=0
  //   var model: any = {
  //     BG_ID: parseInt(event.value.ID)
  //   }
  //   console.log("model", model);

  //   this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/getalluserdata/', model).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.finalItems = data.Data
  //       console.log('finalItems', this.finalItems)
  //     }
  //   })
  // }
  // onchangeevent1(event: any) {
  //   this.finalItems =[]
  //   // debugger;
  //   var model: any = {
  //     BG_ID: parseInt(event.ID)
  //   }
  //   console.log("model onchangeevent1", model);

  //   this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/getalluserdata/', model).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.finalItems = data.Data
  //       console.log('finalItems onchangeevent1', this.finalItems)
  //     }
  //   })
  // }

  onchangeeventsub(sbuid: any) {
    // debugger;
    // this.editflag=0
    // this.editflag1=0
    // console.log("sbumode", this.sbuNgModel);

    var model: any = {
      SBU_ID: sbuid //parseInt(event.value.ID)
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    // console.log("model sbu", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'user/GetAllsubLobname/', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finallobitem = Result
        // console.log('finallobitem', this.finallobitem)
      }
    })
  }


  duplicateroleid: any;
  // coderoleCheckduplicateID(data: any) {
  //   this.products.forEach((element: any) => {
  //     if (data == element.LOGINID) {
  //       this.duplicateroleid = element.ID
  //     }
  //     else {
  //       // (this.roleid !== '' ? this.roleid : '0')
  //       this.duplicateroleid = '0'
  //     }

  //   })

  // }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true //!this.activemodel;
    }
  }

  createBtn() {
    const empnocotroller = this.userform.get('empnocotroller');
    const fristname = this.userform.get('fristname');
    const lastname = this.userform.get('lastname');
    const loginid = this.userform.get('loginid');
    const departmenet = this.userform.get('departmenet');
    const emailid = this.userform.get('emailid');
    const traderemailid = this.userform.get('traderemailid');
    const entitytype = this.userform.get('entitytype');
    const pancardno = this.userform.get('pancardno');
    const desgination = this.userform.get('desgination');
    const bgname = this.userform.get('bgname');
    const sbuname = this.userform.get('sbuname');
    const sbulobcode = this.userform.get('sbulobcode');
    const empjoindate = this.userform.get('empjoindate');
    const roletype = this.userform.get('roletype');
    // const resigndate = this.userform.get('resigndate');
    const raid = this.userform.get('raid');
    // const businessdesignated = this.userform.get('businessdesignated');
    // const desginated = this.userform.get('desginated');
    const activecontroller = this.userform.get('activecontroller');
    if (this.userform.valid) {
      var mod: any = {
        LOGINID: this.loginidNgmodel,

        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'user/CheckDuplicateBranch2/', { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          ///
          this.oneditbtn = false;

          // this.handleCheckboxChange()
          var model: any = {
            EMPNO: this.empnameNgmodel,
            FIRSTNAME: this.fristnameNgmodel,
            LASTNAME: this.lastnameNgmodel,
            LOGINID: this.loginidNgmodel,
            DEPARTMENT: this.departmentNgmodel,
            EMAILID: this.emialNgmodel,
            DESIGNATION: this.desginationNgModel,
            GREYLIST: this.greylistNgmodel,
            TRADEREMAILIDS: this.tradeemildidsNgmodel,
            ISIECOMPLIANCEMEMBER: this.is_ieComoliancememberNgmodel,
            ISRESEARCHANALYST: this.Is_ResearchAnalysNgModel,
            ISQUANTITATIVERESEARCHANALYST: this.is_qytreasaerchAnalystNgmodel,
            ISGWMRAMEMBER: this.isGMNgModel,
            ISACTIVE: this.isactiveNgmodel,
            EFSLDESIGNATED: this.isefslNgmodel,
            ISEGI: this.isegiNgmodel,
            ISETLI: this.isetilNgModel,
            // ENTRYTYPE: this.entry
            ISGM: this.isGMNgModel,
            ENTITY: this.entityNgModel,
            PANCARDNO: this.pancardNgModel,
            // ENTITYDESIG: this
            DSIGNATED: this.desginatedNgModel,
            SBU: this.sbuNgModel,
            SLOB: this.slobNgModel,
            EMPJOINDATE: this.empjoinNgModel,
            BG: this.bgNgModel,
            RESIGNDATE: this.resigndateNgModel,
            RA_ID: this.raNgModel,
            BUSINESSDESIGNATED: this.isBuisneeDesignatedNgModle,
            DEFAULTROLEID: this.roleNgModel


          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'user/Saveusermstdetails';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getalluserdata();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getalluserdata();
          });

          //
        }
      })
    }
    else {
      empnocotroller.markAsDirty();
      fristname.markAsDirty();
      lastname.markAsDirty();
      loginid.markAsDirty();
      departmenet.markAsDirty();
      emailid.markAsDirty();
      traderemailid.markAsDirty();
      entitytype.markAsDirty();
      pancardno.markAsDirty();
      desgination.markAsDirty();
      bgname.markAsDirty();
      sbuname.markAsDirty();
      sbulobcode.markAsDirty();
      empjoindate.markAsDirty();
      // resigndate.markAsDirty();
      raid.markAsDirty();
      roletype.markAsDirty();
      // businessdesignated.markAsDirty();
      // desginated.markAsDirty();
      activecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empnocotroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (fristname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (lastname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (loginid.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (departmenet.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (emailid.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (traderemailid.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (entitytype.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (pancardno.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (desgination.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (bgname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (sbuname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (sbulobcode.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (empjoindate.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (roletype.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Role is required' });
      }
      if (raid.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (activecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'IsActive is required' });
      }
      // if (desginated.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      // }
      // if (greylist.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      // }

      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  businessGrpDelete(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'user/DeletesbumstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getalluserdata();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditViewBtn(product: any) {
    // debugger;
    // console.log("prodcut", product);

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.calendarEnabled = true;
    this.onchangeevent(product.BG)
    this.onchangeeventsub(product.SBU)

    // this.entityNgModel = { "ENTITY_CODE": product.TBL_ENTITY_MST.ENTITY_CODE, "ID": product.TBL_BUSINESSGROUP_MST.ID,  };
    this.entityNgModel = product.ENTITY

    this.bgNgModel = product.BG //{'BG_NAME':product.TBL_BUSINESSGROUP_MST.BG_NAME, 'ID':product.TBL_BUSINESSGROUP_MST.ID}
    this.raNgModel = product.RA_ID;
    this.sbuNgModel = product.SBU;
    this.isGmNgModel = product.ISGM;
    this.slobNgModel = product.SLOB;
    this.emialNgmodel = product.EMAILID;
    this.isegiNgmodel = product.ISEGI;
    this.entityNgModel = product.ENTITY;
    this.roleNgModel = product.DEFAULTROLEID;

    this.isefslNgmodel = product.EFSLDESIGNATED;
    this.isetilNgModel = product.ISETLI;
    this.empjoinNgModel = new Date(product.EMPJOINDATE);
    this.empnameNgmodel = product.EMPNO
    this.loginidNgmodel = product.LOGINID;
    this.pancardNgModel = product.PANCARDNO;
    this.greylistNgmodel = product.GREYLIST;
    this.isactiveNgmodel = product.ISACTIVE
    this.lastnameNgmodel = product.LASTNAME;
    this.desginationNgModel = product.DESIGNATION;
    // this.entryTypeNgModel = product.ENTRY;
    this.fristnameNgmodel = product.FIRSTNAME
    this.departmentNgmodel = product.DEPARTMENT;
    if(product.RESIGNDATE != null){
      this.resigndateNgModel = new Date(product.RESIGNDATE);
    }else{
      this.resigndateNgModel = null;
    }
    
    this.desginatedNgModel = product.DSIGNATED;
    this.tradeemildidsNgmodel = product.TRADEREMAILIDS
    this.Is_ResearchAnalysNgModel = product.ISRESEARCHANALYST;
    this.isBuisneeDesignatedNgModle = product.BUSINESSDESIGNATED;
    this.is_ieComoliancememberNgmodel = product.ISIECOMPLIANCEMEMBER;
    // this.is_ieComoliancememberNgmodel = product.
    this.is_qytreasaerchAnalystNgmodel = product.ISQUANTITATIVERESEARCHANALYST
    this.isGMNgModel = product.ISGM;
    // this.sbucodeNgModel = product.SBU_CODE;
    // this.sbunameNgModel = product.SBU_NAME;
    // this.buisnessidNgmodel = { "ID": product.TBL_BUSINESSGROUP_MST.ID, "BG_NAME": product.TBL_BUSINESSGROUP_MST.BG_NAME, };

    this.roleid = product.ID

  }

  updateBtn() {
    const empnocotroller = this.userform.get('empnocotroller');
    const fristname = this.userform.get('fristname');
    const lastname = this.userform.get('lastname');
    const loginid = this.userform.get('loginid');
    const departmenet = this.userform.get('departmenet');
    const emailid = this.userform.get('emailid');
    const traderemailid = this.userform.get('traderemailid');
    const entitytype = this.userform.get('entitytype');
    const pancardno = this.userform.get('pancardno');
    const desgination = this.userform.get('desgination');
    const bgname = this.userform.get('bgname');
    const sbuname = this.userform.get('sbuname');
    const sbulobcode = this.userform.get('sbulobcode');
    const empjoindate = this.userform.get('empjoindate');
    const activecontroller = this.userform.get('activecontroller');
    const raid = this.userform.get('raid');
    const roletype = this.userform.get('roletype');
    // if (this.sbucodeNgModel && this.sbunameNgModel && this.buisnessidNgmodel) {
    if (this.userform.valid) {
      var mod: any = {
        LOGINID: this.loginidNgmodel,

        ID: this.roleid
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'user/CheckDuplicateBranch2/', { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {


          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {
            EMPNO: this.empnameNgmodel,
            FIRSTNAME: this.fristnameNgmodel,
            LASTNAME: this.lastnameNgmodel,
            LOGINID: this.loginidNgmodel,
            DEPARTMENT: this.departmentNgmodel,
            EMAILID: this.emialNgmodel,
            DESIGNATION: this.desginationNgModel,
            GREYLIST: this.greylistNgmodel,
            TRADEREMAILIDS: this.tradeemildidsNgmodel,
            ISIECOMPLIANCEMEMBER: this.is_ieComoliancememberNgmodel,
            ISRESEARCHANALYST: this.Is_ResearchAnalysNgModel,
            ISQUANTITATIVERESEARCHANALYST: this.is_qytreasaerchAnalystNgmodel,
            ISGWMRAMEMBER: this.isGMNgModel,
            ISACTIVE: this.isactiveNgmodel,
            EFSLDESIGNATED: this.isefslNgmodel,
            ISEGI: this.isegiNgmodel,
            ISETLI: this.isetilNgModel,
            // ENTRYTYPE: this.entry
            ISGM: this.isGMNgModel,
            ENTITY: this.entityNgModel,
            PANCARDNO: this.pancardNgModel,
            // ENTITYDESIG: this
            DSIGNATED: this.desginatedNgModel,
            SBU: this.sbuNgModel,
            SLOB: this.slobNgModel,
            EMPJOINDATE: this.empjoinNgModel,
            BG: this.bgNgModel,
            RESIGNDATE: this.resigndateNgModel,
            RA_ID: this.raNgModel,
            BUSINESSDESIGNATED: this.isBuisneeDesignatedNgModle,
            DEFAULTROLEID: this.roleNgModel,

            ID: parseInt(this.roleid)
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'user/Updateusermst';
          this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.resigndateNgModel = null;

              this.calendarEnabled = false;

              this.getalluserdata();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });

        }
      })
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  deleteBtn(product: any) {
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = '';
    apiUrl = 'user/DeleteusermstByID';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getalluserdata();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })

  }

  cancel() {

    this.oneditbtn = false;
    this.onadd = true;
    this.calendarEnabled = false;
    // this.bgNgModel = null;
    // this.raNgModel = null;
    // this.sbuNgModel = null;
    // this.isGmNgModel = null
    // this.slobNgModel = null;
    // this.emialNgmodel = null;
    // this.isegiNgmodel = null;
    // this.entityNgModel = null

    // this.isefslNgmodel = null;
    // this.isetilNgModel = null;
    // this.empjoinNgModel = null;
    // this.empnameNgmodel = null
    // this.loginidNgmodel = null;
    // this.pancardNgModel = null;
    // this.greylistNgmodel = null;
    // this.isactiveNgmodel = null
    // this.lastnameNgmodel = null;
    // this.desginatedNgModel = null;
    // this.entryTypeNgModel = null;
    // this.fristnameNgmodel = null
    // this.departmentNgmodel = null;
    this.resigndateNgModel = null;
    // this.desginationNgModel = null;
    // this.tradeemildidsNgmodel = null
    // this.Is_ResearchAnalysNgModel = null;
    // this.isBuisneeDesignatedNgModle = null;
    // this.is_ieComoliancememberNgmodel = null;
    // this.is_ieComoliancememberNgmodel = null
    // this.is_qytreasaerchAnalystNgmodel = null
    // this.isGMNgModel=null;
    // this.desginatedNgModel =null;
    this.userform.reset();
  }

}
