import { Component, OnInit } from '@angular/core';
import { ExcelService } from "./../common/excel.service"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultLayoutComponent } from 'src/app/default-layout/default-layout.component';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import * as moment from 'moment'
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../common/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})



export class LoginComponent implements OnInit {
  hide = true;
  GP_ID: any;
  roleid: any;
  userLoggedIn: any;
  menuarray: any = []
  Login_ExistingUser = this.formBuilder.group({
    UserName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_.]*'), Validators.maxLength(100)]],
    Password: ['', [Validators.required, Validators.maxLength(100)]]
  });


  get UserName() { return this.Login_ExistingUser.get('UserName'); }
  get Password() { return this.Login_ExistingUser.get('Password'); }

  constructor(
    private formBuilder: FormBuilder, private router: Router,
    private global: Global, private authService: AuthService,
    private rest: RestService, private messageService: MessageService,

  ) {

  }

  ngOnInit(): void {

    this.authService.logout();
    this.Login_ExistingUser.markAsUntouched();
  }


  loginUser() {

    var model = {
      UserName: this.UserName?.value.toLowerCase(),
      Password: this.Password?.value.toLowerCase(),
    };
    // console.log("model", model);

    // this.rest.postParams(this.global.getapiendpoint() + 'newlogin/AuthenticateUser', model).subscribe((data: any) => {
    //   if (data.Success == true) {
    //     console.log("data",data.Data);

    //     this.rest.getById(this.global.getapiendpoint() + 'newmenu/GetAllMenuById/', data.Data.DEFAULTROLEID).subscribe((menudata: any) => {
    //       this.roleid = data.Data.DEFAULTROLEID
    //       console.log("menudata.Data", menudata.Data);
    //       sessionStorage.setItem('isLoggedIn', "true");
    //       sessionStorage.setItem('jwt_token', data.Data);
    //       localStorage.setItem('isLoggedIn', "true");
    //       localStorage.setItem('userLoggedIn', JSON.stringify(data.Data));
    //       localStorage.setItem('menuItems', JSON.stringify(menudata.Data));
    //       this.router.navigate(['/pit/Home']);

    //       // sessionStorage.setItem('SubmenuItems', JSON.stringify(Submenudata.Data));
    //       // console.log("menudata:.Data:", menudata);

    //       // this.loginSuccessfull();
    //       // if (this.roleid == 1) {
    //       //   this.router.navigate(['/pit/uiroleconfig']);
    //       // }
    //       // else if (this.roleid == 2) {
    //       //   this.router.navigate(['/mps/dashboard']);
    //       // }
    //       // else if (this.roleid == 3) {
    //       //   this.router.navigate(['/mps/oracle']);
    //       // }
    //       // else if (this.roleid == 4) {
    //       //   this.router.navigate(['/mps/dashboard']);
    //       // }
    //       // else {
    //       //   this.router.navigate(['/mps/dashboard']);

    //       // }

    //     });
    //   }
    //   else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
    //   }
    // });
    this.rest.postParams(this.global.getapiendpoint() + 'newlogin/AuthenticateUser', model).subscribe((data: any) => {
      if (data.Success == true) {
        // console.log("data",data.Data);
        sessionStorage.setItem('isLoggedIn', "true");
        sessionStorage.setItem('jwt_token', data.Data);
        let jwt_token = sessionStorage.getItem('jwt_token');
        let decodedData: any = this.decrypt(jwt_token);
        const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
        this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
        this.getMenu(this.userLoggedIn.DEFAULTROLEID);
        // this.router.navigate(['/pit/Home']);

      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
      }
    });
  }

  decrypt(encryptedString: any) {

    let plainText = jwtDecode(encryptedString);
    return plainText;

  }

  getMenu(Id:any) {
    this.rest.getById(this.global.getapiendpoint() + `newmenu/GetAllMenuById/`,Id).subscribe((menudata: any) => {
      // if (menudata.Success == true) {
      this.roleid = Id;
      // console.log("menudata.Data", menudata.Data);
      sessionStorage.setItem('menuItems', JSON.stringify(menudata.Data));
      this.router.navigate(['/pit/Home']);
      // }else{
      // }
    })
  }
}
