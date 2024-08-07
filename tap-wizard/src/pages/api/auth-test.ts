import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TOKENS } from "@/constants/cookies";
import { AUTH_API } from "@/constants/urls";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = getCookie(TOKENS.ACCESS, { req, res });
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Hit the backend API with the token
    const response = await axios.get(AUTH_API.PING, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Return the response from the backend API
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
