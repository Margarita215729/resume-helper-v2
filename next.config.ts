import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'
const isStatic = process.env.NEXT_BUILD_MODE === 'static'
const repoName = 'Resume-Helper'

const nextConfig: NextConfig = {
  // Static export mode for GitHub Pages
  ...(isStatic && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
    basePath: isProd ? `/${repoName}` : '',
    assetPrefix: isProd ? `/${repoName}/` : '',
    images: {
      unoptimized: true,
    },
  }),

  // Server mode for Azure (default)
  ...(!isStatic && {
    output: 'standalone',
  }),

  // Common settings
  eslint: {
    ignoreDuringBuilds: true, // Temporary for deployment
  },
  typescript: {
    ignoreBuildErrors: true, // Temporary for deployment
  },
}

export default nextConfig;
