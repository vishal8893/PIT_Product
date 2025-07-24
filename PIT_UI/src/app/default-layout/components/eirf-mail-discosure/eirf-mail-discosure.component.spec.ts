import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EirfMailDiscosureComponent } from './eirf-mail-discosure.component';


describe('EirfMailDiscosureComponent', () => {
  let component: EirfMailDiscosureComponent;
  let fixture: ComponentFixture<EirfMailDiscosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EirfMailDiscosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EirfMailDiscosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
