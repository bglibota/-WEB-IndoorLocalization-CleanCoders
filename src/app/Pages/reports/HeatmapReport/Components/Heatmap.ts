import { ElementRef } from "@angular/core";
import { AssetPositionHistoryGET } from "../../../../models/AssetPositionHistory";

export class Heatmap{
private AssetPositionHistorylist:AssetPositionHistoryGET[];
private canvas:ElementRef<HTMLCanvasElement>;	
constructor(assetPositionHistorylist:AssetPositionHistoryGET[], canvas:ElementRef<HTMLCanvasElement>){
    this.AssetPositionHistorylist=assetPositionHistorylist;
    this.canvas=canvas;
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
      const key = `${x+40}-${y+40}`;
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
}