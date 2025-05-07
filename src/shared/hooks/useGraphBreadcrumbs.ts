/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Node } from "@xyflow/react";

export interface IBreadcrumb {
  id: string;
  label: string;
}

export const useGraphBreadcrumbs = (
  rootId: string | undefined,
  nodes: Node<any>[]
) => {
  const router = useRouter();
  // track only non-root crumbs
  const [childCrumbs, setChildCrumbs] = useState<IBreadcrumb[]>([]);

  useEffect(() => {
    if (!rootId) {
      // reset to only root
      setChildCrumbs([]);
      return;
    }
    // find label for this rootId
    const found = nodes.find((n) => n.id === rootId);
    const label = (found?.data as any).label ?? rootId;
    setChildCrumbs((prev) => {
      // if last crumb already this, no change
      if (prev.length && prev[prev.length - 1].id === rootId) {
        return prev;
      }
      return [...prev, { id: rootId, label }];
    });
  }, [rootId, nodes]);

  // full breadcrumb list always starts with the root entry
  const breadcrumbs = useMemo<IBreadcrumb[]>(
    () => [{ id: "", label: "Full Graph" }, ...childCrumbs],
    [childCrumbs]
  );

  /** Navigate to a crumb by its index in the full list */
  function goToCrumb(index: number) {
    const crumb = breadcrumbs[index];
    // if root index (0), clear to full graph
    if (index === 0) {
      setChildCrumbs([]);
      router.replace("/");
    } else {
      // navigate to that node
      setChildCrumbs((prev) => prev.slice(0, index));
      router.replace(`/?rootId=${crumb.id}&selectedId=${crumb.id}`);
    }
  }

  return { breadcrumbs, goToCrumb };
};
