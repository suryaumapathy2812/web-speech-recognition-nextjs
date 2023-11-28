import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '@/components/sidebar';
import ConversationHistory from '@/components/conversation-history';
import { classNames } from '@/utils/utils';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WSR',
  description: 'Generated by create next app',
  manifest: '/manifest.json',
  icons: { apple: '/chat.png' },
  themeColor: '#ff0000'
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
          <ConversationHistory />
          {children}
        </body>
      </UserProvider>
    </html>
  )
}
