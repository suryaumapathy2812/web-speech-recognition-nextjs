/* eslint-disable @next/next/no-img-element */
'use client';

import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Header() {

  const { data: user, status } = useSession();

  if (status === 'unauthenticated') redirect('/api/auth/signin');;
  if (status === 'loading') return <div>Loading...</div>;

  console.log('[USER]', user);

  return (
    user &&
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <h1 className="text-lg font-bold">say_hi</h1>
      </div>
      <div>
        {user ? (
          <div className="flex items-center">
            {/* <img
              src={user.user?.image as string}
              alt={user.user?.name as string}
              className="w-8 h-8 rounded-full mr-2"
            /> */}
            <span>{user.user?.name}</span>
            <span>{user.user?.email}</span>
            <Link
              href={('/server-logout')}
              className="ml-4 text-sm text-gray-300 hover:text-white"
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link
            href={('/server-login')}
            className="text-sm text-gray-300 hover:text-white"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

