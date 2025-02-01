import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Zone {
  id: number;
  name: string;
  points: { x: number; y: number; ordinalNumber: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = 'https://localhost:7197/Zone'; // Base API endpoint for zones

  constructor(private http: HttpClient) {}

  // Method to fetch all zones or filter by FloormapId
  getAllZones(floormapId?: number): Observable<Zone[]> {
    let params = new HttpParams();

    if (floormapId) {
      params = params.set('floormapId', floormapId.toString());
    }

    return this.http.get<Zone[]>(`${this.apiUrl}/GetAllZones`, { params });
  }

  // Method to update a zone
  updateZone(zone: Zone): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateZone/${zone.id}`, zone);
  }

  // Method to delete a zone
  deleteZone(zoneId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteZone/${zoneId}`);
  }

  // Method to save a new zone
  saveZone(zone: Zone): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/CreateZone`, zone);
  }
}
