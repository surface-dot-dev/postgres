// ============================
//  Generic Types
// ============================

export type Dict = { [key: string]: any };

export type DatabaseRecord = Dict;

// ============================
//  Resource Types
// ============================

export type Resource = {
  uri: string;
  handle: string;
  mimeType?: string;
  name?: string;
  description?: string;
  text?: string;
};

export enum ResourceType {
  Table = "table",
  View = "view",
}

// ============================
//  Tool Types
// ============================

export enum ToolName {
  Select = "select",
}

export type SelectToolInput = {
  query: string;
};

export type SelectToolOutput = DatabaseRecord[];
