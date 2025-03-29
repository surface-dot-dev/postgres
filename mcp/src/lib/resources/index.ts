import { Resources } from '@surface.dev/mcp';
import { table } from './table/table';
import { view } from './view/view';
import * as uri from './uri';

export const resources: Resources = {
  types: [table, view],
  uri: {
    root: uri.ROOT,
    pathTemplate: uri.PATH_TEMPLATE,
  },
};
