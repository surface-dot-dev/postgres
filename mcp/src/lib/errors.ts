// ============================
//  Database Errors
// ============================

export const CLIENT_ERROR = 'Postgres client error';

export const CONNECTION_ERROR = 'Postgres connection error';

export const QUERY_FAILED = 'Query failed';

export const DEADLOCK_RETRY = 'Deadlock detected, retrying...';

// ============================
//  Resource Errors
// ============================

export const RESOURCE_NOT_FOUND = 'Resource not found';

export const READING_RESOURCE_FAILED = 'Failed to read resource';

// ============================
//  Table Errors
// ============================

export const NO_PRIMARY_KEY = 'Table has no primary key';

export const NO_TABLE_ID = 'Table has no table oid';

export const POPULATING_TABLES_CACHE_FAILED = 'Error populating tables cache';

export const LISTING_TABLES_FAILED = 'Error listing tables';

export const READING_TABLES_FAILED = 'Error reading tables';

export const HASHING_TABLES_LIST_FAILED = 'Error hashing tables list';

export const HASHING_TABLES_FAILED = 'Error hashing table';
