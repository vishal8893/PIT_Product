import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpsiProjectComponent } from './create-upsi-project.component';

describe('CreateUpsiProjectComponent', () => {
  let component: CreateUpsiProjectComponent;
  let fixture: ComponentFixture<CreateUpsiProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpsiProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpsiProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
