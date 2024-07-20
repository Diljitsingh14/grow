// types/next-auth.d.ts or pages/api/auth/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    id?: string;
  }

  interface JWT {
    accessToken?: string;
    id?: string;
  }
}
