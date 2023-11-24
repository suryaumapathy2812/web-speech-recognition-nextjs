import { io } from "socket.io-client";
import ChatPage from "./components/chat-ui";

import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Head from "next/head";
import MessageList from "./components/message-list";

async function Home() {

  const session = await getSession();

  if (!session?.user) return <div>{"Failed to load session"}</div>;


  return (
    <>
      <Head>
        <title>Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 flex min-h-screen flex-col justify-between md:p-24">

        <div className="flex flex-col items-center justify-center  bg-gray-100">

          <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-8 text-black">Chat</h1>

            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
              {/* Chat messages */}
              <MessageList />


              {/* Chat input */}
              <ChatPage />
            </div>
          </main>
        </div>


      </main>
    </>
  )
}


export default withPageAuthRequired(Home);