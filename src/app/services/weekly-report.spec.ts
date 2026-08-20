import { TestBed } from '@angular/core/testing';

import { WeeklyReport } from './weekly-report';

describe('WeeklyReport', () => {
  let service: WeeklyReport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyReport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
