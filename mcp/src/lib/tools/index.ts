import { Tool } from '@surface.dev/mcp';
export const tools: Tool[] = [];

// ============================
//  Select
// ============================

import { selectTool, selectToolClient, SelectToolInput, SelectToolOutput } from './select/select';
export { selectToolClient as select, SelectToolInput, SelectToolOutput };
tools.push(selectTool);
