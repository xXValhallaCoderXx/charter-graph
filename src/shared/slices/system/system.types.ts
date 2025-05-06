export interface System {
  id: string;
  name: string;
  category: string;
  parent_id: string | null;
}

export interface SystemInterface {
  id: string;
  system_a_id: string;
  system_b_id: string;
  connection_type: string;
  directional: boolean;
}

export interface Graph {
  nodes: System[];
  edges: SystemInterface[];
}
