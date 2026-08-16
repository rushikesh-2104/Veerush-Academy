import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Attendance {

private apiUrl = 'https://veerush-academy-backend.vercel.app/api/attendance';
private usersUrl = 'https://veerush-academy-backend.vercel.app/api/users';

  constructor(
    private http: HttpClient
  ) {}

  // Common Headers
  private getHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  // ==========================
  // Get All Students
  // ==========================

  getStudents(): Observable<any> {

    return this.http.get(
      this.usersUrl,
      this.getHeaders()
    );

  }

  // ==========================
  // Mark Attendance
  // ==========================

  markAttendance(data: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data,
      this.getHeaders()
    );

  }

  // ==========================
// Get Student Attendance
// ==========================

getStudentAttendance(studentId: string): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/student/${studentId}`,
    this.getHeaders()
  );

}
  

}