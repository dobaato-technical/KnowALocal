import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake large icon/animation libraries at build time
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    // Image optimization enabled (removed unoptimized: true)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 24 hours
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Compress responses
  compress: true,
};

export default nextConfig;
