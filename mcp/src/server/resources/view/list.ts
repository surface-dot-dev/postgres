// import config from '@/config';
// import select from '@/mcp/server/tools/select';
// import * as sql from '@/sql/statements';
// import { TableType } from '@/sql/types';
// import { PostgresViewResource, ResourceType } from '../types';
// import { newResource } from '../shared';

// async function listViewResources(): Promise<PostgresViewResource[]> {
//   const results = await select(sql.listTablesInSchemas(config.SCHEMAS, [TableType.View]));
//   return results.map(({ table_schema, table_name }) => newViewResource(table_schema, table_name));
// };

// export const newViewResource = (schema: string, viewName: string): PostgresViewResource => newResource(
//   ResourceType.View,
//   schema,
//   viewName,
//   `${schema}.${viewName} view`,
//   `The "${viewName}" view in the "${schema}" schema`,
//   `${schema}.${viewName}`,
//   {
//     type: ResourceType.View,
//     schema,
//     name: viewName,
//   },
// );

// export default listViewResources;
