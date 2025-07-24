import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNwilComponent } from './report-nwil.component';

describe('ReportNwilComponent', () => {
  let component: ReportNwilComponent;
  let fixture: ComponentFixture<ReportNwilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportNwilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportNwilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
