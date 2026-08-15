import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkForm } from './homework-form';

describe('HomeworkForm', () => {
  let component: HomeworkForm;
  let fixture: ComponentFixture<HomeworkForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
