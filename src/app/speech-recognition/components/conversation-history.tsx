/* eslint-disable @next/next/no-img-element */

'use client';

import { classNames } from '@/utils/utils';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';


const sessions = [

  {
    date: 'Yesterday',
    threadId: 'dkjhih3ou8vdf89',
    current: false
  }

]


export default function ConversationHistory() {

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  console.log('[USER]', user);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
      <div className="flex h-16 shrink-0 items-center">
        <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=white" alt="Your Company" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {sessions.map((item) => (
                <li key={item.date}>
                  <a
                    href={item.date}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    {/* <item.icon
                      className={classNames(
                        item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    /> */}
                    {item.date}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            {/* <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
            >
              <img
                className="h-8 w-8 rounded-full bg-indigo-700"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a> */}


            {user ? (
              <div className="flex items-center">
                <img
                  src={user.picture as string}
                  alt={user.name as string}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{user.name}</span>
                <Link
                  href={('/api/auth/logout')}
                  className="ml-4 text-sm text-gray-300 hover:text-white"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <Link
                href={('/api/auth/login')}
                className="text-sm text-gray-300 hover:text-white"
              >
                Login
              </Link>
            )}

          </li>
        </ul>
      </nav>
    </div>
  )
}
