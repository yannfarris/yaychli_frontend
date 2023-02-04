import { TestBed } from '@angular/core/testing';

import { IsSuperAdminService } from './is-super-admin.service';

describe('IsSuperAdminService', () => {
  let service: IsSuperAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsSuperAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
