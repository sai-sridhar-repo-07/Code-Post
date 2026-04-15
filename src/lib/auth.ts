import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as unknown as {
          id: number;
          login: string;
          avatar_url: string;
          bio?: string;
          name?: string;
          email?: string;
        };

        await prisma.user.upsert({
          where: { githubId: githubProfile.id },
          update: {
            username: githubProfile.login,
            name: githubProfile.name ?? null,
            email: githubProfile.email ?? null,
            avatarUrl: githubProfile.avatar_url,
            bio: githubProfile.bio ?? null,
            accessToken: account.access_token,
          },
          create: {
            githubId: githubProfile.id,
            username: githubProfile.login,
            name: githubProfile.name ?? null,
            email: githubProfile.email ?? null,
            avatarUrl: githubProfile.avatar_url,
            bio: githubProfile.bio ?? null,
            accessToken: account.access_token,
          },
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as unknown as { id: number; login: string };
        token.githubId = githubProfile.id;
        token.username = githubProfile.login;
        token.accessToken = account.access_token;

        const dbUser = await prisma.user.findUnique({
          where: { githubId: githubProfile.id },
        });
        if (dbUser) {
          token.userId = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
        session.user.githubId = token.githubId as number;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
});
