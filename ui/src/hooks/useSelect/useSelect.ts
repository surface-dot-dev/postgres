import { useState, useEffect } from 'react';
import { select } from '../../tools';
import type { SelectToolOutput } from '../../tools';

const defaultOutput: SelectToolOutput = {
  rows: [],
  columns: [],
  sources: [],
};

export const useSelect = (query: string) => {
  const [output, setOutput] = useState<SelectToolOutput>(defaultOutput);

  useEffect(() => {
    if (!query) {
      setOutput(defaultOutput);
      return;
    }

    const performQuery = async () => {
      const result = await select({ query }, { source: 'mcp' });
      setOutput(result);
    };
    performQuery();
  }, [query]);

  return output;
};
