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
import * as moment from 'moment';

@Component({
  selector: 'app-pcofin',
  templateUrl: './pcofin.component.html',
  styleUrls: ['./pcofin.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class PcofinComponent {
  customers: any[];
  ingredient!: string;
  scrpitnameNgmodel: any;
  isinnameNgmodel: any;
  startdateNgmodel: any;
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
  userandQuarter: boolean = true;
  activeQuarter: boolean = true;
  oncancel: boolean = true;
  Lobid: any
  userId: any;
  lobid: any;
  finalid: any;
  checks = false;
  userLoggedIn: any;
  activemodel: boolean | null;
  // greylistform !: FormGroup;
  alphausername: any;
  scrpitnameNgmodel1: boolean = false
  greylistform: FormGroup;
  selectedUserCatSVP: boolean = false;
  selectedUserCatCEO: boolean = false;
  selectedUserCatEmpAll: boolean = false;
  // }
  Form = this.formBuilder.group({
    Id: [''],
    tcob: ['', [Validators.required]],
    rwe: ['', [Validators.required]],
    entity: ['', [Validators.required]],
    holding: ['', [Validators.required]],
    transactiondate: ['', [Validators.required]],
    not: ['', [Validators.required]],
    vpt: ['', [Validators.required]],
    mcp: ['', [Validators.required]],
    sdca: ['', [Validators.required]],
    doca: ['', [Validators.required]],
    remark: ['', [Validators.required]],
    selectedUserCatSVP: [this.selectedUserCatSVP],
    selectedUserCatCEO: [this.selectedUserCatCEO],
    selectedUserCatEmpAll: [this.selectedUserCatEmpAll],

  })

  get Id() { return this.Form.get('Id'); }
  get tcob() { return this.Form.get('tcob'); }
  get rwe() { return this.Form.get('rwe'); }
  get entity() { return this.Form.get('entity'); }
  get holding() { return this.Form.get('holding'); }
  get transactiondate() { return this.Form.get('transactiondate'); }
  get not() { return this.Form.get('not'); }
  get vpt() { return this.Form.get('vpt'); }
  get mcp() { return this.Form.get('mcp'); }
  get sdca() { return this.Form.get('sdca'); }
  get doca() { return this.Form.get('doca'); }
  get remark() { return this.Form.get('remark'); }
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global, private router: Router,
  ) {

  }
  ngOnInit() {
    this.getuQuarterStatus();
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    if (this.userLoggedIn) {      
      // this.userId = this.userLoggedIn.ID;
      this.userId = this.userLoggedIn.EMPNO;
      // console.log("this.userId",this.userId);
      
      this.oneditbtn = false; 
      // this.getuQuarterStatus();     
      this.getallgreylist(this.userId);      
      this.getalphausername();
      this.getuserQuarterStatus();      

    } else {
      this.router.navigate(['pit/login']);
      localStorage.setItem('route', 'pit/pcoin');
    }



  }


  getstatusdetails() {
    const confirmed = window.confirm('Do you have any Personal Conflict of Interest?');
    if (confirmed) {
      this.userandQuarter = true;
      // this.getallgreylist();      
      // this.getalphausername();
      // this.getuserQuarterStatus(); 
    } else {
      var model: any = {
        tcob: 'null',
        declaration: 'null',
        rwe: 'null',
        entity: 'null',
        holding: 'null',
        transactiondate: null,
        not: 'null',
        vpt: 'null',
        mcp: 'null',
        sdca: 'null',
        doca: 'null',
        remark: 'null',
        UserId: this.userId

      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                          
      this.rest.create(this.Global.getapiendpoint() + 'PConinterest/CreatePcoi1',  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.userandQuarter = false;
          // this.getallgreylist();          
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });
    }
  }

  getalphausername() {
    var model = {
      loginid: this.userId
    }
    
    this.rest.postParams(this.Global.getapiendpoint() + "user/GetAllUsers", model).subscribe((data: any) => {
      if (data.Success == true) {
        this.alphausername = data.Data.LOGINID;
      }
    })

  }

  getuserQuarterStatus() {
    var model = {
      loginid: this.userId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             
    // console.log("modeluser",model);
    
    this.rest.postParams(this.Global.getapiendpoint() + "PConinterest/GetStatus", { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success = true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        // console.log("getuserQuarterStatus",data);
        this.userandQuarter = false;                  
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Record allready exist' });              
      } else {
        this.userandQuarter = true;        
        this.getstatusdetails();        
      }
    })

  }

  getuQuarterStatus() {
    // debugger;
    this.rest.getAll(this.Global.getapiendpoint() + "PConinterest/Getacivequrter").subscribe((data: any) => {
      
      if (data.Success = true) {
        // console.log("getuQuarterStatus",data);
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.activeQuarter = true;           
        // this.getstatusdetails();
      } else {
        this.activeQuarter = false        
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Quarter not active please Active Quarter' });
      }
    })

  }


  // groupdata: any;
  getallgreylist(userId:any) {
    var apiUrl = '';
    apiUrl = `PConinterest/GetAllPCOIDetails/${userId}`;
    this.rest.getAll(this.Global.getapiendpoint() + apiUrl).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisuals", this.products)
      }
    });
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.SCRIPT_NAME) {
        this.duplicateroleid = element.ID
      }
      else {
        (this.duplicateroleid !== '' ? this.duplicateroleid : '0')
        // this.duplicateroleid = '0'
      }

    })

  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true //!this.activemodel;
    }
  }

  creategreylist() {
    if (this.Form.valid) {
      var modeldub: any = {
        UserId: this.userId
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(modeldub));                       

      this.rest.postParams(this.Global.getapiendpoint() + 'PConinterest/checkduplicate/', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          alert("already exist")
        }
        else {
          this.oneditbtn = false;
          var model: any = {
            tcob: this.tcob?.value,
            declaration: this.ingredient,
            rwe: this.rwe?.value,
            entity: this.entity?.value,
            holding: this.holding?.value,
            transactiondate: this.transactiondate?.value,
            not: this.not?.value,
            vpt: this.vpt?.value,
            mcp: this.mcp?.value,
            sdca: this.sdca?.value,
            doca: this.doca?.value,
            remark: this.remark?.value,
            UserId: this.userId

          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                       

          this.rest.create(this.Global.getapiendpoint() + 'PConinterest/CreatePcoi', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.getallgreylist(this.userId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              this.cancel();
              this.getuserQuarterStatus()

            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            this.getallgreylist(this.userId);
          });
          ////
        }
      })
    }
    else {

    }


  }

  onEditgreylist(product: any) {
    // console.log("oneditData", product);
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    let data = 'self'
    if (product.Relation == data) {
      this.ingredient = "Self"
      this.Id?.setValue(product.TransId)
      this.tcob?.setValue(product.TransDetails)
      this.rwe?.setValue(product.Relation)
      this.entity?.setValue(product.Entity)
      this.holding?.setValue(product.PerHolding)
      this.transactiondate?.setValue(product.Date)
      this.not?.setValue(product.Nature)
      this.vpt?.setValue(product.ValuePrice)
      this.mcp?.setValue(product.MarketValPrice)
      this.sdca?.setValue(product.SpDiscount)
      this.doca?.setValue(product.ConflictDetails)
      this.remark?.setValue(product.Remark)
      this.tcob.disable()
      this.rwe.disable()

    } else if (product.DeclarationFor == 'IR') {
      this.Id?.setValue(product.TransId)
      this.tcob?.setValue(product.TransDetails)
      this.rwe?.setValue(product.Relation)
      this.entity?.setValue(product.Entity)
      this.holding?.setValue(product.PerHolding)
      this.transactiondate?.setValue(moment(product.Date).format('YYYY-MM-DD'))
      this.not?.setValue(product.Nature)
      this.vpt?.setValue(product.ValuePrice)
      this.mcp?.setValue(product.MarketValPrice)
      this.sdca?.setValue(product.SpDiscount)
      this.doca?.setValue(product.ConflictDetails)
      this.remark?.setValue(product.Remark)
      this.tcob.enable()
      this.rwe.enable()
      this.ingredient = 'IR'
    } else if (product.DeclarationFor == 'Cp') {
      this.Id?.setValue(product.TransId)
      this.tcob?.setValue(product.TransDetails)
      this.rwe?.setValue(product.Relation)
      this.entity?.setValue(product.Entity)
      this.holding?.setValue(product.PerHolding)
      this.transactiondate?.setValue(moment(product.Date).format('YYYY-MM-DD'))
      this.not?.setValue(product.Nature)
      this.vpt?.setValue(product.ValuePrice)
      this.mcp?.setValue(product.MarketValPrice)
      this.sdca?.setValue(product.SpDiscount)
      this.doca?.setValue(product.ConflictDetails)
      this.remark?.setValue(product.Remark)
      this.tcob.enable()
      this.rwe.enable()
      this.ingredient = 'Cp'
    }

  }

  updategreylist() {
    // debugger;
    if (this.Form.valid) {
      this.onadd = true;
      var model: any = {
        Id: this.Id?.value,
        tcob: this.tcob?.value,
        declaration: this.ingredient,
        rwe: this.rwe?.value,
        entity: this.entity?.value,
        holding: this.holding?.value,
        transactiondate: this.transactiondate?.value,
        not: this.not?.value,
        vpt: this.vpt?.value,
        mcp: this.mcp?.value,
        sdca: this.sdca?.value,
        doca: this.doca?.value,
        remark: this.remark?.value,
        UserId: this.userId

      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                             
      // console.log("model", encryptmodel);

      this.rest.postParams(this.Global.getapiendpoint() + 'PConinterest/UpdatePcoi', { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallgreylist(this.userId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.cancel();
          this.onadd = true;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
  deletegreylist(product: any) {


    var model: any =
    {
      Id: product.TransId
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             

    this.rest.postParams(this.Global.getapiendpoint() + 'PConinterest/DeletePcoi', { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        this.getallgreylist(this.userId);
        this.cancel()
        this.userandQuarter = true
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    this.tcob.enable()
    this.rwe.enable()
    this.Form.reset();
    this.ingredient = ''
  }

  setgetvalue() {
    this.ingredient = 'Self';
    this.tcob?.setValue(this.alphausername)
    this.rwe?.setValue('self')
    this.tcob.disable()
    this.rwe.disable()
  }
  setgetvalue1() {
    this.ingredient = 'IR';

    this.tcob.reset()
    this.rwe.reset()
    this.tcob.enable()
    this.rwe.enable()
  }
  setgetvalue2() {
    this.ingredient = 'Cp';

    this.tcob.reset()
    this.rwe.reset()
    this.tcob.enable()
    this.rwe.enable()
  }


  handleSelectionChangeSVP() {
    if (this.selectedUserCatSVP) {
      this.selectedUserCatCEO = false;
      this.selectedUserCatEmpAll = false;
      // this.tcob?.setValue(this.alphausername)
      this.tcob?.setValue(this.userLoggedIn.FIRSTNAME);
      this.rwe?.setValue('self')
      this.tcob.disable()
      this.rwe.disable()
    }
  }

  handleSelectionChangeCEO() {
    if (this.selectedUserCatCEO) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatEmpAll = false;
      this.tcob.reset()
      this.rwe.reset()
      this.tcob.enable()
      this.rwe.enable()
    }
  }

  handleSelectionChangeEmpALL() {
    if (this.selectedUserCatEmpAll) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatCEO = false;
      this.tcob.reset()
      this.rwe.reset()
      this.tcob.enable()
      this.rwe.enable()
    }
  }














}
