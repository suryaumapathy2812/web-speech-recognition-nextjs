'use client';

import { useEffect, useRef, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client'
import socket from '@/utils/socket';

function Core() {

  const { user, error, isLoading } = useUser();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string | null>(null);
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
      if (!transcript)
        return;
      sendMessage(transcript);
      setTranscript(null);
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
  if (isLoading) return <div className="relative flex flex-col justify-center items-center h-full">{"Loading..."}</div>;

  return (
    <>
      <div className="relative flex flex-col justify-center items-center h-full cursor-pointer"
        onClick={handleToggleRecording}
      >
        <h1 className="text-center text-4xl">
          {isRecording ? "Listening..." : "Tap to speak"}
        </h1>

        {(isRecording || transcript) &&
          <p className="text-center transcribing absolute bottom-20 bg-black text-white p-4 md:w-fit sm:w-screen md:max-w-3/6">
            {transcript}
          </p>
        }
      </div >
    </>
  )


}

export default Core;