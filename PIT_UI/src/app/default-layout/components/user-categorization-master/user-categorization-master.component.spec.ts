import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCategorizationMasterComponent } from './user-categorization-master.component';

describe('UserCategorizationMasterComponent', () => {
  let component: UserCategorizationMasterComponent;
  let fixture: ComponentFixture<UserCategorizationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCategorizationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCategorizationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
