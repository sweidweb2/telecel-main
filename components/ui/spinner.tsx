import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Shared inline loading spinner. Use in buttons, filters, and local pending UI.
 * Route transitions use `NextTopLoader` in `app/layout.tsx`; route shells use
 * `RouteSkeleton` in colocated `loading.tsx` files.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      aria-hidden
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
