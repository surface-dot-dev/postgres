#!/usr/bin/env node

import { logger } from '@surface.dev/utils';
import { StdioServer } from '@surface.dev/mcp';
import { resources } from './lib/resources';
import { tools } from './lib/tools';
import { version } from './lib/version';

const server = new StdioServer({
  name: '@surface.mcp/postgres',
  version,
  tools,
  resources,
});

async function runServer() {
  logger.info('Starting Postgres MCP server...');
  await server.connect();
}

runServer().catch(logger.error);
