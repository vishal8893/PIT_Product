import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, SelectControlValueAccessor, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hrms-uploads',
  templateUrl: './hrms-uploads.component.html',
  styleUrls: ['./hrms-uploads.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class HrmsUploadsComponent implements OnInit {

  uploadform: FormGroup;
  selectedFileName: string = '';
  formData = new FormData();
  greyresData: any = [];
  dataArray: any = [];
  userLoggedIn: any;
  EmpNo: any;
  loading: boolean = false;
  accessid = [
    { ID: 1, NAME: 'Relation Infromation List' },
    { ID: 2, NAME: 'Employee Infromation List' },
    { ID: 3, NAME: 'Email List' },
    { ID: 4, NAME: 'Emergency Contact List' },
    { ID: 5, NAME: 'Voice Details List' },
    { ID: 6, NAME: 'Address List' },
    { ID: 7, NAME: 'Workex Data' },
    { ID: 8, NAME: 'Qualification Data' },
    { ID: 9, NAME: 'Nationality Data' },
    { ID: 10, NAME: 'Company Hierarchy Mapping List' },
  ];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
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
    if (this.uploadtypecontroller.value === 'Relation Infromation List') {
      // console.log("formData", this.formData);

      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveRelativeData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Employee Infromation List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveEmpInfoData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Email List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo,
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveEmailData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Emergency Contact List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');      
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveEmgContactData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Voice Details List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveVoiceData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Address List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveAddressData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Workex Data') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveWorkexData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Qualification Data') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveQualificationData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Nationality Data') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveNationalityData", this.formData).subscribe((data: any) => {
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
    } else if (this.uploadtypecontroller.value === 'Company Hierarchy Mapping List') {
      if (!this.formData) {
        alert('Please choose a file before uploading.');
        return; // Exit the function if formData is null
      } else {
        // console.log("this.formData", this.formData);
        this.loading = true;

        var model: any = {
          UserId: this.EmpNo
        }
        // console.log("uploadmodel", model);


        for (var key in model) {
          this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
        }

        this.rest.postParams_forupload(this.Global.getapiendpoint() + "hrms/SaveCompanyHierMappingData", this.formData).subscribe((data: any) => {
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
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'HRMS Upload Type Required' });
      }
    }
  }

  downloadSample() {
    if (this.uploadtypecontroller.value === 'Relation Infromation List') {
      const data = [
        ['Emp Display Number', 'Emp Calling Name', 'PAN.', 'Dependent', 'Relationship', 'Emp.Rel.Birthday', 'Emp.Rel.Telephone']
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
      link.download = 'sample_HRMS_Relative_data.xlsx';

      // Trigger the download
      link.click();      
      this.uploadform.reset();
      // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'FileData download Successfully.' });

    } else if (this.uploadtypecontroller.value === 'Employee Infromation List') {
      const data = [
        ['Emp No.', 'Emp ID', 'PAN.', 'Login ID', 'Emp Title', 'Emp Calling Name', 'Emp Surname', 'Emp Full Name', 'Gender',
          'Zone', 'Infra', 'Category', 'Entity', 'Type Of Employment', 'Blood Group', 'Resign Date', 'Designation Name',
          'External Designation', 'Country', 'State', 'Pin Code', 'Joined Date', 'Birth Date', 'Grp. Name', 'Cluster', 'SBU', 'LOB', 
          'Middle/Father Name', 'Employment Status', 'Slob', 'Location', 'Per. Telephone No.', 'Per. Mobile No.', 'Temp. Telephone No.',
          'Temp. Mobile No.','Office Mobile No.', 'Active Att. Flag(True/False)', 'Active HRMS Flag(True/False)', 'Office Email',
          'Cont. During WRKN', 'Per. Email', 'Per. Address1', 'Per. Address2', 'Per. Address3', 'Temp. Address1', 'Temp. Address2', 'Temp. Address3',
          'Contact', 'Leadership Grp.', 'Exit Reason', 'Level1 Name', 'Level2 Name', 'Arrival Conformation date', 'RA ID', 'Created ON',
          'Marital Status', 'BG Code', 'SBU Code', 'LOB Code', 'SUBLOB Code', 'Entity Code']
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
      link.download = 'sample_HRMS_EmpInformation_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Email List') {
      const data = [
        ['Email Type', 'Email Address', 'Is Primary', 'Employee Code']
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
      link.download = 'sample_HRMS_Email_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Emergency Contact List') {
      const data = [
        ['Name', 'Relationship', 'Primary Emergency', 'Emergency Contact No.', 'Employee Code']
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
      link.download = 'sample_HRMS_EmgContact_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Voice Details List') {
      const data = [
        ['Phone Type', 'Phone No.', 'Area Code', 'Country Code', 'Office Telephone Board', 'Office Extension', 'Office Telephone Direct', 'Employee Code']
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
      link.download = 'sample_HRMS_Voice_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Address List') {
      const data = [
        ['Address Type', 'Street', 'House No.', 'Extra Address Line', 'City', 'State', 'Pincode', 'Country', 'Employee Code']
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
      link.download = 'sample_HRMS_Address_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Workex Data') {
      const data = [
        ['Emp display No.', 'Emp Calling Name', 'Past Company']
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
      link.download = 'sample_HRMS_Workex_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Qualification Data') {
      const data = [
        ['University', 'Other University', 'Score(In Percentage)', 'Highest Education', 'Course', 'Course Type', 'Specialization',
         'Start Date', 'End Date', 'Institute', 'Other Institute', 'Employee Code']
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
      link.download = 'sample_HRMS_Qualification_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Nationality Data') {
      const data = [
        ['Country', 'National ID Card Type', 'National ID Number', 'Employee Code']
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
      link.download = 'sample_HRMS_Nationality_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else if (this.uploadtypecontroller.value === 'Company Hierarchy Mapping List') {
      const data = [
        ['Cluster ID', 'Cluster Name', 'SBU ID', 'SBU Name', 'LOB ID', 'LOB Name', 'SUBLOB ID', 'SUBLOB Name']
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
      link.download = 'sample_HRMS_CompanyHierarchyMapping_data.xlsx';

      // Trigger the download
      link.click();

      this.uploadform.reset();

    } else {
      this.uploadtypecontroller.markAsDirty();

      if (this.uploadtypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'HRMS Upload Type Required' });
      }
    }
  }

  latestdataDownload() {
    if (this.uploadtypecontroller.value === 'Relation Infromation List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getRelativeData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Relative_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Employee Infromation List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getEmpInfoData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_EmpInformation_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Email List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getEmailData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Email_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Emergency Contact List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getEmgContactData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_EmgContact_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Voice Details List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getVoiceData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Voice_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Address List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getAddressData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Address_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Workex Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getWorkexData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Workex_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Qualification Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getQualificationData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Qualification_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Nationality Data') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getNationalityData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_Nationality_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else if (this.uploadtypecontroller.value === 'Company Hierarchy Mapping List') {
      this.rest.getAll(this.Global.getapiendpoint() + 'hrms/getCompanyHierMappingData').subscribe((data: any) => {
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
          XLSX.writeFile(wb, 'latest_HRMS_CompanyHierarchyMapping_data.xlsx');

          this.greyresData = [];
          this.uploadform.reset();
        }
      });
    } else {
      this.uploadtypecontroller.markAsDirty();

      if (this.uploadtypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'HRMS Upload Type Required' });
      }
    }
  }

}
