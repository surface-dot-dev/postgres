import config from '@mcp/config';

export const toResourceUri = (schema: string, resourceType: string, resourceName: string): string =>
  [config.DATA_SOURCE_URI, schema, resourceType, resourceName].join('/');

export const fromResourceUri = (
  uri: string
): { schema: string; resourceType: string; resourceName: string } => {
  const [schema, resourceType, resourceName] = uri.split('/').slice(-3);
  return { schema, resourceType, resourceName };
};

export const toHandle = (schema: string, resourceName: string): string =>
  `${schema}.${resourceName}`;
