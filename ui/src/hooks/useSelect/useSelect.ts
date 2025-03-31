import { useState, useEffect } from 'react';
import { select } from '../../tools';
import type { SelectToolOutput } from '../../tools';

const emptyOutput: SelectToolOutput = {
  rows: [],
  columns: [],
  sources: [],
};

export const useSelect = (source: string, query: string) => {
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
