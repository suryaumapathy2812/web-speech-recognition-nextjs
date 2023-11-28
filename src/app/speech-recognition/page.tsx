import { redirect } from "next/navigation";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { Playfair_Display } from 'next/font/google'
import { classNames } from "@/utils/utils";
import Core from "./components/core";

const playfair = Playfair_Display({ subsets: ['latin'] });


async function Home() {

  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <>
      <main className={classNames("relative bg-gray-100 text-black flex h-screen flex-col justify-between", playfair.className)}>
        <Core />
      </main>
    </>
  )
}


export default withPageAuthRequired(Home);