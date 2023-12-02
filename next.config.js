/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria');
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
module.exports = withLinaria(nextConfig);
