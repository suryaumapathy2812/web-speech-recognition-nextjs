import Core from './components/core';
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"
import { classNames } from "@/utils/utils";


async function Page() {

  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className={classNames("relative bg-gray-100 text-black flex h-screen max-h-full flex-col justify-between font-playfair")}>
      <Core />
    </main>
  )
}


export default Page;