import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-violation-report',
  templateUrl: './violation-report.component.html',
  styleUrls: ['./violation-report.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ViolationReportComponent {
  @ViewChild('autoCompleteRef') autoCompleteRef: AutoComplete;
  SearchSecurityData: any = []
  SearchSecurity: '';
  Todate: any = '';
  Fromdate: any = '';
  selectedScripDesc: any;
  showGrid: boolean = false;
  products: any = [];
  userLoggedIn: any;
  userId: any;
  EmpNo: any;
  empname: any;
  visible: boolean = false;
  showviolationStatusData: boolean = false;
  visiblestatusGrid: boolean = false;
  showvioStatusGrid: boolean = false;
  violationStatusData: any = [];
  vioStatusGridData: any = [];
  excelData: any = [];
  CODE: any;

  Voilationform = this.formBuilder.group({
    VId: [],
    // Voilation: ['', [Validators.required]],
    Voilation: [{ value: '', disabled: true }, Validators.required],
    Remark: ['', [Validators.required]],

  })

  get Voilation() { return this.Voilationform.get('Voilation'); }
  get Remark() { return this.Voilationform.get('Remark'); }
  get VId() { return this.Voilationform.get('VId'); }


  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private Global: Global, private messageService: MessageService,
  ) { }

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
  }

  getallirfdata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                             
      this.rest.postParams(this.Global.getapiendpoint() + "eirf/SCRIPDESC", { encryptmodel: encryptmodel }).subscribe((data: any) => {
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
    // console.log('Selected Value: ', event.SCRIP_DESC);
    this.selectedScripDesc = event.SCRIP_DESC
  }

  getdownload() {
    if (this.Fromdate != '' || this.Todate != '' || this.selectedScripDesc != undefined) {
      if (this.CODE === "Super Admin") {
        let model = {
          scrip: this.selectedScripDesc,
          fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
          toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("report", encryptmodel);


        if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getViolationdata2', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getViolationdata1', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        } else {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getViolationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        }
      } else {
        let model = {
          scrip: this.selectedScripDesc,
          fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
          toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
          userid: this.EmpNo
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("report", encryptmodel);


        if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getusrViolationdata2', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getusrViolationdata1', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        } else {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/getusrViolationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.excelData = Result;
              this.excelData = this.excelData.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.excelData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.excelData);
              // this.showGrid = true;
              this.exportToExcel();
            }
          });
        }
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Please select any filter:Scrip Name,From Date,To Date" });
    }
  }

  exportToExcel() {
    // Convert your data to Excel format
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelData);

    // Create a new Excel workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook to a file
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }

  getreport() {
    if (this.Fromdate != '' || this.Todate != '' || this.selectedScripDesc != undefined) {
      if (this.CODE === "Super Admin") {

        let model = {
          scrip: this.selectedScripDesc,
          fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
          toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("report", encryptmodel);                       

        if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata2', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata1', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        } else {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        }
      } else {
        let model = {
          scrip: this.selectedScripDesc,
          fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
          toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
          userid: this.EmpNo
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                       
        // console.log("report", encryptmodel);        

        if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata2', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata1', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        } else {
          this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.products = Result;
              this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
              this.products.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.products);
              this.showGrid = true;
              // this.selectedScripDesc = '';
              // if (this.autoCompleteRef) {
              //   this.autoCompleteRef.clear();
              // }
              // this.Fromdate = '';
              // this.Todate = '';
              // this.messageService
            }
          });
        }
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Please select any filter:Scrip Name,From Date,To Date" });
    }

  }

  showDialog(data: any) {
    let Id = data.TransId
    this.VId.setValue(Id);
    this.Voilation.setValue(data.NoApprovalVoil);
    this.visible = true;
    this.showviolationStatusData = true;
    this.getViolationStatusData(this.VId.value);
    // console.log("data", data);

  }

  RefreshTaskDates() {
    this.selectedScripDesc = undefined;
    if (this.autoCompleteRef) {
      this.autoCompleteRef.clear();
    }
    this.Fromdate = '';
    this.Todate = '';
    this.showGrid = false;
  }

  ViolationRemarkSave() {
    let model = {
      Violation: this.Voilation?.value,
      Remarks: this.Remark?.value,
      VoilationId: this.VId.value,
      UserId: this.EmpNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                            
    // console.log("ViolationRemarkSave", model);

    this.rest.postParams(this.Global.getapiendpoint() + 'home/Violationremarks', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.getViolationStatusData(this.VId.value);
        this.showviolationStatusData = true;
        this.Voilationform.reset();
        this.showGrid = true;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Remark save successfuly" });

        if (this.CODE === "Super Admin") {

          let model = {
            scrip: this.selectedScripDesc,
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD')
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));
          // console.log("report", encryptmodel);                                                      


          if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata2', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data)); 
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata1', { encryptmodel: encryptmodel } ).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data)); 
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          } else {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/Violationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          }
        } else {
          let model = {
            scrip: this.selectedScripDesc,
            fromDate: this.Fromdate == '' ? '' : moment(this.Fromdate).format('YYYY-MM-DD'),
            toDate: this.Todate == '' ? '' : moment(this.Todate).format('YYYY-MM-DD'),
            userid: this.EmpNo
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
          // console.log("report", encryptmodel);


          if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate != '' && this.Todate == '') {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata2', { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          } else if ((this.selectedScripDesc == '' || this.selectedScripDesc === undefined) && this.Fromdate == '' && this.Todate != '') {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata1', { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          } else {
            this.rest.postParams(this.Global.getapiendpoint() + 'vioreport/usrViolationdata', { encryptmodel: encryptmodel }).subscribe((data: any) => {
              if (data.Success) {
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                this.products = Result;
                this.products = this.products.filter((i: any) => i.NoApprovalVoil !== 'null');
                this.products.forEach((i: any, indexof: any) => {
                  i.Srno = indexof + 1;
                });
                // console.log("getAllVioreportdata", this.products);
                this.showGrid = true;
                // this.selectedScripDesc = '';
                // if (this.autoCompleteRef) {
                //   this.autoCompleteRef.clear();
                // }
                // this.Fromdate = '';
                // this.Todate = '';
                // this.messageService
              }
            });
          }
        }
      }
    });
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }

  getViolationStatusData(SId: any) {
    this.rest.getAll(this.Global.getapiendpoint() + `home/getViolationstatusDataBYID/${SId}`).subscribe((data) => {
      var Result = JSON.parse(this.Global.decrypt1(data.Data));
      this.violationStatusData = Result;
      this.vioStatusGridData = Result;
      this.violationStatusData.forEach((i: any, indexof: any) => {
        i.Srno = indexof + 1;
      });
      // console.log("DisplayViolationStatusData", this.violationStatusData);
      // this.showRequestDataTable = true;
    });
  }

  onEditVioStatus(product: any) {
    // console.log("oneditvioStatus", product);
    // console.log(product.TransId);
    this.visiblestatusGrid = true;
    this.showvioStatusGrid = true;
    this.getViolationStatusData(product.TransId);

  }

  Reset() {
    this.Voilationform.reset()
  }

}
