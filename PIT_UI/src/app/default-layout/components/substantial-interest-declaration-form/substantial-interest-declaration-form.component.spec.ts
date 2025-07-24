import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstantialInterestDeclarationFormComponent } from './substantial-interest-declaration-form.component';

describe('SubstantialInterestDeclarationFormComponent', () => {
  let component: SubstantialInterestDeclarationFormComponent;
  let fixture: ComponentFixture<SubstantialInterestDeclarationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubstantialInterestDeclarationFormComponent]
    });
    fixture = TestBed.createComponent(SubstantialInterestDeclarationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
