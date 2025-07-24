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
  selector: 'app-materialsubdiary-master',
  templateUrl: './materialsubdiary-master.component.html',
  styleUrls: ['./materialsubdiary-master.component.css'],
  providers: [MessageService, ConfirmationService]
})


export class MaterialsubdiaryMasterComponent implements OnInit {







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
  m3andmaterailsubdairyform: FormGroup;
// }
  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.m3andmaterailsubdairyform = this.formBuilder.group({

      Materialsubsidiarycode: ['', [Validators.required]],
      Materialsubsidiaryname: ['', [Validators.required]],
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
    this.getallmaterialsubdairy();
    // this.getallLob();
  }

  creatform() {

  }
  groupdata: any;
  getallmaterialsubdairy() {
    this.rest.getAll(this.Global.getapiendpoint() + 'materialsubdiary/GetAllmaterialsubdairylistMst').subscribe((data: any) => {
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
      if (data == element.MATERIALSUBSIDIARY_CODE) {
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
    const Materialsubsidiarycode = this.m3andmaterailsubdairyform.get('Materialsubsidiarycode');
    const Materialsubsidiaryname = this.m3andmaterailsubdairyform.get('Materialsubsidiaryname');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.m3andmaterailsubdairyform.valid){
    // if (this.materialcodeNgModel && this.materialnameNgModel) {
      var mod: any = {
        MATERIALSUBSIDIARY_CODE: Materialsubsidiarycode.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                                            
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'materialsubdiary/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        } 
          else {

            this.oneditbtn = false;

            this.handleCheckboxChange()
            var model: any = {
              MATERIALSUBSIDIARY_CODE: Materialsubsidiarycode.value,
              MATERIALSUBSIDIARY_NAME: Materialsubsidiaryname.value,

            }
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
            // console.log("model", encryptmodel);
            var apiUrl = '';
            apiUrl = 'materialsubdiary/CreatematerialsubdairyListMst';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallmaterialsubdairy();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                this.cancel();
                // this.materialcodeNgModel = null
                // this.materialnameNgModel = null
                // this.desmodel = null
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getallmaterialsubdairy();
            });

          }
        })
    }
    else {
      Materialsubsidiarycode.markAsDirty();
      Materialsubsidiaryname.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (Materialsubsidiarycode.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Materialsubsidiary Code is required' });
      }
      if (Materialsubsidiaryname.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Materialsubsidiary Name is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }

  deletematerial(product: any) {
    // debugger
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                      
                      
    var apiUrl = '';
    apiUrl = 'materialsubdiary/DeletematerialsubdairymstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      // debugger;
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        // this.displayAddProject3 = false;
        this.getallmaterialsubdairy();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        // this.displayAddProject3 = false;
      }
    })
  }

  oneditmaterial(product: any) {

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.materialcodeNgModel = product.MATERIALSUBSIDIARY_CODE;
    this.m3andmaterailsubdairyform.get('Materialsubsidiarycode').setValue(product.MATERIALSUBSIDIARY_CODE);
    // this.materialnameNgModel = product.MATERIALSUBSIDIARY_NAME;
    this.m3andmaterailsubdairyform.get('Materialsubsidiaryname').setValue(product.MATERIALSUBSIDIARY_NAME);

    this.roleid = product.ID

  }


  updatematerial() {
    const Materialsubsidiarycode = this.m3andmaterailsubdairyform.get('Materialsubsidiarycode');
    const Materialsubsidiaryname = this.m3andmaterailsubdairyform.get('Materialsubsidiaryname');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.m3andmaterailsubdairyform.valid){
    // if (this.materialcodeNgModel && this.materialnameNgModel) {
      // if (this.materialcodeNgModel && this.materialnameNgModel) {
        var mod: any = {
          MATERIALSUBSIDIARY_CODE: Materialsubsidiarycode.value ,
          ID: this.roleid,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                                           
        // console.log("mod", encryptmodel)
        this.rest.postParams(this.Global.getapiendpoint() + 'materialsubdiary/CheckDuplicate/',  { encryptmodel: encryptmodel } 
        ).subscribe((data: any) => {
          if (data.Data) {
            alert("already exist")
          } 
            else {
              this.oneditbtn = false;
              // this.onadd=true;
              var model: any = {

                MATERIALSUBSIDIARY_CODE: Materialsubsidiarycode.value,
                MATERIALSUBSIDIARY_NAME: Materialsubsidiaryname.value,
                ID: this.roleid
              };
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                           
              // console.log("model", encryptmodel);
              var apiUrl = '';
              apiUrl = 'materialsubdiary/UpdatematerialsubdairyMaster';
              this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getallmaterialsubdairy();
                  this.cancel();
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
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
      }
    // }
  }


  cancel() {

    this.oneditbtn = false;
    this.onadd = true;
    // this.materialcodeNgModel = null
    // this.materialnameNgModel = null
    // this.desmodel = null
    this.m3andmaterailsubdairyform.reset();
  }


  // interface City {
  //   name: string,
  //   code: string
  // }

}
