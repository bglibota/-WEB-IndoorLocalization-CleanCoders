import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the type of the data you'll be working with
export interface FloorMap {
  id: number;
  name: string;
  image: string; // Base64 string
}

@Injectable({
  providedIn: 'root',
})
export class FloorMapService {
  private apiUrl = 'https://localhost:7197/api/FloorMap'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getFloorMaps(): Observable<FloorMap[]> {
    return this.http.get<FloorMap[]>(this.apiUrl);
  }

  getFloorMapById(id: number): Observable<FloorMap> {
    return this.http.get<FloorMap>(`${this.apiUrl}/${id}`);
  }
}
