import { FloorMap } from "./floor-map.model";

export interface Asset {
    id?: number;
    name: string;
    x : number,
    y: number,
    floorMap: FloorMap | null;
    floorMapId: number,
    active: boolean;
    lastSync: string;
    assetPositionHistories: any[];
    assetZoneHistories: any[];
  }

  export interface CreateAssetRequest {
    name: string;
    floorMapId: number;
    active: boolean;
}
