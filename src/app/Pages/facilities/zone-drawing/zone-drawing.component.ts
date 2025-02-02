import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FloorMapService, FloorMap } from '../../../Services/floor-map.service';

interface Point {
  x: number | null;
  y: number | null;
  ordinalNumber: number | null;
}

interface Zone {
  name: string;
  points: Point[];
  isActive: boolean;
}

@Component({
  selector: 'app-zone-drawing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-drawing.component.html',
  styleUrls: ['./zone-drawing.component.scss']
})
export class ZoneDrawingComponent implements AfterViewInit, OnChanges {
  @Input() zone: Zone = { name: '', points: [], isActive:false };
  @Input() selectedFloorMapId: number | null = null;
  @Output() zoneUpdated = new EventEmitter<Zone>();
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  dragging = false;
  startPoint: Point | null = null;
  rectangleWidth = 0;
  rectangleHeight = 0;
  drawingEnabled = false;
  hasDrawn = false;
  isUpdating = false;

  private image = new Image();
  private savedDrawings: Point[] = [];

  private canvasWidth: number = 500;
  private canvasHeight: number = 500;

  constructor(private floorMapService: FloorMapService) {}

  ngAfterViewInit(): void {
    if (this.selectedFloorMapId) {
      this.loadFloorMapImage(this.selectedFloorMapId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFloorMapId'] && this.selectedFloorMapId) {
      this.clearCanvas();
      this.resetDrawingState();
      
      this.loadFloorMapImage(this.selectedFloorMapId);
    }
  
    if (changes['zone'] && this.zone.points.length === 4) {
      this.clearCanvas();
      this.drawZoneRectangle();
    }
    if (changes['zone'] && this.zone.points.length === 0) {
      this.clearCanvas();
      this.drawZoneRectangle();
    }
    
   
  }
 
  private clearCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return; // Exit early if the canvas is not available
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Save the current image state
      const image = this.image;
  
      // Clear the canvas, including previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Redraw the background image to keep it intact
      if (image.complete) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  
    // Optionally, reset drawing state
    this.savedDrawings = [];
    this.hasDrawn = false;
    this.drawingEnabled = false;
  }
  
  
  
  private resetDrawingState(): void {
    this.savedDrawings = [];
    this.zone.points = [];
    this.hasDrawn = false;
    this.drawingEnabled = false;
    this.isUpdating = false;
  }
  
  private drawZoneRectangle(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.zone.points || this.zone.points.length !== 4) return;
  
    // Ensure the canvas is redrawn with the background image
    this.drawCanvas();
  
    const [topLeft, topRight, bottomRight, bottomLeft] = this.zone.points;
  
    const scaledTopLeft = this.scalePointFrom100x100(topLeft);
    const scaledBottomRight = this.scalePointFrom100x100(bottomRight);
  
    const width = scaledBottomRight.x! - scaledTopLeft.x!;
    const height = scaledBottomRight.y! - scaledTopLeft.y!;
  
    ctx.beginPath();
    ctx.rect(scaledTopLeft.x!, scaledTopLeft.y!, width, height);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  private scalePointFrom100x100(point: Point): Point {
    return {
      x: (point.x! / 100) * this.canvasWidth,
      y: (point.y! / 100) * this.canvasHeight,
      ordinalNumber: point.ordinalNumber,
    };
  }

  private loadFloorMapImage(floorMapId: number) {
    this.floorMapService.getFloorMap(floorMapId).subscribe(
      (floorMap: FloorMap) => {
        this.image.src = 'data:image/png;base64,' + floorMap.image;
        this.image.onload = () => {
          this.canvasWidth = this.image.width;
          this.canvasHeight = this.image.height;
          this.drawCanvas();
        };
      },
      (error) => {
        console.error('Error loading floor map image', error);
      }
    );
  }

  private drawCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx && this.image.complete) {
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
      this.redrawSavedDrawings();
    }
  }

  private scalePointTo100x100(point: Point): Point {
    return {
      x: (point.x! / this.canvasWidth) * 100,
      y: (point.y! / this.canvasHeight) * 100,
      ordinalNumber: point.ordinalNumber
    };
  }

  private redrawSavedDrawings(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    this.savedDrawings.forEach((point, index) => {
      if (index % 2 === 1) {
        const startPoint = this.savedDrawings[index - 1];
        ctx.strokeRect(startPoint.x!, startPoint.y!, 
                       point.x! - startPoint.x!, 
                       point.y! - startPoint.y!);
      }
    });
  }
  private drawRectangle(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.startPoint) return;

    this.drawCanvas(); // Redraw image and saved drawings

    ctx.beginPath();
    ctx.rect(this.startPoint.x!, this.startPoint.y!, this.rectangleWidth, this.rectangleHeight);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  onMouseDown(event: MouseEvent): void {
    if (!this.drawingEnabled || this.hasDrawn) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.startPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      ordinalNumber: 1,
    };
    this.dragging = true;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.dragging || !this.startPoint || !this.drawingEnabled) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    this.rectangleWidth = Math.abs(currentX - this.startPoint.x!);
    this.rectangleHeight = Math.abs(currentY - this.startPoint.y!);

    this.drawRectangle();
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.dragging || !this.startPoint || !this.drawingEnabled) return;

    this.dragging = false;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const endPoint: Point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      ordinalNumber: 4,
    };

    const topLeft = this.scalePointTo100x100(this.startPoint);
    const bottomRight = this.scalePointTo100x100(endPoint);
    const topRight: Point = { x: bottomRight.x, y: topLeft.y, ordinalNumber: 2 };
    const bottomLeft: Point = { x: topLeft.x, y: bottomRight.y, ordinalNumber: 3 };
    if (this.isUpdating) {
      this.zone.points = [topLeft, topRight, bottomRight, bottomLeft];
      this.zoneUpdated.emit(this.zone);
    }

    this.savedDrawings = [topLeft, bottomRight];
    this.hasDrawn = true;
    this.drawingEnabled = false;
  }
  updateZone(): void {
    // Clear the current zone and start fresh
    this.clearCanvas();
    this.savedDrawings = [];
    this.zone.points = [];
    this.hasDrawn = false;
    this.drawingEnabled = true;
    this.isUpdating = true;
  }
  enableDrawing(): void {
    this.clearCanvas();
    this.drawingEnabled = true;
    this.isUpdating = true;

    // Reset saved drawings to ensure only one rectangle can be drawn
    this.savedDrawings = [];
    this.zone.points = [];
    
  }
  
  
} 
