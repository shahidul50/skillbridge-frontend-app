import "./src/env"

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [{
      source: "/api/auth/:path*",
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`
    }]
  }
}

export default nextConfig
