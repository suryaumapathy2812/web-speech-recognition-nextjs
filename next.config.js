const withPWA = require('next-pwa');

const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  experimental: {
  },
}

module.exports = nextConfig
