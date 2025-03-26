import { Resource } from '@surface.dev/mcp';
import config from '../../config';
import { select } from '../../tools/select/select';
import * as sql from '../../postgres/sql/statements';
import { TableType } from '../../postgres/sql/types';
import { toResourceUri, toHandle } from '../../utils';

// ============================
//  View | Types
// ============================

export const VIEW_RESOURCE_TYPE = 'view';

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
  return {
    uri: toResourceUri(schema, VIEW_RESOURCE_TYPE, viewName),
    handle: toHandle(schema, viewName),
    name: `${schema}.${viewName} view`,
    description,
  };
};

// ============================
//  View | Read
// ============================

export async function readView(uri: string, schema: string, name: string): Promise<string> {
  return '';
}
