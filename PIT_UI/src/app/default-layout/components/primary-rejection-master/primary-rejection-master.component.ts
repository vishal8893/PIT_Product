import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
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


@Component({
  selector: 'app-primary-rejection-master',
  templateUrl: './primary-rejection-master.component.html',
  styleUrls: ['./primary-rejection-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class PrimaryRejectionMasterComponent implements OnInit {

  products: Product[];
  product: Product;
  primaryRejectform: FormGroup;
  typeid: any;
  catid: any;
  onadd: boolean = true;
  oneditbtn: boolean = false;
  oncancel: boolean = true;
  activemodel: boolean | null;
  roleid: any;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.primaryRejectform = this.formBuilder.group({
      issnamecontroller: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      issDescontroller: ['', [Validators.required]],
      fromdatecontroller: ['', [this.manualDateValidator,Validators.required]],
      tilldatecontroller: ['', [this.manualDateValidator,Validators.required]],
      minbidontroller: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      maxbidcontroller: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      lotcontroller: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      pitypecontroller: ['', [Validators.required]],
      picatcontroller: ['', [Validators.required]],
    })
  }

  

  ngOnInit() {
    this.oneditbtn = false;
    this.getallItradingPrimaryIssues();
    this.getallPITypedata();
    this.getallPICategory();
  }

  manualDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value instanceof Date) {
      return null; // Valid date selected from calendar
    } else {
      return { 'invalidDate': true }; // Date not selected from calendar
    }
  }

  creatform() {
  }

  groupdata: any;
  getallPITypedata() {
    this.rest.getAll(this.Global.getapiendpoint() + 'itradingpi/GetAllPITypeData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.typeid = Result;
        // console.log("getallPITypedata", this.typeid)
      }
    });
  }

  getallPICategory() {
    this.rest.getAll(this.Global.getapiendpoint() + 'itradingpi/GetAllPICategoryData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.catid = Result;
        // console.log("getallPICategory", this.catid)
      }
    });
  }

  getallItradingPrimaryIssues() {
    this.rest.getAll(this.Global.getapiendpoint() + 'itradingpi/GetAllItradingPrimaryIssues').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getallItradingPrimaryIssues", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.CODE) {
        this.duplicateroleid = element.NAME_OF_ISSUE
      }
      else {
        this.duplicateroleid = '0'
      }

    })

  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true
    }
  }

  createpriReject() {
    // debugger;
    const issnamecontroller = this.primaryRejectform.get('issnamecontroller');
    const issDescontroller = this.primaryRejectform.get('issDescontroller');
    const fromdatecontroller = this.primaryRejectform.get('fromdatecontroller');
    const tilldatecontroller = this.primaryRejectform.get('tilldatecontroller');
    const minbidontroller = this.primaryRejectform.get('minbidontroller');
    const maxbidcontroller = this.primaryRejectform.get('maxbidcontroller');
    const lotcontroller = this.primaryRejectform.get('lotcontroller');
    const pitypecontroller = this.primaryRejectform.get('pitypecontroller');
    const picatcontroller = this.primaryRejectform.get('picatcontroller');
    if (this.primaryRejectform.valid) {
      var mod: any = {
        NAME_OF_ISSUE: issnamecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'itradingpi/CheckDuplicate', { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          var model: any = {
            NAME_OF_ISSUE: issnamecontroller.value,
            ISSUE_DESC: issDescontroller.value,
            OPEN_FROM_DATE: fromdatecontroller.value,
            OPEN_TILL_DATE: tilldatecontroller.value,
            MIN_BID_PRICE: minbidontroller.value,
            MAX_BID_PRICE: maxbidcontroller.value,
            LOT_SIZE: lotcontroller.value,
            PRIMARY_ISSUE_TYPE: pitypecontroller.value,
            PRIMARY_ISSUE_CATEGORY: picatcontroller.value
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'itradingpi/CreatItradingPrimaryIssues';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallItradingPrimaryIssues();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.cancel();
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallItradingPrimaryIssues();
          });
        }
      })
    }
    else {
      issnamecontroller.markAsDirty();
      issDescontroller.markAsDirty();
      fromdatecontroller.markAsDirty();
      tilldatecontroller.markAsDirty();
      minbidontroller.markAsDirty();
      maxbidcontroller.markAsDirty();
      lotcontroller.markAsDirty();
      pitypecontroller.markAsDirty();
      picatcontroller.markAsDirty();

      if (issnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Name of Issue Required' });
      }
      if (issDescontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Issue Description Required' });
      }
      if (fromdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Open From Date Required' });
      }
      if (tilldatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Open Till Date Required' });
      }
      if (minbidontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Min Bid Price Required' });
      }
      if (maxbidcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Max Bid Price Required' });
      }
      if (lotcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Lot_Size Required' });
      }
      if (pitypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Primary Issue Type Required' });
      }
      if (picatcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Primary Issue Category Required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  oneditpriReject(product: any) {
    // console.log(product);

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.primaryRejectform.get('issnamecontroller').setValue(product.NAME_OF_ISSUE);
    this.primaryRejectform.get('issDescontroller').setValue(product.ISSUE_DESC);
    const dateParts = product.OPEN_FROM_DATE.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const date = new Date(year, month, day);
    this.primaryRejectform.get('fromdatecontroller').setValue(date);
    const dateParts1 = product.OPEN_TILL_DATE.split('-');
    const year1 = parseInt(dateParts1[0], 10);
    const month1 = parseInt(dateParts1[1], 10) - 1;
    const day1 = parseInt(dateParts1[2], 10);
    const date1 = new Date(year1, month1, day1);
    this.primaryRejectform.get('tilldatecontroller').setValue(date1);
    this.primaryRejectform.get('minbidontroller').setValue(product.MIN_BID_PRICE);
    this.primaryRejectform.get('maxbidcontroller').setValue(product.MAX_BID_PRICE);
    this.primaryRejectform.get('lotcontroller').setValue(product.LOT_SIZE);
    this.primaryRejectform.get('pitypecontroller').setValue(product.PRIMARY_ISSUE_TYPE);
    this.primaryRejectform.get('picatcontroller').setValue(product.PRIMARY_ISSUE_CATEGORY);

    this.roleid = product.ID

  }

  updatepriReject() {
    const issnamecontroller = this.primaryRejectform.get('issnamecontroller');
    const issDescontroller = this.primaryRejectform.get('issDescontroller');
    const fromdatecontroller = this.primaryRejectform.get('fromdatecontroller');
    const tilldatecontroller = this.primaryRejectform.get('tilldatecontroller');
    const minbidontroller = this.primaryRejectform.get('minbidontroller');
    const maxbidcontroller = this.primaryRejectform.get('maxbidcontroller');
    const lotcontroller = this.primaryRejectform.get('lotcontroller');
    const pitypecontroller = this.primaryRejectform.get('pitypecontroller');
    const picatcontroller = this.primaryRejectform.get('picatcontroller');
    if (this.primaryRejectform.valid) {
      var mod: any = {
        NAME_OF_ISSUE: issnamecontroller.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'itradingpi/CheckDuplicate', { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          var model: any = {
            NAME_OF_ISSUE: issnamecontroller.value,
            ISSUE_DESC: issDescontroller.value,
            OPEN_FROM_DATE: fromdatecontroller.value,
            OPEN_TILL_DATE: tilldatecontroller.value,
            MIN_BID_PRICE: minbidontroller.value,
            MAX_BID_PRICE: maxbidcontroller.value,
            LOT_SIZE: lotcontroller.value,
            PRIMARY_ISSUE_TYPE: pitypecontroller.value,
            PRIMARY_ISSUE_CATEGORY: picatcontroller.value,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'itradingpi/UpdateItradingPrimaryIssues';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallItradingPrimaryIssues();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.cancel();
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
      issnamecontroller.markAsDirty();
      issDescontroller.markAsDirty();
      fromdatecontroller.markAsDirty();
      tilldatecontroller.markAsDirty();
      minbidontroller.markAsDirty();
      maxbidcontroller.markAsDirty();
      lotcontroller.markAsDirty();
      pitypecontroller.markAsDirty();
      picatcontroller.markAsDirty();

      if (issnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Name of Issue Required' });
      }
      if (issDescontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Issue Description Required' });
      }
      if (fromdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Open From Date Required' });
      }
      if (tilldatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Open Till Date Required' });
      }
      if (minbidontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Min Bid Price Required' });
      }
      if (maxbidcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Max Bid Price Required' });
      }
      if (lotcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Lot_Size Required' });
      }
      if (pitypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Primary Issue Type Required' });
      }
      if (picatcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Primary Issue Category Required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  deletepriReject(product: any) {
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'itradingpi/DeleteItradingPrimaryIssues';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallItradingPrimaryIssues();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    this.primaryRejectform.reset();
  }


}
