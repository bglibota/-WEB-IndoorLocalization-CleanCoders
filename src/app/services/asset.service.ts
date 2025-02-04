import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset, CreateAssetRequest } from '../models/asset.model';
import { FloorMap } from '../models/floor-map.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = this.apiService.getApiURL()+'/api/Assets';

  constructor(private http: HttpClient, private apiService:ApiService) { }

  getAllAssets() : Observable<Asset[]>{
    return this.http.get<Asset[]>(`${this.apiUrl}/GetAllAssets`);
  }

  getAsset(id: number) : Observable<Asset>{
    return this.http.get<Asset>(`${this.apiUrl}/GetAsset/${id}`);
  }

  addAsset(asset: CreateAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(`${this.apiUrl}/AddAsset`, asset);
}


  updateAsset(asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/UpdateAsset/${asset.id}`, asset);
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAsset/${id}`);
  }

  getFloorMap(id: number): Observable<FloorMap> {
    return this.http.get<FloorMap>(`http://localhost:5039/api/FloorMap/GetFloorMap/${id}`);
  }

  getAssetPositionHistory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/GetPositionHistory`);
  }
}
