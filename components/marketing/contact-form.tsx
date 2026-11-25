"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { submitInquiry } from "@/actions/inquiries";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
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

/** Without a site key the server rejects every submit, so block it up front. */
const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

type ContactFormProps = {
  defaultIntent?: InquiryIntent;
  /** Pre-selected area of interest (validated by the page). */
  defaultArea?: string;
  /** Page the form is embedded on, stored with the inquiry. */
  sourcePath?: string;
};

export function ContactForm({
  defaultIntent = "sales",
  defaultArea,
  sourcePath = ROUTES.contact,
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  /** Bumped after a failed submit so Turnstile issues a fresh challenge. */
  const [turnstileKey, setTurnstileKey] = useState(0);
  const sentHeadingRef = useRef<HTMLHeadingElement>(null);

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
      areaOfInterest: defaultArea as SubmitInquiryInput["areaOfInterest"],
      businessNeed: "",
      preferredContactMethod: "email",
      consent: undefined,
      turnstileToken: "",
      sourcePath,
    },
  });

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue],
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
        setTurnstileKey((key) => key + 1);
        return;
      }
      setSentMessage(
        result.message ??
          "Thanks — we received your inquiry and will be in touch.",
      );
    });
  }

  useEffect(() => {
    if (sentMessage) sentHeadingRef.current?.focus();
  }, [sentMessage]);

  if (sentMessage) {
    return (
      <div className="rounded-lg border border-hairline bg-surface px-6 py-10">
        <Text variant="brand">Sent</Text>
        <Heading
          ref={sentHeadingRef}
          tabIndex={-1}
          level="section"
          className="mt-3 outline-none"
        >
          We have your message
        </Heading>
        <Text variant="lead" className="mt-4 max-w-[48ch]">
          {sentMessage}
        </Text>
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
                items={INQUIRY_INTENTS}
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="contact-intent"
                  className="h-12 w-full text-base data-[size=default]:h-12"
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={
                    fieldState.error ? `contact-${field.name}-error` : undefined
                  }
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
              <FieldError id={`contact-${field.name}-error`}>
                {fieldState.error?.message}
              </FieldError>
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
              aria-describedby={
                errors.fullName ? "contact-fullName-error" : undefined
              }
              {...register("fullName")}
            />
            <FieldError id="contact-fullName-error">
              {errors.fullName?.message}
            </FieldError>
          </Field>
          <Field data-invalid={Boolean(errors.company)}>
            <FieldLabel htmlFor="contact-company">Company</FieldLabel>
            <Input
              id="contact-company"
              className="h-12 border-input px-3 text-base"
              autoComplete="organization"
              disabled={isPending}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={
                errors.company ? "contact-company-error" : undefined
              }
              {...register("company")}
            />
            <FieldError id="contact-company-error">
              {errors.company?.message}
            </FieldError>
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
              aria-describedby={
                errors.jobRole ? "contact-jobRole-error" : undefined
              }
              {...register("jobRole")}
            />
            <FieldError id="contact-jobRole-error">
              {errors.jobRole?.message}
            </FieldError>
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
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              {...register("email")}
            />
            <FieldError id="contact-email-error">
              {errors.email?.message}
            </FieldError>
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
                  items={COUNTRY_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    ref={field.ref}
                    id="contact-country"
                    className="h-12 w-full text-base data-[size=default]:h-12"
                    aria-invalid={Boolean(fieldState.error)}
                    aria-describedby={
                      fieldState.error
                        ? `contact-${field.name}-error`
                        : undefined
                    }
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
                <FieldError id={`contact-${field.name}-error`}>
                  {fieldState.error?.message}
                </FieldError>
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
                  items={AREA_OF_INTEREST_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    ref={field.ref}
                    id="contact-area"
                    className="h-12 w-full text-base data-[size=default]:h-12"
                    aria-invalid={Boolean(fieldState.error)}
                    aria-describedby={
                      fieldState.error
                        ? `contact-${field.name}-error`
                        : undefined
                    }
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
                <FieldError id={`contact-${field.name}-error`}>
                  {fieldState.error?.message}
                </FieldError>
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
            aria-describedby={
              errors.businessNeed ? "contact-businessNeed-error" : undefined
            }
            {...register("businessNeed")}
          />
          <FieldError id="contact-businessNeed-error">
            {errors.businessNeed?.message}
          </FieldError>
        </Field>

        <Controller
          name="preferredContactMethod"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel htmlFor="contact-method">
                Preferred contact
              </FieldLabel>
              <Select
                items={CONTACT_METHODS}
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="contact-method"
                  className="h-12 w-full text-base data-[size=default]:h-12"
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={
                    fieldState.error ? `contact-${field.name}-error` : undefined
                  }
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
              <FieldError id={`contact-${field.name}-error`}>
                {fieldState.error?.message}
              </FieldError>
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
                  ref={field.ref}
                  id="contact-consent"
                  checked={field.value === true}
                  disabled={isPending}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true ? true : undefined)
                  }
                  className="mt-0.5 size-5"
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={
                    fieldState.error ? `contact-${field.name}-error` : undefined
                  }
                />
                <FieldLabel
                  htmlFor="contact-consent"
                  className="font-normal leading-6 text-muted-foreground"
                >
                  {CONTACT_CONSENT_LABEL}
                </FieldLabel>
              </div>
              <FieldError id={`contact-${field.name}-error`}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Field data-invalid={Boolean(errors.turnstileToken)}>
          <TurnstileWidget
            key={turnstileKey}
            onToken={handleTurnstileToken}
            onExpire={clearTurnstileToken}
            onError={clearTurnstileToken}
          />
          <FieldError id="contact-turnstileToken-error">
            {errors.turnstileToken?.message}
          </FieldError>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="h-12 w-full text-[15px] sm:w-auto sm:min-w-44"
        disabled={isPending || !TURNSTILE_ENABLED}
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
