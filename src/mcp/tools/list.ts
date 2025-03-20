import { Tool } from './types';
import { SELECT_TOOL_NAME, SelectToolInputSchema } from './select/types';
import select from './select/select';

export const tools: Tool[] = [
  {
    name: SELECT_TOOL_NAME,
    inputSchema: SelectToolInputSchema,
    call: select,
  },
];