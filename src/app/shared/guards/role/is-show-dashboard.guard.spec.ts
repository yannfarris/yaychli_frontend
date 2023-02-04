import { TestBed } from '@angular/core/testing';

import { IsShowDashboardGuard } from './is-show-dashboard.guard';

describe('IsShowDashboardGuard', () => {
  let guard: IsShowDashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsShowDashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
