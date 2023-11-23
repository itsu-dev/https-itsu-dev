/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria');
const nextConfig = {
  output: 'export'
};
module.exports = withLinaria(nextConfig);
