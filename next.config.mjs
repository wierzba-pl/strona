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
  },
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "/blog/index.html"
      },
      {
        source: "/kontakt",
        destination: "/kontakt/index.html"
      },
      {
        source: "/produkty",
        destination: "/produkty/index.html"
      },
      {
        source: "/qa",
        destination: "/qa/index.html"
      },
      {
        source: "/regulamin",
        destination: "/regulamin/index.html"
      },
      {
        source: "/free-ukraine",
        destination: "/free-ukraine/index.html"
      }
    ];
  }
};

export default nextConfig;
