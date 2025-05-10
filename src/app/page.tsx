"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, Slide } from "react-toastify";

import { AppHeader } from "@/shared/components/organisms";
import { Typography, Card } from "@/shared/components/atoms";

const GraphPanel = dynamic(
  () => import("@/shared/components/organisms/GraphPanel"),
  { ssr: false }
);
const SystemSection = dynamic(
  () => import("@/shared/components/organisms/SystemSection/SystemSection"),
  { ssr: false }
);
const InterfaceDetails = dynamic(
  () =>
    import("@/shared/components/organisms/InterfaceSection/InterfaceSection"),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <div>
        <AppHeader />
        <div className="flex flex-col lg:flex-row p-10 lg:p-6 gap-10 lg:gap-8 ">
          <section
            id="flow-diagram "
            style={{ height: "calc(100vh - 110px)" }}
            className="w-full lg:w-2/3 2xl:w-4/6 flex gap-4 flex-col"
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
            className="w-full lg:w-1/3  2xl:w-2/6 flex flex-col gap-10 lg:gap-6 lg:pt-12"
          >
            <Card className="min-h-[600px] md:min-h-0">
              <Suspense fallback={<div className="p-4">Loading system…</div>}>
                <SystemSection />
              </Suspense>
            </Card>

            <Card className="min-h-[600px] md:min-h-0">
              <Suspense
                fallback={<div className="p-4">Loading interfaces…</div>}
              >
                <InterfaceDetails />
              </Suspense>
            </Card>
          </section>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        transition={Slide}
      />
    </div>
  );
}
