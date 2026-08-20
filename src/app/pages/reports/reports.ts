import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Attendance } from '../../services/attendanceService';
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

          this.students = [];

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
      ) || null;

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

    this.weeklyTests = [];

    this.fee = null;

    this.savedReport = null;

    // Load report sections

    this.loadAttendance();

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

          const records =
            res?.records ||
            res?.data ||
            [];

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

          this.attendanceRecords = [];

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
            res?.data ||
            res ||
            [];

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
  // Generate Parent PDF
  // ==========================================

  generatePDF(): void {

    if (
      !this.selectedStudentId
    ) {

      console.warn(
        'Please select a student first'
      );

      return;

    }

    if (
      !this.weekStart ||
      !this.weekEnd
    ) {

      console.warn(
        'Please select week start and week end'
      );

      return;

    }

    const doc =
      new jsPDF(
        'p',
        'mm',
        'a4'
      );

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    // ==========================================
    // Colors
    // ==========================================

    const primary: [number, number, number] = [
      37,
      99,
      235
    ];

    const dark: [number, number, number] = [
      15,
      23,
      42
    ];

    const gray: [number, number, number] = [
      100,
      116,
      139
    ];

    // ==========================================
    // Student Information
    // ==========================================

    const studentName =
      this.selectedStudent?.fullName ||
      this.selectedStudent?.name ||
      'Student';

    const weekStart =
      this.formatDateForPDF(
        this.weekStart
      );

    const weekEnd =
      this.formatDateForPDF(
        this.weekEnd
      );

    // ==========================================
    // Header
    // ==========================================

    doc.setFillColor(
      primary[0],
      primary[1],
      primary[2]
    );

    doc.rect(
      0,
      0,
      pageWidth,
      48,
      'F'
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(22);

    doc.text(
      'VEERUSH ACADEMY',
      15,
      18
    );

    doc.setFontSize(10);

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.text(
      'Weekly Student Progress Report',
      15,
      26
    );

    doc.setFontSize(11);

    doc.text(
      `${weekStart} - ${weekEnd}`,
      15,
      35
    );

    // ==========================================
    // Student Details
    // ==========================================

    doc.setTextColor(
      dark[0],
      dark[1],
      dark[2]
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(18);

    doc.text(
      studentName,
      15,
      62
    );

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(10);

    doc.setTextColor(
      gray[0],
      gray[1],
      gray[2]
    );

    if (
      this.selectedStudent?.email
    ) {

      doc.text(
        `Email: ${this.selectedStudent.email}`,
        15,
        70
      );

    }

    if (
      this.selectedStudent?.phone
    ) {

      doc.text(
        `Phone: ${this.selectedStudent.phone}`,
        15,
        77
      );

    }

    // ==========================================
    // 1. Attendance
    // ==========================================

    let y = 90;

    doc.setTextColor(
      dark[0],
      dark[1],
      dark[2]
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(14);

    doc.text(
      '1. Attendance',
      15,
      y
    );

    y += 8;

    const totalClasses =
      this.attendanceRecords.length;

    const present =
      this.presentCount;

    const absent =
      this.absentCount;

    const late =
      this.lateCount;

    const leave =
      this.leaveCount;

    const percentage =
      this.attendancePercentage;

    autoTable(
      doc,
      {
        startY: y,

        head: [
          [
            'Total Classes',
            'Present',
            'Absent',
            'Late',
            'Leave',
            'Attendance'
          ]
        ],

        body: [
          [
            totalClasses,
            present,
            absent,
            late,
            leave,
            `${percentage}%`
          ]
        ],

        theme: 'grid',

        headStyles: {
          fillColor: primary,
          textColor: 255,
          fontStyle: 'bold'
        },

        styles: {
          fontSize: 9,
          cellPadding: 4
        }

      }
    );

    y =
      (doc as any)
        .lastAutoTable
        .finalY + 10;

    // ==========================================
    // Attendance Details
    // ==========================================

    if (
      this.attendanceRecords.length > 0
    ) {

      doc.setFontSize(11);

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.text(
        'Attendance Details',
        15,
        y
      );

      y += 5;

      const attendanceRows =
        [...this.attendanceRecords]
          .sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          )
          .map(
            record => [

              this.formatDateForPDF(
                record.date
              ),

              record.status,

              record.remarks ||
              '-'

            ]
          );

      autoTable(
        doc,
        {
          startY: y,

          head: [
            [
              'Date',
              'Status',
              'Remarks'
            ]
          ],

          body: attendanceRows,

          theme: 'grid',

          headStyles: {
            fillColor: primary,
            textColor: 255
          },

          styles: {
            fontSize: 9,
            cellPadding: 3
          },

          didParseCell: (
            data: any
          ) => {

            if (
              data.section === 'body' &&
              data.column.index === 1
            ) {

              const status =
                data.cell.raw;

              if (
                status === 'Absent'
              ) {

                data.cell.styles.textColor =
                  [220, 38, 38];

                data.cell.styles.fontStyle =
                  'bold';

              }

              if (
                status === 'Late'
              ) {

                data.cell.styles.textColor =
                  [234, 88, 12];

                data.cell.styles.fontStyle =
                  'bold';

              }

              if (
                status === 'Leave'
              ) {

                data.cell.styles.textColor =
                  [124, 58, 237];

              }

              if (
                status === 'Present'
              ) {

                data.cell.styles.textColor =
                  [22, 163, 74];

              }

            }

          }

        }
      );

      y =
        (doc as any)
          .lastAutoTable
          .finalY + 12;

    }

    // ==========================================
    // 2. Weekly Test Performance
    // ==========================================

    y =
      this.ensurePageSpace(
        doc,
        y,
        60
      );

    doc.setTextColor(
      dark[0],
      dark[1],
      dark[2]
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(14);

    doc.text(
      '2. Weekly Test Performance',
      15,
      y
    );

    y += 7;

    if (
      this.weeklyTests.length > 0
    ) {

      const testRows =
        this.weeklyTests.map(
          (test: any) => [

            this.formatDateForPDF(
              test.testDate
            ),

            test.title ||
            '-',

            `${test.obtainedMarks ?? 0} / ${test.totalMarks ?? 0}`,

            `${this.getTestPercentage(test)}%`,

            test.remarks ||
            '-'

          ]
        );

      autoTable(
        doc,
        {
          startY: y,

          head: [
            [
              'Date',
              'Test',
              'Marks',
              'Score',
              'Remarks'
            ]
          ],

          body: testRows,

          theme: 'grid',

          headStyles: {
            fillColor: primary,
            textColor: 255
          },

          styles: {
            fontSize: 8.5,
            cellPadding: 3
          }

        }
      );

      y =
        (doc as any)
          .lastAutoTable
          .finalY + 12;

    }

    else {

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(10);

      doc.setTextColor(
        gray[0],
        gray[1],
        gray[2]
      );

      doc.text(
        'No weekly tests were conducted during this period.',
        15,
        y
      );

      y += 12;

    }

    // ==========================================
    // 3. Fee Status
    // ==========================================

    y =
      this.ensurePageSpace(
        doc,
        y,
        55
      );

    doc.setTextColor(
      dark[0],
      dark[1],
      dark[2]
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(14);

    doc.text(
      '3. Fee Status',
      15,
      y
    );

    y += 7;

    if (this.fee) {

      autoTable(
        doc,
        {
          startY: y,

          head: [
            [
              'Course',
              'Total Fees',
              'Paid',
              'Remaining',
              'Status'
            ]
          ],

          body: [
            [

              this.fee.course ||
              '-',

              `Rs. ${this.fee.totalFees || 0}`,

              `Rs. ${this.fee.paidAmount || 0}`,

              `Rs. ${this.fee.remainingAmount || 0}`,

              this.fee.status ||
              '-'

            ]
          ],

          theme: 'grid',

          headStyles: {
            fillColor: primary,
            textColor: 255
          },

          styles: {
            fontSize: 9,
            cellPadding: 4
          }

        }
      );

      y =
        (doc as any)
          .lastAutoTable
          .finalY + 12;

    }

    else {

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(10);

      doc.setTextColor(
        gray[0],
        gray[1],
        gray[2]
      );

      doc.text(
        'No fee record found.',
        15,
        y
      );

      y += 12;

    }

    // ==========================================
    // 4. Teacher's Observation
    // ==========================================

    y =
      this.ensurePageSpace(
        doc,
        y,
        70
      );

    doc.setTextColor(
      dark[0],
      dark[1],
      dark[2]
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(14);

    doc.text(
      "4. Teacher's Observation",
      15,
      y
    );

    y += 8;

    const notes =
      this.teacherNotes?.trim() ||
      'No teacher observation added.';

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setFontSize(10);

    const noteLines =
      doc.splitTextToSize(
        notes,
        pageWidth - 30
      );

    doc.text(
      noteLines,
      15,
      y
    );

    y +=
      noteLines.length * 5 +
      10;

    // ==========================================
    // Overall Progress
    // ==========================================

    y =
      this.ensurePageSpace(
        doc,
        y,
        30
      );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(11);

    doc.text(
      `Overall Progress: ${this.overallProgress}`,
      15,
      y
    );

    // ==========================================
    // Footer
    // ==========================================

    const totalPages =
      doc.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      doc.setPage(page);

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setFontSize(8);

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.text(
        'Veerush Academy • Weekly Student Report',
        15,
        pageHeight - 10
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - 40,
        pageHeight - 10
      );

    }

    // ==========================================
    // Download PDF
    // ==========================================

    const safeName =
      studentName
        .replace(
          /[^a-zA-Z0-9]/g,
          '_'
        );

    doc.save(
      `Veerush_Weekly_Report_${safeName}_${this.weekStart}.pdf`
    );

  }

  // ==========================================
  // PDF Date Formatter
  // ==========================================

  private formatDateForPDF(
    date: string
  ): string {

    if (!date) {
      return '-';
    }

    // Already YYYY-MM-DD

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

      const parts =
        date.split('-');

      return `${parts[2]}/${parts[1]}/${parts[0]}`;

    }

    const d =
      new Date(date);

    if (
      isNaN(
        d.getTime()
      )
    ) {

      return '-';

    }

    const day =
      String(
        d.getUTCDate()
      ).padStart(
        2,
        '0'
      );

    const month =
      String(
        d.getUTCMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const year =
      d.getUTCFullYear();

    return `${day}/${month}/${year}`;

  }

  // ==========================================
  // PDF Page Safety
  // ==========================================

  private ensurePageSpace(
    doc: jsPDF,
    y: number,
    requiredSpace: number
  ): number {

    const pageHeight =
      doc.internal.pageSize.getHeight();

    if (
      y + requiredSpace >
      pageHeight - 20
    ) {

      doc.addPage();

      return 20;

    }

    return y;

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

    const getDateOnly =
      (
        value: string
      ): string => {

        if (!value) {
          return '';
        }

        // If backend already gives YYYY-MM-DD

        if (
          /^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {

          return value;

        }

        const d =
          new Date(value);

        if (
          isNaN(
            d.getTime()
          )
        ) {

          return '';

        }

        // MongoDB dates are UTC

        const year =
          d.getUTCFullYear();

        const month =
          String(
            d.getUTCMonth() + 1
          ).padStart(
            2,
            '0'
          );

        const day =
          String(
            d.getUTCDate()
          ).padStart(
            2,
            '0'
          );

        return `${year}-${month}-${day}`;

      };

    const currentDate =
      getDateOnly(date);

    return (
      currentDate >= this.weekStart &&
      currentDate <= this.weekEnd
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
  // Clear
  // ==========================================

  private clearReportData(): void {

    this.attendanceRecords = [];

    this.weeklyTests = [];

    this.fee = null;

    this.savedReport = null;

    this.teacherNotes = '';

    this.overallProgress = 'Good';

  }

}