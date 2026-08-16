import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

private API = "https://veerush-academy-backend.vercel.app/api/auth";
  // ==========================
  // Register
  // ==========================

  register(userData: any): Observable<any> {
    return this.http.post<any>(
      `${this.API}/register`,
      userData
    );
  }

  // ==========================
  // Login
  // ==========================

  login(userData: any): Observable<any> {
    return this.http.post<any>(
      `${this.API}/login`,
      userData
    );
  }

  // ==========================
  // Profile
  // ==========================

  getProfile(): Observable<any> {

    return this.http.get<any>(
      `${this.API}/profile`
    );

  }

  // ==========================
  // Logout
  // ==========================

  logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

  }

  // ==========================
  // Get Token
  // ==========================

  getToken(): string | null {

    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );

  }

  // ==========================
  // Get Logged User
  // ==========================

  getUser() {

    const user =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return user ? JSON.parse(user) : null;

  }

  // ==========================
  // Logged In?
  // ==========================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

}