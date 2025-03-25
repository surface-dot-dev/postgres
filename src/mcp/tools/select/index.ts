import { newTool } from '@surface.dev/tool-client';
import {
  SELECT_TOOL_NAME,
  SelectToolInput,
  SelectToolOutput,
  SelectToolOutputSchema,
} from './types';

export const select = newTool<SelectToolInput, SelectToolOutput>({
  name: SELECT_TOOL_NAME,
  outputSchema: SelectToolOutputSchema,
});

export { SelectToolInput, SelectToolOutput };
