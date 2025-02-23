import { IProfile } from "@/types/next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					scope:
						"openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
					access_type: "offline", // This requests a refresh token
					prompt: "consent", // Ensure consent screen is shown every time to get refresh token
				},
			},
		}),
	],
	secret: NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ profile, account, credentials }) {
			if (!profile?.email) {
				throw new Error("No profile");
			}

			return true;
		},
		async jwt({ token, account, profile }) {
			console.log(account, account);
			if (account && profile) {
				token.accessToken = account.access_token as string | undefined;
				token.id = account.providerAccountId as string | undefined;
				token.provider = account.provider as string | undefined;
				token.expiresAt = account.expires_at as number | undefined;
				token.scope = account.scope as string | undefined;
				token.tokenType = account.token_type as string | undefined;
				token.idToken = account.id_token as string | undefined;
				token.refreshToken = account.refresh_token as string | undefined;
				token.isAuthSaved = false;
				token.profile = profile;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string | undefined;
			session.id = token.id as string | undefined;
			session.provider = token.provider as string | undefined;
			session.expiresAt = token.expiresAt as number | undefined;
			session.scope = token.scope as string | undefined;
			session.tokenType = token.tokenType as string | undefined;
			session.idToken = token.idToken as string | undefined;
			session.refreshToken = token.refreshToken as string | undefined;
			session.isAuthSaved = false;
			session.profile = token.profile as IProfile | undefined;
			return session;
		},
	},
	// events: {
	//   async signIn({ user, account, profile }) {
	//     // Perform client-side redirection after sign in
	//     const res = await axios.get("/api/save-oauth-user");
	//     console.log("response from api", res);
	//     // setTimeout(() => {
	//     //   window.location.href = "/api/save-oauth-user";
	//     // }, 2000);
	//   },
	// },
};

// {
//   "provider": "google",
//   "type": "oauth",
//   "providerAccountId": "100931371225100939834",
//   "access_token": "ya29.a0AXooCguEnPJdakcaZiQGYb4dx1wwa7ijpNTZFuB6FnkwkRxL7xRN_8d3bigJ5znGrIREfxEoypseWxAKXJZsvY7OwbSREKdvy8VcOIISGnLqK_AQAa-nIkdoqF0QZRykgUUSTZYtAIO1ka-vYTc61SP5yF72I2kSD0puaCgYKAUgSARMSFQHGX2Mi11shI_G96jSunpc1WPWJVw0171",
//   "expires_at": "1722574615",
//   "scope": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events openid",
//   "token_type": "Bearer",
//   "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNmQ5MTdiMWZlOGRlMTMzODJhYTdjYzlhMWQ2ZTkzMjYyZjMzZTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5NDM0MDA3NTc4MjYtbjkzbGpuNTdtMzVvaGRlMGd1dDRqdmNhZDQ4ZXJoM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NDM0MDA3NTc4MjYtbjkzbGpuNTdtMzVvaGRlMGd1dDRqdmNhZDQ4ZXJoM2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA5MzEzNzEyMjUxMDA5Mzk4MzQiLCJlbWFpbCI6InNpbmdoZGlsaml0LmNhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRllYU1JVM2JxZGFFME1VblRVaVJGdyIsIm5hbWUiOiJEaWxqaXQgU2luZ2giLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1pBQ1NOSEpMLU5Sa2p2VVZKNE1LUWQ0NEtkWk1HdzNpU0VtS1ZLbV9YYk1BSTBnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRpbGppdCIsImZhbWlseV9uYW1lIjoiU2luZ2giLCJpYXQiOjE3MjI1NzEwMTYsImV4cCI6MTcyMjU3NDYxNn0.lLCiDMjOCSjdtktXjxnqBunrAJ4WpFJooKexPoHMxKjyLQ8XYf2BceFPgsmDO7NmhzCQm3psvwJX7fTuYka2PF7abev7eYnbKsrWp-UnwIW_bnYE6J17Ox-GfGeaxhNu3oxKlzOZcd_u7Z9620D7nrAETzomdp-U4KYbUSxccACBqwkYtDHKXjyWDQSpF754BSyYLWxnMRzzpMjWBf_Jxc4kWZEc260dRE-t9_F26Aec7AvJN1B24O3NyeIU-BDQF1CrmhLffDoWtl0XxMwQCAmoNQtbLj7B8juqUJu0DTXb6UEHrjqjZIeYJXEvHgG8IRpuKLdmxYkqbzhvqvdxqQ"
// }
