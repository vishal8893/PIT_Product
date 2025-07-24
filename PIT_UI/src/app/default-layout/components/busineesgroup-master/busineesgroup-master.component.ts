import { Component, OnInit } from '@angular/core';
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
  selector: 'app-busineesgroup-master',
  templateUrl: './busineesgroup-master.component.html',
  styleUrls: ['./busineesgroup-master.component.css'],
  providers: [MessageService, ConfirmationService]
})


export class BusineesgroupMasterComponent implements OnInit {

  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  materialcodeNgModel: string;
  materialnameNgModel: any;
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
  // lobIds: any;
  activemodel: boolean | null;
  businesssgrupform: FormGroup;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.businesssgrupform = this.formBuilder.group({

      bgnamecontroller: ['', [Validators.required]],
      bgcodecontroller: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    // this.productService.getProductsSmall().then(data => this.products = data);
    // this.Lobid = localStorage.getItem('lobid');
    //  this.crw
    // this.onadd=true;
    this.oneditbtn = false;
    this.getallbusiness();
    // this.getallLob();
  }


  creatform() {

  }
  groupdata: any;
  getallbusiness() {
    this.rest.getAll(this.Global.getapiendpoint() + 'businessgroup/GetAllbusinessgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisuals", this.products)
      }
    });
  }



  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.BG_CODE) {
        this.duplicateroleid = element.ID
      }
      else {
        // (this.roleid !== '' ? this.roleid : '0')
        this.duplicateroleid = '0'
      }

    })

  }


  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true //!this.activemodel;
    }
  }

  creatematerial() {
    const bgnamecontroller = this.businesssgrupform.get('bgnamecontroller');
    const bgcodecontroller = this.businesssgrupform.get('bgcodecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.businesssgrupform.valid) {
      // if (this.materialcodeNgModel && this.materialnameNgModel) {

      var mod: any = {
        BG_CODE: bgnamecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'businessgroup/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {

          this.oneditbtn = false;

          this.handleCheckboxChange()
          var model: any = {
            BG_CODE: bgnamecontroller.value,
            BG_NAME: bgcodecontroller.value,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'businessgroup/CreatebusinessgroupMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              // console.log("data", data);
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.cancel();
              // this.materialcodeNgModel = null
              // this.materialnameNgModel = null
              // this.desmodel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallbusiness();
          });

        }
      })
    }
    else {
      bgnamecontroller.markAsDirty();
      bgcodecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (bgnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Bussiness Group Code is required' });
      }
      if (bgcodecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Bussiness Group Name is required' });
      }
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
    apiUrl = 'businessgroup/DeletebusinessgroupmstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully' });
        // this.displayAddProject3 = false;
        this.getallbusiness();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditbusinessGrp(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.materialcodeNgModel = product.BG_CODE;
    this.businesssgrupform.get('bgnamecontroller').setValue(product.BG_CODE);
    // this.materialnameNgModel = product.BG_NAME;
    this.businesssgrupform.get('bgcodecontroller').setValue(product.BG_NAME);

    this.roleid = product.ID

  }

  updatematerial() {
    const bgnamecontroller = this.businesssgrupform.get('bgnamecontroller');
    const bgcodecontroller = this.businesssgrupform.get('bgcodecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.businesssgrupform.valid) {
    // if (this.materialcodeNgModel && this.materialnameNgModel) {
      var mod: any = {
        BG_CODE: bgnamecontroller.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'businessgroup/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {

            BG_CODE: bgnamecontroller.value,
            BG_NAME: bgcodecontroller.value,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'businessgroup/UpdatebusinessgroupMaster';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallbusiness();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.cancel();
              // this.materialcodeNgModel = null
              // this.materialnameNgModel = null
              // this.desmodel = null
              this.onadd = true;
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



  cancel() {

    this.oneditbtn = false;
    this.onadd = true;
    // this.materialcodeNgModel = null
    // this.materialnameNgModel = null
    // this.desmodel = null
    this.businesssgrupform.reset();
  }


}

// interface City {
//   name: string,
//   code: string
// }


