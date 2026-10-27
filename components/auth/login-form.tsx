"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { signIn, signInWithGoogle } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import {
  EMAIL_MAX,
  PASSWORD_MAX,
  loginSchema,
  type LoginInput,
} from "@/validations/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
      />
    </svg>
  );
}

export function LoginForm({
  next,
  googleEnabled,
}: {
  next?: string;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const busy = isPending || isGooglePending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await signIn(values, next);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message ?? "Signed in.");
      router.push(result.redirectTo ?? ROUTES.dashboard);
      router.refresh();
    });
  }

  function onGoogle() {
    startGoogleTransition(async () => {
      // Redirects to Google on success; only returns on failure.
      const result = await signInWithGoogle(next);
      if (result?.status === "error") toast.error(result.message);
    });
  }

  return (
    <div className="grid gap-4">
      <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              className="h-12 border-input px-3 text-base"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@telecel.com"
              maxLength={EMAIL_MAX}
              aria-invalid={Boolean(errors.email)}
              disabled={busy}
              {...register("email")}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field data-invalid={Boolean(errors.password)}>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href={`${ROUTES.contact}?intent=general`}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password? Contact us
              </Link>
            </div>
            <PasswordInput
              className="h-12 border-input px-3 text-base"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              maxLength={PASSWORD_MAX}
              aria-invalid={Boolean(errors.password)}
              disabled={busy}
              {...register("password")}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
        </FieldGroup>
        <Button type="submit" className="h-12 w-full text-[15px]" disabled={busy}>
          {isPending ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {googleEnabled ? (
        <>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground uppercase">or</span>
            <Separator className="flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-[15px]"
            disabled={busy}
            onClick={onGoogle}
          >
            {isGooglePending ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </Button>
        </>
      ) : null}
    </div>
  );
}
