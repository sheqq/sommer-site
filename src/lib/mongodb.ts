import { MongoClient, type Collection, type Document } from "mongodb";
import type { Guild, Level } from "@/generated/api";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export type LevelDocument = Level & Document;
export type ServerDocument = Guild & Document;

async function getDatabase() {
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
  return client.db();
}

export async function getLevelsCollection(): Promise<Collection<LevelDocument>> {
  const database = await getDatabase();
  const collection = database.collection<LevelDocument>("levels");
  await collection.createIndex({ guildId: 1, userId: 1 }, { unique: true });
  return collection;
}

export async function getServersCollection(): Promise<Collection<ServerDocument>> {
  const database = await getDatabase();
  const collection = database.collection<ServerDocument>("servers");
  await collection.createIndex({ guildId: 1 }, { unique: true });
  return collection;
}
