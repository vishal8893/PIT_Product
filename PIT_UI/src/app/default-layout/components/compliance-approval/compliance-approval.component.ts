import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Binary } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compliance-approval',
  templateUrl: './compliance-approval.component.html',
  styleUrls: ['./compliance-approval.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class ComplianceApprovalComponent {

  complianceform: FormGroup;
  showGrid: boolean = false;
  products: any = [];
  SearchSecurityData: any = []
  emp: any;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global, private router: Router,
  ) {
    this.complianceform = this.formBuilder.group({
      companyNamecontroller: [null, [Validators.required]]
    })
  }

  get companyNamecontroller() { return this.complianceform.get('companyNamecontroller'); }


  ngOnInit() {

    this.SearchSecurityData = [];
    this.showGrid = false;

  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }

  getallirfdata(event: any) {

    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      this.rest.postParams(this.Global.getapiendpoint() + "eirf/getUserData", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.SearchSecurityData = Result;
          console.log("res",Result);
        }
      })
    } else {
      this.SearchSecurityData = []
    }
  }

  setisin(event: any) {
    // const isincomtroller = this.greylistform.get('isincomtroller');
    // console.log('Selected Value: ', event.SCRIP_DESC);
    let setvalue = event.FIRSTNAME
    this.SearchSecurityData.forEach(element => {
      if (setvalue == element.FIRSTNAME) {
        this.emp = element.EMPNO;
        console.log('emp',this.emp);
        // this.greylistform.get('isincomtroller').setValue(element.ISIN_CODE);
      } else {
        // this.ISINNumber?.setValue('')
        // this.LotSize = ''
        // this.emp = ''
      }
    });
  }


  getreport() {
    debugger;
    const companyNamecontroller = this.companyNamecontroller.get('companyNamecontroller');
    if (this.complianceform.valid) {

      var model: any = {
        // FIRSTNAME: companyNamecontroller.value,
        EMPNO: this.emp
      }
      console.log("model",model)

      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      var apiUrl = '';
      apiUrl = 'eirf/getselecteUseData';
      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.showGrid = true;
          this.products = Result;
          this.emp = '';
          this.SearchSecurityData = [];
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
        }
        else {
          this.showGrid = true;
          this.emp = '';
          this.SearchSecurityData = [];
          // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });

    } else {
      companyNamecontroller.markAsDirty();

      if (companyNamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'required' });
      }
    }
  }

  confirmDelete(product: any) {
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to go Trade Approval?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Proceed with delete operation
        this.onCancel(product);
      },
      reject: () => {
        // Do nothing if user clicks "No" or closes the dialog
      }
    });
  }

  onCancel(product: any){

    let ID = product.EMPNO;
    let name = product.FIRSTNAME;
    // this.router.navigate(['pit/InvestmentApprovalForm']);
    const encryptedID = this.Global.encryptionAES(ID.toString());
    const encryptedName = this.Global.encryptionAES(name);
    this.router.navigate(['pit/InvestmentApprovalForm'], { queryParams: { active: true, id: encryptedID, name: encryptedName } });
  }

}
