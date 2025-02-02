import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ZoneService } from '../../../Services/zone.service';

interface Point {
  x: number | null;
  y: number | null;
  ordinalNumber: number | null;
}

interface Zone {
  id: number;
  name: string;
  points: Point[];
}

@Component({
  selector: 'app-zone-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit, OnChanges {
  originalZones: Zone[] = [];  // Stores data from the database (immutable)
  zones: Zone[] = []; // Used for updates
  @Output() zoneUpdated = new EventEmitter<Zone>();
  @Input() selectedFloorMapId: number | null = null;
  selectedZone: Zone | null = null;
  isLoading: boolean = false;

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    this.fetchZones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFloorMapId']) {
      this.fetchZones();
    }
  }

  fetchZones(): void {
    if (this.selectedFloorMapId === null) {
      this.originalZones = [];
      this.zones = [];
      return;
    }

    this.isLoading = true;

    this.zoneService.getAllZones(this.selectedFloorMapId).subscribe({
      next: (data) => {
        data.forEach(zone => {
          if (typeof zone.points === 'string') {
            zone.points = JSON.parse(zone.points);
          }
        });

        this.originalZones = [...data]; // Store immutable original data
        this.zones = JSON.parse(JSON.stringify(data)); // Create a deep copy for editing
      },
      error: (err) => {
        console.error('Error fetching zones:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateZone(zone: Zone): void {
    this.selectedZone = { ...zone }; // Create a separate copy for form editing
    this.zoneUpdated.emit(this.selectedZone);
  }

  
}
