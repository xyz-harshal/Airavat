import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ['vtk.js'],

  images: {
    unoptimized: true,  
  },
};

export default nextConfig;
