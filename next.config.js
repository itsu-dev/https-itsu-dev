/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria');
const nextConfig = {
  env: {
    HOST: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://itsu.dev/'
  }
};
module.exports = withLinaria(nextConfig);
