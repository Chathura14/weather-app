import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['openweathermap.org'], 
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  output: 'export',  
};

export default nextConfig;
