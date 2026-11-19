import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.discordAccessToken = account.access_token ?? undefined;
        token.discordAccessTokenExpiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 60 * 60 * 24 * 7 * 1000;
      }

      return token;
    },
  },
};
