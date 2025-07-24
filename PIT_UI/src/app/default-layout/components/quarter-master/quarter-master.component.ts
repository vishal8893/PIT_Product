import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
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
  selector: 'app-quarter-master',
  templateUrl: './quarter-master.component.html',
  styleUrls: ['./quarter-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class QuarterMasterComponent implements OnInit {

  products: Product[];
  product: Product;
  quarterform: FormGroup;
  // onadd: boolean = true;
  oneditbtn: boolean = true;
  oncancel: boolean = true;
  activemodel: boolean | null;
  quatid: any;
  roleid: any;
  currentQuarter: any;


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.quarterform = this.formBuilder.group({
      quatnamecontroller: ['', [Validators.required]],
      activecontroller: [this.activemodel],
    })
  }

  ngOnInit() {
    this.calculateCurrentQuarter();
    this.getallquarterdata();

  }


  calculateCurrentQuarter(): void {
    const currentDate = new Date(); 
   

    const currentMonth = currentDate.getMonth() + 1; // January is 0
  
    if (currentMonth >= 1 && currentMonth <= 3) {
      this.currentQuarter = 'jan-march';
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      this.currentQuarter = 'April-jun';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      this.currentQuarter = 'july-sep';
    } else {
      this.currentQuarter = 'Oct-dec';
    }
  }
  


  creatform() {
  }

  groupdata: any;
  getallquarterdata() {
    this.rest.getAll(this.Global.getapiendpoint() + 'quarter/GetAllQuarterData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getallquarterdata", this.products);
      }
    });
  }
  
  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.CODE) {
        this.duplicateroleid = element.NAME_OF_ISSUE
      }
      else {
        this.duplicateroleid = '0'
      }

    })

  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true
    }
  }

  oneditQuarter(product: any) {
    // console.log(product);

    this.oneditbtn = true;
    // this.onadd = false;
    this.oncancel = true;
    this.quarterform.get('quatnamecontroller').setValue(product.QuarterName);
    this.activemodel = product.CurrentActive;
    this.roleid = product.QuarterId

  }

  updateQuarter() {
    const quatnamecontroller = this.quarterform.get('quatnamecontroller');
    if (this.quarterform.valid) {
          // this.oneditbtn = false;
          var model: any = {
            quartrename: quatnamecontroller.value,
            active: this.activemodel,
            ID: this.roleid
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("model", encryptmodel);
          var apiUrl = '';
          apiUrl = 'quarter/UpdatequarterData';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallquarterdata();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
              this.cancel();
              // this.onadd = true;
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });      
    }
    else {
      quatnamecontroller.markAsDirty();

      if (quatnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Quarter Name is Required' });
      }
      
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }

  cancel() {
    this.oneditbtn = true;
    // this.onadd = true;
    this.quarterform.reset();
  }



}


