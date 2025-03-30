export const extractIntrospectedColumnNames = (columns: string): string[] => {
  if (!columns || !columns.startsWith('{') || !columns.endsWith('}')) {
    return [];
  }
  const content = columns.slice(1, -1);
  return content ? content.split(',').map((column) => column.trim()) : [];
};
