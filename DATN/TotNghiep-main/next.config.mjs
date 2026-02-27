/** @type {import('next').NextConfig} */

// 🔹 Đổi thành 3001 để gọi vào file test.js của bạn
process.env.NEXT_PUBLIC_API_HOST = 'http://localhost:3001';

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_HOST: 'http://localhost:3001',
  },
  experimental: {
    optimizePackageImports: ['swiper', 'iconsax-reactjs'],
  },
  turbopack: {}, 
  
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/**" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;