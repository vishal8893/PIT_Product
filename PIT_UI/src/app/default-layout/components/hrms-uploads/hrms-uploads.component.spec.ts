import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsUploadsComponent } from './hrms-uploads.component';

describe('HrmsUploadsComponent', () => {
  let component: HrmsUploadsComponent;
  let fixture: ComponentFixture<HrmsUploadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrmsUploadsComponent]
    });
    fixture = TestBed.createComponent(HrmsUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
