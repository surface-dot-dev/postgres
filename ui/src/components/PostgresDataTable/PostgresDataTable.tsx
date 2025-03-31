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

export type PostgresDataTableProps = {
  source?: string;
  query?: string;
  context?: string;
  columns?: PostgresDataTableColumnType[];
  rows?: PostgresDataTableRowType[];
};

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
