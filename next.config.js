const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
