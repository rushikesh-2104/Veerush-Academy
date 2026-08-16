import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Homework } from '../models/homework.model';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  private apiUrl = 'https://veerush-academy-backend.vercel.app/api/homework';

  constructor(
    private http: HttpClient
  ) {}

  // Get All Homework
  getHomework(): Observable<Homework[]> {

    return this.http.get<Homework[]>(this.apiUrl);

  }

  // Get Homework By Student
  getHomeworkByStudent(studentId: string): Observable<Homework[]> {

    return this.http.get<Homework[]>(
      `${this.apiUrl}/student/${studentId}`
    );

  }

  // Add Homework
  addHomework(data: Homework): Observable<Homework> {

    return this.http.post<Homework>(
      this.apiUrl,
      data
    );

  }

  // Update Homework
  updateHomework(id: string, data: Homework): Observable<Homework> {

    return this.http.put<Homework>(
      `${this.apiUrl}/${id}`,
      data
    );

  }

  // Delete Homework
  deleteHomework(id: string) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}