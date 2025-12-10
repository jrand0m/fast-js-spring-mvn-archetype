/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for embedding in Spring Boot JAR
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Base path for production (served from Spring Boot)
  basePath: process.env.NODE_ENV === 'production' ? '' : '',

  // Trailing slash for better compatibility
  trailingSlash: true,

  // TypeScript and ESLint checks during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
