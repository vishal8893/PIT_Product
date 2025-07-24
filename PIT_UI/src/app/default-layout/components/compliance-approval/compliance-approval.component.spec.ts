import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceApprovalComponent } from './compliance-approval.component';

describe('ComplianceApprovalComponent', () => {
  let component: ComplianceApprovalComponent;
  let fixture: ComponentFixture<ComplianceApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplianceApprovalComponent]
    });
    fixture = TestBed.createComponent(ComplianceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
