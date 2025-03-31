#!/usr/bin/env node

import { logger } from '@surface.dev/utils';
import { StdioServer } from '@surface.dev/mcp';
import { resources } from './lib/resources';
import { tools } from './lib/tools';
import { version } from './lib/version';
import { populateTablesCache } from './lib/resources/cache';

const server = new StdioServer({
  name: '@surface.mcp/postgres',
  version,
  tools,
  resources,
});

async function runServer() {
  logger.info('Populating tables cache...');
  await populateTablesCache();

  logger.info('Starting Postgres MCP server...');
  await server.connect();
}

runServer().catch(logger.error);
