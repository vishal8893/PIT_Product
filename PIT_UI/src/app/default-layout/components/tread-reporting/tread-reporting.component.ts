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
import * as moment from 'moment';


@Component({
  selector: 'app-tread-reporting',
  templateUrl: './tread-reporting.component.html',
  styleUrls: ['./tread-reporting.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class TreadReportingComponent {
  ISIN: any
  TradeAvailableQty: any
  finalItems: any[] = [];
  sbunameNgmodel1: any;
  EmpNo: any;
  userLoggedIn: any;
  AssetARrray: any = [
    { ID: 1, Name: 'Equity' },
    { ID: 2, Name: 'Future' },
    { ID: 3, Name: 'Option' },
    { ID: 4, Name: 'PrimaryIssue' },
    { ID: 5, Name: 'SpecialCase' },

  ]

  products: Product[];
  TreadForm = this.formBuilder.group({
    Id: [''],
    Asset: ['', [Validators.required]],
    ExpiryDate: [''],
    RequestID: ['', [Validators.required]],
    AccountCode: [''],
    AccountName: [''],
    Mode: [''],
    ScriptName: [''],
    RequestedQuantity: [''],
    TotalPrice: [''],
    TradeDate: ['', [Validators.required]],
    Exchange: [''],
    TradeQty: ['', [Validators.required, Validators.min(1)]],
    StrikePrice: ['',],
    OptionType: ['']
  })
  PAN_NO: any;

  get Id() { return this.TreadForm.get('Id'); }
  get Asset() { return this.TreadForm.get('Asset'); }
  get ExpiryDate() { return this.TreadForm.get('ExpiryDate'); }
  get RequestID() { return this.TreadForm.get('RequestID'); }
  get AccountCode() { return this.TreadForm.get('AccountCode'); }
  get AccountName() { return this.TreadForm.get('AccountName'); }
  get Mode() { return this.TreadForm.get('Mode'); }
  get ScriptName() { return this.TreadForm.get('ScriptName'); }
  get RequestedQuantity() { return this.TreadForm.get('RequestedQuantity'); }
  get TotalPrice() { return this.TreadForm.get('TotalPrice'); }
  get TradeDate() { return this.TreadForm.get('TradeDate'); }
  get Exchange() { return this.TreadForm.get('Exchange'); }
  get TradeQty() { return this.TreadForm.get('TradeQty'); }
  get StrikePrice() { return this.TreadForm.get('StrikePrice'); }
  get OptionType() { return this.TreadForm.get('OptionType'); }



  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {

  }

  ngOnInit() {
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;;
    this.EmpNo = this.userLoggedIn.EMPNO;
    this.getReortingData()
  }


  onAssetCleared1() {
    this.TradeAvailableQty = ''
    this.TreadForm?.reset()
  }
  onAssetCleared2() {
    this.TradeAvailableQty = ''
    this.TreadForm?.reset()
  }
  onchangeevent() {
    this.finalItems = []


    let model = {
      EMP: this.EmpNo,
      Asset: this.Asset?.value
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    this.rest.postParams(this.Global.getapiendpoint() + 'tradereporting/GetTradeapproverrecordforsingale', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finalItems = Result
        console.log("finalItems", this.finalItems);

        // this.TradeAvailableQty = 24

      }
    });
  }



  createBtn() {

    let Pendingqty = Number(this.TradeAvailableQty) - Number(this.TradeQty?.value)

    let model = {
      ID: this.Id?.value,
      Asset: this.Asset?.value,
      RequestID: this.RequestID?.value,
      ExpiryDate: this.ExpiryDate?.value ? moment(this.ExpiryDate?.value).format('YYYY-MM-DD') : null,
      AccountCode: this.AccountCode?.value,
      AccountName: this.AccountName?.value,
      Mode: this.Mode?.value,
      ScriptName: this.ScriptName?.value,
      RequestedQuantity: this.RequestedQuantity?.value,
      TotalPrice: this.TotalPrice?.value,
      TradeDate: moment(this.TradeDate?.value).format('YYYY-MM-DD'),
      Exchange: this.Exchange?.value,
      TradeQty: this.TradeQty?.value,
      StrikePrice: this.StrikePrice?.value,
      OptionType: this.OptionType?.value,
      PAN_NO: this.PAN_NO,
      ISIN: this.ISIN,
      EMP: this.EmpNo,
      Pendingqty: Pendingqty
    }
    console.log("model", model);
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    this.rest.postParams(this.Global.getapiendpoint() + 'tradereporting/Singacreatetreade', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.cancel()
        this.getReortingData()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved Successfully.' });
      }
    });
  }
  setlotandQuantity(val: any) {
    if (parseInt(this.TradeAvailableQty) >= parseInt(val.value)) {

    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please check the available QTY' });
      this.TradeQty?.reset()

    }




  }

  cancel() {
    this.TradeAvailableQty = ''
    this.ISIN = ''
    this.TreadForm.reset();
  }

  setalldata(event: any) {
    this.TradeAvailableQty = ''
    let model = {
      ID: event.value,
      Asset: this.Asset?.value
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    this.rest.postParams(this.Global.getapiendpoint() + 'tradereporting/IRFDATAsingale', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        console.log("Resultghghgh", Result);
        this.PAN_NO = Result[0].PAN_NO
        this.Id?.setValue(Result[0].ID),
        this.AccountCode?.setValue(Result[0].AccountCode)
        this.AccountName?.setValue(Result[0].UPD_USER)
        this.Mode?.setValue(Result[0].Transaction)
        this.ScriptName?.setValue(Result[0].Security)
        this.RequestedQuantity?.setValue(Result[0].EqQuantity)
        this.TotalPrice?.setValue(Result[0].TotalPrice)
        // this.Exchange?.setValue(Result[0].NatureofTrade)
        this.StrikePrice?.setValue(Result[0].StrikePrice)
        this.ISIN = Result[0].ISIN
        this.TradeAvailableQty = Result[0].TradeAvailableQty

      }
    });
  }
  getReortingData() {
    let model = {
      EMP: this.EmpNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
    this.rest.postParams(this.Global.getapiendpoint() + 'tradereporting/GetTradeData', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result
        console.log("products", this.products);
      }
    });
  }
}
