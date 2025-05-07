'use client';
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppHeader } from "@/shared/components/organisms";
import { Typography, Card } from "@/shared/components/atoms";

const GraphPanel = dynamic(
  () => import("@/shared/components/organisms/GraphPanel"),
  { ssr: false }
);
const SystemDetails = dynamic(
  () => import("@/shared/components/organisms/SystemDetails"),
  { ssr: false }
);
const InterfaceDetails = dynamic(
  () => import("@/shared/components/organisms/InterfaceDetails"),
  { ssr: false }
);

export default function Home() {
  const [qc] = useState(() => new QueryClient());

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
              <Suspense fallback={<div className="p-4">Loading graph…</div>}>
                <GraphPanel />
              </Suspense>
            </Card>
          </section>
          <section
            id="system-details"
            style={{ height: "calc(100vh - 110px)" }}
            className="w-full lg:w-1/3 flex flex-col gap-6 pt-12"
          >
            <Card>
              <Suspense fallback={<div className="p-4">Loading system…</div>}>
                <SystemDetails />
              </Suspense>
            </Card>

            <Card>
              <Suspense
                fallback={<div className="p-4">Loading interfaces…</div>}
              >
                <InterfaceDetails />
              </Suspense>
            </Card>
          </section>
        </div>
      </div>
    </QueryClientProvider>
  );
}
