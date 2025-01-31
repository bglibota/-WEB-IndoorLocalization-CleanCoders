import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ZoneService } from '../../../Services/zone.service';

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
  selector: 'app-zone-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit, OnChanges {
  zones: Zone[] = [];
  @Output() zoneUpdated = new EventEmitter<Zone>();
  @Input() selectedFloorMapId: number | null = null;

  // Add loading state for user feedback
  isLoading: boolean = false;

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    this.fetchZones();
  }

  // Listen for changes in selectedFloorMapId
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFloorMapId']) {
      // If selectedFloorMapId has changed, refetch zones
      this.fetchZones();
    }
  }

  fetchZones(): void {
    if (this.selectedFloorMapId === null) {
      this.zones = [];  // Clear zones if no floor map ID is provided
      return;
    }

    this.isLoading = true;  // Set loading state to true while fetching

    // Fetch zones for the selected floor map ID
    this.zoneService.getAllZones(this.selectedFloorMapId).subscribe({
      next: (data) => {
        // Parse the points if they are stored as a string
        data.forEach(zone => {
          if (typeof zone.points === 'string') {
            zone.points = JSON.parse(zone.points);
          }
        });

        // Update zones array with fetched data
        this.zones = data;
      },
      error: (err) => {
        console.error('Error fetching zones:', err);
      },
      complete: () => {
        // Set loading state to false once the request is complete
        this.isLoading = false;
      },
    });
  }

  selectZone(zone: Zone): void {
    this.zoneUpdated.emit(zone);
  }
}
