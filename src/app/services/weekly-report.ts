import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeklyReportService {

  private api =
    'https://veerush-academy-backend.vercel.app/api/reports';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // Create Weekly Report
  // ==========================================

  createReport(data: any): Observable<any> {

    return this.http.post<any>(
      this.api,
      data
    );

  }


  // ==========================================
  // Get All Reports By Student
  // ==========================================

  getStudentReports(
    studentId: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}`
    );

  }


  // ==========================================
  // Get Report By Student + Week
  // ==========================================

  getWeeklyReport(
    studentId: string,
    weekStart: string,
    weekEnd: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}/week`,
      {
        params: {
          weekStart,
          weekEnd
        }
      }
    );

  }


  // ==========================================
  // Update Weekly Report
  // ==========================================

  updateReport(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.api}/${id}`,
      data
    );

  }


  // ==========================================
  // Delete Weekly Report
  // ==========================================

  deleteReport(
    id: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

}