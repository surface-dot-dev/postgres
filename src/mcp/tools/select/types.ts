import { z } from 'zod';
import { DatabaseRecord, DatabaseRecordSchema } from '../types';

// Name -----------------

export const SELECT_TOOL_NAME = 'select';

// Input -----------------

export type SelectToolInput = {
  query: string;
};
export const SelectToolInputSchema = z.object({
  query: z.string(),
});

// Output -----------------

export type SelectToolOutput = DatabaseRecord[];
export const SelectToolOutputSchema = z.array(DatabaseRecordSchema);
