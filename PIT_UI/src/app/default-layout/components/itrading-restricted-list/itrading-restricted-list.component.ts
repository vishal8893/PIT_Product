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
  selector: 'app-itrading-restricted-list',
  templateUrl: './itrading-restricted-list.component.html',
  styleUrls: ['./itrading-restricted-list.component.css'],
  providers: [MessageService, ConfirmationService]
})






export class ITradingRestrictedListComponent implements OnInit {

  customers: any[];
  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  scrpitnameNgmodel: any;
  isinnameNgmodel: any;
  startdateNgmodel: any;
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
  // lobIds: any;
  activemodel: boolean | null;
  restrictedform: FormGroup;


  // }

  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.restrictedform = this.formBuilder.group({

      companyNamecontroller: [null, [Validators.required]],
      isincomtroller: [null, [Validators.required]],
      startdatecontroller: [null, [Validators.required]],
      enddatecontroller: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);

    this.oneditbtn = false;
    this.getallrestricted();

  }

  creatform() {

  }
  groupdata: any;
  getallrestricted() {
    this.rest.getAll(this.Global.getapiendpoint() + 'restrict/GetAllrestrictedlistMst').subscribe((data: any) => {
      if (data.Success) {
        this.products = data.Data;
        // console.log("getAllindivisuals", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.SCRIPT_NAME) {
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
  createrestrict() {
    const companyNamecontroller = this.restrictedform.get('companyNamecontroller');
    const isincomtroller = this.restrictedform.get('isincomtroller');
    const startdatecontroller = this.restrictedform.get('startdatecontroller');
    const enddatecontroller = this.restrictedform.get('enddatecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.restrictedform.valid) {
      // if (this.scrpitnameNgmodel && this.isinnameNgmodel && this.startdateNgmodel) {
      var mod: any = {
        SCRIPT_NAME: companyNamecontroller.value,
        ID: 0,
      }
      // console.log("mod", mod)
      this.rest.postParams(this.Global.getapiendpoint() + 'restrict/CheckDuplicate/', mod
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          // debugger;
          this.oneditbtn = false;
          var model: any = {
            SCRIPT_NAME: companyNamecontroller.value,
            ISIN: isincomtroller.value,
            STARTDATE: startdatecontroller.value,
            ENDDATE: enddatecontroller.value,

          }

          // console.log("model", model);
          var apiUrl = '';
          apiUrl = 'restrict/CreaterestrictedListMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              this.getallrestricted();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.cancel();
              // this.enddateNgmodel = null
              // this.startdateNgmodel = null
              // this.scrpitnameNgmodel = null
              // this.isinnameNgmodel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallrestricted();
          });
          ////
        }
      })
    }
    else {
      companyNamecontroller.markAsDirty();
      isincomtroller.markAsDirty();
      startdatecontroller.markAsDirty();
      enddatecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (companyNamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ScripName is required' });
      }
      if (isincomtroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
      }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'StratDate is required' });
      }
      if (enddatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EndDate is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
  ////

  deletegroup(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    var apiUrl = '';
    apiUrl = 'restrict/DeleterestrictedmstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
      // debugger;
      if (data.Success) {

        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getallrestricted();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  onEditgroup(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.scrpitnameNgmodel = product.SCRIPT_NAME;
    this.restrictedform.get('companyNamecontroller').setValue(product.SCRIPT_NAME);
    // this.isinnameNgmodel = product.ISIN;
    this.restrictedform.get('isincomtroller').setValue(product.ISIN);
    // this.startdateNgmodel = new Date(product.STARTDATE);
    this.restrictedform.get('startdatecontroller').setValue(new Date(product.STARTDATE));
    // this.enddateNgmodel = new Date(product.ENDDATE),
    this.restrictedform.get('enddatecontroller').setValue(new Date(product.ENDDATE));
      this.roleid = product.ID

  }

  updaterestrict() {
    const companyNamecontroller = this.restrictedform.get('companyNamecontroller');
    const isincomtroller = this.restrictedform.get('isincomtroller');
    const startdatecontroller = this.restrictedform.get('startdatecontroller');
    const enddatecontroller = this.restrictedform.get('enddatecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.restrictedform.valid) {
    // if (this.scrpitnameNgmodel && this.isinnameNgmodel && this.startdateNgmodel) {
      var mod: any = {
        SCRIPT_NAME: companyNamecontroller.value,
        ID: this.roleid,
      }
      // console.log("mod", mod)
      this.rest.postParams(this.Global.getapiendpoint() + 'restrict/CheckDuplicate/', mod
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {
            SCRIPT_NAME: companyNamecontroller.value,
            ISIN: isincomtroller.value,
            STARTDATE: startdatecontroller.value,
            ENDDATE: enddatecontroller.value,
            ID: this.roleid
          };
          // console.log("model", model);
          var apiUrl = '';
          apiUrl = 'restrict/UpdaterestrictedMaster';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              this.getallrestricted();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.cancel();
              // this.enddateNgmodel = null
              // this.startdateNgmodel = null
              // this.scrpitnameNgmodel = null
              // this.isinnameNgmodel = null
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

    this.oneditbtn = false;
    this.onadd = true;
    // this.enddateNgmodel = null
    // this.startdateNgmodel = null
    // this.scrpitnameNgmodel = null
    // this.isinnameNgmodel = null
    this.restrictedform.reset();
  }






}

