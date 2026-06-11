import type { NextConfig } from "next";

const backendProxy =
  process.env.BACKEND_PROXY_URL || "http://13.232.109.22/shop-api";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendProxy}/api/:path*`
        }
      ]
    };
  }
};

export default nextConfig;
