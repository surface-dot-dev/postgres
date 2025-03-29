import { ev, undelimit, trimSlashes } from '@surface.dev/utils';

const DATABASE_URL = ev('DATABASE_URL');
if (!DATABASE_URL) {
  throw 'Environment variable "DATABASE_URL" is required';
}

const config = {
  DATABASE_URL,
  SCHEMAS: undelimit(ev('SCHEMAS', 'public')),
  MIN_POOL_SIZE: Number(ev('MIN_POOL_SIZE', 1)),
  MAX_POOL_SIZE: Number(ev('MAX_POOL_SIZE', 5)),
  MAX_DEADLOCK_RETRIES: Number(ev('MAX_DEADLOCK_RETRIES', 10)),
  CONNECTION_TIMEOUT: Number(ev('CONNECTION_TIMEOUT', 30000)),
  STATEMENT_TIMEOUT: Number(ev('STATEMENT_TIMEOUT', 30000)),
};

export default config;
