import { PostgresDataTableColumnType } from '../PostgresDataTable';

export type PostgresColumnNameProps = {
  column: PostgresDataTableColumnType;
  children: string;
  context?: string;
};

const ctx = (type: string) => `column name (type "${type}")`;

export const PostgresColumnName = ({ column, children, ...props }: PostgresColumnNameProps) => {
  const context = props.context || ctx(column.type);
  return <span data-context={context}>{children}</span>;
};
