import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiraydateMasterComponent } from './expiraydate-master.component';

describe('ExpiraydateMasterComponent', () => {
  let component: ExpiraydateMasterComponent;
  let fixture: ComponentFixture<ExpiraydateMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiraydateMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiraydateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
