import * as errors from '../errors';
import config from '../config';
import { Resource, ResourceType } from './types';
import { fromResourceUri, toHandle } from './utils';
import listTableResources from './table/list';
import readTableResource from './table/read';
import listViewResources from './view/list';
import readViewResource from './view/read';

export async function listResources(): Promise<Resource[]> {
  const [tables, views] = await Promise.all([listTableResources(), listViewResources()]);
  return [...tables, ...views];
}

export async function readResource(uri: string): Promise<Resource> {
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
    case ResourceType.Table:
      text = await readTableResource(uri, schema, resourceName);
      break;
    case ResourceType.View:
      text = await readViewResource(uri, schema, resourceName);
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
