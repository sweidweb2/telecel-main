"use client";

import { ConstructionIcon, RotateCwIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { Button } from "@/components/ui/button";

export function MaintenanceScreen({ description }: { description?: string }) {
  return (
    <ErrorScreen
      icon={ConstructionIcon}
      code="503"
      title="We'll be right back"
      description={
        description ??
        "Telecel Global is temporarily unavailable while we perform scheduled maintenance. Please check back shortly."
      }
      logoHref={null}
    >
      <Button
        type="button"
        size="cta"
        aria-label="Try again (reload page)"
        onClick={() => window.location.reload()}
      >
        <RotateCwIcon data-icon="inline-start" aria-hidden />
        Try again
      </Button>
    </ErrorScreen>
  );
}
