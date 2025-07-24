import { Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';

@Component({
  selector: 'app-expiraydate-master',
  templateUrl: './expiraydate-master.component.html',
  styleUrls: ['./expiraydate-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class ExpiraydateMasterComponent implements OnInit {




  expdate: any;
  // cities: City[];
  // selectedCity: City;
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
  activemodel: boolean = false;
  expairyform: FormGroup;
  // lobIds: any;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.expairyform = this.formBuilder.group({

      expairydatecontroller: [null, [Validators.required]],
      // activecontroller: [false, [Validators.required]],
      // activecontroller: [this.activemodel],
      activecontroller: [
        this.activemodel,
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

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    // this.productService.getProductsSmall().then(data => this.products = data);
    // this.Lobid = localStorage.getItem('lobid');
    //  this.crw
    // this.onadd=true;
    this.oneditbtn = false;
    this.getallgroup();
    // this.getallLob();
    this.activemodel = false
  }

  creatform() {

  }

  groupdata: any;
  getallgroup() {
    this.rest.getAll(this.Global.getapiendpoint() + 'expiraydate/GetAllActiveexpirydate').subscribe((data: any) => {
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
      if (data == element.CODE) {
        this.duplicateroleid = element.ID
      }
      else {
        // (this.roleid !== '' ? this.roleid : '0')
        this.duplicateroleid = '0'
      }

    })

  }


  // getallLob() {
  //   debugger;
  //   var model: any = {
  //     UserID: this.UserID

  //   }
  //   console.log("model", model);

  //   var apiUrl = '';
  //   apiUrl = 'expiraydate/stp_GetLOBAdminLOBID6';
  //   this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //     if (data.Success) {
  //       console.log('lobIds', data);
  //       this.lobIds = data.Data;
  //       console.log('lobIds', this.lobIds);
  //       this.finalid = this.lobIds[0].lob_id
  //       console.log(' this.finalid', this.finalid);

  //     }
  //   });
  // }


  createExpiraydatebtn() {
    // debugger;
    const expairydatecontroller = this.expairyform.get('expairydatecontroller');
    const activecontroller = this.expairyform.get('activecontroller');
    if (this.expairyform.valid) {
    // if (this.expdate) {

      var mod: any = {
        EXPIRY_DATE: expairydatecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                      
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'expiraydate/CheckDuplicate/',  { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        // var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (data.Data){ 
        // if(Result){
          alert("already exist")
        } 
        else{

      // debugger;
      this.oneditbtn = false;
      // this.onadd=true;
      var model: any = {
        EXPIRY_DATE: expairydatecontroller.value,
        IS_ACTIVE: this.activemodel
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", encryptmodel);
      var apiUrl = '';
      apiUrl = 'expiraydate/CreateExpiraydate';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallgroup();
          this.cancel();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
          // this.expdate = null;

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
        this.getallgroup();
      });
    }
  })
    }
    else {
      expairydatecontroller.markAsDirty();
      activecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (expairydatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ExpiryDate is required' });
      }
      if (activecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'IsActive is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }



  deletegroup(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                        
    var apiUrl = '';
    apiUrl = 'expiraydate/DeleteroleById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully' });
        // this.displayAddProject3 = false;
        this.getallgroup(); 
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }



  onupdateExpiraydatebtn(product: any) {
    // debugger;
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;

    // this.expdate = new Date(product.EXPIRY_DATE); //product.EXPIRY_DATE;
    this.expairyform.get('expairydatecontroller').setValue(new Date(product.EXPIRY_DATE));
    // this.codemodel = product.CODE;
    // this.desmodel = product.DESCRIPTION;
    this.roleid = product.ID,
      // this.activemodel = product.IS_ACTIVE
      this.expairyform.get('activecontroller').setValue(product.IS_ACTIVE);
    // this.LOBID = { "LOB": product.tbl_LobMaster.LOB, "ID": product.tbl_LobMaster.ID };
  }



  updateExpiraydatebtn() {
    const expairydatecontroller = this.expairyform.get('expairydatecontroller');
    const activecontroller = this.expairyform.get('activecontroller');
    if (this.expairyform.valid) {
    // if (this.expdate) {

      var mod: any = {
        EXPIRY_DATE: expairydatecontroller.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'expiraydate/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        // var Result = JSON.parse(this.Global.decrypt1(data.Data));
        if (data.Data) {
        // if (Result){
          alert("already exist")
        } 
        else{
      this.oneditbtn = false;
      // this.onadd=true;
      var model: any = {
        EXPIRY_DATE: expairydatecontroller.value,
        IS_ACTIVE: this.activemodel,
        ID: this.roleid
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
      // console.log("model", encryptmodel);
      var apiUrl = '';
      apiUrl = 'expiraydate/UpdateexpiryMaster';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallgroup();
          this.cancel();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
          // this.expdate = null
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
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }



  deletebtn(product: any) {
    debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                      
    var apiUrl = '';
    apiUrl = 'expiraydate/DeleteroleById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel }).subscribe((data: any) => {
      // debugger;
      // console.log(data.Success);
      
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully' });
        
        // this.displayAddProject3 = false;
        this.getallgroup();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }



  // getallLob() {
  //   this.rest.getAll(this.Global.getapiendpoint() + 'expiraydate/GetAlllob').subscribe((data: any) => {
  //     if (data.Success) {
  //       console.log('lobIds', data.Data);
  //       this.lobIds = data.Data;
  //       // this.finalid = this.lobIds.ID
  //       console.log('lobIds', data.Data);

  //     }
  //   });
  // }

  cancel() {

    this.oneditbtn = false;
    this.onadd = true;
    // this.expdate = null
    // this.activemodel = null
    this.expairyform.reset();

  }




  // interface City {
  //   name: string,
  //   code: string
  // }





}
