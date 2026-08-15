import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css'
})
export class StudentDetails {

  @Input()
  student: any;

  @Output()
  close = new EventEmitter<void>();

}