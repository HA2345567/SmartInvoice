/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
