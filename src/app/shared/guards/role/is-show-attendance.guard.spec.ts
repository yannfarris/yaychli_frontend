import { TestBed } from '@angular/core/testing';

import { IsShowAttendanceGuard } from './is-show-attendance.guard';

describe('IsShowAttendanceGuard', () => {
  let guard: IsShowAttendanceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsShowAttendanceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
