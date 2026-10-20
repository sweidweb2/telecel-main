import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      description="Enter your work email and we will send you a link to choose a new password."
      footer={
        <Link
          href={ROUTES.login}
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
