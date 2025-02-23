import NextAuth from "next-auth";
import { authOptions } from "@/utils/next-auth-session-provider/auth";

const handler = NextAuth(authOptions) 

export { handler as GET, handler as POST }
