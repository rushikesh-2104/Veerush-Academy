import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPortal } from './student-portal';

describe('StudentPortal', () => {
  let component: StudentPortal;
  let fixture: ComponentFixture<StudentPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPortal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPortal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
