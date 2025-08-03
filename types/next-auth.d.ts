// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name: string;
      isverified: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    isverified: boolean;
  }

  interface JWT {
    username?: string;
    isverified?: boolean;
  }
}
