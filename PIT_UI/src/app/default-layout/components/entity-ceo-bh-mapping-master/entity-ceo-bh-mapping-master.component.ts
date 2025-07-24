import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
// import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product, Product1 } from 'src/app/common/product';
import * as _Moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-entity-ceo-bh-mapping-master',
  templateUrl: './entity-ceo-bh-mapping-master.component.html',
  styleUrls: ['./entity-ceo-bh-mapping-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class EntityCeoBhMappingMasterComponent implements OnInit {

  empNgmodel: any;
  entityNgmodel: any;
  products: Product[];
  products1: Product1[];
  product: Product;
  // product1: Product1;
  selectedProducts: Product[];
  selectedProducts1: Product[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  empid: any;
  entityid: any;
  // activemodel: boolean | null;
  ECBMAPID: any;
  activemodel: boolean = false;
  desginatetedceoform: FormGroup;



  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.desginatetedceoform = this.formBuilder.group({
      empnamecontroller: ['', Validators.required],
      entitycontroller: ['', Validators.required],
      activecontroller: [''],
    });

  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallemp();
    this.getallentity();
    this.getallEntCeoBm();
    this.getalldesginatedCeoBm();
  }

  creatform() {

  }

  groupdata: any;
  getallemp() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entceobhmapping/GetAllEmpgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.empid = Result;
        // console.log("getAllemp", this.empid)
      }
    });
  }

  getallentity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entceobhmapping/GetAllentitylist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entityid = Result;
        // console.log("getAllEntity", this.entityid)
      }
    });
  }

  getalldesginatedCeoBm() {

    this.rest.getAll(this.Global.getapiendpoint() + 'desgianatedmap/GetAlldesginatedCEOBMlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products1 = Result;
        // console.log("GetAlldesginatedCEOBMlist", this.products1)
      }
    });
  }

  getallEntCeoBm() {
    this.rest.getAll(this.Global.getapiendpoint() + 'entceobhmapping/GetAllEntCEOBMlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllEntCEOBMindivisuals", this.products)
      }
    });
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

  // createEntCeoBm() { 
  //   if (this.empNgmodel && this.entityNgmodel) {

  //     this.oneditbtn = false;

  //     var model: any = {
  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       ENTITY_ID: this.entityNgmodel.ID,

  //     }

  //     console.log("model", model);
  //     var apiUrl = '';
  //     apiUrl = 'entceobhmapping/CreatEntCEOBM';

  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallEntCeoBm();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         this.cancel();
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //       this.getallEntCeoBm();
  //     });
  //   }
  //   else {
  //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
  //   }
  // }
  createEntCeoBm() {
    // debugger;
    const empnamecontroller = this.desginatetedceoform.get('empnamecontroller');
    const entitycontroller = this.desginatetedceoform.get('entitycontroller');
    if (this.activemodel == false) {
      if (this.desginatetedceoform.valid) {
        // if (this.empNgmodel && this.entityNgmodel) {
        var mod: any = {
          // EMPLOYEE_ID: this.empNgmodel.ID,
          EMPLOYEE_ID: this.empNgmodel.EMPNO,
          ID: 0,
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
        // console.log("mod", encryptmodel)
        this.rest.postParams(this.Global.getapiendpoint() + 'entceobhmapping/CheckDuplicate/', { encryptmodel: encryptmodel } 
        ).subscribe((data: any) => {
          if (data.Data) {
            alert("EMPLOYEE_ID already exist")
          }
          else {

            this.oneditbtn = false;

            this.handleCheckboxChange()
            var model: any = {
              EMPLOYEE_ID: this.empNgmodel.EMPNO,
              EMP_NAME: this.empNgmodel.FIRSTNAME,
              ENTITY_ID: this.entityNgmodel.ID,

            }
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", encryptmodel);
            // console.log(this.activemodel);



            var apiUrl = '';
            apiUrl = 'entceobhmapping/CreatEntCEOBM';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallEntCeoBm();
                // this.activemodel == false;
                this.activemodel = false;

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
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
        }
        if (entitycontroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
        }
        this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
      }
    }
    else {
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
                this.getalldesginatedCeoBm();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                this.cancel();
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getalldesginatedCeoBm();
            });
          }
        })
      }
      else {
        empnamecontroller.markAsDirty();
        entitycontroller.markAsDirty();

        // Show error messages for both FROM_Date and TO_Date
        if (empnamecontroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
        }
        if (entitycontroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
        }
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
      }
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

  // updateEntCeoBm() {
  //   if (this.empNgmodel && this.entityNgmodel) {

  //     this.oneditbtn = false;
  //     var model: any = {

  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       ENTITY_ID: this.entityNgmodel.ID,
  //       ID: this.ECBMAPID

  //     };

  //     console.log("model", model);
  //     var apiUrl = '';
  //     apiUrl = 'entceobhmapping/UpdateEntCEOBM';
  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallEntCeoBm();
  //         this.cancel();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });

  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //     });
  //   }
  //   else {
  //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
  //   }
  // }
  updateEntCeoBm() {
    const empnamecontroller = this.desginatetedceoform.get('empnamecontroller');
    const entitycontroller = this.desginatetedceoform.get('entitycontroller');
    if (this.activemodel == false) {
      if (this.desginatetedceoform.valid) {
      // if (this.empNgmodel && this.entityNgmodel) {
        var mod: any = {
          // EMPLOYEE_ID: this.empNgmodel.ID,
          EMPLOYEE_ID: this.empNgmodel.EMPNO,
          ID: this.ECBMAPID
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));
        // console.log("mod", encryptmodel)
        this.rest.postParams(this.Global.getapiendpoint() + 'entceobhmapping/CheckDuplicate/', { encryptmodel: encryptmodel } 
        ).subscribe((data: any) => {
          if (data.Data) {
            alert("EMPLOYEE_ID already exist")
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
            apiUrl = 'entceobhmapping/UpdateEntCEOBM';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
                this.cancel();
                this.getallEntCeoBm();

              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
            });

          }
        })
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });

      }
    }
    else {
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
            // debugger;
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
            // console.log("model", encryptmodel);
            var apiUrl = '';
            apiUrl = 'desgianatedmap/UpdatedesginatedCEOBM';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getalldesginatedCeoBm();

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
                this.cancel();

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
  }

  // DeleteEntCeoBm(product: any) {
  //   debugger;
  //   console.log("Deleting product with ID:", product.ID);
  //   console.log("product", product);
  //   // console.log("product", product);
  //   if (this.activemodel == false) {

  //     var model: any =
  //     {
  //       ID: product.ID,
  //     }

  //     var apiUrl = '';
  //     apiUrl = 'entceobhmapping/DeleteEntCEOBMById';

  //     this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //       if (data.Success) {
  //         this.getallEntCeoBm();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
          
  //         this.cancel();
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //     })
  //   }
  //   else {

  //     var model: any =
  //     {
  //       ID: product.ID,
  //     }
  //     var apiUrl = '';
  //     apiUrl = 'desgianatedmap/DeletedesginatedCEOBMById';
  //     this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

  //       if (data.Success) {
  //         this.getalldesginatedCeoBm();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
          
  //         this.cancel();
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //     })
  //   }
  // }
  DeleteEntCeoBm(product: any) {
    // debugger;
    // console.log("Deleting product with ID:", product.ID);
    // console.log("product", product);

    // Determine which API to call based on activemodel
    var apiUrl = this.activemodel
        ? 'desgianatedmap/DeletedesginatedCEOBMById'
        : 'entceobhmapping/DeleteEntCEOBMById';

    var model: any = {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        // Determine which method to call for data retrieval based on activemodel
        if (this.activemodel) {
          this.getalldesginatedCeoBm();
        } else {
          this.getallEntCeoBm();
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successfully" });
        this.cancel();
      } else {
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
    this.activemodel = false;   
  }



}
