/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    PRODUCTION: process.env.PRODUCTION,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/auth/login',
  //       permanent: true, // o false, dependiendo de si la redirección debe ser permanente o temporal
  //     },
  //   ];
  // },
}

module.exports = nextConfig
