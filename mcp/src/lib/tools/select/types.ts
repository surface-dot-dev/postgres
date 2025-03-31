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
  query: string;
};

export const SelectToolInputSchema = z.object({
  query: z.string(),
});

// ============================
//  Select | Output
// ============================

export type SourceColumn = {
  name: string;
  type?: string;
  nullable?: boolean;
  default?: string | null;
  comment?: string | null;
  sourceId?: number;
};

export type Source = {
  id: number;
  schema: string;
  name: string;
  comment: string | null;
  primaryKey: PrimaryKey;
  outgoingForeignKeyConstraints: ForeignKeyConstraint[];
  incomingForeignKeyReferences: ForeignKeyConstraint[];
};

export type SelectToolOutput = {
  rows: Record<string, any>[];
  columns: SourceColumn[];
  sources: Source[];
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
