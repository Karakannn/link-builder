/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  // Custom headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // Special headers for custom domains
      {
        source: "/site/:domain*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },

  // Rewrites for custom domain handling (backup for middleware)
  async rewrites() {
    return {
      beforeFiles: [
        // Handle custom domains that might bypass middleware
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "(?!.*(?:localhost|127\\.0\\.0\\.1|.*\\.vercel\\.app|.*\\.vercel\\.com|link-builder-phi\\.vercel\\.app)$).*",
            },
          ],
          destination: "/site/:host",
        },
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "(?!.*(?:localhost|127\\.0\\.0\\.1|.*\\.vercel\\.app|.*\\.vercel\\.com|link-builder-phi\\.vercel\\.app)$).*",
            },
          ],
          destination: "/site/:host/:path*",
        },
      ],
    };
  },

  // Redirects for better SEO
  async redirects() {
    return [
      // Redirect www to non-www for main app domain
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.link-builder-phi.vercel.app",
          },
        ],
        destination: "https://link-builder-phi.vercel.app/:path*",
        permanent: true,
      },
    ];
  },

  // Webpack configuration for better bundle optimization
  webpack: (config: any) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Create a separate chunk for editor components
          editor: {
            name: "editor",
            test: /[\\/](_components[\\/]editor|providers[\\/]editor)/,
            chunks: "all",
            priority: 10,
          },
          // Create a separate chunk for UI components
          ui: {
            name: "ui",
            test: /[\\/]components[\\/]ui/,
            chunks: "all",
            priority: 5,
          },
        },
      },
    };

    return config;
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Typescript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if there are type errors
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Don't run ESLint during builds in production
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },

  // Output configuration for better deployment
  output: "standalone",

  // Power optimizations
  swcMinify: true,

  // Compress pages for better performance
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Power pack for better performance
  poweredByHeader: false,

  // Trailing slash handling
  trailingSlash: false,
};

module.exports = nextConfig;
