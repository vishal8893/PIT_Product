import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _Moment from 'moment';



@Component({
  selector: 'app-substantial-interest-declaration-form',
  templateUrl: './substantial-interest-declaration-form.component.html',
  styleUrls: ['./substantial-interest-declaration-form.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class SubstantialInterestDeclarationFormComponent implements OnInit {

  showPopup: boolean = false;
  showMainContent: boolean = false;
  LoggedInUser: any;
  EmployeeId: any;
  DeptName: any;
  firstName: any;
  lastName: any;
  pan: any;
  rows: any[] = [];
  onadd: boolean = true;
  oncancel: boolean = true;
  contid: any;
  nsiid: any;
  dataSaved: boolean = false;
  dataSaved1: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // this.LoggedInUser = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    if (this.LoggedInUser) {
      // this.EmployeeId = this.LoggedInUser.ID; 
      this.EmployeeId = this.LoggedInUser.EMPNO;
      this.DeptName = this.LoggedInUser.DEPARTMENT;
      this.firstName = this.LoggedInUser.FIRSTNAME;
      this.lastName = this.LoggedInUser.LASTNAME;
      this.pan = this.LoggedInUser.PANCARDNO;
      this.getallRelation();
      this.getallNSI();
      this.togglePopup();
    } else {
      this.router.navigate(['pit/login']);
      localStorage.setItem('route', 'pit/scoi');
    }
  }

  togglePopup() {

    var model: any =
    {
      eid: this.EmployeeId,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                        
    // console.log("toggleeid", encryptmodel);


    var apiUrl = '';
    apiUrl = 'scoi/checkSubmit';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {

      if (data.Success) {
        // console.log(data);
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.showPopup = false;
        this.showMainContent = true;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
      }
      else {
        this.showPopup = true;
        // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  continue() {
    var model: any =
    {
      eid: this.EmployeeId,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             

    var apiUrl = '';
    apiUrl = 'scoi/saveAcceptResponse';

    this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.showPopup = false;
        this.showMainContent = true;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
      }
      else {
        this.showPopup = true;
        // this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })

  }

  addRow() {
    this.rows.push({
      isAddbtn: true,
      isdelete: false,
      isAdding: false,
      name: '',
      relation: '',
      interest: '',
      directorId: '',
      pan: ''
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  // addData(index: number) {
  //   const newRowData = this.rows[index];
  //   console.log("rowData", newRowData);

  //   // Assuming the API call is successful
  //   // Update the row to show the delete button and hide the add button
  //   this.rows[index] = {
  //     ...newRowData,
  //     isdelete: true,
  //     isAddbtn: false
  //   };
  // }

  // isAllDataFilled(): boolean {
  //   for (const row of this.rows) {
  //     if (
  //       !row.name ||
  //       !row.relation ||
  //       !row.interest ||
  //       !row.directorId || row.directorId.length !== 8 || 
  //       !this.isValidPan(row.pan) 
  //     ) {        
  //       return false;        
  //     }
  //   }    
  //   return true;
  // }

  isAllDataFilled(): boolean {
    for (const row of this.rows) {
      const normalizedDirectorId = row.directorId ? row.directorId.toLowerCase() : '';
      const normalizedPan = row.pan ? row.pan.toLowerCase() : '';

      if (
        !row.name ||
        !row.relation ||
        !row.interest ||
        (normalizedDirectorId !== 'na' && (row.directorId.length !== 8 || !row.directorId)) ||
        (normalizedPan !== 'na' && !this.isValidPan(row.pan))
      ) {
        return false;
      }
    }
    return true;
  }

  isValidPanFormat(pan: string): boolean {
    const panPattern = /[A-Za-z]{5}[0-9]{4}[A-Za-z]/;
    return panPattern.test(pan);
}

  isValidPan(pan: string): boolean {
    const panRegex = /[A-Za-z]{5}[0-9]{4}[A-Za-z]/;
    return pan && pan.length === 10 && panRegex.test(pan);
  }

  getallRelation() {
    this.rest.getAll(this.Global.getapiendpoint() + 'scoi/GetAllRelation').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.contid = Result;
        // console.log("getallRelation", this.contid)
      }
    });
  }

  getallNSI() {
    this.rest.getAll(this.Global.getapiendpoint() + 'scoi/GetAllNOSI').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.nsiid = Result;
        // console.log("getallNSI", this.nsiid)
      }
    });
  }

  submit() {
    // console.log('Data to be submitted:', this.rows);
    if (this.rows.length === 0) {
      alert('Please fill up details.');      
    } else {
      var model: any =
      {
        eid: this.EmployeeId,
        data: this.rows
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                            

      // console.log("model", encryptmodel);

      var apiUrl = '';
      apiUrl = 'scoi/saveFinalData';

      this.rest.create(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Data saved successfully." });
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.rows = [];
          this.dataSaved = false;
          this.dataSaved1 = false;
          alert('Data Saved Successfully,Please check mail.');
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: "Data Saved Successfully,Please check mail." });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      })
    }


  }

  cancel() {
    this.rows = [];
  }


}
