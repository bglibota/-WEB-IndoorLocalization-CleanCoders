export interface AssetPositionHistoryGET {
    id: number;
    x: number;
    y: number;
    dateTime: Date;
    floorMapId: Date;
    assetId: boolean;
    floorMapName: string;
    assetName: string;
  }

  export interface AssetPositionHistoryPOST {
    x: string;
    y: string;
    dateTime: Date;
    floorMapId: Date;
    assetId: boolean;
  }