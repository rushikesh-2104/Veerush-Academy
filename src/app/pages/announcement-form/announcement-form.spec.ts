import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccouncementForm } from './accouncement-form';

describe('AccouncementForm', () => {
  let component: AccouncementForm;
  let fixture: ComponentFixture<AccouncementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccouncementForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccouncementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
