import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/studentss';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css'
})
export class StudentCard {

  @Input({ required: true })
  student!: Student;

  @Output()
  view = new EventEmitter<Student>();

  @Output()
  edit = new EventEmitter<Student>();

  @Output()
  delete = new EventEmitter<string>();

  openStudent(student: Student) {
    this.view.emit(student);
  }

  editStudent(student: Student) {
    this.edit.emit(student);
  }

  deleteStudent(id: string | undefined) {

    if (!id) return;

    if (confirm('Delete this student?')) {
      this.delete.emit(id);
    }

  }

}