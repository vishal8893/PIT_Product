import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreadReportingComponent } from './tread-reporting.component';

describe('TreadReportingComponent', () => {
  let component: TreadReportingComponent;
  let fixture: ComponentFixture<TreadReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreadReportingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreadReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
