import { getServer, replaceServer } from "@/lib/servers";
import { BotWebhookDeliveryError } from "@/lib/bot-webhook";
import {
  internalErrorResponse,
  isAuthorized,
  readGuild,
  unauthorizedResponse,
} from "@/lib/api";

type RouteContext = {
  params: Promise<{ guildId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const { guildId } = await params;
    const server = await getServer(guildId);
    if (!server) {
      return Response.json({ error: "Server nicht gefunden" }, { status: 404 });
    }
    return Response.json(server);
  } catch (error) {
    console.error("Failed to fetch server:", error);
    return internalErrorResponse();
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const server = await readGuild(request);
  const { guildId } = await params;
  if (!server || server.guildId !== guildId) {
    return Response.json({ error: "Ungültige Serverdaten" }, { status: 400 });
  }

  try {
    if (!(await replaceServer(guildId, server))) {
      return Response.json({ error: "Server nicht gefunden" }, { status: 404 });
    }
    return Response.json(server);
  } catch (error) {
    console.error("Failed to update server:", error);
    if (error instanceof BotWebhookDeliveryError) {
      return Response.json(
        { error: "Server gespeichert, aber Bot-Benachrichtigung fehlgeschlagen" },
        { status: 502 },
      );
    }
    return internalErrorResponse();
  }
}
