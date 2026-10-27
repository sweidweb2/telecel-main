"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        className={cn("pr-11", className)}
        maxLength={maxLength}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-1.5 size-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setIsVisible((value) => !value)}
        disabled={disabled}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}
