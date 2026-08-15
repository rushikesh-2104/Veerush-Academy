import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homework } from './homework';

describe('Homework', () => {
  let component: Homework;
  let fixture: ComponentFixture<Homework>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homework]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homework);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
