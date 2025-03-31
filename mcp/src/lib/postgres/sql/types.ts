import { z } from 'zod';

export enum TableType {
  Table = 'BASE TABLE',
  View = 'VIEW',
}

export type Column = {
  id: number;
  name: string;
  type: string;
  typeId: number;
  nullable: boolean;
  default: string | null;
  comment: string | null;
};

export type PrimaryKey = {
  name: string;
  columns: string[];
};
export const PrimaryKeySchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
});

export type Index = {
  name: string;
  definition: string;
  columns: string[];
  isUnique: boolean;
  indexType: string;
};

export type UniqueConstraint = {
  name: string;
  columns: string[];
};

export type ForeignKeyConstraint = {
  name: string;
  sourceSchema: string;
  sourceTable: string;
  sourceColumns: string[];
  targetSchema: string;
  targetTable: string;
  targetColumns: string[];
};
export const ForeignKeyConstraintSchema = z.object({
  name: z.string(),
  sourceSchema: z.string(),
  sourceTable: z.string(),
  sourceColumns: z.array(z.string()),
  targetSchema: z.string(),
  targetTable: z.string(),
  targetColumns: z.array(z.string()),
});
