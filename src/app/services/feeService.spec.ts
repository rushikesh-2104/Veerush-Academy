import { TestBed } from '@angular/core/testing';

import { FeeService } from './feeService';

describe('Fee', () => {
  let service: FeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
