import type { Metadata } from "next";

import { loginReasonNotice } from "@/components/auth/auth-labels";
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { MaintenanceScreen } from "@/components/layout/maintenance-screen";
import { getMaintenanceFlags } from "@/data/site-settings";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { isLoginBlocked } from "@/lib/maintenance";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const flags = await getMaintenanceFlags();
  if (isLoginBlocked(flags)) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <MaintenanceScreen variant="login" />
      </div>
    );
  }

  const params = await searchParams;
  const rawNext = typeof params.next === "string" ? params.next : undefined;
  const next = rawNext ? safeRedirectPath(rawNext) : undefined;
  const notice = loginReasonNotice(params.reason);

  return (
    <AuthShell
      title="Sign in"
      description="Telecel Global content management. Access is by invitation only."
      notice={
        notice ? <AuthNotice tone={notice.tone}>{notice.message}</AuthNotice> : null
      }
    >
      <LoginForm next={next} googleEnabled={isGoogleAuthEnabled()} />
    </AuthShell>
  );
}
