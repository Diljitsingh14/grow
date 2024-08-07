import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    id?: string;
    provider?: string;
    expiresAt?: number;
    scope?: string;
    tokenType?: string;
    idToken?: string;
    isAuthSaved?: boolean;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    id?: string;
    provider?: string;
    expiresAt?: number;
    scope?: string;
    tokenType?: string;
    idToken?: string;
    isAuthSaved?: boolean;
  }
}
