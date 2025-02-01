import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FloorMap } from '../models/FloorMap';

@Injectable({
  providedIn: 'root'
})
export class FloormapService {

   constructor(private http: HttpClient, private apiService: ApiService) { }

    async getAllFloormap(): Promise<FloorMap[]> {
      const url = `${this.apiService.getApiURL()}/api/FloorMap/GetAllFloorMapsWithoutAssetHistories`;
  
      try {
        const response = await fetch(url);
        const data = await response.json();
        let floorMapList: FloorMap[] = [];
        data.forEach((element: any) => {
          const floorMap: FloorMap = {
            Id: element.id,
            Name: element.name,
            Image: element.image
          };
          floorMapList.push(floorMap);
        });
        return floorMapList;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
}
}
