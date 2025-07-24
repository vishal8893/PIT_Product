import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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
  selector: 'app-itrading-primary-issue-master',
  templateUrl: './itrading-primary-issue-master.component.html',
  styleUrls: ['./itrading-primary-issue-master.component.css'],
  providers: [MessageService, ConfirmationService]
})






export class ItradingPrimaryIssueMasterComponent implements OnInit {

  customers: any[];
  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  employeecodeNgmodel: any;
  ipoidNgmodel: any;
  iponameNgmodel: any;
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
  primaryissueform: FormGroup;
// }

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.primaryissueform = this.formBuilder.group({

      empcontroller: ['', [Validators.required]],
      ipoidcontroller: ['', [Validators.required]],
      iponamecontroller: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);

    this.oneditbtn = false;
    this.getallprimaryissue();

  }

  creatform() {

  }
  groupdata: any;
  getallprimaryissue() {
    this.rest.getAll(this.Global.getapiendpoint() + 'primaryissue/GetAllprimaryissuerejectionlistMst').subscribe((data: any) => {
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
        this.duplicateroleid = element.EMPLOYEE_CODE
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

  createprimaryissue() {
    const empcontroller = this.primaryissueform.get('empcontroller');
    const ipoidcontroller = this.primaryissueform.get('ipoidcontroller');
    const iponamecontroller = this.primaryissueform.get('iponamecontroller');
    if (this.primaryissueform.valid) {
    // if (this.employeecodeNgmodel && this.ipoidNgmodel && this.iponameNgmodel) {
      var mod: any = {
        EMPLOYEE_CODE: empcontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                                             
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'primaryissue/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        } 
          else {
            ///
            // debugger;
            this.oneditbtn = false;
            var model: any = {
              EMPLOYEE_CODE: empcontroller.value,
              IPOID: ipoidcontroller.value,
              IPO_NAME: iponamecontroller.value,
            }
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", encryptmodel);
            var apiUrl = '';
            apiUrl = 'primaryissue/CreatprimaryissueListMst';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallprimaryissue();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                this.cancel();
                // this.enddateNgmodel = null
                // this.iponameNgmodel = null
                // this.employeecodeNgmodel = null
                // this.ipoidNgmodel = null
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getallprimaryissue();
            });
            ////
          }
        })
    }
    else {
      empcontroller.markAsDirty();
      ipoidcontroller.markAsDirty();
      iponamecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Employee Code is required' });
      }
      if (ipoidcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'IPOID is required' });
      }
      if (iponamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'IPO Name is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
  ////

  deleteprimaryissue(product: any) {
    // debugger
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                      

    var apiUrl = '';
    apiUrl = 'primaryissue/DeleteprimaryissuerejctionById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully' });
        // this.displayAddProject3 = false;
        this.getallprimaryissue();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditprimaryissue(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.employeecodeNgmodel = product.EMPLOYEE_CODE;
    this.primaryissueform.get('empcontroller').setValue(product.EMPLOYEE_CODE);
    // this.ipoidNgmodel = product.IPOID;
    this.primaryissueform.get('ipoidcontroller').setValue(product.IPOID);
    // this.iponameNgmodel = product.IPO_NAME;
    this.primaryissueform.get('iponamecontroller').setValue(product.IPO_NAME);

    this.roleid = product.ID

  }

  updateprimaryissue() {
    const empcontroller = this.primaryissueform.get('empcontroller');
    const ipoidcontroller = this.primaryissueform.get('ipoidcontroller');
    const iponamecontroller = this.primaryissueform.get('iponamecontroller');
    if (this.primaryissueform.valid){
    // if (this.employeecodeNgmodel && this.ipoidNgmodel && this.iponameNgmodel) {
      var mod: any = {
        EMPLOYEE_CODE: empcontroller.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));            
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'primaryissue/CheckDuplicate/',  { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        } 
        else {
      this.oneditbtn = false;
      // this.onadd=true;
      var model: any = {
        EMPLOYEE_CODE: empcontroller.value,
        IPOID: ipoidcontroller.value,
        IPO_NAME: iponamecontroller.value,
        ID: this.roleid
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));  
      // console.log("model", encryptmodel);
      var apiUrl = '';
      apiUrl = 'primaryissue/Updateprimaryissuerejection';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallprimaryissue();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
          this.cancel();
          // this.enddateNgmodel = null
          // this.iponameNgmodel = null
          // this.employeecodeNgmodel = null
          // this.ipoidNgmodel = null
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
    // this.iponameNgmodel = null
    // this.employeecodeNgmodel = null
    // this.ipoidNgmodel = null
    this.primaryissueform.reset();
  }


}

