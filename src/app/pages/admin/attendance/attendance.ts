import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Attendance } from '../../../services/attendanceService';


@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class AttendanceComponent implements OnInit {

  attendanceForm: FormGroup;

  students: any[] = [];

  attendanceData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private attendanceService: Attendance
  ) {

    this.attendanceForm = this.fb.group({

      date: [new Date().toISOString().substring(0, 10)],

      standard: [''],

      batch: ['']

    });

  }

  ngOnInit(): void {

    this.loadStudents();

  }

  // ==========================
  // Load Students
  // ==========================

  loadStudents() {

    this.attendanceService.getStudents().subscribe({

      next: (res: any) => {

        this.students = res.data || [];

        this.attendanceData = this.students.map((student: any) => ({

          ...student,

          status: 'Present',

          remarks: ''

        }));

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ==========================
  // Save Attendance
  // ==========================

  saveAttendance() {

    const selectedDate = this.attendanceForm.value.date;

    this.attendanceData.forEach((student: any) => {

      const attendance = {

        student: student._id,

        date: selectedDate,

        status: student.status,

        remarks: student.remarks

      };

      this.attendanceService.markAttendance(attendance).subscribe({

        next: () => {

          console.log(`${student.fullName} Attendance Saved`);

        },

        error: (err) => {

          console.log(err);

        }

      });

    });

    alert("Attendance Saved Successfully");

  }

}