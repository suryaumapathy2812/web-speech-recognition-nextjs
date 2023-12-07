import { redirect } from "next/navigation";
import { classNames } from "@/utils/utils";
import Core from "./components/core";
import { getServerSession } from "next-auth/next"

async function Home() {

  const session = await getServerSession();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <>
      <main className={classNames("relative bg-gray-100 text-black flex h-screen flex-col justify-between font-playfair")}>
        <Core />
      </main>
    </>
  )
}


export default Home;