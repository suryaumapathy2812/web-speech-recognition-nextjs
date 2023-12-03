'use server';

import { authOptions } from '@/app/(api-routes)/api/auth/[...nextauth]/config';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';

async function initializeAuth() {
  const oauth2Client = new google.auth.OAuth2();
  const session = (await getServerSession(authOptions));

  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  return oauth2Client;
}

async function getMessageDetails(messageId: string) {
  const auth = await initializeAuth();
  const gmail = google.gmail({ version: 'v1', auth });
  const message = await gmail.users.messages.get({
    userId: 'me', // or the user's email address
    id: messageId,
    format: 'full' // This specifies that the full message data should be returned
  });
  return message.data; // This contains the full details
}

function getHeader(headers: any[], name: string) {
  const header = headers.find(header => header.name === name);
  return header && header.value;
}

export async function listEmail(query: string = '', maxResults: number = 10, labelIds: string[] = ['INBOX']) {
  console.log('[LIST_EMAIL]', query, maxResults, labelIds)
  try {
    const auth = await initializeAuth();
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query,
      labelIds,
    })

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.debug('No messages found.');
      return [];
    }

    const finalMessageResponse = []

    for (const message of messages) {
      if (!message?.id) continue;
      const messageDetails = await getMessageDetails(message.id);
      const header = messageDetails.payload?.headers as any[];

      const messageResponse = {
        id: message.id,
        snippet: messageDetails.snippet,
        subject: getHeader(header, 'Subject'),
        from: getHeader(header, 'From'),
        date: getHeader(header, 'Date'),
        body: messageDetails.payload?.body?.data,
        attachments: messageDetails.payload?.parts?.map(part => {
          return {
            filename: part.filename,
            mimeType: part.mimeType,
            attachmentId: part.body?.attachmentId,
            size: part.body?.size,
          }
        })
      }

      // if (messageDetails.payload?.body?.data) {
      //   // URL-safe Base64 decoding. Replace all URL-safe characters and then decode.
      //   const base64Data = messageDetails.payload.body.data.replace(/-/g, '+').replace(/_/g, '/');
      //   messageResponse.body = atob(base64Data);
      // }

      finalMessageResponse.push(messageResponse);
    }

    return finalMessageResponse;
  } catch (error) {
    console.log('The API returned an error: ' + error);
  }

}
