export interface TableData {
  name: string;
  data: any[];
  columns: string[];
}

export interface QueryResult {
  data: any[];
  columns: string[];
  error?: string;
}