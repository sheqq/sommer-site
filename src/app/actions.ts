"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDiscordAccessToken,
  getOwnedDiscordGuildIds,
} from "@/lib/discord";
import { BotWebhookDeliveryError } from "@/lib/bot-webhook";
import { getServer, replaceServer } from "@/lib/servers";

export type ColorsToggleResult = {
  ok: boolean;
  message?: string;
};

export async function setServerColorsEnabled(
  guildId: string,
  enabled: boolean,
): Promise<ColorsToggleResult> {
  if (!guildId || typeof enabled !== "boolean") {
    return { ok: false, message: "Ungültige Servereinstellung." };
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return { ok: false, message: "Bitte melde dich mit Discord an." };
  }

  const accessToken = await getDiscordAccessToken();
  if (!accessToken) {
    return {
      ok: false,
      message: "Deine Discord-Anmeldung ist abgelaufen. Bitte melde dich erneut an.",
    };
  }

  try {
    const ownedGuildIds = await getOwnedDiscordGuildIds(accessToken);
    if (!ownedGuildIds.has(guildId)) {
      return {
        ok: false,
        message: "Nur der Serverinhaber kann diese Einstellung ändern.",
      };
    }

    const server = await getServer(guildId);
    if (!server) {
      return { ok: false, message: "Der Bot ist auf diesem Server nicht aktiv." };
    }

    await replaceServer(guildId, { ...server, colorsEnabled: enabled });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Failed to update server color settings:", error);

    if (error instanceof BotWebhookDeliveryError) {
      return {
        ok: false,
        message:
          "Einstellung gespeichert, aber der Bot wurde nicht benachrichtigt. Bitte erneut versuchen.",
      };
    }
    return {
      ok: false,
      message: "Die Serverrechte konnten nicht geprüft werden. Bitte erneut versuchen.",
    };
  }
}
