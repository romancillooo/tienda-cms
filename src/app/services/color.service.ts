import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Color } from '../models/color.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = `${environment.apiHost}${environment.apiColors}`;

  constructor(private http: HttpClient) {}

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiUrl);
  }

  getColor(id: number): Observable<Color> {
    return this.http.get<Color>(`${this.apiUrl}/${id}`);
  }

  createColor(color: Color): Observable<Color> {
    return this.http.post<Color>(this.apiUrl, color);
  }

  updateColor(id: number, color: Color): Observable<Color> {
    return this.http.put<Color>(`${this.apiUrl}/${id}`, color);
  }

  deleteColor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
