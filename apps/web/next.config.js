// this is used to load fontawesome properly
// const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

const HOST = process.env.NEXT_PUBLIC_API_HOST;
module.exports = withImages({
  env: {
    api: process.env.NEXT_PUBLIC_API_HOST,
    homePageUrl: process.env.NEXT_PUBLIC_HOME_PAGE_URL || '/',
    API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    SELF_HOST: process.env.NEXT_PUBLIC_SELF_HOST,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${HOST}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
    optimizePackageImports: ['@phosphor-icons/react'],
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
});
