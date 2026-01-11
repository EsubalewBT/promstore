import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from 'next-auth';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // 1. Check the User Table
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // 2. Check if password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // 3. Success! Return the user.
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // 4. Fail
        return null;
      },
    }),
  ],
  callbacks: {
    // This adds the User ID to the session/cookie so the frontend can read it
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

