import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiRoleConfigComponent } from './ui-role-config.component';

describe('UiRoleConfigComponent', () => {
  let component: UiRoleConfigComponent;
  let fixture: ComponentFixture<UiRoleConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiRoleConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiRoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
