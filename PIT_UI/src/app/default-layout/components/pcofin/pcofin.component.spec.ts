import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcofinComponent } from './pcofin.component';

describe('PcofinComponent', () => {
  let component: PcofinComponent;
  let fixture: ComponentFixture<PcofinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcofinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcofinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
