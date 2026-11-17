import { getLevelsCollection } from "@/lib/mongodb";
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
    const levels = await getLevelsCollection();
    const level = await levels.findOne(
      { guildId, userId },
      { projection: { _id: 0 } },
    );
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
    const levels = await getLevelsCollection();
    const result = await levels.replaceOne({ guildId, userId }, level);
    if (result.matchedCount === 0) {
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
    const levels = await getLevelsCollection();
    const result = await levels.deleteOne({ guildId, userId });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Level nicht gefunden" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete level:", error);
    return internalErrorResponse();
  }
}
