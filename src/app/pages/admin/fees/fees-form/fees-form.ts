import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { users } from '../../../../services/users';
import { FeeService } from '../../../../services/feeService';


@Component({
  selector: 'app-fees-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './fees-form.html',
  styleUrl: './fees-form.css'
})
export class FeesForm implements OnInit {

  @Output()
  close = new EventEmitter<void>();

  feeForm: FormGroup;

  students: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: users,
    private feeService: FeeService
  ) {

   this.feeForm = this.fb.group({

  student: ['', Validators.required],

  course: [
    '',
    Validators.required
  ],

  totalFees: [
    '',
    [Validators.required, Validators.min(1)]
  ],

  totalInstallments: [
    1,
    Validators.required
  ],

  dueDay: [
    15,
    Validators.required
  ]

});

  }

  ngOnInit(): void {

    this.loadStudents();

  }

  // ==========================
  // Load Students
  // ==========================

  loadStudents() {

    this.userService.getStudents().subscribe({

      next: (data: any[]) => {

        this.students = data.filter(
          x => x.role === 'student'
        );

        console.log(this.students);

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ==========================
  // Save Fee
  // ==========================

  saveFee() {

    if (this.feeForm.invalid) {

      this.feeForm.markAllAsTouched();

      return;

    }

    this.feeService.createFee(
      this.feeForm.value
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.close.emit();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}