export interface User {
  id: string;
  username: string;
}

export function isAuthorized(request: Request): boolean {
  const expectedKey = process.env.API_KEY;
  return Boolean(expectedKey && request.headers.get("X-API-Key") === expectedKey);
}

export async function readUser(request: Request): Promise<User | null> {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      !("username" in body) ||
      typeof body.id !== "string" ||
      typeof body.username !== "string"
    ) {
      return null;
    }

    return { id: body.id, username: body.username };
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
