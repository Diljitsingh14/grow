import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TOKENS } from "@/constants/cookies";
import { AUTH_API } from "@/constants/urls";

export async function GET(req: NextRequest) {
	try {
		const accessToken = getCookie(TOKENS.ACCESS, { req });
		if (!accessToken) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Hit the backend API with the token
		const response = await axios.get(AUTH_API.PING, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Return the response from the backend API
		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
};