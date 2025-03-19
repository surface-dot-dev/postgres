import { useState, useCallback, useMemo } from 'react';
import { DataTable } from '@surface.dev/ui';
import { PostgresColumnName } from '../PostgresColumnName';
import { PostgresColumnValue } from '../PostgresColumnValue';
import {
  PostgresDataTableColumnType,
  PostgresDataTableRowType,
  PostgresDataTableHeaderCellType,
  PostgresDataTableDataCellType,
} from './types';

export type PostgresDataTableProps =
  // Option #1: Given a query, columns & rows populate based on query results.
  | {
      query: string;
      context?: string;
      // --
      columns?: never;
      rows?: never;
    }

  // Option #2: Columns & rows are explicitly given, upfront.
  | {
      columns: PostgresDataTableColumnType[];
      rows: PostgresDataTableRowType[];
      context?: string;
      // --
      query?: never;
    };

const ctx = 'table of postgres query results';

export const PostgresDataTable = ({ query, context = ctx, ...props }: PostgresDataTableProps) => {
  const [columns, setColumns] = useState<PostgresDataTableColumnType[]>(props.columns || []);
  const [rows, setRows] = useState<PostgresDataTableRowType[]>(props.rows || []);
  const numFixedColumns = useMemo(() => columns.filter((c) => c.inPrimaryKey).length, [columns]);

  // TODO: Add *specific* context.
  const renderHeaderCell = useCallback(
    ({ column }: PostgresDataTableHeaderCellType) => (
      <PostgresColumnName column={column}>{column.name}</PostgresColumnName>
    ),
    []
  );

  // TODO: Add *specific* context.
  const renderDataCell = useCallback(
    ({ column, value }: PostgresDataTableDataCellType) => (
      <PostgresColumnValue column={column}>{value}</PostgresColumnValue>
    ),
    []
  );

  // TODO: Add *specific* context once query is analyzed and more is known about the data sources.
  return (
    <DataTable
      columns={columns}
      rows={rows}
      numFixedColumns={numFixedColumns}
      context={context}
      renderHeaderCell={(props) => renderHeaderCell(props as PostgresDataTableHeaderCellType)}
      renderDataCell={(props) => renderDataCell(props as PostgresDataTableDataCellType)}
    />
  );
};
