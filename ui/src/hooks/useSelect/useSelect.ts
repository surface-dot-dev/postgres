import { useState, useEffect } from 'react';
import { select } from '../../tools';
import type { SelectToolOutput } from '../../tools';

const emptyOutput: SelectToolOutput = {
  rows: [],
  columns: [],
  sources: [],
};

/**
 * React Hook for executing a read-only SQL query against a Postgres Data Source.
 *
 * @param source - The name of the Postgres Data Source to query.
 * @param query - The SQL query to execute.
 * @returns The results of the query containing rows, columns, and sources.
 *
 * @example
 * const results = useSelect('pg_prod', `SELECT * FROM "public"."users"`);
 */
export const useSelect = (source: string, query: string): SelectToolOutput => {
  const [output, setOutput] = useState<SelectToolOutput>(emptyOutput);

  useEffect(() => {
    if (!source || !query) {
      setOutput(emptyOutput);
      return;
    }
    const performQuery = async () => {
      const result = await select({ query }, { source });
      setOutput(result);
    };
    performQuery();
  }, [source, query]);

  return output;
};
