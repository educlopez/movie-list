/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['jsx', 'js'],
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
}

module.exports = nextConfig
