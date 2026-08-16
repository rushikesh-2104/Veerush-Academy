import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { users } from '../../../services/users';


@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admission-form.html',
  styleUrl: './admission-form.css'
})
export class AdmissionForm {

  admissionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: users
  ) {

    this.admissionForm = this.fb.group({

      // Personal Details
      fullName: ['', Validators.required],
      fatherName: [''],
      motherName: [''],
      gender: ['', Validators.required],
      dob: ['', Validators.required],

      // Contact
      phone: ['', Validators.required],
      parentPhone: [''],
      email: ['', [Validators.required, Validators.email]],
      address: [''],

      // Academic
      school: [''],
      standard: ['', Validators.required],
      board: ['SSC'],
      course: [''],
      batch: [''],

      // Fees
      admissionFees: [0],
      monthlyFees: [0],
      joiningDate: [new Date().toISOString().substring(0, 10)],

      // Login
      password: ['', Validators.required],
      role: ['student'],

      // Profile
      profileImage: ['']
    });

  }

  registerStudent() {

  if (this.admissionForm.invalid) {
    this.admissionForm.markAllAsTouched();
    return;
  }

  this.userService.createUser(
    this.admissionForm.value
  ).subscribe({

    next: (res) => {


      alert("Student Registered Successfully");

      this.admissionForm.reset();
    },

    error: (err) => {

      console.log(err);

      alert(err.error.message);
    }

  });

}

}