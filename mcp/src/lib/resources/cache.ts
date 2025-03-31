import { Column, PrimaryKey, ForeignKeyConstraint, TableType } from '../postgres/sql/types';
import { toChunks, sleep, logger, formatError } from '@surface.dev/utils';
import config from '../config';
import * as sql from '../postgres/sql/statements';
import { performReadQuery } from '../postgres/client';
import { readTable, Table, hashTablesList, hashTable } from './table/table';
import * as errors from '../errors';

const tablesCache = new Map<number, CachedTable>();

let detectingChanges = false;
let tablesListHash: string | null = null;

type CachedTable = {
  hash: string;
  schema: string;
  name: string;
  comment: string | null;
  primaryKey: PrimaryKey;
  outgoingForeignKeyConstraints: ForeignKeyConstraint[];
  incomingForeignKeyReferences: ForeignKeyConstraint[];
  columns: Map<number, Column>;
};

export function getCachedTable(tableId: number): CachedTable | null {
  return tablesCache.get(tableId) || null;
}

export async function populateTablesCache(targetTables?: { schema: string; name: string }[]) {
  // Populate tables-list hash the first time this is called.
  if (tablesListHash === null) {
    try {
      tablesListHash = await hashTablesList();
    } catch (err) {
      logger.error(formatError(errors.HASHING_TABLES_LIST_FAILED, err));
      return detectSchemaChanges();
    }
  }

  // Get a list of all tables in the exposed schemas.
  let tables: { schema: string; name: string }[];
  try {
    tables =
      targetTables ||
      (await performReadQuery(sql.listTablesInSchemas(config.SCHEMAS, [TableType.Table]))).rows;
  } catch (err) {
    logger.error(formatError(errors.LISTING_TABLES_FAILED, err));
    return;
  }

  // Get full details for each table.
  const tableBatches = toChunks(tables, config.SCHEMA_DETECTION_BATCH_SIZE);
  const detailedTables: Table[] = [];
  for (const batch of tableBatches) {
    await sleep(config.SCHEMA_DETECTION_BATCH_DELAY);
    try {
      detailedTables.push(
        ...(await Promise.all(
          batch.map((t) => readTable({ schema: t.schema, resourceName: t.name }))
        ))
      );
    } catch (err) {
      logger.error(formatError(errors.READING_TABLES_FAILED, err));
      return;
    }
  }

  // Get the schema hash for each table.
  const tableHashes: string[] = [];
  for (const batch of tableBatches) {
    await sleep(config.SCHEMA_DETECTION_BATCH_DELAY);
    try {
      tableHashes.push(...(await Promise.all(batch.map((t) => hashTable(t.schema, t.name)))));
    } catch (err) {
      logger.error(formatError(errors.HASHING_TABLES_FAILED, err));
      return;
    }
  }

  // Index tables (and-> columns) by id.
  detailedTables.forEach((table, i) => {
    const columnsMap = new Map<number, Column>();
    for (const column of table.columns) {
      columnsMap.set(column.id, column);
    }
    tablesCache.set(table.id, {
      hash: tableHashes[i],
      schema: table.schema,
      name: table.name,
      comment: table.comment,
      primaryKey: table.primaryKey,
      outgoingForeignKeyConstraints: table.outgoingForeignKeyConstraints,
      incomingForeignKeyReferences: table.incomingForeignKeyReferences,
      columns: columnsMap,
    });
  });

  // Kick off schema-detection job.
  if (!detectingChanges) {
    detectingChanges = true;
    detectSchemaChanges();
  }
}

async function detectSchemaChanges() {
  await sleep(config.SCHEMA_DETECTION_INTERVAL);

  // Check the list of tables for changes.
  let newTablesListHash;
  try {
    newTablesListHash = await hashTablesList();
  } catch (err) {
    logger.error(formatError(errors.HASHING_TABLES_LIST_FAILED, err));
    return detectSchemaChanges();
  }
  if (newTablesListHash !== tablesListHash) {
    tablesListHash = newTablesListHash;
    logger.info('Detected change in tables list. Repopulating cache...');
    await populateTablesCache(); // repopulate from scratch.
    return detectSchemaChanges();
  }

  // Check the schema of each table for changes.
  const cachedTables = [...tablesCache.values()].map(({ hash, schema, name }) => ({
    hash,
    schema,
    name,
  }));
  const cachedTableBatches = toChunks(cachedTables, config.SCHEMA_DETECTION_BATCH_SIZE);
  const tableHashes: string[] = [];
  for (const batch of cachedTableBatches) {
    await sleep(config.SCHEMA_DETECTION_BATCH_DELAY);
    try {
      tableHashes.push(...(await Promise.all(batch.map((t) => hashTable(t.schema, t.name)))));
    } catch (err) {
      logger.error(formatError(errors.HASHING_TABLES_FAILED, err));
      return detectSchemaChanges();
    }
  }
  const changedTables: { schema: string; name: string }[] = [];
  for (let i = 0; i < cachedTables.length; i++) {
    if (cachedTables[i].hash !== tableHashes[i]) {
      changedTables.push({ schema: cachedTables[i].schema, name: cachedTables[i].name });
    }
  }
  if (changedTables.length) {
    logger.info(
      `Detected schema changes in the following tables: ${changedTables
        .map((t) => `${t.schema}.${t.name}`)
        .join(', ')}. Repopulating cache...`
    );

    await populateTablesCache(changedTables);
  }

  return detectSchemaChanges();
}
