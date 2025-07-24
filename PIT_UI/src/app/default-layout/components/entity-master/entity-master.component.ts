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
  selector: 'app-entity-master',
  templateUrl: './entity-master.component.html',
  styleUrls: ['./entity-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class EntityMasterComponent implements OnInit {







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  entitycodeNgModel: string;
  entitynameNgModel: any;
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
  Entityform: FormGroup;
// }

  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.Entityform = this.formBuilder.group({

      enititycodecontroller: ['', [Validators.required]],
      enititynamecontroller: ['', [Validators.required]],
  
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
    this.getallEntity();
    this.getalluser();
  }

  creatform() {
  }

  groupdata: any;
  getallEntity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entity/GetAllentitylistMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisuals", this.products)
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


  // duplicateroleid: any;
  // coderoleCheckduplicateID(data: any) {
  //   this.products.forEach((element: any) => {
  //     if (data == element.ENTITY_CODE) {
  //       this.duplicateroleid = element.ID
  //     }
  //     else {
  //       // (this.roleid !== '' ? this.roleid : '0')
  //       this.duplicateroleid = '0'
  //     }

  //   })

  // }



  createentity() {
    const enititycodecontroller = this.Entityform.get('enititycodecontroller');
    const enititynamecontroller = this.Entityform.get('enititynamecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.Entityform.valid) {
    // if (this.entitycodeNgModel && this.entitynameNgModel) {
      var mod: any = {
        ENTITY_CODE: enititycodecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                                 
      // console.log("mod", encryptmodel)

      this.rest.postParams(this.Global.getapiendpoint() + 'entity/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          ///

          this.oneditbtn = false;

          this.handleCheckboxChange()
          var model: any = {
            ENTITY_CODE: enititycodecontroller.value,
            ENTITY_NAME: enititynamecontroller.value,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                 
          // console.log("model", encryptmodel);

          var apiUrl = '';
          apiUrl = 'entity/CreateentityListMst';

          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntity();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.cancel();
              // this.entitycodeNgModel = null
              // this.entitynameNgModel = null
              // this.desmodel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallEntity();
          });
          ////
        }
      })
    }
    else {
      enititycodecontroller.markAsDirty();
      enititynamecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (enititycodecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      }
      if (enititynamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }


  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.duplicateroleid = '0';
    this.products.forEach((element: any) => {
      if (data === element.ENTITY_CODE) {
        this.duplicateroleid = element.ID;
      }
    });
  }




  // createentity() {
  //   if (this.entitycodeNgModel && this.entitynameNgModel) {
  //     this.coderoleCheckduplicateID(this.entitycodeNgModel);

  //     this.rest.checkDuplicate(
  //       this.Global.getapiendpoint() + 'entity/CheckDuplicateentity/',
  //       this.entitycodeNgModel,
  //       this.duplicateroleid
  //     ).subscribe((data: any) => {
  //       if (data.Data) {
  //         alert("Already exists"); // Show an alert or handle duplicate entity code case
  //       } else {
  //         // Continue with creating the entity

  //         this.oneditbtn = false;
  //         this.handleCheckboxChange();

  //         var model: any = {
  //           ENTITY_CODE: this.entitycodeNgModel,
  //           ENTITY_NAME: this.entitynameNgModel,
  //           // ... Other properties
  //         };

  //         console.log("model", model);
  //         var apiUrl = 'entity/CreateentityListMst';
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             this.getallEntity();
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //             this.entitycodeNgModel = null;
  //             this.entitynameNgModel = null;
  //             this.desmodel = null;
  //           } else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //           this.getallEntity();
  //         });
  //       }
  //     });
  //   } else {
  //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in the fields' });
  //   }
  // }


  deleteentity(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                             
    var apiUrl = '';
    apiUrl = 'entity/DeletegreymstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getallEntity();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }


  

  oneditentity(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.entitycodeNgModel = product.ENTITY_CODE;
    this.Entityform.get('enititycodecontroller').setValue(product.ENTITY_CODE);
    // this.entitynameNgModel = product.ENTITY_NAME;
    this.Entityform.get('enititynamecontroller').setValue(product.ENTITY_NAME);

    this.roleid = product.ID

  }

  updateentity() {
    const enititycodecontroller = this.Entityform.get('enititycodecontroller');
    const enititynamecontroller = this.Entityform.get('enititynamecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.Entityform.valid) {
    // if (this.entitycodeNgModel && this.entitynameNgModel) {

      var mod: any = {
        ENTITY_CODE: enititycodecontroller.value,
        ID: this.roleid
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                                             
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'entity/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {

            ENTITY_CODE: enititycodecontroller.value,
            ENTITY_NAME: enititynamecontroller.value,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             
          // console.log("model", encryptmodel);

          var apiUrl = '';
          apiUrl = 'entity/UpdateentityMaster';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntity();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              // this.entitycodeNgModel = null
              // this.entitynameNgModel = null
              // this.desmodel = null
              this.cancel();
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
    // this.entitycodeNgModel = null
    // this.entitynameNgModel = null
    // this.desmodel = null
    this.Entityform.reset();
  }

  getalluser() {
    this.rest.getAll(this.Global.getapiendpoint() + 'eahemail/GetallUser').subscribe((data: any) => {
      if (data.Success) {
     
      }
    });
  }
}

// interface City {
//   name: string,
//   code: string
// }


