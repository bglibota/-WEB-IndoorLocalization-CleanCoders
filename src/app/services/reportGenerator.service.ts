import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AssetPositionHistoryGET, AssetPositionHistoryPOST } from '../models/AssetPositionHistory';
import { firstValueFrom } from 'rxjs';  
@Injectable({
    providedIn: 'root'
})
export class ReportGeneratorService {



    constructor(private http: HttpClient, private apiService: ApiService) { }

    async getHeatmapReportData(
        startDate: string,
        endDate: string,
        startTime: string,
        endTime: string
    ): Promise<AssetPositionHistoryGET[]> {
        const url = `${this.apiService.getApiURL()}HeatmapReport/GetAssetPositionHistoryByDateRangeAndTimeRange/${startDate}/${endDate}/${startTime}/${endTime}`;

        try {
            const response = await this.http.get<AssetPositionHistoryGET[]>(url).toPromise();
            var AssetPositionHistorylist: AssetPositionHistoryGET[] = [];
            if (response != null) {

                response.forEach((element: any) => {
                    const assetPosition: AssetPositionHistoryGET = {
                        id: element.id,
                        x: element.x,
                        y: element.y,
                        dateTime: element.dateTime,
                        floorMapId: element.floorMapId,
                        assetId: element.assetId,
                        floorMapName: element.floorMapName,
                        assetName: element.assetName
                    };

                    AssetPositionHistorylist.push(assetPosition);
                });
            }
            return AssetPositionHistorylist;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async addHeatmapReportData(AssetPositionHistoryPOST: AssetPositionHistoryPOST): Promise<void> {
        const url = `${this.apiService.getApiURL()}HeatmapReport/AddAssetPositionHistory`;
    
        try {
            const response = await firstValueFrom(this.http.post(url, AssetPositionHistoryPOST));
            console.log('successfully:', response); 
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}