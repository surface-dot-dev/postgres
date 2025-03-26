import { z } from 'zod';
import { Tool, ToolProxy } from '@surface.dev/mcp';
import { logger, sleep, randomIntegerInRange } from '@surface.dev/utils';
import { getPoolConnection } from '../../postgres/client';
import * as sql from '../../postgres/sql/statements';
import * as errors from '../../errors';
import config from '../../config';

// ============================
//  Select | Types
// ============================

export type SelectToolInput = {
  query: string;
};
export const SelectToolInputSchema = z.object({
  query: z.string(),
});

export type SelectToolOutput = Record<string, any>[];
export const SelectToolOutputSchema = z.array(z.record(z.string(), z.any()));

// ============================
//  Select | Call
// ============================

export async function select(
  { query }: SelectToolInput,
  attempt: number = 1
): Promise<SelectToolOutput> {
  const conn = await getPoolConnection();

  let result;
  try {
    await conn.query(sql.BEGIN_READ_ONLY_TX);
    result = await conn.query(query);
  } catch (err: unknown) {
    const error = err as Error;
    await conn.query(sql.ROLLBACK);
    conn.release();

    // (Maybe) try again if deadlocked.
    const message = error.message || error.toString() || '';
    const isDeadlock = message.toLowerCase().includes('deadlock');
    if (isDeadlock && attempt <= config.MAX_DEADLOCK_RETRIES) {
      logger.error(`${errors.DEADLOCK_RETRY} (${attempt}/${config.MAX_DEADLOCK_RETRIES})`);
      await sleep(randomIntegerInRange(50, 200)); // shake deadlock
      return await select({ query }, attempt + 1);
    }

    throw `${errors.QUERY_FAILED}: ${error?.message || error}`;
  }
  conn.release();

  if (!result) {
    logger.error(errors.EMPTY_QUERY_RESULT, query);
    throw `${errors.EMPTY_QUERY_RESULT}`;
  }

  return (result.rows || []) as SelectToolOutput;
}

// ============================
//  Select | Tool
// ============================

export const selectTool: Tool = {
  name: 'select',
  inputSchema: SelectToolInputSchema,
  call: select,
};

export const selectToolProxy = ToolProxy<SelectToolInput, SelectToolOutput>({
  name: selectTool.name,
  outputSchema: SelectToolOutputSchema,
});
