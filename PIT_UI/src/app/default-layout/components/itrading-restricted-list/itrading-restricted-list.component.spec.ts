import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITradingRestrictedListComponent } from './itrading-restricted-list.component';

describe('ITradingRestrictedListComponent', () => {
  let component: ITradingRestrictedListComponent;
  let fixture: ComponentFixture<ITradingRestrictedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITradingRestrictedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITradingRestrictedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
