'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import { classNames } from '@/utils/utils';

const MessageList = ({ conversations }: { conversations: Conversation[] }) => {

  return (
    <>
      <div className="flex flex-col space-y-4">
        {
          conversations.map((item, index) => (

            <div key={index}>
              {item.role === 'assistant' && (
                /* Chat message */
                <div className="flex items-end w-full">
                  <div className="w-full">
                    <h4 className={classNames('font-playfair pt-4 pb-2 text-white text-xl sticky top-0 bg-green-950')}>
                      Assistant
                    </h4>
                    <MarkdownPreview className="!z-[6] !bg-transparent !text-gray-400 text-left w-full" source={item.content} />
                  </div>
                </div>
              )}

              {item.role === 'user' && (
                /* User message */
                <div className="flex items-end w-full">
                  <div className="w-full">
                    <h4 className={classNames('font-playfair pt-4 pb-2 text-white text-xl sticky top-0 bg-green-950')}>
                      User
                    </h4>
                    <p className="text-gray-400">{item.content}</p>
                  </div>
                </div>
              )}

            </div>
          ))

        }

      </div >
    </>
  )

}

export default MessageList;