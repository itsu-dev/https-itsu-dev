/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria');
const nextConfig = {
  images: {
    unoptimized: true,
  },
};
module.exports = withLinaria(nextConfig);
