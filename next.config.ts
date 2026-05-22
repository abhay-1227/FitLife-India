import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "preview-chat-b6a40151-0f58-4a96-a5ae-fbd710dd0569.space-z.ai",
  ],
};

export default nextConfig;
