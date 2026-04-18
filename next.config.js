/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080'

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
  async rewrites() {
    return [
      { source: '/health',             destination: `${BACKEND}/health` },
      { source: '/v1/:path*',          destination: `${BACKEND}/v1/:path*` },
    ]
  },
}

module.exports = nextConfig
