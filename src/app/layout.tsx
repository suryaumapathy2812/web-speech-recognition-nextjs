import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '@/components/sidebar';

import { classNames } from '@/utils/utils';
import ConversationsDrawer from '@/components/conversations-drawer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WSR',
  description: 'Generated by create next app',
  manifest: '/manifest.json',
  icons: { apple: '/chat.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={classNames(inter.className, 'relative')}>
          {/* <Sidebar /> */}
          <ConversationsDrawer />
          {children}
        </body>
      </UserProvider>
    </html>
  )
}
