// kalinditech - Dark Pool Approval Data Model
// This model represents the approval data structure from the backend API

export interface DarkPoolApprovalData {
  ID: number;
  EMPID?: string;
  FIRSTNAME?: string;
  DESIGNATED?: string;
  REQUEST_TYPE?: string;
  IS_MAIL_SENT_FOR_APPROVAL?: boolean;
  IS_ACCEPTED?: boolean;
  IS_ACTIVE?: boolean;
  IS_DELETE?: boolean; // kalinditech - added IS_DELETE field
  CREATED_DT?: Date | string;
  CREATED_BY?: string;
  MODIFIED_BY?: string;
  MODIFIED_DT?: Date | string;
}

export class DarkPoolApprovalModel implements DarkPoolApprovalData {
  ID: number = 0;
  EMPID?: string;
  FIRSTNAME?: string;
  DESIGNATED?: string;
  REQUEST_TYPE?: string;
  IS_MAIL_SENT_FOR_APPROVAL?: boolean = false;
  IS_ACCEPTED?: boolean = false;
  IS_ACTIVE?: boolean = true;
  IS_DELETE?: boolean = false; // kalinditech - added IS_DELETE field
  CREATED_DT?: Date | string;
  CREATED_BY?: string;
  MODIFIED_BY?: string;
  MODIFIED_DT?: Date | string;

  constructor(data?: Partial<DarkPoolApprovalData>) {
    if (data) {
      Object.assign(this, data);
      
      // Convert date strings to Date objects if needed
      if (data.CREATED_DT && typeof data.CREATED_DT === 'string') {
        this.CREATED_DT = new Date(data.CREATED_DT);
      }
      if (data.MODIFIED_DT && typeof data.MODIFIED_DT === 'string') {
        this.MODIFIED_DT = new Date(data.MODIFIED_DT);
      }
    }
  }

  // Helper methods
  isMailSentForApproval(): boolean {
    return this.IS_MAIL_SENT_FOR_APPROVAL === true;
  }

  isAccepted(): boolean {
    return this.IS_ACCEPTED === true;
  }

  isActive(): boolean {
    return this.IS_ACTIVE === true;
  }

  getFormattedCreatedDate(): string {
    if (this.CREATED_DT) {
      const date = new Date(this.CREATED_DT);
      return date.toLocaleDateString();
    }
    return '';
  }

  getFormattedModifiedDate(): string {
    if (this.MODIFIED_DT) {
      const date = new Date(this.MODIFIED_DT);
      return date.toLocaleDateString();
    }
    return '';
  }

  // Check if this approval record matches a given employee ID
  matchesEmployeeId(empId: string): boolean {
    return this.EMPID === empId;
  }

  // Get display name for the employee
  getDisplayName(): string {
    return this.FIRSTNAME || this.EMPID || 'Unknown';
  }

  // Get status display text
  getStatusText(): string {
    if (!this.isActive()) {
      return 'Inactive';
    }
    if (this.isAccepted()) {
      return 'Approved';
    }
    if (this.isMailSentForApproval()) {
      return 'Pending Approval';
    }
    return 'Draft';
  }
    // kalinditech - Check if REQUEST_TYPE is "Finalize" (case-insensitive)
  isFinalize(): boolean {
    if (!this.REQUEST_TYPE) {
      return false;
    }
    return this.REQUEST_TYPE.toUpperCase() === 'FINALIZE';
  }

  // kalinditech - Check if REQUEST_TYPE is "Reset" (case-insensitive)
  isReset(): boolean {
    if (!this.REQUEST_TYPE) {
      return false;
    }
    return this.REQUEST_TYPE.toUpperCase() === 'RESET';
  }

  // kalinditech - Check if record is deleted
  isDeleted(): boolean {
    return this.IS_DELETE === true;
  }
}
