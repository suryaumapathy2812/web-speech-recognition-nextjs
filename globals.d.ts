interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
  webkitAudioContext: typeof AudioContext;
}

interface UserSession {
  user_id: string,
  // sessions: string[],
  user: {
    email: string
    name: string,
    image: string,
  },
  thread: any
}

interface Conversation {
  role: 'user' | 'assistant',
  content: string,
}