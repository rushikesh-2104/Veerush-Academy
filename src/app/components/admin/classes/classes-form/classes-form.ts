import { CommonModule } from '@angular/common';
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

import { ClassService } from '../../../../services/classService';

@Component({
  selector: 'app-classes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './classes-form.html',
  styleUrl: './classes-form.css'
})
export class ClassesForm implements OnInit {

  @Input()
  classData: any = null;

  @Output()
  close = new EventEmitter<void>();

  classForm!: FormGroup;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private classService: ClassService
  ) {}

  ngOnInit(): void {

    this.classForm = this.fb.group({

      course: [
        '',
        Validators.required
      ],

      standard: [
        '',
        Validators.required
      ],

      subject: [
        '',
        Validators.required
      ],

      topic: [
        '',
        Validators.required
      ],

      teacher: [
        '',
        Validators.required
      ],

      date: [
        '',
        Validators.required
      ],

      startTime: [
        '',
        Validators.required
      ],

      endTime: [
        '',
        Validators.required
      ],

      meetLink: [
        ''
      ],

      description: [
        ''
      ]

    });

    // ==========================
    // Edit Mode
    // ==========================

    if (this.classData) {

      this.classForm.patchValue({

        course: this.classData.course,
        standard: this.classData.standard,
        subject: this.classData.subject,
        topic: this.classData.topic,
        teacher: this.classData.teacher,
        date: this.classData.date?.substring(0,10),
        startTime: this.classData.startTime,
        endTime: this.classData.endTime,
        meetLink: this.classData.meetLink,
        description: this.classData.description

      });

    }

  }

  // ==========================
  // Save / Update
  // ==========================

  saveClass() {

    if (this.classForm.invalid) {

      this.classForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    // ==========================
    // UPDATE
    // ==========================

    if (this.classData) {

      this.classService.updateClass(

        this.classData._id,

        this.classForm.value

      ).subscribe({

        next: (res) => {

          console.log(res);

          this.loading = false;

          this.close.emit();

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

        }

      });

    }

    // ==========================
    // CREATE
    // ==========================

    else {

      this.classService.createClass(

        this.classForm.value

      ).subscribe({

        next: (res) => {

          console.log(res);

          this.loading = false;

          this.close.emit();

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

        }

      });

    }

  }

}