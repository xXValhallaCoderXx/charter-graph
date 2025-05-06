import { SystemInterface } from "@/shared/slices/interface/interface.types";

export interface System {
  id: string;
  name: string;
  category: string;
  parent_id: string | null;
}

export interface Graph {
  nodes: System[];
  edges: SystemInterface[];
}
