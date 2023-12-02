import { create } from 'zustand';


type ConversationState = {
  conversationList: Conversation[];
  addMessage: (newMessage: Conversation) => void;
  lastMessage: () => Conversation;
  syncMessages: (messageHistory: Conversation[]) => void;
}

const useConversationStore = create<ConversationState>((set, get) => ({
  conversationList: [{
    role: 'assistant',
    content: 'Hi, how can I help you?'
  }],

  addMessage: (newMessage: Conversation) => {
    set({ conversationList: [newMessage, ...get().conversationList] })
  },

  lastMessage: () => {
    return get().conversationList.reverse().filter((message) => message.role === 'assistant')[0]
  },

  syncMessages: (messageHistory) => set({ conversationList: messageHistory }),

}));

export default useConversationStore;