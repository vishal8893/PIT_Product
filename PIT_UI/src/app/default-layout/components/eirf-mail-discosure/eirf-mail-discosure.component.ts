import { Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';
@Component({
  selector: 'app-eirf-mail-discosure',
  templateUrl: './eirf-mail-discosure.component.html',
  styleUrls: ['./eirf-mail-discosure.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class EirfMailDiscosureComponent implements OnInit {

  userLoggedIn: any;
  products: Product[];
  product: Product;
  userId: any
  expairyform: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global) {

  }

  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.userId = this.userLoggedIn.ID;

    this.getall();
  }



  getall() {
    var today = new Date();
    var quarter = Math.floor((today.getMonth() + 3) / 3);

    this.rest.getAll(this.Global.getapiendpoint() + 'quarter/GetAllactivequarter').subscribe((data: any) => {
      if (data.Success) {
        // console.log("1211111111111",data.Data);
        
        let Model = {
          Quarter: data.Data[0].QuarterId,
          // Createby: this.userId,
          Currentyear: moment(today).format('YYYY')
    
        }
    // console.log('Model',Model);
    
        this.rest.postParams(this.Global.getapiendpoint() + 'Disclosure/getEirfMailDisclosure', Model).subscribe((data: any) => {
          if (data.Success) {
            // console.log("kjffjdk",data.Data);
            
            this.products = data.Data
    
    
          }
        });
        
      }
    });


   
  }

  Upadte(value: any) {
    this.products.forEach((element: any, index: any) => {
      let Model = {
        ID: element.Id,
        Is_Active: value
      }

      this.rest.postParams(this.Global.getapiendpoint() + 'Disclosure/updateEirfMailDisclosure', Model).subscribe((data: any) => {
        if (data.Success == true) {

          this.getall()
          if (this.products.length == index + 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update record successfuly' });
          }

        }
      });

    })
  }

}
