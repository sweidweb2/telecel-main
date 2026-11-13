"use client";

import { SearchIcon, XIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  pending?: boolean;
  onClear?: () => void;
};

/** Search field with leading icon, optional clear, and pending spinner. */
function SearchInput({
  className,
  pending = false,
  onClear,
  value,
  disabled,
  ...props
}: SearchInputProps) {
  const hasValue = typeof value === "string" ? value.length > 0 : value != null;

  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupAddon align="inline-start">
        {pending ? (
          <Spinner className="size-4" />
        ) : (
          <SearchIcon className="size-4" aria-hidden />
        )}
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        disabled={disabled || pending}
        {...props}
      />
      {onClear && hasValue ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label="Clear search"
            onClick={onClear}
            disabled={disabled || pending}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

export { SearchInput };
