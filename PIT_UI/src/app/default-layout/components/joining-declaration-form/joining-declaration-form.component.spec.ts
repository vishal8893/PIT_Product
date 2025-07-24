import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningDeclarationFormComponent } from './joining-declaration-form.component';

describe('JoiningDeclarationFormComponent', () => {
  let component: JoiningDeclarationFormComponent;
  let fixture: ComponentFixture<JoiningDeclarationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoiningDeclarationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoiningDeclarationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
