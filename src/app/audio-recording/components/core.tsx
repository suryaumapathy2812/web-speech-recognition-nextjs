'use client';

import { useEffect, useRef, useState } from "react";
import { useSession } from 'next-auth/react'
import socket from '@/utils/socket';
import { classNames } from "@/utils/utils";
import useUserSessionStore from "@/utils/stores/session.store";
import { redirect } from "next/navigation";

function Core() {

  const { data: user, status } = useSession();
  const { userSession } = useUserSessionStore();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // recognitionRef.current.continuous = true;
      }
    }

  }, [user])


  function sendMessage(message: string) {
    console.debug('sendMessage', socket);
    socket?.emit('message', { message, userSession: userSession });
  }

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      console.log("transcript", transcript);
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

  if (status === "unauthenticated") redirect('/api/auth/signin');
  if (status === 'loading') return <div className="relative flex flex-col justify-center items-center h-full">{"Loading..."}</div>;

  return (
    <>
      <div
        className={classNames(
          "relative flex flex-col justify-center items-center h-full cursor-pointer",
          !isRecording ? 'bg-white text-green-950' : 'bg-green-950 text-white'
        )}
        onClick={handleToggleRecording}
      >

        {
          !isRecording && <h1 className="text-center text-4xl font-medium">
            Tap to speak
          </h1>
        }

        {
          isRecording && <h1 className="text-center text-4xl font-medium">
            Listening...
          </h1>
        }

        {
          (isRecording && transcript) &&
          <p className="mt-4 rounded-md text-center bottom-20 text-white p-4 md:w-fit sm:w-screen md:max-w-3/6">
            {transcript}
          </p>
        }

      </div>
    </>
  )


}

export default Core;