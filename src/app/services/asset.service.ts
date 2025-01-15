import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = 'http://localhost:5039/api/Assets';

  constructor(private http: HttpClient) { }

  getAllAssets() : Observable<Asset[]>{
    return this.http.get<Asset[]>(`${this.apiUrl}/GetAllAssets`);
  }

  getAsset(id: number) : Observable<Asset>{
    return this.http.get<Asset>(`${this.apiUrl}/GetAsset/${id}`);
  }

  addAsset(asset : Asset) : Observable<Asset>{
    return this.http.post<Asset>(`${this.apiUrl}/AddAsset`, asset);
  }

  updateAsset(asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/UpdateAsset/${asset.id}`, asset);
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAsset/${id}`);
  }
}
