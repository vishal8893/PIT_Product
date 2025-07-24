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
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-fromdeclartion',
  templateUrl: './fromdeclartion.component.html',
  styleUrls: ['./fromdeclartion.component.css'],
  providers: [MessageService, ConfirmationService]
})







export class FromdeclartionComponent implements OnInit {






  customers: any[];







  // cities: City[];
  // selectedCity: City;
  // activemodel:boolean = false ;
  sbulobnameNgModel: any;
  buisnessidNgmodel: any
  sbunameNgmodel: any;
  lobdropdownnameNgmodel: any;
  businessids: any
  sbulobcodeNgModel: any;
  // buisnessidNgmodel: any;
  enddateNgmodel: any;
  namemodel: string;
  codemodel: any;
  desmodel: any;
  roleid: any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
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
  lobForm !: FormGroup;
  finallobitem: any
  finalsublobitem:any
  // lobIds: any;
  activemodel: boolean | null;
  editflag: number;
  editflag1: number;
  sbunameNgmodel1: any;
  lobdropdownnameNgmodel1: any;
  slobNgModel:any;
  logginuserID: any;
  EMPID: any;
  EmployeeId: any;
  employeeData: any = {};
  uid: any;
  constructor(
    private cdref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router,
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
  }

  ngOnInit() {
    this.UserID = localStorage.getItem('UserId');
    // console.log("UserID", this.UserID);

    // this.logginuserID = JSON.parse(localStorage.getItem('userLoggedIn')!)
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.logginuserID = userLoggedInString ? JSON.parse(userLoggedInString) : null;



    // this.EMPID =this.logginuserID.ID
    this.EMPID =this.logginuserID.EMPNO;
    // console.log("EMPID", this.EMPID);
    // this.EmployeeId = this.logginuserID.ID;
    this.EmployeeId = this.logginuserID.EMPNO;
    this.getallUSTMST(this.EmployeeId);

    this.editflag = 0
    this.editflag1 = 0
    this.oneditbtn = false;

    // this.onchangeevent();

  }


  getallUSTMST(EmployeeId: any) {
    var apiUrl = '';
    apiUrl = `joindesc/GetUser/${EmployeeId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        this.employeeData = data.Data[0];
        this.uid = data.Data;
        // console.log("getUser", this.employeeData);
        // console.log("getUser", this.uid);
      }
    });
  }



  onAccept() {
    // if ( this.buisnessidNgmodel && this.sbunameNgmodel && this.lobdropdownnameNgmodel && this.slobNgModel) {
      // debugger;  
   
          this.oneditbtn = false;
          var model: any = {
        
            EMPLOYEE_ID: this.EMPID,
          

          }

          // console.log("model", model);
          var apiUrl = '';
          apiUrl = 'pbdeclartion/addPBdata';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
             
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              this.router.navigate(['/pit/joiningdeclaration']);
              // this.sbunameNgmodel = null
              // this.buisnessidNgmodel = null
              // this.sbulobnameNgModel = null
              // this.sbulobcodeNgModel = null
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
      
          });
          ////
        }
   
    // else {
    //   this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    // }






  }






