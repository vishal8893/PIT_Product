import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { Message, PrimeNGConfig } from 'primeng/api';
import { Moment } from 'moment';
import * as _Moment from 'moment';
import { Product } from 'src/app/common/product';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-quarter-form-activation',
  templateUrl: './quarter-form-activation.component.html',
  styleUrls: ['./quarter-form-activation.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class QuarterFormActivationComponent implements OnInit{

  products: Product[];
  product: Product;
  quarterform: FormGroup;
  onadd: boolean = true;
  oneditbtn: boolean = false;
  oncancel: boolean = true;
  activemodel: boolean = false;
  quatid: any;
  roleid: any;
  currentQuarter: any;
  yearid: any[];
  LoggedInUser1: any;
  employeeId: any;
  calendarEnabled: boolean = false;
  currentQuatID: any;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.quarterform = this.formBuilder.group({
      quatnamecontroller: ['', [Validators.required]],
      yearcontroller: ['', [Validators.required]],
      startdatecontroller: ['', [Validators.required,this.manualDateValidator]],
      tilldatecontroller: ['', [Validators.required,this.manualDateValidator]],
    })
  }

  get quatnamecontroller() { return this.quarterform.get('quatnamecontroller'); }
  get yearcontroller() { return this.quarterform.get('yearcontroller'); }
  get startdatecontroller() { return this.quarterform.get('startdatecontroller'); }
  get tilldatecontroller() { return this.quarterform.get('tilldatecontroller'); }

  ngOnInit() {
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.employeeId = this.LoggedInUser1.EMPNO;
    this.oneditbtn = false;
    this.quatnamecontroller.disable();
    this.yearcontroller.disable();
    this.getactiveQuarter();
    this.getAllQuarterFormData();

  }

  manualDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value instanceof Date) {
      return null; // Valid date selected from calendar
    } else {
      return { 'invalidDate': true }; // Date not selected from calendar
    }
  }

  isValidTillDate(): boolean {
    const fromDate = this.quarterform.get('startdatecontroller').value;
    const tillDate = this.quarterform.get('tilldatecontroller').value;

    if (!fromDate || !tillDate) {
      return true; // Both dates are not selected, so it's considered valid
    }

    return new Date(fromDate) <= new Date(tillDate);
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }

  getactiveQuarter(){
    this.rest.getAll(this.Global.getapiendpoint() + 'quarterform/GetAllactivequarter').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.quarterform.get('quatnamecontroller').setValue(Result[0].QuarterName);
        this.quarterform.get('yearcontroller').setValue(Result[0].Year);
        this.currentQuatID = Result[0].QuarterId;
      }
    });
  }

  getAllQuarterFormData(){
    this.rest.getAll(this.Global.getapiendpoint() + 'quarterform/GetAllquarterformdata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
      }
    });
  }

  createQuarter() {
    // debugger;
    const quatnamecontroller = this.quarterform.get('quatnamecontroller');
    const yearcontroller = this.quarterform.get('yearcontroller');
    const startdatecontroller = this.quarterform.get('startdatecontroller');
    const tilldatecontroller = this.quarterform.get('tilldatecontroller');

    if (this.quarterform.valid) {

      if (!this.isValidTillDate()) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'End date cannot be before Start date' });

        return;
      }

      var mod: any = {
        quartrename: quatnamecontroller.value.toLowerCase(),
        year: yearcontroller.value,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));

      this.rest.postParams(this.Global.getapiendpoint() + 'quarterform/checkduplicate', { encryptmodel: encryptmodel }
      ).subscribe((data: any) => {
        if (data.isDuplicate) {
          // alert("EMPLOYEE_ID already exist")
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Quarter is already exist for year' });
        }else {

          this.oneditbtn = false;

          var model: any = {
            quartrename: quatnamecontroller.value,
            year: yearcontroller.value,
            startdate: startdatecontroller.value,
            enddate: tilldatecontroller.value,
            createdby: this.employeeId,
            currquatid: this.currentQuatID
          };
          // console.log("model", model);
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

          var apiUrl = '';
          apiUrl = 'quarterform/CreatequarterData';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getAllQuarterFormData();
              this.cancel();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
          });
        }
      })
    } else {
      quatnamecontroller.markAsDirty();
      yearcontroller.markAsDirty();
      startdatecontroller.markAsDirty();
      tilldatecontroller.markAsDirty();

      if (quatnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Quarter Name is Required' });
      }
      if (yearcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Year is Required' });
      }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Start Date is Required' });
      }
      if (tilldatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'End Date is Required' });
      }
    }
  }

  oneditQuarter(product: any) {
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    this.calendarEnabled = true;
    this.quarterform.get('quatnamecontroller').setValue(product.QuarterName);
    this.quarterform.get('yearcontroller').setValue(product.Year);
    this.quarterform.get('startdatecontroller').setValue(new Date(product.StartDate));
    this.quarterform.get('tilldatecontroller').setValue(new Date(product.EndDate));
    this.roleid = product.ID

  }

  updateQuarter() {
    const quatnamecontroller = this.quarterform.get('quatnamecontroller');
    const yearcontroller = this.quarterform.get('yearcontroller');
    const startdatecontroller = this.quarterform.get('startdatecontroller');
    const tilldatecontroller = this.quarterform.get('tilldatecontroller');

    if (this.quarterform.valid) {

      if (!this.isValidTillDate()) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'End date cannot be before Start date' });

        return;
      }

      this.oneditbtn = false;

      var model: any = {
        quartrename: quatnamecontroller.value,
        year: yearcontroller.value,
        startdate: startdatecontroller.value,
        enddate: tilldatecontroller.value,
        modifiedby: this.employeeId,
        currquatid: this.currentQuatID,
        ID: this.roleid,
      };
      
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'quarterform/UpdatequarterData';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getAllQuarterFormData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
          this.cancel();
          // this.calendarEnabled = false;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });
    }else {
      quatnamecontroller.markAsDirty();
      yearcontroller.markAsDirty();
      startdatecontroller.markAsDirty();
      tilldatecontroller.markAsDirty();

      if (quatnamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Quarter Name is Required' });
      }
      if (yearcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Year is Required' });
      }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Start Date is Required' });
      }
      if (tilldatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'End Date is Required' });
      }
    }
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    this.calendarEnabled = false;
    this.quarterform.reset();
    this.getactiveQuarter();
  }

}
