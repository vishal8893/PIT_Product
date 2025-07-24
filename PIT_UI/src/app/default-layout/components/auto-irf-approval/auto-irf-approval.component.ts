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
  selector: 'app-auto-irf-approval',
  templateUrl: './auto-irf-approval.component.html',
  styleUrls: ['./auto-irf-approval.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AutoIrfApprovalComponent {
  Array: any = [{
    Id: 1, Name: 'Auto Irf Approval'
  }]
  activemodel: boolean | null;
  quatid: any;
  roleid: any;
  currentQuarter: any;
  AutoIRfApprovalform = this.formBuilder.group({
    AutoIRfApproval: ['', [Validators.required]],
    activecontroller: [''],
  })
  disabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {

  }

  ngOnInit() {

    let AIA = localStorage.getItem('AIA');
  
    if (AIA == null) {
      this.activemodel = false;
    } else if (AIA == 'false') {
      this.activemodel = false;
    } else if (AIA == 'true') {
      this.activemodel = true
    }


  }
  setvalidtion() {
    let Value = this.AutoIRfApprovalform.get('AutoIRfApproval')?.value
    console.log("Value", Value);
    if (Value == null) {
      this.disabled = false
    } else {
      this.disabled = true
    }
  }

  handleCheckboxChange() {
    if (this.activemodel == null) {
      this.activemodel = false;
      localStorage.setItem('AIA', 'false');
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Auto Irf-Approval Remove' });
    } else if (this.activemodel == false) {
      this.activemodel = false;
      localStorage.setItem('AIA', 'false');
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Auto Irf-Approval Remove' });
    }
    else {
      this.activemodel = true
      localStorage.setItem('AIA', 'true');
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Auto Irf-Approval Set Successfuly' });
    }
  }

}
