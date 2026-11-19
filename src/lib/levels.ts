import type { Level } from "@/lib/api";
import { getLevelsCollection } from "@/lib/mongodb";
import type { LevelDocument } from "@/lib/mongodb";

export async function listGuildLevels(guildId: string): Promise<LevelDocument[]> {
  const levels = await getLevelsCollection();
  return levels
    .find({ guildId }, { projection: { _id: 0 } })
    .toArray();
}

export async function findLevel(
  guildId: string,
  userId: string,
): Promise<LevelDocument | null> {
  const levels = await getLevelsCollection();
  return levels.findOne(
    { guildId, userId },
    { projection: { _id: 0 } },
  );
}

export async function createLevel(level: Level): Promise<void> {
  const levels = await getLevelsCollection();
  await levels.insertOne(level);
}

export async function replaceLevel(level: Level): Promise<boolean> {
  const levels = await getLevelsCollection();
  const result = await levels.replaceOne(
    { guildId: level.guildId, userId: level.userId },
    level,
  );
  return result.matchedCount > 0;
}

export async function removeLevel(
  guildId: string,
  userId: string,
): Promise<boolean> {
  const levels = await getLevelsCollection();
  const result = await levels.deleteOne({ guildId, userId });
  return result.deletedCount > 0;
}
