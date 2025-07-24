import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RestService } from '../../../services/rest.service';
import { Global } from '../../../common/global';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { DarkPoolApprovalModel } from '../dark-pool/dark-pool-approval.model';

@Component({
  selector: 'app-dark-pool-approval',
  templateUrl: './dark-pool-approval.component.html',
  styleUrls: ['./dark-pool-approval.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DarkPoolApprovalComponent implements OnInit, OnDestroy {
  approvalData: DarkPoolApprovalModel[] = [];
  approvalDataLoading: boolean = false;
  userData: any;
  private destroyed$ = new Subject<void>();
  valueofremark: any
  // Role-based access control
  hasAccess: boolean = false;
  isCheckingAccess: boolean = true;
  accessDeniedMessage: string = 'Access denied. Only Admin and Super Admin users can access this component.';
  rolesData: any[] = [];

  // Action tracking
  isProcessing: boolean = false;
  processingRecordId: any = null;
  rejectflag: boolean = false
  // Dialog properties
  showConfirmDialog: boolean = false;
  confirmDialogAction: 'approve' | 'reject' = 'approve';
  confirmDialogTitle: string = '';
  confirmDialogMessage: string = '';
  confirmDialogConfirmLabel: string = '';
  currentRecord: DarkPoolApprovalModel | null = null;

  constructor(
    private rest: RestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private Global: Global
  ) { }
  ngOnInit(): void {
    this.loadUserData();
    this.checkUserAccess();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  // Load user data from token
  private loadUserData() {
    try {
      const token = sessionStorage.getItem('jwt_token');
      if (!token) {
        this.messageService.add({
          severity: 'error',
          summary: 'Auth Error',
          detail: 'User token not found.'
        });
        return;
      }

      const decodedData: any = this.Global.decrypt(token);
      const userLoggedInString = JSON.stringify(decodedData['UserDetails']);
      this.userData = userLoggedInString ? JSON.parse(userLoggedInString) : null;
      console.log("User data from token:", this.userData);
    } catch (error) {
      console.error("Error decoding token:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Auth Error',
        detail: 'Could not decode user token.'
      });
    }
  }

  // Check user access based on role
  private checkUserAccess() {
    if (!this.userData) {
      this.hasAccess = false;
      this.isCheckingAccess = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Access Denied',
        detail: this.accessDeniedMessage
      });
      return;
    }

    // Get user's role code from token
    const userRoleCode = this.userData?.CODE || this.userData?.ROLECODE || this.userData?.DESIGNATED;
    console.log("User role code from token:", userRoleCode);

    if (!userRoleCode) {
      console.warn("No role code found in user data, loading roles from API to check access");
      this.loadRolesAndCheckAccess();
      return;
    }

    // Check if user role is Admin or Super Admin
    this.validateUserRole(userRoleCode);
  }

  // Load roles from API and check access
  private loadRolesAndCheckAccess() {
    this.rest.getAll(this.Global.getapiendpoint() + 'user/getallroles')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          try {
            if (response && response.Success) {
              const decryptedData = this.Global.decrypt1(response.Data);
              this.rolesData = JSON.parse(decryptedData);
              console.log("Roles data from API:", this.rolesData);

              // Try to match user with roles to determine access
              this.checkAccessWithRolesData();
            } else {
              console.error("Failed to load roles data:", response);
              this.denyAccess('Failed to validate user permissions.');
            }
          } catch (error) {
            console.error("Error processing roles data:", error);
            this.denyAccess('Error validating user permissions.');
          }
        },
        error: (error: any) => {
          console.error("Error loading roles:", error);
          this.denyAccess('Unable to validate user permissions.');
        }
      });
  }

  // Check access using roles data from API
  private checkAccessWithRolesData() {
    if (!this.rolesData || this.rolesData.length === 0) {
      this.denyAccess('No roles data available for validation.');
      return;
    }

    // Look for Admin and Super Admin roles
    const adminRole = this.rolesData.find(role =>
      role.NAME && role.NAME.toLowerCase().includes('admin') &&
      !role.NAME.toLowerCase().includes('super')
    );
    const superAdminRole = this.rolesData.find(role =>
      role.NAME && role.NAME.toLowerCase().includes('super') &&
      role.NAME.toLowerCase().includes('admin')
    );

    console.log("Found Admin role:", adminRole);
    console.log("Found Super Admin role:", superAdminRole);

    // Get user role code or ID
    const userRoleCode = this.userData?.CODE || this.userData?.ROLECODE || this.userData?.DESIGNATED;
    const userRoleId = this.userData?.ROLEID || this.userData?.ID;

    let hasValidRole = false;

    // Check by role code
    if (userRoleCode) {
      if (adminRole && (adminRole.CODE === userRoleCode || adminRole.NAME === userRoleCode)) {
        hasValidRole = true;
      }
      if (superAdminRole && (superAdminRole.CODE === userRoleCode || superAdminRole.NAME === userRoleCode)) {
        hasValidRole = true;
      }
    }

    // Check by role ID if no match by code
    if (!hasValidRole && userRoleId) {
      if (adminRole && adminRole.ID === userRoleId) {
        hasValidRole = true;
      }
      if (superAdminRole && superAdminRole.ID === userRoleId) {
        hasValidRole = true;
      }
    }

    // Check by role name patterns for common admin designations
    if (!hasValidRole) {
      const userDesignation = (this.userData?.DESIGNATED || this.userData?.CODE || '').toLowerCase();
      if (userDesignation.includes('admin') || userDesignation.includes('super')) {
        hasValidRole = true;
        console.log("Access granted based on designation pattern:", userDesignation);
      }
    }

    if (hasValidRole) {
      this.grantAccess();
    } else {
      this.denyAccess(`User role '${userRoleCode || userRoleId}' does not have access to this component.`);
    }
  }

  // Validate user role directly
  private validateUserRole(roleCode: string) {
    const normalizedRole = roleCode.toLowerCase();

    // Check for admin patterns
    if (normalizedRole.includes('admin') || normalizedRole.includes('super')) {
      console.log("Access granted for role:", roleCode);
      this.grantAccess();
    } else {
      this.denyAccess(`Role '${roleCode}' does not have access to this component.`);
    }
  }

  // Grant access and load data
  private grantAccess() {
    this.hasAccess = true;
    this.isCheckingAccess = false;
    console.log("Access granted - loading approval data");
    this.loadApprovalData();
  }

  // Deny access
  private denyAccess(message: string) {
    this.hasAccess = false;
    this.isCheckingAccess = false;
    this.accessDeniedMessage = message;
    console.warn("Access denied:", message);
    this.messageService.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: message
    });
  }

  // Load approval data
  loadApprovalData() {
    this.approvalDataLoading = true;
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
            severity: 'error',
            summary: 'Data Load Error',
            detail: 'Could not load approval data from server.'
          });
        }
      });
  }

  // Process approval data response
  private processApprovalDataResponse(response: any) {
    try {
      console.log("Processing approval data response:", response);

      if (response && response.Success === true && response.Data) {
        console.log("Decrypting approval data using Global.decrypt1...");

        const decryptedData = this.Global.decrypt1(response.Data);
        console.log("Decrypted approval data string:", decryptedData);

        const parsedData = JSON.parse(decryptedData);
        console.log("Parsed approval data:", parsedData); if (Array.isArray(parsedData)) {
          // Filter out records that are already approved (IS_ACCEPTED = true)
          const filteredData = parsedData.filter(item => {
            // Keep records that are not approved (IS_ACCEPTED is false, null, or undefined)
            return item.IS_ACCEPTED !== true;
          });

          this.approvalData = filteredData.map(item => new DarkPoolApprovalModel(item));

          console.log("Raw data count:", parsedData.length);
          console.log("Filtered data count (excluding approved):", filteredData.length);
          console.log("Filtered out approved records:", parsedData.length - filteredData.length);

          // Log the approved records that were filtered out for debugging
          const approvedRecords = parsedData.filter(item => item.IS_ACCEPTED === true);
          if (approvedRecords.length > 0) {
            console.log("Approved records filtered out:", approvedRecords.map(r => `${r.EMPID} - ${r.REQUEST_TYPE}`));
          }
        } else {
          this.approvalData = [];
        }

        console.log("Processed approval data:", this.approvalData); if (this.approvalData.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Pending Requests',
            detail: 'No pending approval requests found. All requests may have been processed already.'
          });
        }

      } else if (response && response.Success === false) {
        console.warn("Approval data API returned error:", response);
        this.approvalData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'API Error',
          detail: response.Message || 'Failed to retrieve approval data from server.'
        });
      } else {
        console.warn("Unexpected approval data response format:", response);
        this.approvalData = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Unexpected Response',
          detail: 'Received unexpected response format from server.'
        });
      }

    } catch (error) {
      console.error('Error processing approval data response:', error);
      this.approvalData = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Processing Error',
        detail: 'Failed to process approval data from server.'
      });
    }
  }

  // Approve record
  approveRecord(record: DarkPoolApprovalModel) {
    this.confirmDialogAction = 'approve';
    this.confirmDialogTitle = 'Approve Confirmation';
    this.confirmDialogMessage = `Are you sure you want to approve the ${record.REQUEST_TYPE || 'request'} for ${record.getDisplayName()}?`;
    this.confirmDialogConfirmLabel = 'Yes, Approve';
    this.currentRecord = record;
    this.showConfirmDialog = true;
  }

  // Reject record
  rejectRecord(record: DarkPoolApprovalModel) {
    this.confirmDialogAction = 'reject';
    this.confirmDialogTitle = 'Reject Confirmation';
    this.confirmDialogMessage = `Are you sure you want to reject the ${record.REQUEST_TYPE || 'request'} for ${record.getDisplayName()}?`;
    this.confirmDialogConfirmLabel = 'Yes, Reject';
    this.currentRecord = record;
    this.showConfirmDialog = true;
  }

  // Approve request button click
  approveRequest(record: DarkPoolApprovalModel) {
    this.currentRecord = record;
    this.confirmDialogAction = 'approve';
    this.confirmDialogTitle = 'Approve Request';
    this.confirmDialogMessage = `Are you sure you want to approve the ${record.REQUEST_TYPE || 'unknown'} request from ${record.FIRSTNAME || 'unknown employee'}?`;
    this.confirmDialogConfirmLabel = 'Approve';
    this.showConfirmDialog = true;
    this.rejectflag=false
  }

  // Reject request button click
  rejectRequest(record: DarkPoolApprovalModel) {
    this.currentRecord = record;
    this.confirmDialogAction = 'reject';
    this.confirmDialogTitle = 'Reject Request';
    this.confirmDialogMessage = `Are you sure you want to reject the ${record.REQUEST_TYPE || 'unknown'} request from ${record.FIRSTNAME || 'unknown employee'}?`;
    this.confirmDialogConfirmLabel = 'Reject';
    this.showConfirmDialog = true;
    this.rejectflag = true
  }
  // Perform approval/rejection action
  confirmDialogAccept() {
    if (!this.currentRecord) return;

    this.isProcessing = true;
    this.processingRecordId = this.currentRecord.EMPID; // Use EMPID for tracking

    try {
      const model = {
        ID: this.currentRecord.ID,
        EMPID: this.currentRecord.EMPID,
        FIRSTNAME: this.currentRecord.FIRSTNAME,
        REQUEST_TYPE: this.currentRecord.REQUEST_TYPE,
        IS_ACCEPTED: this.confirmDialogAction === 'approve',
        STATUS: this.confirmDialogAction === 'approve' ? 'APPROVED' : 'REJECTED', // Add explicit status
        MODIFIED_BY: this.userData?.EMPNO || this.userData?.ID || this.userData?.EmpID,
        MODIFIED_DT: new Date().toISOString(),
        ComplianceRemark:this.valueofremark
      };

      console.log(`${this.confirmDialogAction === 'approve' ? 'Approving' : 'Rejecting'} record:`, model);

      const encryptedModel = this.Global.encryptionAES(JSON.stringify(model));
      const apiUrl = 'upload/updateDPAllocationApprovalData';

      this.rest.create(
        this.Global.getapiendpoint() + apiUrl,
        { encryptmodel: encryptedModel }
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isProcessing = false;
            this.processingRecordId = null;
            this.showConfirmDialog = false;
            this.currentRecord = null;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.Success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Request ${this.confirmDialogAction === 'approve' ? 'approved' : 'rejected'} successfully`
              });

              // Reload data to reflect changes
              this.loadApprovalData();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.Message || `Failed to ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} request`
              });
            }
          },
          error: (error: any) => {
            console.error(`${this.confirmDialogAction === 'approve' ? 'Approve' : 'Reject'} API error:`, error);
            this.messageService.add({
              severity: 'error',
              summary: 'API Error',
              detail: this.extractErrorMessage(error, `Failed to ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} request`)
            });
          }
        });

    } catch (error) {
      this.isProcessing = false;
      this.processingRecordId = null;
      console.error(`Error in ${this.confirmDialogAction === 'approve' ? 'approve' : 'reject'} action:`, error);
      this.messageService.add({
        severity: 'error',
        summary: 'Action Error',
        detail: `An unexpected error occurred while ${this.confirmDialogAction === 'approve' ? 'approving' : 'rejecting'} the request`
      });
    }
  }
  // Confirm action from dialog
  confirmAction() {
    if (!this.currentRecord) {
      this.cancelAction();
      return;
    }

    this.confirmDialogAccept();
  }

  // Cancel action from dialog
  cancelAction() {
    this.showConfirmDialog = false;
    this.currentRecord = null;
  }

  // Extract error message helper
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
  // Check if record can be acted upon
  canTakeAction(record: DarkPoolApprovalModel): boolean {
    // Allow action on pending records (not yet approved/rejected, active, and not deleted)
    // IS_ACCEPTED can be true (approved), false (rejected), or null/undefined (pending)
    return record.isActive() &&
      !record.isDeleted() &&
      (record.IS_ACCEPTED === null || record.IS_ACCEPTED === undefined);
  }

  // Get status badge class
  getStatusBadgeClass(record: DarkPoolApprovalModel): string {
    if (!record.isActive()) {
      return 'badge bg-secondary';
    }
    if (record.isAccepted()) {
      return 'badge bg-success';
    }
    if (record.isMailSentForApproval()) {
      return 'badge bg-warning';
    }
    return 'badge bg-info';
  }

  // Get request type badge class
  getRequestTypeBadgeClass(requestType: string): string {
    if (!requestType) return 'badge bg-secondary';

    switch (requestType.toLowerCase()) {
      case 'finalize':
        return 'badge bg-primary';
      case 'reset':
        return 'badge bg-warning';
      default:
        return 'badge bg-info';
    }
  }
}
