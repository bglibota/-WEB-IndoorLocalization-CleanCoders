import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Point {
  x: number | null;
  y: number | null;
  ordinalNumber: number | null;
}

interface Zone {
  id: number;
  name: string;
  points: Point[];
  isActive: boolean;
}

@Component({
  selector: 'app-zone-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.scss']
})
export class ZoneFormComponent {
  @Input() zone: Zone = { id: 0, name: '', points: [], isActive: true };
  @Output() zoneUpdated = new EventEmitter<Zone>();
  
  @Input() selectedFloorMapId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFloorMapId'] && !changes['selectedFloorMapId'].firstChange) {
      this.zone = { id: 0, name: '', points: [], isActive: true };
    }
  }

  updateZone() {
    this.zoneUpdated.emit(this.zone);
  }

  deactivateZone() {
    this.zone.isActive = false;
    this.zoneUpdated.emit(this.zone);
  }

  cancelZoneUpdate() {
    this.zone = { id: 0, name: '', points: [], isActive: true };
    this.zoneUpdated.emit(this.zone);
  }
}
