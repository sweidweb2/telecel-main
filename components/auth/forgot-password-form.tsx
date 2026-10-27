"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { requestPasswordReset } from "@/actions/auth";
import { AuthNotice } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  EMAIL_MAX,
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/validations/auth";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      setSentMessage(result.message ?? "Check your email for a reset link.");
    });
  }

  if (sentMessage) return <AuthNotice>{sentMessage}</AuthNotice>;

  return (
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
            disabled={isPending}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
      </FieldGroup>
      <Button type="submit" className="h-12 w-full text-[15px]" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
