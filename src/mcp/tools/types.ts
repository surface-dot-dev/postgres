import { z } from 'zod';

export type { Tool } from '@surface.dev/mcp';

export type DatabaseRecord = { [key: string]: any };

export const DatabaseRecordSchema = z.record(z.string(), z.any());
