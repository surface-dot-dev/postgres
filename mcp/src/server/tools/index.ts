import { Tool } from './types';
import { ToolName, SelectToolInputSchema } from '@shared/types';
import select from './select/call';

const tools: Tool[] = [
  {
    name: ToolName.Select,
    inputSchema: SelectToolInputSchema,
    call: select,
  },
];

export default tools;
