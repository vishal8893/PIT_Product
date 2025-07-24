import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityMaterialsubsidiaryCeoBhMappingMasterComponent } from './entity-materialsubsidiary-ceo-bh-mapping-master.component';

describe('EntityMaterialsubsidiaryCeoBhMappingMasterComponent', () => {
  let component: EntityMaterialsubsidiaryCeoBhMappingMasterComponent;
  let fixture: ComponentFixture<EntityMaterialsubsidiaryCeoBhMappingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityMaterialsubsidiaryCeoBhMappingMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityMaterialsubsidiaryCeoBhMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
