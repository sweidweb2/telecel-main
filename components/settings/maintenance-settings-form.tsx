"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateMaintenanceMode } from "@/actions/site-settings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MaintenanceMode } from "@/types/site-settings";

export function MaintenanceSettingsForm({
  initialMode,
}: {
  initialMode: MaintenanceMode;
}) {
  const [mode, setMode] = useState(initialMode);
  const [pending, startTransition] = useTransition();
  const enabled = mode === "full";

  function save(next: MaintenanceMode) {
    const previous = mode;
    setMode(next);

    startTransition(async () => {
      const result = await updateMaintenanceMode(next);
      if (result.status === "error") {
        setMode(previous);
        toast.error(result.message);
        return;
      }
      setMode(result.mode);
      toast.success(result.message);
    });
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-1">
          <Label htmlFor="maintenance-mode" className="text-base">
            Maintenance mode
          </Label>
          <p className="text-sm text-muted-foreground">
            Shows a maintenance page on public routes. Only administrators can
            sign in; signed-in staff keep dashboard access to turn this off.
          </p>
        </div>
        <Switch
          id="maintenance-mode"
          checked={enabled}
          disabled={pending}
          onCheckedChange={(on) => save(on ? "full" : "off")}
        />
      </div>
    </div>
  );
}