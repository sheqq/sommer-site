import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

type DiscordGuild = {
  id: string;
  owner: boolean;
};

function isDiscordGuild(value: unknown): value is DiscordGuild {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "owner" in value &&
    typeof value.owner === "boolean"
  );
}

export async function getDiscordAccessToken(): Promise<string | null> {
  const requestHeaders = await headers();
  const request = new NextRequest("http://localhost", {
    headers: requestHeaders,
  });
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    !token ||
    typeof token.discordAccessToken !== "string" ||
    typeof token.discordAccessTokenExpiresAt !== "number" ||
    token.discordAccessTokenExpiresAt <= Date.now()
  ) {
    return null;
  }

  return token.discordAccessToken;
}

export async function getOwnedDiscordGuildIds(
  accessToken: string,
): Promise<Set<string>> {
  const guildIds = new Set<string>();
  let after: string | undefined;

  while (true) {
    const url = new URL("https://discord.com/api/v10/users/@me/guilds");
    url.searchParams.set("limit", "200");
    if (after) {
      url.searchParams.set("after", after);
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Discord guild lookup failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || !payload.every(isDiscordGuild)) {
      throw new Error("Discord returned an invalid guild list");
    }

    for (const guild of payload) {
      if (guild.owner) {
        guildIds.add(guild.id);
      }
    }

    if (payload.length < 200) {
      return guildIds;
    }

    const nextAfter = payload[payload.length - 1]?.id;
    if (!nextAfter || nextAfter === after) {
      throw new Error("Discord guild pagination did not advance");
    }
    after = nextAfter;
  }
}
