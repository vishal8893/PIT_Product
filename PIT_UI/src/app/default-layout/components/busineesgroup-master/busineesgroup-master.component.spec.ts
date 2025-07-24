import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusineesgroupMasterComponent } from './busineesgroup-master.component';

describe('BusineesgroupMasterComponent', () => {
  let component: BusineesgroupMasterComponent;
  let fixture: ComponentFixture<BusineesgroupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusineesgroupMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusineesgroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
