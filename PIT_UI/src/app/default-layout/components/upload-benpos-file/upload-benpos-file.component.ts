import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-upload-benpos-file',
  templateUrl: './upload-benpos-file.component.html',
  styleUrls: ['./upload-benpos-file.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class UploadBenposFileComponent implements OnInit {

  uploadBenposform: FormGroup;
  selectedFileName: string = '';
  formData = new FormData();
  greyresData: any = [];
  dataArray: any = [];
  userLoggedIn: any;
  EmpNo: any;
  loading: boolean = false;
  uploaddate: any = '';
  maxDate: Date;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
  ) {
    this.uploadBenposform = this.formBuilder.group({
      uploadtypecontroller: [null, [Validators.required]]
    })
  }

  get uploadtypecontroller() { return this.uploadBenposform.get('uploadtypecontroller'); }

  ngOnInit() {
    // this.userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')!);
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    // console.log("loggedindata", this.userLoggedIn);
    // console.log("loggedindata", this.userLoggedIn);
    this.EmpNo = this.userLoggedIn.EMPNO;
    // Set maxDate to today's date (to disable future dates)
    this.maxDate = new Date();
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
    if (this.uploaddate !== '' && this.uploaddate !== null) {
      // console.log("this.uploaddate", this.uploaddate);

      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        this.loading = true;
        // console.log("this.formData", this.formData);

        var model: any = {
          UserId: this.EmpNo,
          fromDate: this.uploaddate == '' ? '' : moment(this.uploaddate).format('YYYY-MM-DD'),
        }        
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        // const formDataJson = JSON.stringify(this.formDataToObject(this.formData));
        // let encryptmodel = this.Global.encryptionAES(JSON.stringify(this.formData));                                             

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "bnpUpload/SaveBenposData", this.formData).subscribe((data: any) => {
          // console.log("data success", data.Data);
          if (data.Success) {
            // console.log("data", data);
            // var Result = JSON.parse(this.Global.decrypt1(data.Data));
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData saved Successfully.' });
            this.formData = null;
            this.uploaddate = '';
            this.selectedFileName = null;
            this.uploadBenposform.reset();
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
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Upload Date Required' });
      }
    }

  }

  formDataToObject(formData: FormData) {
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  }

  downloadSample() {
    const data = [
      ['FOLIO_NO', 'SHARE_HOLDER_NAME', 'SHARES', 'JOINT_HOLDER1', 'JOINT_HOLDER2', 'JOINT_HOLDER3', 'FATHER_HUSBAND_NAME', 'ADDRESS_LINE1', 'ADDRESS_LINE2', 'ADDRESS_LINE3', 'CITY_NAME', 'PINCODE', 'EMAIL_ID', 'PHONE_NO', 'PANCARD_NO', 'SECOND_HOLDER_PAN_NO', 'THIRD_HOLDER_PAN_NO', 'CATEGORY', 'STATUS', 'OCCUPATION', 'BANK_ACNO', 'BANK_NAME',
        'BANK_ADDRESSLINE1', 'BANK_ADDRESSLINE2', 'BANK_ADDRESSLINE3', 'BANK_ADDRESSLINE4', 'BANK_PINCODE', 'BANK_ACTYPE', 'MICR_CODE', 'IFSC', 'NOMINEE_NAME', 'GUARDIAN_NAME', 'INVST_TYPE']
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
    link.download = 'sample_BenposUpload_data.xlsx';

    // Trigger the download
    link.click();

    this.uploadBenposform.reset();

  }

  latestdataDownload() {
    this.rest.getAll(this.Global.getapiendpoint() + 'bnpUpload/getBenposData').subscribe((data: any) => {
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
        XLSX.writeFile(wb, 'latest_BenposUpload_data.xlsx');

        this.greyresData = [];
        this.uploadBenposform.reset();
      }
    });
  }

}
