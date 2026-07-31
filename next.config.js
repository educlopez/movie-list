/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        protocol: "https",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
