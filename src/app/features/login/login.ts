import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  showPassword = false;

  loading = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      rememberMe: [false]

    });

  }

  login() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log(response);

        // Save Token
        const storage = this.loginForm.value.rememberMe
  ? localStorage
  : sessionStorage;

storage.setItem("token", response.token);

storage.setItem(
  "user",
  JSON.stringify(response.user)
);



        this.toastr.success(
          "Welcome Back!",
          "Login Successful"
        );

        setTimeout(() => {

  const role = response.user.role;

  if (role === 'admin') {

    this.router.navigate(['/dashboard']);

  }

  else if (role === 'student') {

    this.router.navigate(['/student-dashboard']);

  }

  else if (role === 'teacher') {

    this.router.navigate(['/dashboard']);

  }

  else {

    this.router.navigate(['/']);

  }

}, 1200);

      },

      error: (error) => {

        this.loading = false;

        console.log(error);

        this.toastr.error(

          error?.error?.message || "Invalid Email or Password",

          "Login Failed"

        );

      }

    });

  }

}