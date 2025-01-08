import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5039/api/User'

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, { username, password });
  }

  register(userData: { username: string, password: string, name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, userData);
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }
}
