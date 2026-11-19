import { MongoServerError } from "mongodb";
import { createLevel, listGuildLevels } from "@/lib/levels";
import {
  internalErrorResponse,
  isAuthorized,
  readLevel,
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
    return Response.json(await listGuildLevels(guildId));
  } catch (error) {
    console.error("Failed to fetch levels:", error);
    return internalErrorResponse();
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const level = await readLevel(request);
  const { guildId } = await params;
  if (!level || level.guildId !== guildId) {
    return Response.json({ error: "Ungültige Leveldaten" }, { status: 400 });
  }

  try {
    await createLevel(level);
    return Response.json(level, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return Response.json(
        { error: "Für diesen Nutzer existiert bereits ein Level in diesem Server" },
        { status: 409 },
      );
    }

    console.error("Failed to create level:", error);
    return internalErrorResponse();
  }
}
