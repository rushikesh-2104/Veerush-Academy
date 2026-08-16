import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private api = 'https://veerush-academy-backend.vercel.app/api/fees';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // Get All Fees
  // ==========================

  getFees(): Observable<any[]> {

    return this.http.get<any[]>(this.api);

  }

  // ==========================
  // Get Fee By Student
  // ==========================

  getStudentFee(studentId: string): Observable<any> {

    return this.http.get<any>(
      `${this.api}/student/${studentId}`
    );

  }

  // ==========================
  // Create Fee
  // ==========================

  createFee(data: any): Observable<any> {

    return this.http.post<any>(
      this.api,
      data
    );

  }

  // ==========================
  // Update Fee
  // ==========================

  updateFee(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.api}/${id}`,
      data
    );

  }

  // ==========================
  // Delete Fee
  // ==========================

  deleteFee(id: string): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );

  }

  // ==========================
  // Receive Payment
  // ==========================

  receivePayment(
    feeId: string,
    payment: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.api}/${feeId}/payment`,
      payment
    );

  }

  // ==========================
  // Get Payment History
  // ==========================

  getPaymentHistory(
    feeId: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/${feeId}/payments`
    );

  }

  // ==========================
  // Get Installments
  // ==========================

  getInstallments(
    feeId: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/${feeId}/installments`
    );

  }

}