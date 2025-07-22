import { env } from "../configs/env";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "./ApiError";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  if (!token) {
    throw new ApiError(400, "Google token is required");
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google token");
  }

  if (!payload) {
    throw new ApiError(401, "Google token verification failed, No payload received");
  }

  return payload;
};
