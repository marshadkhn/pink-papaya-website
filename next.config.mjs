/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	poweredByHeader: false,
	assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CDN_BASE_URL : undefined,
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons"],
	},
	images: {
		formats: ["image/avif", "image/webp"],
		qualities: [25, 50, 75, 85, 90, 100],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "*.cloudfront.net",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "*.cloudflare.net",
			},
		],
		minimumCacheTTL: 60 * 60 * 24,
		deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
	},
	async rewrites() {
		// Dev-only fallback; Nginx serves /media/ directly from MEDIA_DIR in production.
		return [
			{
				source: "/media/:path*",
				destination: "/api/media/:path*",
			},
		];
	},
	async headers() {
		return [
			{
				source: "/uploads/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/logo-files/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/font-files/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				// Dev-only fallback; Nginx serves /media/ directly in production.
				source: "/media/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default nextConfig;
