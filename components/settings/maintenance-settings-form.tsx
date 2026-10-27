"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateMaintenanceFlags } from "@/actions/site-settings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MaintenanceFlags } from "@/types/site-settings";

export function MaintenanceSettingsForm({
  initialFlags,
}: {
  initialFlags: MaintenanceFlags;
}) {
  const [flags, setFlags] = useState(initialFlags);
  const [pending, startTransition] = useTransition();

  function save(next: MaintenanceFlags) {
    const previous = flags;
    const normalized = next.level2
      ? { level1: true, level2: true }
      : { level1: next.level1, level2: false };
    setFlags(normalized);

    startTransition(async () => {
      const result = await updateMaintenanceFlags(normalized);
      if (result.status === "error") {
        setFlags(previous);
        toast.error(result.message);
        return;
      }
      setFlags(result.flags);
      toast.success(result.message);
    });
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-1">
          <Label htmlFor="maintenance-level1" className="text-base">
            Level 1 — Block login
          </Label>
          <p className="text-sm text-muted-foreground">
            Visitors cannot sign in. Public marketing pages stay available.
            Signed-in staff keep dashboard access.
          </p>
        </div>
        <Switch
          id="maintenance-level1"
          checked={flags.level1}
          disabled={pending || flags.level2}
          onCheckedChange={(level1) =>
            save({ level1: Boolean(level1), level2: flags.level2 })
          }
        />
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-1">
          <Label htmlFor="maintenance-level2" className="text-base">
            Level 2 — Full maintenance
          </Label>
          <p className="text-sm text-muted-foreground">
            Blocks login and shows a maintenance page on all public routes.
            Signed-in staff can still open the dashboard to turn this off.
          </p>
        </div>
        <Switch
          id="maintenance-level2"
          checked={flags.level2}
          disabled={pending}
          onCheckedChange={(level2) =>
            save({
              level1: level2 ? true : flags.level1,
              level2: Boolean(level2),
            })
          }
        />
      </div>
    </div>
  );
}
