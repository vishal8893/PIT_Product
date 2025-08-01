import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
// import { Product } from '../sub-tasks/product';
// import { ProductService } from '../sub-tasks/productservice';
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
  selector: 'app-Compliance-Approve',
  templateUrl: './Compliance-Approve.component.html',
  styleUrls: ['./Compliance-Approve.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class ComplianceApproveComponent implements OnInit {
  SearchArray: any[] = []; // your data array
  selectedProducts: any[] = [];
  TradeArray: any = [
    { ID: 1, Name: 'Equity' },
    { ID: 2, Name: 'Future' },
    { ID: 3, Name: 'Option' },
    { ID: 4, Name: 'PrimaryIssue' },
    { ID: 5, Name: 'SpecialCase' },

  ]
  remark: any
  visible: boolean = false;
  customers: any[];
  lobnameNgmodel: any;
  buisnessidNgmodel: any
  sbunameNgmodel: any;
  businessids: any
  lobcodeNgmodel: any;

  enddateNgmodel: any;
  namemodel: string;
  codemodel: any;
  desmodel: any;
  roleid: any;
  products: Product[];

  product: Product;

  UserArray: any[] = [];
  lobIds: any
  LOBID: any
  selectedProjectHome: any;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  Lobid: any
  UserID: any;
  lobid: any;
  finalid: any;
  checks = false;
  // lobForm !: FormGroup;
  // lobIds: any;
  activemodel: boolean | null;
  editflag: number;
  sbunameNgmodel1: any;
  lobForm: FormGroup;
  LoggedInUser1: any;
  EmployeeId: any;
  Products: any;


  constructor(
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.lobForm = this.formBuilder.group({

      Trade: [null, [Validators.required]],
      Username: [null, [Validators.required]],
      // lobname: [null, [Validators.required]],
      // lobcode: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // this.EmployeeId = this.LoggedInUser1.ID;
    this.EmployeeId = this.LoggedInUser1.EMPNO;
    this.oneditbtn = false;
    this.editflag = 0;
    this.GetALLUser()
    this.Searchall()
  }


  GetALLUser() {

    this.rest.getAll(this.Global.getapiendpoint() + 'complianceapprove/GetAllUserData').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.UserArray = Result

      }
    })
  }


  Search() {
    const Trade = this.lobForm.get('Trade');
    const Username = this.lobForm.get('Username');
    var model: any = {
      Trade: Trade.value,
      Username: Username.value,

    }

    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = '';
    apiUrl = 'complianceapprove/GetAllIRFApprovalData';
    // return;
    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        console.log("Result", Result);
        this.SearchArray = Result

      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }



    })


  }
  Searchall() {

    // return;
    this.rest.getAll(this.Global.getapiendpoint() + 'complianceapprove/GetAllIRFApprovalDataall').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        console.log("Result", Result);
        this.SearchArray = Result

      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }



    })
  }

  SingleCreate(product: any) {
    let model = {
      Status: 'Approved',
      ID: product.ID,
      UserId: this.EmployeeId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = '';
    apiUrl = 'complianceapprove/Approvedata';
    // return;
    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        this.cancel()
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
         this.Searchall()
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }

    })
  }

  SingleReject(product: any) {
    this.Products = product
    this.visible = true;

  }
  Reject() {
    let model = {
      Status: 'Reject',
      ID: this.Products.ID,
      Array: this.Products,
      UserId: this.EmployeeId,
      RejectionReason: this.remark
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    var apiUrl = '';
    apiUrl = 'complianceapprove/Rejectdata';
    // return;
    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        this.cancel()
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        this.visible = false;
        this.remark = null
         this.Searchall()
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }

    })
  }

  AllSelected() {
    if (this.selectedProducts.length > 0) {
      this.selectedProducts.forEach((product, index) => {
        let model = {
          Status: 'Approved',
          ID: product.ID,
          UserId: this.EmployeeId
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        var apiUrl = '';
        apiUrl = 'complianceapprove/Approvedata';
        // return;
        this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success) {

            if (this.selectedProducts.length == index + 1) {
              this.cancel()
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              this.Searchall()
            }
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          }

        })
      })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select the Atleast one record' });
    }

  }

  cancel() {
    this.editflag = 0;
    this.oneditbtn = false;
    this.onadd = true;
    this.SearchArray = []
    this.lobForm.reset();
  }

  showDialog() {
    this.visible = true;
  }
}

