export enum ViewMode {
  RAW = 'RAW',
  TREE = 'TREE'
}

export interface JsonNode {
  key: string;
  value: any;
  path: string;
}
