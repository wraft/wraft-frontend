// this is used to load fontawesome properly
// const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
module.exports = withImages(
  {
  env: {
    api: process.env.NEXT_PUBLIC_API_HOST,
    API_HOST: process.env.API_HOST,
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4000/uploads/:path*' // Proxy to Backend
      },
    ] 
  }
}
);


