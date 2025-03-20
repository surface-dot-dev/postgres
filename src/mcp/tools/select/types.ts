import { z } from 'zod';
import { DatabaseRecord, DatabaseRecordSchema } from '../types';

export const SELECT_TOOL_NAME = 'select';

export type SelectToolInput = {
  query: string;
};

export const SelectToolInputSchema = z.object({
  query: z.string(),
});

export type SelectToolOutput = DatabaseRecord[];

export const SelectToolOutputSchema = z.array(DatabaseRecordSchema);
