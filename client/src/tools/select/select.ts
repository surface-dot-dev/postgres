import client from '../client';
import { ToolName, SelectToolInput, SelectToolOutput, SelectToolOutputSchema } from '@shared/types';

export const select = client.tool<SelectToolInput, SelectToolOutput>(
  ToolName.Select,
  SelectToolOutputSchema
);
