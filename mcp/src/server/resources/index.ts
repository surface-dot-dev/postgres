import * as errors from '@/errors';
import { Resource, ResourceType } from '@shared/types';
import { fromResourceUri } from '@/utils/fmt';
import readTableResource from './table/read';
// import readViewResource from './view/read';

export async function readResource(uri: string): Promise<Resource> {
  const { schema, resourceName, resourceType } = fromResourceUri(uri);

  switch (resourceType as ResourceType) {
    case ResourceType.Table:
      return readTableResource(uri, schema, resourceName);
    // case ResourceType.View:
    //   return readViewResource(uri, schema, resourceName);
    default:
      throw `${errors.UNKNOWN_RESOURCE_TYPE}: ${resourceType}`;
  }
}
