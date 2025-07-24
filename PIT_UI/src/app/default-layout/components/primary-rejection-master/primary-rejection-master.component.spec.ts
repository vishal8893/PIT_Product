import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryRejectionMasterComponent } from './primary-rejection-master.component';

describe('PrimaryRejectionMasterComponent', () => {
  let component: PrimaryRejectionMasterComponent;
  let fixture: ComponentFixture<PrimaryRejectionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryRejectionMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryRejectionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
