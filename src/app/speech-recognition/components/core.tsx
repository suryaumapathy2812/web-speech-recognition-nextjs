'use client';

import socket from '@/utils/socket';
import { classNames } from '@/utils/utils';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useRef, useState } from 'react';
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Playfair } from 'next/font/google';

const playfair = Playfair({ subsets: ['latin'] })


function Core() {

  const { user, error, isLoading } = useUser();
  const userSession = useRef<UserSession | null>(null);
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");

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
    setInput('');
  }

  socket.on('conversation_response', (response: ThreadMessage[]) => {
    console.debug('[GPT_RESPONSE]', response);

    const _conversation = (response[0].content[0] as any).text?.value;
    setResponse(_conversation);
  })

  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div className="relative flex flex-col justify-center items-center h-full">{"Loading..."}</div>;

  return (
    <>
      <div
        className={classNames(
          "bg-green-950 relative flex flex-col justify-center items-center h-full",
        )}
      >

        <form
          className='sm:w-full md:w-3/6 flex flex-col justify-center items-center'
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        >

          {
            response &&
            <MarkdownPreview
              className={classNames(
                "mb-16 !bg-transparent !text-white text-left  overflow-y-auto"
              )} source={response} />
          }

          <input
            type="text"
            autoFocus={true}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message here...'
            className='outline-none text-center text-2xl bg-transparent h-16 border-0 border-b-2 border-green-900 text-white p-4 pb-2 w-full'
          />

        </form >
      </div>

    </>
  )

}

export default Core;