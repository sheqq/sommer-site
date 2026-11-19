"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

type Props = {
  signedIn: boolean;
  reconnect?: boolean;
};

export function DiscordAuthButton({ signedIn, reconnect = false }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      if (reconnect) {
        await signOut({ redirect: false });
        await signIn("discord", { callbackUrl: "/" });
      } else if (signedIn) {
        await signOut({ callbackUrl: "/" });
      } else {
        await signIn("discord", { callbackUrl: "/" });
      }
    } catch (requestError) {
      console.error("Discord authentication failed:", requestError);
      setError("Discord-Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
      setPending(false);
    }
  }

  return (
    <div className="auth-control">
      <button
        className="auth-button"
        type="button"
        onClick={handleClick}
        disabled={pending}
      >
        {pending
          ? "Einen Moment …"
          : reconnect
            ? "Discord neu verbinden"
            : signedIn
              ? "Abmelden"
              : "Mit Discord anmelden"}
      </button>
      {error && (
        <span className="auth-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
