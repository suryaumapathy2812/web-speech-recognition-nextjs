/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'
import socket from '@/utils/socket';

const ChatPage = () => {

  const { user, error, isLoading } = useUser();

  const [transcript, setTranscript] = useState<string>('');
  const userSession = useRef<UserSession | null>(null);

  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
      socket.emit('user_connected', user);
    }

    if (userSession.current === null) {
      socket?.on('user_connection_success', (response: { message: Conversation[], userSession: UserSession }) => {
        console.log('[user_connection_success]', response);
        const { message, userSession: userSessionResponse } = response;
        userSession.current = userSessionResponse;
      })
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    }

  }, [user])


  function sendMessage(message: string) {
    console.debug('sendMessage', socket);
    socket?.emit('message', { message, userSession: userSession.current });
    setTranscript('');
  }


  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>{"Failed to load session"}</div>;

  return (
    <>
      <div className="mt-16 flex gap-2" >
        <textarea
          value={transcript}
          onChange={(e) => (setTranscript(e.target.value))}
          readOnly={false}
          className="w-10/12 border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Type your message..."
        >
        </textarea>

        <button
          onClick={() => sendMessage(transcript)}
          className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
          Send
        </button>
      </div>
    </>
  );
};

export default ChatPage;
