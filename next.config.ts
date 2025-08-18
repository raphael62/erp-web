// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Don’t fail the Vercel/production build on ESLint issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
