import { ElementRef } from "@angular/core";
import { AssetPositionHistoryGET } from "../../../../models/AssetPositionHistory";

export class Heatmap {
  private assetPositions: AssetPositionHistoryGET[];
  private canvas: ElementRef<HTMLCanvasElement>;
  private heatmapWidth: number;
  private heatmapHeight: number;


  constructor(
    assetPositions: AssetPositionHistoryGET[],
    canvas: ElementRef<HTMLCanvasElement>,
    heatmapWidth: number = 350,
    heatmapHeight: number = 350,

  ) {
    this.assetPositions = assetPositions;
    this.canvas = canvas;
    this.heatmapWidth = heatmapWidth;
    this.heatmapHeight = heatmapHeight;
   
  }

  drawHeatmap(): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = this.heatmapWidth / 2;
    canvas.height = this.heatmapHeight / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const densityMap = this.calculateDensity();

    densityMap.forEach(([x, y, density]) => {
      const color = this.getColorForDensity(density);
      const radius = density-density/2;

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    });
  }

  private calculateDensity(): [number, number, number][] {
    const densityMap: Map<string, { x: number; y: number; count: number }> = new Map();

    this.assetPositions.forEach(({ x, y }) => {
      const scaleX = (x / 100) * this.heatmapWidth ;
      const scaleY = (y / 100) * this.heatmapHeight ;

      const count = this.assetPositions.filter(
        (p) => Math.abs(p.x - x) <= 6 && Math.abs(p.y - y) <= 6
      ).length;

      const key = `${Math.round(scaleX / 10) * 10}-${Math.round(scaleY / 10) * 10}`;
      densityMap.set(key, { x: scaleX, y: scaleY, count });
    });

    return Array.from(densityMap.values()).map(({ x, y, count }) => [x, y, count]);
  }

  private getColorForDensity(density: number): string {
    if (density >= 15) return "rgba(255, 0, 0, 0.8)"; 
    if (density >= 10) return "rgba(255, 165, 0, 0.7)"; 
    if (density >= 5) return "rgba(255, 255, 0, 0.7)"; 
    return "rgba(0, 255, 0, 0.7)"; 
  }

}
