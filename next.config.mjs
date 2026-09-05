/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Keeps the client bundle lean by tree-shaking barrel imports.
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
