/**
 * Supabase Storage hosts article and project images.
 *
 * Deliberately a wildcard rather than the exact project hostname: this file is
 * evaluated BEFORE Next loads .env.local, so `process.env.NEXT_PUBLIC_SUPABASE_URL`
 * is undefined here and deriving the host from it silently produced an empty
 * allow-list — every uploaded image then failed with "hostname is not
 * configured". The pathname stays pinned to the public storage prefix.
 */
const supabaseImagePattern = {
  protocol: 'https',
  hostname: '*.supabase.co',
  pathname: '/storage/v1/object/public/**',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [supabaseImagePattern],
  },
  experimental: {
    // Keeps the client bundle lean by tree-shaking barrel imports.
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
