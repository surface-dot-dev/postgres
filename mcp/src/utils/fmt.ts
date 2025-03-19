import { DATA_SOURCE_URI } from '@/data/source';

export const toResourceUri = (schema: string, resourceType: string, resourceName: string): string =>
  [DATA_SOURCE_URI, schema, resourceType, resourceName].join('/');

export const fromResourceUri = (
  uri: string
): { schema: string; resourceType: string; resourceName: string } => {
  const [schema, resourceType, resourceName] = uri.split('/').slice(-3);
  return { schema, resourceType, resourceName };
};

export const toHandle = (schema: string, resourceName: string): string =>
  `${schema}.${resourceName}`;
