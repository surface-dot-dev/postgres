import { Resource, ResourceType, ReadResourceParams } from '@surface.dev/mcp';
import config from '../../config';
import { select } from '../../tools/select/select';
import * as sql from '../../postgres/sql/statements';
import { TableType } from '../../postgres/sql/types';
import { toResourceUri } from '../uri';

// ============================
//  View | Resource
// ============================

export const view: ResourceType = {
  name: 'view',
  mimeType: 'application/json',
  list: listViews,
  read: readView,
  hash: hashViewsList,
};

// ============================
//  View | Types
// ============================

type View = {
  schema: string;
  name: string;
};

type CommentedView = View & {
  comment: string;
};

// ============================
//  View | List
// ============================

export async function listViews(): Promise<Resource[]> {
  // List all views in the exposed schemas.
  const query = sql.listTablesInSchemas(config.SCHEMAS, [TableType.View]);
  const views = (await select({ query })) as View[];
  if (!views.length) return [];

  // Get the comments for each view.
  const commentedViews = (await select({
    query: sql.getTableComments(views),
  })) as CommentedView[];
  const commentsByViewPath = new Map<string, string>();
  for (const commentedView of commentedViews) {
    commentsByViewPath.set(`${commentedView.schema}.${commentedView.name}`, commentedView.comment);
  }

  // Format resources for each view.
  return views.map(({ schema, name }) => {
    const comment = commentsByViewPath.get(`${schema}.${name}`);
    return formatViewAsListedResource(schema, name, comment);
  });
}

const formatViewAsListedResource = (
  schema: string,
  viewName: string,
  viewComment?: string
): Resource => {
  let description = `The "${viewName}" table in the "${schema}" schema`;
  if (viewComment) {
    description += `: ${viewComment}`;
  }
  let handle = viewName;
  if (schema !== 'public') {
    handle = `${schema}.${viewName}`;
  }
  return {
    uri: toResourceUri(view.name, schema, viewName),
    name: `${schema}.${viewName} view`,
    description,
    mimeType: view.mimeType,
    handle,
  };
};

// ============================
//  View | Read
// ============================

export async function readView({ schema, resourceName }: ReadResourceParams): Promise<any> {
  return {};
}

// ============================
//  View | Hash
// ============================

export async function hashViewsList(): Promise<string> {
  const result = await select({ query: sql.hashTablesInSchemas(config.SCHEMAS, [TableType.View]) });
  return result[0].hash || '';
}
