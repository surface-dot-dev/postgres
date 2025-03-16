import { PostgresDataTableColumnType } from '../../../types';
import { PostgresValue } from '../PostgresValue';

export type PostgresColumnValueProps = {
  column: PostgresDataTableColumnType;
  children: React.ReactNode;
  context?: string;
};

const ctx = (name: string, type: string) => `"${name}" column value (type "${type}")`;

export const PostgresColumnValue = ({ column, children, ...props }: PostgresColumnValueProps) => {
  const context = props.context || ctx(column.name, column.type);
  return (
    <PostgresValue type={column.type} context={context}>
      {children}
    </PostgresValue>
  );
};
