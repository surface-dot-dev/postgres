export type ToolResponse<T> = {
  isError: boolean;
  data?: T;
  error?: string;
};
