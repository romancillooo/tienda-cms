import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiHost}${environment.apiNotifications}`;

  constructor(private http: HttpClient) { }

  getLatestNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/latest`);
  }
}
