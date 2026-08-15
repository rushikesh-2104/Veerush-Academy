import { Component } from '@angular/core';
import { StudentList } from "./student-list/student-list";

@Component({
  selector: 'app-students',
  imports: [StudentList],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {

}
