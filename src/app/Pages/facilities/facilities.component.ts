import { Component } from '@angular/core';
import { ZoneManagementComponent } from './zone-management/zone-management.component';
import { FloorMapComponent } from './floormaps/floormaps.component';
import { ZoneDrawingComponent } from './zone-drawing/zone-drawing.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [ZoneManagementComponent, FloorMapComponent, ZoneDrawingComponent,CommonModule ],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.scss'
})
export class FacilitiesComponent {
  selectedFloorMapId: number | null = null; // Store the selected FloorMap ID

  // Method to select a floor map
  selectFloorMap(floorMapId: number) {
    this.selectedFloorMapId = floorMapId; // Update selected ID
  }
}
