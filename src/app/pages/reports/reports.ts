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

  // ==========================================
  // Services
  // ==========================================

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

    this.attendanceService
      .getStudents()
      .subscribe({

        next: (res: any) => {

          console.log(
            'STUDENTS FROM BACKEND:',
            res
          );

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
          student._id ===
          this.selectedStudentId
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

      console.warn(
        'Please select student, week start and week end'
      );

      return;

    }


    // Prevent invalid date range

    if (
      this.weekStart >
      this.weekEnd
    ) {

      console.warn(
        'Week start cannot be after week end'
      );

      return;

    }


    this.loading = true;


    // Clear previous data

    this.attendanceRecords = [];

    this.weeklyClasses = [];

    this.weeklyTests = [];

    this.fee = null;

    this.savedReport = null;


    // Load all report sections

    this.loadAttendance();

    this.loadClasses();

    this.loadTests();

    this.loadFee();

    this.loadSavedReport();


    // UI loading state

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

          console.log(
            'ATTENDANCE FROM BACKEND:',
            res
          );


          const records =
            res?.records ||
            res?.data ||
            [];


          console.log(
            'ALL ATTENDANCE RECORDS:',
            records
          );


          console.log(
            'ATTENDANCE DATES:',
            records.map(
              (record: any) => ({
                date: record.date,
                status: record.status
              })
            )
          );


          this.attendanceRecords =
            records.filter(
              (record: any) =>
                this.isDateInSelectedWeek(
                  record.date
                )
            );


          console.log(
            'FILTERED ATTENDANCE:',
            this.attendanceRecords
          );

        },

        error: (error) => {

          console.error(
            'Attendance error',
            error
          );

          this.attendanceRecords = [];

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

          console.log(
            'ALL CLASSES FROM BACKEND:',
            res
          );


          const classes =
            res?.data ||
            res ||
            [];


          console.log(
            'SELECTED WEEK:',
            this.weekStart,
            this.weekEnd
          );


          console.log(
            'CLASS DATES:',
            classes.map(
              (item: any) => ({
                date: item.date,
                subject: item.subject,
                topic: item.topic,
                course: item.course,
                standard: item.standard
              })
            )
          );


          this.weeklyClasses =
            classes.filter(
              (item: any) =>
                this.isDateInSelectedWeek(
                  item.date
                )
            );


          console.log(
            'FILTERED WEEKLY CLASSES:',
            this.weeklyClasses
          );

        },

        error: (error) => {

          console.error(
            'Classes error',
            error
          );

          this.weeklyClasses = [];

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

          console.log(
            'WEEKLY TESTS FROM BACKEND:',
            res
          );


          const tests =
            res?.data ||
            res ||
            [];


          console.log(
            'TEST DATES:',
            tests.map(
              (test: any) => ({
                testDate: test.testDate,
                title: test.title,
                obtainedMarks:
                  test.obtainedMarks,
                totalMarks:
                  test.totalMarks
              })
            )
          );


          this.weeklyTests =
            tests.filter(
              (test: any) =>
                this.isDateInSelectedWeek(
                  test.testDate
                )
            );


          console.log(
            'FILTERED WEEKLY TESTS:',
            this.weeklyTests
          );

        },

        error: (error) => {

          console.error(
            'Tests error',
            error
          );

          this.weeklyTests = [];

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

          console.log(
            'FEE FROM BACKEND:',
            res
          );


          this.fee =
            res?.data ||
            null;

        },

        error: (error) => {

          console.error(
            'Fee error',
            error
          );

          this.fee = null;

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

          console.log(
            'SAVED WEEKLY REPORT:',
            res
          );


          this.savedReport =
            res?.data ||
            null;


          if (this.savedReport) {

            this.teacherNotes =
              this.savedReport.teacherNotes ||
              '';


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

          this.savedReport = null;

        }

      });

  }


  // ==========================================
  // Save Teacher Report
  // ==========================================

  saveReport(): void {

    if (
      !this.selectedStudentId ||
      !this.weekStart ||
      !this.weekEnd
    ) {

      console.warn(
        'Cannot save report without student and week'
      );

      return;

    }


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


    console.log(
      'SAVING WEEKLY REPORT:',
      data
    );


    // ==========================================
    // Update Existing Report
    // ==========================================

    if (
      this.savedReport?._id
    ) {

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

          next: (res: any) => {

            console.log(
              'REPORT UPDATED:',
              res
            );


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


    // ==========================================
    // Create New Report
    // ==========================================

    this.reportService
      .createReport(data)
      .subscribe({

        next: (res: any) => {

          console.log(
            'REPORT CREATED:',
            res
          );


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

    if (
      !date ||
      !this.weekStart ||
      !this.weekEnd
    ) {

      return false;

    }


    // ------------------------------------------
    // Convert date into YYYY-MM-DD
    // ------------------------------------------

    const getDateOnly = (
      value: string
    ): string => {

      const d =
        new Date(value);


      if (
        isNaN(
          d.getTime()
        )
      ) {

        return '';

      }


      const year =
        d.getFullYear();


      const month =
        String(
          d.getMonth() + 1
        ).padStart(
          2,
          '0'
        );


      const day =
        String(
          d.getDate()
        ).padStart(
          2,
          '0'
        );


      return `${year}-${month}-${day}`;

    };


    const currentDate =
      getDateOnly(date);


    const startDate =
      this.weekStart;


    const endDate =
      this.weekEnd;


    return (
      currentDate >= startDate &&
      currentDate <= endDate
    );

  }


  // ==========================================
  // Attendance Helpers
  // ==========================================

  get presentCount(): number {

    return this.attendanceRecords
      .filter(
        x =>
          x.status ===
          'Present'
      )
      .length;

  }


  get absentCount(): number {

    return this.attendanceRecords
      .filter(
        x =>
          x.status ===
          'Absent'
      )
      .length;

  }


  get lateCount(): number {

    return this.attendanceRecords
      .filter(
        x =>
          x.status ===
          'Late'
      )
      .length;

  }


  get leaveCount(): number {

    return this.attendanceRecords
      .filter(
        x =>
          x.status ===
          'Leave'
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

    if (
      !test ||
      !test.totalMarks
    ) {

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
  // Topics
  // ==========================================

  get topicsCovered(): any[] {

    return this.weeklyClasses
      .filter(
        (item: any) =>
          item.topic
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