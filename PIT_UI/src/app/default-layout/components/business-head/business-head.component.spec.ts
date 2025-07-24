import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHeadComponent } from './business-head.component';

describe('BusinessHeadComponent', () => {
  let component: BusinessHeadComponent;
  let fixture: ComponentFixture<BusinessHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
