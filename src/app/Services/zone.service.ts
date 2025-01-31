import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Method to fetch all zones or filter by FloormapId
  getAllZones(floormapId?: number): Observable<Zone[]> {
    let params = new HttpParams();

    // If a FloormapId is provided, add it to the query params
    if (floormapId) {
      params = params.set('floormapId', floormapId.toString());
    }

    // Make the HTTP request, passing any query parameters
    return this.http.get<Zone[]>(this.apiUrl, { params });
  }
}
