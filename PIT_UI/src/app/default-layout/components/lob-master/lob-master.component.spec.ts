import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobMasterComponent } from './lob-master.component';

describe('LobMasterComponent', () => {
  let component: LobMasterComponent;
  let fixture: ComponentFixture<LobMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LobMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
