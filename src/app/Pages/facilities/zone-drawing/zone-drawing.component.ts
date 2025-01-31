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
}

@Component({
  selector: 'app-zone-drawing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-drawing.component.html',
  styleUrls: ['./zone-drawing.component.scss']
})
export class ZoneDrawingComponent implements AfterViewInit, OnChanges {
  @Input() zone: Zone = { name: '', points: [] };
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
  private savedDrawings: Point[] = []; // Store previous drawings

  private canvasWidth: number = 500; // Set canvas size to 500px
  private canvasHeight: number = 500; // Set canvas size to 500px

  constructor(private floorMapService: FloorMapService) {}

  ngAfterViewInit(): void {
    if (this.selectedFloorMapId) {
      this.loadFloorMapImage(this.selectedFloorMapId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFloorMapId'] && this.selectedFloorMapId) {
      this.loadFloorMapImage(this.selectedFloorMapId);
    }
  }

  private loadFloorMapImage(floorMapId: number) {
    this.floorMapService.getFloorMap(floorMapId).subscribe(
      (floorMap: FloorMap) => {
        this.image.src = 'data:image/png;base64,' + floorMap.image;
        this.image.onload = () => {
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
      // Set canvas dimensions to 500x500 pixels
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;

      // Calculate aspect ratio and scale the image to fit inside the 500x500 canvas
      const aspectRatio = this.image.width / this.image.height;
      let newWidth = this.canvasWidth;
      let newHeight = this.canvasHeight;

      if (this.image.width > this.canvasWidth || this.image.height > this.canvasHeight) {
        if (aspectRatio > 1) {
          // Image is wider than it is tall, scale by width
          newHeight = this.canvasWidth / aspectRatio;
        } else {
          // Image is taller than it is wide, scale by height
          newWidth = this.canvasHeight * aspectRatio;
        }
      }

      // Draw the resized image on the canvas
      ctx.drawImage(this.image, 0, 0, newWidth, newHeight);
      this.redrawSavedDrawings();
    }
  }

  private redrawSavedDrawings(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    this.savedDrawings.forEach((point, index) => {
      if (index % 2 === 1) { // Ensure we have start and end points
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
      ordinalNumber: this.zone.points.length - 3,
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
    const endPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      ordinalNumber: this.zone.points.length,
    };

    if (this.startPoint) {
      const topLeft = this.startPoint;
      const bottomRight = endPoint;
      const topRight = {
        x: topLeft.x! + this.rectangleWidth,
        y: topLeft.y,
        ordinalNumber: this.zone.points.length - 2,
      };
      const bottomLeft = {
        x: topLeft.x,
        y: topLeft.y! + this.rectangleHeight,
        ordinalNumber: this.zone.points.length - 1,
      };

      if (this.isUpdating) {
        // Update the zone with the new points
        this.zone.points = [topLeft, topRight, bottomLeft, bottomRight];
        this.zoneUpdated.emit(this.zone);
      }

      // Save the rectangle to the saved drawings array
      this.savedDrawings = [topLeft, bottomRight]; // Only store the latest zone
    }

    this.hasDrawn = true;
    this.drawingEnabled = false;
  }

  enableDrawing(): void {
    this.drawingEnabled = true;
    this.isUpdating = true;

    // Reset saved drawings to ensure only one rectangle can be drawn
    this.savedDrawings = [];
    this.zone.points = [];
  }

  updateZone(): void {
    // Clear the current zone and start fresh
    this.savedDrawings = [];
    this.zone.points = [];
    this.hasDrawn = false;
    this.drawingEnabled = true;
    this.isUpdating = true;
  }
}
