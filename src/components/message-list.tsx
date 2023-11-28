'use client';

import socket from "@/utils/socket";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { useEffect, useState } from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Bot, User } from 'lucide-react';


const Message = (props: Conversation) => {
  return <MarkdownPreview className="!bg-transparent !text-white text-left" source={props.content} />
}


const MessageList = () => {

  const [conversations, setConversations] = useState<Conversation[]>([]);

  socket.on('user_connection_success', (response: { messages: ThreadMessage[], userSession: UserSession }) => {
    console.log('[user_connection_success]', response);
    const { messages, userSession: userSessionResponse } = response;

    if (messages.length > 0) {
      const conv = messages.map((thread: any) => {
        return {
          role: thread.role,
          content: thread.content[0].text?.value
        }
      }).reverse();
      setConversations(conv)
    }
  })

  socket.on('conversation_response', (response: ThreadMessage[]) => {
    console.log('[GPT_RESPONSE]', response);

    const _conversation = response.map((thread: any) => {
      return {
        role: thread.role,
        content: thread.content[0].text?.value
      }
    }).reverse();

    setConversations(_conversation)
  })

  useEffect(() => {
    setConversations([{
      role: 'assistant',
      content: 'Hi, how can I help you?'
    }])

  }, [])

  return (
    <>
      <div className="flex flex-col space-y-8">
        {
          conversations.map((item, index) => (
            <div key={index}>
              {item.role === 'assistant' && (
                /* Chat message */
                <div className="flex items-start w-3/4 mr-auto" >
                  <div className="flex-shrink-0">
                    <p className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center'>
                      <Bot size={24} className="text-white" />
                    </p>
                  </div>
                  <div className="ml-4">
                    {/* <p className="text-gray-600 text-left">{item.content}</p> */}
                    <Message content={item.content} role={item.role} />
                  </div>
                </div>
              )}

              {item.role === 'user' && (
                /* User message */
                <div className="flex items-start justify-end  w-3/4 ml-auto">
                  <div className="mr-4">
                    <p className="text-gray-400 text-left">{item.content}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center'>
                      <User size={24} className="text-white" />
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))

        }

      </div>
    </>
  )

}

export default MessageList;