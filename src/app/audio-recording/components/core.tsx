'use client';

import { useEffect, useRef, useState } from "react";
import { classNames } from "@/utils/utils";
import useUserSessionStore from "@/utils/stores/session.store";
import { sendMessage as addMessageToThread } from "@/utils/actions/assistant"
import useConversationStore from "@/utils/stores/conversation.store";
import { Inter } from "next/font/google";
import MarkdownPreview from '@uiw/react-markdown-preview';

const inter = Inter(
  {
    subsets: ['latin'],
    display: 'swap',
    adjustFontFallback: false
  }
)

function Core() {

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const { userSession } = useUserSessionStore();
  const [response, setResponse] = useState<string>("");
  const { lastMessage, syncMessages } = useConversationStore();

  const currentTranscriptRef = useRef<string>('');


  useEffect(() => {

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // recognitionRef.current.continuous = true;
      }
    }

  }, [userSession])


  async function sendMessage(message: string) {
    // console.log("[SENDING MESSAGE]====================================")
    // console.log(message);
    const response = await addMessageToThread(userSession?.thread.id, message);
    // console.log("RESPONSE: ", response);
    syncMessages(response.map((mess) => ({ content: (mess.content[0] as any).text.value, role: mess.role })));
    setResponse((response[0].content[0] as any).text.value);
    // setFinalTranscript(null);
  }

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
      const list = event.results.item(0);
      // console.log("list", list)
      const { isFinal } = list;
      const result = list.item(0);
      const transcript = result.transcript;
      // console.log("transcript", transcript);
      currentTranscriptRef.current = transcript;
      if (isFinal) {
        await stopRecording();
        return;
      }
    }

    recognitionRef.current.start();
  }

  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setTimeout(() => {
        setIsRecording(false);
        currentTranscriptRef.current = '';
      }, 1000);
      // console.log("[STOP RECORDING]", currentTranscriptRef.current);
      if (currentTranscriptRef.current.trim() === '') return;
      await sendMessage(currentTranscriptRef.current);
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
          (!isRecording) &&
          <p
            suppressHydrationWarning={true}
            className={classNames("mt-4 rounded-md text-center bottom-20 font-medium p-4 w-screen md:w-3/6", inter.className)}>
            {/* {response} */}

            <MarkdownPreview
              className={classNames(
                "mb-16 !bg-white !text-black text-left  overflow-y-auto"
              )}
              source={lastMessage().content}
            />
          </p>
        }

        {
          (isRecording) &&
          <p className={classNames("mt-4 rounded-md text-center bottom-20 font-medium p-4 w-screen md:w-3/6", inter.className)}>
            {currentTranscriptRef.current}
          </p>
        }

      </div>
    </>
  )


}

export default Core;