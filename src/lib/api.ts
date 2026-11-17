import type { Level } from "@/generated/api";

export type { Level };

export function isAuthorized(request: Request): boolean {
  const expectedKey = process.env.API_KEY;
  return Boolean(expectedKey && request.headers.get("X-API-Key") === expectedKey);
}

export async function readLevel(request: Request): Promise<Level | null> {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("guildId" in body) ||
      !("userId" in body) ||
      !("xp" in body) ||
      typeof body.guildId !== "string" ||
      typeof body.userId !== "string" ||
      typeof body.xp !== "number" ||
      !Number.isInteger(body.xp)
    ) {
      return null;
    }

    const level = "level" in body ? body.level : undefined;
    if (level !== undefined && (typeof level !== "number" || !Number.isInteger(level))) {
      return null;
    }

    return {
      guildId: body.guildId,
      userId: body.userId,
      xp: body.xp,
      ...(typeof level === "number" ? { level } : {}),
    };
  } catch {
    return null;
  }
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Fehlender oder ungültiger API-Key" }, { status: 401 });
}

export function internalErrorResponse(): Response {
  return Response.json({ error: "Interner Serverfehler" }, { status: 500 });
}
