"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleAlertIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  homeAsAnchor?: boolean;
};

export function RouteError({
  error,
  reset,
  homeAsAnchor = false,
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      icon={CircleAlertIcon}
      code="Error"
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or go back home."
      tone="destructive"
    >
      <Button type="button" className="w-full" onClick={reset}>
        Try again
      </Button>
      {homeAsAnchor ? (
        <a
          href={ROUTES.home}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Go home
        </a>
      ) : (
        <Link
          href={ROUTES.home}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Go home
        </Link>
      )}
      {error.digest ? (
        <p className="pt-1 text-center text-xs text-muted-foreground">
          Reference {error.digest}
        </p>
      ) : null}
    </ErrorScreen>
  );
}
