import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import * as _Moment from 'moment';

@Component({
  selector: 'app-m3andupsiadmin-master',
  templateUrl: './m3andupsiadmin-master.component.html',
  styleUrls: ['./m3andupsiadmin-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class M3andupsiadminMasterComponent implements OnInit {

  empNgmodel: any;
  typeNgmodel: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  empid: any;
  typeid: any;
  activemodel: boolean | null;
  M3UPSiID: any;
  m3andspsiform: FormGroup;
  frequencyPeriodIds: any;




  // }



  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.m3andspsiform = this.formBuilder.group({

      empnamecontroller: ['', [Validators.required]],
      typecontroller: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallm3upsimst();
    this.getallemp();
    this.getalltype();

  }

  creatform() {

  }

  groupdata: any;
  getallemp() {
    this.rest.getAll(this.Global.getapiendpoint() + 'meupsi/GetAllEmpgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.empid = Result;
        // console.log("getAllemp", this.empid)
      }
    });
  }

  getalltype() {
    this.rest.getAll(this.Global.getapiendpoint() + 'meupsi/GetAllTypegroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.typeid = Result;
        // console.log("getAlltype", this.typeid)
      }
    });
  }

  getallm3upsimst() {
    this.rest.getAll(this.Global.getapiendpoint() + 'meupsi/GetAllM3&UPSIMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllM3UpsiMstindivisuals", this.products)
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

  // createM3UAM(){
  //   if (this.empNgmodel && this.typeNgmodel) {

  //     this.oneditbtn = false;

  //     var model: any = {
  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       TYPE_ID: this.typeNgmodel.ID,

  //     }

  //     console.log("model", model);

  //     var apiUrl = '';
  //     apiUrl = 'meupsi/CreatM3&UPSIMst';

  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallm3upsimst();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         this.cancel();
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //       this.getallm3upsimst();
  //     });
  //   }
  //   else {
  //     this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
  //   }
  // }
  // createM3UAM() {
  //   if (this.empNgmodel && this.typeNgmodel) {
  //     var mod: any = {
  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       ID: 0,
  //     }
  //     console.log("mod", mod)
  //     this.rest.postParams(this.Global.getapiendpoint() + 'meupsi/CheckDuplicate/', mod
  //     ).subscribe((data: any) => {
  //       if (data.Data) {
  //         alert("EMPLOYEE_ID already exist")
  //       }
  //       else {

  //         this.oneditbtn = false;

  //         this.handleCheckboxChange()
  //         var model: any = {
  //           EMPLOYEE_ID: this.empNgmodel.ID,
  //           TYPE_ID: this.typeNgmodel.ID,

  //         }

  //         console.log("model", model);
  //         var apiUrl = '';
  //         apiUrl = 'meupsi/CreatM3&UPSIMst';
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             this.getallm3upsimst();
  //             this.cancel();
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });

  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //           this.getallm3upsimst();
  //         });
  //       }
  //     })
  //   }
  //   else {
  //     this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
  //   }
  // }

  createM3UAM() {
    const empnamecontroller = this.m3andspsiform.get('empnamecontroller');
    const typecontroller = this.m3andspsiform.get('typecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.m3andspsiform.valid) {
    // if (this.empNgmodel && this.typeNgmodel) {
      var mod: any = {
        // EMPLOYEE_ID: this.empNgmodel.ID,
        EMPLOYEE_ID: this.empNgmodel.EMPNO,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel)
      this.rest.postParams(this.Global.getapiendpoint() + 'meupsi/CheckDuplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("EMPLOYEE_ID already exist")
        }
        else {
          // debugger
          this.oneditbtn = false;

          // this.handleCheckboxChange()
          this.frequencyPeriodIds = this.typeNgmodel.map((item: any) => ({ Id: item.ID }));
          this.frequencyPeriodIds.forEach((element: any) => {
            var model: any = {
              // EMPLOYEE_ID: this.empNgmodel.ID,
              EMPLOYEE_ID: this.empNgmodel.EMPNO,
              EMP_NAME: this.empNgmodel.FIRSTNAME,
              TYPE_ID: element.Id,

            }
            let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
            // console.log("model", encryptmodel);
            var apiUrl = '';
            apiUrl = 'meupsi/CreatM3&UPSIMst';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.getallm3upsimst();
                
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                this.cancel();

              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getallm3upsimst();
            });
          });
        }
      })
    }
    else {
      empnamecontroller.markAsDirty();
      typecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (empnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EMP_Name is required' });
      }
      if (typecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Applicability is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  oneditM3UAM(product: any) {
   
    // console.log("product row", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.empNgmodel = { "EMPNO": product.EMPLOYEE_ID, "FIRSTNAME": product.EMP_NAME, };
    // this.typeNgmodel = { "ID": product.TBL_GENERIC_MST.ID, "NAME": product.TBL_GENERIC_MST.NAME, };
    this.M3UPSiID = product.ID;

    const selectedIds: any = [product.TBL_GENERIC_MST];
    const selectedNames: any[] = [];

    for (let index = 0; index < selectedIds.length; index++) {
      const element = selectedIds[index];

      const typeid1 = this.typeid.find(w => w.ID === element.ID);

      if (typeid1) {
        var pushdata: any = { "NAME": typeid1.NAME, "ID": typeid1.ID };
        selectedNames.push(pushdata);
      } else {
        // Handle the case where no matching typeid is found.
        console.warn(`No matching typeid found for ID: ${element.ID}`);
      }
    }

    this.typeNgmodel = selectedNames;

  }

  // updateM3UAM() {
  //   if (this.empNgmodel && this.typeNgmodel) {
  //     this.oneditbtn = false;

  //     var model: any = {

  //       EMPLOYEE_ID: this.empNgmodel.ID,
  //       TYPE_ID: this.typeNgmodel.ID,
  //       ID: this.M3UPSiID

  //     };

  //     console.log("model", model);
  //     var apiUrl = '';
  //     apiUrl = 'meupsi/Updatem3upsiMst';

  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallm3upsimst();
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
  updateM3UAM() {
    const empnamecontroller = this.m3andspsiform.get('empnamecontroller');
    const typecontroller = this.m3andspsiform.get('typecontroller');
    // if (this.empNgmodel && this.applNgmodel) {
    if (this.m3andspsiform.valid) {
    // if (this.empNgmodel && this.typeNgmodel) {
      // var mod: any = {
      //   EMPLOYEE_ID: this.empNgmodel.ID,
      //   ID: 0,
      // }
      // console.log("mod", mod)
      // this.rest.postParams(this.Global.getapiendpoint() + 'meupsi/CheckDuplicate/', mod
      // ).subscribe((data: any) => {
      //   if (data.Data) {
      //     alert("EMPLOYEE_ID already exist")
      //   }
      //   else {

      this.oneditbtn = false;
      this.frequencyPeriodIds = this.typeNgmodel.map((item: any) => ({ Id: item.ID }));
      this.frequencyPeriodIds.forEach((element: any) => {
        var model: any = {
          // EMPLOYEE_ID: this.empNgmodel.ID,
          EMPLOYEE_ID: this.empNgmodel.EMPNO,
          EMP_NAME: this.empNgmodel.FIRSTNAME,
          TYPE_ID: element.Id,
          ID: this.M3UPSiID
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", encryptmodel);
        var apiUrl = '';
        apiUrl = 'meupsi/Updatem3upsiMst';
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallm3upsimst();
            
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
            this.cancel();

          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });
      });
    }
    // })
    // }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  DeleteM3UAM(product: any) {
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'meupsi/Deletem3upsimstById';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallm3upsimst();
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
    // this.typeNgmodel = null;
    this.m3andspsiform.reset();
  }

}


