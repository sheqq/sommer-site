import { MongoClient, type Collection, type Document } from "mongodb";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export interface UserDocument extends Document {
  id: string;
  username: string;
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const clientPromise =
    global.mongoClientPromise ?? new MongoClient(uri).connect();
  if (process.env.NODE_ENV !== "production") {
    global.mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  const database = client.db(process.env.MONGODB_DB || "sommer");
  const collection = database.collection<UserDocument>("users");
  await collection.createIndex({ id: 1 }, { unique: true });
  return collection;
}
