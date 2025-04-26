# Surface Postgres

The `@surface.ui/postgres` integration library is a collection of Tools, Hooks, and specialized Components that enable developers to quickly create data-driven Surface Apps that interface directly with Postgres databases while maintaining consistent UI patterns and security best practices. It offers ready-to-use Components for common data operations and visualizations, powerful Hooks for custom data fetching, and low-level Tools for complex query building.

First, we'll examine each of these building blocks in detail, organized by Surface concept: Tools, Hooks, and Components. Then, we'll detail each of the library's complementary helper functions. Finally, we'll discuss general best practices to implement when using this library.

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
import { select } from "surface.ui/postgres";

async function main() {
  const { rows, columns, sources } = await select(
    { query: `select * from "public"."users"` },
    { source: "pg_prod" } // name of Data Source in stack
  );

  console.log(
    `Query returned ${rows.length} rows 
    and sourced data from ${columns.length} columns 
    across ${sources.length} tables`
  );
}

main();
```

As demonstrated in the example above, not only does the `select` Tool return the results of a query, it also returns information about the underlying columns and tables that were used to source that query.

## Hooks

The following Hooks serve as wrapper functions that abstract away the complexity of using Postgres Tools directly, providing a more React-friendly interface. They make it easier to integrate Postgres operations into React components by handling state management, data fetching, and lifecycle events in a way that follows React conventions and best practices.

### useSelect

The `useSelect` Hook builds upon the `select` Tool, providing a simplified interface to execute read-only SQL queries against a Postgres Data Source.

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
import { useSelect } from "surface.ui/postgres";

const SomeComponent = (props: { source: string, query: string }) => {
  const { rows, columns, sources } = useSelect(props.source, props.query);
  // ...
};
```

## Components

The following Components are specialized UI elements that source and display data from Postgres databases. These ready-to-use components integrate directly with Postgres databases while abstracting away the complexity of data operations and maintaining consistent patterns and best practices for data visualization and manipulation.

### PostgresDataTable

The `PostgresDataTable` Component specializes the Surface UI framework's `DataTable` Component by integrating the `useSelect` Hook, creating a streamlined way to display results from any Postgres query. Use this Component whenever you need a straightforward way to display records from a Postgres Data Source.

#### Props

```typescript
/**
 * Props for the PostgresDataTable component.
 * Must choose between "query" mode and "static" mode.
 */
type PostgresDataTableProps = PostgresDataTableQueryProps | PostgresDataTableStaticProps;

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
```

As shown in the above type definitions, the `PostgresDataTable` Component can be configured in two mutually exclusive modes: "query" mode for dynamically fetching data directly from a Postgres database using `source` and `query` props, or "static" mode for displaying pre-fetched data using `columns` and `rows` props. "query" mode is by far the most common, while "static" mode is reserved for more specific cases where data has been preloaded from memory or cache.

#### Supporting Types

```typescript
/** Defines the structure of a column in a Postgres data table */
type PostgresDataTableColumnType = {
  /**
   * Name of the column, used as key to access row values
   */
  name: string;

  /**
   * The Postgres data type of the column
   */
  type: string;
};

/**
 * Represents a single row of data in the table.
 * A flexible object type where keys correspond to
 * column names and values can be of any type
 */
type PostgresDataTableRowType = Record<string, any>;

/**
 * Properties passed to header cell render functions for
 * customizing table headers
 */
type PostgresDataTableHeaderCellType = {
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
type PostgresDataTableDataCellType = {
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
```

#### Example — Basic Query

```jsx
import React from "react";
import { View, Main, PostgresDataTable } from "@surface.ui/postgres";

export const App = () => {
  const source = "pg_prod";
  const query = `SELECT * FROM users ORDER BY created_at DESC LIMIT 50`;

  return (
    <View>
      <Main>
        <PostgresDataTable
          source={source}
          query={query}
        />
      </Main>
    </View>
  );
};
```

In the above example, a Surface App uses the `PostgresDataTable` Component to display the 50 most recent records from a Postgres table named "users". The Component runs in "query" mode, which requires two parameters: the query to execute and the target Data Source. By internally combining `DataTable` with `useSelect`, the `PostgresDataTable` Component can dynamically fetch and display the query results in a polished, virtualized React table.

#### Example — Dynamic Queries

For dynamically constructed queries, this Library provides two helper functions—`ident` and `literal`—which properly escape values to prevent SQL injection attacks. Here's a basic example:

```jsx
import React, { useState } from "react";
import { View, Main, PostgresDataTable, ident, literal } from "@surface.ui/postgres";

export const App = () => {
  const [schemaName, setSchemaName] = useState("public");
  const [tableName, setTableName] = useState("users");
  const [ageFilter, ageFilter] = useState(30);

  // ...other stateful variables ...

  const source = "pg_prod";
  const query = `SELECT * FROM ${ident(schemaName)}.${ident(tableName)} WHERE age = ${literal(ageFilter)}`;

  // ... more component logic ...

  return (
    <View>
      <Main>
        <PostgresDataTable
          source={source}
          query={query}
        />
      </Main>
    </View>
  );
};
```

In this example, the `PostgresDataTable` Component displays results from a dynamically constructed query built using the `ident` and `literal` helper functions. These functions are essential when incorporating user-provided or dynamic values into SQL queries. They ensure proper escaping of identifiers and literals to prevent SQL injection attacks while keeping queries flexible. This approach works especially well for interactive Apps where users need to filter or customize their data views.

For more details about these helper functions, see the "Helpers" section below.

## Helpers

This library provides several helper functions that enhance its core functionality and integrate seamlessly with its primary building blocks.

### ident

The `ident` helper function safely escapes PostgreSQL identifiers (like table names, column names, etc.) to prevent SQL injection attacks while maintaining query flexibility.

#### Function Signature

```typescript
/**
 * Safely escapes a PostgreSQL identifier
 * @param value - The identifier to escape
 * @returns A safely escaped identifier string
 */
function ident(value: string): string;
```

#### Example Usage

```typescript
import { ident } from "@surface.ui/postgres";

// Safely construct a query with dynamic table/column names
const tableName = "users";
const columnName = "email";
const query = `SELECT ${ident(columnName)} FROM ${ident(tableName)}`;
// Result: SELECT "email" FROM "users"
```

### literal

The `literal` helper function safely escapes literal values in PostgreSQL queries to prevent SQL injection attacks while supporting dynamic query parameters.

#### Function Signature

```typescript
/**
 * Safely escapes a PostgreSQL literal value
 * @param value - The value to escape (supports various types)
 * @returns A safely escaped literal string
 */
function literal(value: string | number | boolean | null | Date): string;
```

#### Example Usage

```typescript
import { literal } from "@surface.ui/postgres";

// Safely construct a query with dynamic values
const age = 25;
const status = "active";
const query = `
  SELECT * FROM users 
  WHERE age > ${literal(age)} 
  AND status = ${literal(status)}
`;
// Result: SELECT * FROM users WHERE age > 25 AND status = 'active'
```

## Best Practices

...probably some shit about how to form SQL queries, what to assume about the datasets, assume they're large, to always prioritize efficiency over everything else, etc...then think of some other things (maybe not even sql query related to talk about)
