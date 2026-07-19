/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	poweredByHeader: false,
	assetPrefix: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CDN_BASE_URL : undefined,
	experimental: {
		optimizePackageImports: ["lucide-react", "react-icons"],
	},
	images: {
		// In dev, the optimizer lazily compiles and fetches each source image by
		// calling back into the dev server; a full page of images (plus media
		// proxied from the VPS) makes first loads flaky. Serve images directly in
		// dev; production keeps full optimization.
		unoptimized: process.env.NODE_ENV !== "production",
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
		// In dev, uploaded media lives on the VPS disk, not locally. If a proxy
		// origin is configured, pull /media/* straight from the server so CMS
		// images (hero, etc.) render locally. Otherwise fall back to the local
		// /api/media handler. Nginx serves /media/ directly in production.
		const mediaProxy = process.env.MEDIA_PROXY_ORIGIN;
		const useProxy = process.env.NODE_ENV !== "production" && mediaProxy;
		return [
			{
				source: "/media/:path*",
				destination: useProxy
					? `${mediaProxy}/media/:path*`
					: "/api/media/:path*",
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
