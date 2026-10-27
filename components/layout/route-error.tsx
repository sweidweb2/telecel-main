"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlertIcon } from "lucide-react";

import { reportRouteError } from "@/actions/report-route-error";
import { ErrorScreen } from "@/components/layout/error-screen";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export type RouteErrorProps = {
  error: Error & { digest?: string };
  /** Preferred recover — refreshes the router then clears the boundary. */
  retry?: () => void;
  /** Legacy recover — clears boundary state only. Used if `retry` is absent. */
  reset?: () => void;
  homeAsAnchor?: boolean;
};

export function RouteError({
  error,
  retry,
  reset,
  homeAsAnchor = false,
}: RouteErrorProps) {
  const recover = retry ?? reset;

  useEffect(() => {
    console.error(error);
    void reportRouteError({
      message: error.message,
      digest: error.digest ?? null,
      name: error.name ?? null,
    });
  }, [error]);

  return (
    <ErrorScreen
      icon={CircleAlertIcon}
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or go back home."
      tone="destructive"
    >
      {recover ? (
        <Button type="button" size="cta" onClick={recover}>
          Try again
        </Button>
      ) : null}
      {homeAsAnchor ? (
        <a
          href={ROUTES.home}
          className={buttonVariants({ size: "cta", variant: "ink-outline" })}
        >
          Go home
        </a>
      ) : (
        <Link
          href={ROUTES.home}
          className={buttonVariants({ size: "cta", variant: "ink-outline" })}
        >
          Go home
        </Link>
      )}
      {error.digest ? (
        <p className="basis-full pt-1 text-xs text-muted-foreground">
          Reference {error.digest}
        </p>
      ) : null}
    </ErrorScreen>
  );
}
