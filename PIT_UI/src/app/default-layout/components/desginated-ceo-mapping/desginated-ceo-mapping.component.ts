import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
// import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';

@Component({
  selector: 'app-desginated-ceo-mapping',
  templateUrl: './desginated-ceo-mapping.component.html',
  styleUrls: ['./desginated-ceo-mapping.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class DesginatedCeoMappingComponent implements OnInit {

  empNgmodel: any;
  entityNgmodel: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  empid: any;
  entityid: any;
  activemodel: boolean | null;
  ECBMAPID: any;
  desginatetedceoform: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.desginatetedceoform = this.formBuilder.group({

      empnamecontroller: [null, [Validators.required]],
      entitycontroller: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallEntCeoBm();
    this.getallemp();
    this.getallentity();
  }

  creatform() {

  }


 
  groupdata: any;
  getallemp() {

    this.rest.getAll(this.Global.getapiendpoint() + 'desgianatedmap/GetAllEmpgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.empid = Result;
        // console.log("getAllemp", this.empid)
      }
    });
  }

  getallentity() {

    this.rest.getAll(this.Global.getapiendpoint() + 'desgianatedmap/GetAllentitylist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entityid = Result;
        // console.log("getAllEntity", this.entityid)
      }
    });
  }

  getallEntCeoBm() {

    this.rest.getAll(this.Global.getapiendpoint() + 'desgianatedmap/GetAlldesginatedCEOBMlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("GetAlldesginatedCEOBMlist", this.products)
      }
    });
  }

  createEntCeoBm() {
    const empnamecontroller = this.desginatetedceoform.get('empnamecontroller');
    const entitycontroller = this.desginatetedceoform.get('entitycontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.desginatetedceoform.valid) {
    // if (this.empNgmodel && this.entityNgmodel) {
      var mod: any = {
        // EMPLOYEE_ID: this.empNgmodel.ID,
        EMPLOYEE_ID: this.empNgmodel.EMPNO,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'desgianatedmap/CheckDuplicate', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {

          this.oneditbtn = false;

          var model: any = {
            EMPLOYEE_ID: this.empNgmodel.EMPNO,
            EMP_NAME: this.empNgmodel.FIRSTNAME,
            ENTITY_ID: this.entityNgmodel.ID,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'desgianatedmap/CreatdesginatedCEOBM';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntCeoBm();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
              this.cancel();
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallEntCeoBm();
          });
        }
      })
    }
    else {
      empnamecontroller.markAsDirty();
      entitycontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (entitycontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }

  oneditEntCeoBm(product: any) {
    // console.log("product row", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.empNgmodel = { "EMPNO": product.EMPLOYEE_ID, "FIRSTNAME": product.EMP_NAME, };
    this.entityNgmodel = { "ID": product.TBL_ENTITY_MST.ID, "ENTITY_NAME": product.TBL_ENTITY_MST.ENTITY_NAME, };
    this.ECBMAPID = product.ID;
  }

  updateEntCeoBm() {
    const empnamecontroller = this.desginatetedceoform.get('empnamecontroller');
    const entitycontroller = this.desginatetedceoform.get('entitycontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.desginatetedceoform.valid) {
    // if (this.empNgmodel && this.entityNgmodel) {
      var mod: any = {
        // EMPLOYEE_ID: this.empNgmodel.ID,
        EMPLOYEE_ID: this.empNgmodel.EMPNO,
        ID: this.ECBMAPID
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'desgianatedmap/CheckDuplicate', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          var model: any = {

            EMPLOYEE_ID: this.empNgmodel.EMPNO,
            EMP_NAME: this.empNgmodel.FIRSTNAME,
            ENTITY_ID: this.entityNgmodel.ID,
            ID: this.ECBMAPID

          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'desgianatedmap/UpdatedesginatedCEOBM';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntCeoBm();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });

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

  DeleteEntCeoBm(product: any) {
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    var apiUrl = '';
    apiUrl = 'desgianatedmap/DeletedesginatedCEOBMById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallEntCeoBm();
        this.cancel();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    // this.empNgmodel = null;;
    // this.entityNgmodel = null;
    this.desginatetedceoform.reset();
  }

}
