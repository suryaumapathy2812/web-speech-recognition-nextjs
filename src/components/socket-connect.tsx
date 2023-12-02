'use client';

import socket from '@/utils/socket';
import useUserSessionStore from '@/utils/stores/session.store';
import { useSession } from 'next-auth/react';
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'

function SocketConnect() {

  const { data: session, status } = useSession();
  const { userSession, setUserSession } = useUserSessionStore();
  const router = useRouter();

  useEffect(() => {
    console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")
    console.log('[SocketConnect SESSION]', session);
    console.log('[SocketConnect SOCKET] - ', socket.connected);
    console.log('[SocketConnect USER_SESSION]', userSession);
    console.log("=====================================================================")


    if (!session?.accessToken) {
      console.log('[SocketConnect useEffect] - no user || no accessToken');
      return;
    }

    if (!socket.connected) {
      console.log('[SocketConnect useEffect - SOCKET] - connecting')
      socket.connect();
      console.log('[SocketConnect useEffect - SOCKET]', socket.connected)
      console.log('[SocketConnect useEffect - SOCKET] - connected')
    }

    if (socket.connected && !userSession) {
      console.log('[SocketConnect useEffect - SOCKET] - emitting user_connected')
      socket.emit('user_connected', session.user);

      socket?.on('user_connection_success', (response: { message: Conversation[], userSession: UserSession }) => {
        console.log('[user_connection_success]', response);
        const { message, userSession: userSessionResponse } = response;
        setUserSession(userSessionResponse);
      })

      socket?.on("user_connection_failed", (response: { message: string }) => {
        console.log('[user_connection_failed]', response);
        if (response.message === 'NOT_AUTHENTICATED') {
          // redirect('/server-login', 'push');
          router.push('/server-login');
        }
      })

      return;
    }

    if (userSession && socket.connected) {
      socket?.emit('retrieve_messages', { userSession });
    }

    return () => {
      if (socket) {
        console.log("[SocketConnect useEffect - SOCKET] - disconnecting on unmount")
        socket.disconnect();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, userSession, setUserSession])

  return <></>

}

export default SocketConnect;