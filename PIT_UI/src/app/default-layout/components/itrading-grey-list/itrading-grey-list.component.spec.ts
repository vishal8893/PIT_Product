import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITradingGreyListComponent } from './itrading-grey-list.component';

describe('ITradingGreyListComponent', () => {
  let component: ITradingGreyListComponent;
  let fixture: ComponentFixture<ITradingGreyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITradingGreyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITradingGreyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
