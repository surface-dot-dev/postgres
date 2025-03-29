import { Tool } from '@surface.dev/mcp';
import { select } from './select/select';
import { SELECT_TOOL_NAME, SelectToolInputSchema } from './select/types';

export const tools: Tool[] = [
  {
    name: SELECT_TOOL_NAME,
    inputSchema: SelectToolInputSchema,
    call: select,
  },
];
