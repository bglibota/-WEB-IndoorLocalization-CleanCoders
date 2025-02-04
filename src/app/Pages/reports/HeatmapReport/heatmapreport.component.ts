import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportGeneratorService } from '../../../services/reportGenerator.service';
import { AssetPositionHistoryGET } from '../../../models/AssetPositionHistory';
import { Heatmap } from './Components/Heatmap';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FloormapService } from '../../../services/floormap.service';
import { FloorMap } from '../../../models/FloorMap';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { delay } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, CalendarModule,FloatLabelModule,ProgressSpinnerModule

  ],
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
  floorMapList: FloorMap[] = [];
  selectedFloorMap: FloorMap = { Id: 0, Name: '', Image: '' };
  showSpinner: boolean = false;
  showNoDataMessage: boolean=false;


  constructor(private reportGenerator: ReportGeneratorService, private floorMapService: FloormapService) {

  }

  async ngOnInit(): Promise<void> {
    await this.getFloorMaps();

  }

  cleanAssetList(){
    
    this.assetsListOnly = [];
    this.assetFilteredData = [];
    this.AssetPositionHistorylist = [];
    this.AssetPositionHistorylistOrig = [];
    this.showNoDataMessage = false;
  }

  drawHeatmapForAsset(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const heatmap = new Heatmap(this.assetFilteredData, new ElementRef(canvas));

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
      const response = await this.reportGenerator.getHeatmapReportData(this.startDate.toISOString().split('T')[0], this.endDate!!.toISOString().split('T')[0], this.startTime.toTimeString().split(' ')[0], this.endTime.toTimeString().split(' ')[0]);
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
    this.floorMapList = Array.from(floorMaps);
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
    console.log("AssetPositionHistorylist", this.assetsListOnly);
  }


  async generateReport() {
    console.log("paarms", this.startDate.toISOString().split('T')[0], this.endDate!!.toISOString().split('T')[0], this.startTime.toTimeString().split(' ')[0], this.endTime.toTimeString().split(' ')[0]);
    this.showSpinner = true;
    this.cleanAssetList();
    await this.loadData();
    this.onFloorMapChange(this.selectedFloorMap);
    this.loadAssets();
    if (this.AssetPositionHistorylist.length===0)
    {
      this.showNoDataMessage = true;
      delay(5000);

    }
    this.showSpinner = false;
  }





}

