export interface TableHeader {
  title: string;
  key: string;
}

export type TableData = Record<string, unknown>

export interface RowProps {
  entry: TableData
  headers: TableHeader[]
  onRowAction?: (action: string, row: TableData) => void
}
