'use server';

import { OpenAI } from "openai";
import { listEmail } from "../integrations/gmail";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { getNewsByQuery, getNewsHeadLines } from "../integrations/news";
import { getWeather } from "../integrations/weather";
import { getLocation } from "../integrations/location";

const $OPEN_AI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function initializeThread() {
  try {
    return await $OPEN_AI.beta.threads.create();
  } catch (error) {
    console.error("[ERROR] Failed to initialize thread:", error);
    throw error;
  }
}

async function sendMessage(threadId: string, message: string) {
  try {
    await waitForRunCompletion(threadId);

    const newMessage = await $OPEN_AI.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const assistant = await $OPEN_AI.beta.assistants.retrieve("asst_UriK8p1GRkSRLKKGm5Dyuync");
    const runResponse = await $OPEN_AI.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    await processRunActions(threadId, runResponse);

    await waitForRunCompletion(threadId);

    return await listMessages(threadId);
  } catch (error) {
    console.error("[ERROR] Failed to send message:", error);
    throw error;
  }
}

async function waitForRunCompletion(threadId: string) {
  // console.log("Processing run actions")
  let runs = await $OPEN_AI.beta.threads.runs.list(threadId);
  let activeOrPendingRun = runs.data.find(run => run.status === 'queued' || run.status === 'in_progress' || run.status === 'requires_action');

  while (activeOrPendingRun) {
    console.log("Run status:", activeOrPendingRun.status)
    // If the run requires action, process it before continuing
    if (activeOrPendingRun.status === 'requires_action') {
      await processRunActions(threadId, activeOrPendingRun);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    runs = await $OPEN_AI.beta.threads.runs.list(threadId);
    activeOrPendingRun = runs.data.find(run => run.status === 'queued' || run.status === 'in_progress' || run.status === 'requires_action');
  }
}

async function processRunActions(threadId: string, runResponse: Run) {
  // console.log("Processing run actions")
  let retrievedRun = await $OPEN_AI.beta.threads.runs.retrieve(threadId, runResponse.id);

  if (retrievedRun.status === 'requires_action' && retrievedRun.required_action?.submit_tool_outputs.tool_calls) {
    await handleToolCalls(threadId, runResponse, retrievedRun.required_action.submit_tool_outputs.tool_calls);
  }

  while (retrievedRun.status === 'queued' || retrievedRun.status === 'in_progress') {
    await new Promise(resolve => setTimeout(resolve, 100));
    retrievedRun = await $OPEN_AI.beta.threads.runs.retrieve(threadId, runResponse.id);
  }
}

async function handleToolCalls(threadId: string, runResponse: Run, toolCalls: any[]) {
  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    let functionCallResponse;

    console.log("Function name:", functionName)
    console.log("Function args:", args)

    switch (functionName) {
      case "listEmails":
        try {
          const emails = await listEmail(args.query, args.maxResults, args.labelIds);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ data: emails }),
          };
        } catch (error) {
          console.error("Error in listEmails:", error);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: "Failed to list emails" }),
          };
        }
        break;
      case "getNewsHeadLines":
        try {
          const emails = await getNewsHeadLines({});
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ data: emails }),
          };
        } catch (error) {
          console.error("Error in Fetch News by Headlines:", error);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: "Failed to fetch news by headlines" }),
          };
        }
        break;
      case "getNewsByQuery":
        try {
          const emails = await getNewsByQuery(args);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ data: emails }),
          };
        } catch (error) {
          console.error("Error in Fetch News by Query:", error);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: "Failed to fetch news by query" }),
          };
        }
        break;
      case 'getWeather':
        try {
          const weather = await getWeather(args);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ data: weather }),
          };
        } catch (error) {
          console.error("Error in Fetch Weather:", error);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: "Failed to fetch weather" }),
          };
        }
        break;
      case 'getLocation':
        try {
          const weather = await getLocation(args);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ data: weather }),
          };
        } catch (error) {
          console.error("Error in Fetch Weather:", error);
          functionCallResponse = {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: "Failed to fetch weather" }),
          };
        }
        break;
      default:
        console.log("No function found for:", functionName);
        break;
    }

    if (functionCallResponse) {
      await $OPEN_AI.beta.threads.runs.submitToolOutputs(threadId, runResponse.id, {
        tool_outputs: [functionCallResponse],
      });
    }
  }
}

async function listMessages(threadId: string) {
  try {
    const messages = await $OPEN_AI.beta.threads.messages.list(threadId);
    return messages.data;
  } catch (error) {
    console.error("[ERROR] Failed to list messages:", error);
    throw error;
  }
}


export { initializeThread, sendMessage, listMessages }