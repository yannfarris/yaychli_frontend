import { TestBed } from '@angular/core/testing';

import { GetBarcodeService } from './get-barcode.service';

describe('GetBarcodeService', () => {
  let service: GetBarcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetBarcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
