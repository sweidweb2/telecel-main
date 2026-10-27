"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PASSWORD_MAX } from "@/validations/auth";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

/**
 * Password field with show/hide toggle. Caps length to PASSWORD_MAX by default.
 */
export function PasswordInput({
  className,
  maxLength = PASSWORD_MAX,
  disabled,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn(className, "pr-11")}
        maxLength={maxLength}
        disabled={disabled}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 z-10 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        onClick={() => setIsVisible((value) => !value)}
        disabled={disabled}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? (
          <EyeOffIcon className="size-4" aria-hidden />
        ) : (
          <EyeIcon className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
