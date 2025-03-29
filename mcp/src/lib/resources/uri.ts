import config from '../config';
import { trimSlashes } from '@surface.dev/utils';

const { hostname, port, pathname } = new URL(config.DATABASE_URL);

export const ROOT = `postgres://${hostname}:${port}/${trimSlashes(pathname)}`;

export const PATH_TEMPLATE = '/:resourceType/:schema/:resourceName';

export const toResourceUri = (resourceType: string, schema: string, resourceName: string): string =>
  [ROOT, resourceType, schema, resourceName].join('/');
