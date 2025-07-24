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
// import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-itrading-grey-list',
  templateUrl: './itrading-grey-list.component.html',
  styleUrls: ['./itrading-grey-list.component.css'],
  providers: [MessageService, ConfirmationService]
})






export class ITradingGreyListComponent implements OnInit {

  customers: any[];
  Userlist: any = []
  USERGreaylist: any = []
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
  oncancel: boolean = true;
  showuser: boolean = false;
  Lobid: any
  UserID: any;
  lobid: any;
  finalid: any;
  checks = false;
  userLoggedIn: any;
  activemodel: boolean | null;
  // greylistform !: FormGroup;

  scrpitnameNgmodel1: boolean = false
  greylistform: FormGroup;
  typeNgmodel: any;
  typeid: any;
  frequencyPeriodIds: any;
  SearchSecurityData: any = []

  // }

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    // private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.greylistform = this.formBuilder.group({

      companyNamecontroller: [null, [Validators.required]],
      isincomtroller: [null, [Validators.required]],
      startdatecontroller: [null, [Validators.required]],
      enddatecontroller: [null, [Validators.required]],
      typecontroller: [null, [Validators.required]],
      employee: [null, [Validators.required]]
    })
  }
  get companyNamecontroller() { return this.greylistform.get('companyNamecontroller'); }
  get isincomtroller() { return this.greylistform.get('isincomtroller'); }
  get typecontroller() { return this.greylistform.get('typecontroller'); }
  ngOnInit() {

    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.UserID = this.userLoggedIn.ID;

    // console.log("userId", this.UserID);

    this.oneditbtn = false;
    this.getallgreylist();
    this.getallrestricted();
    this.getAllData();
    this.typeid = [
      { Id: 1, NAME: 'Grey List' },
      { Id: 2, NAME: 'Restricted List' }
    ];
    this.getallUser();

  }

  // CreateForm() {


  groupdata: any;
  getallgreylist() {
    this.rest.getAll(this.Global.getapiendpoint() + 'gretlist/GetAllgreylistMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisuals", this.products)
      }
    });
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }
  
  getallrestricted() {
    this.rest.getAll(this.Global.getapiendpoint() + 'restrict/GetAllrestrictedlistMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisuals", this.products)
      }
    });
  }

  getAllData() {
    // Create an empty array to hold the combined data
    const combinedData = [];

    // Call the API to get grey list data
    this.rest.getAll(this.Global.getapiendpoint() + 'gretlist/GetAllgreylistMst').subscribe((greylistData: any) => {
      if (greylistData.Success) {
        // combinedData.push(...greylistData.Data); // Push grey list data into the combinedData array
        var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
        combinedData.push(...Result.map(item => ({ source: { Id: 1, NAME: 'Grey List' }, ...item })));

        // Call the API to get restricted list data
        this.rest.getAll(this.Global.getapiendpoint() + 'restrict/GetAllrestrictedlistMst').subscribe((restrictedData: any) => {
          if (restrictedData.Success) {
            var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
            // combinedData.push(...restrictedData.Data); // Push restricted list data into the combinedData array
            combinedData.push(...Result.map(item => ({ source: { Id: 2, NAME: 'Restricted List' }, ...item })));
            this.products = combinedData; // Assign the combined data to your grid's data source
            // console.log("Combined Data", this.products);
          }
        });
      }
    });
  }

  getallirfdata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                            
      this.rest.postParams(this.Global.getapiendpoint() + "eirf/SCRIPDESC", { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.SearchSecurityData = Result;
          // console.log("SearchSecurityData", this.SearchSecurityData);
        }
      })
    } else {
      this.SearchSecurityData = []
    }


  }

  setisin(event: any) {
    // const isincomtroller = this.greylistform.get('isincomtroller');
    // console.log('Selected Value: ', event.SCRIP_DESC);
    let setvalue = event.SCRIP_DESC
    this.SearchSecurityData.forEach(element => {
      if (setvalue == element.SCRIP_DESC) {
        // this.isincomtroller.setValue(element.ISIN_CODE)
        this.greylistform.get('isincomtroller').setValue(element.ISIN_CODE);
      } else {
        // this.ISINNumber?.setValue('')
        // this.LotSize = ''
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
    const companyNamecontroller = this.greylistform.get('companyNamecontroller');
    const isincomtroller = this.greylistform.get('isincomtroller');
    const startdatecontroller = this.greylistform.get('startdatecontroller');
    const enddatecontroller = this.greylistform.get('enddatecontroller');
    const typecontroller = this.greylistform.get('typecontroller');
    // if (this.empNgmodel && this.applNgmodel) {

    if (this.greylistform.valid) {
      this.oneditbtn = false;

      var mod: any = {
        SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        ID: 0,
      }
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", encryptmodel1)

      var model: any = {
        SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        ISIN: isincomtroller.value,
        STARTDATE: startdatecontroller.value,
        ENDDATE: enddatecontroller.value,

      }
      let encryptmodel2 = this.Global.encryptionAES(JSON.stringify(model)); 
      // console.log("model", encryptmodel2);

      this.frequencyPeriodIds = this.typeNgmodel.map((item: any) => ({ NAME: item.NAME }));
      this.frequencyPeriodIds.forEach((item) => {
        if (item.NAME === 'Grey List') {

          this.rest.postParams(this.Global.getapiendpoint() + 'gretlist/CheckDuplicate/', { encryptmodel: encryptmodel1 } 
          ).subscribe((data: any) => {
            if (data.Data) {
              alert("already exist")
            } else {

              var Model: any = {
                SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
                ISIN: isincomtroller.value,
                STARTDATE: startdatecontroller.value,
                ENDDATE: enddatecontroller.value,
                USERLIST: this.Userlist,
                USERID: this.UserID
              }
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model)); 
              // console.log("Model", encryptmodel);

              var apiUrl = '';
              apiUrl = 'gretlist/CreategreyListMst';
              this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getAllData();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                  this.cancel();
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
                this.getAllData();
              });


            }
          });
        } else if (item.NAME === 'Restricted List') {
          // Call the API for Restricted List
          this.rest.postParams(this.Global.getapiendpoint() + 'restrict/CheckDuplicate/', { encryptmodel: encryptmodel1 } 
          ).subscribe((data: any) => {
            if (data.Data) {
              alert("already exist")
            } else {
              var apiUrl = '';
              apiUrl = 'restrict/CreaterestrictedListMst';
              this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel2 } ).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getAllData();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                  this.cancel();
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
                this.getAllData();
              });
            }
          });
        }
      });
    }
    else {
      companyNamecontroller.markAsDirty();
      isincomtroller.markAsDirty();
      startdatecontroller.markAsDirty();
      enddatecontroller.markAsDirty();
      typecontroller.markAsDirty();

      // Show error messages for both FROM_Date and TO_Date
      if (companyNamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Company is required' });
      }
      if (isincomtroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
      }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'StartDate is required' });
      }
      if (enddatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EndDate is required' });
      }
      if (typecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Type is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });

    }
  }
  ////


  deletegreylist(product: any) {
    // debugger;
    // console.log("product", product);

    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                       

    if (product.source.NAME === 'Grey List') {
      var apiUrl = '';
      apiUrl = 'gretlist/DeletegreymstById';
      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully'});
          // this.displayAddProject3 = false;
          this.getAllData();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          // this.displayAddProject3 = false;
        }
      })
    } else if (product.source.NAME === 'Restricted List') {
      var apiUrl = '';
      apiUrl = 'restrict/DeleterestrictedmstById';
      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        // debugger;
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Successully' });
          // this.displayAddProject3 = false;
          this.getAllData();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          // this.displayAddProject3 = false;
        }
      })
    }



  }

  onEditgreylist(product: any) {
    // console.log("product",product);
    

    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;
    // this.scrpitnameNgmodel = product.SCRIPT_NAME;
    this.greylistform.get('companyNamecontroller').setValue({ SCRIP_DESC: product.SCRIPT_NAME });
    // this.isinnameNgmodel = product.employee;
    this.greylistform.get('isincomtroller').setValue(product.ISIN);
    // this.greylistform.get('typecontroller').setValue('');

  
    // this.startdateNgmodel = new Date(product.STARTDATE);
    this.greylistform.get('startdatecontroller').setValue(new Date(product.STARTDATE));
    // this.enddateNgmodel = new Date(product.ENDDATE),
    this.greylistform.get('enddatecontroller').setValue(new Date(product.ENDDATE));

    this.roleid = product.ID

    const selectedIds: any = [product.source];
    const selectedNames: any[] = [];

    for (let index = 0; index < selectedIds.length; index++) {
      const element = selectedIds[index];

      const typeid1 = this.typeid.find((item: any) => item.Id === element.Id);

      if (typeid1) {
        var pushdata: any = { "NAME": typeid1.NAME, "Id": typeid1.Id };
        selectedNames.push(pushdata);
      } else {
        // Handle the case where no matching typeid is found.
        console.warn(`No matching typeid found for ID: ${element.Id}`);
      }
    }

    this.typeNgmodel = selectedNames;
    this.set()
    this.Setvalidation()

    const selectedIdse: string[] = product.EmpName.split(',');
    const selectedNamese: string[] = [];
    selectedIdse.forEach(id => {
      const weekday = this.USERGreaylist.find(w => w.FIRSTNAME.toString() == id);
      if (weekday) {
        var pushdata: any = { "FIRSTNAME": weekday.FIRSTNAME, "ID": weekday.ID, "Display": weekday.Display, "EMPNO": weekday.EMPNO }
        selectedNamese.push(pushdata);
      }
    });
    this.Userlist = selectedNamese



  }

  updategreylist() {
    const companyNamecontroller = this.greylistform.get('companyNamecontroller');
    const isincomtroller = this.greylistform.get('isincomtroller');
    const startdatecontroller = this.greylistform.get('startdatecontroller');
    const enddatecontroller = this.greylistform.get('enddatecontroller');
   
    // if (this.empNgmodel && this.applNgmodel) {

    if (this.greylistform.valid) {

      this.oneditbtn = false;
      var mod: any = {
        SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        ID: this.roleid,

      }
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(mod));
      // console.log("mod", encryptmodel1)

      var model: any = {
        SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        ISIN: isincomtroller.value,
        STARTDATE: startdatecontroller.value,
        ENDDATE: enddatecontroller.value,
        ID: this.roleid

      };
      let encryptmodel2 = this.Global.encryptionAES(JSON.stringify(model));

      // console.log("model", model);
      this.frequencyPeriodIds = this.typeNgmodel.map((item: any) => ({ NAME: item.NAME }));
      this.frequencyPeriodIds.forEach((item) => {
        if (item.NAME === 'Grey List') {
          // Call the API for Grey List
          this.rest.postParams(this.Global.getapiendpoint() + 'gretlist/CheckDuplicate/', { encryptmodel: encryptmodel1 }
          ).subscribe((data: any) => {
            if (data.Data) {
              alert("already exist")
              this.oneditbtn = true;
            } else {

              var Model: any = {
                SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
                ISIN: isincomtroller.value,
                STARTDATE: startdatecontroller.value,
                ENDDATE: enddatecontroller.value,
                ID: this.roleid,
                USERID: this.Userlist,
                UserID: this.UserID
              }
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(Model)); 
              // console.log("Modelupdate", encryptmodel);

              var apiUrl = '';
              apiUrl = 'gretlist/UpdategreyMaster';
              this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getAllData();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
                  this.cancel();
                  this.onadd = true;
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
              });

            }
          });
        } else if (item.NAME === 'Restricted List') {
          // Call the API for Restricted List          
          this.rest.postParams(this.Global.getapiendpoint() + 'restrict/CheckDuplicate/', { encryptmodel: encryptmodel1 }
          ).subscribe((data: any) => {
            if (data.Data) {
              alert("already exist")
              this.oneditbtn = true;
            } else {
              var apiUrl = '';
              apiUrl = 'restrict/UpdaterestrictedMaster';              
                      
              this.rest.create(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel2 }).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getAllData();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
                  this.cancel();
                  this.onadd = true;
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
              });
            }
          });
        }
      });








      ////

      // })
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
    }
  }
  ////
  getallUser() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/getallUserbygraylistActive').subscribe((data: any) => {
      if (data.Success) {
        // console.log('lobIds', data.Data);
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.USERGreaylist = Result;
        // this.finalid = this.lobIds.ID
        // console.log('USERGreaylist', this.USERGreaylist);
        this.USERGreaylist.map((i: any) => { i.Display = i.EMPNO + ' - ' + i.FIRSTNAME; return i; });

      }
    });
  }

  cancel() {

    this.oneditbtn = false;
    this.onadd = true;
    // this.enddateNgmodel = null
    // this.startdateNgmodel = null
    // this.scrpitnameNgmodel = null
    // this.isinnameNgmodel = null
    this.greylistform.reset();
    this.unset()
  }

  typevalidation() {
    if (this.typeNgmodel.length == 2) {
      this.typeNgmodel = []
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Only select One type' });
    } else {

    }

  }

  Setvalidation() {
  //   console.log("id");
  //  console.log("typeNgmodel",this.typeNgmodel[0].Id);
    
    // const typecontroller = this.greylistform.get('typecontroller');
    // const id = typecontroller.value[0]
    
    
    if (this.typeNgmodel[0].Id == 1) {
      this.showuser = true
      this.greylistform.controls["employee"].setValidators([Validators.required]);
      this.greylistform.controls["employee"].updateValueAndValidity();
    } else {
      this.showuser = false
      this.greylistform.controls["employee"].clearValidators();
      this.greylistform.controls["employee"].updateValueAndValidity();

    }


  }

  set() {
    this.companyNamecontroller.disable()
    this.isincomtroller.disable()
  }
  unset() {
    this.companyNamecontroller.enable()
    this.isincomtroller.enable()
  }
}

