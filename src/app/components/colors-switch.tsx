"use client";

import { useState, useTransition } from "react";
import { setServerColorsEnabled } from "@/app/actions";

type Props = {
  guildId: string;
  enabled: boolean;
};

export function ColorsSwitch({ guildId, enabled }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = await setServerColorsEnabled(guildId, !enabled);
      if (!result.ok) {
        setError(result.message ?? "Die Einstellung konnte nicht gespeichert werden.");
      }
    });
  }

  return (
    <div className="server-toggle">
      <button
        className={`color-switch ${enabled ? "enabled" : ""}`}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Farbrollen ${enabled ? "deaktivieren" : "aktivieren"}`}
        onClick={toggle}
        disabled={pending}
      >
        <span className="color-switch-thumb" />
      </button>
      <span className="server-toggle-label">
        {pending ? "Speichern …" : enabled ? "Farben an" : "Farben aus"}
      </span>
      {error && (
        <span className="server-toggle-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
