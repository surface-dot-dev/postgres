import { Resource, ResourceType, ReadResourceParams } from '@surface.dev/mcp';
import { formatError } from '@surface.dev/utils';
import { extractIntrospectedColumnNames } from '../utils';
import * as errors from '../../errors';
import config from '../../config';
import { select } from '../../tools/select/select';
import * as sql from '../../postgres/sql/statements';
import { toResourceUri } from '../uri';
import {
  TableType,
  Column,
  Index,
  PrimaryKey,
  UniqueConstraint,
  ForeignKeyConstraint,
} from '../../postgres/sql/types';

// ============================
//  Table | Resource
// ============================

export const table: ResourceType = {
  name: 'table',
  mimeType: 'application/json',
  list: listTables,
  read: readTable,
  hash: hashTablesList,
};

// ============================
//  Table | List
// ============================

export async function listTables(): Promise<Resource[]> {
  // List all *basic* tables in the exposed schemas.
  const query = sql.listTablesInSchemas(config.SCHEMAS, [TableType.Table]);
  const tables = (await select({ query })) as { schema: string; name: string }[];
  if (!tables.length) return [];

  // Get the comments for each table.
  const commentedTables = await select({ query: sql.getTableComments(tables) });
  const commentsByTablePath = new Map<string, string>();
  for (const commentedTable of commentedTables) {
    commentsByTablePath.set(
      `${commentedTable.schema}.${commentedTable.name}`,
      commentedTable.comment
    );
  }

  // Format resources for each table.
  return tables.map(({ schema, name }) => {
    const comment = commentsByTablePath.get(`${schema}.${name}`);
    return formatTableAsListedResource(schema, name, comment);
  });
}

const formatTableAsListedResource = (
  schema: string,
  tableName: string,
  tableComment?: string
): Resource => {
  let description = `The "${tableName}" table in the "${schema}" schema`;
  if (tableComment) {
    description += `: ${tableComment}`;
  }
  let handle = tableName;
  if (schema !== 'public') {
    handle = `${schema}.${tableName}`;
  }
  return {
    uri: toResourceUri(table.name, schema, tableName),
    name: `${schema}.${tableName} table`,
    description,
    mimeType: table.mimeType,
    handle,
  };
};

// ============================
//  Table | Read
// ============================

type Table = {
  id: number;
  type: string;
  schema: string;
  name: string;
  comment: string | null;
  estimatedRowCount: number;
  columns: Column[];
  primaryKey: PrimaryKey;
  indexes: Index[];
  uniqueConstraints: UniqueConstraint[];
  outgoingForeignKeyConstraints: ForeignKeyConstraint[];
  incomingForeignKeyReferences: ForeignKeyConstraint[];
};

export async function readTable({
  schema,
  resourceName: name,
}: ReadResourceParams): Promise<Table> {
  const tableExists = await doesTableExist(schema, name);
  if (!tableExists) {
    throw formatError(errors.RESOURCE_NOT_FOUND, '', { type: table.name, schema, name });
  }

  const [
    id,
    comment,
    estimatedRowCount,
    columns,
    primaryKey,
    indexes,
    uniqueConstraints,
    outgoingForeignKeyConstraints,
    incomingForeignKeyReferences,
  ] = await Promise.all([
    getTableId(schema, name),
    getComment(schema, name),
    getRowCountEstimate(schema, name),
    getColumns(schema, name),
    getPrimaryKey(schema, name),
    getIndexes(schema, name),
    getUniqueConstraints(schema, name),
    getOutgoingForeignKeyConstraints(schema, name),
    getIncomingForeignKeyReferences(schema, name),
  ]);

  return {
    id,
    type: table.name,
    schema,
    name,
    comment,
    estimatedRowCount,
    columns,
    primaryKey,
    indexes,
    uniqueConstraints,
    outgoingForeignKeyConstraints,
    incomingForeignKeyReferences,
  };
}

async function doesTableExist(schema: string, name: string): Promise<boolean> {
  const results = await select({ query: sql.doesTableExist(schema, name) });
  return results[0].exists === true;
}

async function getTableId(schema: string, name: string): Promise<number> {
  const results = await select({ query: sql.getTableId(schema, name) });
  const data = results[0];
  if (!data) {
    throw formatError(errors.NO_TABLE_ID, '', { schema, name });
  }
  return Number(data.tableId);
}

async function getComment(schema: string, name: string): Promise<string | null> {
  const results = await select({ query: sql.getTableComments([{ schema, name }]) });
  return results[0]?.comment || null;
}

async function getRowCountEstimate(schema: string, name: string): Promise<number> {
  const results = await select({ query: sql.getTableRowCountEstimate(schema, name) });
  return Number(results[0]?.estimate || 0);
}

async function getColumns(schema: string, name: string): Promise<Column[]> {
  const results = await select({ query: sql.getTableColumns(schema, name) });
  return results.map((result) => ({
    id: Number(result.id),
    name: result.name,
    type: result.type,
    typeId: Number(result.typeId),
    nullable: result.nullable === true,
    default: result.default || null,
    comment: result.comment || null,
  }));
}

async function getPrimaryKey(schema: string, name: string): Promise<PrimaryKey> {
  const results = await select({ query: sql.getPrimaryKey(schema, name) });
  const pk = results[0];
  if (!pk) {
    throw formatError(errors.NO_PRIMARY_KEY, '', { schema, name });
  }
  return {
    name: pk.name,
    columns: extractIntrospectedColumnNames(pk.columns),
  };
}

async function getIndexes(schema: string, name: string): Promise<Index[]> {
  const results = await select({ query: sql.getTableIndexes(schema, name) });
  return results.map((result) => ({
    name: result.name,
    definition: result.definition,
    columns: extractIntrospectedColumnNames(result.columns),
    isUnique: result.isUnique === true,
    indexType: result.indexType,
  }));
}

async function getUniqueConstraints(schema: string, name: string): Promise<UniqueConstraint[]> {
  const results = await select({ query: sql.getTableUniqueConstraints(schema, name) });
  return results.map(({ name, columns }) => ({
    name,
    columns: extractIntrospectedColumnNames(columns),
  }));
}

async function getOutgoingForeignKeyConstraints(
  schema: string,
  name: string
): Promise<ForeignKeyConstraint[]> {
  const results = await select({ query: sql.getTableOutgoingForeignKeyConstraints(schema, name) });
  return results.map((constraint) => ({
    name: constraint.name,
    sourceSchema: schema,
    sourceTable: name,
    sourceColumns: extractIntrospectedColumnNames(constraint.sourceColumns),
    targetSchema: constraint.targetSchema,
    targetTable: constraint.targetTable,
    targetColumns: extractIntrospectedColumnNames(constraint.targetColumns),
  }));
}

async function getIncomingForeignKeyReferences(
  schema: string,
  name: string
): Promise<ForeignKeyConstraint[]> {
  const results = await select({ query: sql.getTableIncomingForeignKeyReferences(schema, name) });
  return results.map((constraint) => ({
    name: constraint.name,
    sourceSchema: constraint.sourceSchema,
    sourceTable: constraint.sourceTable,
    sourceColumns: extractIntrospectedColumnNames(constraint.sourceColumns),
    targetSchema: schema,
    targetTable: name,
    targetColumns: extractIntrospectedColumnNames(constraint.targetColumns),
  }));
}

// ============================
//  Table | Hash
// ============================

export async function hashTablesList(): Promise<string> {
  const result = await select({
    query: sql.hashTablesInSchemas(config.SCHEMAS, [TableType.Table]),
  });
  return result[0].hash || '';
}
