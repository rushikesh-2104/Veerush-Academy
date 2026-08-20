import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Attendance } from '../../services/attendanceService';
import { ClassService } from '../../services/classService';
import { WeeklyTestService } from '../../services/weekly-test-service';
import { FeeService } from '../../services/feeService';
import { WeeklyReportService } from '../../services/weekly-report';



@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  private attendanceService = inject(Attendance);
  private classService = inject(ClassService);
  private weeklyTestService = inject(WeeklyTestService);
  private feeService = inject(FeeService);
  private reportService = inject(WeeklyReportService);

  // ==========================================
  // Students
  // ==========================================

  students: any[] = [];

  selectedStudentId = '';

  selectedStudent: any = null;


  // ==========================================
  // Week
  // ==========================================

  weekStart = '';

  weekEnd = '';


  // ==========================================
  // Report Data
  // ==========================================

  attendanceRecords: any[] = [];

  weeklyClasses: any[] = [];

  weeklyTests: any[] = [];

  fee: any = null;

  savedReport: any = null;


  // ==========================================
  // Teacher Input
  // ==========================================

  teacherNotes = '';

  overallProgress = 'Good';


  // ==========================================
  // Loading
  // ==========================================

  loading = false;


  // ==========================================
  // Init
  // ==========================================

  ngOnInit(): void {

    this.loadStudents();

  }


  // ==========================================
  // Load Students
  // ==========================================

  loadStudents(): void {

    this.attendanceService.getStudents()
      .subscribe({

        next: (res: any) => {

          this.students =
            res?.data ||
            res ||
            [];

        },

        error: (error) => {

          console.error(
            'Failed to load students',
            error
          );

        }

      });

  }


  // ==========================================
  // Student Changed
  // ==========================================

  onStudentChange(): void {

    this.selectedStudent =
      this.students.find(
        student =>
          student._id === this.selectedStudentId
      );

    this.clearReportData();

  }


  // ==========================================
  // Generate Weekly Report
  // ==========================================

  generateReport(): void {

    if (
      !this.selectedStudentId ||
      !this.weekStart ||
      !this.weekEnd
    ) {

      return;

    }

    this.loading = true;

    this.loadAttendance();
    this.loadClasses();
    this.loadTests();
    this.loadFee();
    this.loadSavedReport();

    setTimeout(() => {

      this.loading = false;

    }, 500);

  }


  // ==========================================
  // Attendance
  // ==========================================

  private loadAttendance(): void {

    this.attendanceService
      .getStudentAttendance(
        this.selectedStudentId
      )
      .subscribe({

        next: (res: any) => {

          const records =
            res?.records || [];

          this.attendanceRecords =
            records.filter(
              (record: any) =>
                this.isDateInSelectedWeek(
                  record.date
                )
            );

        },

        error: (error) => {

          console.error(
            'Attendance error',
            error
          );

        }

      });

  }


  // ==========================================
  // Classes / Topics
  // ==========================================

  private loadClasses(): void {

    this.classService
      .getClasses()
      .subscribe({

        next: (res: any) => {

          const classes =
            res?.data || [];

          this.weeklyClasses =
            classes.filter(
              (item: any) =>
                this.isDateInSelectedWeek(
                  item.date
                )
            );

        },

        error: (error) => {

          console.error(
            'Classes error',
            error
          );

        }

      });

  }


  // ==========================================
  // Weekly Tests
  // ==========================================

  private loadTests(): void {

    this.weeklyTestService
      .getStudentTests(
        this.selectedStudentId
      )
      .subscribe({

        next: (res: any) => {

          const tests =
            res?.data || [];

          this.weeklyTests =
            tests.filter(
              (test: any) =>
                this.isDateInSelectedWeek(
                  test.testDate
                )
            );

        },

        error: (error) => {

          console.error(
            'Tests error',
            error
          );

        }

      });

  }


  // ==========================================
  // Fees
  // ==========================================

  private loadFee(): void {

    this.feeService
      .getStudentFee(
        this.selectedStudentId
      )
      .subscribe({

        next: (res: any) => {

          this.fee =
            res?.data || null;

        },

        error: (error) => {

          console.error(
            'Fee error',
            error
          );

        }

      });

  }


  // ==========================================
  // Saved Teacher Report
  // ==========================================

  private loadSavedReport(): void {

    this.reportService
      .getWeeklyReport(
        this.selectedStudentId,
        this.weekStart,
        this.weekEnd
      )
      .subscribe({

        next: (res: any) => {

          this.savedReport =
            res?.data || null;

          if (this.savedReport) {

            this.teacherNotes =
              this.savedReport.teacherNotes || '';

            this.overallProgress =
              this.savedReport.overallProgress ||
              'Good';

          }

        },

        error: (error) => {

          console.error(
            'Weekly report error',
            error
          );

        }

      });

  }


  // ==========================================
  // Save Teacher Report
  // ==========================================

  saveReport(): void {

    const data = {

      student:
        this.selectedStudentId,

      weekStart:
        this.weekStart,

      weekEnd:
        this.weekEnd,

      teacherNotes:
        this.teacherNotes,

      overallProgress:
        this.overallProgress

    };


    if (this.savedReport?._id) {

      this.reportService
        .updateReport(
          this.savedReport._id,
          {
            teacherNotes:
              this.teacherNotes,

            overallProgress:
              this.overallProgress
          }
        )
        .subscribe({

          next: (res) => {

            this.savedReport =
              res?.data;

          },

          error: (error) => {

            console.error(
              'Update report error',
              error
            );

          }

        });

      return;

    }


    this.reportService
      .createReport(data)
      .subscribe({

        next: (res) => {

          this.savedReport =
            res?.data;

        },

        error: (error) => {

          console.error(
            'Create report error',
            error
          );

        }

      });

  }


  // ==========================================
  // Date Helper
  // ==========================================

  private isDateInSelectedWeek(
    date: string
  ): boolean {

    const current =
      new Date(date);

    const start =
      new Date(this.weekStart);

    const end =
      new Date(this.weekEnd);

    start.setHours(0, 0, 0, 0);

    end.setHours(
      23,
      59,
      59,
      999
    );

    return (
      current >= start &&
      current <= end
    );

  }


  // ==========================================
  // Attendance Helpers
  // ==========================================

  get presentCount(): number {

    return this.attendanceRecords
      .filter(
        x => x.status === 'Present'
      )
      .length;

  }


  get absentCount(): number {

    return this.attendanceRecords
      .filter(
        x => x.status === 'Absent'
      )
      .length;

  }


  get attendancePercentage(): number {

    if (
      this.attendanceRecords.length === 0
    ) {

      return 0;

    }

    return Math.round(
      (
        this.presentCount /
        this.attendanceRecords.length
      ) * 100
    );

  }


  // ==========================================
  // Test Percentage
  // ==========================================

  getTestPercentage(
    test: any
  ): number {

    if (!test.totalMarks) {

      return 0;

    }

    return Math.round(
      (
        test.obtainedMarks /
        test.totalMarks
      ) * 100
    );

  }


  // ==========================================
  // Clear
  // ==========================================

  private clearReportData(): void {

    this.attendanceRecords = [];

    this.weeklyClasses = [];

    this.weeklyTests = [];

    this.fee = null;

    this.savedReport = null;

    this.teacherNotes = '';

    this.overallProgress = 'Good';

  }

}