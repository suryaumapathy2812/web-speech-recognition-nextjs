'use client';

import socket from '@/utils/socket';
import { classNames } from '@/utils/utils';
import { useRef, useState } from 'react';
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Playfair } from 'next/font/google';

import useConversationStore from "@/utils/stores/conversation.store";


const playfair = Playfair({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
})


function Core() {

  const userSession = useRef<UserSession | null>(null);
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const { lastMessage } = useConversationStore();


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
              )}
              source={lastMessage().content}
            />
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