import client from '../client';
import {
  SELECT_TOOL_NAME,
  SelectToolInput,
  SelectToolOutput,
  SelectToolOutputSchema,
} from './types';

export const select = async (input: SelectToolInput) => {
  return 'success';
};
// export const select = client.tool<SelectToolInput, SelectToolOutput>(
//   SELECT_TOOL_NAME,
//   SelectToolOutputSchema
// );

export { SelectToolInput, SelectToolOutput };
