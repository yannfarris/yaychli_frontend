import { TestBed } from '@angular/core/testing';

import { IsShowMediaGuard } from './is-show-media.guard';

describe('IsShowMediaGuard', () => {
  let guard: IsShowMediaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsShowMediaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
