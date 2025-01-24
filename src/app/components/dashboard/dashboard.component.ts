import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import mqtt from 'mqtt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private client: mqtt.MqttClient | null = null;
  private currentPosition: { x: number; y: number } | null = null;

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
  }

  private initMqtt(): void {
    const brokerUrl = 'ws://localhost:9001'; // Postavi odgovarajući MQTT broker
    this.client = mqtt.connect(brokerUrl); // Povezivanje s brokerom putem WebSocket-a

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
          const position = JSON.parse(message.toString());
          this.updateObjectPosition(position);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
  }

  private updateObjectPosition(position: { x: number; y: number }): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
  
    if (!context) {
      console.error('Failed to get canvas context.');
      return;
    }
  
    // Skaliranje koordinata na temelju veličine kanvasa
    const scaleX = canvas.width / 100; // Pretpostavljena širina tlocrta je 100
    const scaleY = canvas.height / 100; // Pretpostavljena visina tlocrta je 100
  
    let adjustedX = position.x * scaleX;
    let adjustedY = position.y * scaleY;
  
    // Ograniči kretanje unutar granica kanvasa
    adjustedX = Math.max(0, Math.min(adjustedX, canvas.width));
    adjustedY = Math.max(0, Math.min(adjustedY, canvas.height));
  
    // Animiraj kretanje objekta
    const stepSize = 2; // Koliko pomaka u svakoj animaciji
    const currentPosition = { x: this.currentPosition?.x || adjustedX, y: this.currentPosition?.y || adjustedY };

    const animate = () => {
      const deltaX = adjustedX - currentPosition.x;
      const deltaY = adjustedY - currentPosition.y;

      if (Math.abs(deltaX) < stepSize && Math.abs(deltaY) < stepSize) {
        this.currentPosition = { x: adjustedX, y: adjustedY };
        return;
      }

      currentPosition.x += Math.sign(deltaX) * stepSize;
      currentPosition.y += Math.sign(deltaY) * stepSize;

      // Očisti prethodni sadržaj kanvasa
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Nacrtaj objekt na novoj poziciji
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(currentPosition.x, currentPosition.y, 5, 0, 2 * Math.PI);
      context.fill();

      // Pozovi animaciju sljedećeg okvira
      requestAnimationFrame(animate);
    };

    animate();
    this.currentPosition = { x: adjustedX, y: adjustedY };
  }
}
