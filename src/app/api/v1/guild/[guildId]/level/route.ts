import { MongoServerError } from "mongodb";
import { getLevelsCollection } from "@/lib/mongodb";
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
    const levels = await getLevelsCollection();
    const documents = await levels.find({ guildId }, { projection: { _id: 0 } }).toArray();
    return Response.json(documents);
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
    const levels = await getLevelsCollection();
    await levels.insertOne(level);
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
