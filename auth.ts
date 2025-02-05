import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { users } from "./schemas/drizzle";
import { db } from "./schemas/db";
import { verifyPassword } from "./lib/auth/password";

import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) {
          throw new Error('No user found with this email.')
        }

        const isPasswordValid = await verifyPassword(credentials.password as string, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password.')
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          organizationId: user.organization_id.toString(),
        };
      },
    }),
    GitHub,
    Google,
    Twitter
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET || 'your_secret_key',
  session: {
    strategy: 'jwt', // Using JWT for session management
  },
});
