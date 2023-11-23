/* eslint-disable @next/next/no-img-element */
'use client';

import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useBoolean } from 'usehooks-ts';

import { io } from 'socket.io-client'

const socket = io("http://localhost:3000");

const ChatPage: React.FC = () => {

  const [conversationHistory, setConversationHistory] = useState<{ type: 'USER' | 'BOT', message: string }[]>([
    {
      type: 'BOT',
      message: 'Hello, how can I assist you?'
    }
  ])


  function sendMessage(message: string) {
    socket.emit('message', message);
  }

  const [message, setMessage] = useState<string>('');
  const messageRef = useRef(message);
  const recognitionRef = useRef<any>(null);
  const { value: recordStatus, setValue: setRecordStatus } = useBoolean(false)
  const { value: hasEnded, setValue: setHasEnded } = useBoolean(true)


  useEffect(() => {
    recognitionRef.current.addEventListener("start", (event: any) => {
      console.log('[START]', event)
      setRecordStatus(true);
    });

    // Add your event listeners and other logic here
    recognitionRef.current.addEventListener('result', (event: any) => {
      // console.log('[RESULT]', event)

      // const text = Array.from(event.results)
      //   .map((result: any) => result[0])
      //   .map((result) => result.transcript)
      //   .join("");

      const text = event.results[0][0].transcript;

      console.log('(log)', text)

      if (event.results[0].isFinal) {
        console.log('(final)', text)
        messageRef.current = text;
        recognitionRef.current.abort()
      }

    })

    recognitionRef.current.addEventListener('end', (event: any) => {
      console.log('[END]', event)

      console.log('record', recordStatus)
      console.log('[FINAL_MESSAGE]', messageRef.current)
      setMessage(messageRef.current);
    })

    recognitionRef.current.addEventListener('end', (event: any) => {
      console.log("[END]", event);
      setRecordStatus(false);
    })


    socket.on('response', (response: string) => {
      if (response) console.log(response);
    })

    return () => {
      socket.off('response');
    }
  }, [recordStatus, setRecordStatus]);


  const startRecording = () => {
    console.log('startRecording')
    recognitionRef.current.continuous = true;
    recognitionRef.current.start();
  }

  const stopRecording = () => {
    console.log('stopRecording')
    console.log(recognitionRef.current);
    recognitionRef.current.abort();
    setRecordStatus(false);
  }


  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100">
      <Head>
        <title>Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8 text-black">Chat</h1>

        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          {/* Chat messages */}
          <div className="flex flex-col space-y-8">
            {
              conversationHistory.map((item, index) => (
                <div key={index}>
                  {item.type === 'BOT' && (
                    /* Chat message */
                    <div className="flex items-center w-3/4 mr-auto" >
                      <div className="flex-shrink-0">
                        <p className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center'>
                          AI
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600 text-left">{item.message}</p>
                      </div>
                    </div>
                  )}

                  {item.type === 'USER' && (
                    /* User message */
                    <div className="flex items-center justify-end  w-3/4 ml-auto">
                      <div className="mr-4">
                        <p className="text-gray-600 text-left">{item.message}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className='rounded-full bg-black text-white w-10 h-10 flex items-center justify-center'>
                          U
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ))

            }

          </div>

          {/* Chat input */}
          <div className="mt-16 flex gap-2">
            <textarea
              value={message}
              onChange={(e) => (setMessage(e.target.value))}
              readOnly={false}
              className="w-10/12 border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Type your message..."
            >
            </textarea>
            {
              !recordStatus && <button
                onClick={() => startRecording()}
                className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                start
              </button>
            }

            {
              recordStatus && <button
                onClick={() => stopRecording()}
                className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                stop
              </button>
            }

            <button
              onClick={() => sendMessage(messageRef.current)}
              className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
