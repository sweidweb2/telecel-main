import type { Metadata } from "next";

import { loginReasonNotice } from "@/components/auth/auth-labels";
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getMaintenanceMode } from "@/data/site-settings";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { isMaintenanceActive } from "@/lib/maintenance";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const [mode, params] = await Promise.all([
    getMaintenanceMode(),
    searchParams,
  ]);
  const maintenanceOn = isMaintenanceActive(mode);

  const rawNext = typeof params.next === "string" ? params.next : undefined;
  const next = rawNext ? safeRedirectPath(rawNext) : undefined;
  const notice = loginReasonNotice(params.reason);

  return (
    <AuthShell
      title="Sign in"
      description={
        maintenanceOn
          ? "Maintenance is active. Only administrators can sign in."
          : "Telecel Global content management. Access is by invitation only."
      }
      notice={
        notice ? (
          <AuthNotice tone={notice.tone}>{notice.message}</AuthNotice>
        ) : maintenanceOn ? (
          <AuthNotice tone="info">
            Public sign-in is paused. Administrators may continue.
          </AuthNotice>
        ) : null
      }
    >
      <LoginForm next={next} googleEnabled={isGoogleAuthEnabled()} />
    </AuthShell>
  );
}
