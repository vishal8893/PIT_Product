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

@Component({
  selector: 'app-lob-master',
  templateUrl: './lob-master.component.html',
  styleUrls: ['./lob-master.component.css'],
  providers: [MessageService, ConfirmationService]
})






export class LobMasterComponent implements OnInit {






  customers: any[];







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  lobnameNgmodel: any;
  buisnessidNgmodel: any
  sbunameNgmodel: any;
  businessids: any
  lobcodeNgmodel: any;
  // buisnessidNgmodel: any;
  enddateNgmodel: any;
  namemodel: string;
  codemodel: any;
  desmodel: any;
  roleid: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  finalItems: any[] = [];
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
  // lobForm !: FormGroup;
  // lobIds: any;
  activemodel: boolean | null;
  editflag: number;
  sbunameNgmodel1: any;
  lobForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.lobForm = this.formBuilder.group({

      bgname: [null, [Validators.required]],
      sbuname: [null, [Validators.required]],
      lobname: [null, [Validators.required]],
      lobcode: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);

    this.oneditbtn = false;
    this.editflag = 0;
    this.getalllob();
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

  // getallsbu(){

  // }


  // onchangeevent1(event: any) {


  //   var model: any = {
  //     BG_ID: parseInt(event.ID)
  //   }
  //   console.log("bg model1234:", model);

  //   this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/GetAllSBU/', model).subscribe((data: any) => {
  //     if (data.Success) {
  //       this.finalItems = data.Data
  //       console.log('finalItems1234', this.finalItems)
  //     }
  //   })
  // }

  onchangeevent(selectedValue: any) {
    // debugger;
    this.editflag = 0

    var model: any = {
      BG_ID: selectedValue
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
  lobids: any;
  getalllob() {
    this.rest.getAll(this.Global.getapiendpoint() + 'lobservice/GetAllLobMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getalllob", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.LOB_CODE) {
        this.duplicateroleid = element.ID
      }
      else {
        // (this.roleid !== '' ? this.roleid : '0')
        this.duplicateroleid = '0'
      }

    })

  }

  createBtn() {
    const bgname = this.lobForm.get('bgname');
    const sbuname = this.lobForm.get('sbuname');
    const lobname = this.lobForm.get('lobname');
    const lobcode = this.lobForm.get('lobcode');
    if (this.lobForm.valid) {
      // if (this.lobnameNgmodel && this.lobcodeNgmodel && this.buisnessidNgmodel && this.sbunameNgmodel) {
      var mod: any = {
        LOB_CODE: lobcode.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          // debugger;
          this.oneditbtn = false;
          // console.log("sbunameNgmodel", this.sbunameNgmodel);

          var model: any = {
            LOB_NAME: lobname.value,
            LOB_CODE: lobcode.value,
            BG_ID: bgname.value,
            SBU_ID: sbuname.value,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'lobservice/CreateLobMst';
          // return;
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              // console.log("data", data);
              this.getalllob();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.editflag = 0;
              // this.sbunameNgmodel = null
              // this.buisnessidNgmodel = null
              // this.lobnameNgmodel = null
              // this.lobcodeNgmodel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getalllob();
          });
          ////
        }
      })
    }
    else {
      bgname.markAsDirty();
      sbuname.markAsDirty();
      lobname.markAsDirty();
      lobcode.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (bgname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (sbuname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (lobname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (lobcode.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
  ////

  deletebtn(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'lobservice/DeleteLOBById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getalllob();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditviewbtn(product: any) {
    this.editflag = 1
    // console.log('row', product)
    this.sbunameNgmodel = null
    this.buisnessidNgmodel = null
    this.lobnameNgmodel = null
    this.lobcodeNgmodel = null
    this.sbunameNgmodel1 = null;
    this.onchangeevent(product.BG_ID)
    
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.lobnameNgmodel = product.LOB_NAME;
    this.lobForm.get('lobname').setValue(product.LOB_NAME);
    // this.lobcodeNgmodel = product.LOB_CODE;
    this.lobForm.get('lobcode').setValue(product.LOB_CODE);
    // new Date(product.EXPIRY_DATE)
    // this.buisnessidNgmodel = { "ID": product.TBL_SBU_MST.TBL_BUSINESSGROUP_MST.ID, "BG_NAME": product.TBL_SBU_MST.TBL_BUSINESSGROUP_MST.BG_NAME };
    // this.buisnessidNgmodel = product.BG_ID;
    this.lobForm.get('bgname').setValue(product.BG_ID);
    // this.onchangeevent1(this.buisnessidNgmodel);
    // console.log('Before assignment:', this.sbunameNgmodel);
    // this.sbunameNgmodel1 = { "ID": product.TBL_SBU_MST.ID, "SBU_NAME": product.TBL_SBU_MST.SBU_NAME };
    // console.log('ssdsdads', this.sbunameNgmodel1.SBU_NAME)
    // this.sbunameNgmodel = product.SBU_ID;
    this.lobForm.get('sbuname').setValue(product.SBU_ID);


    // this.buisnessidNgmodel = product.TBL_SBU_MST.TBL_BUSINESSGROUP_MST.ID
    // this.sbunameNgmodel = product.TBL_SBU_MST.ID;

    // console.log('Before assignment:', this.sbunameNgmodel);
    // this.buisnessidNgmodel = new Date(product.STARTDATE);
    // this.sbunameNgmodel = new Date(product.ENDDATE),
    this.roleid = product.ID


  }

  updateBtn() {
    const bgname = this.lobForm.get('bgname');
    const sbuname = this.lobForm.get('sbuname');
    const lobname = this.lobForm.get('lobname');
    const lobcode = this.lobForm.get('lobcode');
    if (this.lobForm.valid) {
    // if (this.lobnameNgmodel && this.lobcodeNgmodel && this.buisnessidNgmodel && this.sbunameNgmodel) {
      var mod: any = {
        LOB_CODE: lobcode.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'lobservice/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {
            LOB_NAME: lobname.value,
            LOB_CODE: lobcode.value,
            BG_ID: bgname.value,
            SBU_ID: sbuname.value,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'lobservice/UpdateLobMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getalllob();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.editflag = 0;
              // this.sbunameNgmodel = null
              // this.buisnessidNgmodel = null
              // this.lobnameNgmodel = null
              // this.lobcodeNgmodel = null
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
  ////




  cancel() {
    this.editflag = 0;
    this.oneditbtn = false;
    this.onadd = true;
    // this.sbunameNgmodel = null
    // this.buisnessidNgmodel = null
    // this.lobnameNgmodel = null
    // this.lobcodeNgmodel = null
    this.lobForm.reset();
  }


}

