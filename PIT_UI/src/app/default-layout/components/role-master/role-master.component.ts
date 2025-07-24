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
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class RoleMasterComponent implements OnInit {







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
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
  activemodel: boolean = null;
  roleform: FormGroup;
  natureid = [
    { ID: 1, NAME: 'Admin' },
    { ID: 2, NAME: 'Super Admin' },
    { ID: 3, NAME: 'Developer' },
    { ID: 4, NAME: 'User' },
    { ID: 5, NAME: 'Compliance' },
    // { ID: 6, NAME: 'New or proposed innovations, arrangements with strategic partners or launch of new products' },
    // { ID: 7, NAME: 'Litigation/ regulatory proceedings having a material impact on business/ license held' },
    // { ID: 8, NAME: 'Others' },
    // Add more options as needed
  ];
  // [binary]="true"
  // lobIds: any;
  // activemodel: boolean | null;
// }

  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.roleform = this.formBuilder.group({

      rolename: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      Description: ['', [Validators.required]],
      // activecontroller: [this.activemodel,[Validators.required]],
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
    this.rest.getAll(this.Global.getapiendpoint() + 'userrole/GetAllRole').subscribe((data: any) => {
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

  oneditviewbtn(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.namemodel = product.NAME;
    this.codemodel = product.CODE;
    this.desmodel = product.DESCRIPTION;
    this.activemodel = product.IS_ACTIVE,
    this.roleid = product.ID

  }
  // getallLob() {
  //   debugger;
  //   var model: any = {
  //     UserID: this.UserID

  //   }
  //   console.log("model", model);

  //   var apiUrl = '';
  //   apiUrl = 'userrole/stp_GetLOBAdminLOBID6';
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

  // handleCheckboxChange() {
  //   if (this.activemodel === null) {
  //     this.activemodel = false;
  //   } else {
  //     this.activemodel = true //!this.activemodel;
  //   }
  // }
  handleCheckboxChange() {
    this.activemodel = !this.activemodel;
  }

  createBtn() {
    const rolename = this.roleform.get('rolename');
    const code = this.roleform.get('code');
    const Description = this.roleform.get('Description');
    const activecontroller = this.roleform.get('activecontroller');
    if (this.roleform.valid) {
    // if (this.namemodel && this.codemodel) {
      var mod: any = {
        CODE: this.codemodel,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'userrole/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        } 
          else {

            // debugger;
            this.oneditbtn = false;
            // if(this.checks == true){
            // // if(this.checks == true){
            //   var model: any = {
            //     NAME: this.namemodel,
            //     CODE: this.codemodel,
            //     // IsActive: true,
            //     DESCRIPTION: this.desmodel,
            //     IS_ACTIVE:true
            //   }
            // }
            // else{
            // this. handleCheckboxChange()
            var model: any = {

              NAME: this.namemodel,
              CODE: this.codemodel,
              // IsActive: true,
              DESCRIPTION: this.desmodel,
              IS_ACTIVE: activecontroller.value,
            }
            // }
            // this.onadd=true;
            // var model: any = {
            //   NAME: this.namemodel,
            //   CODE: this.codemodel,
            //   // IsActive: true,
            //   DESCRIPTION: this.desmodel,
            //   IS_ACTIVE: this.activemodel
            // };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("rolemodel", encryptmodel);
            var apiUrl = '';
            apiUrl = 'userrole/CreateRole';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallgroup();
                this.cancel();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                this.namemodel = null
                this.codemodel = null
                this.desmodel = null
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getallgroup();
            });
          }
        });
    }
    else {
      rolename.markAsDirty();
      code.markAsDirty();
      Description.markAsDirty();
      activecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (rolename.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Role Name is required' });
      }
      if (code.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Code is required' });
      }
      if (Description.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Description is required' });
      }
      if (activecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'IsActive is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }

  deletebtn(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'userrole/DeleteroleById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
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



  updateBtn() {
    const rolename = this.roleform.get('rolename');
    const code = this.roleform.get('code');
    const Description = this.roleform.get('Description');
    const activecontroller = this.roleform.get('activecontroller');
    if (this.roleform.valid) {
    // if (this.namemodel && this.codemodel) {
      var mod: any = {
        CODE: this.codemodel,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'userrole/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        } 
          else {
            this.oneditbtn = false;
            // this.onadd=true;
            var model: any = {

              NAME: this.namemodel,
              // IsActive: true,
              CODE: this.codemodel,
              DESCRIPTION: this.desmodel,
              IS_ACTIVE: this.activemodel,
              ID: this.roleid
            };
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", encryptmodel);
            var apiUrl = '';
            apiUrl = 'userrole/UpdateRole';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallgroup();
                this.cancel();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
                // this.namemodel = null
                // this.codemodel = null
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
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }

  }

  // getallLob() {
  //   this.rest.getAll(this.Global.getapiendpoint() + 'userrole/GetAlllob').subscribe((data: any) => {
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
    // this.namemodel = null
    // this.codemodel = null
    // this.desmodel = null
    this.activemodel = null;
    this.roleform.reset();
  }


}


function subscribe(arg0: (data: any) => void) {
  throw new Error('Function not implemented.');
}
// interface City {
//   name: string,
//   code: string
// }


