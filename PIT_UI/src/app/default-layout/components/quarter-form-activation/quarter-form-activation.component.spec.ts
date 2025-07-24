import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterFormActivationComponent } from './quarter-form-activation.component';

describe('QuarterFormActivationComponent', () => {
  let component: QuarterFormActivationComponent;
  let fixture: ComponentFixture<QuarterFormActivationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterFormActivationComponent]
    });
    fixture = TestBed.createComponent(QuarterFormActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
