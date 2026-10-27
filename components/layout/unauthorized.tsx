import Link from "next/link";
import { LockKeyholeIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { buttonVariants } from "@/components/ui/button";
import { loginPath, ROUTES } from "@/constants/routes";

/**
 * 401 screen for intentional “signed out / session missing” UI when a
 * redirect to login is not appropriate. Proxy and `requireStaff` still
 * redirect in the common case.
 */
export function Unauthorized({
  description = "Sign in to continue. Your session may have ended or you opened a private link while signed out.",
  nextPath,
}: {
  description?: string;
  nextPath?: string;
}) {
  return (
    <ErrorScreen
      icon={LockKeyholeIcon}
      code="401"
      title="Sign in required"
      description={description}
    >
      <Link
        href={loginPath({ next: nextPath })}
        className={buttonVariants({ size: "cta" })}
      >
        Sign in
      </Link>
      <Link
        href={ROUTES.home}
        className={buttonVariants({ size: "cta", variant: "ink-outline" })}
      >
        Go home
      </Link>
    </ErrorScreen>
  );
}
