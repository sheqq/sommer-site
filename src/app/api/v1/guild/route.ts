import { MongoServerError } from "mongodb";
import { saveServer } from "@/lib/servers";
import {
  internalErrorResponse,
  isAuthorized,
  readGuild,
  unauthorizedResponse,
} from "@/lib/api";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const server = await readGuild(request);
  if (!server) {
    return Response.json({ error: "Ungültige Serverdaten" }, { status: 400 });
  }

  try {
    await saveServer(server);
    return Response.json(server, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return Response.json(
        { error: "Der Server existiert bereits" },
        { status: 409 },
      );
    }

    console.error("Failed to create server:", error);
    return internalErrorResponse();
  }
}
