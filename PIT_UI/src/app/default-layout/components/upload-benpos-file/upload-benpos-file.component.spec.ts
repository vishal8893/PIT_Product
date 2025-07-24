import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBenposFileComponent } from './upload-benpos-file.component';

describe('UploadBenposFileComponent', () => {
  let component: UploadBenposFileComponent;
  let fixture: ComponentFixture<UploadBenposFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadBenposFileComponent]
    });
    fixture = TestBed.createComponent(UploadBenposFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
