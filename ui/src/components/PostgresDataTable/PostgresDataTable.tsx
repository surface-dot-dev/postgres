import { useCallback } from 'react';
import { useSelect } from '../../hooks';
import { DataTable } from '@surface.dev/ui';
import { PostgresColumnName } from '../PostgresColumnName';
import { PostgresColumnValue } from '../PostgresColumnValue';
import {
  PostgresDataTableColumnType,
  PostgresDataTableRowType,
  PostgresDataTableHeaderCellType,
  PostgresDataTableDataCellType,
} from './types';

/**
 * Props for a PostgresDataTable component that loads data
 * via a query (i.e. "query" mode)
 */
type PostgresDataTableQueryProps = {
  /**
   * The name of the Postgres Data Source to query
   */
  source: string;

  /**
   * The read-only SQL query to execute
   */
  query: string;

  /**
   * What the table (and the data within it) represents contextutally
   * within the broader application.
   */
  context?: string;

  /**
   * Never used in query mode - columns are derived from query results
   */
  columns?: never;

  /**
   * Never used in query mode - rows are derived from query results
   */
  rows?: never;
};

/**
 * Props for a PostgresDataTable component that displays
 * static data ("static" mode)
 */
type PostgresDataTableStaticProps = {
  /**
   * Never used in static mode - no Data Source needed
   */
  source?: never;

  /**
   * Never used in static mode - no query needed
   */
  query?: never;

  /**
   * Array of column definitions specifying the table structure
   */
  columns: PostgresDataTableColumnType[];

  /**
   * Array of data rows to display in the table
   */
  rows: PostgresDataTableRowType[];

  /**
   * What the table (and the data within it) represents contextutally
   * within the broader application.
   */
  context?: string;
};

export type PostgresDataTableProps = PostgresDataTableQueryProps | PostgresDataTableStaticProps;

const ctx = 'a table of postgres query results';

export const PostgresDataTable = (props: PostgresDataTableProps) => {
  const output = useSelect(props.source || '', props.query || '');
  const columns = props.columns ? props.columns : output.columns;
  const rows = props.rows ? props.rows : output.rows;
  const context = props.context || ctx;

  const renderHeaderCell = useCallback(
    ({ column }: PostgresDataTableHeaderCellType) => (
      <PostgresColumnName column={column}>{column.name}</PostgresColumnName>
    ),
    []
  );

  const renderDataCell = useCallback(
    ({ column, value }: PostgresDataTableDataCellType) => (
      <PostgresColumnValue column={column}>{value}</PostgresColumnValue>
    ),
    []
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      numFixedColumns={0}
      context={context}
      renderHeaderCell={(props) => renderHeaderCell(props as PostgresDataTableHeaderCellType)}
      renderDataCell={(props) => renderDataCell(props as PostgresDataTableDataCellType)}
    />
  );
};
