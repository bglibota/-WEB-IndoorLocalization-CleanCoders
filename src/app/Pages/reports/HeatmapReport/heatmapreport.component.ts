import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReportGeneratorService } from '../../../services/reportGenerator.service';
import { AssetPositionHistoryGET } from '../../../models/AssetPositionHistory';
import { Router } from '@angular/router';
import { Heatmap } from './Components/Heatmap';

import { CommonModule } from '@angular/common';
import { FloormapService } from '../../../services/floormap.service';
import { FloorMap } from '../../../models/FloorMap';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './heatmapreport.component.html',
  styleUrls: ['./heatmapreport.component.scss']
})
export class HeatmapReportComponent implements OnInit {

  @ViewChild('heatmapCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  reportType: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();
  assetsListOnly: string[] = [];
  assetFilteredData: AssetPositionHistoryGET[] = [];
  AssetPositionHistorylist: AssetPositionHistoryGET[] = [];
  AssetPositionHistorylistOrig: AssetPositionHistoryGET[] = [];
  floorMapList:FloorMap[]=[];
  selectedFloorMap: FloorMap = { Id: 0, Name: '' , Image: ''};
  trackedAssetDetail: TrackedAssetDetailComponent;
 

  constructor(private reportGenerator: ReportGeneratorService, private floorMapService: FloormapService) {
    this.trackedAssetDetail=new TrackedAssetDetailComponent(reportGenerator);

  }

  async ngOnInit(): Promise<void> {
    await this.getFloorMaps();
   
  }

  drawHeatmapForAsset(canvasId:string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    console.log("canvas",canvas);
    const heatmap = new Heatmap(this.assetFilteredData, new ElementRef(canvas));
    console.log("heatmap",heatmap);
    
    heatmap.drawHeatmap();
  }

  getNumberOfTrackedAssets(): string {
    const uniqueAssetNames = new Set();
  
    this.AssetPositionHistorylist.forEach(element => {
      const { assetName } = element;
      uniqueAssetNames.add(assetName);
    });
  
    return uniqueAssetNames.size.toString();
  }

  onFloorMapChange(selectedFloor: FloorMap) {
    console.log(selectedFloor);
    this.selectedFloorMap = this.floorMapList.find(floorMap => floorMap.Id === selectedFloor.Id)!!;

    this.FilterAssetsByFloor(this.selectedFloorMap);
    this.loadAssets();
}

  private async loadData() {
    try {
      const response = await this.reportGenerator.getHeatmapReportData(this.startDate.toString(),this.endDate.toString() ,this.startTime.toString(),this.endTime.toString());
      console.log(response);
      if (response != null) {
        this.AssetPositionHistorylistOrig = response;
        this.AssetPositionHistorylist = response;

        this.selectedFloorMap = this.floorMapList[0];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

   

    async getFloorMaps() {
      const floorMaps = await this.floorMapService.getAllFloormap();
      console.log("floorMaps",Array.from(floorMaps));
     this.floorMapList= Array.from(floorMaps);
  }

 

FilterAssetsByFloor(selectedFloor: FloorMap) {
    
        this.AssetPositionHistorylist = this.AssetPositionHistorylistOrig.filter(
            element => element.floorMapId === selectedFloor.Id!!);
}


filterAccordionAssetData(assetName: string, index: number) {
  this.assetFilteredData = this.AssetPositionHistorylist.filter(item => item.assetName === assetName);
  
}

loadAssets() {

  this.assetsListOnly = Array.from(
    new Set(this.AssetPositionHistorylist.map(item => item.assetName))
);
  console.log("AssetPositionHistorylist",this.assetsListOnly);
}


async generateReport() {
  await this.loadData();
  this.onFloorMapChange(this.selectedFloorMap); 
  this.loadAssets();
  
}





}

