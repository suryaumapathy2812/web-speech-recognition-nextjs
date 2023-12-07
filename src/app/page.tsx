import { Mic, Keyboard } from 'lucide-react';
import CombinedCore from '@/components/core';

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

function Home() {

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/sw.js')
  //       .then((registration) => console.log('scope is: ', registration.scope));
  //   }
  // }, []);

  return (
    <>
      <main className="bg-gray-100 text-black flex flex-col md:flex-row h-screen justify-evenly">

        {/* {
          ConversationTypes.map((_c, i) => (
            <Link
              key={i}
              href={"/" + _c.path}
              className='flex-1 w-full flex justify-center items-center hover:bg-green-950 hover:text-white'
            >
              <div className={classNames('font-playfair rounded-md border-gray-500 p-4  flex flex-col justify-center items-center')}>

                <_c.icon className='w-6 h-6 mb-2' />

                <h1 className='text-2xl'>
                  {_c.title}
                </h1>
              </div>
            </Link>
          ))
        } */}

        <CombinedCore />

      </main>
    </>
  )
}

export default Home

export const maxDuration = 300; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';