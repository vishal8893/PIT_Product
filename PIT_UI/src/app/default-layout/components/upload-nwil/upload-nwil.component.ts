import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-nwil',
  templateUrl: './upload-nwil.component.html',
  styleUrls: ['./upload-nwil.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class UploadNwilComponent implements OnInit {

  // uploadform: FormGroup;
  selectedFileName: string = '';
  formData = new FormData();
  greyresData: any = [];
  dataArray: any = [];
  userLoggedIn: any;
  EmpNo: any;
  loading: boolean = false;
  onerrorlog: boolean = false;
  onblockunblock: boolean = false;
  blockloading: boolean = false;
  unblockloading: boolean = false;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
  }

  ngOnInit() {
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
    debugger;
    this.loading = true;
    if (!this.formData && this.formData === null ) {
      alert('Please choose a file before uploading.');
      this.loading = false;
      return; // Exit the function if formData is null
    } else {
      // console.log("this.formData", this.formData);

      var model: any = {
        UserId: this.EmpNo
      }
      // console.log("uploadmodel", model);


      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      this.rest.postParams_forupload(this.Global.getapiendpoint() + "upload/SaveNWILData", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
          this.formData = null;
          this.selectedFileName = null;
          // this.uploadform.reset();
          this.loading = false;
          this.onblockunblock = true;
          this.onerrorlog = false;
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
          this.loading = false;
          this.onblockunblock = false;
          this.onerrorlog = true;
        }
      });

    }

  }

  downloadSample() {
    const data = [
      ['ScripName', 'ISIN', 'Employee Code']
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
    link.download = 'sample_NWILdata.xlsx';

    // Trigger the download
    link.click();


  }

  GenerateBlockingNWML(){
    this.blockloading = true;
    this.blockloading = false;
  }

  GenerateUnBlockingNWML(){
    this.unblockloading = true;
    this.unblockloading = false;
  }

  geterrorlog(){
  }

}