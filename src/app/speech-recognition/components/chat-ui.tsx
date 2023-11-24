/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'
import socket from '@/utils/socket';

const ChatPage = () => {

  const { user, error, isLoading } = useUser();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const userSession = useRef<UserSession | null>(null);
  const recognitionRef = useRef<any>(null);

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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // recognitionRef.current.continuous = true;
        // recognitionRef.current.onresult = null;
      }
      if (socket) {
        socket.disconnect();
      }
    }

  }, [user])


  function sendMessage(message: string) {
    console.debug('sendMessage', socket);
    socket?.emit('message', { message, userSession: userSession.current });
  }

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      console.log(transcript);
      setTranscript(transcript);
    }

    recognitionRef.current.start();
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      sendMessage(transcript);
      setTranscript('');
    }
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }


  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>{"Failed to load session"}</div>;

  return (
    <>
      <div className="mt-16 flex gap-2" >
        <textarea
          value={transcript}
          onChange={(e) => (setTranscript(e.target.value))}
          readOnly={false}
          className="w-10/12 border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Type your message..."
        >
        </textarea>
        {
          !isRecording && <button
            onClick={handleToggleRecording}
            className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            start
          </button>
        }

        {
          isRecording && <button
            onClick={handleToggleRecording}
            className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            stop
          </button>
        }

        <button
          onClick={() => sendMessage(recognitionRef.current)}
          className="w-2/12 flex items-center justify-center h-10 bg-black rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
          Send
        </button>
        <div />

      </div>
    </>
  );
};

export default ChatPage;
