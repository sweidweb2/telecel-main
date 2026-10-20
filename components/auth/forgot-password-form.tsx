"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { requestPasswordReset } from "@/actions/auth";
import { AuthNotice } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
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
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="h-12 border-input px-3 text-base"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@telecel.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="h-12 w-full text-[15px]" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2Icon className="animate-spin" />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
