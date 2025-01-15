import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asset } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})

export class AssetsComponent implements OnInit { 
  dataSource: Asset[] = [];
  showDeleteModal: boolean = false;
  showAddModal: boolean = false;
  deleteAssetId: number | null = null;
  deleteAssetName: string = '';  

  newAsset: Asset = {
    id: 0,
    name: '',
    x: 0,
    y: 0,
    lastSync: '',
    active: true,
    floorMapId: 1,
    assetPositionHistories: [],
    assetZoneHistories: [],
    floorMap: null
  };

  constructor(private assetService: AssetService
  ) {}

  ngOnInit(): void {  
    this.assetService.getAllAssets().subscribe(
      (assets) => {
        console.log('Assets fetched:', assets);  
        this.dataSource = assets;
      },
      (error) => {
        console.error('Error fetching assets', error);
      }
    );
  }

  editAsset(asset: Asset): void {
    console.log('Edit asset:', asset);
  }

  openDeleteModal(asset: Asset): void {
    this.deleteAssetId = asset.id ?? null;
    this.deleteAssetName = asset.name;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.deleteAssetId !== null) {
      this.assetService.deleteAsset(this.deleteAssetId).subscribe(
        () => {
          this.dataSource = this.dataSource.filter(a => a.id !== this.deleteAssetId);
          console.log('Asset deleted');
          this.showDeleteModal = false; 
        },
        (error) => {
          console.error('Error deleting asset', error);
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false; 
  }

  openAddModal(): void {
    this.showAddModal = true; 
  }

  addAsset(): void {
    this.newAsset.lastSync = this.getCurrentTime();

    const assetToAdd = { ...this.newAsset };

    if (assetToAdd.id !== undefined) {
      delete assetToAdd.id;
    }
  
    console.log('Adding asset:', assetToAdd);
  
    this.assetService.addAsset(assetToAdd).subscribe(
      (addedAsset) => {
        this.dataSource.push(addedAsset);
        this.showAddModal = false;  
        console.log('Asset added:', addedAsset);
      },
      (error) => {
        console.error('Error adding asset', error);
      }
    );
  }
  

  cancelAdd(): void {
    this.showAddModal = false; // Close modal without adding
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
