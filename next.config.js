/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/gen/:path*",
        destination: "https://font-gen-1.vercel.app/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
