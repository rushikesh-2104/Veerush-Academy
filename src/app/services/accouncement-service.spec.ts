import { TestBed } from '@angular/core/testing';

import { AccouncementService } from './accouncement-service';

describe('AccouncementService', () => {
  let service: AccouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
