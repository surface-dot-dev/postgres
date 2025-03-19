import { Pool } from 'pg';
import { logger, trimSlashes } from '@surface.dev/utils';
import * as errors from '@/errors';
import config from '@/config';

const dbUrl = new URL(config.DATABASE_URL);

export const DATA_SOURCE_URI = `postgres://${dbUrl.hostname}:${dbUrl.port}/${trimSlashes(
  dbUrl.pathname
)}`;

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  min: config.MIN_POOL_SIZE,
  max: config.MAX_POOL_SIZE,
  connectionTimeoutMillis: config.CONNECTION_TIMEOUT,
  statement_timeout: config.STATEMENT_TIMEOUT,
});

pool.on('error', (err) => logger.error(errors.CLIENT_ERROR, err));

export async function getPoolConnection() {
  let conn;
  try {
    conn = await pool.connect();
  } catch (err: unknown) {
    const error = err as Error;
    conn && conn.release();
    logger.error(errors.CONNECTION_ERROR, error);
    throw `${errors.CONNECTION_ERROR}: ${error?.message || error}`;
  }
  return conn;
}
