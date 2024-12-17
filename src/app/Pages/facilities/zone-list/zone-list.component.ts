import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  imports:[CommonModule],
  standalone: true,
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit {
  zones: Zone[] = [];
  @Output() zoneUpdated = new EventEmitter<Zone>();

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    this.fetchZones();
  }

  fetchZones(): void {
    this.zoneService.getAllZones().subscribe({
      next: (data) => {
      
        data.forEach(zone => {
         
          if (typeof zone.points === 'string') {
            zone.points = JSON.parse(zone.points);
          }
        });

        this.zones = data;
      },
      error: (err) => console.error('Error fetching zones:', err),
    });
  }

  selectZone(zone: Zone): void {
    this.zoneUpdated.emit(zone);
  }
}