// import { useSearchParams } from "next/navigation";
import { useGraph } from "@/shared/hooks/useGraph";
const GraphPanel = () => {
  //   const params = useSearchParams();
  //   const router = useRouter();
  //   const rootId = params.get("rootId") ?? undefined;
  //   const selectedId = params.get("selectedId") ?? undefined;

  const { data: graph, isLoading } = useGraph();

  console.log("graph", graph);
  console.log("isLoading", isLoading);

  return <div>sfs</div>;
};

export default GraphPanel;
