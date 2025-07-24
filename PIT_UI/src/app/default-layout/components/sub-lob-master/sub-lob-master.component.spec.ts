import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLobMasterComponent } from './sub-lob-master.component';

describe('SubLobMasterComponent', () => {
  let component: SubLobMasterComponent;
  let fixture: ComponentFixture<SubLobMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubLobMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubLobMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
