import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNwilComponent } from './upload-nwil.component';

describe('UploadNwilComponent', () => {
  let component: UploadNwilComponent;
  let fixture: ComponentFixture<UploadNwilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadNwilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadNwilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
