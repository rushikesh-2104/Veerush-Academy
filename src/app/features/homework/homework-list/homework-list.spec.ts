import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkList } from './homework-list';

describe('HomeworkList', () => {
  let component: HomeworkList;
  let fixture: ComponentFixture<HomeworkList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
