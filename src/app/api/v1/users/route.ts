import { getUsersCollection } from "@/lib/mongodb";
import {
  internalErrorResponse,
  isAuthorized,
  readUser,
  unauthorizedResponse,
} from "@/lib/api";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const users = await getUsersCollection();
    const documents = await users.find({}, { projection: { _id: 0 } }).toArray();
    return Response.json(documents);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return internalErrorResponse();
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const user = await readUser(request);
  if (!user) {
    return Response.json({ error: "Ungültige Nutzerdaten" }, { status: 400 });
  }

  try {
    const users = await getUsersCollection();
    await users.insertOne(user);
    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return internalErrorResponse();
  }
}
