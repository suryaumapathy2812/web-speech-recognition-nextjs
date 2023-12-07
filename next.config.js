const withPWA = require('next-pwa');

const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  experimental: {
    serverlessFunctionTimeout: 120 // Set your desired timeout in seconds
  },
}

module.exports = nextConfig
