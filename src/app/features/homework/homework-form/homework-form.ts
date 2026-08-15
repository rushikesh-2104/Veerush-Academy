import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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

import { HomeworkService } from '../../../services/homework';
import { users } from '../../../services/users';
import { Homework } from '../../../models/homework.model';

@Component({
  selector: 'app-homework-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './homework-form.html',
  styleUrl: './homework-form.css'
})
export class HomeworkForm implements OnInit, OnChanges {

  @Input()
  homework: Homework | null = null;

  @Output()
  close = new EventEmitter<void>();

  homeworkForm: FormGroup;

  students: any[] = [];

  constructor(
    private fb: FormBuilder,
    private homeworkService: HomeworkService,
    private userService: users
  ) {

    this.homeworkForm = this.fb.group({

      title: ['', Validators.required],

      description: [''],

      subject: ['', Validators.required],

      studentId: ['', Validators.required],

      dueDate: ['', Validators.required],

      attachment: [''],

      status: ['Pending', Validators.required]

    });

  }

  ngOnInit(): void {

    this.loadStudents();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['homework'] && this.homework) {

      this.homeworkForm.patchValue({

        title: this.homework.title,

        description: this.homework.description,

        subject: this.homework.subject,

        studentId: this.homework.studentId,

        dueDate: this.homework.dueDate
          ? this.homework.dueDate.substring(0, 10)
          : '',

        attachment: this.homework.attachment,

        status: this.homework.status

      });

    }

  }

  // ==========================
  // Load Students
  // ==========================

  loadStudents() {

    this.userService.getStudents().subscribe({

      next: (data: any[]) => {

        this.students = data.filter(
          x => x.role === "student"
        );

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ==========================
  // Save Homework
  // ==========================

  saveHomework() {

    if (this.homeworkForm.invalid) {

      this.homeworkForm.markAllAsTouched();

      return;

    }

    // =====================
    // UPDATE
    // =====================

    if (this.homework) {

      this.homeworkService.updateHomework(

        this.homework._id!,

        this.homeworkForm.value

      ).subscribe({

        next: () => {

          alert("Homework Updated Successfully");

          this.close.emit();

        },

        error: (err) => {

          console.log(err);

        }

      });

      return;

    }

    // =====================
    // ADD
    // =====================

    this.homeworkService
      .addHomework(this.homeworkForm.value)
      .subscribe({

        next: () => {

          alert("Homework Added Successfully");

          this.homeworkForm.reset({

            status: 'Pending'

          });

          this.close.emit();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}