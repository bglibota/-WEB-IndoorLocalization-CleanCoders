import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asset, CreateAssetRequest } from '../../models/asset.model';
import { AssetService } from '../../services/asset.service';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[DatePipe],
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

  constructor(private assetService: AssetService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.assetService.getAllAssets().subscribe({
      next: (assets) => {
        this.dataSource = assets.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  
        const requests = this.dataSource.map(asset => {
          if (asset.id !== undefined) {
            const positionHistory$ = this.assetService.getAssetPositionHistory(asset.id).pipe(
              map((history) => {
                if (history && history.dateTime) {
                  asset.lastSync = this.datePipe.transform(history.dateTime, 'dd-MM-yyyy HH:mm:ss') ?? '';
                }
                if (history && history.x !== undefined && history.y !== undefined) {
                  asset.x = parseFloat(history.x.toFixed(2)); 
                  asset.y = parseFloat(history.y.toFixed(2)); 
                }
              }),
              catchError(() => {
                asset.lastSync = "null";
                asset.x = 0;
                asset.y = 0;
                return of(null);
              })
            );
  
            const floorMap$ = this.assetService.getFloorMap(asset.floorMapId).pipe(
              map((floorMap) => {
                asset.floorMap = floorMap;
              }),
              catchError(() => {
                asset.floorMap = null;
                return of(null);
              })
            );
  
            return forkJoin([positionHistory$, floorMap$]);
          } else {
            return forkJoin([]);
          }
        });
  
        forkJoin(requests).subscribe({
          next: () => {
            console.log('Svi podaci su uspješno učitani');
          },
          error: (error) => {
            console.error('Greška prilikom učitavanja podataka:', error);
          }
        });
      },
      error: (error) => {
        console.error('Greška pri dohvacanju assets:', error);
      }
    });
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
    const assetToAdd: CreateAssetRequest = {
        name: this.newAsset.name,
        floorMapId: this.newAsset.floorMapId,
        active: this.newAsset.active
    };
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
