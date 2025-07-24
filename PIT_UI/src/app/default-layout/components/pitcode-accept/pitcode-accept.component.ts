import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
import { Observable } from 'rxjs';
import * as _Moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pitcode-accept',
  templateUrl: './pitcode-accept.component.html',
  styleUrls: ['./pitcode-accept.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class PITCodeAcceptComponent implements OnInit {

  LoggedInUser: any;
  LoggedInUser1: any;
  EmployeeId: any;
  EmployeeId1: any;
  employeeId2: any;
  appid: any;
  windowsLoginID: any;
  sessionData: any;
  isLoading: boolean;
  showContent = false;
  employeeData: any = {};
  uid: any;
  // strEmpNo: string = '0';



  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
  }

  ngOnInit(): void {
    // debugger;

    // this.LoggedInUser1 = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.LoggedInUser1 = userLoggedInString ? JSON.parse(userLoggedInString) : null;

   
    this.LoggedInUser = this.LoggedInUser1.EMPNO;
    // this.LoggedInUser = '26';
    // this.LoggedInUser = '25';
    this.sessionData = JSON.parse(sessionStorage.getItem('POB')!);
    // this.EmployeeId = this.LoggedInUser1.ID;
    this.EmployeeId = this.LoggedInUser1.EMPNO;
    // this.sessionData = 'POB';
    // console.log(this.sessionData);
    this.getallUSTMST(this.EmployeeId);

    this.onPageLoad();


  }

  async onPageLoad() {
    // debugger;
    this.EmployeeId1 = this.getEmpId();
    // console.log(this.EmployeeId1)

    const sosPromise = this.PIT_Get_SOS_Rights('POB').toPromise();
    const result = await sosPromise;
    // console.log(result);
    // const ds = result;
    const sosLoggPromise = this.Get_PIT_SSO_LoggedinInfo(this.EmployeeId1).toPromise();
    const result1 = await sosLoggPromise;
    // console.log(result1);
    // const ds1 = result1;
    const applink = this.GET_PIT_Application_Link().toPromise();
    const result2 = await applink;
    // console.log(result2);
    // const ds2 = result2;LANDING_PAGE_LINK
    let strLandingPageLink = result2[0].LANDING_PAGE_LINK.toString();
    if (this.sessionData !== 'ALLOW' && result.Data.length === 0 && result1.Data.length === 0) {
      // window.location.href = strLandingPageLink;
      this.showContent = true;
      return;
    }

    this.employeeId2 = this.getEmpId();
    // this.employeeId2 = 25;
    localStorage.setItem('ID', this.employeeId2);
    const email = this.GetEmployeeIntimationMails().toPromise();
    const d5 = await email;
    const result3 = d5.filter((item: { EMPLOYEE_ID: any }) => item.EMPLOYEE_ID === this.employeeId2);
    // console.log(result3);
    if (result3.length > 0) {
      localStorage.setItem('IS_TRACKEDEMP', result3[0].IS_TRACKEDEMP);
      localStorage.setItem('EMAIL_TYPE', result3[0].EMAIL_TYPE);
    }


    {
      const pob = this.GetPOBAcceptPIT().toPromise();
      const d6 = await pob;
      const desiredEmployeeId = this.employeeId2;
      const result4 = d6.filter((item: { EMPLOYEE_ID: any }) => item.EMPLOYEE_ID === desiredEmployeeId);
      // console.log(result4);
      if (result4.length > 0) {
        const declare = this.GetPOBDeclaration().toPromise();
        const d7 = await declare;

        const result5 = d7.filter((item: { EMPLOYEE_ID: any }) => item.EMPLOYEE_ID === this.employeeId2);
        // console.log(result5);
        if (result5.length > 0) {
          //joiningdeclaration
          window.location.href = strLandingPageLink;
          // window.location.href = './joiningdeclaration'
        }
        else {
          let strLandingPageLink1 = `http://localhost:4200/pit/pobdeclartion`;
          // window.location.href = strLandingPageLink1;
          window.location.href = './pobdeclartion'
        }
      }
    }
    this.isLoading = false;
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

  PIT_Get_SOS_Rights(ApplicationName: any): Observable<any> {

    var body = {
      ApplicationName: ApplicationName,
    };

    var apiUrl = 'pitcodeaccess/getapplicationname';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, body);
  }

  Get_PIT_SSO_LoggedinInfo(EmployeeId: any): Observable<any> {

    var body = {
      EmployeeId: this.EmployeeId1,
    };

    var apiUrl = 'pitcodeaccess/getlemploggedininfo';

    return this.rest.postParams(this.Global.getapiendpoint() + apiUrl, body);
  }

  GET_PIT_Application_Link(): Observable<any> {
    const apiUrl = this.Global.getapiendpoint() + 'pitcodeaccess/GetAllApplink';

    // Use 'map' operator to extract the 'Data' property from the API response.
    return this.rest.getAll(apiUrl).pipe(
      map((response: any) => {
        if (response.Success) {
          return response.Data;
        } else {
          return []; // Return an empty array if the response is not successful.
        }
      })
    );
  }

  GetEmployeeIntimationMails(): Observable<any> {
    const apiUrl = this.Global.getapiendpoint() + 'pitcodeaccess/checkEmployeeEmailStatus';

    // Use 'map' operator to extract the 'Data' property from the API response.
    return this.rest.getAll(apiUrl).pipe(
      map((response: any) => {
        if (response.Success) {
          return response.Data;
        } else {
          return []; // Return an empty array if the response is not successful.
        }
      })
    );
  }

  GetPOBAcceptPIT(): Observable<any> {
    const apiUrl = this.Global.getapiendpoint() + 'pitcodeaccess/checkPOBAcceptPIT';

    // Use 'map' operator to extract the 'Data' property from the API response.
    return this.rest.getAll(apiUrl).pipe(
      map((response: any) => {
        if (response.Success) {
          return response.Data;
        } else {
          return []; // Return an empty array if the response is not successful.
        }
      })
    );
  }

  GetPOBDeclaration(): Observable<any> {
    const apiUrl = this.Global.getapiendpoint() + 'pitcodeaccess/checkPOBDeclaration';

    // Use 'map' operator to extract the 'Data' property from the API response.
    return this.rest.getAll(apiUrl).pipe(
      map((response: any) => {
        if (response.Success) {
          return response.Data;
        } else {
          return []; // Return an empty array if the response is not successful.
        }
      })
    );
  }

  getEmpId() {
    // const windowsLoginID = this.LoggedInUser1.ID();
    // const login = 'ewmwealth\\NileshJM';
    this.windowsLoginID = this.LoggedInUser;

    return this.windowsLoginID;
  }

  onAcceptClick() {
    var model: any = {

      employee_Id: this.EmployeeId1,

    };
    // console.log("model", model);

    var apiUrl = '';
    apiUrl = 'pitcodeaccess/PostEAHPOBAcceptPIT';
    this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
      if (data.Success) {
        // console.log("data", data);
        let strLandingPageLink2 = `http://localhost:4200/pit/pobdeclartion`;
        window.location.href = strLandingPageLink2;
        // window.location.href = `http://localhost:4200/pit/pitdeclare`;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }


}











