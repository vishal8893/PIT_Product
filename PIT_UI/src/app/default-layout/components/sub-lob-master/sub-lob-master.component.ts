import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
// import { Product } from '../sub-tasks/product';
// import { ProductService } from '../sub-tasks/productservice';
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
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-sub-lob-master',
  templateUrl: './sub-lob-master.component.html',
  styleUrls: ['./sub-lob-master.component.css'],
  providers: [MessageService, ConfirmationService]
})







export class SubLobMasterComponent implements OnInit {






  customers: any[];







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  sbulobnameNgModel: any;
  buisnessidNgmodel: any
  sbunameNgmodel: any;
  lobdropdownnameNgmodel: any;
  businessids: any
  sbulobcodeNgModel: any;
  // buisnessidNgmodel: any;
  enddateNgmodel: any;
  namemodel: string;
  codemodel: any;
  desmodel: any;
  roleid: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  lobIds: any
  LOBID: any
  selectedProjectHome: any;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  Lobid: any
  UserID: any;
  lobid: any;
  finalid: any;
  checks = false;
 
  finallobitem: any
  // lobIds: any;
  activemodel: boolean | null;
  editflag: number;
  editflag1: number;
  sbunameNgmodel1: any;
  lobdropdownnameNgmodel1: any;
  sublobForm: FormGroup;

  constructor(
    private cdref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.sublobForm = this.formBuilder.group({

      sublobnamecontroller: ['', [Validators.required]],
      sublobcodecontroller: ['', [Validators.required]],
      bgnamecontroller: ['', [Validators.required]],
      sbunamecontroller: ['', [Validators.required]],
      lobnamecontroller: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.editflag = 0
    this.editflag1 = 0
    this.oneditbtn = false;
    this.getallsublob();
    this.getallbusiness();
    // this.onchangeevent();

  }

  groupdata: any;
  getallbusiness() {
    // debugger;
    this.rest.getAll(this.Global.getapiendpoint() + 'sbuservice/GetAllbusinessgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.businessids = Result;
        this.finalid = this.businessids.ID
        // console.log("getAllbusiness", this.businessids)
        // console.log("buisnessidNgmodel", this.finalid);


      }
    });
  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true //!this.activemodel;
    }
  }

  finalItems: any;
  onchangeevent(bgid: any) {
    // debugger;


    var model: any = {
      BG_ID: bgid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    // console.log("bg model", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/GetAllSBU/', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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

  //   this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/GetAllSBU/', model).subscribe((data: any) => {
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

  //   this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/GetAllSBU/', model).subscribe((data: any) => {
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
    // console.log("sbumode", this.sbunameNgmodel);

    var model: any = {
      SBU_ID: sbuid //parseInt(event.value.ID)
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    // console.log("model sbu", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'sublob/GetAllLobname/', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finallobitem = Result
        // console.log('finallobitem', this.finallobitem)
      }
    })
  }
  // onchangeeventsub1(event: any) {

  //   this.finallobitem =[]
  //   // debugger;
  //   var model: any = {
  //     SBU_ID: parseInt(event)
  //   }
  //   console.log("model onchangeeventsub1", model);

  //   this.rest.postParams(this.Global.getapiendpoint() + 'sublob/GetAllLobname/', model).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.finallobitem = data.Data
  //       console.log('finallobitem onchangeeventsub1', this.finallobitem)
  //     }
  //   })
  // }

  lobids: any;
  getallsublob() {
    this.rest.getAll(this.Global.getapiendpoint() + 'sublob/GetAllsubLobMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getallsublob", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.SUBLOB_CODE) {
        this.duplicateroleid = element.ID
      }
      else {
        // (this.roleid !== '' ? this.roleid : '0')
        this.duplicateroleid = '0'
      }

    })

  }

  createBtn() {
    const sublobnamecontroller = this.sublobForm.get('sublobnamecontroller');
    const sublobcodecontroller = this.sublobForm.get('sublobcodecontroller');
    const bgnamecontroller = this.sublobForm.get('bgnamecontroller');
    const sbunamecontroller = this.sublobForm.get('sbunamecontroller');
    const lobnamecontroller = this.sublobForm.get('lobnamecontroller');
    if (this.sublobForm.valid) {
    // if (this.sbulobnameNgModel && this.sbulobcodeNgModel && this.buisnessidNgmodel && this.sbunameNgmodel) {
      // debugger;  
      var mod: any = {
        SUBLOB_CODE: sublobcodecontroller.value,

        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'sublob/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          var model: any = {
            SUBLOB_NAME: sublobnamecontroller.value,
            SUBLOB_CODE: sublobcodecontroller.value,
            BG_ID: bgnamecontroller.value,
            SBU_ID: sbunamecontroller.value,
            LOB_ID: lobnamecontroller.value

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'sublob/CreateSubLobMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallsublob();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.editflag = 0
              this.editflag1 = 0
              // this.sbunameNgmodel = null
              // this.buisnessidNgmodel = null
              // this.sbulobnameNgModel = null
              // this.sbulobcodeNgModel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallsublob();
          });
          ////
        }
      })
    }
    else {
      sublobnamecontroller.markAsDirty();
      sublobcodecontroller.markAsDirty();
      bgnamecontroller.markAsDirty();
      sbunamecontroller.markAsDirty();
      lobnamecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (sublobnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (sublobcodecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (bgnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (sbunamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (lobnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  deleteBtn(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'sublob/DeletesubLOBById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getallsublob();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditView(product: any) {
    // console.log("product on edit", product);

    this.editflag = 1
    this.editflag1 = 1
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.sbulobnameNgModel = product.SUBLOB_NAME;
    this.sublobForm.get('sublobnamecontroller').setValue(product.SUBLOB_NAME);
    // this.sbulobcodeNgModel = product.SUBLOB_CODE;
    this.sublobForm.get('sublobcodecontroller').setValue(product.SUBLOB_CODE);
    this.onchangeevent(product.BG_ID)
    this.onchangeeventsub(product.SBU_ID)
    // this.buisnessidNgmodel = { "ID": product.TBL_LOB_MST.TBL_SBU_MST.TBL_BUSINESSGROUP_MST.ID, "BG_NAME": product.TBL_LOB_MST.TBL_SBU_MST.TBL_BUSINESSGROUP_MST.BG_NAME };
    // this.sbunameNgmodel1 = { "ID": product.TBL_LOB_MST.TBL_SBU_MST.ID, "SBU_NAME": product.TBL_LOB_MST.TBL_SBU_MST.SBU_NAME};
    // console.log('ssdsdads',this.sbunameNgmodel1.SBU_NAME)
    // this.buisnessidNgmodel = product.BG_ID
    this.sublobForm.get('bgnamecontroller').setValue(product.BG_ID);
    // this.sbunameNgmodel = product.SBU_ID
    this.sublobForm.get('sbunamecontroller').setValue(product.SBU_ID);
    // this.onchangeevent1(this.buisnessidNgmodel);


    // this.sbunameNgmodel = { "ID": product.TBL_LOB_MST.TBL_SBU_MST.ID, "SBU_NAME": product.TBL_LOB_MST.TBL_SBU_MST.SBU_NAME };

    // this.lobdropdownnameNgmodel1 = { "LOB_NAME": product.TBL_LOB_MST.LOB_NAME };

    // this.lobdropdownnameNgmodel = product.LOB_ID
    this.sublobForm.get('lobnamecontroller').setValue(product.LOB_ID);
    // this.onchangeeventsub1( this.sbunameNgmodel1.ID);
    // this.buisnessidNgmodel = new Date(product.STARTDATE);
    // this.sbunameNgmodel = new Date(product.ENDDATE),
    this.roleid = product.ID

  }

  updateBtn() {
    const sublobnamecontroller = this.sublobForm.get('sublobnamecontroller');
    const sublobcodecontroller = this.sublobForm.get('sublobcodecontroller');
    const bgnamecontroller = this.sublobForm.get('bgnamecontroller');
    const sbunamecontroller = this.sublobForm.get('sbunamecontroller');
    const lobnamecontroller = this.sublobForm.get('lobnamecontroller');
    if (this.sublobForm.valid) {
    // if (this.sbulobnameNgModel && this.sbulobcodeNgModel && this.buisnessidNgmodel && this.sbunameNgmodel) {
      var mod: any = {
        SUBLOB_CODE: sublobcodecontroller.value,

        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'sublob/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          ///
          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {
            SUBLOB_NAME: sublobnamecontroller.value,
            SUBLOB_CODE: sublobcodecontroller.value,
            BG_ID: bgnamecontroller.value,
            SBU_ID: sbunamecontroller.value,
            LOB_ID: lobnamecontroller.value,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'sublob/UpdateSubLobMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallsublob();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.editflag = 0
              this.editflag1 = 0
              // this.sbunameNgmodel = null
              // this.buisnessidNgmodel = null
              // this.sbulobnameNgModel = null
              // this.sbulobcodeNgModel = null
              this.onadd = true;
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });

          ////
        }
      })
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
 
  cancel() {
    this.editflag = 0
    this.editflag1 = 0
    this.oneditbtn = false;
    this.onadd = true;
    // this.sbunameNgmodel = null
    // this.buisnessidNgmodel = null
    // this.sbulobnameNgModel = null
    // this.sbulobcodeNgModel = null
    // this.lobdropdownnameNgmodel = null
    this.sublobForm.reset();
  }


}

