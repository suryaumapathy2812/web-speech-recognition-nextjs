'use client';

import { useEffect, useRef, useState } from "react";
import { classNames } from "@/utils/utils";
import useUserSessionStore from "@/utils/stores/session.store";
import { redirect } from "next/navigation";
import { sendMessage as addMessageToThread } from "@/utils/actions/assistant"
import useConversationStore from "@/utils/stores/conversation.store";


function Core() {

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const { userSession } = useUserSessionStore();
  const [response, setResponse] = useState<string>("");
  const { syncMessages } = useConversationStore();

  useEffect(() => {

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // recognitionRef.current.continuous = true;
      }
    }

  }, [userSession])


  async function sendMessage(message: string) {
    const response = await addMessageToThread(userSession?.thread.id, message);
    console.log("RESPONSE: ", response);
    syncMessages(response.map((mess) => ({ content: (mess.content[0] as any).text.value, role: mess.role })))
    setResponse((response[0].content[0] as any).text.value);
    setTranscript(null);
    // console.debug('sendMessage', socket);
    // socket?.emit('message', { message, userSession: userSession });
  }

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const list = event.results.item(0);
      const { isFinal, item } = list
      const result = item(0);
      const transcript = result.transcript;
      console.log("transcript", transcript);
      setTranscript(transcript);
      if (isFinal) {
        stopRecording();
      }
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

  return (
    <>
      <div
        className={classNames(
          "relative flex flex-col justify-center items-center h-full cursor-pointer",
          !isRecording ? 'bg-white text-green-950' : 'bg-green-950 text-white'
        )}
        onClick={handleToggleRecording}
      >

        {response &&
          <p className="mt-4 rounded-md text-center bottom-20 text-white p-4 md:w-fit sm:w-screen md:max-w-3/6">
            {response}
          </p>
        }

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