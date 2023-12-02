interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface UserSession {
  user_id: string,
  sessions: string[],
  user: {
    name: string,
    email: string,
    id: string
  },
  thread: any
}


interface Conversation {
  role: 'user' | 'assistant',
  content: string,
}

