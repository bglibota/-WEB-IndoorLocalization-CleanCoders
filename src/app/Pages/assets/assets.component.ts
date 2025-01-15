import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asset } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})

export class AssetsComponent implements OnInit { 
  dataSource: Asset[] = [];
  showDeleteModal: boolean = false;
  deleteAssetId: number | null = null;
  deleteAssetName: string = '';  

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
    this.deleteAssetId = asset.id;
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
}
