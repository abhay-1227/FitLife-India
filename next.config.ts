const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Remove allowedDevOrigins — it's only for dev
  // Remove ignoreBuildErrors — fix TS errors instead
  typescript: {
    ignoreBuildErrors: false, // ← Change to false for production!
  },
  images: {
    domains: [], // Add any external image domains you use
  },
};

export default nextConfig;