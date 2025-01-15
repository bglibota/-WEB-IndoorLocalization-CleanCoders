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
  showEditModal: boolean = false;
  deleteAssetId: number | null = null;
  deleteAssetName: string = '';
  editAssetData: Asset | null = null;  
  newAsset: Asset = this.getDefaultAsset();

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {  
    this.assetService.getAllAssets().subscribe(
      (assets) => {
        console.log('Assets fetched:', assets);  
        this.dataSource = assets.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)); 
      },
      (error) => {
        console.error('Error fetching assets', error);
      }
    );
  }

  openModal(modalType: 'edit' | 'delete' | 'add', asset?: Asset): void {
    if (modalType === 'edit' && asset) {
      this.editAssetData = { ...asset };
    }
    if (modalType === 'delete' && asset && asset.id !== undefined) {
      this.deleteAssetId = asset.id;
      this.deleteAssetName = asset.name;
    }
    this.showEditModal = modalType === 'edit';
    this.showDeleteModal = modalType === 'delete';
    this.showAddModal = modalType === 'add';
  }

  handleModalAction(actionType: 'confirm' | 'cancel', modalType: 'edit' | 'delete' | 'add'): void {
    if (actionType === 'confirm') {
      if (modalType === 'delete') {
        this.confirmDelete();
      } else if (modalType === 'add') {
        this.addAsset();
      } else if (modalType === 'edit') {
        this.updateAsset();
      }
    } else {
      this.closeModal(modalType);
    }
  }

  closeModal(modalType: 'edit' | 'delete' | 'add'): void {
    if (modalType === 'edit') {
      this.showEditModal = false;
    } else if (modalType === 'delete') {
      this.showDeleteModal = false;
    } else if (modalType === 'add') {
      this.showAddModal = false;
    }
  }

  addAsset(): void {
    this.newAsset.lastSync = this.getCurrentTime();
    const assetToAdd = { ...this.newAsset };
    if (assetToAdd.id !== undefined) {
      delete assetToAdd.id;
    }
    this.assetService.addAsset(assetToAdd).subscribe({
      next: (addedAsset) => {
        this.dataSource.push(addedAsset);
        this.showAddModal = false;  
        console.log('Asset added:', addedAsset);
      },
      error: (error) => {
        console.error('Error adding asset', error);
      }
    });
  }

  updateAsset(): void {
    if (this.editAssetData?.id) {
      this.assetService.updateAsset(this.editAssetData).subscribe({
        next: () => {
          const index = this.dataSource.findIndex(asset => asset.id === this.editAssetData!.id);
          if (index !== -1) {
            this.dataSource[index] = this.editAssetData!;
          }
          this.showEditModal = false;
          console.log('Asset updated');
        },
        error: (error) => {
          console.error('Error updating asset', error);
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.deleteAssetId !== null) {
      this.assetService.deleteAsset(this.deleteAssetId).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(a => a.id !== this.deleteAssetId);
          console.log('Asset deleted');
          this.showDeleteModal = false; 
        },
        error: (error) => {
          console.error('Error deleting asset', error);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  }

  private getDefaultAsset(): Asset {
    return {
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
  }
}
