import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountantComponent } from './new-accountant.component';

describe('NewAccountantComponent', () => {
  let component: NewAccountantComponent;
  let fixture: ComponentFixture<NewAccountantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAccountantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
