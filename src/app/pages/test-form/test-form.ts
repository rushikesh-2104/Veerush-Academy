import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { WeeklyTestService } from '../../services/weekly-test-service';
import { users } from '../../services/users';



@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './test-form.html',
  styleUrl: './test-form.css'
})
export class TestForm implements OnInit {

  @Input() test: any;

  @Output() close = new EventEmitter<void>();

  @Output() saved = new EventEmitter<void>();

  classForm!: FormGroup;

  loading = false;

  students: any[] = [];

  courses: any[] = [];

  constructor(

    private fb: FormBuilder,

    private weeklyTestService: WeeklyTestService,

    private userService : users

  ) {}

  ngOnInit(): void {

    this.classForm = this.fb.group({

      student: ['', Validators.required],

      course: ['', Validators.required],

      title: ['', Validators.required],

      totalMarks: [
        '',
        [Validators.required, Validators.min(1)]
      ],

      obtainedMarks: [
        '',
        [Validators.required, Validators.min(0)]
      ],

      testDate: ['', Validators.required],

      remarks: ['']

    });

    this.loadStudents();

    

    if (this.test) {

      this.classForm.patchValue({

        student: this.test.student?._id,

        course: this.test.course?._id,

        title: this.test.title,

        totalMarks: this.test.totalMarks,

        obtainedMarks: this.test.obtainedMarks,

        testDate: this.formatDate(this.test.testDate),

        remarks: this.test.remarks

      });

    }

  }

  // ==========================
  // Students
  // ==========================

 loadStudents() {

  this.userService.getStudents().subscribe({

    next: (students: any[]) => {

      console.log("Students:", students);

      this.students = students;

    },

    error: (err) => {

      console.log(err);

    }

  });

}

  // ==========================
  // Courses
  // ==========================

  

  // ==========================
  // Save
  // ==========================

  saveTest() {

    if (this.classForm.invalid) {

      this.classForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    if (this.test) {

      this.weeklyTestService

        .updateTest(
          this.test._id,
          this.classForm.value
        )

        .subscribe({

          next: () => {

            this.loading = false;

            this.saved.emit();

          },

          error: (err) => {

            this.loading = false;

            console.log(err);

          }

        });

    }

    else {

      this.weeklyTestService

        .createTest(this.classForm.value)

        .subscribe({

          next: () => {

            this.loading = false;

            this.saved.emit();

          },

          error: (err) => {

            this.loading = false;

            console.log(err);

          }

        });

    }

  }

 



getSelectedStudentName(): string {

  if (!this.students || this.students.length === 0) {
    return '-';
  }

  const student = this.students.find(
    (s: any) => s._id === this.classForm?.value?.student
  );

  return student?.fullName || '-';
}

  // ==========================
  // Format Date
  // ==========================

  formatDate(date: string): string {

    return new Date(date)

      .toISOString()

      .split('T')[0];

  }

}