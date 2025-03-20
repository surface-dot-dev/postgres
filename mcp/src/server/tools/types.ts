export type Tool = {
  name: string;
  inputSchema: any;
  call: (input: any) => Promise<any>;
};
