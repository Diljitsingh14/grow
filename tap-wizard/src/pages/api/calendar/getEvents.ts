// pages/api/calendar/getEvents.ts
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const BY_PASS = false;

const token =
  "ya29.a0AXooCgs0amZFLfb1R9OGuMhGrQMcomF5CtDMbbkXrzJQJfBBA3CKlWWybzRHOYWE6rHJWmdREqj6g6roZp5AlZu2uW7XP-OoMpu9LhksrUonowg7cRmAAXrPBzjxDVaUrb3eYNuTnyZ8KaEfsjej4mlyfQp6jpc3kAYiaCgYKAY0SARMSFQHGX2MiqELzmy_rtj6IC0Ab9AUBkw0171";
const provideId = "100931371225100939834";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!BY_PASS && !session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = BY_PASS ? token : (session.accessToken as string);

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
      return res
        .status(response.status)
        .json({ error: "Failed to fetch events" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
