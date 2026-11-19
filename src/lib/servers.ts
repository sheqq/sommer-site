import type { Guild } from "@/lib/api";
import { notifyBotOfServerSettings } from "@/lib/bot-webhook";
import { getServersCollection, type ServerDocument } from "@/lib/mongodb";

export async function getServer(
  guildId: string,
): Promise<Guild | null> {
  const servers = await getServersCollection();
  const server = await servers.findOne(
    { guildId },
    { projection: { _id: 0 } },
  );
  return server ? toGuild(server) : null;
}

export async function listServers(): Promise<Guild[]> {
  const servers = await getServersCollection();
  const documents = await servers
    .find({}, { projection: { _id: 0 } })
    .sort({ guildId: 1 })
    .toArray();
  return documents.map(toGuild);
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
  if (result.matchedCount === 0) {
    return false;
  }

  await notifyBotOfServerSettings(server);
  return true;
}

function toGuild(server: ServerDocument): Guild {
  return {
    guildId: server.guildId,
    name: server.name || server.guildId,
    iconUrl: server.iconUrl ?? null,
    colorsEnabled: server.colorsEnabled ?? false,
  };
}
