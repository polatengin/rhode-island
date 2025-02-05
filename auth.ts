import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
import { users } from "./schemas/drizzle";
import { db } from "./schemas/db";

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

        const isPasswordValid = await compare(credentials.password as string, user.password);

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
  session: {
    strategy: 'jwt', // Using JWT for session management
  },
  pages: {
    signIn: '/auth/signin', // Customize your sign-in page if necessary
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ""
        token.email = user.email ?? ""
        token.name = user.name ?? ""
        token.organizationId = user.organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id ?? ""
        session.user.email = token.email ?? ""
        session.user.name = token.name
        session.user.organizationId = token.organizationId
      }
      return session
    },
  },
  secret: process.env.JWT_SECRET || 'your_secret_key',
});
