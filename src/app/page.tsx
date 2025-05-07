'use client';
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppHeader,
  GraphPanel,
  InterfaceDetails,
  SystemDetails,
} from "@/shared/components/organisms";
import { Typography, Card } from "@/shared/components/atoms";

export default function Home() {
  const [qc] = useState(() => new QueryClient());
  const params = useSearchParams();

  const selectedId = params.get("selectedId") ?? "";
  return (
    <QueryClientProvider client={qc}>
      <div>
        <AppHeader />
        <div className="flex flex-col lg:flex-row p-6 gap-8 ">
          <section
            id="flow-diagram "
            style={{ height: "calc(100vh - 110px)" }}
            className="w-full lg:w-2/3 xl:w-5/6 flex gap-4 flex-col"
          >
            <div className="flex justify-between items-center">
              <Typography variant="h3">Graph Diagram</Typography>
            </div>
            <Card>
              <GraphPanel />
            </Card>
          </section>
          <section
            id="system-details"
            style={{ height: "calc(100vh - 110px)" }}
            className="w-full lg:w-1/3 flex flex-col gap-6 pt-12"
          >
            <Card>
              <SystemDetails systemId={selectedId} />
            </Card>

            <Card>
              <InterfaceDetails systemId={selectedId} />
            </Card>
          </section>
        </div>
      </div>
    </QueryClientProvider>
  );
}
