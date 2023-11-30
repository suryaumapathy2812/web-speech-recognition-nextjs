'use client';

import { redirect } from "next/navigation";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { Playfair_Display } from 'next/font/google'
import { classNames } from "@/utils/utils";
import Core from "./components/core";
import { useUser } from "@auth0/nextjs-auth0/client";
import { lastResponse } from "@/utils/signals/conversation";

const playfair = Playfair_Display({ subsets: ['latin'] });

function Home() {

  const { user, isLoading, error } = useUser();

  if (error) {
    redirect('/api/auth/login');
  }

  if (isLoading) return <div className="relative flex flex-col justify-center items-center h-full">{"Loading..."}</div>;


  return (
    <>
      <main className={classNames("relative bg-gray-100 text-black flex h-screen flex-col justify-between", playfair.className)}>
        <Core last_response={lastResponse} />
      </main>
    </>
  )
}


export default Home;