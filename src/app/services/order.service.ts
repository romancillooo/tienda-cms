import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiHost}${environment.apiOrders}`;

  constructor(private http: HttpClient) { }

  getLatestOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/latest`);
  }
}
