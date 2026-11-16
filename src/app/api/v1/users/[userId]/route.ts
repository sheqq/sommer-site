import { getUsersCollection } from "@/lib/mongodb";
import {
  internalErrorResponse,
  isAuthorized,
  readUser,
  unauthorizedResponse,
} from "@/lib/api";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const { userId } = await params;
    const users = await getUsersCollection();
    const user = await users.findOne({ id: userId }, { projection: { _id: 0 } });
    if (!user) {
      return Response.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }
    return Response.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return internalErrorResponse();
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const user = await readUser(request);
  if (!user) {
    return Response.json({ error: "Ungültige Nutzerdaten" }, { status: 400 });
  }

  try {
    const { userId } = await params;
    const users = await getUsersCollection();
    const result = await users.replaceOne({ id: userId }, user);
    if (result.matchedCount === 0) {
      return Response.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }
    return Response.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return internalErrorResponse();
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const { userId } = await params;
    const users = await getUsersCollection();
    const result = await users.deleteOne({ id: userId });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return internalErrorResponse();
  }
}
