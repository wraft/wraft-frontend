const HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

const apiHost =
  HOST.startsWith('http://') || HOST.startsWith('https://')
    ? HOST
    : `http://${HOST}`;

module.exports = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiHost}/uploads/:path*`, // Proxy to Backend
      },
      {
        source: '/asset/image/:path*/:filename',
        destination: `${apiHost}/asset/image/:path*/:filename`,
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
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts',
    },
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  transpilePackages: ['prosemirror-view', 'prosemirror-state'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
