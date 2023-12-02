'use client';

import socket from '@/utils/socket';
import useUserSessionStore from '@/utils/stores/session.store';
import { useSession } from 'next-auth/react';
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'
import useConversationStore from '@/utils/stores/conversation.store';
import { listMessages } from '@/utils/actions/assistant';

function SocketConnect(props: { userSession: UserSession }) {

  const { userSession, setUserSession } = useUserSessionStore();
  const { syncMessages } = useConversationStore();
  const router = useRouter();

  useEffect(() => {
    const message = async () => {
      console.log("USER_SESSION: ", props.userSession);
      setUserSession(props.userSession);
      const messages = await listMessages(props.userSession.thread.id);
      syncMessages(messages.map((mess) => ({ content: (mess.content[0] as any).text.value, role: mess.role })));
    }
    message();
  }, []);


  return <></>

}

export default SocketConnect;