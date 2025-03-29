import { Resources } from '@surface.dev/mcp';
import { ROOT, PATH_TEMPLATE } from './uri';
import { table } from './table/table';
import { view } from './view/view';

export const resources: Resources = {
  uri: { root: ROOT, pathTemplate: PATH_TEMPLATE },
  types: [table, view],
};
