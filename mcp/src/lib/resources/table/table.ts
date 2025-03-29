import { Resource, ResourceType, ReadResourceParams } from '@surface.dev/mcp';
import config from '../../config';
import { select } from '../../tools/select/select';
import * as sql from '../../postgres/sql/statements';
import { TableType } from '../../postgres/sql/types';
import { toResourceUri } from '../uri';

// ============================
//  Table | Resource
// ============================

export const table: ResourceType = {
  name: 'table',
  mimeType: 'application/json',
  list: listTables,
  read: readTable,
};

// ============================
//  Table | Types
// ============================

type Table = {
  schema: string;
  name: string;
};

type CommentedTable = Table & {
  comment: string;
};

// ============================
//  Table | List
// ============================

export async function listTables(): Promise<Resource[]> {
  // List all *basic* tables in the exposed schemas.
  const query = sql.listTablesInSchemas(config.SCHEMAS, [TableType.Table]);
  const tables = (await select({ query })) as Table[];

  // Get the comments for each table.
  const commentedTables = (await select({
    query: sql.getTableComments(tables),
  })) as CommentedTable[];
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

export async function readTable({ schema, resourceName }: ReadResourceParams): Promise<any> {
  return {};
}
