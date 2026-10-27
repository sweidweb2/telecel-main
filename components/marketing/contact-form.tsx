"use client";

import { useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { submitInquiry } from "@/actions/inquiries";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  AREA_OF_INTEREST_OPTIONS,
  CONTACT_CONSENT_LABEL,
  CONTACT_METHODS,
  COUNTRY_OPTIONS,
  INQUIRY_INTENTS,
} from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import type { InquiryIntent } from "@/types/inquiry";
import {
  submitInquirySchema,
  type SubmitInquiryInput,
} from "@/validations/inquiries";

type ContactFormProps = {
  defaultIntent?: InquiryIntent;
};

export function ContactForm({ defaultIntent = "sales" }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmitInquiryInput>({
    resolver: zodResolver(submitInquirySchema),
    defaultValues: {
      intent: defaultIntent,
      fullName: "",
      company: "",
      jobRole: "",
      email: "",
      countryCode: undefined,
      areaOfInterest: undefined,
      businessNeed: "",
      preferredContactMethod: "email",
      consent: undefined,
      turnstileToken: "",
      sourcePath: ROUTES.contact,
    },
  });

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue]
  );

  const clearTurnstileToken = useCallback(() => {
    setValue("turnstileToken", "", { shouldValidate: true });
  }, [setValue]);

  function onSubmit(values: SubmitInquiryInput) {
    startTransition(async () => {
      const result = await submitInquiry(values);
      if (result.status === "error") {
        toast.error(result.message);
        clearTurnstileToken();
        return;
      }
      setSentMessage(
        result.message ?? "Thanks — we received your inquiry and will be in touch."
      );
    });
  }

  if (sentMessage) {
    return (
      <div className="rounded-lg border border-hairline bg-surface px-6 py-10">
        <p className="type-notation text-brand">Sent</p>
        <h2 className="mt-3 type-section text-ink">We have your message</h2>
        <p className="mt-4 max-w-[48ch] text-base leading-7 text-muted-foreground">
          {sentMessage}
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="intent"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel htmlFor="contact-intent">I want to</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  id="contact-intent"
                  className="h-12 w-full text-base"
                  aria-invalid={Boolean(fieldState.error)}
                >
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_INTENTS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.fullName)}>
            <FieldLabel htmlFor="contact-name">Full name</FieldLabel>
            <Input
              id="contact-name"
              className="h-12 border-input px-3 text-base"
              autoComplete="name"
              disabled={isPending}
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
            />
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>
          <Field data-invalid={Boolean(errors.company)}>
            <FieldLabel htmlFor="contact-company">Company</FieldLabel>
            <Input
              id="contact-company"
              className="h-12 border-input px-3 text-base"
              autoComplete="organization"
              disabled={isPending}
              aria-invalid={Boolean(errors.company)}
              {...register("company")}
            />
            <FieldError>{errors.company?.message}</FieldError>
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.jobRole)}>
            <FieldLabel htmlFor="contact-role">Role</FieldLabel>
            <Input
              id="contact-role"
              className="h-12 border-input px-3 text-base"
              autoComplete="organization-title"
              disabled={isPending}
              aria-invalid={Boolean(errors.jobRole)}
              {...register("jobRole")}
            />
            <FieldError>{errors.jobRole?.message}</FieldError>
          </Field>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="contact-email">Work email</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              className="h-12 border-input px-3 text-base"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="countryCode"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={Boolean(fieldState.error)}>
                <FieldLabel htmlFor="contact-country">Country</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="contact-country"
                    className="h-12 w-full text-base"
                    aria-invalid={Boolean(fieldState.error)}
                  >
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="areaOfInterest"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={Boolean(fieldState.error)}>
                <FieldLabel htmlFor="contact-area">Area of interest</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="contact-area"
                    className="h-12 w-full text-base"
                    aria-invalid={Boolean(fieldState.error)}
                  >
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREA_OF_INTEREST_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>

        <Field data-invalid={Boolean(errors.businessNeed)}>
          <FieldLabel htmlFor="contact-need">Business need</FieldLabel>
          <Textarea
            id="contact-need"
            className="min-h-28 border-input px-3 py-3 text-base"
            disabled={isPending}
            aria-invalid={Boolean(errors.businessNeed)}
            {...register("businessNeed")}
          />
          <FieldError>{errors.businessNeed?.message}</FieldError>
        </Field>

        <Controller
          name="preferredContactMethod"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel htmlFor="contact-method">Preferred contact</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  id="contact-method"
                  className="h-12 w-full text-base"
                  aria-invalid={Boolean(fieldState.error)}
                >
                  <SelectValue placeholder="How should we reach you?" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_METHODS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="consent"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="contact-consent"
                  checked={field.value === true}
                  disabled={isPending}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true ? true : undefined)
                  }
                  className="mt-0.5 size-5"
                  aria-invalid={Boolean(fieldState.error)}
                />
                <FieldLabel
                  htmlFor="contact-consent"
                  className="font-normal leading-6 text-muted-foreground"
                >
                  {CONTACT_CONSENT_LABEL}
                </FieldLabel>
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Field data-invalid={Boolean(errors.turnstileToken)}>
          <TurnstileWidget
            onToken={handleTurnstileToken}
            onExpire={clearTurnstileToken}
            onError={clearTurnstileToken}
          />
          <FieldError>{errors.turnstileToken?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="h-12 w-full text-[15px] sm:w-auto sm:min-w-44"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          "Send inquiry"
        )}
      </Button>
    </form>
  );
}
