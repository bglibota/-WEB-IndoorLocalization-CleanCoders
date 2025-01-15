export interface Asset {
    id?: number;
    name: string;
    x : number,
    y: number,
    floorMap: number | null;
    floorMapId: number,
    active: boolean;
    lastSync: string;
    assetPositionHistories: any[];
    assetZoneHistories: any[];
  }