import { Tool } from '@surface.dev/mcp';
export const tools: Tool[] = [];

// ============================
//  Select
// ============================

import { selectTool, selectToolProxy, SelectToolInput, SelectToolOutput } from './select/select';
export { selectToolProxy as select, SelectToolInput, SelectToolOutput };
tools.push(selectTool);
