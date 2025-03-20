import { z } from "zod";

// ============================
//  Generic Types
// ============================

export type Dict = { [key: string]: any };

export type DatabaseRecord = Dict;

export const DatabaseRecordSchema = z.record(z.string(), z.any());

// ============================
//  Tool Types
// ============================

export enum ToolName {
  Select = "select",
}

export type SelectToolInput = {
  query: string;
};

export const SelectToolInputSchema = z.object({
  query: z.string(),
});

export type SelectToolOutput = DatabaseRecord[];

export const SelectToolOutputSchema = z.array(DatabaseRecordSchema);
