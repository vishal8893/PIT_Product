import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-nwil-block-un-block-file-upload',
  templateUrl: './nwil-block-un-block-file-upload.component.html',
  styleUrls: ['./nwil-block-un-block-file-upload.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class NWILBlockUnBlockFileUploadComponent {

  // optiontypearray: any = [
  //   { id: 1, name: 'NWIL Employee Block/Unblock' }
  // ]

  Todate: any = ''
  Fromdate: any = ''
  optiontypearray: any= [];
  reportdata: any = []
  Type: any
  userLoggedIn: any;
  userId: any;
  EmpNo: any;
  empname: any;
  CODE: any;
  PANCARDNO: any;
  projectID: any;

  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private Global: Global, private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);

    this.userId = this.userLoggedIn.ID;
    this.EmpNo = this.userLoggedIn.EMPNO;
    this.empname = this.userLoggedIn.FIRSTNAME;
    this.CODE = this.userLoggedIn.CODE;
    this.PANCARDNO = this.userLoggedIn.PANCARDNO;

    // this.getAllProject();
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
          PROJECT_NAME: event.query
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

        this.rest.postParams(this.Global.getapiendpoint() + "nwilreport/GetAllProjectName", { encryptmodel: encryptmodel }).subscribe((data: any) => {
          if (data.Success == true) {
            var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.optiontypearray = Result;
            // console.log("SearchSecurityData", this.SearchSecurityData);
          }
        })
    } else {
      this.optiontypearray = []
    }


  }

  setisin(event: any) {
    // console.log('Selected Value: ', event.SCRIP_DESC);
    let setvalue = event.PROJECT_NAME
    this.optiontypearray.forEach(element => {
      if (setvalue == element.PROJECT_NAME) {
        this.projectID = element.ID
      } else {
        // this.ISINNumber?.setValue('')
        // this.LotSize = ''
      }
    });
  }


  getreport() {
    // debugger;

    this.reportdata = [];
    console.log(this.projectID,this.Type)
    if (this.Type !== null && this.Type !== undefined) {

      let model = {
        // Project_Name: this.Type,
        ID: this.projectID, 
        fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
        toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
      }

      // console.log('Type',model);
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      this.rest.postParams(this.Global.getapiendpoint() + 'nwilreport/GenerateNWILReport', { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));

          // Result.forEach((element: any) => {
          //   this.reportdata.push({
          //     PROJECT_NAME: element.PROJECT_NAME,
          //     SCRIPT_NAME: element.SCRIPT_NAME,
          //     ISIN: element.ISIN,
          //     EMPNO: element.EMPNO,
          //     IS_CHANGE: element.IS_CHANGE,
          //   })
          // })

          Result.forEach((element: any) => {
            if (element.EMPNO !== null && element.IS_CHANGE !== null) {
              this.reportdata.push({
                PROJECT_NAME: element.PROJECT_NAME,
                SCRIPT_NAME: element.SCRIPT_NAME,
                ISIN: element.ISIN,
                EMPNO: element.EMPNO,
                IS_CHANGE: element.IS_CHANGE,
              });
            }
          });

          if (this.reportdata.length > 0) {
            this.excelDoWnload()
            this.Type = '';
            this.Fromdate = '';
            this.Todate = '';
            this.projectID = '';
            this.optiontypearray;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No records for export' });
            this.Type = '';
            this.Fromdate = '';
            this.Todate = '';
            this.projectID = '';
            this.optiontypearray;
          }

        }
      })

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Select the Type' });
    }

  }

  excelDoWnload() {
    if (this.reportdata[0]) {
      const wb = XLSX.utils.book_new();

      const sheet1 = XLSX.utils.json_to_sheet(this.reportdata);

      XLSX.utils.book_append_sheet(wb, sheet1, 'NWIL Report');

      XLSX.writeFile(wb, 'NWILEmpBlockUnBlock.xlsx');


    }
  }

}
