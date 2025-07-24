import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromdeclartionComponent } from './fromdeclartion.component';

describe('FromdeclartionComponent', () => {
  let component: FromdeclartionComponent;
  let fixture: ComponentFixture<FromdeclartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromdeclartionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromdeclartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
