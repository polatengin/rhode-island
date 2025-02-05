import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export function GET(request: Request) {
  return NextAuth(authOptions)(request);
}

export function POST(request: Request) {
  return NextAuth(authOptions)(request);
}

const { env } = getRequestContext();
const db = drizzle(env.db);

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      return session;
    },
  },
};
