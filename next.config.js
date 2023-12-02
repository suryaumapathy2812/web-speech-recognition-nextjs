/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/server-login',
        destination: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT : 'http://localhost:3000/auth/google',
        permanent: false,
      },
      {
        source: '/server-logout',
        destination: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT : 'http://localhost:3000/logout',
        permanent: false,
      },
    ]
  },
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  experimental: {
    forceSwcTransforms: true,
  },

}

module.exports = nextConfig
