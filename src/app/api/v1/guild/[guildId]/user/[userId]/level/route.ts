import { findLevel, removeLevel, replaceLevel } from "@/lib/levels";
import {
  internalErrorResponse,
  isAuthorized,
  readLevel,
  unauthorizedResponse,
} from "@/lib/api";

type RouteContext = {
  params: Promise<{ guildId: string; userId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const { guildId, userId } = await params;
    const level = await findLevel(guildId, userId);
    if (!level) {
      return Response.json({ error: "Level nicht gefunden" }, { status: 404 });
    }
    return Response.json(level);
  } catch (error) {
    console.error("Failed to fetch level:", error);
    return internalErrorResponse();
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const level = await readLevel(request);
  const { guildId, userId } = await params;
  if (!level || level.guildId !== guildId || level.userId !== userId) {
    return Response.json({ error: "Ungültige Leveldaten" }, { status: 400 });
  }

  try {
    if (!(await replaceLevel(level))) {
      return Response.json({ error: "Level nicht gefunden" }, { status: 404 });
    }
    return Response.json(level);
  } catch (error) {
    console.error("Failed to update level:", error);
    return internalErrorResponse();
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const { guildId, userId } = await params;
    if (!(await removeLevel(guildId, userId))) {
      return Response.json({ error: "Level nicht gefunden" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete level:", error);
    return internalErrorResponse();
  }
}
