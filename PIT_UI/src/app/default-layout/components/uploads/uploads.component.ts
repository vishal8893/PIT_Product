import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ExcelService } from "../../../common/excel.service"
@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class UploadsComponent implements OnInit {

  uploadform: FormGroup;
  selectedFileName: string = '';
  formData = new FormData();
  greyresData: any = [];
  dataArray: any = [];
  userLoggedIn: any;
  EmpNo: any;
  loading: boolean = false;
  accessid = [
    { ID: 1, NAME: 'Grey/Restricted List' },
    { ID: 2, NAME: 'Scrip Master' },
    { ID: 3, NAME: 'Holiday Master' },
    { ID: 4, NAME: 'Trade Data Master' },
    { ID: 5, NAME: 'F&O RollOver Expiry Data' },
    { ID: 6, NAME: 'DP Holding Data' },
    { ID: 7, NAME: 'Fund Manager List' },
    { ID: 8, NAME: 'iTrading Primary Issue Rejection List' },
    { ID: 9, NAME: 'EIRF FO 3Months LOTS Daily Data' },
  ];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService, private ExcelService: ExcelService,
    private Global: Global,
  ) {
    this.uploadform = this.formBuilder.group({
      uploadtypecontroller: [null, [Validators.required]]
    })
  }

  get uploadtypecontroller() { return this.uploadform.get('uploadtypecontroller'); }

  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);
    this.EmpNo = this.userLoggedIn.EMPNO;
  }

  fileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2); // Get the file extension

      if (allowedExtensions.includes(`.${fileExtension}`)) {
        // The selected file has a valid Excel file extension
        this.selectedFileName = selectedFile.name;
        this.formData = new FormData();
        this.formData.append('file', selectedFile);
      } else {
        // The selected file has an invalid extension
        this.selectedFileName = '';
        this.formData = null;
        alert('Only Excel files (.xls and .xlsx) are allowed.');
      }
    } else {
      this.selectedFileName = '';
      this.formData = null;
    }
  }

  uploadFile() {
    if (this.uploadtypecontroller.value === 'Grey/Restricted List') {

      // console.log("formData", this.formData);

      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveGreyRestricData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'Scrip Master') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveScripMstData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'Holiday Master') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveHolidayData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'Trade Data Master') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveTradeMstData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.uploadform.reset()
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
            this.ExcelService.exportASExcelFile(data.Data, 'sample_TradeDataMst_dataErrorfile')

          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'F&O RollOver Expiry Data') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveRollOverExpiryData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'DP Holding Data') {
      var models = {
        EMP: this.userLoggedIn.EMPNO
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(models));

      this.rest.postParams(this.Global.getapiendpoint() + "upload/getallAproverdata", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == false) {
          // var Result = JSON.parse(this.Global.decrypt1(data.Data));
          if (!this.formData) {
            alert('Please choose a file before uploading.');
            return; // Exit the function if formData is null
          } else {
            this.loading = true;
            // console.log("this.formData", this.formData);

            var model: any = {
              UserId: this.EmpNo
            }
            // console.log("uploadmodel", model);


            for (var key in model) {
              this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
            }

            this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveDPHoldingData", this.formData).subscribe((data: any) => {

              if (data.Success) {
                // console.log("data", data);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
                this.formData = null;
                this.selectedFileName = null;
                this.uploadform.reset();
                this.loading = false;
              }
              else {

                this.ExcelService.exportASExcelFile(data.Data, 'UploadFileError')
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
                this.loading = false;
                this.formData = null;
                this.selectedFileName = null;
                this.uploadform.reset();
              }
            });

          }

        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'No Data',
            detail: 'Please Reset My Holding Details.'
          });

        }
      })

    } else if (this.uploadtypecontroller.value === 'Fund Manager List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SavefundmanagerlistData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            // console.log("data success", data.Data);
            this.dataArray = data.Data;
            if (this.dataArray.length > 0) {
              this.dataArray.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1
              })
              // console.log("this.dataArray", this.dataArray);

              // Convert your data to Excel format
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataArray);

              // Create a new Excel workbook
              const wb: XLSX.WorkBook = XLSX.utils.book_new();

              // Add the worksheet to the workbook
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              // Save the workbook to a file
              XLSX.writeFile(wb, 'unactive_fundManagerList_data.xlsx');

              this.dataArray = [];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully,plz check unactive userlist in excel.' });
              this.formData = null;
              this.selectedFileName = null;
              this.uploadform.reset();
              this.loading = false;
            } else {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
              this.formData = null;
              this.selectedFileName = null;
              this.uploadform.reset();
              this.loading = false;
            }
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'iTrading Primary Issue Rejection List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveiTradingPrimaryIssueRejectData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else if (this.uploadtypecontroller.value === 'EIRF FO 3Months LOTS Daily Data') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveFOMonthsLOTSDailyData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.selectedFileName = null;
            this.uploadform.reset();
            this.loading = false;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
            this.loading = false;
          }
        });

      }
    } else {
      this.uploadtypecontroller.markAsDirty();

      if (this.uploadtypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Upload Type Required' });
      }
    }
  }

  downloadSample() {
    if (this.uploadtypecontroller.value === 'Grey/Restricted List') {
      const data = [
        ['Type(Grey List/Restricted List', 'Scrip Name', 'ISIN', 'Start Date', 'End Date', 'Employee_No.(if grey list)']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_grey/restricted_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Scrip Master') {
      const data = [
        ['BSE Code*', 'NSE BSE Code', 'NSE Code*', 'Lot Size', 'ISIN Code*', 'Bloomberg Code', 'Reuters Code', 'Sedol Code', 'Dividend Date',
          'Restricted Reset', 'Scrip Desc*', 'Holding Period', 'IRF Format', 'BSE Group Name', 'Exchange', 'Nature of Trade', 'Is Government Security(true/false)']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_ScripMst_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Holiday Master') {
      const data = [
        ['Date*', 'Day*']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_HolidayMst_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Trade Data Master') {

    
      const data = [[
  'RequestID',
  'Exch',
  'AccountCode',
  'AccountName',
  'ScripName',
  'Quantity',
  'TradeAvailableQty',
  'TotalPrice',
  'Mode',
  'ISIN',
  'StrikePrice',
  'ExpiryDate',
  'OptionType',
  'TradedQuantity',
  'TradeDate'
]];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_TradeDataMst_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'F&O RollOver Expiry Data') {
      const data = [
        ['Position Date', 'Segment Indicator', 'Settlement Type', 'Clearing Member Code', 'Member Type', 'Trading Member Code', 'Account Type', 'Client Account Code', 'Instrument Type',
          'Symbol', 'Expiry date', 'Strike Price', 'Option Type', 'CA Level', 'Brought Forward Long Quantity', 'Brought Forward Long Value', 'Brought Forward Short Quantity', 'Brought Forward Short Value',
          'Day Buy Open Quantity', 'Day Buy Open Value', 'Day Sell Open Quantity', 'Day Sell Open Value', 'Pre Ex-As-gmnt Long Quantity', 'Pre Ex-As-gmnt Long Value', 'Pre Ex-As-gmnt Short Quantity', 'Pre Ex-As-gmnt Short Value',
          'Exercised Quantity', 'Assigned Quantity', 'Post Ex-As-gmnt Long Quantity', 'Post Ex-As-gmnt Long Value', 'Post Ex-As-gmnt Short Quantity', 'Post Ex-As-gmnt Short Value', 'Settlement Price', 'Net Premium', 'Daily MTM Settlement Value',
          'Futures Final Settlement Value', 'Exercised Assigned Value', 'IsActive']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_RollOverExpiry_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'DP Holding Data') {
      const data = [
        ['EmpNO', 'AccName', 'AccCode', 'ScriptName', 'ISINCode', 'TrxDate', 'DpQty', 'Segment'],
        ['AsperDb', 'AsperDb', 'AsperDb', '', 'AsperDb', '', '', 'AsperDb']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_DPHolding_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Fund Manager List') {
      const data = [
        ['EmpNo.', 'EmpName']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_FundManagerList_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'iTrading Primary Issue Rejection List') {
      const data = [
        ['EmpNo.', 'IPOID', 'IPO Name']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_iTradingPrimaryIssueRejectList_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'EIRF FO 3Months LOTS Daily Data') {
      const data = [
        ['Symbol', 'ScripName', 'FirstMonthLOTSize', 'FirstMonth', 'SecondMonthLOTSize', 'SecondMonth', 'ThirdMonthLOTSize', 'ThirdMonth']
      ];

      // Create a worksheet and workbook
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SampleData');

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (data[0][col].includes('*')) {
          ws[cell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Set red background for mandatory fields
        }
      }

      // Generate the Excel file as a data URI (Base64)
      const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' as 'base64' });
      const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelBlob;

      // Create a download link
      const link = document.createElement('a');
      link.href = dataUri;
      link.target = '_blank'; // Open the link in a new tab
      link.download = 'sample_FO3MonthsLOTSDaily_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else {
      this.uploadtypecontroller.markAsDirty();

      if (this.uploadtypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Upload Type Required' });
      }
    }
  }

  downloadTradeData() {
    let finalDataArray = []

    let model = {
      EMP: this.EmpNo
    }

    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    this.rest.postParams(this.Global.getapiendpoint() + 'upload/GetTradeapproverrecord', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        Result.forEach((element: any) => {
          finalDataArray.push({
            RequestID: element.ID,
            Exch: element.NatureofTrade,
            AccountCode: element.AccountCode,
            AccountName: element.ACC_NAME,
            ScripName: element.Security,
            Quantity: element.EqQuantity,
            TradeAvailableQty: element.TradeAvailableQty,
            TotalPrice: '',
            Mode: element.Transaction,
            ISIN: element.ISIN,
            StrikePrice: element.StrikePrice,
            ExpiryDate: '',
            OptionType: element.OptionType,
            TradedQuantity: '',
            TradeDate: '',
          })
        })
        this.ExcelService.exportASExcelFile(finalDataArray, 'Approved_TradeDataMst_data')
        this.uploadform.reset()

      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No approved records are available.' });

      }
    });
  }

  latestdataDownload() {
    if (this.uploadtypecontroller.value === 'Grey/Restricted List') {
      const combinedData = [];
      this.rest.getAll(this.Global.getapiendpoint() + 'gretlist/GetAllgreylistMst').subscribe((greylistData: any) => {
        if (greylistData.Success) {
          // combinedData.push(...greylistData.Data); // Push grey list data into the combinedData array
          var Result = JSON.parse(this.Global.decrypt1(greylistData.Data));
          combinedData.push(...Result.map(item => ({ NAME: 'Grey List', ...item })));

          // Call the API to get restricted list data
          this.rest.getAll(this.Global.getapiendpoint() + 'restrict/GetAllrestrictedlistMst').subscribe((restrictedData: any) => {
            if (restrictedData.Success) {
              // combinedData.push(...restrictedData.Data); // Push restricted list data into the combinedData array
              var Result = JSON.parse(this.Global.decrypt1(restrictedData.Data));
              combinedData.push(...Result.map(item => ({ NAME: 'Restricted List', ...item })));
              this.greyresData = combinedData; // Assign the combined data to your grid's data source
              this.greyresData.forEach((i: any, indexof: any) => {
                i.Srno = indexof + 1;
              });
              // console.log("getAllVioreportdata", this.greyresData);

              // Convert your data to Excel format
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

              // Create a new Excel workbook
              const wb: XLSX.WorkBook = XLSX.utils.book_new();

              // Add the worksheet to the workbook
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              // Save the workbook to a file
              XLSX.writeFile(wb, 'latest_grey/restrictedList_data.xlsx');

              this.greyresData = [];
              this.uploadform.reset();
            }
          });
        }
      });
    } else if (this.uploadtypecontroller.value === 'Scrip Master') {
      this.rest.getAll(this.Global.getapiendpoint() + 'scriptmst/GetAllScriptdata').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1;
          });
          // console.log("getAllindivisualsscripdata", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_scripMst_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Holiday Master') {
      this.rest.getAll(this.Global.getapiendpoint() + 'home/getHolidayData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_holidayMst_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Trade Data Master') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getTradeData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_TradeDataMst_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'F&O RollOver Expiry Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getRollOverExpiryData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_RollOverExpiry_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'DP Holding Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getDPHoldingData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_DPHolding_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Fund Manager List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getfundmanagerlistData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_FundManagerList_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'iTrading Primary Issue Rejection List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getitradingRejeclistData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_iTradingPrimaryIssueRejectList_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'EIRF FO 3Months LOTS Daily Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'upload/getEirfFO3MonthsLOTSDailyData').subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.greyresData = Result;
          this.greyresData.forEach((i: any, indexof: any) => {
            i.Srno = indexof + 1
          })
          // console.log("this.holidays", this.greyresData);

          // Convert your data to Excel format
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.greyresData);

          // Create a new Excel workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          // Save the workbook to a file
          XLSX.writeFile(wb, 'latest_FO3MonthsLOTSDaily_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else {
      this.uploadtypecontroller.markAsDirty();

      if (this.uploadtypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Upload Type Required' });
      }
    }
  }

}
