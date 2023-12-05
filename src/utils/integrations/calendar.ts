import { authOptions } from '@/app/(api-routes)/api/auth/[...nextauth]/config';
import { google } from 'googleapis';
import { getServerSession } from "next-auth";

async function initializeAuth() {
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  });
  const session = (await getServerSession(authOptions));

  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  return oauth2Client;
}

