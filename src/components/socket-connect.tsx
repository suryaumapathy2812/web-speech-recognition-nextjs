'use client';

import socket from '@/utils/socket';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import { useEffect, useRef } from "react";

function SocketConnect() {

  const { user, error, isLoading } = useUser();
  const userSession = useRef<UserSession | null>(null);

  if (error) {
    redirect('/api/auth/login');
  }

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit('user_connected', user);
    }

    if (userSession.current === null) {
      socket?.on('user_connection_success', (response: { message: Conversation[], userSession: UserSession }) => {
        console.log('[user_connection_success]', response);
        const { message, userSession: userSessionResponse } = response;
        userSession.current = userSessionResponse;
        socket?.emit('retrieve_messages', { userSession: userSession.current });
      })
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    }

  }, [user])

  return <></>

}

export default SocketConnect;