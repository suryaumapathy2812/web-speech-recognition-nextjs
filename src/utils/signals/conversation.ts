'use client';

import { computed, signal } from "@preact/signals-core";

const conversations = signal<Conversation[]>([{
  role: 'assistant',
  content: 'Hi, how can I help you?'
}]);

const addConversation = (newConversation: Conversation) => {
  conversations.value = [newConversation, ...conversations.value];
}

const setConversations = (conversationHistory: Conversation[]) => {
  conversations.value = conversationHistory;
}

const lastResponse = computed(() => {
  return conversations.value[0];
});


export { conversations, lastResponse, setConversations, addConversation }