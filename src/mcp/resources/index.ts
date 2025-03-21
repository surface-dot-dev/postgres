import * as errors from '../errors';
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
  const { schema, resourceName, resourceType } = fromResourceUri(uri);

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
