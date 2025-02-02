import { Component, Input } from '@angular/core';
import { ZoneDrawingComponent } from '../zone-drawing/zone-drawing.component';
import { ZoneFormComponent } from '../zone-form/zone-form.component';
import { ZoneListComponent } from '../zone-list/zone-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloorMapComponent } from '../floormaps/floormaps.component';

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
  selector: 'app-zone-management',
  standalone: true,
  imports: [CommonModule,ZoneDrawingComponent,ZoneFormComponent,ZoneListComponent,FormsModule,FloorMapComponent],
  templateUrl: './zone-management.component.html',
  styleUrl: './zone-management.component.scss'
})
export class ZoneManagementComponent {
  selectedZone: Zone = {id: 0, name: '', points: [{ x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }], isActive:false };
  @Input() selectedFloorMapId: number | null = null;
   
  onZoneUpdated(zone: Zone) {
    this.selectedZone = zone; 
  }
  
}
