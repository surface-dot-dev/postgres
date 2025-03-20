import { z } from 'zod';

export type Tool = {
  name: string;
  inputSchema: any;
  call: (input: any) => Promise<any>;
};

export type DatabaseRecord = { [key: string]: any };

export const DatabaseRecordSchema = z.record(z.string(), z.any());