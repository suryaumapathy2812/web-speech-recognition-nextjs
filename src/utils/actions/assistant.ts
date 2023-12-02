'use server';

import { OpenAI } from "openai";


const $OPEN_AI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function initializeThread() {
  const thread = await $OPEN_AI.beta.threads.create();
  console.debug("[THREAD]", thread)
  return thread;
}

export async function sendMessage(threadId: string, message: string) {

  const newMessage = await $OPEN_AI.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  })
  console.debug("[APPENDED_THREAD]", newMessage)


  const assistant = await $OPEN_AI.beta.assistants.retrieve("asst_UriK8p1GRkSRLKKGm5Dyuync", {
    stream: false,
    maxRetries: 3,
  });
  console.debug("[ASSISTANT]", assistant)


  const run_response = await $OPEN_AI.beta.threads.runs.create(threadId, {
    assistant_id: assistant.id,
  })
  console.debug("[RUN_RESPONSE]", run_response)


  let retrieved_runs = await $OPEN_AI.beta.threads.runs.retrieve(threadId, run_response.id);
  while (retrieved_runs.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 100));
    retrieved_runs = await $OPEN_AI.beta.threads.runs.retrieve(threadId, run_response.id);
  }
  console.debug("[RETRIEVED_RUNS]", retrieved_runs)


  const messages = await listMessages(threadId);
  // const lastMessage = messages.find((message) => message.run_id === run_response.id && message.role === 'assistant');
  // console.debug("[LAST_MESSAGE]", lastMessage)


  return messages;
}

export async function listMessages(threadId: string) {
  const messages = await $OPEN_AI.beta.threads.messages.list(threadId);
  console.debug("[MESSAGES]", messages);
  return messages.data;
}