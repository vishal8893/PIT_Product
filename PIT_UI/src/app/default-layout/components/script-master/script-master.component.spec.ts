import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptMasterComponent } from './script-master.component';

describe('ScriptMasterComponent', () => {
  let component: ScriptMasterComponent;
  let fixture: ComponentFixture<ScriptMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
