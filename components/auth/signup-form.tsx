"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { signUp } from "@/actions/auth";
import type { SignupLabels } from "@/components/auth/auth-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/constants/locales";
import { authPath } from "@/constants/routes";
import { registerSchemaFor, type RegisterInput } from "@/validations/auth";

export function SignupForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: SignupLabels;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchemaFor(locale)),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const result = await signUp(values);

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message ?? labels.successToast);

      if (result.redirectTo) {
        router.push(result.redirectTo);
        router.refresh();
        return;
      }

      router.push(authPath(locale, "login"));
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="fullName">{labels.nameLabel}</Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          aria-invalid={Boolean(errors.fullName)}
          disabled={isPending}
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        ) : null}
      </div>
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
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">{labels.confirmPasswordLabel}</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={isPending}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
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
        {labels.hasAccountPrompt}{" "}
        <Link
          href={authPath(locale, "login")}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {labels.loginLink}
        </Link>
      </p>
      <p className="text-center text-xs text-muted-foreground">
        {labels.developerNote}
      </p>
    </form>
  );
}
