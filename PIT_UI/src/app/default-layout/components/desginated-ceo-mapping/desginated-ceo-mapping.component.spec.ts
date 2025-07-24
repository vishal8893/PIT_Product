import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesginatedCeoMappingComponent } from './desginated-ceo-mapping.component';

describe('DesginatedCeoMappingComponent', () => {
  let component: DesginatedCeoMappingComponent;
  let fixture: ComponentFixture<DesginatedCeoMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesginatedCeoMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesginatedCeoMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
