import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Buddy } from '../models/buddy.model';

@Injectable({
  providedIn: 'root',
})
export class BuddyService {

  private apiUrl = 'https://veerush-academy-backend.vercel.app/api/buddy';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // Get All Buddy Messages
  // ==========================

  getBuddyMessages(): Observable<any> {

    return this.http.get<any>(this.apiUrl);

  }

  // ==========================
  // Create Buddy Message
  // ==========================

  createBuddy(data: Buddy): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      data
    );

  }

  // ==========================
  // Update Buddy Message
  // ==========================

  updateBuddy(
    id: string,
    data: Buddy
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      data
    );

  }

  // ==========================
  // Delete Buddy Message
  // ==========================

  deleteBuddy(id: string): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );

  }

}