import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { users } from '../../../services/users';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css'
})
export class StudentForm implements OnChanges {

  @Input()
  student: any = null;

  @Output()
  close = new EventEmitter<void>();

  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: users
  ) {

    this.studentForm = this.fb.group({

      // ==========================
      // Personal Details
      // ==========================

      fullName: ['', Validators.required],

      fatherName: [''],

      motherName: [''],

      gender: ['Other'],

      dob: [''],

      // ==========================
      // Contact Details
      // ==========================

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      parentPhone: [
        '',
        Validators.pattern(/^[0-9]{10}$/)
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      address: [''],

      // ==========================
      // Academic Details
      // ==========================

      school: [''],

      standard: ['', Validators.required],

      board: ['SSC'],

      course: [''],

      batch: [''],

      joiningDate: [
        new Date().toISOString().substring(0, 10)
      ],

      // ==========================
      // Fees
      // ==========================

      monthlyFees: [0],

      admissionFees: [0],

      // ==========================
      // Login
      // ==========================

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      role: ['student'],

      // ==========================
      // Profile
      // ==========================

      profileImage: ['']

    });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['student'] && this.student) {

      this.studentForm.patchValue({

        ...this.student,

        joiningDate: this.student.joiningDate
          ? this.student.joiningDate.substring(0, 10)
          : ''

      });

      // Edit Mode → Password Optional
      this.studentForm
        .get('password')
        ?.clearValidators();

      this.studentForm
        .get('password')
        ?.updateValueAndValidity();

    } else {

      // Create Mode → Password Required
      this.studentForm
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6)
        ]);

      this.studentForm
        .get('password')
        ?.updateValueAndValidity();

    }

  }

  saveStudent() {

    if (this.studentForm.invalid) {

      this.studentForm.markAllAsTouched();

      return;

    }

    // ==================================
    // UPDATE STUDENT
    // ==================================

    if (this.student) {

      const data = {
        ...this.studentForm.value
      };

      // Password blank ho to update mat karo
      if (!data.password) {

        delete data.password;

      }

      this.userService.updateUser(
        this.student._id,
        data
      ).subscribe({

        next: () => {

          alert("Student Updated Successfully");

          this.close.emit();

        },

        error: (err) => {

          console.error(err);

          alert(err.error.message);

        }

      });

      return;

    }

    // ==================================
    // CREATE STUDENT
    // ==================================

    this.userService.createUser(
      this.studentForm.value
    ).subscribe({

      next: () => {

        alert("Student Registered Successfully");

        this.studentForm.reset({

          gender: 'Other',

          board: 'SSC',

          role: 'student',

          monthlyFees: 0,

          admissionFees: 0,

          joiningDate: new Date()
            .toISOString()
            .substring(0, 10)

        });

        this.close.emit();

      },

      error: (err) => {

        console.error(err);

        alert(err.error.message);

      }

    });

  }

}