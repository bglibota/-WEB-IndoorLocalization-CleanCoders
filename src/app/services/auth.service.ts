import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private apiService:ApiService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiService.getApiURL()}/api/User/Login`, { username, password });
  }

  register(userData: { username: string, password: string, name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiService.getApiURL()}/api/User/Register`, userData);
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }
}
