import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoIrfApprovalComponent } from './auto-irf-approval.component';

describe('AutoIrfApprovalComponent', () => {
  let component: AutoIrfApprovalComponent;
  let fixture: ComponentFixture<AutoIrfApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoIrfApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoIrfApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
