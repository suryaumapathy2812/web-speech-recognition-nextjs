'use client';

// Import necessary hooks and components
import { useEffect, useRef, useState } from "react";
import useConversationStore from "@/utils/stores/conversation.store";
import useUserSessionStore from '@/utils/stores/session.store';
import useUserInputStore from '@/utils/stores/input.store';
import useToggleInputStore, { ToggleInput } from '@/utils/stores/toggleInput.store';
import { sendMessage as addMessageToThread } from "@/utils/actions/assistant";
import { classNames } from '@/utils/utils';
import { AudioLines, SendHorizonalIcon } from 'lucide-react';
import MessageList from "./message-list";


function CombinedCore() {
  // Text input state
  const [response, setResponse] = useState<string>("");

  // Speech recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const currentTranscriptRef = useRef<string>('');

  // Shared states and effects
  const { userSession } = useUserSessionStore();
  const { lastMessage, syncMessages, conversationList } = useConversationStore();
  const { input, setInput, disabled, setDisabled } = useUserInputStore();
  const { toggleInput, setToggleInput } = useToggleInputStore();

  // Function to send message (common for both text and speech input)
  async function sendMessage(message: string) {
    setDisabled(true);
    const response = await addMessageToThread(userSession?.thread.id, message);
    syncMessages(response.map((mess) => ({ content: (mess.content[0] as any).text.value, role: mess.role })));
    setResponse((response[0].content[0] as any).text.value);
    setDisabled(false);
    setInput('');
  }

  // Function to start recording (for speech input)
  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
      const list = event.results.item(0);
      const { isFinal } = list;
      const result = list.item(0);
      const transcript = result.transcript;
      currentTranscriptRef.current = transcript;
      setInput(transcript);
      if (isFinal) {
        await stopRecording();
      }
    }

    recognitionRef.current.start();
  }

  // Function to stop recording (for speech input)
  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (currentTranscriptRef.current.trim() !== '') {
        await sendMessage(currentTranscriptRef.current);
        currentTranscriptRef.current = '';
      }
    }
  }

  // Toggle input method
  const toggleInputMethod = () => {
    setToggleInput(toggleInput == ToggleInput.TEXT ? ToggleInput.AUDIO : ToggleInput.TEXT);
    if (isRecording) {
      stopRecording();
    }
  };

  // Component cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, []);

  // Render
  return (
    <>
      <div className={classNames("relative flex flex-col justify-center items-center h-screen w-screen bg-green-950 text-white ")}>

        <div className='overflow-y-auto flex-1 w-full md:w-4/5 lg:w-2/5 mb-28 no-scrollbar px-4 mt-10'>
          <MessageList conversations={conversationList.toReversed()} />
        </div>

        <div className="absolute bottom-0 bg-green-980 rounded-t-md w-full md:w-3/5 lg:w-2/4 p-4 pb-6">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <div
              className='flex outline-none text-left text-lg bg-transparent rounded-md border-green-950 p-2 px-4 border-2 text-white w-full'
            >
              <textarea
                rows={1}
                id="text-input"
                autoFocus={true}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                placeholder='Enter your message here.'
                value={input}
                className="flex-1 bg-transparent outline-none rounded-md text-white text-base resize-none"
              >
              </textarea>

              {
                (!isRecording && input.length === 0) &&
                <button
                  className="ml-2 flex items-center justify-center rounded-full bg-green-950 w-10 h-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-950"
                  onClick={isRecording ? stopRecording : startRecording}
                  aria-label="toggleInputMethod"
                >
                  <AudioLines className="relative inline-flex rounded-full" />
                </button>
              }

              {
                (!isRecording && input.length > 0) &&
                <button
                  type="submit"
                  className="ml-2 flex items-center justify-center rounded-full bg-green-950 w-10 h-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-950"
                  aria-label="button-submit"
                  disabled={disabled}
                >
                  <span className="relative flex">
                    {/* {isRecording && <AudioLines className="animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75" />} */}
                    <SendHorizonalIcon className="relative inline-flex rounded-full" />
                  </span>
                </button>
              }

              {
                (isRecording) &&
                <button
                  className="ml-2 flex items-center justify-center rounded-full bg-green-950 w-10 h-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-950"
                  onClick={isRecording ? stopRecording : startRecording}
                  aria-label="toggleInputMethod"
                >
                  <span className="relative flex">
                    {isRecording && <AudioLines className="animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75" />}
                    <AudioLines className="relative inline-flex rounded-full" />
                  </span>
                </button>
              }

            </div>
          </form>
        </div>

      </div>
    </>
  );
}

export default CombinedCore;
