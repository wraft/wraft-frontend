// this is used to load fontawesome properly
// const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

const HOST = process.env.NEXT_PUBLIC_API_HOST;
module.exports = withImages({
  env: {
    api: process.env.NEXT_PUBLIC_API_HOST,
    API_HOST: process.env.API_HOST,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${HOST}/uploads/:path*`, // Proxy to Backend
      },
    ];
  },
  experimental: {
    outputStandalone: true,
  },
});
