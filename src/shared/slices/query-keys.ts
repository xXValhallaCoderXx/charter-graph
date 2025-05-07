export const QUERY_KEYS = {
  graphData: (rootId?: string) => ["graph-data", rootId] as const,
  system: (id: string) => ["system", id] as const,
  descendants: (id: string) => ["descendants", id] as const,

  interfaces: (rootId?: string) => ["interfaces", rootId] as const,
  interface: (id: string) => ["interface", id] as const,
};
