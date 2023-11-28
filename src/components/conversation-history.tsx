'use client';

import { classNames } from '@/utils/utils';
import { useToggle } from 'usehooks-ts';
import { Inter, Playfair } from 'next/font/google';
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import MessageList from '@/components/message-list';
import socket from '@/utils/socket';
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";


const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair({ subsets: ['latin'] })


const ConversationHistory = () => {

  const [sidebarStatus, toggleSidebarStatus, setSidebarStatus] = useToggle(false);

  socket.on('conversation_response', (response: ThreadMessage[]) => {
    console.log('[GPT_RESPONSE]', response);
    const recentResponse = (response[0] as any).content[0].text.value;
    console.log('recentResponse', recentResponse);
  })

  return (
    <>

      {
        !sidebarStatus &&
        <div className='absolute z-10 p-4 right-0'>
          <button
            onClick={toggleSidebarStatus}
            type="button"
            className={classNames(
              "flex items-center rounded-md px-2.5 py-1.5 text-sm text-black font-bold hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            )}
          >
            Conversation
            <PanelRightOpen className='ml-2' size={16} />
          </button>
        </div>
      }

      {
        sidebarStatus &&

        <div className='absolute z-10 w-screen h-screen backdrop-blur-md'>
          <div className={classNames(inter.className, 'absolute right-0 h-screen overflow-y-auto bg-green-950 z-10 p-4 shadow-md', sidebarStatus ? 'w-screen md:w-2/6 lg:w-5/12 min-h-screen  ' : 'hidden')}>

            <div className='flex flex-row justify-between'>
              <h1 className={classNames(playfair.className, 'text-center text-2xl  text-white')}> Conversation </h1>
              <button
                onClick={toggleSidebarStatus}
                type="button"
                className="flex items-center rounded-md px-2.5 py-1.5 text-sm text-white font-normal hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Close
                <PanelRightClose className='ml-2' size={16} />
              </button>
            </div>

            <div className='mt-4'>
              <MessageList />
            </div>

          </div>
        </div>

      }


    </>
  )

}

export default ConversationHistory;