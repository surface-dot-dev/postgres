# Table

A basic table in a Postgres database.

## Interface

```typescript
interface Table {
  /**
   * The Postgres oid of the table.
   */
  id: number;
  /**
   * The Resource Type name.
   */
  type: string;
  /**
   * The name of the schema the table belongs to.
   */
  schema: string;
  /**
   * The name of the table.
   */
  name: string;
  /**
   * The comment on the table.
   */
  comment: string | null;
  /**
   * The estimated number of rows in the table.
   */
  estimatedRowCount: number;
  /**
   * The columns of the table.
   */
  columns: Column[];
  /**
   * The primary key of the table.
   */
  primaryKey: PrimaryKey;
  /**
   * The indexes of the table.
   */
  indexes: Index[];
  /**
   * The unique constraints of the table.
   */
  uniqueConstraints: UniqueConstraint[];
  /**
   * The outgoing foreign key constraints originating from the table (source).
   */
  outgoingForeignKeyConstraints: ForeignKeyConstraint[];
  /**
   * The incoming foreign key references that point to the table (target).
   */
  incomingForeignKeyReferences: ForeignKeyConstraint[];
}

// -- SUPPORTING TYPES ------

interface Column {
  /**
   * The sequential ordinal position of the column within its table (i.e. attnum).
   */
  id: number;
  /**
   * The name of the column.
   */
  name: string;
  /**
   * The type of the column (data type).
   */
  type: string;
  /**
   * The numeric id of the column's type (i.e. atttypid).
   */
  typeId: number;
  /**
   * Whether the column can be null.
   */
  nullable: boolean;
  /**
   * The default value of the column.
   */
  default: string | null;
  /**
   * The comment on the column.
   */
  comment: string | null;
}

interface PrimaryKey {
  /**
   * The name of the primary key constraint.
   */
  name: string;
  /**
   * The column names that are part of the primary key.
   */
  columns: string[];
}

interface Index {
  /**
   * The name of the index.
   */
  name: string;
  /**
   * The full definition of the index.
   */
  definition: string;
  /**
   * The column names that are part of the index.
   */
  columns: string[];
  /**
   * Whether the index is unique.
   */
  isUnique: boolean;
  /**
   * The type of the index (e.g. "btree").
   */
  indexType: string;
}

interface UniqueConstraint {
  /**
   * The name of the unique constraint.
   */
  name: string;
  /**
   * The column names that are part of the unique constraint.
   */
  columns: string[];
}

interface ForeignKeyConstraint {
  /**
   * The name of the foreign key constraint.
   */
  name: string;
  /**
   * The schema name of the source table.
   */
  sourceSchema: string;
  /**
   * The name of the source table.
   */
  sourceTable: string;
  /**
   * The column names on the source table that the foreign key constraint originates from.
   */
  sourceColumns: string[];
  /**
   * The schema name of the target table.
   */
  targetSchema: string;
  /**
   * The name of the target table.
   */
  targetTable: string;
  /**
   * The column names on the target table that the foreign key constraint references.
   */
  targetColumns: string[];
}
```