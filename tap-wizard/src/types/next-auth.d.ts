import { DefaultSession, DefaultJWT } from "next-auth";
interface IProfile {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    id?: string;
    provider?: string;
    expiresAt?: number;
    scope?: string;
    tokenType?: string;
    idToken?: string;
    refreshToken?: string;
    isAuthSaved?: boolean;
    profile?: IProfile;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    id?: string;
    provider?: string;
    expiresAt?: number;
    scope?: string;
    tokenType?: string;
    idToken?: string;
    refreshToken?: string;
    isAuthSaved?: boolean;
    profile: IProfile;
  }
}
