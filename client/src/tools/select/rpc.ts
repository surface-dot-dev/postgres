import { client } from '../client';
import { SelectToolInput, SelectToolOutput, ToolName } from '@shared/types';

export const select = client.Tool<SelectToolInput, SelectToolOutput>(ToolName.Select);
