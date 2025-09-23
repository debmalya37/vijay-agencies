// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isverified: boolean;
      phone_number?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    email?: string;
    username?: string;
    isverified?: boolean;
    phone_number?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
    isverified?: boolean;
    phone_number?: string;
  }
}