import Link from "next/link";
import { ConstructionIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function MaintenanceScreen({
  variant = "full",
  description,
}: {
  /** `full` = Level 2 public outage; `login` kept for rare auth-only messaging. */
  variant?: "full" | "login";
  description?: string;
}) {
  const copy =
    description ??
    (variant === "login"
      ? "Sign-in is temporarily limited while we perform maintenance. Administrators may still sign in."
      : "Telecel Global is temporarily unavailable while we perform scheduled maintenance. Please check back shortly.");

  return (
    <ErrorScreen
      icon={ConstructionIcon}
      code="503"
      title="We'll be right back"
      description={copy}
    >
      {variant === "login" ? (
        <Link href={ROUTES.home} className={buttonVariants({ size: "cta" })}>
          Go to home page
        </Link>
      ) : null}
    </ErrorScreen>
  );
}
