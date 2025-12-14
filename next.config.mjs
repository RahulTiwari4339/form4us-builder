/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'api.qrserver.com'], // 👈 Add this line
  },
  reactStrictMode: true,
};

export default nextConfig;
