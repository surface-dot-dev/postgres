import { Pool, PoolClient, QueryResult } from 'pg';
import { logger, sleep, randomIntegerInRange } from '@surface.dev/utils';
import * as errors from '../errors';
import * as sql from './sql/statements';
import config from '../config';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  min: config.MIN_POOL_SIZE,
  max: config.MAX_POOL_SIZE,
  connectionTimeoutMillis: config.CONNECTION_TIMEOUT,
  statement_timeout: config.STATEMENT_TIMEOUT,
});
pool.on('error', (err) => logger.error(errors.CLIENT_ERROR, err));

export async function getPoolConnection(): Promise<PoolClient> {
  let conn: PoolClient;
  try {
    conn = await pool.connect();
  } catch (err) {
    const error = err as Error;
    logger.error(errors.CONNECTION_ERROR, error);
    throw `${errors.CONNECTION_ERROR}: ${error?.message || error}`;
  }
  return conn;
}

export async function performReadQuery(query: string, attempt: number = 1): Promise<QueryResult> {
  const conn = await getPoolConnection();

  let result: QueryResult;
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
      return await performReadQuery(query, attempt + 1);
    }

    throw `${errors.QUERY_FAILED}: ${error?.message || error}`;
  }
  conn.release();

  return result;
}
