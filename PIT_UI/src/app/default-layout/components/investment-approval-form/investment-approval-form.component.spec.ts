import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentApprovalFormComponent } from './investment-approval-form.component';

describe('InvestmentApprovalFormComponent', () => {
  let component: InvestmentApprovalFormComponent;
  let fixture: ComponentFixture<InvestmentApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentApprovalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
