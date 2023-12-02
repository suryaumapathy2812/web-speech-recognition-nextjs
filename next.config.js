/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/server-login',
        destination: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT}/auth/google` : 'http://localhost:8080/auth/google',
        permanent: false,
      },
      {
        source: '/server-logout',
        destination: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT}/logout` : 'http://localhost:8080/logout',
        permanent: false,
      },
      {
        source: '/server-callback',
        destination: process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT}/auth/google/callback` : 'http://localhost:8080/auth/google/callback',
        permanent: false,
      }
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
