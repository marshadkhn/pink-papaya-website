/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	poweredByHeader: false,
	assetPrefix: process.env.NEXT_PUBLIC_CDN_BASE_URL || undefined,
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons"],
	},
	images: {
		formats: ["image/avif", "image/webp"],
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
		],
		minimumCacheTTL: 60 * 60 * 24,
		deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
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
		];
	},
};

export default nextConfig;
