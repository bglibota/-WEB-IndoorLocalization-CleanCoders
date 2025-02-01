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
  zones: Zone[] = [];
  @Output() zoneUpdated = new EventEmitter<Zone>();
  @Input() selectedFloorMapId: number | null = null;

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

        this.zones = data;
      },
      error: (err) => {
        console.error('Error fetching zones:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  selectZone(zone: Zone): void {
    this.zoneUpdated.emit(zone);
  }

  updateZone(zone: Zone): void {
    this.zoneUpdated.emit(zone);
  }

  deleteZone(zoneId: number): void {
    this.zoneService.deleteZone(zoneId).subscribe(() => {
      this.fetchZones();
    }, error => {
      console.error('Error deleting zone:', error);
    });
  }
}