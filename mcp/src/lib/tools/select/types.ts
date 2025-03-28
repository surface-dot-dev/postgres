import { z } from 'zod';

// ============================
//  Select | Types
// ============================

export const SELECT_TOOL_NAME = 'select';

export type SelectToolInput = {
  query: string;
};
export const SelectToolInputSchema = z.object({
  query: z.string(),
});

export type SelectToolOutput = Record<string, any>[];
export const SelectToolOutputSchema = z.array(z.record(z.string(), z.any()));
