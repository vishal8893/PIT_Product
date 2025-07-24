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
  selector: 'app-sbu-master',
  templateUrl: './sbu-master.component.html',
  styleUrls: ['./sbu-master.component.css'],
  providers: [MessageService, ConfirmationService]
})


export class SbuMasterComponent implements OnInit {







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  sbucodeNgModel: any;
  sbunameNgModel: any;
  desmodel: any;
  roleid: any;
  buisnessidNgmodel: any
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
  businessids: any;
  checks = false;
  // lobIds: any;
  activemodel: boolean | null;
  sbuForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.sbuForm = this.formBuilder.group({


      sbucodecontroller: ['', [Validators.required]],
      sbunamecontroller: ['', [Validators.required]],
      bgnamecontroller: ['', [Validators.required]],
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
    this.getallsbu();
    this.getallbusiness();
  }

  creatform() {
  }

  groupdata: any;
  getallbusiness() {
    this.rest.getAll(this.Global.getapiendpoint() + 'sbuservice/GetAllbusinessgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.businessids = Result;
        // console.log("getAllbusiness", this.businessids)
      }
    });
  }

  getallsbu() {
    this.rest.getAll(this.Global.getapiendpoint() + 'sbuservice/GetAllsbulistMst').subscribe((data: any) => {
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
      if (data == element.SBU_CODE) {
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

  createBtn() {
    const sbucodecontroller = this.sbuForm.get('sbucodecontroller');
    const sbunamecontroller = this.sbuForm.get('sbunamecontroller');
    const bgnamecontroller = this.sbuForm.get('bgnamecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.sbuForm.valid) {
      // if (this.sbucodeNgModel && this.sbunameNgModel && this.buisnessidNgmodel) {
      var mod: any = {
        SBU_CODE: sbucodecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'sbuservice/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          ///
          this.oneditbtn = false;

          this.handleCheckboxChange()
          var model: any = {
            SBU_CODE: sbucodecontroller.value,
            SBU_NAME: sbunamecontroller.value,
            BG_ID: bgnamecontroller.value.ID

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'sbuservice/CreatesbuListMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallsbu();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallsbu();
          });

          ////
        }
      })
    }
    else {
      sbucodecontroller.markAsDirty();
      sbunamecontroller.markAsDirty();
      bgnamecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (sbucodecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (sbunamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      if (bgnamecontroller.invalid) {
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
    apiUrl = 'sbuservice/DeletesbumstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getallsbu();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditViewBtn(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.sbucodeNgModel = product.SBU_CODE;
    this.sbuForm.get('sbucodecontroller').setValue(product.SBU_CODE);
    // this.sbunameNgModel = product.SBU_NAME;
    this.sbuForm.get('sbunamecontroller').setValue(product.SBU_NAME);
    // this.buisnessidNgmodel = { "ID": product.TBL_BUSINESSGROUP_MST.ID, "BG_NAME": product.TBL_BUSINESSGROUP_MST.BG_NAME, };
    this.sbuForm.get('bgnamecontroller').setValue({ "ID": product.TBL_BUSINESSGROUP_MST.ID, "BG_NAME": product.TBL_BUSINESSGROUP_MST.BG_NAME, });

    this.roleid = product.ID

  }

  updateBtn() {
    const sbucodecontroller = this.sbuForm.get('sbucodecontroller');
    const sbunamecontroller = this.sbuForm.get('sbunamecontroller');
    const bgnamecontroller = this.sbuForm.get('bgnamecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.sbuForm.valid) {
    // if (this.sbucodeNgModel && this.sbunameNgModel && this.buisnessidNgmodel) {
      var mod: any = {
        SBU_CODE: sbucodecontroller.value,
        ID: this.roleid,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'sbuservice/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          ///

          this.oneditbtn = false;
          // this.onadd=true;
          var model: any = {

            SBU_CODE: sbucodecontroller.value,
            SBU_NAME: sbunamecontroller.value,
            BG_ID: bgnamecontroller.value.ID,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'sbuservice/UpdatesbuMaster';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.getallsbu();
              this.cancel();
              

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

    this.oneditbtn = false;
    this.onadd = true;
    // this.sbucodeNgModel = null;;
    // this.sbunameNgModel = null;
    // this.buisnessidNgmodel = null;
    // this.desmodel = null
    this.sbuForm.reset();
  }


}

// interface City {
//   name: string,
//   code: string
// }


