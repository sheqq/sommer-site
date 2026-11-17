import { MongoClient, type Collection, type Document } from "mongodb";
import type { Level } from "@/generated/api";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export type LevelDocument = Level & Document;

export async function getLevelsCollection(): Promise<Collection<LevelDocument>> {
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
  const database = client.db();
  const collection = database.collection<LevelDocument>("levels");
  await collection.createIndex({ guildId: 1, userId: 1 }, { unique: true });
  return collection;
}
