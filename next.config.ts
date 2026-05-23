import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Fix workspace root warning for Turbopack
  // @ts-ignore - Next.js 16 might have changed the type or it is experimental
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
