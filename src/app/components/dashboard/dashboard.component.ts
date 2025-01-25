import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import mqtt from 'mqtt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private client: mqtt.MqttClient | null = null;
  private objectPositions: Map<
    string,
    { x: number; y: number; previousX?: number; previousY?: number }
  > = new Map();
  private tlocrtImage: HTMLImageElement = new Image();

  ngOnInit(): void {
    this.setupCanvas();
    this.initMqtt();
  }

  private setupCanvas(): void {
    const canvas = this.canvas.nativeElement;
    const parentContainer = canvas.parentElement;

    if (parentContainer) {
      canvas.width = parentContainer.clientWidth;
      canvas.height = parentContainer.clientHeight;
    }

    // Postavljanje slike tlocrta kao pozadine
    this.tlocrtImage.src = 'assets/Tlocrt.png';
    this.tlocrtImage.onload = () => {
      this.drawCanvas();
    };
  }

  private initMqtt(): void {
    const brokerUrl = 'ws://localhost:9001'; // Postavi odgovarajući MQTT broker
    this.client = mqtt.connect(brokerUrl);
    this.client?.publish('floormap/active', 'assets/Tlocrt.png');


    this.client.on('connect', () => {
      console.log('Connected to MQTT broker.');
      this.client?.subscribe('object/position', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topic: object/position');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'object/position') {
        try {
          const { id, x, y } = JSON.parse(message.toString());
          this.updateObjectPosition(id, { x, y });
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
  }

  private updateObjectPosition(
    id: string,
    position: { x: number; y: number }
  ): void {
    const existing = this.objectPositions.get(id);
    this.objectPositions.set(id, {
      ...position,
      previousX: existing?.previousX ?? position.x,
      previousY: existing?.previousY ?? position.y,
    });
    this.animateObjects();
  }

  private drawCanvas(): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to get canvas context.');
      return;
    }

    // Očisti canvas i nacrtaj pozadinu
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this.tlocrtImage, 0, 0, canvas.width, canvas.height);

    // Nacrtaj sve objekte s njihovim pozicijama i oznakama
    this.objectPositions.forEach((position, id) => {
      const scaleX = canvas.width / 100; // Pretpostavljena širina tlocrta
      const scaleY = canvas.height / 100; // Pretpostavljena visina tlocrta

      // Izračunaj trenutnu animiranu poziciju pomoću interpolacije (lerp)
      const adjustedX = this.lerp(position.previousX || position.x, position.x, 0.1) * scaleX;
      const adjustedY = this.lerp(position.previousY || position.y, position.y, 0.1) * scaleY;

      // Ažuriraj prethodne pozicije za animaciju
      position.previousX = adjustedX / scaleX;
      position.previousY = adjustedY / scaleY;

      // Nacrtaj objekt (crveni krug)
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(adjustedX, adjustedY, 5, 0, 2 * Math.PI);
      context.fill();

      // Dodaj oznaku objekta (npr., "obj1")
      context.fillStyle = 'black';
      context.font = '12px Arial';
      context.textAlign = 'center';
      context.fillText(id, adjustedX, adjustedY + 15);
    });

    // Ponovo pozovi animaciju
    requestAnimationFrame(() => this.drawCanvas());
  }

  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  private animateObjects(): void {
    requestAnimationFrame(() => this.drawCanvas());
  }

  private floormapObjects: { [key: string]: string[] } = {
    'assets/Tlocrt.png': ['obj1', 'obj2', 'obj3'],
    'assets/Tlocrt2.jpg': ['obj4', 'obj5'],
    'assets/Tlocrt3.png': ['obj6', 'obj7'],
  };

  changeFloormap(floormapPath: string): void {
    this.tlocrtImage.src = floormapPath;
  
    // Filtriraj objekte prema trenutnom tlocrtu
    const allowedObjects = this.floormapObjects[floormapPath] || [];
    this.objectPositions.forEach((_, id) => {
      if (!allowedObjects.includes(id)) {
        this.objectPositions.delete(id);
      }
    });
  
    // Redraw canvas nakon promjene tlocrta
    this.drawCanvas();
    this.client?.publish('floormap/active', floormapPath);
  }
  
  
}
