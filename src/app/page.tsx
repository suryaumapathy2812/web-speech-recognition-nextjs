import Link from 'next/link'
import { classNames } from '@/utils/utils';
import { Playfair_Display } from 'next/font/google'
import { Mic, Keyboard } from 'lucide-react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const playfair = Playfair_Display({ subsets: ['latin'] })

const ConversationTypes = [
  {
    title: 'Text',
    path: 'speech-recognition',
    icon: Keyboard
  },
  {
    title: 'Audio',
    path: 'audio-recording',
    icon: Mic
  },
]

async function Home() {

  return (
    <>
      <main className="bg-gray-100 text-black flex flex-col md:flex-row h-screen justify-evenly">

        {
          ConversationTypes.map((_c, i) => (
            <Link
              key={i}
              href={"/" + _c.path}
              className='flex-1 w-full flex justify-center items-center hover:bg-green-950 hover:text-white'
            >
              <div className={classNames(playfair.className, 'rounded-md border-gray-500 p-4  flex flex-col justify-center items-center')}>

                <_c.icon className='w-6 h-6 mb-2' />

                <h1 className='text-2xl'>
                  {_c.title}
                </h1>
              </div>
            </Link>
          ))
        }

      </main >
    </>
  )
}

export default withPageAuthRequired(Home)