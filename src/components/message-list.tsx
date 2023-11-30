'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import { Bot, User } from 'lucide-react';
import { Signal } from "@preact/signals-core";

const Message = (props: Conversation) => {
  return <MarkdownPreview className="!bg-transparent !text-white text-left" source={props.content} />
}


const MessageList = ({ conversations }: { conversations: Signal<Conversation[]> }) => {

  return (
    <>
      <div className="flex flex-col space-y-8">
        {
          conversations.value.map((item, index) => (

            <div key={index}>
              {item.role === 'assistant' && (
                /* Chat message */
                <div className="flex items-start w-3/4 mr-auto" >
                  <div className="flex-shrink-0">
                    <p className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center'>
                      <Bot size={24} className="text-white" />
                    </p>
                  </div>
                  <div className="ml-4 w-full">
                    {/* <p className="text-gray-600 text-left">{item.content}</p> */}
                    <Message content={item.content} role={item.role} />
                  </div>
                </div>
              )}

              {item.role === 'user' && (
                /* User message */
                <div className="flex items-start justify-end  w-3/4 ml-auto">
                  <div className="mr-4 w-full">
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