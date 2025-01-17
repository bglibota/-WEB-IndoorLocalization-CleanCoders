import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReportGeneratorService } from '../../../services/reportGenerator.service';
import { AssetPositionHistoryGET } from '../../../models/AssetPositionHistory';
import { Router } from '@angular/router';
import { Heatmap } from './Components/Heatmap';

import { CommonModule } from '@angular/common';


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
  startDate: String = '';
  endDate: String = '';
  startTime: String = '';
  endTime: String = '';
  AssetPositionHistorylist: AssetPositionHistoryGET[] = [];
  AssetPositionHistorylistOrig: AssetPositionHistoryGET[] = [];
  selectedFloorMap: any;
 

  constructor(private route: ActivatedRoute, private reportGenerator: ReportGeneratorService, private router:Router) { }

  async ngOnInit(): Promise<void> {
    this.getURLParams();
    await this.loadData();
    this.onFloorMapChange(this.selectedFloorMap);
  }


  private drawHeatmap() {
    const heatmap = new Heatmap(this.AssetPositionHistorylist, this.canvas);
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


  private getURLParams() {
    this.route.params.subscribe(params => {
      this.startDate = params['startDate'].toString();
      this.endDate = params['endDate'].toString();
      this.startTime = params['startTime'].toString();
      this.endTime = params['endTime'].toString();
    });
  }

  onFloorMapChange(selectedFloor: string): void {
    this.selectedFloorMap = selectedFloor;

    this.FilterAssetsByFloor(selectedFloor);
    this.drawHeatmap();
    this.UpdateReportGeneratorService(this.AssetPositionHistorylist);
}

  private async loadData() {
    try {
      const response = await this.reportGenerator.getHeatmapReportData(this.startDate,this.endDate ,this.startTime ,this.endTime );
      console.log(response);
      if (response != null) {
        this.AssetPositionHistorylistOrig = response;
        this.AssetPositionHistorylist = response;
        this.UpdateReportGeneratorService(this.AssetPositionHistorylist);

        this.selectedFloorMap = this.getFloorMaps()[0];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

    UpdateReportGeneratorService(list: AssetPositionHistoryGET[]) {
      this.reportGenerator.heatmapReportDataList = list;

    }

    getFloorMaps() {
      const floorMaps = new Set(
          this.AssetPositionHistorylistOrig.map(element => element.floorMapName)
      );
      return Array.from(floorMaps);
  }

  viewAssetDetails() {
    this.router.navigate(['/trackedassetdetails/', this.startDate, this.endDate, this.startTime, this.endTime]);
  }

  FilterAssetsByFloor(selectedFloor: string) {
      
          this.AssetPositionHistorylist = this.AssetPositionHistorylistOrig.filter(
              element => element.floorMapName === selectedFloor);
  }
}

