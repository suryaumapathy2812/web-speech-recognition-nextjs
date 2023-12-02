import { redirect } from "next/navigation";
import { Playfair_Display } from 'next/font/google'
import { classNames } from "@/utils/utils";
import Core from "./components/core";

import { getServerSession } from "next-auth/next"

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
});

async function Home() {

  const session = await getServerSession();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <>
      <main className={classNames("relative bg-gray-100 text-black flex h-screen flex-col justify-between", playfair.className)}>
        <Core />
      </main>
    </>
  )
}


export default Home;