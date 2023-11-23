/* eslint-disable @next/next/no-img-element */
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Header() {

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
      </div>
    </header>
  );
};

