import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbuMasterComponent } from './sbu-master.component';

describe('SbuMasterComponent', () => {
  let component: SbuMasterComponent;
  let fixture: ComponentFixture<SbuMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SbuMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbuMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
