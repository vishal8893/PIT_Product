import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceApproveComponent } from './Compliance-Approve.component';

describe('LobMasterComponent', () => {
  let component: ComplianceApproveComponent;
  let fixture: ComponentFixture<ComplianceApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
