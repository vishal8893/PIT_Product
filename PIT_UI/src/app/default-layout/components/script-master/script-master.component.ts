import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { Product } from 'src/app/common/product';
// import { timestamp } from 'rxjs';

@Component({
  selector: 'app-script-master',
  templateUrl: './script-master.component.html',
  styleUrls: ['./script-master.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class ScriptMasterComponent implements OnInit {

  bsecodeNgModel: any;
  nsebsecodeNgModel: any;
  nsecodeNgModel: any;
  lotsizeNgModel: any;
  isincodeNgModel: any;
  blmrgcodeNgModel: any;
  retuerscodeNgModel: any;
  sedolcodeNgModel: any;
  divdateNgModel: any;
  restrictNgModel: any;
  scdescNgModel: any;
  holdperiodNgModel: any;
  irfNgModel: any;
  bsegroupnameNgModel: any;
  TRX_NO: any
  excNgmodel: any;
  tradeNgmodel: any;
  exid: any;
  tradeid: any;
  activemodel: boolean | null;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  ENTMATSUBID: any;
  is_gov_security: boolean;
  scriptmstform: FormGroup;


  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.scriptmstform = this.formBuilder.group({
      bsecodecontroller: [''],
      nsebseccodecontroller: [''],
      nsecodecontroller: [''],
      lotsizecontroller: [''],
      isisncontroller: ['', Validators.required], // Make ISIN Code required
      blmrgcontroller: [''],
      retutercontroller: [''],
      sedolcontroller: [''],
      divcontroller: [''],
      rescontroller: [''],
      scdescontroller: ['', Validators.required], // Make Script Desc required
      holdcontroller: [30],
      irfcontroller: [1],
      bsegroupcontroller: [''],
      excontroller: [''],
      tradecontroller: [''],
      activecontroller: [this.activemodel],
    });
    
    // this.scriptmstform = this.formBuilder.group({
    //   bsecodecontroller: [''],
    //   nsebseccodecontroller: [''],
    //   nsecodecontroller: [''],
    //   lotsizecontroller: [''],
    //   isisncontroller: [''],
    //   blmrgcontroller: [''],
    //   retutercontroller: [''],
    //   sedolcontroller: [''],
    //   divcontroller: [''],
    //   rescontroller: [''],
    //   scdescontroller: ['', Validators.required],
    //   holdcontroller: [30],
    //   irfcontroller: [1],
    //   bsegroupcontroller: [''],
    //   excontroller: [''],
    //   tradecontroller: [''],
    //   activecontroller: [this.activemodel],
    // });
    
  }

  ngOnInit() {
    this.oneditbtn = false;
    this.getallexchangedata();
    this.getalltradeofnature();
    this.getallScriptdata();

  }

  creatform() {
  }

  isValidBseOrNseCode(): boolean {
    const bseCode = this.scriptmstform.get('bsecodecontroller').value;
    const nseCode = this.scriptmstform.get('nsecodecontroller').value;
    return !!bseCode || !!nseCode;
  }

  isValidLotSize(): boolean {
    if (!this.lotsizeNgModel) {
      return false; // Empty field is considered invalid
    }
    // Regular expression to match decimal numbers or integers
    const decimalNumberRegex = /^\d+(\.\d+)?$/;
    return decimalNumberRegex.test(this.lotsizeNgModel);
  }
  
  groupdata: any;
  getallexchangedata() {
    this.rest.getAll(this.Global.getapiendpoint() + 'scriptmst/GetAllgenericdata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.exid = Result;
        // console.log("getallexchangedata", this.exid)
      }
    });
  }

  getalltradeofnature() {
    this.rest.getAll(this.Global.getapiendpoint() + 'scriptmst/GetAllnatureoftradedata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.tradeid = Result;
        // console.log("getalltradeofnature", this.tradeid)
      }
    });
  }

  getallScriptdata() {
    this.rest.getAll(this.Global.getapiendpoint() + 'scriptmst/GetAllScriptdata').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getAllindivisualsscripdata", this.products)
      }
    });
  }

  createScriptmst() {
    const bsecodecontroller = this.scriptmstform.get('bsecodecontroller');
    // const nsebseccodecontroller = this.scriptmstform.get('nsebseccodecontroller');
    const nsecodecontroller = this.scriptmstform.get('nsecodecontroller'); 
    // const lotsizecontroller = this.scriptmstform.get('lotsizecontroller');
    const isisncontroller = this.scriptmstform.get('isisncontroller'); 
    // const blmrgcontroller = this.scriptmstform.get('blmrgcontroller'); 
    // const retutercontroller = this.scriptmstform.get('retutercontroller'); 
    // const sedolcontroller = this.scriptmstform.get('sedolcontroller'); 
    // const divcontroller = this.scriptmstform.get('divcontroller'); 
    // const rescontroller = this.scriptmstform.get('rescontroller'); 
    const scdescontroller = this.scriptmstform.get('scdescontroller'); 
    // const bsegroupcontroller = this.scriptmstform.get('bsegroupcontroller'); 
    // const excontroller = this.scriptmstform.get('excontroller'); 
    // const tradecontroller = this.scriptmstform.get('tradecontroller');
    let hasErrors = false;
    if (!isisncontroller.value || !scdescontroller.value) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN code and Scrip Description are required' });
  
      // Mark ISIN code and Scrip Description as dirty and set an error state
      isisncontroller.markAsDirty();
      scdescontroller.markAsDirty();
      hasErrors = true;
    }
    if (!this.isValidBseOrNseCode()) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Either BSE or NSE code is required' });
      
  
      // Mark BSE code and NSE code as dirty and set an error state
      bsecodecontroller.markAsDirty();
      nsecodecontroller.markAsDirty();
      hasErrors = true;      
    }
    if (!hasErrors) {
      // if (this.bsecodeNgModel && this.nsebsecodeNgModel && this.nsecodeNgModel && this.lotsizeNgModel && this.isincodeNgModel && this.blmrgcodeNgModel
      //   && this.retuerscodeNgModel && this.sedolcodeNgModel && this.divdateNgModel && this.restrictNgModel && this.scdescNgModel && this.bsegroupnameNgModel
      //   && this.excNgmodel && this.tradeNgmodel) {
        // if(this.scdescNgModel && this.isincodeNgModel && this.holdperiodNgModel && this.irfNgModel){
      this.oneditbtn = false;

      var model: any = {

        BSE_CODE: this.bsecodeNgModel || null,
        NSE_BSE_CODE: this.nsebsecodeNgModel || null,
        NSE_CODE: this.nsecodeNgModel || null,
        LOT_SIZE: this.lotsizeNgModel || null,
        ISIN_CODE: this.isincodeNgModel,
        BLOOMBERG_CODE: this.blmrgcodeNgModel || null,
        REUTERS_CODE: this.retuerscodeNgModel || null,
        SEDOL_CODE: this.sedolcodeNgModel || null,
        DIVIDEND_DATE: this.divdateNgModel || null,
        RESTRICTED_RESET: this.restrictNgModel || null,
        SCRIP_DESC: this.scdescNgModel,
        HOLDING_PERIOD: this.holdperiodNgModel,
        IRF_FORMATS: this.irfNgModel,
        BSE_GROUP_Name: this.bsegroupnameNgModel || null,
        EXCHANGE: this.excNgmodel || null,
        NATURE_OF_TRADE:this.tradeNgmodel || null,
        is_gov_security: this.activemodel || false,
        
      };

      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             
      // console.log("model", encryptmodel);
      var apiUrl = '';

      apiUrl = 'scriptmst/CreateScriptdata';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
           var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallScriptdata();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully.' });
          this.cancel();
          // this.bsecodeNgModel = null
          // this.nsebsecodeNgModel = null
          // this.nsecodeNgModel = null
          // this.lotsizeNgModel = null
          // this.isincodeNgModel = null
          // this.blmrgcodeNgModel = null
          // this.retuerscodeNgModel = null
          // this.sedolcodeNgModel = null
          // this.divdateNgModel = null
          // this.restrictNgModel = null
          // this.scdescNgModel = null
          // this.holdperiodNgModel = null
          // this.irfNgModel = null
          // this.bsegroupnameNgModel = null
          // this.excNgmodel = null
          // this.tradeNgmodel = null
          this.activemodel = null

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
        this.getallScriptdata();
      });
    }
    else {
      // bsecodecontroller.markAsDirty();
      // nsebseccodecontroller.markAsDirty();
      // nsecodecontroller.markAsDirty();
      // lotsizecontroller.markAsDirty();
      // isisncontroller.markAsDirty();
      // blmrgcontroller.markAsDirty();
      // retutercontroller.markAsDirty();
      // sedolcontroller.markAsDirty();
      // divcontroller.markAsDirty();
      // rescontroller.markAsDirty();
      // scdescontroller.markAsDirty();
      // bsegroupcontroller.markAsDirty();
      // excontroller.markAsDirty();
      // tradecontroller.markAsDirty();

      // if (bsecodecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (nsebseccodecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (nsecodecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (lotsizecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (isisncontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (blmrgcontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (retutercontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (sedolcontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (divcontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (rescontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (scdescontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (bsegroupcontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      // if (excontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Code is required' });
      // }
      // if (tradecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Entity Name is required' });
      // }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }

  onEditScriptmst(product: any) {
    // debugger;
    
    this.oneditbtn = true;
    this.onadd = false;
    this.oncancel = true;

    var model: any = {

      // ID:product.ID,
      TRX_NO: product.TRX_NO,

    }
    // console.log("model", model);

    var apiUrl = '';
    apiUrl = 'scriptmst/getalldatafortrxno';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {

      if (data.Success) {
        if (data.Data && data.Data.length > 0) {
          // this.scriptmstform.patchValue({
          //   // bsecodecontroller: product.BSE_CODE,
          //   isisncontroller: product.ISIN_CODE,
          //   scdescontroller: product.SCRIP_DESC,
          //   // bsegroupcontroller: product.BSE_GROUP_Name,
          //   excontroller: product.Exchange.ID,
          //   tradecontroller: product.NatureOfTrade.ID,
          //   activecontroller: this.activemodel
          // });
          this.bsecodeNgModel = product.BSE_CODE,
          this.nsebsecodeNgModel = product.NSE_BSE_CODE,
          this.nsecodeNgModel = product.NSE_CODE,
          this.lotsizeNgModel = product.LOT_SIZE,
          this.isincodeNgModel = product.ISIN_CODE,
          this.blmrgcodeNgModel = product.BLOOMBERG_CODE,
          this.retuerscodeNgModel = product.REUTERS_CODE,
          this.sedolcodeNgModel = product.SEDOL_CODE;
          if (product.DIVIDEND_DATE === null) {
            this.divdateNgModel = product.DIVIDEND_DATE;
          } else {
            const dateParts = product.DIVIDEND_DATE.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const day = parseInt(dateParts[2], 10);
            const date = new Date(year, month, day);
            this.divdateNgModel = date;
          }
                     
          this.restrictNgModel = product.RESTRICTED_RESET,
          this.scdescNgModel = product.SCRIP_DESC,
          this.holdperiodNgModel = product.HOLDING_PERIOD,
          this.irfNgModel = product.IRF_FORMATS,
          this.bsegroupnameNgModel = product.BSE_GROUP_Name,
          this.excNgmodel=product.EXCHANGE;
          this.tradeNgmodel=product.NATURE_OF_TRADE;
          this.TRX_NO = product.TRX_NO,
          this.activemodel = data.Data[0].is_gov_security;
            // this.excNgmodel= { "ID": product.TBL_GENERIC_MST.ID, "NAME": product.TBL_GENERIC_MST.NAME, };
            // this.tradeNgmodel= { "ID": product.TBL_GENERIC_MST.ID, "NAME": product.TBL_GENERIC_MST.NAME, };
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Data Successully" });

        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      }
    })
  }

  updateScriptmst() {
    // debugger;
    const bsecodecontroller = this.scriptmstform.get('bsecodecontroller');
    // const nsebseccodecontroller = this.scriptmstform.get('nsebseccodecontroller');
    const nsecodecontroller = this.scriptmstform.get('nsecodecontroller'); 
    // const lotsizecontroller = this.scriptmstform.get('lotsizecontroller');
    const isisncontroller = this.scriptmstform.get('isisncontroller'); 
    // const blmrgcontroller = this.scriptmstform.get('blmrgcontroller'); 
    // const retutercontroller = this.scriptmstform.get('retutercontroller'); 
    // const sedolcontroller = this.scriptmstform.get('sedolcontroller'); 
    // const divcontroller = this.scriptmstform.get('divcontroller'); 
    // const rescontroller = this.scriptmstform.get('rescontroller'); 
    const scdescontroller = this.scriptmstform.get('scdescontroller'); 
    // const bsegroupcontroller = this.scriptmstform.get('bsegroupcontroller'); 
    // const excontroller = this.scriptmstform.get('excontroller'); 
    // const tradecontroller = this.scriptmstform.get('tradecontroller');
    let hasErrors = false;
    if (!isisncontroller.value || !scdescontroller.value) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN code and Scrip Description are required' });
  
      // Mark ISIN code and Scrip Description as dirty and set an error state
      isisncontroller.markAsDirty();
      scdescontroller.markAsDirty();
      hasErrors = true;
    }
    if (!this.isValidBseOrNseCode()) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Either BSE or NSE code is required' });
  
      // Mark BSE code and NSE code as dirty and set an error state
      bsecodecontroller.markAsDirty();
      nsecodecontroller.markAsDirty();
      hasErrors = true;
    }
    if (!hasErrors) {
    // if (this.bsecodeNgModel && this.nsebsecodeNgModel && this.nsecodeNgModel && this.lotsizeNgModel && this.isincodeNgModel && this.blmrgcodeNgModel
    //   && this.retuerscodeNgModel && this.sedolcodeNgModel && this.divdateNgModel && this.restrictNgModel && this.scdescNgModel && this.bsegroupnameNgModel
    //   && this.excNgmodel && this.tradeNgmodel) {
      this.oneditbtn = false;
   
      var model: any = {
        // BSE_CODE: bsecodecontroller,
        // ISIN_CODE: isisncontroller,
        // SCRIP_DESC: scdescontroller,
        // BSE_GROUP_Name: bsegroupcontroller,
        // EXCHANGE: excontroller,
        // NATURE_OF_TRADE: tradecontroller,
        // is_gov_security: activecontroller,

        BSE_CODE: this.bsecodeNgModel,
        NSE_BSE_CODE: this.nsebsecodeNgModel,
        NSE_CODE: this.nsecodeNgModel,
        LOT_SIZE: this.lotsizeNgModel,
        ISIN_CODE: this.isincodeNgModel,
        BLOOMBERG_CODE: this.blmrgcodeNgModel,
        REUTERS_CODE: this.retuerscodeNgModel,
        SEDOL_CODE: this.sedolcodeNgModel,
        DIVIDEND_DATE: this.divdateNgModel || null,
        RESTRICTED_RESET: this.restrictNgModel,
        SCRIP_DESC: this.scdescNgModel,
        HOLDING_PERIOD: this.holdperiodNgModel,
        IRF_FORMATS: this.irfNgModel,
        BSE_GROUP_Name: this.bsegroupnameNgModel,
        EXCHANGE: this.excNgmodel,
        NATURE_OF_TRADE:this.tradeNgmodel,
        is_gov_security: this.activemodel || false,
        TRX_NO: this.TRX_NO        

      };
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                            
      // console.log("model", encryptmodel);
      var apiUrl = '';
      apiUrl = 'scriptmst/UpdateScriptdata';

      this.rest.create(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.getallScriptdata();
          
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully.' });
          this.cancel();
          // this.bsecodeNgModel = null;
          // this.nsebsecodeNgModel = null;
          // this.nsecodeNgModel = null;
          // this.lotsizeNgModel = null;
          // this.isincodeNgModel = null;
          // this.blmrgcodeNgModel = null;
          // this.retuerscodeNgModel = null;
          // this.sedolcodeNgModel = null;
          // this.divdateNgModel = null;
          // this.restrictNgModel = null;
          // this.scdescNgModel = null;
          // this.holdperiodNgModel = null;
          // this.irfNgModel = null;
          // this.bsegroupnameNgModel = null;
          // this.excNgmodel = null;
          // this.tradeNgmodel = null;
          this.activemodel = null;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill the field' });
    }
  }

  scriptmstDelete(product: any) {
    // debugger;
    // console.log("product", product);
    var model: any =
    {
      ID: product.ID,
    }

    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                      
                      
    var apiUrl = '';
    apiUrl = 'scriptmst/Deletescriptdata';

    this.rest.postParams(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {

      if (data.Success) {
        
        var Result = JSON.parse(this.Global.decrypt1(data.Data)); 
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Delete Successully" });
        
        this.getallScriptdata();
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })

  }

  cancel() {
    this.oneditbtn = false;
    this.onadd = true;
    // this.bsecodeNgModel = null;
    // this.nsebsecodeNgModel = null;
    // this.nsecodeNgModel = null;
    // this.lotsizeNgModel = null;
    // this.isincodeNgModel = null;
    // this.blmrgcodeNgModel = null;
    // this.retuerscodeNgModel = null;
    // this.sedolcodeNgModel = null;
    // this.divdateNgModel = null;
    // this.restrictNgModel = null;
    // this.scdescNgModel = null;
    // this.holdperiodNgModel = null;
    // this.irfNgModel = null;
    // this.bsegroupnameNgModel = null;
    // this.excNgmodel = null;
    // this.tradeNgmodel = null;
    // this.activemodel = null;
    this.scriptmstform.reset();
  }
  
}
