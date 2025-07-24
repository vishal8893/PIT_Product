import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NWILBlockUnBlockFileUploadComponent } from './nwil-block-un-block-file-upload.component';

describe('NWILBlockUnBlockFileUploadComponent', () => {
  let component: NWILBlockUnBlockFileUploadComponent;
  let fixture: ComponentFixture<NWILBlockUnBlockFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NWILBlockUnBlockFileUploadComponent]
    });
    fixture = TestBed.createComponent(NWILBlockUnBlockFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
