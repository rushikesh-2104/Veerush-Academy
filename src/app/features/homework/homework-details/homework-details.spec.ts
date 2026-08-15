import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkDetails } from './homework-details';

describe('HomeworkDetails', () => {
  let component: HomeworkDetails;
  let fixture: ComponentFixture<HomeworkDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
