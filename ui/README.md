# Surface Postgres

The `@surface.ui/postgres` integration library is a collection of Tools, Hooks, and specialized Components that enable developers to quickly create data-driven Surface Apps that interface directly with Postgres databases while maintaining consistent UI patterns and security best practices. It offers ready-to-use Components for common data operations and visualizations, powerful Hooks for custom data fetching, and low-level Tools for complex query building.

First, we'll examine each of these building blocks in detail, organized by Surface concept: Tools, Hooks, and Components. Then, we'll detail each of the library's complementary helper functions. Finally, we'll discuss more general best practices to implement when using this library.

## Tools

The following Tools implement common operations—exposed as RPCs—that can be performed against any Postgres database in a Surface App's target stack.

### select

The `select` Tool executes a read-only SQL query against a Postgres Data Source, returning the results with metadata about the underlying data sources.

#### Function Signature

```typescript
/**
 * @param input - Input parameters to the `select` Tool call
 * @param dataSource - The Data Source to perform the `select` Tool call on
 */
async function select(input: SelectToolInput, dataSource: DataSource): Promise<SelectToolOutput>;
```

#### Supporting Types

```typescript
type SelectToolInput = {
  /**
   * The SQL query to execute
   */
  query: string;
};

type DataSource = {
  /**
   * The unique name of the Data Source in the stack
   */
  source: string;
};

type SelectToolOutput = {
  /**
   * Array of result rows from the executed SQL query, where each row is a
   * key-value record
   */
  rows: Record<string, any>[];

  /**
   * Metadata about the columns returned in the query result, including their
   * source tables when available
   */
  columns: SourceColumn[];

  /**
   * Metadata about all unique tables that were sourced by the query
   */
  sources: Source[];
};

type SourceColumn = {
  /**
   * The name of the column as it appears in the query result
   */
  name: string;

  /**
   * The PostgreSQL data type of the column (undefined for computed columns)
   */
  type?: string;

  /**
   * Whether the column allows NULL values (undefined for computed columns)
   */
  nullable?: boolean;

  /**
   * The default value for the column if specified (undefined for computed columns)
   */
  default?: string | null;

  /**
   * Any comments associated with the column in the database (undefined for computed columns)
   */
  comment?: string | null;

  /**
   * The Postgres oid of the table that this column belongs to (undefined for computed columns)
   */
  sourceId?: number;
};

type Source = {
  /**
   * The Postgres oid of the source table.
   */
  id: number;

  /**
   * The name of the schema containing this source table
   */
  schema: string;

  /**
   * The name of the source table
   */
  name: string;

  /**
   * The comment on the source table
   */
  comment: string | null;

  /**
   * The primary key of the source table
   */
  primaryKey: PrimaryKey;

  /**
   * The outgoing foreign key constraints originating from this table (source).
   */
  outgoingForeignKeyConstraints: ForeignKeyConstraint[];

  /**
   * The incoming foreign key references that point to this table (target).
   */
  incomingForeignKeyReferences: ForeignKeyConstraint[];
};
```

#### Example Usage

Here's a basic example of using the `select` Tool to perform a simple query on a Postgres table named `users`:

```javascript
import { select } from 'surface.ui/postgres';

async function main() {
  const { rows, columns, sources } = await select(
    { query: `select * from "public"."users"` },
    { source: 'pg_prod' }
  );

  console.log(
    `Query returned ${rows.length} rows 
    and sourced data from ${columns.length} columns 
    across ${sources.length} tables`
  );
}

main();
```

As demonstrated in the example above, not only does the `select` Tool return the resulting rows for a query, it also returns information about the underlying columns and tables that were used to source that query.

## Hooks

The following Hooks serve as wrapper functions that abstract away the complexity of using Postgres Tools directly, providing a more React-friendly interface. They make it easier to integrate Postgres operations into React components by handling state management, data fetching, and lifecycle events in a way that follows React conventions and best practices.

### useSelect

The `useSelect` Hook builds upon the `select` Tool, providing a simplified, React-friendly interface for executing read-only SQL queries against a Postgres Data Source.

#### Function Signature

```typescript
/**
 * @param source - The name of the Postgres Data Source to query.
 * @param query - The SQL query to execute.
 * @returns The results of the query containing rows, columns, and sources.
 */
function useSelect(source: string, query: string): SelectToolOutput;
```

Note that the `useSelect` Hook returns a `SelectToolOutput` type—identical to the output of the `select` Tool.

#### Example Usage

```jsx
import { useSelect } from 'surface.ui/postgres';

const SomeComponent = (props: { source: string, query: string }) => {
  const { rows, columns, sources } = useSelect(props.source, props.query);
  // ...
};
```

## Components

The following Components are specialized UI elements that source and display data from Postgres databases. These ready-to-use components integrate directly with Postgres databases while abstracting away the complexity of data operations and maintaining consistent patterns and best practices for data visualization and manipulation.

### PostgresDataTable

...

#### Props

```typescript
...
```

#### Supporting Types

```typescript
...
```

#### Example — Something

...

### PostgresColumnName

...desc

#### Props

```typescript
...
```

#### Example Usage

...

### PostgresColumnValue

...desc

#### Props

```typescript
...
```

#### Example Usage

...

## Helpers

...

### ident

...

#### Function Signature

```typescript

```

#### Example Usage

```typescript

```

### literal

...

#### Function Signature

```typescript

```

#### Example Usage

```typescript

```

## Best Practices

...probably some shit about how to form SQL queries, what to assume about the datasets, assume they're large, to always prioritize efficiency over everything else, etc...then think of some other things (maybe not even sql query related to talk about)
