import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Point {
  x: number;
  y: number;
  ordinalNumber: number;
}

interface Zone {
  id: number;
  name: string;
  points: Point[];
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = 'http://localhost:5039/Zone';

  constructor(private http: HttpClient) {}

  getAllZones(floormapId?: number): Observable<Zone[]> {
    let params = new HttpParams();
    if (floormapId) {
      params = params.set('floormapId', floormapId.toString());
    }
    return this.http.get<Zone[]>(`${this.apiUrl}/GetAllZones`, { params });
  }

  saveZone(zone: Zone): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/CreateZone`, zone);
  }

  updateZone(zone: Zone): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateZone/${zone.id}`, zone);
  }

  deactivateZone(zone: Zone): Observable<void> {
    zone.isActive = false;
    return this.http.put<void>(`${this.apiUrl}/UpdateZone/${zone.id}`, zone);
  }
}
