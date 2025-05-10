import { FieldDef } from 'pg';
import { performReadQuery } from '../../postgres/client';
import { SelectToolInput, SelectToolOutput, Source, SourceColumn } from './types';
import { getCachedTable } from '../../resources/cache';

// ============================
//  Select | Call
// ============================

/**
 * Executes a read-only SQL query and returns the results with metadata about the
 * underlying data sources.
 *
 * @param query - The SQL query to execute.
 */
export async function select({ query }: SelectToolInput): Promise<SelectToolOutput> {
  const { rows, fields } = await performReadQuery(query);
  const { columns, sources } = getUnderlyingDataSources(fields);
  return { rows, columns, sources };
}

function getUnderlyingDataSources(fields: FieldDef[]): {
  columns: SourceColumn[];
  sources: Source[];
} {
  const columns: SourceColumn[] = [];
  const sourceMap = new Map<number, Source>();

  for (const field of fields) {
    let column: SourceColumn = { name: field.name };

    // Computed columns.
    if (!field.tableID || !field.columnID) {
      column.type = 'computed';
      columns.push(column);
      continue;
    }

    // See if the full table details are available in the cache.
    const tableDetails = getCachedTable(field.tableID);
    if (!tableDetails) {
      columns.push(column);
      continue;
    }

    // Populate map of unique data sources used in the query.
    if (!sourceMap.has(field.tableID)) {
      sourceMap.set(field.tableID, {
        id: field.tableID,
        schema: tableDetails.schema,
        name: tableDetails.name,
        comment: tableDetails.comment,
        primaryKey: tableDetails.primaryKey,
        outgoingForeignKeyConstraints: tableDetails.outgoingForeignKeyConstraints,
        incomingForeignKeyReferences: tableDetails.incomingForeignKeyReferences,
      });
    }

    const columnDetails = tableDetails.columns.get(field.columnID);
    if (!columnDetails) {
      columns.push(column);
      continue;
    }

    // Enhance known column with full details.
    column.type = columnDetails.type;
    column.nullable = columnDetails.nullable;
    column.default = columnDetails.default;
    column.comment = columnDetails.comment;
    column.sourceId = field.tableID;
    columns.push(column);
  }

  return {
    columns,
    sources: [...sourceMap.values()],
  };
}
