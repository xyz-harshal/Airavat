import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ['vtk.js'],

  images: {
    unoptimized: true,  
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb' // Increase the body size limit to 10MB
    },
  },
};

export default nextConfig;
