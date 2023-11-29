/* eslint-disable @next/next/no-img-element */
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { classNames } from '@/utils/utils';
import { useToggle } from 'usehooks-ts'
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link'
import { PanelRightClose } from 'lucide-react';


const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

const Sidebar = () => {

  const { user, error, isLoading } = useUser();

  const [sidebarStatus, toggleSidebarStatus, setSidebarStatus] = useToggle(false);

  return (
    <>
      {
        !sidebarStatus &&
        <div className='absolute z-10 p-4'>
          <button
            onClick={toggleSidebarStatus}
            type="button"
            className="flex items-center rounded-md px-2.5 py-1.5 text-sm text-black font-bold hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Menu
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 lucide lucide-panel-right-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /><path d="m8 9 3 3-3 3" /></svg>
          </button>
        </div>
      }

      {
        sidebarStatus &&
        <>
          <div className='absolute z-1 w-screen h-screen backdrop-blur-md' onClick={toggleSidebarStatus}>
          </div>
          <div className={classNames(inter.className, 'absolute left-0 h-screen overflow-y-auto bg-green-950 z-20 p-4 shadow-md', sidebarStatus ? 'w-screen md:w-2/6 lg:w-5/12 min-h-screen  ' : 'hidden')}>

            <div className='flex flex-row justify-between'>
              <h1 className={classNames(playfair.className, 'text-center text-2xl  text-white')}> say_hi </h1>
              <button
                onClick={toggleSidebarStatus}
                type="button"
                className="flex items-center rounded-md px-2.5 py-1.5 text-sm text-white font-normal hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Close
                <PanelRightClose className='ml-2' size={16} />
              </button>
            </div>

            <div className='mt-4'>

            </div>

          </div>
        </>
      }


    </>
  )

}

export default Sidebar;