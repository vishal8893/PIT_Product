import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterMasterComponent } from './quarter-master.component';

describe('QuarterMasterComponent', () => {
  let component: QuarterMasterComponent;
  let fixture: ComponentFixture<QuarterMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterMasterComponent]
    });
    fixture = TestBed.createComponent(QuarterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
