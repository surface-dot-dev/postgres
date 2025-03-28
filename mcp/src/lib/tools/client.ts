import { ToolClient } from '@surface.dev/mcp';

// ============================
//  Select | Tool Client
// ============================

import {
  SELECT_TOOL_NAME,
  SelectToolInput,
  SelectToolOutput,
  SelectToolOutputSchema,
} from './select/types';

export const select = ToolClient<SelectToolInput, SelectToolOutput>({
  name: SELECT_TOOL_NAME,
  outputSchema: SelectToolOutputSchema,
});

export { SelectToolInput, SelectToolOutput };
