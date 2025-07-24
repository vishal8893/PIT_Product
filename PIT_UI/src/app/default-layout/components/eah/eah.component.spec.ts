import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EAHComponent } from './eah.component';

describe('EAHComponent', () => {
  let component: EAHComponent;
  let fixture: ComponentFixture<EAHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EAHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EAHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
