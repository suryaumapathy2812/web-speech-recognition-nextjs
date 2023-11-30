'use client';

import { classNames } from '@/utils/utils';
import { useToggle } from 'usehooks-ts';
import { Inter, Playfair_Display } from 'next/font/google';
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import MessageList from '@/components/message-list';
import socket from '@/utils/socket';
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { conversations, setConversations } from '@/utils/signals/conversation.signal';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';


const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })


const ConversationsDrawer = () => {

  const { user, error, isLoading } = useUser();
  const [sidebarStatus, toggleSidebarStatus, setSidebarStatus] = useToggle(false);

  if (error) {
    redirect('/api/auth/login');
  }

  const events = [
    'conversation_response',
    'retrieve_messages_success'
  ]

  events.forEach((event) => {
    socket.on(event, (response: ThreadMessage[]) => {
      console.log('[conversation_responses]', response);

      const _con = response.map((thread: any) => {
        return {
          role: thread.role,
          content: thread.content[0].text?.value
        }
      }).reverse()

      console.log('[GPT_RESPONSE]', _con);
      setConversations(_con);

      console.log('[GPT_RESPONSE]', response);
      const recentResponse = (response[0] as any).content[0].text.value;
      console.log('recentResponse', recentResponse);
    })
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
        <>

          <div className='absolute z-[5] w-screen h-screen backdrop-blur-md' onClick={toggleSidebarStatus}>
          </div>
          <div className={classNames(inter.className, 'absolute flex flex-col right-0 h-screen overflow-y-auto bg-green-950 z-20 p-4 shadow-md', sidebarStatus ? 'w-screen md:w-2/6 lg:w-5/12 min-h-screen  ' : 'hidden')}>

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

            <div className='mt-4 overflow-y-auto flex-1'>
              <MessageList conversations={conversations} />
            </div>

          </div>
        </>
      }


    </>
  )

}

export default ConversationsDrawer;