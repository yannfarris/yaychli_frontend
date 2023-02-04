import { TestBed } from '@angular/core/testing';

import { PasswordForgetSentGuard } from './password-forget-sent.guard';

describe('PasswordForgetSentGuard', () => {
  let guard: PasswordForgetSentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PasswordForgetSentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
