import { TestBed } from '@angular/core/testing';

import { Homework } from './homework';

describe('Homework', () => {
  let service: Homework;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Homework);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
