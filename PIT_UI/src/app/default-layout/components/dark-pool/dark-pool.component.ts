import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api'; // kalinditech - added ConfirmationService for delete operations
import { RestService } from '../../../services/rest.service';
import { Global } from '../../../common/global';
import { Subject } from 'rxjs';
import { takeUntil, finalize, debounceTime } from 'rxjs/operators';
import { DarkPoolApprovalData, DarkPoolApprovalModel } from './dark-pool-approval.model'; // kalinditech - imported approval model
import * as moment from 'moment';

@Component({
  selector: 'app-dark-pool',
  templateUrl: './dark-pool.component.html',
  styleUrls: ['./dark-pool.component.css'],
  providers: [MessageService, ConfirmationService] // kalinditech - added ConfirmationService provider
})
// kalinditech - Enhanced dark pool component with CRUD operations:
// - Added activity column with edit/delete buttons
// - Implemented add, update, delete functionality with encrypted API calls
// - Added form mode tracking (add/edit) with dynamic buttons
// - Removed security search field required validation
// - Removed "Load Test Data" button from UI
export class DarkPoolComponent implements OnInit, OnDestroy {
  TradeArray: any = [
    { ID: 1, Name: 'Equity' },
    { ID: 2, Name: 'Future' },
    { ID: 3, Name: 'Option' },
    { ID: 4, Name: 'PrimaryIssue' },
    { ID: 5, Name: 'SpecialCase' },

  ]
  valueofremark: any
  darkPoolForm!: FormGroup;
  securityList: any[] = [];
  userData: any; // To store decoded token data
  //isLoading: boolean = false;
  isSubmitting: boolean = false;
  isSecuritySearchLoading: boolean = false;
  private destroyed$ = new Subject<void>();
  VlidationQTY: Number
  // Additional properties to match IAF structure
  TRX_NO: any;
  LOCATION: any;
  COMPANY: any;
  LotSize: any;
  // For grid data
  holdingData: any[] = [];
  holdingGridLoading: boolean = false;
  selectedHolding: any = null;
  EmployeeAccountCode: any = []
  // Approval data properties // kalinditech
  approvalData: DarkPoolApprovalModel[] = []; // kalinditech - list of approval records
  approvalDataLoading: boolean = false; // kalinditech - loading state for approval API
  isEmployeeInApprovalList: boolean = false; // kalinditech - flag to check if current employee is in approval list
  currentEmployeeApprovalRecord: DarkPoolApprovalModel | null = null; // kalinditech - current employee's approval record// Edit mode tracking for CRUD operations // kalinditech
  editMode: boolean = false; // kalinditech
  editingHoldingId: any = null; // kalinditech
  onAddBtn: boolean = true; // kalinditech
  onEditBtn: boolean = false; // kalinditech
  onCancelBtn: boolean = true; // kalinditech
  // Table freeze functionality // kalinditech
  isTableFrozen: boolean = false; // kalinditech
  showResetButtonOnly: boolean = false; // kalinditech - flag to enable only reset button when REQUEST_TYPE is 'Finalize' and IS_ACCEPTED is true
  disableResetButton: boolean = true; // kalinditech - flag to disable reset button for first time users
  userLoggedIn: any;
  // Submit dialog properties // kalinditech
  showSubmitDialog: boolean = false; // kalinditech
  ResetSubmitDialog: boolean = false; // kalinditech
  submitDialogTitle: string = ''; // kalinditech
  submitDialogMessage: string = ''; // kalinditech
  submitDialogConfirmLabel: string = ''; // kalinditech
  pendingSubmitAction: 'add' | 'update' | null = null; // kalinditech
  values: any
  // Min date is today, max date is 7 days in future
  minDate: Date = new Date();
  maxDate: Date = new Date();
  get dpqty() { return this.darkPoolForm.get('dpqty'); }
  constructor(
    private fb: FormBuilder,
    private rest: RestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, // kalinditech - added for delete confirmation dialogs
    private Global: Global
  ) {
    try {
      // Initialize the security list as empty array
      this.securityList = [];

      // Set max date to 7 days from now
      this.maxDate.setDate(this.maxDate.getDate() + 7);

    } catch (error) {
      console.error('Error in constructor:', error);
      this.messageService.add({ severity: 'error', summary: 'Initialization Error', detail: 'Error initializing component' });
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();

    // Listen for changes in the securitySearch field
    this.darkPoolForm.get('securitySearch')?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (!value) {
          // Clear the ISIN code when security is cleared
          // this.darkPoolForm.get('isincode')?.setValue('');
        }
      });

    // Initialize with today's date
    let jwt_token = sessionStorage.getItem('jwt_token');
    let decodedData: any = this.Global.decrypt(jwt_token);
    const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;
    this.darkPoolForm.get('trxDate')?.setValue(new Date());

    this.userLoggedIn = userLoggedInString ? JSON.parse(userLoggedInString) : null;

    this.getallEmployeeAccountCode()
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  initForm() {
    this.darkPoolForm = this.fb.group({
      accCode: ['', Validators.required],
      accName: ['', Validators.required],
      panNo: ['', Validators.required],
      e_boid: ['', Validators.required],
      securitySearch: ['', Validators.required], // kalinditech - removed required validation
      isincode: ['', Validators.required],
      trxDate: ['', Validators.required],
      dpqty: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      segment: ['', Validators.required],
      abqty: ['']
    });
  } loadInitialData() {
    try {
      //this.isLoading = true;
      this.holdingGridLoading = true;
      this.approvalDataLoading = true; // kalinditech - start approval data loading
      const token = sessionStorage.getItem('jwt_token');

      if (!token) {
        //this.isLoading = false;
        this.holdingGridLoading = false;
        this.approvalDataLoading = false; // kalinditech - stop approval data loading
        this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'User token not found.' });
        return;
      }
      try {
        // Use the pattern consistent with other components in the application
        const decodedData: any = this.Global.decrypt(token);
        const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
        this.userData = userLoggedInString ? JSON.parse(userLoggedInString) : null;
        console.log("User data from token:", this.userData);
      } catch (tokenError) {
        console.error("Error decoding token:", tokenError);
        //this.isLoading = false;
        this.holdingGridLoading = false;
        this.approvalDataLoading = false; // kalinditech - stop approval data loading
        this.messageService.add({
          severity: 'error',
          summary: 'Auth Error',
          detail: 'Could not decode user token.'
        });
        return;
      }

      // Extract employee ID using the pattern from other components (EMPNO is the standard field)
      const empId = this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID;

      if (!empId) {
        //this.isLoading = false;
        this.holdingGridLoading = false;
        this.approvalDataLoading = false; // kalinditech - stop approval data loading
        this.messageService.add({ severity: 'error', summary: 'Auth Error', detail: 'Employee ID not found in token.' });
        return;
      }

      // kalinditech - Load both holding data and approval data in parallel
      this.loadHoldingData(empId);
      this.loadApprovalData(); // kalinditech - load approval data to check if employee is in approval list

    } catch (error) {
      //this.isLoading = false;
      this.holdingGridLoading = false;
      this.approvalDataLoading = false; // kalinditech - stop approval data loading
      console.error('Error in loadInitialData:', error); this.messageService.add({
        severity: 'error',
        summary: 'Initialization Error',
        detail: this.extractErrorMessage(error, 'An unexpected error occurred during initialization.')
      });
    }
  }

  // kalinditech - Separate method to load holding data
  private loadHoldingData(empId: string) {
    console.log('Automatically loading holding data for empId:', empId);

    const apiEndpoint = `${this.Global.getapiendpoint()}upload/getDPHoldingDataByEmpId?empId=${empId}`;
    console.log("Loading initial holding data from API:", apiEndpoint);
    this.rest.getAll(apiEndpoint)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          //this.isLoading = false;
          this.holdingGridLoading = false;
          console.log("Initial data load API request completed");
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log("Initial holding data API response received:", response);

          if (response) {
            console.log("Processing initial response data");
            try {
              // Process the response (handles both encrypted and non-encrypted data)
              // Don't show success message for automatic loading to avoid notification spam
              this.processEncryptedResponse(response, false);
            } catch (error) {
              console.error("Error processing initial response:", error);
              this.messageService.add({
                severity: 'error',
                summary: 'Processing Error',
                detail: this.extractErrorMessage(error, 'Error processing data from server.')
              });
            }
          } else {
            console.warn("Received null or undefined response for initial data");
            this.messageService.add({
              severity: 'info',
              summary: 'No Data',
              detail: 'No holding data found for your account.'
            });
          }
        },
        error: (error: any) => {
          console.error("Initial data load API error:", error);
          this.messageService.add({
            severity: 'warn',
            summary: 'Data Load',
            detail: 'Could not load holding data automatically.'
          });
        }
      });
  }

  // kalinditech - Method to load approval data and check if employee is in approval list
  private loadApprovalData() {
    const apiEndpoint = `${this.Global.getapiendpoint()}upload/getDPAllocationApprovalData`;
    console.log("Loading approval data from API:", apiEndpoint);

    this.rest.getAll(apiEndpoint)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.approvalDataLoading = false;
          console.log("Approval data load API request completed");
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log("Approval data API response received:", response);
          this.processApprovalDataResponse(response);
        },
        error: (error: any) => {
          console.error("Approval data load API error:", error);
          this.messageService.add({
            severity: 'warn',
            summary: 'Approval Data Load',
            detail: 'Could not load approval data. Some features may be limited.'
          });
        }
      });
  }

  // kalinditech - Process approval data response and check employee status
  private processApprovalDataResponse(response: any) {
    try {
      console.log("Processing approval data response:", response);

      if (response && response.Success === true && response.Data) {
        console.log("Decrypting approval data using Global.decrypt1...");

        // Decrypt the response data using Global.decrypt1 as per the standard pattern
        const decryptedData = this.Global.decrypt1(response.Data);
        console.log("Decrypted approval data string:", decryptedData);

        // Parse the decrypted JSON string
        const parsedData = JSON.parse(decryptedData);
        console.log("Parsed approval data:", parsedData);

        // Convert to approval model array
        if (Array.isArray(parsedData)) {
          this.approvalData = parsedData.map(item => new DarkPoolApprovalModel(item));
        } else {
          this.approvalData = [];
        }

        console.log("Processed approval data:", this.approvalData);

        // Check if current employee is in approval list
        this.checkEmployeeApprovalStatus();

      } else if (response && response.Success === false) {
        console.warn("Approval data API returned error:", response);
        this.approvalData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Approval Data Error',
          detail: response.Message || 'Failed to retrieve approval data from server.'
        });
      } else {
        console.warn("Unexpected approval data response format:", response);
        this.approvalData = [];
      }

    } catch (error) {
      console.error('Error processing approval data response:', error);
      this.approvalData = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Approval Data Processing Error',
        detail: 'Failed to process approval data from server.'
      });
    }
  }  // kalinditech - Check if current employee is in approval list and freeze table if needed
  private checkEmployeeApprovalStatus() {
    const currentEmpId = this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID;

    if (!currentEmpId) {
      console.warn("Cannot check employee approval status - no employee ID found");
      return;
    }

    console.log("Checking approval status for employee ID:", currentEmpId);

    // Find current employee in approval list
    this.currentEmployeeApprovalRecord = this.approvalData.find(approval =>
      approval.matchesEmployeeId(currentEmpId)
    ) || null;

    // Set flag if employee is in approval list
    this.isEmployeeInApprovalList = this.currentEmployeeApprovalRecord !== null;

    console.log("Employee in approval list:", this.isEmployeeInApprovalList);
    console.log("Employee approval record:", this.currentEmployeeApprovalRecord);
    // Reset all flags first
    this.isTableFrozen = false;
    this.showResetButtonOnly = false;
    this.disableResetButton = true; // Default: disable reset button

    if (this.currentEmployeeApprovalRecord) {
      console.log("REQUEST_TYPE value:", this.currentEmployeeApprovalRecord.REQUEST_TYPE);
      console.log("IS_ACCEPTED value:", this.currentEmployeeApprovalRecord.IS_ACCEPTED);
      console.log("IS_DELETE value:", this.currentEmployeeApprovalRecord.IS_DELETE);
      console.log("isAccepted() returns:", this.currentEmployeeApprovalRecord.isAccepted());
      console.log("isDeleted() returns:", this.currentEmployeeApprovalRecord.isDeleted());

      // Workflow logic based on REQUEST_TYPE, IS_ACCEPTED, and IS_DELETE
      if (!this.currentEmployeeApprovalRecord.isDeleted()) {

        if (this.currentEmployeeApprovalRecord.isFinalize()) {
          // REQUEST_TYPE = 'finalize'
          if (this.currentEmployeeApprovalRecord.isAccepted()) {
            // finalize + accepted = true: Enable only reset button
            console.log("Status: Finalize approved - enabling only reset button");
            this.isTableFrozen = true;
            this.showResetButtonOnly = true;
            this.disableResetButton = false; // Enable reset button
            this.freezeTableForApproval();
          } else {
            // finalize + accepted = false: Disable everything
            console.log("Status: Finalize pending approval - disabling everything");
            this.isTableFrozen = true;
            this.showResetButtonOnly = false;
            this.disableResetButton = true; // Keep reset disabled
            this.freezeTableForApproval();
          }
        }
        else if (this.currentEmployeeApprovalRecord.isReset()) {
          // REQUEST_TYPE = 'reset'
          if (this.currentEmployeeApprovalRecord.isAccepted()) {
            // reset + accepted = true: Enable everything except reset button
            console.log("Status: Reset approved - enabling everything except reset button");
            this.isTableFrozen = false;
            this.showResetButtonOnly = false;
            this.disableResetButton = true; // Disable reset button
            // Cancel any active edit mode but don't freeze table
            if (this.editMode) {
              this.cancelEdit();
            }
          } else {
            // reset + accepted = false: Disable everything
            console.log("Status: Reset pending approval - disabling everything");
            this.isTableFrozen = true;
            this.showResetButtonOnly = false;
            this.disableResetButton = true; // Keep reset disabled
            this.freezeTableForApproval();
          }
        }
        else {
          // Unknown REQUEST_TYPE: Disable everything for safety
          console.log("Status: Unknown request type - disabling everything for safety");
          this.isTableFrozen = true;
          this.showResetButtonOnly = false;
          this.disableResetButton = true; // Keep reset disabled
          this.freezeTableForApproval();
        }
      } else {
        // IS_DELETE = true: Record is deleted, enable everything except reset
        console.log("Status: Record deleted - enabling everything except reset button");
        this.isTableFrozen = false;
        this.showResetButtonOnly = false;
        this.disableResetButton = true; // Disable reset button
      }
    } else {
      // No approval record found: First time user, enable everything except reset button
      console.log("Status: No approval record - first time user, enabling everything except reset button");
      this.isTableFrozen = false;
      this.showResetButtonOnly = false;
      this.disableResetButton = true; // Disable reset button for first time users
    }

    console.log("Final UI state:", {
      isTableFrozen: this.isTableFrozen,
      showResetButtonOnly: this.showResetButtonOnly,
      disableResetButton: this.disableResetButton,
      isEmployeeInApprovalList: this.isEmployeeInApprovalList
    });
  }

  // kalinditech - Freeze table when employee is in approval list
  private freezeTableForApproval() {
    this.isTableFrozen = true;

    // Cancel any active edit mode
    if (this.editMode) {
      this.cancelEdit();
    }

    const approvalRecord = this.currentEmployeeApprovalRecord;
    let freezeMessage = 'Table is frozen - employee is in approval process.';

    if (approvalRecord) {
      const statusText = approvalRecord.getStatusText();
      // kalinditech - Special message when REQUEST_TYPE is Finalize and IS_ACCEPTED is true
      if (approvalRecord.isAccepted() && approvalRecord.isFinalize()) {
        freezeMessage = `Table is frozen - Records finalized. Only Reset operation is allowed.`;
      } else {
        freezeMessage = `Table is frozen - Current status: ${statusText}`;
      }
    }

    console.log("Table frozen due to approval process:", freezeMessage);

    this.messageService.add({
      severity: this.showResetButtonOnly ? 'warn' : 'info',
      summary: 'Approval Process Active',
      detail: freezeMessage
    });
  }



  processEncryptedResponse(response: any, showSuccessMessage: boolean = false) {
    console.log("Processing API response:", response);

    try {
      // Handle the standard API response format: { Success: boolean, Data: encrypted_string }
      if (response && response.Success === true && response.Data) {
        console.log("Decrypting response data using Global.decrypt1...");

        // Decrypt the response data using Global.decrypt1 as per the standard pattern
        const decryptedData = this.Global.decrypt1(response.Data);
        console.log("Decrypted data string:", decryptedData);
        // Parse the decrypted JSON string
        const parsedData = JSON.parse(decryptedData);
        console.log("Parsed holding data:", parsedData);

        // Check if parsedData is an array or has a data property
        if (Array.isArray(parsedData)) {
          this.holdingData = parsedData;
        } else if (parsedData && Array.isArray(parsedData.data)) {
          this.holdingData = parsedData.data;
        } else if (parsedData && parsedData.holdingData && Array.isArray(parsedData.holdingData)) {
          this.holdingData = parsedData.holdingData;
        } else {
          // If it's an object, try to extract array from common property names
          this.holdingData = parsedData.records || parsedData.holdings || parsedData.items || [];
        }

        console.log("Final processed holding data:", this.holdingData);
        // Debug: Log the structure of the first item to understand field names
        if (this.holdingData && this.holdingData.length > 0) {
          console.log("Sample holding record structure:", this.holdingData[0]);
          console.log("Available field names:", Object.keys(this.holdingData[0]));

          // Normalize field names to match template expectations
          this.holdingData = this.holdingData.map(item => this.normalizeFieldNames(item));
          console.log("Normalized holding data sample:", this.holdingData[0]);
        }

        if (this.holdingData.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Data',
            detail: 'No holding records found for your account.'
          });
        } else if (showSuccessMessage) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Successfully loaded ${this.holdingData.length} holding record(s) from API`
          });
        }

      } else if (response && response.Success === false) {
        // Handle API error response
        console.warn("API returned error:", response);
        this.holdingData = [];
        this.messageService.add({
          severity: 'error',
          summary: 'API Error',
          detail: response.Message || response.message || 'Failed to retrieve data from server.'
        });

      } else {
        // Handle unexpected response format
        console.warn("Unexpected response format:", response);
        this.holdingData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Unexpected Response',
          detail: 'Received unexpected response format from server.'
        });
      }

    } catch (error) {
      console.error('Error processing encrypted response:', error);
      this.holdingData = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Processing Error',
        detail: 'Failed to process response data from server.'
      });
    }
  }

  extractErrorMessage(error: any, defaultMessage: string): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    if (error && typeof error.message === 'string') {
      return error.message;
    }
    return defaultMessage;
  }
  getSecuritySearch(event: any) {
    let keydata = event.query
    if (keydata.length) {
      var model = {
        SCRIP_DESC: event.query
      }
      let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

      this.rest.postParams(this.Global.getapiendpoint() + "eirf/SCRIPDESC", { encryptmodel: encryptmodel }).subscribe((data: any) => {
        if (data.Success == true) {
          var Result = JSON.parse(this.Global.decrypt1(data.Data));
          const result = Result.filter((a1: { ISIN_CODE: any; }) =>
            !this.holdingData.some((a2: { ISIN_CODE: any; }) => a2.ISIN_CODE == a1.ISIN_CODE)
          );
          this.securityList = result;
        }
      })
    } else {
      this.securityList = []
    }
  }
  onSecuritySelect(event: any) {
    // console.log('Selected Value: ', event.SCRIP_DESC);
    let setvalue = event.SCRIP_DESC
    this.securityList.forEach(element => {
      if (setvalue == element.SCRIP_DESC) {
        this.darkPoolForm.get('isincode')?.setValue(element.ISIN_CODE);
        // Store additional data for future use
        this.TRX_NO = element.TRX_NO;
        this.LOCATION = element.LOCATION;
        this.COMPANY = element.COMPANY;
        this.LotSize = element.LOT_SIZE;
      }
    });
  }
  onSecurityClear() {
    this.darkPoolForm.get('securitySearch')?.reset();
    this.darkPoolForm.get('isincode')?.reset();
  }

  onPaste(event: ClipboardEvent): void {
    // Handle paste event for security search
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    if (pasteData) {
      // Set the value in the form control
      this.darkPoolForm.get('securitySearch')?.setValue(pasteData);

      // Trigger search if data is long enough
      if (pasteData.length >= 1) {
        this.getSecuritySearch({ query: pasteData });
      }
    }
  }

  onHoldingSelect(event: any) {
    const selectedData = event.data;
    console.log('Selected holding data:', selectedData);
    // Populate form fields with selected holding data
    if (selectedData) {
      this.darkPoolForm.patchValue({
        accCode: selectedData.ACCCODE || '',
        accName: selectedData.ACCNAME || '',
        panNo: selectedData.PANNO || '',
        e_boid: selectedData.E_BOID || '',
        dpqty: selectedData.QTY || '',
        segment: selectedData.SEGMENT || ''
      });

      // If ISIN code is available, set it and try to find the security
      if (selectedData.ISIN_CODE) {
        this.darkPoolForm.get('isincode')?.setValue(selectedData.ISIN_CODE);

        // If security description is available, set it too
        if (selectedData.SCRIP_DESC) {
          this.darkPoolForm.get('securitySearch')?.setValue(selectedData.SCRIP_DESC);
        }
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Selected',
        detail: 'Holding data populated in form successfully'
      });
    }
  } onSubmit() { // kalinditech - enhanced for CRUD operations
    if (this.darkPoolForm.valid && !this.isTableFrozen) {
      if (this.editMode) { // kalinditech
        // Show confirmation dialog for update operation // kalinditech
        this.showUpdateConfirmation(); // kalinditech
      } else {
        // Show confirmation dialog for add operation // kalinditech
        this.showAddConfirmation(); // kalinditech
      }
    } else if (this.isTableFrozen) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Table Frozen',
        detail: 'Cannot perform operations when table is frozen'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
    }
  }

  // Show confirmation dialog for add operation // kalinditech
  showAddConfirmation() { // kalinditech
    this.submitDialogTitle = 'Add Confirmation';
    this.submitDialogMessage = 'Are you sure you want to add this holding record?';
    this.submitDialogConfirmLabel = 'Yes, Add';
    this.pendingSubmitAction = 'add';
    this.showSubmitDialog = true;
  }

  // Show confirmation dialog for update operation // kalinditech
  showUpdateConfirmation() { // kalinditech
    this.submitDialogTitle = 'Update Confirmation';
    this.submitDialogMessage = 'Are you sure you want to update this holding record?';
    this.submitDialogConfirmLabel = 'Yes, Update';
    this.pendingSubmitAction = 'update';
    this.showSubmitDialog = true;
  }

  // Confirm the pending submit action // kalinditech
  confirmSubmitAction() { // kalinditech
    this.showSubmitDialog = false;

    if (this.pendingSubmitAction === 'add') {
      this.addHolding();
    } else if (this.pendingSubmitAction === 'update') {
      this.updateHolding();
    }

    this.pendingSubmitAction = null;
  }

  // Cancel the pending submit action // kalinditech
  cancelSubmitAction() { // kalinditech
    this.showSubmitDialog = false;
    this.pendingSubmitAction = null;
  }  // Finalize all records - freezes table // kalinditech
  finalizeRecords() { // kalinditech
    this.confirmationService.confirm({
      message: 'Are you sure you want to finalize all records? This will freeze the table and prevent further modifications.',
      header: 'Finalize Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Finalize',
      rejectLabel: 'Cancel',
      accept: () => {
        this.performFinalize();
      }
    });
  }
  // Reset all records - freezes table // kalinditech
  resetRecords() { // kalinditech
    this.ResetSubmitDialog = true
    // If showResetButtonOnly is true (Finalize + IS_ACCEPTED), bypass confirmation

  }
  // Perform finalize operation // kalinditech
  private performFinalize() { // kalinditech
    this.isSubmitting = true;

    try {
      // Create model for finalize API
      const model = {
        EMPID: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        FIRSTNAME: this.userData?.FIRSTNAME || '',
        DESIGNATED: this.userData?.CODE || '',
        REQUEST_TYPE: 'finalize',
        CREATED_DT: new Date().toISOString(),
        CREATED_BY: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID
      };

      console.log('Sending finalize request:', model);

      // Encrypt model following the pattern
      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));

      const apiUrl = 'upload/addDPAllocationApprovalData';

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Finalized',
                detail: 'Records submitted for finalization approval. Table is now frozen.'
              });

              // Reload approval data to update UI state
              this.loadApprovalData();

            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || 'Failed to submit finalization request'
              });
            }
          },
          error: (error: any) => {
            console.error('Finalize API error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, 'Failed to submit finalization request')
            });
          }
        });

    } catch (error) {
      this.isSubmitting = false;
      console.error('Error in performFinalize:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Finalize Error',
        detail: 'An error occurred while preparing finalization request'
      });
    }
  }
  // Perform reset operation // kalinditech
  private performReset() { // kalinditech
    this.isSubmitting = true;

    try {
      // Create model for reset API
      const model = {
        EMPID: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        FIRSTNAME: this.userData?.FIRSTNAME || '',
        DESIGNATED: this.userData?.CODE || '',
        REQUEST_TYPE: 'reset',
        CREATED_DT: new Date().toISOString(),
        CREATED_BY: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        REASON: this.valueofremark
      };

      console.log('Sending reset request:', model);

      // Encrypt model following the pattern
      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));

      const apiUrl = 'upload/addDPAllocationApprovalData';

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reset Requested',
                detail: 'Reset request submitted for approval. Table is now frozen.'
              });

              // Reload approval data to update UI state
              this.loadApprovalData();

            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || 'Failed to submit reset request'
              });
            }
          },
          error: (error: any) => {
            console.error('Reset API error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, 'Failed to submit reset request')
            });
          }
        });

    } catch (error) {
      this.isSubmitting = false;
      console.error('Error in performReset:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Reset Error',
        detail: 'An error occurred while preparing reset request'
      });
    }
  }
  // Add new holding record // kalinditech
  addHolding() { // kalinditech
    this.isSubmitting = true;

    try {
      const formData = this.darkPoolForm.value;

      const formattedDate = moment(formData.trxDate).format('YYYY-MM-DD');

      // Create model for add API
      const model = {
        ACCOUNT_CODE: formData.accCode.AccountCode,
        ACCOUNT_NAME: formData.accName,
        PAN_NO: formData.panNo,
        E_BOID: formData.e_boid,
        SCRIP_DESC: formData.securitySearch,
        ISIN_CODE: formData.isincode,
        DP_QTY: formData.dpqty,
        SEGMENT: formData.segment,
        TRX_DATE: formattedDate,
        EMPID: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        FIRSTNAME: this.userData?.FIRSTNAME || '', // kalinditech - added user firstname to model
        DESIGNATED: this.userData?.CODE || '', // kalinditech - designated field
      };

      console.log('Adding new holding record:', model);

      // Encrypt model following the pattern from entityceobhmaster
      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));

      const apiUrl = 'upload/addDPHoldingData';

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dark pool holding added successfully'
              });

              // Refresh table data
              this.loadInitialData();

              // Reset form after successful add
              this.reset();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || 'Failed to add holding'
              });
            }
          },
          error: (error: any) => {
            console.error('Add API error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, 'Failed to add holding record')
            });
          }
        });

    } catch (error) {
      this.isSubmitting = false;
      console.error('Error in addHolding:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Add Error',
        detail: 'An unexpected error occurred while adding record'
      });
    }
  }
  reset() {
    try {
      // Reset the form completely
      this.darkPoolForm.reset();

      // Clear security-related data
      this.securityList = [];

      // Reset additional IAF-style properties
      this.TRX_NO = null;
      this.LOCATION = null;
      this.COMPANY = null;
      this.LotSize = null;

      // Clear holding data selection
      this.selectedHolding = null;
      // Reset CRUD mode states // kalinditech
      this.editMode = false; // kalinditech
      this.editingHoldingId = null; // kalinditech
      this.onAddBtn = true; // kalinditech
      this.onEditBtn = false; // kalinditech
      this.onCancelBtn = true; // kalinditech

      // Reset loading states
      this.isSubmitting = false;
      this.isSecuritySearchLoading = false;

      // Set default transaction date to today
      this.darkPoolForm.get('trxDate')?.setValue(new Date());

      // Mark form as untouched to clear validation states
      this.darkPoolForm.markAsUntouched();
      this.darkPoolForm.markAsPristine();

      // this.messageService.add({ 
      //   severity: 'success', 
      //   summary: 'Reset', 
      //   detail: 'Form has been reset successfully' 
      // });

    } catch (error) {
      console.error('Error resetting form:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Reset Error',
        detail: 'Error occurred while resetting the form'
      });
    }
  }  // Edit holding record - populate form with selected holding data // kalinditech
  onEditHolding(holding: any) { // kalinditech
    if (this.isTableFrozen) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Table Frozen',
        detail: 'Cannot edit records when table is frozen'
      });
      return;
    }

    try {
      this.editMode = true;
      this.editingHoldingId = holding.ID || holding.ACCCODE; // Use ID if available, fallback to ACCCODE
      this.onEditBtn = true;
      this.onAddBtn = false;
      this.onCancelBtn = true;
      this.EmployeeAccountCode.forEach((element: any) => {

        if (holding.ACCOUNT_CODE == element.AccountCode) {
          this.darkPoolForm.get('accCode')?.setValue(element);
        }
      })


      this.darkPoolForm.get('accName')?.setValue(holding.ACCNAME);
      this.darkPoolForm.get('panNo')?.setValue(holding.PANNO);

      this.darkPoolForm.get('e_boid')?.setValue(holding.E_BOID);
      this.darkPoolForm.get('dpqty')?.setValue(holding.QTY);
      this.VlidationQTY = holding.QTY
      this.darkPoolForm.get('segment')?.setValue(holding.SEGMENT);
      this.darkPoolForm.get('abqty')?.setValue(0);

      this.values = holding.Script.SCRIP_DESC

      // If ISIN code is available, set it and security
      if (holding.ISIN_CODE) {
        this.darkPoolForm.get('isincode')?.setValue(holding.ISIN_CODE);

        // if (holding.SCRIP_DESC) {
        //   this.darkPoolForm.get('securitySearch')?.setValue(holding.SCRIP_DESC);
        // }
      }
      this.darkPoolForm.controls["securitySearch"].clearValidators();
      this.darkPoolForm.controls["securitySearch"].updateValueAndValidity();

      this.messageService.add({
        severity: 'info',
        summary: 'Edit Mode',
        detail: 'Record loaded for editing. Modify fields and click Update.'
      });
    } catch (error) {
      console.error('Error loading holding for edit:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Edit Error',
        detail: 'Error occurred while loading record for editing'
      });
    }
  }
  // Update holding record // kalinditech
  updateHolding() { // kalinditech
    if (this.dpqty?.value < this.VlidationQTY) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill the qty more than old qty'
      });
      return;
    }
    if (!this.darkPoolForm.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.isSubmitting = true;

    try {
      const formData = this.darkPoolForm.value;
      const formattedDate = moment(formData.trxDate).format('YYYY-MM-DD');// Output: 2025-06-06


      // Create model for update API
      const model = {
        ID: this.editingHoldingId,
        ACCOUNT_CODE: formData.accCode.AccountCode,
        ACCOUNT_NAME: formData.accName,
        PAN_NO: formData.panNo,
        E_BOID: formData.e_boid,
        SCRIP_DESC: formData.securitySearch,
        ISIN_CODE: formData.isincode,
        DP_QTY: formData.dpqty,
        SEGMENT: formData.segment,
        TRX_DATE: formattedDate,
        EMPID: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        Updatedqty: Number(this.dpqty?.value) - Number(this.VlidationQTY)
      };

      console.log('model', model);

      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));

      const apiUrl = 'upload/updateDPHoldingData'; // Assumed API endpoint

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Holding updated successfully'
              });

              // Refresh table data
              this.loadInitialData();

              // Reset form and exit edit mode
              this.cancelEdit();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || 'Failed to update holding'
              });
            }
          },
          error: (error: any) => {
            console.error('Update API error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, 'Failed to update holding record')
            });
          }
        });

    } catch (error) {
      this.isSubmitting = false;
      console.error('Error in updateHolding:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Update Error',
        detail: 'An unexpected error occurred while updating'
      });
    }
  }  // Delete holding record with confirmation // kalinditech
  deleteHolding(holding: any) { // kalinditech
    if (this.isTableFrozen) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Table Frozen',
        detail: 'Cannot delete records when table is frozen'
      });
      return;
    } this.confirmationService.confirm({
      message: `Are you sure you want to delete the holding for ${holding.ACCNAME || holding.ACCCODE}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger p-button-lg',
      rejectButtonStyleClass: 'p-button-text p-button-lg',
      accept: () => {
        this.performDelete(holding);
      }
    });
  }
  // Perform actual delete operation // kalinditech
  private performDelete(holding: any) { // kalinditech
    try {
      const model = {
        ID: holding.ID || holding.ACCCODE,
        EMPID: holding.EMPID || this.userData?.EMPNO || this.userData?.ID, // Use EMPNO or ID from userData
      };

      // Encrypt model following the pattern from entityceobhmaster
      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));

      const apiUrl = 'upload/deleteDPHoldingData'; // Assumed API endpoint

      this.rest.postParams(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Holding deleted successfully'
              });

              // Refresh table data after successful delete
              this.loadInitialData();

              // If we were editing this record, cancel edit mode
              if (this.editingHoldingId === (holding.ID || holding.ACCCODE)) {
                this.cancelEdit();
              }
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || 'Failed to delete holding'
              });
            }
          },
          error: (error: any) => {
            console.error('Delete API error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, 'Failed to delete holding record')
            });
          }
        });

    } catch (error) {
      console.error('Error in performDelete:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Delete Error',
        detail: 'An unexpected error occurred while deleting'
      });
    }
  }
  // Cancel edit mode and reset form // kalinditech
  cancelEdit() { // kalinditech
    this.editMode = false; // kalinditech
    this.editingHoldingId = null; // kalinditech
    this.onEditBtn = false; // kalinditech
    this.onAddBtn = true; // kalinditech
    this.onCancelBtn = true; // kalinditech

    // Reset form
    this.reset();
    this.darkPoolForm.controls["securitySearch"].setValidators(Validators.required);
    this.darkPoolForm.controls["securitySearch"].updateValueAndValidity();
  }
  // Method to normalize field names from API response to match template expectations
  normalizeFieldNames(item: any): any {
    const normalized: any = { ...item };

    // Map database field names to template expected field names

    // Account Code: ACCOUNT_CODE (DB) -> ACCCODE (Template)
    if (item.ACCOUNT_CODE && !normalized.ACCCODE) {
      normalized.ACCCODE = item.ACCOUNT_CODE;
    }

    // Account Name: ACCOUNT_NAME (DB) -> ACCNAME (Template)
    if (item.ACCOUNT_NAME && !normalized.ACCNAME) {
      normalized.ACCNAME = item.ACCOUNT_NAME;
    }

    // PAN Number: PAN_NO (DB) -> PANNO (Template)
    if (item.PAN_NO && !normalized.PANNO) {
      normalized.PANNO = item.PAN_NO;
    }

    // E-BOID: E_BOID (DB) -> E_BOID (Template) - already matches, but ensure it's set
    if (item.E_BOID && !normalized.E_BOID) {
      normalized.E_BOID = item.E_BOID;
    }

    // ISIN Code: ISIN_CODE (DB) -> ISIN_CODE (Template) - already matches
    if (item.ISIN_CODE && !normalized.ISIN_CODE) {
      normalized.ISIN_CODE = item.ISIN_CODE;
    }
    // Quantity: DP_QTY (DB) -> QTY (Template)
    if (item.DP_QTY !== undefined && item.DP_QTY !== null && !normalized.QTY) {
      normalized.QTY = item.DP_QTY;
    }

    // Segment: SEGMENT (DB) -> SEGMENT (Template) - already matches
    if (item.SEGMENT && !normalized.SEGMENT) {
      normalized.SEGMENT = item.SEGMENT;
    }

    // Note: SCRIP_DESC is not available in the DB table, so it will remain empty
    // The ISIN_CODE can be used to lookup security details if needed

    console.log("Field normalization for item:", {
      original: {
        ACCOUNT_CODE: item.ACCOUNT_CODE,
        ACCOUNT_NAME: item.ACCOUNT_NAME,
        PAN_NO: item.PAN_NO,
        E_BOID: item.E_BOID,
        ISIN_CODE: item.ISIN_CODE,
        DP_QTY: item.DP_QTY,
        SEGMENT: item.SEGMENT
      },
      normalized: {
        ACCCODE: normalized.ACCCODE,
        ACCNAME: normalized.ACCNAME,
        PANNO: normalized.PANNO,
        E_BOID: normalized.E_BOID,
        ISIN_CODE: normalized.ISIN_CODE,
        QTY: normalized.QTY,
        SEGMENT: normalized.SEGMENT
      }
    });

    return normalized;
  }
  confirm1(event: Event) {
    this.ResetSubmitDialog = false
    if (this.showResetButtonOnly) {
      console.log("Reset button is the only action allowed - bypassing confirmation");
      this.performReset();
      return;
    }

    // Otherwise show confirmation dialog
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset all records? This will freeze the table and prevent further modifications.',
      header: 'Reset Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Reset',
      rejectLabel: 'Cancel',
      accept: () => {
        this.performReset();
      }
    });

  }
  confirm2(event: Event) {
    this.ResetSubmitDialog = false
  }
  getallEmployeeAccountCode() {
    this.EmployeeAccountCode = []
    var model = {
      // loginid: this.userId,
      loginid: this.userLoggedIn.EMPNO
      // PAN: this.PancardNo
    }
    let encryptmodel = this.Global.encryptionAES(JSON.stringify(model));

    // console.log("accountcode", model);

    this.rest.postParams(this.Global.getapiendpoint() + "upload/EmployeeAccountCodeself", { encryptmodel: encryptmodel }).subscribe((data: any) => {
      if (data.Success == true) {
        var Result = JSON.parse(this.Global.decrypt1(data.Data));
        let fetchedData = Result;
        console.log("fetchedData", fetchedData);

        fetchedData.forEach((element: any) => {
          this.EmployeeAccountCode.push({
            AccountName: element.RELATIONSHIP ?? this.userLoggedIn.FIRSTNAME,
            AccountCode: element.TRADING_ACCOUNT_NUMBER,
            Display: element.Display,
            PAN_NO: element.PAN_NO ?? this.userLoggedIn.PANCARDNO,
            ID: this.userLoggedIn.EMPNO
          })
        })
      }
    })

  }

  SetAcountName(event: any) {
    this.darkPoolForm.get('accName')?.reset()
    this.darkPoolForm.get('panNo')?.reset()
    if (event.value.AccountName) {
      this.darkPoolForm.get('accName')?.setValue(event.value.AccountName);
      this.darkPoolForm.get('panNo')?.setValue(event.value.PAN_NO);
    }
  }
}
