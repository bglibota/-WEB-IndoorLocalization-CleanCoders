import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Zone {
  name: string;
  points: { x: number; y: number; ordinalNumber: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = 'https://localhost:7197/Zone/GetAllZones'; // API endpoint za zone

  constructor(private http: HttpClient) {}

  // Metoda za dohvaćanje svih zona
  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.apiUrl);
  }
}
