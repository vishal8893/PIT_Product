import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItradingPrimaryIssueMasterComponent } from './itrading-primary-issue-master.component';

describe('ItradingPrimaryIssueMasterComponent', () => {
  let component: ItradingPrimaryIssueMasterComponent;
  let fixture: ComponentFixture<ItradingPrimaryIssueMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItradingPrimaryIssueMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItradingPrimaryIssueMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
