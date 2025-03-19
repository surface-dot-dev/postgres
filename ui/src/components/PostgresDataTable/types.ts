import { DataTableColumnType, DataTableRowType } from '@surface.dev/ui';

export type PostgresDataTableColumnType = DataTableColumnType & {
  type: string;
  inPrimaryKey?: boolean;
};

export type PostgresDataTableRowType = DataTableRowType;

export type PostgresDataTableHeaderCellType = {
  column: PostgresDataTableColumnType;
  columnIndex: number;
};

export type PostgresDataTableDataCellType = {
  column: PostgresDataTableColumnType;
  columnIndex: number;
  row: PostgresDataTableRowType;
  rowIndex: number;
  value: any;
};
