import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import * as _Moment from 'moment';

@Component({
  selector: 'app-upsi-master',
  templateUrl: './upsi-master.component.html',
  styleUrls: ['./upsi-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class UpsiMasterComponent implements OnInit {

  empNgmodel: any;
  applNgmodel: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  empid: any;
  applid: any;
  activemodel: boolean | null;
  UPSIID: any;
  UPSIform: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.UPSIform = this.formBuilder.group({
      empcontroller: [null, Validators.required],
      applcontroller: [null, Validators.required],
    });
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallemp();
    this.getallappl();
    this.getallupsimst();
  }

  creatform() {
  }

  groupdata: any;
  getallemp() {
    this.rest.getAll(this.Global.getapiendpoint() + 'upsimst/GetAllEmpgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.empid = Result;
        // console.log("getAllemp", this.empid)
      }
    });
  }

  getallappl() {
    this.rest.getAll(this.Global.getapiendpoint() + 'upsimst/GetAllapplgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.applid = Result;
        // console.log("getAllAppl", this.applid)
      }
    });
  }

  getallupsimst() {
    this.rest.getAll(this.Global.getapiendpoint() + 'upsimst/GetAllupsiMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllUpsiMstindivisuals", this.products)
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

  createUPSI() {
    const empcontroller = this.UPSIform.get('empcontroller');
    const applcontroller = this.UPSIform.get('applcontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.UPSIform.valid) {
      var mod: any = {
        // EMPLOYEE_ID: empcontroller.value.ID,
        EMPLOYEE_ID: empcontroller.value.EMPNO,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'upsimst/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("EMPLOYEE_ID already exist")
        }
        else {

          this.oneditbtn = false;

          this.handleCheckboxChange()
          var model: any = {
            // EMPLOYEE_ID: empcontroller.value.ID,
            EMPLOYEE_ID: empcontroller.value.EMPNO,
            EMP_NAME: empcontroller.value.FIRSTNAME,
            APPL_ID: applcontroller.value.ID,

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'upsimst/CreatupsiMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallupsimst();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallupsimst();
          });
        }
      })
    }
    else {
      empcontroller.markAsDirty();
      applcontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (applcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  initialEmployeeID: number;
  oneditUPSI(product: any) {
    // console.log("product row", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.initialEmployeeID = product.EMPLOYEE_ID;
    // this.empNgmodel = { "ID": product.TBL_USER_MST.ID, "FIRSTNAME": product.TBL_USER_MST.FIRSTNAME, };
    this.UPSIform.get('empcontroller').setValue({"EMPNO": product.EMPLOYEE_ID, "FIRSTNAME": product.EMP_NAME,});
    // this.applNgmodel = { "ID": product.TBL_GENERIC_MST.ID, "NAME": product.TBL_GENERIC_MST.NAME, };
    this.UPSIform.get('applcontroller').setValue({ "ID": product.TBL_GENERIC_MST.ID, "NAME": product.TBL_GENERIC_MST.NAME, });
    this.UPSIID = product.ID;
  }

  // updateUPSI() {
  //   if (this.empNgmodel && this.applNgmodel) {
  //     var mod: any = {
  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       ID: 0,
  //     }
  //     console.log("mod", mod)
  //     this.rest.postParams(this.Global.getapiendpoint() + 'upsimst/CheckDuplicate/', mod
  //     ).subscribe((data: any) => {
  //       if (data.Data) {
  //         alert("EMPLOYEE_ID already exist")
  //       }
  //       else {

  //         this.oneditbtn = false;

  //         var model: any = {
  //           EMPLOYEE_ID: this.empNgmodel.ID,
  //           APPL_ID: this.applNgmodel.ID,
  //           ID: this.UPSIID
  //         };
  //         console.log("model", model);
  //         var apiUrl = '';
  //         apiUrl = 'upsimst/UpdateupsiMst';
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             this.getallupsimst();
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
  updateUPSI() {
    const empcontroller = this.UPSIform.get('empcontroller');
    const applcontroller = this.UPSIform.get('applcontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.UPSIform.valid) {
    // if (this.empNgmodel && this.applNgmodel) {
      // Check if EMPLOYEE_ID has changed or not
      if (this.initialEmployeeID === empcontroller.value.EMPNO) {
        // If EMPLOYEE_ID remains unchanged or it's a new record, allow the update to proceed
        this.oneditbtn = false;
        var model: any = {
            // EMPLOYEE_ID: empcontroller.value.ID,
            EMPLOYEE_ID: empcontroller.value.EMPNO,
            EMP_NAME: empcontroller.value.FIRSTNAME,
            APPL_ID: applcontroller.value.ID,
            ID: this.UPSIID
          };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
        // console.log("model", encryptmodel);
        var apiUrl = '';
        apiUrl = 'upsimst/UpdateupsiMst';
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallupsimst();
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

  DeleteUPSI(product: any) {
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    var apiUrl = '';
    apiUrl = 'upsimst/DeleteupsiMstById';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallupsimst();
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
    // this.applNgmodel = null;
    this.UPSIform.reset();
  }

}
