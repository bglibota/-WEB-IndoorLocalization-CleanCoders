import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AssetPositionHistoryGET, AssetPositionHistoryPOST } from '../models/AssetPositionHistory';
@Injectable({
    providedIn: 'root'
})
export class ReportGeneratorService {

    heatmapReportDataList:AssetPositionHistoryGET[] = [];


    constructor(private http: HttpClient, private apiService: ApiService) { }

    

    async getHeatmapReportData(
        startDate: String,
        endDate: String,
        startTime: String,
        endTime: String
    ): Promise<AssetPositionHistoryGET[]> {
        if(this.heatmapReportDataList.length>0){
            return this.heatmapReportDataList;
        }
        const url = `${this.apiService.getApiURL()}/HeatmapReport/GetAssetPositionHistoryByDateRangeAndTimeRange/${startDate}/${endDate}/${startTime}/${endTime}`;

        try {
            console.log("params:", startDate, endDate, startTime, endTime);
            const response = await fetch(url);

 
    const data = await response.json();  

    let AssetPositionHistorylist: AssetPositionHistoryGET[] = [];
  
        data.forEach((element: any) => {
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
        
            return AssetPositionHistorylist;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    async addHeatmapReportData(AssetPositionHistoryPOST: AssetPositionHistoryPOST): Promise<void> {
        const url = `${this.apiService.getApiURL()}/HeatmapReport/AddAssetPositionHistory`;
    
        try {
            const response = await this.http.post(url, AssetPositionHistoryPOST).toPromise();
            console.log('successfully:', response); 
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    
}