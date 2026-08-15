import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClassService {

  private api = 'http://localhost:5000/api/classes';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // Get Today's Class
  // ==========================

  getTodaysClass(): Observable<any> {

    return this.http.get<any>(
      `${this.api}/today`
    );

  }

  // ==========================
// Delete Class
// ==========================

deleteClass(id: string): Observable<any> {

  return this.http.delete<any>(
    `${this.api}/${id}`
  );

}

  // ==========================
  // Get All Classes
  // ==========================

  getClasses(): Observable<any> {

    return this.http.get<any>(
      this.api
    );

  }

  // ==========================
// Update Class
// ==========================

updateClass(
  id: string,
  data: any
): Observable<any> {

  return this.http.put<any>(
    `${this.api}/${id}`,
    data
  );

}

  // ==========================
  // Create Class
  // ==========================

  createClass(data:any): Observable<any>{

    return this.http.post<any>(
      this.api,
      data
    );

  }

}