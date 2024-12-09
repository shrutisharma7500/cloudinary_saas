import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable CSS optimization (check compatibility with your Next.js version)
  experimental: {
    optimizeCss: true, // Set to false if it causes issues
  },

  // Base URL configuration (optional)
  basePath: "", // Remove this if not using a sub-path

  // Image configuration for better performance
  images: {
    domains: ["your-domain.com"], // Replace with actual domains for external images
    formats: ["image/avif", "image/webp"],
  },

  // Webpack customizations (optional)
  webpack(config) {
    // Example: Add any specific customizations for your setup
    return config;
  },

  // Any other custom configurations can go here
};

export default nextConfig;
