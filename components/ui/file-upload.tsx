"use client";

import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Hint under the dropzone, e.g. "PNG or JPG up to 5MB". */
  hint?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
  id?: string;
};

/** Accessible file / image picker with optional multi-select list. */
function FileUpload({
  accept,
  multiple = false,
  disabled,
  hint,
  value,
  onChange,
  className,
  id,
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<File[]>([]);
  const files = value ?? internal;

  function setFiles(next: File[]) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function handleChange(list: FileList | null) {
    if (!list?.length) return;
    const next = multiple ? [...files, ...Array.from(list)] : [list[0]];
    setFiles(next);
  }

  function removeAt(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  const isImage = accept?.startsWith("image") ?? false;

  return (
    <div className={cn("space-y-3", className)} data-slot="file-upload">
      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-transparent px-4 py-6 text-center transition-colors",
          "hover:bg-muted/40 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {isImage ? (
          <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
        ) : (
          <UploadIcon className="size-5 text-muted-foreground" aria-hidden />
        )}
        <span className="text-sm font-medium text-ink">
          {multiple
            ? "Choose files or drop here"
            : "Choose a file or drop here"}
        </span>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            handleChange(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate text-ink">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => removeAt(index)}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { FileUpload };
