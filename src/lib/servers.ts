import type { Guild } from "@/lib/api";
import { getServersCollection, type ServerDocument } from "@/lib/mongodb";

export async function getServer(
  guildId: string,
): Promise<ServerDocument | null> {
  const servers = await getServersCollection();
  return servers.findOne({ guildId }, { projection: { _id: 0 } });
}

export async function saveServer(server: Guild): Promise<void> {
  const servers = await getServersCollection();
  await servers.insertOne(server);
}

export async function replaceServer(
  guildId: string,
  server: Guild,
): Promise<boolean> {
  const servers = await getServersCollection();
  const result = await servers.replaceOne({ guildId }, server);
  return result.matchedCount > 0;
}
