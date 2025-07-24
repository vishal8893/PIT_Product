import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsubdiaryMasterComponent } from './materialsubdiary-master.component';

describe('MaterialsubdiaryMasterComponent', () => {
  let component: MaterialsubdiaryMasterComponent;
  let fixture: ComponentFixture<MaterialsubdiaryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsubdiaryMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsubdiaryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
