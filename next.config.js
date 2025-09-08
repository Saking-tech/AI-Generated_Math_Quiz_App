/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: 'https://academic-bass-666.convex.cloud',
  },
}

module.exports = nextConfig
