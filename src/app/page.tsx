import Link from 'next/link'
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from "next/navigation"

export default async function Home() {

  const session = await getSession();
  console.log('[session]', session);

  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <main className="bg-gray-100 text-black flex h-screen flex-row justify-evenly p-24">
      <Link href={"/speech-recognition"}>  Speech Recognition  </Link>
      <Link href={"/audio-recording"}>  Audio-recording  </Link>
    </main>
  )
}
