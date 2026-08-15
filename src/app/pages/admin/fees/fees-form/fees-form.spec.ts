import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesForm } from './fees-form';

describe('FeesForm', () => {
  let component: FeesForm;
  let fixture: ComponentFixture<FeesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
