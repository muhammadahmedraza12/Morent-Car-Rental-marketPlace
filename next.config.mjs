/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['car-rental-website-five.vercel.app', 'example.com', 'img.clerk.com'],
  },
  eslint: {
    // Disable ESLint during production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
