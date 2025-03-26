#!/usr/bin/env node
import { logger } from '@surface.dev/utils';
import { StdioServer } from '@surface.dev/mcp';
import { listResources, readResource } from './resources';
import { tools } from './tools/list';
import { version } from './version';

const server = new StdioServer({
  name: '@surface.mcp/postgres',
  version,
  tools,
  listResources,
  readResource,
});

async function runServer() {
  logger.info('Starting Postgres MCP server...');
  await server.connect();
}

runServer().catch(logger.error);
