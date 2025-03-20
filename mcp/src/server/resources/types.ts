export type Resource = {
  uri: string;
  handle: string;
  mimeType?: string;
  name?: string;
  description?: string;
  text?: string;
};

export enum ResourceType {
  Table = 'table',
  View = 'view',
}
