import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RestService } from 'src/app/services/rest.service';
import { Global } from 'src/app/common/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _Moment from 'moment';
import { Product } from 'src/app/common/product';
import * as XLSX from 'xlsx';
import { AutoComplete } from 'primeng/autocomplete';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-create-upsi-project',
  templateUrl: './create-upsi-project.component.html',
  styleUrls: ['./create-upsi-project.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class CreateUpsiProjectComponent implements OnInit {
  @ViewChild('autoCompleteRef') autoCompleteRef: AutoComplete;
  @ViewChild('autoCompleteRef1') autoCompleteRef1: AutoComplete;

  products: Product[];
  product: Product;
  oneditbtn: boolean = false;
  onadd: boolean = true;
  oncancel: boolean = true;
  roleid: any;
  upsiprojectform: FormGroup;
  activemodel1: boolean = false;
  activemodel2: boolean = false;
  SearchSecurityData: any = [];
  SearchEmpData: any = [];
  SearchSharedBYData: any = [];
  activemodel: boolean | null;
  selectedFileName: string = '';
  selectedFileName1: string = '';
  formData = new FormData();
  showupload: boolean = false;
  showEndProjectButton: boolean = false;
  showBlockBtn: boolean = false;
  showAuditBlockBlockBtn: boolean = false;
  loading: boolean = false;
  loading1: boolean = false;
  loading2: boolean = false;
  showBtnGroup: boolean = false;

  upsientityform: FormGroup;
  Scriptform: FormGroup;
  entityNgmodel: any;
  entityid: any;
  isEntityDisabled: boolean = false;
  sbuid: any;
  sbuNgmodel: any;
  isSbuDisabled: boolean = false;
  finallobitem: any;
  lobNgmodel: any;
  isLobDisabled: boolean = false;
  finalsublobitems: any;
  sublobNgmodel: any;
  isSublobDisabled: boolean = false;
  selectedUserCatSVP: boolean = false;
  selectedUserCatCEO: boolean = false;
  selectedUserCatEmpAll: boolean = false;
  isAllEmployeesDisabled: boolean = false;
  isSVPDisabled: boolean = false;
  isAllCEODisabled: boolean = false;
  showEntityPart: boolean = false;
  selectedValue: any;
  oncancel1: boolean = false;
  applid: any;
  accessid: any;
  employeeDatas: Product[];
  auditDatas: Product[];
  Scripts: Product[];
  Script: Product;
  empSelected: boolean = false;
  acctypeModel: any; // Initialize acctype with an empty object or appropriate initial value
  empform: FormGroup;
  empnameModel: any;
  selectedEmployee: any;
  selectShareby: any;
  panNgModel: any;
  // auditform: FormGroup;
  natureid = [
    { ID: 1, NAME: 'Financial information, Financial Statements' },
    { ID: 2, NAME: 'Projected numbers of performance/operations of the entity' },
    { ID: 3, NAME: 'Proposed terms of the transactions' },
    { ID: 4, NAME: 'Details of general character of the business lines and related strategic relationships/ arrangements' },
    { ID: 5, NAME: 'Technical information about the business undertakings (such as deals bagged/ awarded, partners, proposed deals)' },
    { ID: 6, NAME: 'New or proposed innovations, arrangements with strategic partners or launch of new products' },
    { ID: 7, NAME: 'Litigation/ regulatory proceedings having a material impact on business/ license held' },
    { ID: 8, NAME: 'Others' },
    // Add more options as needed
  ];
  nameNgModel: any;
  pan1NgModel: any;
  companyNgModel: any;
  pan2NgModel: any;
  dateNgModel: any;
  relNgModel: any;
  natureNgModel: any;
  docNgModel: any;
  accountNgModel: any;
  emailNgModel: any;
  protypeid: any;
  ISINNgModel: any;
  ScriptdataArray: any[] = [];
  showGrid: boolean = false;
  showGridPage: boolean = true;
  showMainPage: boolean = false;
  showaddProjectbutton: boolean = true;
  selectedSendMailYes: boolean = false;
  selectedSendMailNo: boolean = false;
  selectedSendMail: string = ''; // Initialize as needed
  previousSelection: string = ''; // Track previous selection
  spousenamedisable: boolean = true;
  todaynew: Date;
  minDatenew: Date;


  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private rest: RestService,
    private Global: Global,
    // private datePipe: DatePipe
  ) {
    this.upsiprojectform = this.formBuilder.group({
      projectNamecontroller: [null, [Validators.required]],
      // startdatecontroller: [null, [Validators.required]],
      startdatecontroller: [new Date(), [Validators.required]],
      // enddatecontroller: [null, [Validators.required]],
      enddatecontroller: [null],
      protypecontroller: [null, [Validators.required]],
      applcontroller: [null, [Validators.required]],
    }),
      this.Scriptform = this.formBuilder.group({
        scriptNamecontroller: ['', [Validators.required]],
        // isincomtroller: ['', [Validators.required]],
        isincomtroller: [{ value: '', disabled: true }, Validators.required]
      })
    // this.upsientityform = this.formBuilder.group({
    //   entitycontroller: ['', [Validators.required], this.isEntityDisabled],
    //   sbucontroller: ['', [Validators.required], this.isSbuDisabled],
    //   lobcontroller: ['', [Validators.required], this.isLobDisabled],
    //   sublobcontroller: ['', [Validators.required], this.isSublobDisabled],
    //   selectedUserCatSVP: [this.selectedUserCatSVP],
    //   selectedUserCatCEO: [this.selectedUserCatCEO],
    //   selectedUserCatEmpAll: [this.selectedUserCatEmpAll],
    //   selectedSendMailNo: [this.selectedSendMailNo],
    //   selectedSendMailYes: [this.selectedSendMailYes],

    // }),

  }

  ngOnInit() {
    this.oneditbtn = false;
    this.selectedUserCatEmpAll = true;
    this.todaynew = new Date();
    this.minDatenew = new Date();
    this.minDatenew.setHours(0, 0, 0, 0); // Set time to midnight
    this.getallUPSIProjectList();
    this.getallappl();
    this.getAllProjectType();
    this.getallAccessType();
    this.getallentity();
    this.getallsbu();
    // const today = new Date();
    // const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');

    // this.upsiprojectform.get('enddatecontroller').setValue(formattedToday);

  }

  // getFormattedToday(): string {
  //   return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  // }

  getallUPSIProjectList() {
    this.rest.getAll(this.Global.getapiendpoint() + 'createupsi/GetAllProjectDetails').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.products = Result;
        // console.log("getallUPSIProjectList", this.products)
      }
    });
  }

  getallirfdata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                           
      this.rest.postParams(this.Global.getapiendpoint() + "eirf/SCRIPDESC",  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
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
    let setvalue = event.SCRIP_DESC
    this.SearchSecurityData.forEach(element => {
      if (setvalue == element.SCRIP_DESC) {
        //  this.ISINNgModel = element.ISIN_CODE;
        this.Scriptform.get('isincomtroller').setValue(element.ISIN_CODE);
      } else {
        // this.ISINNumber?.setValue('')
        // this.LotSize = ''
      }
    });
  }

  getallappl() {
    this.rest.getAll(this.Global.getapiendpoint() + 'upsimst/GetAllapplgroupMst').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.applid = Result;
        // console.log("getAllAppl", this.applid)
      }
    });
  }

  getAllProjectType() {
    this.rest.getAll(this.Global.getapiendpoint() + 'createupsi/GetAllProjectType').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.protypeid = Result;
        // console.log("getAllProjectType", this.protypeid)
      }
    });
  }

  getallAccessType() {
    this.rest.getAll(this.Global.getapiendpoint() + 'createupsi/GetAllAccessType').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.accessid = Result;
        // console.log("getallAccessType", this.accessid)
      }
    });
  }


  // fileSelected(event: any) {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const allowedExtensions = ['.xls', '.xlsx'];
  //     const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2); // Get the file extension

  //     if (allowedExtensions.includes(`.${fileExtension}`)) {
  //       // The selected file has a valid Excel file extension
  //       this.selectedFileName = selectedFile.name;
  //       this.formData = new FormData();
  //       this.formData.append('file', selectedFile);
  //     } else {
  //       // The selected file has an invalid extension
  //       this.selectedFileName = '';
  //       this.formData = null;
  //       alert('Only Excel files (.xls and .xlsx) are allowed.');
  //     }
  //   } else {
  //     this.selectedFileName = '';
  //     this.formData = null;
  //   }
  // }

  fileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = selectedFile.name
        .slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase(); // Ensure lowercase comparison

      if (allowedExtensions.includes(`.${fileExtension}`)) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
          const columnNames = [];
          for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = { c: C, r: headerRange.s.r };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = worksheet[cellRef];
            columnNames.push(cell.v);
          }

          if (
            columnNames.length >= 2 &&
            columnNames[0] === 'Employee Name' &&
            columnNames[1] === 'Employee ID'
          ) {
            this.selectedFileName = selectedFile.name;
            this.formData = new FormData();
            this.formData.append('file', selectedFile);
          } else {
            this.selectedFileName = '';
            this.formData = null;
            alert('Uploaded file does not meet the required format (column names mismatch).');
          }
        };

        reader.readAsArrayBuffer(selectedFile);
      } else {
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
    // debugger;
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');

    // if (this.formData) {

    //   console.log("this.formData", this.formData);

    //   var model: any = {
    //     // PROJECT_NAME: projectNamecontroller.value,
    //     PROJECT_NAME: this.roleid,
    //   }
    //   console.log("uploadmodel", model);


    //   for (var key in model) {
    //     this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
    //   }

    //   this.rest.postParams_forupload(this.Global.getapiendpoint() + "createupsi/SaveUploadFile", this.formData).subscribe((data: any) => {
    //     console.log("data success", data.Data);
    //     if (data.Success) {
    //       console.log("data", data);
    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
    //       this.formData = null;
    //       const uploadPathObject = data.Data;
    //       if (typeof uploadPathObject === 'string') {
    //         const fullPath = uploadPathObject;
    //         // const separatorIndex = fullPath.search(/[\/\\]/g);
    //         // const fileName = separatorIndex >= 0 ? fullPath.substring(separatorIndex + 1) : fullPath;
    //         const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
    //         const fileName = fullPath.substring(separatorIndex + 1);

    //         // const fileName = fullPath.substring(fullPath.lastIndexOf('\\') + 1);
    //         this.selectedFileName = fileName;
    //       }
    //       this.showBtnGroup = true;
    //       this.showBlockBtn = true;
    //       // this.showupload = false;
    //       // this.onadd = true;
    //       // this.oncancel = true;
    //       // this.cancel();
    //       // this.getallUPSIProjectList();
    //     }
    //     else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
    //     }
    //     this.getallUPSIProjectList();
    //   });
    // } else {
    //   alert('Please choose a file before uploading.');
    // }
    if (!this.formData) {
      alert('Please choose a file before uploading.');
      return; // Exit the function if formData is null
    } else {
      // console.log("this.formData", this.formData);

      var model: any = {
        // PROJECT_NAME: projectNamecontroller.value,
        PROJECT_NAME: this.roleid,
      }
      // console.log("uploadmodel", model);


      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }      

      this.rest.postParams_forupload(this.Global.getapiendpoint() + "createupsi/SaveUploadFile", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.formData = null;
          alert('Employee updated Successful.');
          const uploadPathObject = data.Data;
          if (typeof uploadPathObject === 'string') {
            const fullPath = uploadPathObject;
            // const separatorIndex = fullPath.search(/[\/\\]/g);
            // const fileName = separatorIndex >= 0 ? fullPath.substring(separatorIndex + 1) : fullPath;
            const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
            const fileName = fullPath.substring(separatorIndex + 1);

            // const fileName = fullPath.substring(fullPath.lastIndexOf('\\') + 1);
            this.selectedFileName = fileName;
          }
          this.showBtnGroup = true;
          this.showBlockBtn = true;
          // this.showupload = false;
          // this.onadd = true;
          // this.oncancel = true;
          // this.cancel();
          // this.getallUPSIProjectList();          
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
        }
        this.getallUPSIProjectList();
      });

    }
  }



  downloadFile(selectedFileName: string) {
    const model = {
      filename: selectedFileName
    };

    this.rest.postParams1(this.Global.getapiendpoint() + 'createupsi/DownloadFile', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );
  }

  downloadSample() {

    const data = [
      ['Employee Name', 'Employee ID'],
      ['John Doe', '12345'],
      ['Jane Smith', '67890'],
      // Add more sample data as needed
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
    link.download = 'sample_data.xlsx';

    // Trigger the download
    link.click();
  }

  duplicateroleid: any;
  coderoleCheckduplicateID(data: any) {
    this.products.forEach((element: any) => {
      if (data == element.PROJECT_NAME) {
        this.duplicateroleid = element.ID
      }
      else {
        (this.duplicateroleid !== '' ? this.duplicateroleid : '0')
        // this.duplicateroleid = '0'
      }
    })

  }

  handleCheckboxChange() {
    if (this.activemodel === null) {
      this.activemodel = false;
    } else {
      this.activemodel = true;
    }
  }

  createUPSIProject() {
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');
    // const companyNamecontroller = this.upsiprojectform.get('companyNamecontroller');
    // const isincomtroller = this.upsiprojectform.get('isincomtroller');
    const startdatecontroller = this.upsiprojectform.get('startdatecontroller');
    const enddatecontroller = this.upsiprojectform.get('enddatecontroller');
    const applcontroller = this.upsiprojectform.get('applcontroller');
    const protypecontroller = this.upsiprojectform.get('protypecontroller');

    if (this.upsiprojectform.valid) {
      this.oneditbtn = false;

      var mod: any = {
        PROJECT_NAME: projectNamecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
      // console.log("mod", mod)

      var model: any = {
        PROJECT_NAME: projectNamecontroller.value,
        // SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        // ISIN: isincomtroller.value,
        STARTDATE: startdatecontroller.value,
        ENDDATE: enddatecontroller.value,
        Type: protypecontroller.value.join(','),
        // IS_EQUITY: this.activemodel1,
        // IS_DEPT: this.activemodel2,        
        team: applcontroller.value.join(','),
        Script: this.ScriptdataArray
      }
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(model)); 
      // console.log("model", model);
                            
      this.rest.postParams(this.Global.getapiendpoint() + 'createupsi/CheckDuplicate', { encryptmodel: encryptmodel } 
      ).subscribe((data: any) => {
        if (data.Data) {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Details already exists.' });
          alert('Details already exists.');
        } else {
          var apiUrl = '';
          apiUrl = 'createupsi/CreateUPSIProjectMst';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel1 } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.showupload = true;
              this.showEntityPart = true;
              this.onadd = false;
              this.oncancel = false;
              this.roleid = Result.ID;
              // console.log("this.roleid", this.roleid);
              this.getAllScriptDetails(this.roleid);
              this.ScriptdataArray = [];
              alert('Project Saved Successful.');
              // this.getallUPSIProjectList();
              // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              // this.cancel();
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
            }
            // this.getallUPSIProjectList();
          });
        }
      });
    }
    else {
      // companyNamecontroller.markAsDirty();
      // isincomtroller.markAsDirty();
      startdatecontroller.markAsDirty();
      enddatecontroller.markAsDirty();
      projectNamecontroller.markAsDirty();
      applcontroller.markAsDirty();
      protypecontroller.markAsDirty();

      if (projectNamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Project Name is required' });
      }
      // if (companyNamecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Scrip Name is required' });
      // }
      // if (isincomtroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
      // }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'StartDate is required' });
      }
      if (enddatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EndDate is required' });
      }
      if (applcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Team is required' });
      }
      if (protypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Project Type is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });

    }
  }

  onEditUPSIProject(product: any) {
    // debugger;
    // console.log("onedit", product);
    this.showaddProjectbutton = false;
    this.showMainPage = true;
    this.showGridPage = false;
    this.oneditbtn = true;
    this.onadd = false;
    // this.oncancel = true;
    // this.showupload = true;
    // this.showEntityPart = true;
    // this.showBtnGroup = true;
    // this.empSelected = true;
    // this.oncancel1 = true;
    // alert('Project Updated Successful.');
    this.showupload = true;
    // this.showEntityPart = true;
    this.showBtnGroup = true;
    this.empSelected = true;
    this.oncancel1 = true;
    


    this.showEndProjectButton = true;
    // this.showBlockBtn = true;
    this.roleid = product.ID;
    this.getAllScriptDetails(product.ID);
    this.upsiprojectform.get('projectNamecontroller').setValue(product.PROJECT_NAME);
    // this.upsiprojectform.get('companyNamecontroller').setValue({ SCRIP_DESC: product.SCRIPT_NAME });
    // this.upsiprojectform.get('isincomtroller').setValue(product.ISIN);
    this.upsiprojectform.get('startdatecontroller').setValue(new Date(product.STARTDATE));
    if (product.ENDDATE === null) {
      this.upsiprojectform.get('enddatecontroller').setValue(null);
    } else {
      this.upsiprojectform.get('enddatecontroller').setValue(new Date(product.ENDDATE));
    }
    // this.activemodel1 = product.IS_EQUITY;
    // this.activemodel2 = product.IS_DEPT;
    const selectedTeamIds: string[] = product.TEAMS.split(',');
    this.upsiprojectform.get('applcontroller').setValue(selectedTeamIds);
    const selectedProTypeIds: string[] = product.PTYPES.split(',');
    this.upsiprojectform.get('protypecontroller').setValue(selectedProTypeIds);
    // this.selectedFileName = product.UPLOD_PATH;
    const uploadPathObject = product.UPLOAD_PATH;
    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // const fileName = fullPath.substring(fullPath.lastIndexOf('\\') + 1);
      // const separatorIndex = fullPath.search(/[\/\\]/g);
      // const fileName = separatorIndex >= 0 ? fullPath.substring(separatorIndex + 1) : fullPath;
      const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
      const fileName = fullPath.substring(separatorIndex + 1);

      this.selectedFileName = fileName;
    } else {
      this.selectedFileName = ''; // Handle the case where UPLOAD_PATH is not a valid string
    }
    if (this.entityNgmodel = product.ENTITY_ID) {
      this.onEntityChange();
      this.showBlockBtn = false;
      this.showBtnGroup = false;
    }
    if (this.sbuNgmodel = product.SBU_ID) {
      this.lobNgmodel = product.LOB_ID;
      this.sublobNgmodel = product.SUBLOB_ID;
      this.onSbuChange();
      this.showBlockBtn = false;
      this.showBtnGroup = false;
    }
    this.onchangeeventsub(product.SBU_ID);
    this.onchangeeventlob(product.LOB_ID);
    if (product.TYPE === "1") {
      this.selectedUserCatSVP = true;
      this.selectedUserCatCEO = false;
      this.selectedUserCatEmpAll = false;
    } else if (product.TYPE === "2") {
      this.selectedUserCatCEO = true;
      this.selectedUserCatEmpAll = false;
      this.selectedUserCatSVP = false;
    } else {
      this.selectedUserCatEmpAll = true;
      this.selectedUserCatSVP = false;
      this.selectedUserCatCEO = false;
    }
    
    this.getAllEmployeeDetails(this.roleid);
    this.getAllAuditDetails(this.roleid);
  }

  updateUPSIProject() {
    // debugger;
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');
    // const companyNamecontroller = this.upsiprojectform.get('companyNamecontroller');
    // const isincomtroller = this.upsiprojectform.get('isincomtroller');
    const startdatecontroller = this.upsiprojectform.get('startdatecontroller');
    const enddatecontroller = this.upsiprojectform.get('enddatecontroller');
    const applcontroller = this.upsiprojectform.get('applcontroller');
    const protypecontroller = this.upsiprojectform.get('protypecontroller');

    if (this.upsiprojectform.valid) {

      this.oneditbtn = false;

      var mod: any = {
        PROJECT_NAME: projectNamecontroller.value,
        ID: 0,
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod));                        
      // console.log("mod", mod)

      var model: any = {
        PROJECT_NAME: projectNamecontroller.value,
        // SCRIPT_NAME: companyNamecontroller.value.SCRIP_DESC,
        // ISIN: isincomtroller.value || null,
        STARTDATE: startdatecontroller.value,
        ENDDATE: enddatecontroller.value,
        // IS_EQUITY: this.activemodel1,
        // IS_DEPT: this.activemodel2,
        Type: protypecontroller.value.join(','),
        team: applcontroller.value.join(','),
        ID: this.roleid,
        // Script: this.ScriptdataArray
      }
      let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(model)); 
      // console.log("model", model);

      var apiUrl = '';
      apiUrl = 'createupsi/UpdateUPSIProjectMst';
      this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel1 } ).subscribe((data: any) => {
        if (data.Success) {
          // console.log("data", data);
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          // this.cancel();
          // this.onadd = true;
          // this.showupload = false;
          // this.getallUPSIProjectList();
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Updated Successfully.' });          
          this.oncancel = false;
          this.oncancel1 = true;
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.showupload = true;
          this.showEntityPart = true;
          this.showBtnGroup = true;
          this.empSelected = true;
          alert('Project Updated Successful.');
          this.getAllEmployeeDetails(this.roleid);
          this.getAllAuditDetails(this.roleid);
          // this.showBlockBtn = true;
          // this.roleid = data.Data[1][0].ID;
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        }
        this.getallUPSIProjectList();
      });
    }
    else {
      // companyNamecontroller.markAsDirty();
      // isincomtroller.markAsDirty();
      startdatecontroller.markAsDirty();
      enddatecontroller.markAsDirty();
      projectNamecontroller.markAsDirty();
      applcontroller.markAsDirty();
      protypecontroller.markAsDirty();

      if (projectNamecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Project Name is required' });
      }
      // if (companyNamecontroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Company is required' });
      // }
      // if (isincomtroller.invalid) {
      //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
      // }
      if (startdatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'StartDate is required' });
      }
      if (enddatecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'EndDate is required' });
      }
      if (applcontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Team is required' });
      }
      if (protypecontroller.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Project Type is required' });
      }
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });

    }
  }

  addblockUnblock() {
    // debugger;
    this.loading = true;
    this.oncancel1 = false;
    this.showEndProjectButton = false;
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');
    var model: any =
    {
      ID: this.roleid,
      EntityID: this.entityNgmodel,
      SbuID: this.sbuNgmodel,
      LobID: this.lobNgmodel,
      SubLobID: this.sublobNgmodel,
      type: this.selectedValue || 3
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             
    // console.log("addblockUnblock", model);

    var apiUrl = '';
    apiUrl = 'createupsi/generateblocking';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.loading = false;
        this.oncancel = false;
        this.oncancel1 = true;
        this.showEndProjectButton = true;
        // this.showaddProjectbutton = true;
        // this.showMainPage = false;
        // this.showGridPage = true; 
        alert('employee block Successful.');
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        // this.cancel();
        this.getallUPSIProjectList();
      }
      else {
        this.loading = false;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }

  deleteUPSIProject() {
    this.loading1 = true;
    this.oncancel1 = false;

    var model: any =
    {
      ID: this.roleid,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));  
    // console.log("model", model);

    var apiUrl = '';
    apiUrl = 'createupsi/DeleteUPSIProjectMstById';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.loading1 = false;
        this.oncancel = true;
        this.oncancel1 = false;
        this.showaddProjectbutton = true;
        this.showMainPage = false;
        this.showGridPage = true;
        alert('Project ended and employee unblock Successful.');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        this.cancel();
        this.getallUPSIProjectList();
      }
      else {
        this.loading1 = false;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })

  }

  downloadFile1(product: any) {
    // console.log("product", product);

    let filename;

    const uploadPathObject = product.UPLOAD_PATH;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // const separatorIndex = fullPath.search(/[\/\\]/g);
      // const InActiveFilename = separatorIndex >= 0 ? fullPath.substring(separatorIndex + 1) : fullPath;
      const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
      const InActiveFilename = fullPath.substring(separatorIndex + 1);

      // const InActiveFilename = fullPath.substring(fullPath.lastIndexOf('\\') + 1);
      filename = InActiveFilename;
    } else {
    }

    const model = {
      filename: filename
    };

    this.rest.postParams1(this.Global.getapiendpoint() + 'createupsi/DownloadFile', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );
  }

  downloadFile5(auditDP: any) {
    // console.log("product", auditDP);

    let filename;

    const uploadPathObject = auditDP.UPLOADFILE;

    if (typeof uploadPathObject === 'string') {
      const fullPath = uploadPathObject;
      // const separatorIndex = fullPath.search(/[\/\\]/g);
      // const InActiveFilename = separatorIndex >= 0 ? fullPath.substring(separatorIndex + 1) : fullPath;
      const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
      const InActiveFilename = fullPath.substring(separatorIndex + 1);

      // const InActiveFilename = fullPath.substring(fullPath.lastIndexOf('\\') + 1);
      filename = InActiveFilename;
    } else {
    }

    const model = {
      filename: filename
    };

    this.rest.postParams1(this.Global.getapiendpoint() + 'createupsi/DownloadFile1', model, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // Optionally, you can provide feedback to the user that pasting is not allowed.
    console.log('Pasting is not allowed in this field');
  }

  cancel() {
    // alert('Data Saved Successfully.')
    this.oneditbtn = false;
    this.empSelected = false;
    this.onadd = true;
    this.oncancel = true;
    this.oncancel1 = false;
    this.upsiprojectform.reset();
    this.upsiprojectform.reset({ startdatecontroller: new Date() });
    this.selectedFileName = null;
    this.formData = null;
    this.showupload = false;
    this.showEntityPart = false;
    this.showEndProjectButton = false;
    this.showBlockBtn = false;
    this.roleid = null;
    this.loading = false;
    this.loading1 = false;
    this.showBtnGroup = false;
    // this.upsientityform.reset();
    this.showaddProjectbutton = true;
    this.showMainPage = false;
    this.showGridPage = true;
    this.isEntityDisabled = false;
    this.isSbuDisabled = false;
    this.isLobDisabled = false;
    this.isSublobDisabled = false;
    this.selectedUserCatEmpAll = true;
    this.selectedUserCatCEO = false;
    this.selectedUserCatSVP = false;
    this.isAllCEODisabled = false;
    this.isSVPDisabled = false;
    this.isAllEmployeesDisabled = false;
    this.entityNgmodel = null;
    this.sbuNgmodel = null;
    this.lobNgmodel = null;
    this.sublobNgmodel = null;
  }

  cancel1() {
    alert('Data Saved Successful.')
    this.oneditbtn = false;
    this.empSelected = false;
    this.onadd = true;
    this.oncancel = true;
    this.oncancel1 = false;
    this.upsiprojectform.reset();
    this.upsiprojectform.reset({ startdatecontroller: new Date() });
    this.selectedFileName = null;
    this.formData = null;
    this.showupload = false;
    this.showEntityPart = false;
    this.showEndProjectButton = false;
    this.showBlockBtn = false;
    this.roleid = null;
    this.loading = false;
    this.loading1 = false;
    this.showBtnGroup = false;
    // this.upsientityform.reset();
    this.showaddProjectbutton = true;
    this.showMainPage = false;
    this.showGridPage = true;
    this.isEntityDisabled = false;
    this.isSbuDisabled = false;
    this.isLobDisabled = false;
    this.isSublobDisabled = false;
    this.selectedUserCatEmpAll = true;
    this.selectedUserCatCEO = false;
    this.selectedUserCatSVP = false;
    this.isAllCEODisabled = false;
    this.isSVPDisabled = false;
    this.isAllEmployeesDisabled = false;
    this.entityNgmodel = null;
    this.sbuNgmodel = null;
    this.lobNgmodel = null;
    this.sublobNgmodel = null;
  }

  onEntityChange() {
    // debugger;
    if (this.entityNgmodel) {
      // this.upsientityform.get('sbucontroller')?.setValue(null);
      // this.upsientityform.get('lobcontroller')?.setValue(null);
      // this.upsientityform.get('sublobcontroller')?.setValue(null);
      // this.upsientityform.get('sbucontroller')?.disable();
      // this.upsientityform.get('lobcontroller')?.disable();
      // this.upsientityform.get('sublobcontroller')?.disable();
      // this.upsientityform.get('entitycontroller')?.enable();
      this.sbuNgmodel = null;
      this.lobNgmodel = null;
      this.sublobNgmodel = null;
      this.isEntityDisabled = false;
      this.isSbuDisabled = true;
      this.isLobDisabled = true;
      this.isSublobDisabled = true;
      this.showBtnGroup = true;
      this.showBlockBtn = true;
    }
    else {
      // this.upsientityform.get('entitycontroller')?.setValue(null);
      // this.upsientityform.get('sbucontroller')?.enable();
      // this.upsientityform.get('lobcontroller')?.enable();
      // this.upsientityform.get('sublobcontroller')?.enable();
      this.entityNgmodel = null;
      this.isSbuDisabled = false;
      this.isLobDisabled = false;
      this.isSublobDisabled = false;
      this.showBlockBtn = false;
    }
  }

  onSbuChange() {
    if (this.sbuNgmodel) {
      // this.upsientityform.get('entitycontroller')?.setValue(null);
      // this.upsientityform.get('entitycontroller')?.disable();
      // this.upsientityform.get('sbucontroller')?.enable();
      // this.upsientityform.get('lobcontroller')?.enable();
      // this.upsientityform.get('sublobcontroller')?.enable();
      this.entityNgmodel = null;
      this.isEntityDisabled = true;
      this.isSbuDisabled = false;
      this.isLobDisabled = false;
      this.isSublobDisabled = false;
      this.showBtnGroup = true;
      this.showBlockBtn = true;
      // Other actions or disabling of related fields if needed
    } else {

      // this.upsientityform.get('sbucontroller')?.setValue(null);
      // this.upsientityform.get('lobcontroller')?.setValue(null);
      // this.upsientityform.get('sublobcontroller')?.setValue(null);
      // this.upsientityform.get('entitycontroller')?.enable();
      this.sbuNgmodel = null;
      this.lobNgmodel = null;
      this.sublobNgmodel = null;
      this.isEntityDisabled = false;
      this.showBlockBtn = false;
      // Other actions if needed when no SBU is selected
    }
  }

  getallentity() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllentitylist').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.entityid = Result;
        // console.log("getAllEntity", this.entityid)
      }
    });
  }

  getallsbu() {
    this.rest.getAll(this.Global.getapiendpoint() + 'usrcategory/GetAllSBU').subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.sbuid = Result;
        // console.log("getAllsbu", this.sbuid)
      }
    });
  }

  onchangeeventsub(sbuid: any) {
    // console.log("sbumode",this.sbuNgmodel);

    var model: any = {
      SBU_ID: sbuid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                              
    // console.log("model sbu", model);

    this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/GetAllLob', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finallobitem = Result
        // console.log('finallobitem', this.finallobitem)
      }
    })
  }

  onchangeeventlob(lobid: any) {
    // console.log("lobmode",this.lobNgmodel);

    var model: any = {
      LOB_ID: lobid
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                              
    // console.log("model lob", model);

    this.rest.postParams(this.Global.getapiendpoint() + 'usrcategory/GetAllSubLob', { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.finalsublobitems = Result
        // console.log('finalsublobitems', this.finalsublobitems)
      }
    })
  }

  handleSelectionChangeSVP() {
    if (this.selectedUserCatSVP) {
      this.selectedUserCatCEO = false;
      this.selectedUserCatEmpAll = false;
      this.selectedValue = 1;
    }
  }

  handleSelectionChangeCEO() {
    if (this.selectedUserCatCEO) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatEmpAll = false;
      this.selectedValue = 2;
    }
  }

  handleSelectionChangeEmpALL() {
    if (this.selectedUserCatEmpAll) {
      this.selectedUserCatSVP = false;
      this.selectedUserCatCEO = false;
      this.selectedValue = 3;
    }
  }

  getallempdata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        FIRSTNAME: event.query,
        id: this.roleid
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                              

      this.rest.postParams(this.Global.getapiendpoint() + "createupsi/SCRIPDESC", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.SearchEmpData = Result;
          // console.log("SearchEmpData", this.SearchEmpData);
        }
      })
    } else {
      this.SearchEmpData = []
    }


  }

  setemp(event: any) {
    // console.log('Selected Value: ', event.FIRSTNAME);
    this.selectedEmployee = event.FIRSTNAME; // 'event' contains the selected employee data
    // console.log(this.selectedEmployee); // You can view the selected employee data here    
  }

  pan: any;
  getallsharedbydata(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        FIRSTNAME: event.query,
        // id: this.roleid
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                             
      this.rest.postParams(this.Global.getapiendpoint() + "createupsi/FIRSTNAME", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          this.SearchSharedBYData = Result;
          // console.log("SearchEmpData", this.SearchSharedBYData);
        }
      })
    } else {
      this.SearchSharedBYData = []
    }


  }

  setpan(event: any) {
    // console.log('Selected Value: ', event.FIRSTNAME);

    // Check the structure of SearchSharedBYData
    this.selectShareby = event.FIRSTNAME;
    // console.log('SearchSharedBYData:', this.SearchSharedBYData);

    // console.log('SearchSharedBYData:', this.panNgModel);

    // Find the selected shared by in the SearchSharedBYData array
    const selectedSharedBy = this.SearchSharedBYData.find(
      (element) => element.FIRSTNAME === event.FIRSTNAME
    );

    // console.log('Selected Shared By:', selectedSharedBy);

    if (selectedSharedBy) {
      this.panNgModel = selectedSharedBy.PANCARDNO; // Set the PAN value
    } else {
      this.panNgModel = ''; // Reset if no match found
    }
  }


  // areAllFieldsFilled(): boolean {
  //   return (
  //     this.nameNgModel &&
  //     this.pan1NgModel &&
  //     this.companyNgModel &&
  //     this.pan2NgModel &&
  //     this.selectShareby && 
  //     this.panNgModel &&
  //     this.dateNgModel &&
  //     this.relNgModel &&
  //     this.natureNgModel.ID &&
  //     this.docNgModel &&
  //     this.accountNgModel &&
  //     this.emailNgModel
  //   );
  // }

  areAllFieldsFilled(): boolean {
    return (
      !!this.nameNgModel &&
      !!this.pan1NgModel &&
      !!this.companyNgModel &&
      !!this.pan2NgModel &&
      !!this.selectShareby &&
      !!this.panNgModel &&
      !!this.dateNgModel &&
      !!this.relNgModel &&
      !!this.natureNgModel.ID &&
      !!this.docNgModel &&
      !!this.accountNgModel &&
      // !!this.emailNgModel
      !!this.entityNgmodel
    );
  }

  getAllAuditDetails(ProjectId: any) {
    this.rest.getAll(this.Global.getapiendpoint() + `createupsi/GetAllaudit/${ProjectId}`).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.auditDatas = Result;
        // console.log("getAllEmployeeDetails", this.auditDatas)
      }
    });
  }
  // panPattern.test(this.panNgModel) && && panPattern.test(this.pan2NgModel)
  // addaduditdata() {
  //   const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  //   if (this.selectShareby && this.panNgModel && this.nameNgModel && this.pan1NgModel && this.companyNgModel
  //     && this.pan2NgModel
  //     && this.dateNgModel && this.relNgModel && this.natureNgModel && this.docNgModel && this.docNgModel && this.accountNgModel &&
  //     this.emailNgModel) {
  //     var model: any = {
  //       id: this.roleid,
  //       sharename: this.selectShareby,
  //       pan: this.panNgModel,
  //       name: this.nameNgModel,
  //       pan1: this.pan1NgModel,
  //       company: this.companyNgModel,
  //       pan2: this.pan2NgModel,
  //       date: this.dateNgModel,
  //       rel: this.relNgModel,
  //       nature: this.natureNgModel,
  //       doc: this.docNgModel,
  //       acc: this.accountNgModel,
  //       email: this.emailNgModel
  //     }
  //     console.log("addaduditdata", model);

  //     var apiUrl = '';
  //     apiUrl = 'createupsi/CreateUPSIAuditData';
  //     this.rest.create(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
  //       if (data.Success) {
  //         console.log("data", data);          
  //         this.panNgModel = null;
  //         this.nameNgModel = null;
  //         this.pan1NgModel = null;
  //         this.companyNgModel = null;          
  //         this.SearchSharedBYData = [];
  //         this.pan2NgModel = null;
  //         this.dateNgModel = null;
  //         this.relNgModel = null;
  //         this.natureNgModel = null;
  //         this.docNgModel = null;
  //         this.docNgModel = null;
  //         this.accountNgModel = null;
  //         this.emailNgModel = null; 
  //         if (this.autoCompleteRef1) {
  //           this.autoCompleteRef1.clear();
  //         }

  //         // Reset the associated variables
  //         this.selectShareby = null;
  //         this.panNgModel = null;         
  //         this.showAuditBlockBlockBtn = true;
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
  //         this.getAllAuditDetails(data.Data.PROJECT_ID);
  //       }
  //       else {
  //         this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
  //         this.getAllAuditDetails(data.Data.PROJECT_ID);
  //         this.showBlockBtn = false;
  //       }
  //     });
  //   } else {
  //     alert("Fill up details");
  //   }

  // }
  addaduditdata() {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (this.selectShareby && this.panNgModel && this.nameNgModel && this.pan1NgModel && this.companyNgModel && this.pan2NgModel
      && this.dateNgModel && this.relNgModel && this.natureNgModel && this.docNgModel && this.docNgModel && this.accountNgModel && this.entityNgmodel) {
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.pan1NgModel) && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.pan2NgModel)) {
        // if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailNgModel)) {
          var model: any = {
            id: this.roleid,
            sharename: this.selectShareby,
            pan: this.panNgModel,
            name: this.nameNgModel,
            pan1: this.pan1NgModel,
            company: this.companyNgModel,
            pan2: this.pan2NgModel,
            date: this.dateNgModel,
            rel: this.relNgModel,
            nature: this.natureNgModel,
            doc: this.docNgModel,
            acc: this.accountNgModel,
            // email: this.emailNgModel
            entity: this.entityNgmodel
          }
          let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                             

          // console.log("addaduditdata", model);

          var apiUrl = '';
          apiUrl = 'createupsi/CreateUPSIAuditData';
          this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
            if (data.Success) {
              // console.log("data", data);
              var Result = JSON.parse(this.Global.decrypt1(data.Data));
              this.panNgModel = null;
              this.nameNgModel = null;
              this.pan1NgModel = null;
              this.companyNgModel = null;
              this.SearchSharedBYData = [];
              this.pan2NgModel = null;
              this.dateNgModel = null;
              this.relNgModel = null;
              this.natureNgModel = null;
              this.docNgModel = null;
              this.docNgModel = null;
              this.accountNgModel = null;
              // this.emailNgModel = null;
              this.entityNgmodel = null;
              if (this.autoCompleteRef1) {
                this.autoCompleteRef1.clear();
              }

              // Reset the associated variables
              this.selectShareby = null;
              this.panNgModel = null;
              this.showAuditBlockBlockBtn = true;
              alert('Auditor data saved Successful.');
              // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
              this.getAllAuditDetails(Result.PROJECT_ID);
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              this.getAllAuditDetails(Result.PROJECT_ID);
              this.showBlockBtn = false;
            }
          });
        // } else {
        //   alert('Email format is incorrect');
        // }
      } else {
        alert('PAN format is incorrect');
      }
    } else {
      alert("Please Fill up all details");
    }

  }

  deleteAudit(auditDP: any) {
    // console.log("auditDP", auditDP);

    var model: any =
    {
      ID: auditDP.ID
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                            
    // console.log("deleteAudit", model);

    var apiUrl = '';
    apiUrl = 'createupsi/deleteAudit';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        alert('Auditor data deleted Successful.');
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        this.getAllAuditDetails(this.roleid);
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        this.getAllAuditDetails(this.roleid);
      }
    })

  }

  onSelectionChange(event: any) {
    // 'event' here represents the selected value object
    this.acctypeModel = event.value;
    // console.log(this.acctypeModel); // Check in the console if 'acctypeModel' is correctly set
  }

  addEmployee() {
    // debugger;
    // console.log("acctypeModel", this.acctypeModel);
    if (this.selectedEmployee && this.acctypeModel) {

      // const acctypecontroller = this.empform.get('acctypecontroller');    
      var model: any =
      {
        ID: this.roleid,
        empname: this.selectedEmployee,
        type: this.acctypeModel
      }
      // console.log("addEmployee", model);

      var apiUrl = '';
      apiUrl = 'createupsi/addEmp';
      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
        if (data.Success) {
          this.empSelected = true;
          this.selectedEmployee = null;
          this.SearchEmpData = [];
          this.autoCompleteRef.clear();
          this.acctypeModel = null;
          this.showBtnGroup = true;
          this.showBlockBtn = true;
          alert('Employee Data saved Successful.');
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.getAllEmployeeDetails(data.Data.PROJECT_ID);
        }
        else {
          this.empSelected = true;
          this.showBlockBtn = false;
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          this.getAllEmployeeDetails(data.Data.PROJECT_ID);
        }
      })
    } else {
      alert('Please fill in required fields:Employee Name,access Type');
    }
  }

  getAllEmployeeDetails(ProjectId: any) {
    this.rest.getAll(this.Global.getapiendpoint() + `createupsi/GetAllEmp/${ProjectId}`).subscribe((data: any) => {
      if (data.Success) {
        this.employeeDatas = data.Data;
        // console.log("getAllEmployeeDetails", this.employeeDatas)
      }
    });
  }

  deleteEmp(SelfDP: any) {
    // console.log("SelfDP", SelfDP);

    var model: any =
    {
      ID: SelfDP.ID
    }
    // console.log("deleteEmp", model);

    var apiUrl = '';
    apiUrl = 'createupsi/deleteEmployee';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl, model).subscribe((data: any) => {
      if (data.Success) {
        this.empSelected = true;
        alert('Employee data deleted Successful.');
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        this.getAllEmployeeDetails(SelfDP.PROJECT_ID);
      }
      else {
        this.empSelected = true;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
        this.getAllEmployeeDetails(SelfDP.PROJECT_ID);
      }
    })

  }

  fileSelected1(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['.xls', '.xlsx'];
      const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2); // Get the file extension

      if (allowedExtensions.includes(`.${fileExtension}`)) {
        // The selected file has a valid Excel file extension
        this.selectedFileName1 = selectedFile.name;
        this.formData = new FormData();
        this.formData.append('file', selectedFile);
      } else {
        // The selected file has an invalid extension
        this.selectedFileName1 = '';
        this.formData = null;
        alert('Only Excel files (.xls and .xlsx) are allowed.');
      }
    } else {
      this.selectedFileName1 = '';
      this.formData = null;
    }
  }

  // fileSelected1(event: any) {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const allowedExtensions = ['.xls', '.xlsx'];
  //     const fileExtension = selectedFile.name
  //       .slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2)
  //       .toLowerCase(); // Ensure lowercase comparison

  //     if (allowedExtensions.includes(`.${fileExtension}`)) {
  //       const reader = new FileReader();

  //       reader.onload = (e: any) => {
  //         const data = new Uint8Array(e.target.result);
  //         const workbook = XLSX.read(data, { type: 'array' });

  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = workbook.Sheets[sheetName];

  //         const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  //         const columnNames = [];
  //         for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
  //           const cellAddress = { c: C, r: headerRange.s.r };
  //           const cellRef = XLSX.utils.encode_cell(cellAddress);
  //           const cell = worksheet[cellRef];
  //           columnNames.push(cell.v);
  //         }

  //         const expectedColumns = ['Employee Name', 'Employee ID', 'EmailID'];
  //         const columnsMatch = expectedColumns.every((col, index) => columnNames[index] === col);

  //         if (columnsMatch) {
  //           this.selectedFileName1 = selectedFile.name;
  //           this.formData = new FormData();
  //           this.formData.append('file', selectedFile);
  //         } else {
  //           this.selectedFileName1 = '';
  //           this.formData = null;
  //           alert('Uploaded file does not meet the required format (column names mismatch).');
  //         }
  //       };

  //       reader.readAsArrayBuffer(selectedFile);
  //     } else {
  //       this.selectedFileName1 = '';
  //       this.formData = null;
  //       alert('Only Excel files (.xls and .xlsx) are allowed.');
  //     }
  //   } else {
  //     this.selectedFileName1 = '';
  //     this.formData = null;
  //   }
  // }


  uploadFile1() {
    // debugger;
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');

    if (this.formData) {

      // console.log("this.formData", this.formData);

      var model: any = {
        PROJECT_NAME: this.roleid,
      }

      for (var key in model) {
        this.formData.append(key, (model[key] == null || model[key] == undefined) ? "" : model[key]);
      }

      this.rest.postParams_forupload(this.Global.getapiendpoint() + "createupsi/SaveAuditUploadFile", this.formData).subscribe((data: any) => {
        // console.log("data success", data.Data);
        if (data.Success) {
          // console.log("data", data);
          alert('File upload successful');
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.selectedFileName1 = '';
          this.formData = null;
          this.showBlockBtn = true;
          const uploadPathObject = data.Data;

          // if (typeof uploadPathObject === 'string') {
          //   const fullPath = uploadPathObject;
          //   const separatorIndex = Math.max(fullPath.lastIndexOf('/'), fullPath.lastIndexOf('\\'));
          //   const fileName = fullPath.substring(separatorIndex + 1);
          //   this.selectedFileName = fileName;
          // }

        }
        else {
          this.showBlockBtn = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.Message });
        }
      });
    } else {
      alert('Please choose a file before uploading.');
    }
  }

  downloadSample1() {

    // const data = [
    //   ['Employee Name', 'Employee ID', 'EmailID'],
    //   ['John Doe', '12345', 'aaa@gmail.com'],
    //   ['Jane Smith', '67890', 'ccc@g.com'],
    //   // Add more sample data as needed
    // ];
    const data = [
      ['Name', 'PAN', 'Company Name','PAN','Shared By','PAN','Shared Date','Relationship','Nature of UPSI','Document Source','Acc Code','Entity'],
      ['John Doe', 'ASDFG456L', 'newel', 'SDFGT456L','Alexa','ZXCVB4521L','2023-12-24','Employee','Proposed terms of the transactions','Social Media','12564','Newel Securities Ltd.'],
      // Add more sample data as needed
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
    link.download = 'sample_data1.xlsx';

    // Trigger the download
    link.click();
  }

  getNatureNameById(natureId: string): string {
    const nature = this.natureid.find(n => n.ID.toString() === natureId);
    return nature ? nature.NAME : 'Unknown';
  }

  getTeamNamesByIds(teamIds: string): string {
    const teamIdArray = teamIds.split(',').map(Number);
    const teamNames = teamIdArray.map(id => {
      const team = this.applid.find(t => t.ID === id.toString());
      return team ? team.NAME : 'Unknown Team';
    });
    return teamNames.join(', ');
  }

  getTypeNameByIds(teamIds: string): string {
    const teamIdArray = teamIds.split(',').map(Number);
    const teamNames = teamIdArray.map(id => {
      const team = this.protypeid.find(t => t.ID === id.toString());
      return team ? team.NAME : 'Unknown Type';
    });
    return teamNames.join(', ');
  }


  toggleGrid() {
    this.showGrid = !this.showGrid;
  }

  getAllScriptDetails(ProjectId: any) {
    this.rest.getAll(this.Global.getapiendpoint() + `createupsi/GetAllScript/${ProjectId}`).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.Scripts = Result;
        // console.log("getAllScripDetails", this.Scripts)
      }
    });
  }


  addscriptdata() {
    // debugger;
    const scriptNamecontroller = this.Scriptform.get('scriptNamecontroller');
    const isincomtroller = this.Scriptform.get('isincomtroller');
    // console.log("saveroleid", this.roleid);

    if (this.roleid != null) {
      if (this.Scriptform.valid) {

        var mod: any = {
          SCRIPT_NAME: scriptNamecontroller.value.SCRIP_DESC,
          ID: this.roleid
        }
        let encryptmodel = this.Global.encryptionAES(JSON.stringify(mod)); 
                                           
        // console.log("mod", mod);

        var model: any = {
          SCRIPT_NAME: scriptNamecontroller.value.SCRIP_DESC,
          ISIN: isincomtroller.value,
          ID: this.roleid
        }
        let encryptmodel1 = this.Global.encryptionAES(JSON.stringify(model));
        // console.log("model", model);

        this.rest.postParams(this.Global.getapiendpoint() + 'createupsi/CheckDuplicateScript',  { encryptmodel: encryptmodel } 
        ).subscribe((data: any) => {
          if (data.Data) {
            this.Scriptform.reset();
            alert('Scrip already exsits.');
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Details already exists.' });
          } else {
            var apiUrl = '';
            apiUrl = 'createupsi/CreateSCriptData';
            this.rest.create(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel1 }).subscribe((data: any) => {
              if (data.Success) {
                // console.log("data", data);
                var Result = JSON.parse(this.Global.decrypt1(data.Data));
                alert('Scrip added Successful.');
                this.Scriptform.reset();
                this.getAllScriptDetails(this.roleid);

                // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
                // this.cancel();
              }
              else {
                this.Scriptform.reset();
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
              }
              this.getAllScriptDetails(this.roleid);
            });
          }
        });
      }
      else {
        scriptNamecontroller.markAsDirty();
        isincomtroller.markAsDirty();
        if (scriptNamecontroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Scrip Name is required' });
        }
        if (isincomtroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
        }
        this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
      }
    } else {
      if (this.Scriptform.valid) {

        var model: any = {
          SCRIPT_NAME: scriptNamecontroller.value.SCRIP_DESC,
          ISIN: isincomtroller.value,
          // ID: this.roleid        
        }
        // console.log("model", model);
        this.ScriptdataArray.push(model);
        // console.log("ScripdataArray", this.ScriptdataArray);
        alert('Scrip added Successful.');
        this.Scriptform.reset();
        this.Scripts = this.ScriptdataArray as Product[];

      }
      else {
        scriptNamecontroller.markAsDirty();
        isincomtroller.markAsDirty();
        if (scriptNamecontroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Scrip Name is required' });
        }
        if (isincomtroller.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'ISIN is required' });
        }
        this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'please fill the field' });
      }
    }
  }

  deleteScript(Script: any) {
    // console.log("Scrip", Script);
    // console.log("deleteroleid", this.roleid);

    if (this.roleid != null) {

      var model: any =
      {
        ID: Script.ID
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));                                              

      // console.log("deleteEmp", model);

      var apiUrl = '';
      apiUrl = 'createupsi/deleteScriptData';
      this.rest.postParams(this.Global.getapiendpoint() + apiUrl, { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          alert('Scrip deleted Successful.');
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
          this.getAllScriptDetails(this.roleid);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
          this.getAllScriptDetails(this.roleid);
        }
      })
    } else {
      const index = this.ScriptdataArray.findIndex(item => item.SCRIPT_NAME === Script.SCRIPT_NAME);
      if (index !== -1) {
        this.ScriptdataArray.splice(index, 1);
        this.Scripts = [...this.ScriptdataArray] as Product[]; // Update Scripts after deletion
        // console.log("afterdelete", ...this.ScriptdataArray);
        alert('Scrip deleted Successful.');

      }
    }

  }

  handleshowMenu() {
    this.showaddProjectbutton = false;
    this.showMainPage = true;
    this.showGridPage = false;
    // Set ScriptdataArray as an empty array
    this.ScriptdataArray = [];

    // Assign ScriptdataArray to Scripts as an array of Products
    this.Scripts = this.ScriptdataArray as Product[];
  }

  addblockUnblockAuditor() {
    this.loading2 = true;
    this.oncancel1 = false;
    this.showEndProjectButton = false;
    this.showBlockBtn = false;
    const projectNamecontroller = this.upsiprojectform.get('projectNamecontroller');
    var model: any =
    {
      ID: this.roleid,
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model)); 
                                           
    // console.log("addblockUnblockAuditor", model);

    var apiUrl = '';
    apiUrl = 'createupsi/generateAuditorblocking';
    this.rest.postParams(this.Global.getapiendpoint() + apiUrl,  { encryptmodel: encryptmodel } ).subscribe((data: any) => {
      if (data.Success) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        this.loading2 = false;
        this.oncancel = false;
        this.oncancel1 = true;
        this.showEndProjectButton = true;
        this.showAuditBlockBlockBtn = false;
        // this.showaddProjectbutton = true;
        // this.showMainPage = false;
        // this.showGridPage = true;
        alert('Auditor block successful.');
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: data.Message });
        // this.cancel();
        this.getAllAuditDetails(this.roleid);
      }
      else {
        this.loading2 = false;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: data.Message });
      }
    })
  }



  // Assuming these variables are declared in your component class


  handleChangeSendMailYes() {
    if (this.selectedSendMailYes) {
      this.selectedSendMailNo = false;
    }
  }

  handleChangeSendMailNo() {
    if (this.selectedSendMailNo) {
      this.selectedSendMailYes = false;
    }
  }



  handleSelection(value: string) {
    if (value === 'Yes' && this.previousSelection === 'Yes') {
      this.selectedSendMail = ''; // Deselect 'Yes' if it was previously selected
    }
    this.previousSelection = this.selectedSendMail; // Update previous selection
  }


}
