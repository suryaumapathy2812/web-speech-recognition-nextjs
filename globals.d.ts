interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface UserSession {
  user_id: string,
  // sessions: string[],
  user: {
    email: string
    email_verified: boolean
    family_name: string
    given_name: string
    locale: string
    name: string
    nickname: string
    picture: string
    sid: string
    sub: string
    updated_at: string
  },
  thread: any
}


interface Conversation {
  role: 'user' | 'assistant',
  content: string,
}

