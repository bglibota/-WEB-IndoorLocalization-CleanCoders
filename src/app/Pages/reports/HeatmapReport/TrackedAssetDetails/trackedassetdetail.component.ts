import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportGeneratorService } from '../../../../services/reportGenerator.service';
import { AssetPositionHistoryGET } from '../../../../models/AssetPositionHistory';
import { CommonModule } from '@angular/common';
var route:Router;
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './trackedassetdetail.component.html',
  styleUrl: './trackedassetdetail.component.scss'
})
export class TrackedAssetDetailComponent {
reportType: any;

  startDate: String = '';
  endDate: String = '';
  startTime: String = '';
  endTime: String = '';
  AssetPositionHistorylist: AssetPositionHistoryGET[] = [];
assetsListOnly: string[] = [];
assetFilteredData: AssetPositionHistoryGET[] = [];


  constructor(private route:ActivatedRoute, private reportGenerator: ReportGeneratorService) {

   }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.startTime = params['startTime'];
      this.endTime = params['endTime'];
    });

    //await this.reportGenerator.getHeatmapReportData( this.startDate, this.endDate, this.startTime, this.endTime);
    this.AssetPositionHistorylist=this.reportGenerator.heatmapReportDataList;
    this.assetsListOnly = Array.from(
      new Set(this.AssetPositionHistorylist.map(item => item.assetName))
  );
  
    
    
   
  }


filterData(assetName: string) {
  this.assetFilteredData = this.AssetPositionHistorylist.filter(item => item.assetName === assetName);
}
  
}
