export interface Asset {
    id: number;
    assetName: string;
    position: { x: number; y: number };
    floorMap: number;
    status: boolean;
    lastSync: string;  
  }