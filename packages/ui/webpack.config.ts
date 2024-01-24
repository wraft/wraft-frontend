/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack(config:any) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });
  
      return config;
    },
  };