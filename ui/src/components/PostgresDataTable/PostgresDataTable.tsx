import { useCallback } from 'react';
import { DataTable } from '@surface.dev/ui';
import { useSelect } from '../../hooks/useSelect/useSelect';
import { PostgresColumnName } from '../PostgresColumnName';
import { PostgresColumnValue } from '../PostgresColumnValue';
import {
  PostgresDataTableColumnType,
  PostgresDataTableRowType,
  PostgresDataTableHeaderCellType,
  PostgresDataTableDataCellType,
} from './types';

export type PostgresDataTableProps =
  // Option #1: Given a query, columns & rows populate based on query results
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

export const PostgresDataTable = ({
  query = '',
  context = ctx,
  ...props
}: PostgresDataTableProps) => {
  const output = useSelect(query);
  const columns = props.columns ? props.columns : output.columns;
  const rows = props.rows ? props.rows : output.rows;

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
