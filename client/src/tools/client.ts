// import { ToolResponse } from '@surface.dev/core';
// import { ToolName } from '@shared/types';

// /*
// TODO:
// - move all this into the core lib, inside some class or some shit
// - move ToolResponse into core lib as well.
// */

// export const callTool = async <I, O>(name: ToolName, input: I): Promise<ToolResponse<O>> => {
//   /*
//   // client.callTool(name, input)
//   // will already know if isError...
//   if isError=true, return { isError, error },
//   otherwise, parse the response, validate it as the correct type matching as O, and then return { isError: false, data: parsedText as O}
//   */
// };

// export const Tool = <I, O>(name: ToolName) => {
//   return (input: I) => callTool<I, O>(name, input);
// };
