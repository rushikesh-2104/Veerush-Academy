import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeklyTestService {

  private api = 'http://localhost:5000/api/tests';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // Get All Tests
  // ==========================

  getTests(): Observable<any> {

    return this.http.get<any>(
      this.api
    );

  }

  // ==========================
  // Get Student Tests
  // ==========================

  getStudentTests(
    studentId: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}`
    );

  }

  // ==========================
  // Get Upcoming Test By Student
  // ==========================

  getUpcomingTest(
    studentId: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}/upcoming`
    );

  }

  // ==========================
  // Get Latest Result By Student
  // ==========================

  getLatestResult(
    studentId: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}/latest`
    );

  }

  // ==========================
  // Get Single Test
  // ==========================

  getTest(
    id: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/${id}`
    );

  }

  // ==========================
  // Create Test
  // ==========================

  createTest(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      this.api,
      data
    );

  }

  // ==========================
  // Update Test
  // ==========================

  updateTest(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.api}/${id}`,
      data
    );

  }

  // ==========================
  // Delete Test
  // ==========================

  deleteTest(
    id: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

}