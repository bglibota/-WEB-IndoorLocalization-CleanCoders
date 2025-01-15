export interface Asset {
    id: number;
    name: string;
    x : number,
    y: number,
    floorMap: number;
    active: boolean;
    lastSync: string;  
  }