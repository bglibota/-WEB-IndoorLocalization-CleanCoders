import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mqtt from 'mqtt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private client: mqtt.MqttClient | null = null;

  ngOnInit(): void {
    this.initMqtt();
  }

  private initMqtt(): void {
    const brokerUrl = 'ws://localhost:9001'; // Promijeni ako koristiš drugi broker
    this.client = mqtt.connect(brokerUrl);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker.');
      this.client?.subscribe('object/position', (err) => {
        if (err) console.error('Subscription error:', err);
      });
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'object/position') {
        this.updateObjectPosition(JSON.parse(message.toString()));
      }
    });
  }

  private updateObjectPosition(position: { x: number; y: number }): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height); // Čisti canvas
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
      context.fill();
    }
  }
}
