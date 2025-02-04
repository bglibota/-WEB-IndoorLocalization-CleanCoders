import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FloorMapService, FloorMap } from '../../../services/floor-map.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floor-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floormaps.component.html',
  styleUrls: ['./floormaps.component.scss']
})
export class FloorMapComponent implements OnInit {
  floorMaps: FloorMap[] = [];

  @Output() floorMapSelected = new EventEmitter<number>(); // Emit FloorMap ID when clicked

  constructor(private floorMapService: FloorMapService) {}

  ngOnInit(): void {
    this.loadFloorMaps();
  }

  loadFloorMaps(): void {
    this.floorMapService.getFloorMaps().subscribe(
      (data: FloorMap[]) => {
        this.floorMaps = data;
      },
      (error) => {
        console.error('Error fetching floor maps', error);
      }
    );
  }

  selectFloorMap(floorMapId: number) {
    this.floorMapSelected.emit(floorMapId); // Emit event when clicked
  }
}
