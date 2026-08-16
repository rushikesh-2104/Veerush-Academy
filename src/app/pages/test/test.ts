import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestForm } from '../test-form/test-form';
import { WeeklyTestService } from '../../services/weekly-test-service';


@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TestForm
  ],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test implements OnInit {

  // ==========================
  // Data
  // ==========================

  tests: any[] = [];
  filteredTests: any[] = [];

  loading = false;

  searchText = '';

  // ==========================
  // Dashboard Stats
  // ==========================

  totalTests = 0;
  averageMarks = 0;
  highestMarks = 0;
  passedStudents = 0;

  // ==========================
  // Modal
  // ==========================

  showTestModal = false;

  // ==========================
  // Selected Test
  // ==========================

  selectedTest: any = null;

  constructor(
    private weeklyTestService: WeeklyTestService
  ) {}

  ngOnInit(): void {

    this.loadTests();

  }

  // ==========================
  // Load Tests
  // ==========================

  loadTests() {

    this.loading = true;

    this.weeklyTestService
      .getTests()
      .subscribe({

        next: (res: any) => {

          

          this.loading = false;

          this.tests = res.data || [];
          this.filteredTests = [...this.tests];

          this.calculateStats();

        },

        error: (err) => {

          this.loading = false;

          console.log(err);

        }

      });

  }

    // ==========================
  // Search
  // ==========================

  searchTests() {

    if (!this.searchText.trim()) {

      this.filteredTests = this.tests;

      return;

    }

    const text = this.searchText.toLowerCase();

    this.filteredTests = this.tests.filter(test =>

      test.student?.fullName?.toLowerCase().includes(text) ||

      test.course?.name?.toLowerCase().includes(text) ||

      test.title?.toLowerCase().includes(text)

    );

  }

  // ==========================
  // Dashboard Stats
  // ==========================

  calculateStats() {

    if (!Array.isArray(this.tests)) {

      this.tests = [];

    }

    this.totalTests = this.tests.length;

    this.highestMarks = this.tests.reduce(

      (max, test) =>

        Math.max(

          max,

          Math.round(
            (test.obtainedMarks / test.totalMarks) * 100
          )

        ),

      0

    );

    this.averageMarks = this.tests.length

      ? Math.round(

          this.tests.reduce(

            (sum, test) =>

              sum +

              Math.round(
                (test.obtainedMarks / test.totalMarks) * 100
              ),

            0

          ) / this.tests.length

        )

      : 0;

    this.passedStudents = this.tests.filter(

      test => this.getPercentage(test) >= 40

    ).length;

  }

  // ==========================
  // Percentage
  // ==========================

  getPercentage(test: any): number {

    if (!test.totalMarks) {

      return 0;

    }

    return Math.round(

      (test.obtainedMarks / test.totalMarks) * 100

    );

  }

  // ==========================
  // Result
  // ==========================

  getResult(test: any): string {

    const percentage = this.getPercentage(test);

    if (percentage >= 90) {

      return 'Excellent ⭐';

    }

    if (percentage >= 75) {

      return 'Very Good 🎉';

    }

    if (percentage >= 60) {

      return 'Good 👍';

    }

    if (percentage >= 40) {

      return 'Pass ✅';

    }

    return 'Needs Improvement ❌';

  }

  // ==========================
  // Result Color
  // ==========================

  getResultClass(test: any): string {

    const percentage = this.getPercentage(test);

    if (percentage >= 90) {

      return 'text-green-600 bg-green-100';

    }

    if (percentage >= 75) {

      return 'text-blue-600 bg-blue-100';

    }

    if (percentage >= 60) {

      return 'text-yellow-600 bg-yellow-100';

    }

    if (percentage >= 40) {

      return 'text-orange-600 bg-orange-100';

    }

    return 'text-red-600 bg-red-100';

  }

    // ==========================
  // Open Add Modal
  // ==========================

  openTestModal() {

    this.selectedTest = null;

    this.showTestModal = true;

  }

  // ==========================
  // Edit Test
  // ==========================

  editTest(test: any) {

    this.selectedTest = test;

    this.showTestModal = true;

  }

  // ==========================
  // Close Modal
  // ==========================

  closeTestModal() {

    this.showTestModal = false;

    this.selectedTest = null;

  }

  // ==========================
  // Refresh After Save
  // ==========================

  saveTest() {

    this.closeTestModal();

    this.loadTests();

  }

  // ==========================
  // Delete Test
  // ==========================

  deleteTest(id: string) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this test?'
    );

    if (!confirmDelete) {

      return;

    }

    this.weeklyTestService
      .deleteTest(id)
      .subscribe({

        next: (res: any) => {

          

          this.loadTests();

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}