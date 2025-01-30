import { ElementRef } from "@angular/core";
import { AssetPositionHistoryGET } from "../../../../models/AssetPositionHistory";

export class Heatmap {
  private assetPositions: AssetPositionHistoryGET[];
  private canvas: ElementRef<HTMLCanvasElement>;
  private heatmapWidth: number;
  private heatmapHeight: number;
  private offsetX: number;
  private offsetY: number;

  constructor(
    assetPositions: AssetPositionHistoryGET[],
    canvas: ElementRef<HTMLCanvasElement>,
    heatmapWidth: number = 450,
    heatmapHeight: number = 450,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    this.assetPositions = assetPositions;
    this.canvas = canvas;
    this.heatmapWidth = heatmapWidth;
    this.heatmapHeight = heatmapHeight;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
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
      console.log(`Gustina na (${x}, ${y}): ${density}`); // Provera gustine
      const color = this.getColorForDensity(density);
      const radius = 5 + Math.pow(density, 0.7) * 1.5; // Manji bazni radijus za bolju vidljivost

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
      // Skaliranje pozicija + offseti
      const scaleX = (x / 100) * this.heatmapWidth + this.offsetX;
      const scaleY = (y / 100) * this.heatmapHeight + this.offsetY;

      // Pronalazak bliskih tačaka (domet 6)
      const count = this.assetPositions.filter(
        (p) => Math.abs(p.x - x) <= 6 && Math.abs(p.y - y) <= 6
      ).length;

      const key = `${Math.round(scaleX / 10) * 10}-${Math.round(scaleY / 10) * 10}`;
      densityMap.set(key, { x: scaleX, y: scaleY, count });
    });

    return Array.from(densityMap.values()).map(({ x, y, count }) => [x, y, count]);
  }

  private getColorForDensity(density: number): string {
    if (density >= 12) return "rgba(255, 0, 0, 0.8)"; // Crvena (najgušće)
    if (density >= 7) return "rgba(255, 165, 0, 0.7)"; // Narandžasta
    if (density >= 3) return "rgba(255, 255, 0, 0.7)"; // Žuta
    return "rgba(0, 255, 0, 0.7)"; // Zelena (najmanja gustina)
  }

  resizeCanvas(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  clearCanvas(): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
