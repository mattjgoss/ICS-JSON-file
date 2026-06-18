export interface AnalysisResult {
  summary: string;
  financialPostingInfo: {
    totalAmount?: number;
    currency?: string;
    postingDate?: string;
  };
  warnings: string[];
  fieldExplanations: Array<{
    field: string;
    description: string;
    value: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export enum ViewMode {
  RAW = 'RAW',
  TREE = 'TREE'
}

export interface JsonNode {
  key: string;
  value: any;
  path: string;
}
