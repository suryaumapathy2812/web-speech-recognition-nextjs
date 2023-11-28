
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Core from './components/core';
import { redirect } from "next/navigation";

import { Playfair_Display } from 'next/font/google'
import { classNames } from "@/utils/utils";

const playfair = Playfair_Display({ subsets: ['latin'] })

async function Page() {

  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <main className={classNames("relative bg-gray-100 text-black flex h-screen flex-col justify-between", playfair.className)}>
      <Core />
    </main>
  )
}


export default withPageAuthRequired(Page);