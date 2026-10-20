import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { loginPath } from "@/constants/routes";
import { getSessionContext } from "@/data/auth";

export const metadata: Metadata = {
  title: "Choose a new password",
};

/**
 * Reached from a reset link (/auth/confirm signs the user in with a recovery
 * session) or by a signed-in user changing their password.
 */
export default async function UpdatePasswordPage() {
  const context = await getSessionContext();
  if (!context) redirect(loginPath({ reason: "auth-error" }));

  return (
    <AuthShell
      title="Choose a new password"
      description={`Signed in as ${context.email}. Other devices will be signed out.`}
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
