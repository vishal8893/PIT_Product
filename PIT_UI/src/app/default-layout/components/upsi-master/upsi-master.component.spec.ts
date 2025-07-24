import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsiMasterComponent } from './upsi-master.component';

describe('UpsiMasterComponent', () => {
  let component: UpsiMasterComponent;
  let fixture: ComponentFixture<UpsiMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsiMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsiMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
