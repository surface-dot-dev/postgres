import { DataTableColumnType, DataTableRowType } from '@surface.dev/ui';

/** Defines the structure of a column in a Postgres data table */
export type PostgresDataTableColumnType = DataTableColumnType & {
  /**
   * The Postgres data type of the column (required)
   */
  type: string;
};

/**
 * Represents a single row of data in the table.
 * A flexible object type where keys correspond to
 * column names and values can be of any type
 */
export type PostgresDataTableRowType = DataTableRowType;

/**
 * Properties passed to header cell render functions for
 * customizing table headers
 */
export type PostgresDataTableHeaderCellType = {
  /**
   * Column definition containing name and type
   */
  column: PostgresDataTableColumnType;

  /**
   * Zero-based index of the column in the table
   */
  columnIndex: number;
};

/**
 * Properties passed to data cell render functions for
 * rendering individual table cells
 */
export type PostgresDataTableDataCellType = {
  /**
   * Column definition containing name and type
   */
  column: PostgresDataTableColumnType;

  /**
   * Zero-based index of the column in the table
   */
  columnIndex: number;

  /**
   * Complete row data object containing all column values
   */
  row: PostgresDataTableRowType;

  /**
   * Zero-based index of the row in the table
   */
  rowIndex: number;

  /**
   * The specific value for this cell
   * (equivalent to row[column.name])
   */
  value: any;
};
