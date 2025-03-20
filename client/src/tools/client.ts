import { ToolResponse } from './types';

export const callTool = async <I, O>(name: string, input: I): Promise<ToolResponse<O>> => {
  /*
  // client.callTool(name, input) 
  // will already know if isError...
  if isError=true, return { isError, error }, 
  otherwise, parse the response, validate it as the correct type matching as O, and then return { isError: false, data: parsedText as O}
  */
};

export const Tool = <I, O>(name: string) => {
  return (input: I) => callTool<I, O>(name, input);
};
