"use client";

import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updatePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import {
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
      <div className="grid gap-2">
        <Label htmlFor="password">New password</Label>
        <Input
          className="h-12 border-input px-3 text-base"
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby="password-hint"
          disabled={isPending}
          {...register("password")}
        />
        <p
          id="password-hint"
          className={
            errors.password
              ? "text-sm text-destructive"
              : "text-xs text-muted-foreground"
          }
        >
          {errors.password?.message ??
            `At least ${PASSWORD_MIN} characters with upper and lower case letters and a number.`}
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          className="h-12 border-input px-3 text-base"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
          disabled={isPending}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p id="confirm-error" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
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
