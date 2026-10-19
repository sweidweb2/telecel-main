"use client";

import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";

type RouteSkeletonProps = {
  /** Unique name — matched to a capture from `npm run bones:build`. */
  name: string;
  /** Shown until bones exist for `name` (before first CLI capture). */
  fallback: ReactNode;
  className?: string;
  /**
   * Dashboard routes sit inside a sidebar shell; use viewport width so
   * breakpoints match CLI captures. See boneyard #92.
   */
  select?: "container" | "viewport";
};

/**
 * Pixel-perfect route loading UI via [boneyard-js](https://github.com/0xGF/boneyard).
 * Use in colocated `loading.tsx` files. Pass the current shadcn layout as
 * `fallback` until bones are generated.
 */
export function RouteSkeleton({
  name,
  fallback,
  className,
  select = "viewport",
}: RouteSkeletonProps) {
  return (
    <Skeleton
      name={name}
      loading
      className={className}
      fallback={fallback}
      select={select}
    >
      {null}
    </Skeleton>
  );
}
