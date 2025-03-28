import { Pool, PoolClient } from 'pg';
import { logger } from '@surface.dev/utils';
import * as errors from '../errors';
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
