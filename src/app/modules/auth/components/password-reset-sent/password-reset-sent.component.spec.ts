import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetSentComponent } from './password-reset-sent.component';

describe('PasswordResetSentComponent', () => {
  let component: PasswordResetSentComponent;
  let fixture: ComponentFixture<PasswordResetSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetSentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
