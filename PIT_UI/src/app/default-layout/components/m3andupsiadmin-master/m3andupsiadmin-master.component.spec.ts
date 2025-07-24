import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M3andupsiadminMasterComponent } from './m3andupsiadmin-master.component';

describe('M3andupsiadminMasterComponent', () => {
  let component: M3andupsiadminMasterComponent;
  let fixture: ComponentFixture<M3andupsiadminMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M3andupsiadminMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M3andupsiadminMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
