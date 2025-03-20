import { Resource, ResourceType } from '@shared/types';
import config from '@/config';
import select from '@/server/tools/select/call';
import * as sql from '@/data/sql/statements';
import { TableType } from '@/data/sql/types';
import { toResourceUri, toHandle } from '@/utils/fmt';

type Table = {
  schema: string;
  name: string;
};

type CommentedTable = Table & {
  comment: string;
};

async function listTableResources(): Promise<Resource[]> {
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

  // Return resources for each table.
  return tables.map(({ schema, name }) => {
    const comment = commentsByTablePath.get(`${schema}.${name}`);
    return formatAsListedResource(schema, name, comment);
  });
}

const formatAsListedResource = (
  schema: string,
  tableName: string,
  tableComment?: string
): Resource => {
  let description = `The "${tableName}" table in the "${schema}" schema`;
  if (tableComment) {
    description += `: ${tableComment}`;
  }
  return {
    uri: toResourceUri(schema, ResourceType.Table, tableName),
    handle: toHandle(schema, tableName),
    name: `${schema}.${tableName} table`,
    description,
  };
};

export default listTableResources;
