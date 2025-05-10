import { z } from 'zod';
import {
  PrimaryKey,
  PrimaryKeySchema,
  ForeignKeyConstraint,
  ForeignKeyConstraintSchema,
} from '../../postgres/sql/types';

export const SELECT_TOOL_NAME = 'select';

// ============================
//  Select | Input
// ============================

export type SelectToolInput = {
  /**
   * The SQL query to execute.
   */
  query: string;
};

export const SelectToolInputSchema = z.object({
  query: z.string(),
});

// ============================
//  Select | Output
// ============================

export type SelectToolOutput = {
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

export type SourceColumn = {
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

export type Source = {
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

export const SelectToolOutputSchema = z.object({
  rows: z.array(z.record(z.string(), z.any())),
  columns: z.array(
    z.object({
      name: z.string(),
      type: z.string().optional(),
      nullable: z.boolean().optional(),
      default: z.string().nullable().optional(),
      comment: z.string().nullable().optional(),
      sourceId: z.number().optional(),
    })
  ),
  sources: z.array(
    z.object({
      id: z.number(),
      schema: z.string(),
      name: z.string(),
      comment: z.string().nullable(),
      primaryKey: PrimaryKeySchema,
      outgoingForeignKeyConstraints: z.array(ForeignKeyConstraintSchema),
      incomingForeignKeyReferences: z.array(ForeignKeyConstraintSchema),
    })
  ),
});
