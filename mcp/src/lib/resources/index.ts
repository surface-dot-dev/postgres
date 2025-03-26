import * as errors from '../errors';
import config from '../config';
import { Resource, Resources } from '@surface.dev/mcp';
import { fromResourceUri, toHandle } from '../utils';
import { listTables, readTable, TABLE_RESOURCE_TYPE } from './table/table';
import { listViews, readView, VIEW_RESOURCE_TYPE } from './view/view';

async function listResources(): Promise<Resource[]> {
  const [tables, views] = await Promise.all([listTables(), listViews()]);
  return [...tables, ...views];
}

async function readResource(uri: string): Promise<Resource> {
  // Validate resource URI.
  if (!uri.startsWith(config.DATA_SOURCE_URI + '/')) {
    throw `${errors.INVALID_RESOURCE_URI}: ${uri}`;
  }
  const { schema, resourceName, resourceType } = fromResourceUri(uri);
  if (!schema || !resourceName || !resourceType) {
    throw `${errors.INVALID_RESOURCE_URI}: ${uri}`;
  }

  // Read specific resource by type.
  let text = '';
  switch (resourceType) {
    case TABLE_RESOURCE_TYPE:
      text = await readTable(uri, schema, resourceName);
      break;
    case VIEW_RESOURCE_TYPE:
      text = await readView(uri, schema, resourceName);
      break;
    default:
      throw `${errors.UNKNOWN_RESOURCE_TYPE}: ${resourceType}`;
  }

  return {
    uri,
    handle: toHandle(schema, resourceName),
    text,
  };
}

export const resources: Resources = {
  list: listResources,
  read: readResource,
};
