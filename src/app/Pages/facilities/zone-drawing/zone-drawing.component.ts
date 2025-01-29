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
    this.floorMapService.getFloorMapById(floorMapId).subscribe(
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
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      ctx.drawImage(this.image, 0, 0);
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
        this.zone.points = [topLeft, topRight, bottomLeft, bottomRight];
        this.zoneUpdated.emit(this.zone);
      }

      // Save the rectangle to the saved drawings array
      this.savedDrawings.push(topLeft, bottomRight);
    }

    this.hasDrawn = true;
    this.drawingEnabled = false;
  }

  enableDrawing(): void {
    this.drawingEnabled = true;
    this.isUpdating = true;
  }

  updateZone(): void {
    this.drawingEnabled = true;
    this.hasDrawn = false;
    this.isUpdating = true;
  }
}
