import { logger, sleep, randomIntegerInRange } from '@surface.dev/utils';
import { getPoolConnection } from '../../postgres/client';
import * as sql from '../../postgres/sql/statements';
import * as errors from '../../errors';
import config from '../../config';
import { SelectToolInput, SelectToolOutput } from './types';

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
  } catch (err) {
    await conn.query(sql.ROLLBACK);
    conn.release();

    // (Maybe) try again if deadlocked.
    const error = err as Error;
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

  return (result.rows || []) as SelectToolOutput;
}
