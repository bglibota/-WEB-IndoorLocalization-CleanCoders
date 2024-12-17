import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

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
export class ZoneDrawingComponent implements AfterViewInit {
  @Input() zone: Zone = { name: '', points: [] };
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

  ngAfterViewInit(): void {
    this.image.src = 'assets/dashboard.png'; 
    this.image.onload = () => {
      this.drawImage();
    };
  }

  private drawImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      ctx.drawImage(this.image, 0, 0); 
    }
  }

  private drawRectangle(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.startPoint) return;

   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    this.drawImage();

   
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
      ordinalNumber: this.zone.points.length -3,
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
        ordinalNumber: this.zone.points.length -1,
      };

     
      if (this.isUpdating) {
        this.zone.points = [topLeft, topRight, bottomLeft, bottomRight];
        this.zoneUpdated.emit(this.zone); 
      }
    }

    this.hasDrawn = true;  
    this.drawingEnabled = false; 
  }

  // Aktiviranje crtanja
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
