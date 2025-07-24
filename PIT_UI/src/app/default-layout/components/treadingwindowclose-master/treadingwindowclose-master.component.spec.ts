import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreadingwindowcloseMasterComponent } from './treadingwindowclose-master.component';

describe('TreadingwindowcloseMasterComponent', () => {
  let component: TreadingwindowcloseMasterComponent;
  let fixture: ComponentFixture<TreadingwindowcloseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreadingwindowcloseMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreadingwindowcloseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
