'use client';

import { classNames } from '@/utils/utils';
import { useToggle } from 'usehooks-ts'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

const Sidebar = () => {

  const [sidebarStatus, toggleSidebarStatus, setSidebarStatus] = useToggle(false);

  return (
    <>
      {
        sidebarStatus &&
        <div className={classNames(inter.className, 'absolute h-screen bg-gray-600 z-10 p-4', sidebarStatus ? 'w-screen md:w-2/6 lg:w-1/6 min-h-screen  ' : 'hidden')}>
          <div className='flex flex-row justify-between'>
            <h1 className='text-center text-xl  text-white'> say_hi </h1>
            <button
              onClick={toggleSidebarStatus}
              type="button"
              className="flex items-center rounded-md px-2.5 py-1.5 text-sm text-white font-normal hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Close
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 lucide lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /><path d="m10 15-3-3 3-3" /></svg>
            </button>
          </div>
        </div>
      }

      {
        !sidebarStatus &&
        <div className='absolute z-10 p-4'>
          <button
            onClick={toggleSidebarStatus}
            type="button"
            className="flex items-center rounded-md px-2.5 py-1.5 text-sm text-black font-bold hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 lucide lucide-panel-right-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="15" x2="15" y1="3" y2="21" /><path d="m8 9 3 3-3 3" /></svg>
          </button>
        </div>
      }
    </>
  )

}

export default Sidebar;