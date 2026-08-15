import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AnnouncementService {

  private api = 'http://localhost:5000/api/announcements';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // Get All Announcements
  // ==========================

  getAnnouncements(): Observable<any> {

    return this.http.get<any>(
      this.api
    );

  }

  // ==========================
  // Get Latest Announcements
  // ==========================

  getLatestAnnouncements(): Observable<any> {

    return this.http.get<any>(
      `${this.api}/latest`
    );

  }

  // ==========================
  // Get Single Announcement
  // ==========================

  getAnnouncement(
    id: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/${id}`
    );

  }

  // ==========================
  // Create Announcement
  // ==========================

  createAnnouncement(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      this.api,
      data
    );

  }

  // ==========================
  // Update Announcement
  // ==========================

  updateAnnouncement(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.api}/${id}`,
      data
    );

  }

  // ==========================
  // Delete Announcement
  // ==========================

  deleteAnnouncement(
    id: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

}