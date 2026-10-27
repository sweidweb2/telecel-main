import { ConstructionIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";

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
    />
  );
}