"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { signIn, signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginInput } from "@/validations/auth";

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
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@telecel.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={busy}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            disabled={busy}
            {...register("password")}
          />
          {errors.password ? (
            <p id="password-error" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="min-h-11 w-full sm:min-h-9" disabled={busy}>
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
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
            className="min-h-11 w-full sm:min-h-9"
            disabled={busy}
            onClick={onGoogle}
          >
            {isGooglePending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        </>
      ) : null}
    </div>
  );
}
