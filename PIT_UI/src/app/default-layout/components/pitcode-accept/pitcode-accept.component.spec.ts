import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PITCodeAcceptComponent } from './pitcode-accept.component';

describe('PITCodeAcceptComponent', () => {
  let component: PITCodeAcceptComponent;
  let fixture: ComponentFixture<PITCodeAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PITCodeAcceptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PITCodeAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
