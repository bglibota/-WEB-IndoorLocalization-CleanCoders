import { Component } from '@angular/core';
import { ZoneManagementComponent } from './zone-management/zone-management.component';
import { FloorMapComponent } from './floormaps/floormaps.component';
import { ZoneDrawingComponent } from './zone-drawing/zone-drawing.component';
@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [ZoneManagementComponent, FloorMapComponent, ZoneDrawingComponent],
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
