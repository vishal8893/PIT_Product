import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCeoBhMappingMasterComponent } from './entity-ceo-bh-mapping-master.component';

describe('EntityCeoBhMappingMasterComponent', () => {
  let component: EntityCeoBhMappingMasterComponent;
  let fixture: ComponentFixture<EntityCeoBhMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityCeoBhMappingMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityCeoBhMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
