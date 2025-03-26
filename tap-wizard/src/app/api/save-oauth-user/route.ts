// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { TOKENS } from "@/constants/cookies";
import { AUTH_API } from "@/constants/urls";
//import { getSession } from "next-auth/react";
import { authOptions } from "@/utils/next-auth-session-provider/auth";
import { getServerSession } from "next-auth";
import axiosInstance from "@/utils/http/axiosInstance";

export async function GET (req: NextRequest) {
	try {
		const token = getCookie(TOKENS.ACCESS, { req });
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: "No session" }, { status: 400 });
		}

		const {
			provider,
			id: providerAccountId,
			accessToken,
			expiresAt,
			scope,
			tokenType,
			idToken,
			isAuthSaved,
		} = session;

		if (isAuthSaved) {
			return NextResponse.json({ message: "already saved" }, { status: 200 });
		}

		if (!token) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Make a request to your backend to save the OAuth user
		const response = await axiosInstance.post(
			AUTH_API.CONNECT_OAUTH_ACCOUNT,
			{
				provider: provider,
				provider_account_id: providerAccountId,
				access_token: accessToken,
				expires_at: expiresAt,
				scope: scope,
				token_type: tokenType,
				id_token: idToken,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.error("Error saving OAuth user:", error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
};