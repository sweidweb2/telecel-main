"use client";

import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updatePassword } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@/validations/auth";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: UpdatePasswordInput) {
    startTransition(async () => {
      const result = await updatePassword(values);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message ?? "Password updated.");
      router.push(result.redirectTo ?? ROUTES.dashboard);
      router.refresh();
    });
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <PasswordInput
            className="h-12 border-input px-3 text-base"
            id="password"
            autoComplete="new-password"
            placeholder={`At least ${PASSWORD_MIN} characters, Aa1`}
            maxLength={PASSWORD_MAX}
            aria-invalid={Boolean(errors.password)}
            disabled={isPending}
            {...register("password")}
          />
          {errors.password ? (
            <FieldError>{errors.password.message}</FieldError>
          ) : (
            <FieldDescription>
              At least {PASSWORD_MIN} characters with upper and lower case
              letters and a number.
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.confirmPassword)}>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <PasswordInput
            className="h-12 border-input px-3 text-base"
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            maxLength={PASSWORD_MAX}
            aria-invalid={Boolean(errors.confirmPassword)}
            disabled={isPending}
            {...register("confirmPassword")}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
      </FieldGroup>
      <Button type="submit" className="h-12 w-full text-[15px]" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Saving…
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  );
}
