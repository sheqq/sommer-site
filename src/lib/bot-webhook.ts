import { randomUUID } from "node:crypto";
import type { Guild } from "@/lib/api";

export class BotWebhookDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BotWebhookDeliveryError";
  }
}

export async function notifyBotOfServerSettings(server: Guild): Promise<void> {
  const endpoint = process.env.BOT_WEBHOOK_URL;
  const secret = process.env.BOT_WEBHOOK_SECRET;
  if (!endpoint || !secret) {
    throw new BotWebhookDeliveryError("Bot webhook is not configured");
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new BotWebhookDeliveryError("BOT_WEBHOOK_URL is not a valid URL");
  }
  if (
    url.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" && url.protocol === "http:")
  ) {
    throw new BotWebhookDeliveryError("Bot webhook URL must use HTTPS");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: randomUUID(),
        type: "server.settings.updated",
        guildId: server.guildId,
        colorsEnabled: server.colorsEnabled === true,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Failed to deliver server settings to bot:", error);
    throw new BotWebhookDeliveryError("Bot webhook could not be reached");
  }

  if (!response.ok) {
    throw new BotWebhookDeliveryError(
      `Bot webhook returned status ${response.status}`,
    );
  }
}
