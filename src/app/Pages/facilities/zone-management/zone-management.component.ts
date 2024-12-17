import { Component } from '@angular/core';
import { ZoneDrawingComponent } from '../zone-drawing/zone-drawing.component';
import { ZoneFormComponent } from '../zone-form/zone-form.component';
import { ZoneListComponent } from '../zone-list/zone-list.component';
import { CommonModule } from '@angular/common';
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
  selector: 'app-zone-management',
  standalone: true,
  imports: [CommonModule,ZoneDrawingComponent,ZoneFormComponent,ZoneListComponent,FormsModule],
  templateUrl: './zone-management.component.html',
  styleUrl: './zone-management.component.scss'
})
export class ZoneManagementComponent {
  selectedZone: Zone = { name: '', points: [{ x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }, { x: null, y: null, ordinalNumber: null }] };

   
  onZoneUpdated(zone: Zone) {
    this.selectedZone = zone; 
  }
  
}
