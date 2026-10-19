"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { signIn } from "@/actions/auth";
import type { LoginLabels } from "@/components/auth/auth-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/constants/locales";
import { authPath, ROUTES } from "@/constants/routes";
import { loginSchemaFor, type LoginInput } from "@/validations/auth";

export function LoginForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: LoginLabels;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? ROUTES.dashboard;
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchemaFor(locale)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await signIn(values, redirectTo);

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message ?? labels.successToast);
      router.push(result.redirectTo ?? ROUTES.dashboard);
      router.refresh();
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email">{labels.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          aria-invalid={Boolean(errors.email)}
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{labels.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        className="min-h-11 w-full sm:min-h-8"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2Icon className="animate-spin" />
            {labels.submittingLabel}
          </>
        ) : (
          labels.submitLabel
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {labels.noAccountPrompt}{" "}
        <Link
          href={authPath(locale, "signup")}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {labels.signUpLink}
        </Link>
      </p>
    </form>
  );
}
