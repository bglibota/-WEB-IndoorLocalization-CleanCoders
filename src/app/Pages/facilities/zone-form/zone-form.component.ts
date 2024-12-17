import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-zone-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.scss']
})
export class ZoneFormComponent {
  @Input() zone: Zone = { name: '', points: [] };  
  @Output() zoneUpdated = new EventEmitter<Zone>();  

 
  updateZone() {
    this.zoneUpdated.emit(this.zone);
  }
}
