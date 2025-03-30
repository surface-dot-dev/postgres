import { ident, literal } from 'pg-format';

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

export const doesTableExist = (schema: string, name: string): string =>
  `SELECT to_regclass('${ident(schema)}.${ident(name)}') IS NOT NULL as exists`;

export const getTableId = (schema: string, name: string): string =>
  `SELECT c.oid AS "tableId"
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace 
WHERE n.nspname = ${literal(schema)}
AND c.relname = ${literal(name)}`;

export const getTableRowCountEstimate = (schema: string, name: string): string =>
  `SELECT
    GREATEST(
        c.reltuples::bigint,
        t.n_live_tup,
        CASE 
            WHEN c.relpages = 0 THEN 0
            ELSE (c.reltuples/c.relpages) * (pg_relation_size('${ident(schema)}.${ident(
    name
  )}') / (current_setting('block_size')::integer))::bigint
        END
    ) AS estimate
FROM pg_catalog.pg_class c
JOIN pg_stat_user_tables t ON t.relid = c.oid
WHERE c.relname = ${literal(name)}
AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = ${literal(schema)})`;

export const getTableColumns = (schema: string, name: string): string =>
  `SELECT
    a.attnum AS id,
    a.attname AS name,
    pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
    a.atttypid AS "typeId",
    NOT a.attnotnull AS nullable,
    COALESCE(pg_get_expr(d.adbin, d.adrelid), '') AS default,
    COALESCE(col_description(a.attrelid, a.attnum), '') AS comment
FROM
    pg_catalog.pg_attribute a
LEFT JOIN
    pg_catalog.pg_attrdef d ON (a.attrelid = d.adrelid AND a.attnum = d.adnum)
JOIN
    pg_catalog.pg_class c ON (a.attrelid = c.oid)
JOIN
    pg_catalog.pg_namespace n ON (c.relnamespace = n.oid)
WHERE
    n.nspname = ${literal(schema)}
    AND c.relname = ${literal(name)}
    AND a.attnum > 0 
    AND NOT a.attisdropped 
ORDER BY
    a.attnum`;

export const getPrimaryKey = (schema: string, name: string): string =>
  `SELECT
    tc.constraint_name as name,
    array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS columns
FROM
    information_schema.table_constraints tc
JOIN
    information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    AND tc.table_name = kcu.table_name
WHERE
    tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = ${literal(schema)}
    AND tc.table_name = ${literal(name)}
GROUP BY
    tc.constraint_name`;

export const getTableIndexes = (schema: string, name: string): string =>
  `SELECT
    i.indexname as name,
    i.indexdef as definition,
    array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum)) AS columns,
    ix.indisunique AS "isUnique",
    am.amname AS "indexType"
FROM
    pg_indexes i
JOIN
    pg_class t ON i.tablename = t.relname
JOIN
    pg_class idx ON idx.relname = i.indexname
JOIN
    pg_index ix ON ix.indexrelid = idx.oid
JOIN
    pg_am am ON idx.relam = am.oid
JOIN
    pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
JOIN
    pg_namespace n ON n.oid = t.relnamespace
WHERE
    n.nspname = ${literal(schema)}
    AND i.tablename = ${literal(name)}
GROUP BY
    i.indexname,
    i.indexdef,
    ix.indisunique,
    am.amname`;

export const getTableUniqueConstraints = (schema: string, name: string): string =>
  `SELECT
    tc.constraint_name as name,
    array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS columns
FROM
    information_schema.table_constraints tc
JOIN
    information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    AND tc.table_name = kcu.table_name
WHERE
    tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = ${literal(schema)}
    AND tc.table_name = ${literal(name)}
GROUP BY
    tc.constraint_name`;

export const getTableOutgoingForeignKeyConstraints = (schema: string, name: string): string =>
  `SELECT
    tc.constraint_name as name,
    array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS "sourceColumns",
    ccu.table_schema AS "targetSchema", 
    ccu.table_name AS "targetTable",
    array_agg(ccu.column_name ORDER BY kcu.ordinal_position) AS "targetColumns"
FROM
    information_schema.table_constraints tc
JOIN
    information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    AND tc.table_name = kcu.table_name
JOIN
    information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.constraint_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = ${literal(schema)}
    AND tc.table_name = ${literal(name)}
GROUP BY
    tc.constraint_name,
    ccu.table_schema,
    ccu.table_name`;

export const getTableIncomingForeignKeyReferences = (schema: string, name: string): string =>
  `SELECT
    tc.constraint_name as name,
    tc.table_schema as "sourceSchema",
    tc.table_name as "sourceTable",
    array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS "sourceColumns",
    array_agg(ccu.column_name ORDER BY kcu.ordinal_position) AS "targetColumns"
FROM
    information_schema.table_constraints tc
JOIN
    information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    AND tc.table_name = kcu.table_name
JOIN
    information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.constraint_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_schema = ${literal(schema)}
    AND ccu.table_name = ${literal(name)}
GROUP BY
    tc.constraint_name,
    tc.table_schema,
    tc.table_name`;
