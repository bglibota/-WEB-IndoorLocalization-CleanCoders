import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})

export class AssetsComponent {
  displayedColumns: string[] = ['assetName', 'id', 'position', 'floorMap', 'status', 'actions', 'lastSync'];
  dataSource = [
    { assetName: 'Forklift', id: '1', position: { x: 10, y: 20 }, floorMap: 'Map1', status: 'Active', lastSync: new Date() },
    { assetName: 'Pallet', id: '2', position: { x: 30, y: 40 }, floorMap: 'Map2', status: 'Inactive', lastSync: new Date() },
    { assetName: 'Box', id: '3', position: { x: 50, y: 60 }, floorMap: 'Map3', status: 'Active', lastSync: new Date() },
  ];

  editAsset(asset: any): void {
    console.log('Edit asset:', asset);
  }

  deleteAsset(asset: any): void {
    console.log('Delete asset:', asset);
  }
}
