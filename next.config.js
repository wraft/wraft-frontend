// this is used to load fontawesome properly
// const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
module.exports = withImages({
  env: {
    api: 'https://dieture.x.aurut.com',
  },
});
