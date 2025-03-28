import { Tool } from '@surface.dev/mcp';
export const tools: Tool[] = [];

// ============================
//  Select | Tool
// ============================

import { select } from './select/select';
import { SELECT_TOOL_NAME, SelectToolInputSchema } from './select/types';

tools.push({
  name: SELECT_TOOL_NAME,
  inputSchema: SelectToolInputSchema,
  call: select,
});
