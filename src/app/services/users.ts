import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class users {

  private API = "https://veerush-academy-backend.vercel.app/api/users";

  constructor(
    private http: HttpClient
  ) {}

  getUsers(): Observable<any> {
    return this.http.get(this.api);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  changeStatus(id: string, status: boolean): Observable<any> {
    return this.http.patch(`${this.api}/${id}/status`, {
      isActive: status
    });
  }
getStudents(): Observable<any[]> {

  return this.http.get<any>(this.api).pipe(

    map(res => res.data)

  );

}}