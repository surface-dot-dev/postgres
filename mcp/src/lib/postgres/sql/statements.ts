import { literal } from 'pg-format';

export const BEGIN_READ_ONLY_TX = 'BEGIN TRANSACTION READ ONLY';

export const ROLLBACK = 'ROLLBACK';

export const listTablesInSchemas = (schemas: string[], tableTypes: string[]): string =>
  `SELECT table_schema as schema, table_name as name, table_type as type 
FROM information_schema.tables WHERE table_schema in (${schemas.map((s) => literal(s)).join(',')}) 
AND table_type in (${tableTypes.map((t) => literal(t)).join(',')})`;

export const hashTablesInSchemas = (schemas: string[], tableTypes: string[]): string =>
  `SELECT md5(string_agg(table_schema || '.' || table_name, ',' ORDER BY table_schema, table_name)) as hash 
FROM information_schema.tables WHERE table_schema in (${schemas.map((s) => literal(s)).join(',')}) 
AND table_type in (${tableTypes.map((t) => literal(t)).join(',')})`;

export const getTableComments = (tables: { schema: string; name: string }[]): string =>
  `SELECT n.nspname AS schema, c.relname as name, d.description AS comment 
FROM pg_description d 
JOIN pg_class c ON d.objoid = c.oid 
JOIN pg_namespace n ON c.relnamespace = n.oid 
WHERE ${tables
    .map(
      ({ schema, name }) =>
        `(n.nspname = ${literal(schema)} AND c.relname = ${literal(name)} AND d.objsubid = 0)`
    )
    .join(' OR ')}`;
