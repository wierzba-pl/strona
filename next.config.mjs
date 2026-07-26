/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.cloudflarestream.com" },
      { protocol: "https", hostname: "**.imagedelivery.net" }
    ]
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  }
};

export default nextConfig;
