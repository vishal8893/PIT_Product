import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import { Observable } from 'rxjs';
import * as _Moment from 'moment';


@Component({
  selector: 'app-user-categorization-master',
  templateUrl: './user-categorization-master.component.html',
  styleUrls: ['./user-categorization-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class UserCategorizationMasterComponent implements OnInit {

  entityNgmodel: any;
  sbuNgmodel: any;
  lobNgmodel: any;
  sublobNgmodel: any;
  entityid: any;
  sbuid: any;
  // lobid: any;
  // sublobid: any;
  // selectedEmployeeLevel: string | null;
  selectedUserCatSVP: boolean = false;
  selectedUserCatCEO: boolean = false;
  selectedUserCatEmpAll: boolean = false;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  USRCTGID: any;
  isEntityDisabled: boolean = false;
  isSbuDisabled: boolean = false;
  isLobDisabled: boolean = false;
  isSublobDisabled: boolean = false;
  isAllEmployeesDisabled: boolean = false;
  isSVPDisabled: boolean = false;
  isAllCEODisabled: boolean = false;
  LoggedInUser: any;
  LoggedInUser1: any;
  employeeId: any;
  UserUploadTeam: any;
  activemodel: boolean | null;
  flg: boolean = false;
  userMaster: any[];
  GetEmployeeEntityDesig: any[];
  filterdata: any[];
  filterdata1: any[];
  lstUsers: any[];
  designation: any[];
  lstAllEntityCEO: any[];
  usrmstid: any;
  desigid: any;
  entmapid: any;
  desigempid: any;
  submapid: any;

  UserCateform = this.formBuilder.group({
    entitycontroller: ['', [Validators.required]],
    sbucontroller: ['', [Validators.required]],
    lobcontroller: ['', [Validators.required]],
    sublobcontroller: ['', [Validators.required]],
    selectedUserCatSVP: [this.selectedUserCatSVP],
    selectedUserCatCEO: [this.selectedUserCatCEO],
    selectedUserCatEmpAll: [this.selectedUserCatEmpAll],
  })

  get entitycontroller() { return this.UserCateform.get('entitycontroller'); }
  get sbucontroller() { return this.UserCateform.get('sbucontroller'); }
  get lobcontroller() { return this.UserCateform.get('lobcontroller'); }
  get sublobcontroller() { return this.UserCateform.get('sublobcontroller'); }

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
  }

  ngOnInit() {
    this.oneditbtn = false;
    this.selectedUserCatEmpAll = true;
    // this.LoggedInUser1 = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;

    this.LoggedInUser = this.LoggedInUser1.EMPNO;
    // console.log("usercatloggedinuserNO",this.LoggedInUser);
    this.employeeId = this.LoggedInUser1.EMPNO;
    // console.log("usercatloggedinempNO",this.employeeId);
    
    
    this.getallentity();
    this.getallsbu();
    this.getallUSRCategory();
    this.getallUSTMST();
    this.getallDesigemp();
    this.getallEmpEntMapping();
    this.getallEmpEntSubMapping();
    this.getallDesignation();    
    
  }

  CheckEmployeeEntityMapping(employeeId: any, ENTITY_ID: any, LoggedInUser: any): Observable<any> {
    
    var body = {
      employee_id: this.employeeId,
      ENTITY_ID: ENTITY_ID,
      cre_user: LoggedInUser
    };

    let encryptmodel = this.Global.encryptionAES(JSON.stringify(body)); 
    var apiUrl = 'usrcategory/getresultent';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } );
  }

  CheckEmployeeEntityMaterialsubsidiaryMapping(employeeid: any, ENTITY_ID: any, materialsubsidiary_id: any, LoggedInUser: any): Observable<any> {
    var body = {
      employeeid: this.employeeId,
      ENTITY_ID: ENTITY_ID,
      materialsubsidiary_id: materialsubsidiary_id,
      cre_user: LoggedInUser
    };
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(body)); 
    var apiUrl = 'usrcategory/getresultentmatsubdairy';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } );
  }

  CheckEmployeeEntityMapping1(ENTITY_ID: any): Observable<any> {
    var body = {
      ENTITY_ID: ENTITY_ID
    };
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(body)); 
    var apiUrl = 'usrcategory/getresultent';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });
  }

  GetUserUploadTeam(employeeId: any): Observable<any> {
    var body = {
      employeeId: employeeId,
      // EMPLOYEE_ID:25
    };
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(body)); 

    var apiUrl = 'usrcategory/getUserUploadTeam';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel });
  }

  onEntityChange() {
    // Logic to disable/enable other dropdowns based on the selected entity
    if (this.entityNgmodel) {
      this.sbuNgmodel = null;
      this.lobNgmodel = null;
      this.sublobNgmodel = null;
      this.isEntityDisabled = false;
      this.isSbuDisabled = true;
      this.isLobDisabled = true;
      this.isSublobDisabled = true;
      this.selectedUserCatEmpAll = true;
      // this.selectedUserCatCEO = false;
      this.selectedUserCatSVP = false;
      this.isAllCEODisabled = false;
      this.isSVPDisabled = false;
      this.isAllEmployeesDisabled = false;
      // this.isAllCEODisabled = true;
      // this.isSVPDisabled = true;
      if (this.selectedUserCatCEO === true) {
        this.selectedUserCatEmpAll = true;
      }
      this.selectedUserCatCEO = false;
      // }
      this.CheckEmployeeEntityMapping(null, this.entityNgmodel, this.LoggedInUser).subscribe((response: any) => {
        // console.log(response);
        if (response.Data[0].eirf_upsi_map_entity_master > 0) {
          // Rows exist, enable the corresponding functionality
          this.isAllCEODisabled = false;
        } else {
          this.isAllCEODisabled = true;
          this.CheckEmployeeEntityMaterialsubsidiaryMapping(null, null, this.entityNgmodel, this.LoggedInUser).subscribe((materialsubsidiaryResponse: any) => {
            // console.log(materialsubsidiaryResponse);

            if (materialsubsidiaryResponse.Data[0].EIRF_UPSI_MAP_ENTITY_Materialsubsidiary > 0) {
              // Rows exist, enable the corresponding functionality
              this.isAllCEODisabled = false;
            } else {
              this.isAllCEODisabled = true;
              this.CheckEmployeeEntityMapping1(this.entityNgmodel).subscribe((entityMappingResponse: any) => {
                // console.log(entityMappingResponse);

                if (entityMappingResponse.Data[0].eirf_upsi_map_entity_master > 0) {
                  // Rows exist, enable the corresponding functionality
                  this.isAllCEODisabled = false;
                } else {
                  this.isAllCEODisabled = true;
                }
              });
            }
          });
        }
      });
    }
    else {
      this.cancel();
    }
  }

  onSbuChange() {
    if (this.entityNgmodel) {
      this.sbuNgmodel = null;
      this.lobNgmodel = null;
      this.sublobNgmodel = null;
      this.isEntityDisabled = false;
      this.isSbuDisabled = false;
      this.isLobDisabled = false;
      this.isSublobDisabled = false;
      this.isAllCEODisabled = false;

      if (this.selectedUserCatCEO === true)
        this.selectedUserCatEmpAll === true;
      this.selectedUserCatCEO === false;
    }
    // Logic to disable/enable other dropdowns based on the selected entity
    if (this.sbuNgmodel) {
      this.entityNgmodel = null;
      this.isEntityDisabled = true;
      this.isSbuDisabled = false;
      this.isLobDisabled = false;
      this.isSublobDisabled = false;
      this.selectedUserCatCEO = false;
      this.selectedUserCatSVP = false;
      this.isAllCEODisabled = true;
      this.isSVPDisabled = false;

    }
    else {
      this.cancel();
    }
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.ENTITY_ID || data == element.SBU_ID) {
        this.duplicateroleid = element.ID;
      } else {
        this.duplicateroleid = '0';
      }
    });
  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true;
    }
  }

  creatform() {

  }

  groupdata: any;
  getallentity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllentitylist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entityid = Result;
        // console.log("getAllEntity", this.entityid)
      }
    });
  }

  getallsbu() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllSBU').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.sbuid = Result;
        // console.log("getAllsbu", this.sbuid)
      }
    });
  }

  finallobitem: any;
  onchangeeventsub(sbuid: any) {
    // console.log("sbumode",this.sbuNgmodel);

    var model: any = {
      SBU_ID: sbuid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                       
    // console.log("model sbu", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/GetAllLob', { encryptmodel: encryptmodel }  ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finallobitem = Result
        // console.log('finallobitem', this.finallobitem)
      }
    })
  }

  finalsublobitems: any;
  onchangeeventlob(lobid: any) {
    // console.log("lobmode",this.lobNgmodel);

    var model: any = {
      LOB_ID: lobid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
    // console.log("model lob", encryptmodel);

    this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/GetAllSubLob', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finalsublobitems = Result
        // console.log('finalsublobitems', this.finalsublobitems)
      }
    })
  }

  getallUSRCategory() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllUserCatlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisualsUserCat", this.products)
      }
    });
  }

  getallUSTMST() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllUSerdata1').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.usrmstid = Result;
        // console.log("getAllusrmst", this.usrmstid)
      }
    });
  }

  getallDesigemp() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllDesignate').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.desigempid = Result;
        // console.log("getAlldesigemp", this.desigempid)
      }
    });
  }

  getallEmpEntMapping() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllEntCEOBMlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entmapid = Result;
        // console.log("getAllentmap", this.entmapid)
      }
    });
  }

  getallEmpEntSubMapping() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllEntMatSubCEOBHlist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.submapid = Result;
        // console.log("getAllsubmap", this.submapid)
      }
    });
  }

  getallDesignation() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAlldesignation').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.desigid = Result;
        // console.log("getAlldesignation", this.desigid)
      }
    });
  }

  handleSelectionChangeSVP() {
    if (this.selectedUserCatSVP) {
      this.selectedUserCatCEO = false;
      this.selectedUserCatEmpAll = false;
    }
  }

  handleSelectionChangeCEO() {
    if (this.selectedUserCatCEO) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatEmpAll = false;
    }
  }

  handleSelectionChangeEmpALL() {
    if (this.selectedUserCatEmpAll) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatCEO = false;
    }
  }

  createUserCategory() {
    if(this.entityNgmodel || this.sbuNgmodel){
    // (this.GetUserUploadTeam(this.employeeId)).subscribe((response: any) => {
      // if (response.Success === true) {
        if (this.entityNgmodel) {
          var mod: any = {
            ENTITY_ID: this.entityNgmodel,
            ID: 0,
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));            
          // console.log("mod", encryptmodel);
          this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/CheckDuplicate/',  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Data) {
              alert("ENTITY_ID already exists");
            } else {
              this.oneditbtn = false;

              this.handleCheckboxChange()

              var model: any = {
                ENTITY_ID: this.entityNgmodel !== undefined ? this.entityNgmodel : null,
                SBU_ID: this.sbuNgmodel !== undefined ? this.sbuNgmodel : null,
                LOB_ID: this.lobNgmodel !== undefined ? this.lobNgmodel : null,
                SUBLOB_ID: this.sublobNgmodel !== undefined ? this.sublobNgmodel : null,
                CEO_TWO_LEVEL_DOWN: this.selectedUserCatCEO,
                SVP_ABOVE: this.selectedUserCatSVP,
                ALL_EMPLOYEEES: this.selectedUserCatEmpAll,
                CREATED_BY: this.employeeId,
                // TEAM_ID: response.Data[0].TEAM_ID,
              }
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
              // console.log("model", encryptmodel);
              var apiUrl = 'usrcategory/CreatUserCat';
              this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  // var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getallUSRCategory();
                  this.cancel();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                  // this.flg = this.UpdateUserMasterForEmpCate(data,"Y",data.TEAM_ID);
                  
                  this.UpdateUserMasterForEmpCate(data, "Y", data.Data.TEAM_ID, (success) => {
                    this.flg = success;
                  });
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
                this.getallUSRCategory();
              });
            }
          });
        } else if (this.sbuNgmodel) {
          var mod: any = {
            SBU_ID: this.sbuNgmodel,
            ID: 0,
          };
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                      
          // console.log("mod", encryptmodel);
          this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/CheckDuplicate/',  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Data) {
              alert("SBU_ID already exists");
            } else {
              this.oneditbtn = false;

              this.handleCheckboxChange()

              var model: any = {
                ENTITY_ID: this.entityNgmodel !== undefined ? this.entityNgmodel : null,
                SBU_ID: this.sbuNgmodel !== undefined ? this.sbuNgmodel : null,
                LOB_ID: this.lobNgmodel !== undefined ? this.lobNgmodel : null,
                SUBLOB_ID: this.sublobNgmodel !== undefined ? this.sublobNgmodel : null,
                CEO_TWO_LEVEL_DOWN: this.selectedUserCatCEO,
                SVP_ABOVE: this.selectedUserCatSVP,
                ALL_EMPLOYEEES: this.selectedUserCatEmpAll,
                CREATED_BY: this.employeeId,
                // TEAM_ID: response.Data[0].TEAM_ID,
              }
              let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
              // console.log("model", encryptmodel);
              var apiUrl = 'usrcategory/CreatUserCat';
              this.rest.create(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel }).subscribe((data: any) => {
                if (data.Success) {
                  // console.log("data", data);
                  // var Result = JSON.parse(this.Global.decrypt1(data.Data));
                  this.getallUSRCategory();
                  this.cancel();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
                  this.UpdateUserMasterForEmpCate(data, "Y", data.Data.TEAM_ID, (success) => {
                    this.flg = success;
                  });
                }
                else {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
                }
                this.getallUSRCategory();
              });
            }
          });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
        }
      // } else {
      //   alert(`employeeId ${this.employeeId} not available`);
      // }
    // });
  }else{
    alert("Please fill in required fields:Entity or Sbu,Lob,Sublob ");
  }
  }

  // oneditUserCategory(product: any) {
  //   console.log("product row", product);
  //   this.oneditbtn = true;
  //   this.onadd = false;
  //   this.oncancel = true;
  //   if (this.entityNgmodel = product.ENTITY_ID) {
  //     this.onEntityChange();
  //   }
  //   if (this.sbuNgmodel = product.SBU_ID) {
  //     this.lobNgmodel = product.LOB_ID;
  //     this.sublobNgmodel = product.SUBLOB_ID;
  //     this.onSbuChange();
  //   }
  //   // this.selectedEmployeeLevelCEO = product.CEO_TWO_LEVEL_DOWN;
  //   // this.selectedEmployeeLevelSVP = product.SVP_ABOVE;
  //   // this.selectedEmployeeLevelAll = product.ALL_EMPLOYEEES;
  //   if (product.ALL_EMPLOYEEES === true) {
  //     this.selectedUserCatEmpAll = true;
  //     this.selectedUserCatSVP = false;
  //     this.selectedUserCatCEO = false;
  //   } else if (product.SVP_ABOVE === true) {
  //     this.selectedUserCatEmpAll = false;
  //     this.selectedUserCatSVP = true;
  //     this.selectedUserCatCEO = false;
  //   } else if (product.CEO_TWO_LEVEL_DOWN === true) {
  //     this.selectedUserCatEmpAll = false;
  //     this.selectedUserCatSVP = false;
  //     this.selectedUserCatCEO = true;
  //   } else {
  //     this.selectedUserCatEmpAll = false;
  //     this.selectedUserCatSVP = false;
  //     this.selectedUserCatCEO = false;
  //   }
  //   this.onchangeeventsub(product.SBU_ID);
  //   this.onchangeeventlob(product.LOB_ID);
  //   this.USRCTGID = product.ID;
  // }

  // updateUserCategory() {

  //   if (this.entityNgmodel) {
  //     this.oneditbtn = false;

  //     var model: any = {
  //       ENTITY_ID: this.entityNgmodel !== undefined ? this.entityNgmodel : null,
  //       SBU_ID: this.sbuNgmodel !== undefined ? this.sbuNgmodel : null,
  //       LOB_ID: this.lobNgmodel !== undefined ? this.lobNgmodel : null,
  //       SUBLOB_ID: this.sublobNgmodel !== undefined ? this.sublobNgmodel : null,
  //       CEO_TWO_LEVEL_DOWN: this.selectedUserCatCEO,
  //       SVP_ABOVE: this.selectedUserCatSVP,
  //       ALL_EMPLOYEEES: this.selectedUserCatEmpAll,
  //       ID: this.USRCTGID,
  //     }

  //     console.log("model", model);
  //     var apiUrl = '';
  //     apiUrl = 'usrcategory/UpdateUserCat';
  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallUSRCategory();
  //         this.cancel();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         this.onadd = true;
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //       }
  //     });

  //   }
  //   else if (this.sbuNgmodel && this.lobNgmodel) {
  //     this.oneditbtn = false;

  //     var model1: any = {
  //       ENTITY_ID: this.entityNgmodel !== undefined ? this.entityNgmodel : null,
  //       SBU_ID: this.sbuNgmodel !== undefined ? this.sbuNgmodel : null,
  //       LOB_ID: this.lobNgmodel !== undefined ? this.lobNgmodel : null,
  //       SUBLOB_ID: this.sublobNgmodel !== undefined ? this.sublobNgmodel : null,
  //       CEO_TWO_LEVEL_DOWN: this.selectedUserCatCEO,
  //       SVP_ABOVE: this.selectedUserCatSVP,
  //       ALL_EMPLOYEEES: this.selectedUserCatEmpAll,
  //       ID: this.USRCTGID,
  //     }

  //     console.log("model1", model1);
  //     var apiUrl = '';
  //     apiUrl = 'usrcategory/UpdateUserCat';
  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model1).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);
  //         this.getallUSRCategory();
  //         this.cancel();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         this.onadd = true;
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

  DeleteUserCategory(product: any) {
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                      

    var apiUrl = '';
    apiUrl = 'usrcategory/DeleteUserCatById';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });

        this.getallUSRCategory();
        // alert("Do you want to delete this data?");
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        alert("Error in Data deletion");
      }
    })
  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    this.entityNgmodel = null;
    this.sbuNgmodel = null;
    this.lobNgmodel = null;
    this.sublobNgmodel = null;
    this.selectedUserCatEmpAll = true;
    this.selectedUserCatCEO = null;
    this.selectedUserCatSVP = null;
    this.isEntityDisabled = false;
    this.isSbuDisabled = false;
    this.isLobDisabled = false;
    this.isSublobDisabled = false;
    this.isAllCEODisabled = false;
    this.isAllEmployeesDisabled = false;
    this.isSVPDisabled = false;
    // this.UserCateform.reset();
    
  }

  UpdateUserMasterForEmpCate(model: any, param1: string, param2: bigint, callback: (success: boolean) => void) {
    if (model.Data.ENTITY_ID !== null && model.Data.ENTITY_ID !== '') {
      // Logic for entity with CEO2LevelDown
      // this.lstUsers= this.usrmstid;
      this.lstUsers = [];
      if (model.Data.CEO_TWO_LEVEL_DOWN) {
        // Assign filtered data to lstUsers
        const lstAllEntityCEO = [];
        // if (this.desigempid.TeamId === model.Data.TEAM_ID) { lstAllEntityCEO.push(model.Data.TEAM_ID) }
        const entitiesWithEntityProperty1 = this.desigempid.filter((item: { TeamId: any; }) => item.TeamId !== undefined);
        const usersSVP1 = entitiesWithEntityProperty1.filter((item: { TeamId: any; }) => item.TeamId === model.Data.TEAM_ID);
        if (usersSVP1.length > 0) {
          this.lstAllEntityCEO.push(...usersSVP1);
        }
        const lst1 = [];
        const entitiesWithEntityProperty2 = this.entmapid.filter((item: { CREATED_BY: any; }) => item.CREATED_BY !== undefined);
        const usersSVP3 = entitiesWithEntityProperty2.filter((item: { CREATED_BY: any; }) => item.CREATED_BY === model.Data.CREATED_BY);
        if (usersSVP3.length > 0) {
          lst1.push({ ...usersSVP3, type: "group" });
          lst1.forEach(a => { a.type = "group"; });
        }
        if (lst1.length > 0) {
          this.lstAllEntityCEO.push(...lst1)
        }
        const lst2 = [];
        const entitiesWithEntityProperty3 = this.submapid.filter((item: { CREATED_BY: any; }) => item.CREATED_BY !== undefined);
        const usersSVP4 = entitiesWithEntityProperty3.filter((item: { CREATED_BY: any; }) => item.CREATED_BY === model.Data.CREATED_BY);
        if (usersSVP3.length > 0) {
          lst2.push({ ...usersSVP4, type: "group" });
          lst2.forEach(a => { a.type = "group"; });
        }
        if (lst2.length > 0) {
          this.lstAllEntityCEO.push(...lst2)
        }
        const lstEntityCEO = [];
        const ent1 = lstAllEntityCEO.filter((item: { ENTITY_ID: any; }) => item.ENTITY_ID === model.Data.ENTITY_ID);
        if (ent1.length > 0) {
          lstEntityCEO.push(...ent1);
        }
        if (lstEntityCEO != null && lstEntityCEO.length > 0) {
          const empIds = this.usrmstid.filter((item: { EMPNO: any; }) => item.EMPNO !== undefined);
          const ceo = lstEntityCEO.filter((item: { EMPLOYEE_ID: any; }) => item.EMPLOYEE_ID === empIds.EMPNO);
          const empNosToFilter = this.usrmstid.filter((item: { RA_ID: any; }) => item.RA_ID !== undefined);
          const ceoFirstLevelDown = lstEntityCEO.filter((item: { EMPLOYEE_ID: any; ENTITY_ID: any }) => item.EMPLOYEE_ID === empNosToFilter.RA_ID && item.ENTITY_ID === model.Data.ENTITY_ID);
          const ceoSecondLevelDown = lstEntityCEO.filter((l: { EMPLOYEE_ID: any; RA_ID: any; ENTITY_ID: any }) => {
            const userMasterJoin = []; if (empNosToFilter.RA_ID === l.EMPLOYEE_ID) { userMasterJoin.push(l.EMPLOYEE_ID) }
            const userMasterJoin1 = []; if (empIds.EMPNO === l.RA_ID) { userMasterJoin.push(l.RA_ID) }
            return userMasterJoin && userMasterJoin1 && userMasterJoin.filter((u: { ENTITY: any; }) => u.ENTITY === model.Data.ENTITY_ID) && userMasterJoin1.filter((u: { ENTITY: any; }) => u.ENTITY) === model.Data.ENTITY_ID &&
              l.ENTITY_ID === model.Data.ENTITY_ID;
          });
          this.lstUsers.push(...ceo, ...ceoFirstLevelDown, ...ceoSecondLevelDown);
          
        }
      }
      if (model.Data.SVP_ABOVE) {
        const entitiesWithEntityProperty = this.usrmstid.filter((item: { DESIGNATION: any; }) => item.DESIGNATION !== undefined);
        const usersSVP = entitiesWithEntityProperty.filter((item: { DESIGNATION: any; }) => item.DESIGNATION === model.Data.ENTITY_ID);
        this.lstUsers.push(...usersSVP);
      }
      // this.lstUsers = [];
      if (model.Data.ALL_EMPLOYEEES) {
        // debugger;
        const entitiesWithEntityProperty = this.usrmstid.filter((item: { ENTITY: any; }) => item.ENTITY !== undefined);
        const allEmpEntity = entitiesWithEntityProperty.filter((item: { ENTITY: any; }) => item.ENTITY === model.Data.ENTITY_ID);
        if (allEmpEntity.length > 0) {
          this.lstUsers.push(...allEmpEntity);
        }
      }
    }
    else if (model.Data.SBU_ID !== null && model.Data.SBU_ID !== '') {
      if (model.Data.LOB_ID !== null && model.Data.LOB_ID !== '') {
        if (model.Data.SUBLOB_ID !== null && model.Data.SUBLOB_ID !== '') {
          if (model.Data.SVP_ABOVE) {
            const entiti = this.usrmstid.filter((item: { DESIGNATION: any; SBU: any, DEPARTMENT: any, SLOB: any }) => item.DESIGNATION !== undefined);
            const desig = this.desigid.filter((item: { DESIGNATION: any; }) => item.DESIGNATION !== undefined);
            const usersSVP6 = entiti.filter((item: { DESIGNATION: any; SBU: any, DEPARTMENT: any, SLOB: any; }) => item.DESIGNATION === model.Data.ENTITY_ID && item.DESIGNATION === desig.DESIGNATION && item.SBU === model.Data.SBU_ID && item === model.Data.LOB_ID && item === model.Data.SUBLOB_ID);
            if (usersSVP6.length > 0) {
              this.lstUsers.push(...usersSVP6);
            }
          }
          if (model.Data.ALL_EMPLOYEEES) {
            const entiti = this.usrmstid.filter((item: { SBU: any, DEPARTMENT: any, SLOB: any }) => item.SBU !== undefined);
            const allEmpEntity = entiti.filter((item: { SBU: any, DEPARTMENT: any, SLOB: any; }) => item.SBU == model.Data.SBU_ID && item.DEPARTMENT == model.Data.LOB_ID && item.SLOB == model.Data.SUBLOB_ID);
            if (allEmpEntity.length > 0) {
              this.lstUsers.push(...allEmpEntity);
            }
          }
        } else {
          if (model.Data.SVP_ABOVE) {
            const entiti = this.usrmstid.filter((item: { DESIGNATION: any; SBU: any, DEPARTMENT: any, }) => item.DESIGNATION !== undefined);
            const desig = this.desigid.filter((item: { DESIGNATION: any; }) => item.DESIGNATION !== undefined);
            const usersSVP6 = entiti.filter((item: { DESIGNATION: any; SBU: any, DEPARTMENT: any, }) => item.DESIGNATION === model.Data.ENTITY_ID && item.DESIGNATION === desig.DESIGNATION && item.SBU === model.Data.SBU_ID && item === model.Data.LOB_ID);
            if (usersSVP6.length > 0) {
              this.lstUsers.push(...usersSVP6);
            }
          }
          if (model.Data.ALL_EMPLOYEEES) {
            const entiti = this.usrmstid.filter((item: { SBU: any, DEPARTMENT: any, }) => item.SBU !== undefined);
            const allEmpEntity = entiti.filter((item: { SBU: any, DEPARTMENT: any, }) => item.SBU == model.Data.SBU_ID && item.DEPARTMENT == model.Data.LOB_ID);
            if (allEmpEntity.length > 0) {
              this.lstUsers.push(...allEmpEntity);
            }
          }
        }
      } else {
        if (model.Data.SVP_ABOVE) {
          const entiti = this.usrmstid.filter((item: { DESIGNATION: any; SBU: any, }) => item.DESIGNATION !== undefined);
          const desig = this.desigid.filter((item: { DESIGNATION: any; }) => item.DESIGNATION !== undefined);
          const usersSVP6 = entiti.filter((item: { DESIGNATION: any; SBU: any; }) => item.DESIGNATION === model.Data.ENTITY_ID && item.DESIGNATION === desig.DESIGNATION && item.SBU === model.Data.SBU_ID);
          if (usersSVP6.length > 0) {
            this.lstUsers.push(...usersSVP6);
          }
        }
        if (model.Data.ALL_EMPLOYEEES) {
          const entiti = this.usrmstid.filter((item: { SBU: any, }) => item.SBU !== undefined);
          const allEmpEntity = entiti.filter((item: { SBU: any, }) => item.SBU == model.Data.SBU_ID);
          if (allEmpEntity.length > 0) {
            this.lstUsers.push(...allEmpEntity);
          }

        }
      }
    }

    if (this.UpdateUserMaster(this.lstUsers, param1, model.Data.CREATED_BY) === true) {
      // debugger
      var model1: any = {
        lstUser: this.lstUsers,

        status: param1,
        CRE_USER: model.Data.CREATED_BY

      }
      // console.log("model", model1);


      if (param1 === "Y") {
        var apiUrl = 'usrcategory/CreatbussinessUSRMST';
        this.rest.create(this.Global.getapiendpoint() + apiUrl, model1);
        return null;
      }
      // return this.SaveBusinessUserMaster(this.lstUsers, param2 + " Employee Categorization", model.Data.CRE_USER);
      else {
        var apiUrl1 = 'usrcategory/deletebussinessUSRMST';
        this.rest.create(this.Global.getapiendpoint() + apiUrl1, model1);
        return null;
      }
      // return this.DeActivateBusinessUserMaster(this.lstUsers, param2 + " Employee Categorization", model.Data.CRE_USER);
    } else {
      return false;
    }
  }

  UpdateUserMaster(lstUsers: any[], status: string, CRE_USER: any): boolean {
    var body = {
      lstUsers: lstUsers,
      status: status,
      CRE_USER: CRE_USER
    };

    var apiUrl = 'usrcategory/updateusrmst';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, body);
    return true;
  }

}








