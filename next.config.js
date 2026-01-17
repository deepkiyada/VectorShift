/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for client-side rendering
  experimental: {
    optimizePackageImports: ['reactflow'],
  },
}

module.exports = nextConfig
