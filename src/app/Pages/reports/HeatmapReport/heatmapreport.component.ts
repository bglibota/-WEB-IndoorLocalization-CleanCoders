import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReportGeneratorService } from '../../../services/reportGenerator.service';
import { AssetPositionHistoryGET } from '../../../models/AssetPositionHistory';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
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
  AssetPositionHistorylist: AssetPositionHistoryGET[] = [];

 

  constructor(private route: ActivatedRoute, private reportGenerator: ReportGeneratorService) { }

  async ngOnInit(): Promise<void> {
    this.getURLParams();
    await this.loadData();
    this.drawHeatmap();

  }



  private getURLParams() {
    this.route.params.subscribe(params => {
      this.startDate = new Date(params['startDate']);
      this.endDate = new Date(params['endDate']);
      this.startTime = new Date(params['startTime']);
      this.endTime = new Date(params['endTime']);
    });
  }

  private async loadData() {
    try {
      const response = await this.reportGenerator.getHeatmapReportData('2025-01-01', '2025-01-14', '08:00', '17:00');
      console.log(response);
      if (response != null) {
        this.AssetPositionHistorylist = response;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  drawHeatmap(): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 500;
    canvas.height = 500;

    const densityMap = this.calculateDensity();

    densityMap.forEach(([x, y, density]) => {
      const color = this.getColorForDensity(density);
      context.beginPath();
      context.arc(x, y, 10 * density, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    });
  }

  calculateDensity(): [number, number, number][] {
    const densityMap: Map<string, { x: number; y: number; count: number }> = new Map();

    this.AssetPositionHistorylist.forEach(({ x, y }) => {
      const key = `${x}-${y}`;
      if (!densityMap.has(key)) {
        densityMap.set(key, {  x, y, count: 1 });
      } else {
        densityMap.get(key)!.count++;
      }
    });

    return Array.from(densityMap.values()).map(({ x, y, count }) => [x, y, count]);
  }

  getColorForDensity(density: number): string {
    const maxDensity = 20;
    const normalizedDensity = Math.min(density / maxDensity, 1);


    const red = Math.min(255, Math.floor(255 * normalizedDensity));
    const green = Math.max(0, Math.floor(255 * (1 - normalizedDensity)));

    return `rgba(${red}, ${green}, 0, 0.7)`;
  }
  generateReport() {
    throw new Error('Method not implemented.');
  }
}

