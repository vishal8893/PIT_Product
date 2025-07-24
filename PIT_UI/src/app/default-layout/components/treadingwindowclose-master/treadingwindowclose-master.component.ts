import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, AbstractControl, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import * as _Moment from 'moment';


@Component({
  selector: 'app-treadingwindowclose-master',
  templateUrl: './treadingwindowclose-master.component.html',
  styleUrls: ['./treadingwindowclose-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class TreadingwindowcloseMasterComponent implements OnInit {

  activemodel: boolean | null;
  FROM_DATE: any;
  TO_DATE: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  roleid: any;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  UserID: any;
  TWCform: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.TWCform = this.formBuilder.group({
      fromdatecontroller: [null, Validators.required],
      todatecontroller: [null, Validators.required],
    });
  }


  ngOnInit() {
    // this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);
    this.oneditbtn = false;
    this.getallTWC();

  }

  creatform() {
  }

  groupdata: any;
  getallTWC() {
    this.rest.getAll(this.Global.getapiendpoint() + 'treadingwindowclose/GetAllActiveTreadingWindowClose').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisualsTWC", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.FROM_DATE) {
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

  // createTWC() {
  //   const fromdatecontroller = this.TWCform.get('fromdatecontroller');
  // const todatecontroller = this.TWCform.get('todatecontroller');
  //   // if (this.FROM_DATE && this.TO_DATE) {
  //   // if (fromdatecontroller.value && todatecontroller.value) {
  //     if (this.TWCform.valid) {
  //     var mod: any = {
  //       FROM_DATE: this.FROM_DATE,
  //       ID: 0,
  //     }
  //     console.log("mod", mod)
  //     this.rest.postParams(this.Global.getapiendpoint() + 'treadingwindowclose/CheckDuplicate/', mod
  //     ).subscribe((data: any) => {
  //       if (data.Data) {
  //         alert("FROM_DATE already exist")
  //       }
  //       else {

  //         this.oneditbtn = false;

  //         this.handleCheckboxChange()
  //         var model: any = {

  //           FROM_DATE: this.FROM_DATE,
  //           TO_DATE: this.TO_DATE,

  //         };

  //         console.log("model", model);
  //         var apiUrl = '';
  //         apiUrl = 'treadingwindowclose/CreateTradingWindowClose';
  //         this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //           if (data.Success) {
  //             console.log("data", data);
  //             this.getallTWC();
  //             this.cancel();
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });

  //           }
  //           else {
  //             this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //           }
  //           this.getallTWC();
  //         });
  //       }
  //     })
  //   }
  //   else {
  //     // Check for FROM_DATE
  //   if (!fromdatecontroller.value) {
  //     fromdatecontroller.setErrors({ required: true });
  //   }

  //   // Check for TO_DATE
  //   if (!todatecontroller.value) {
  //     todatecontroller.setErrors({ required: true });
  //   }

  //   // Show error messages
  //   this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Please fill both FROM_Date and TO_Date' });
  // }
  //   //   this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
  //   // }
  // }
  createTWC() {
    const fromdatecontroller = this.TWCform.get('fromdatecontroller');
    const todatecontroller = this.TWCform.get('todatecontroller');

    if (this.TWCform.valid) {
      var mod: any = {
        FROM_DATE: fromdatecontroller.value,
        ID: 0,
      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));

      this.rest.postParams(this.Global.getapiendpoint() + 'treadingwindowclose/CheckDuplicate/', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Data) {
          alert("FROM_DATE already exists");
        } else {
          this.oneditbtn = false;
          this.handleCheckboxChange();
          var model: any = {
            FROM_DATE: fromdatecontroller.value,
            TO_DATE: todatecontroller.value,
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          var apiUrl = 'treadingwindowclose/CreateTradingWindowClose';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallTWC();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
            } else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallTWC();
          });
        }
      });
    } else {
      // Set form control errors
      fromdatecontroller.markAsDirty();
      todatecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (fromdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'FROM_Date is required' });
      }
      if (todatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'TO_Date is required' });
      }

      // Show error messages
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill both FROM_Date and TO_Date' });
    }
  }

  // onEditTWC(product: any) {
  //   this.oneditbtn = true;
  //   this.onadd = false;
  //   this.oncancel = true;

  //   // Store the initial FromDate
  //   this.initialFromDate = new Date(product.FROM_DATE);

  //   this.FROM_DATE = new Date(product.FROM_DATE);
  //   this.TO_DATE = new Date(product.TO_DATE);
  //   this.roleid = product.ID
  // }
  initialFromDate: Date;
  onEditTWC(product: any) {
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;

    // Store the initial FromDate
    this.initialFromDate = new Date(product.FROM_DATE);

    // Update the form controls with the values
    this.TWCform.get('fromdatecontroller').setValue(new Date(product.FROM_DATE));
    this.TWCform.get('todatecontroller').setValue(new Date(product.TO_DATE));

    this.roleid = product.ID;
  }

  // updateTWC() {
  //   if (this.FROM_DATE && this.TO_DATE) {
  //     // Check if TO_DATE has changed or not
  //     if (this.initialFromDate.getTime() === this.FROM_DATE.getTime()) {
  //       // If FROM_DATE remains unchanged or it's a new record, allow the update to proceed
  //       this.oneditbtn = false;
  //       var model: any = {
  //         // FROM_DATE: this.initialFromDate,
  //         FROM_DATE: this.FROM_DATE,
  //         TO_DATE: this.TO_DATE,
  //         ID: this.roleid,
  //       };
  //       console.log("model", model);
  //       var apiUrl = '';
  //       apiUrl = 'treadingwindowclose/UpdateTradingWindowClose';
  //       this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //         if (data.Success) {
  //           console.log("data", data);
  //           this.getallTWC();
  //           this.cancel();
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         } else {
  //           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         }
  //       });
  //     } else {
  //       // If FROM_DATE has changed, show an alert and prevent the update
  //       alert("FROM_DATE cannot be changed. Please keep the FROM_DATE unchanged.");
  //     }
  //   } else {
  //     this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
  //   }
  // }
  updateTWC() {
    const fromdatecontroller = this.TWCform.get('fromdatecontroller');
    const todatecontroller = this.TWCform.get('todatecontroller');

    if (this.TWCform.valid) {
      // if (this.FROM_DATE && this.TO_DATE) {
      // Check if TO_DATE has changed or not
      if (this.initialFromDate.getTime() === fromdatecontroller.value.getTime()) {
        // If FROM_DATE remains unchanged or it's a new record, allow the update to proceed
        this.oneditbtn = false;
        var model: any = {
          // FROM_DATE: this.initialFromDate,
          FROM_DATE: fromdatecontroller.value,
          TO_DATE: todatecontroller.value,
          ID: this.roleid,
        };
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", encryptmodel);
        var apiUrl = '';
        apiUrl = 'treadingwindowclose/UpdateTradingWindowClose';
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
          if (data.Success) {
            // console.log("data", data);
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.getallTWC();
            this.cancel();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.'});
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }
        });
      } else {
        // If FROM_DATE has changed, show an alert and prevent the update
        alert("FROM_DATE cannot be changed. Please keep the FROM_DATE unchanged.");
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  deleteTWC(product: any) {
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    var apiUrl = '';
    apiUrl = 'treadingwindowclose/DeleteTreadingWindowCloseById';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallTWC();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    // this.FROM_DATE = null
    // this.TO_DATE = null
    this.TWCform.reset();

  }

}

