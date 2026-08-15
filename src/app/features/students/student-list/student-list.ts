import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StudentForm } from '../student-form/student-form';
import { StudentDetails } from '../student-details/student-details';

import { users } from '../../../services/users';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StudentForm,
    StudentDetails
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {

  constructor(
    private userService: users
  ) {}

  students: any[] = [];

  searchText = '';

  // ==========================
  // Add / Edit Modal
  // ==========================

  showAddStudentModal = false;

  selectedStudentForEdit: any = null;

  // ==========================
  // Student Details
  // ==========================

  showStudentDetails = false;

  selectedStudent: any = null;

  // ==========================
  // Init
  // ==========================

  ngOnInit(): void {

    this.loadStudents();

  }

  // ==========================
  // Load Students
  // ==========================

  loadStudents() {

    this.userService.getUsers().subscribe({

      next: (res: any) => {

        this.students = res.data;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ==========================
  // Search
  // ==========================

  get filteredStudents() {

    return this.students.filter(student =>

      student.fullName
        ?.toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  // ==========================
  // Add Student
  // ==========================

  openAddStudentModal() {

    this.selectedStudentForEdit = null;

    this.showAddStudentModal = true;

  }

  closeAddStudentModal() {

    this.showAddStudentModal = false;

    this.selectedStudentForEdit = null;

  }

  studentAdded() {

    this.closeAddStudentModal();

    this.loadStudents();

  }

  // ==========================
  // Edit Student
  // ==========================

  editStudent(student: any) {

    this.selectedStudentForEdit = student;

    this.showAddStudentModal = true;

  }

  // ==========================
  // Delete Student
  // ==========================

  deleteStudent(id: string) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmDelete) {

      return;

    }

    this.userService.deleteUser(id).subscribe({

      next: () => {

        alert("Student Deleted Successfully");

        this.loadStudents();

      },

      error: (err) => {

        console.log(err);

        alert("Unable to delete student");

      }

    });

  }

  // ==========================
  // Student Details
  // ==========================

  openStudent(student: any) {

    this.selectedStudent = student;

    this.showStudentDetails = true;

  }

  closeStudentDetails() {

    this.showStudentDetails = false;

    this.selectedStudent = null;

  }

}