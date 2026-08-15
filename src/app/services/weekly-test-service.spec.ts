import { TestBed } from '@angular/core/testing';

import { WeeklyTestService } from './weekly-test-service';

describe('WeeklyTestService', () => {
  let service: WeeklyTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
