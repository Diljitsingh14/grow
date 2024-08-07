import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TOKENS } from "@/constants/cookies";
import { AUTH_API } from "@/constants/urls";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookie(TOKENS.ACCESS, { req, res });
    const session = await getSession({ req });

    if (!session) {
      return res.status(400).json({ error: "No session" });
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
      return res.status(200).json({ message: "already saved" });
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Make a request to your backend to save the OAuth user
    const response = await axios.post(
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error saving OAuth user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
