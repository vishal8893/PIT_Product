import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import * as _Moment from 'moment';

@Component({
  selector: 'app-entity-materialsubsidiary-ceo-bh-mapping-master',
  templateUrl: './entity-materialsubsidiary-ceo-bh-mapping-master.component.html',
  styleUrls: ['./entity-materialsubsidiary-ceo-bh-mapping-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class EntityMaterialsubsidiaryCeoBhMappingMasterComponent implements OnInit {

  empNgmodel: any;
  entityNgmodel: any;
  materialNgmodel: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  empid: any;
  materialid: any;
  activemodel: boolean | null;
  ENTMATSUBID: any;
  EntMateform: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.EntMateform = this.formBuilder.group({
      empcontroller: [null, Validators.required],
      entitycontroller: [null, Validators.required],
      materialcontroller: [null, Validators.required],
    });
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallemp();
    this.getallmaterial();
    this.getallEntityMaterial();
  }

  creatform() {

  }

  groupdata: any;
  getallemp() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entmaterialsub/GetAllEmpgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.empid = Result;
        // console.log("getAllemp", this.empid);
      }
    });
  }

  getallmaterial() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entmaterialsub/GetAllmateriallist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.materialid = Result;
        // console.log("getAllMateriallist", this.materialid);

      }
    });
  }

  getallEntityMaterial() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entmaterialsub/GetAllEntMatSubCEOBHlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllEntMaterialindivisuals", this.products)
      }
    });
  }

  finalItems: any;
  onchangeevententity(entid: any) {
    var model: any = {
      EMPLOYEE_ID: entid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    // console.log("model entity", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'entmaterialsub/GetAllentitylist/', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finalItems = Result
        // console.log('entityitem', this.finalItems)
      }
    })
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.EMPLOYEE_ID) {
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
      this.activemodel = true;
    }
  }

  createEntmaterial() {
    const empcontroller = this.EntMateform.get('empcontroller');
    const entitycontroller = this.EntMateform.get('entitycontroller');
    const materialcontroller = this.EntMateform.get('materialcontroller');
    if (this.EntMateform.valid) {
    // if (this.empNgmodel && this.entityNgmodel && this.materialNgmodel) {
      var mod: any = {
        EMPLOYEE_ID: empcontroller.value?.EMPNO,
        // EMPLOYEE_ID: empcontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'entmaterialsub/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("EMPLOYEE_ID already exist")
        }
        else {

          this.oneditbtn = false;

          this.handleCheckboxChange()
          var model: any = {
            EMPLOYEE_ID: empcontroller.value?.EMPNO,
            EMP_NAME: empcontroller.value?.FIRSTNAME,
            ENTITY_ID: entitycontroller.value,
            MATERIAL_ID: materialcontroller.value.ID,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'entmaterialsub/CreatEntMatSubCEOBH';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntityMaterial();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallEntityMaterial();
          });
        }
      })
    }
    else {
      empcontroller.markAsDirty();
      entitycontroller.markAsDirty();
      materialcontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (entitycontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity is required' });
      }
      if (materialcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Materialsubsidiary is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  // oneditEntmaterial(product: any) {
  //   console.log("product row", product);
  //   this.oneditbtn = true;
  //   this.onadd = false;
  //   this.oncancel = true;
  //   this.empNgmodel = product.EMPLOYEE_ID;
  //   this.entityNgmodel = product.ENTITY_ID;
  //   this.materialNgmodel = { "ID": product.TBL_MATERIALSUBSIDIARY_MST.ID, "MATERIALSUBSIDIARY_NAME": product.TBL_MATERIALSUBSIDIARY_MST.MATERIALSUBSIDIARY_NAME, };
  //   this.onchangeevententity(product.EMPLOYEE_ID);
  //   this.ENTMATSUBID = product.ID;
  // }
  initialEmployeeID: number;
  oneditEntmaterial(product: any) {
    // console.log("product row", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // Store the initial employee ID
    this.initialEmployeeID = product.EMPLOYEE_ID;
    // this.empNgmodel = product.EMPLOYEE_ID;
    this.EntMateform.get('empcontroller').setValue({ "EMPNO": product.EMPLOYEE_ID, "FIRSTNAME": product.EMP_NAME, });
    // this.entityNgmodel = product.ENTITY_ID;
    this.EntMateform.get('entitycontroller').setValue(product.ENTITY_ID);
    // this.materialNgmodel = { "ID": product.TBL_MATERIALSUBSIDIARY_MST.ID, "MATERIALSUBSIDIARY_NAME": product.TBL_MATERIALSUBSIDIARY_MST.MATERIALSUBSIDIARY_NAME, };
    this.EntMateform.get('materialcontroller').setValue({ "ID": product.TBL_MATERIALSUBSIDIARY_MST.ID, "MATERIALSUBSIDIARY_NAME": product.TBL_MATERIALSUBSIDIARY_MST.MATERIALSUBSIDIARY_NAME, });
    this.onchangeevententity(product.EMPLOYEE_ID);
    this.ENTMATSUBID = product.ID;
  }

  // updateEntmaterial() {
  //   if (this.empNgmodel && this.entityNgmodel && this.materialNgmodel) {
  //     var mod: any = {
  //       EMPLOYEE_ID: this.empNgmodel,
  //       ID: 0,
  //     }
  //     console.log("mod", mod)
  //     this.rest.postParams(this.Global.getapiendpoint() + 'entmaterialsub/CheckDuplicate/', mod
  //     ).subscribe((data: any) => {
  //       if (data.Data) {
  //         alert("EMPLOYEE_ID already exist")
  //       }
  //       else {

  //         this.oneditbtn = false;

  //         var model: any = {
  //           EMPLOYEE_ID: this.empNgmodel,
  //           ENTITY_ID: this.entityNgmodel,
  //           MATERIAL_ID: this.materialNgmodel.ID,
  //           ID: this.ENTMATSUBID
  //         };
  //         console.log("model", model);
  //         var apiUrl = '';
  //         apiUrl = 'entmaterialsub/UpdateEntMatSubCEOBH';
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             this.getallEntityMaterial();
  //             this.cancel();
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });

  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //         });
  //       }
  //     })
  //   }
  //   else {
  //     this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
  //   }
  // }
  updateEntmaterial() {
    const empcontroller = this.EntMateform.get('empcontroller');
    const entitycontroller = this.EntMateform.get('entitycontroller');
    const materialcontroller = this.EntMateform.get('materialcontroller');
    if (this.EntMateform.valid) {
    // if (this.empNgmodel && this.entityNgmodel && this.materialNgmodel) {
      // Check if EMPLOYEE_ID has changed or not
      if (this.initialEmployeeID === empcontroller.value?.EMPNO) {
        // If EMPLOYEE_ID remains unchanged or it's a new record, allow the update to proceed
        this.oneditbtn = false;
        var model: any = {
          EMPLOYEE_ID: empcontroller.value?.EMPNO,
          EMP_NAME: empcontroller.value?.FIRSTNAME,
          ENTITY_ID: entitycontroller.value,
          MATERIAL_ID: materialcontroller.value.ID,
          ID: this.ENTMATSUBID
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", encryptmodel);
        var apiUrl = '';
        apiUrl = 'entmaterialsub/UpdateEntMatSubCEOBH';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallEntityMaterial();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
      } else {
        // If EMPLOYEE_ID has changed, show an alert and prevent the update
        alert("Employee ID cannot be changed. Please keep the employee ID unchanged.");
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  DeleteEntmaterial(product: any) {
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'entmaterialsub/DeleteEntMatSubCEOBH';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallEntityMaterial();
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
    // this.materialNgmodel = null;
    this.EntMateform.reset();
  }

}
