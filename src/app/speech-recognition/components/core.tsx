'use client';

import { classNames } from '@/utils/utils';
import { useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Playfair } from 'next/font/google';

import useConversationStore from "@/utils/stores/conversation.store";
import useUserSessionStore from '@/utils/stores/session.store';
import { sendMessage as addMessageToThread } from "@/utils/actions/assistant"

const playfair = Playfair({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
})


function Core() {

  const { userSession } = useUserSessionStore();
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const { lastMessage, syncMessages } = useConversationStore();


  async function sendMessage(message: string) {
    const response = await addMessageToThread(userSession?.thread.id, message);
    // console.log("RESPONSE: ", response);
    syncMessages(response.map((mess) => ({ content: (mess.content[0] as any).text.value, role: mess.role })))
    setResponse((response[0].content[0] as any).text.value);
    setInput('');
  }


  return (
    <>
      <div
        className={classNames(
          "bg-green-950 relative flex flex-col justify-center items-center h-screen",
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