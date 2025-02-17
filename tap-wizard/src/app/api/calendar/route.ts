// pages/api/calendar/getEvents.ts
import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "next-auth/react";
// import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/next-auth-session-provider/auth";

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const accessToken = session.accessToken as string;

	// Get the current date
	const currentDate = new Date();

	// Calculate the first day of the current month
	const firstDayOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1
	).toISOString();

	// Calculate the last day of the current month
	const lastDayOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	).toISOString();

	try {
		let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${firstDayOfMonth}&timeMax=${lastDayOfMonth}`;
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch events" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
