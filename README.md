# Pink Papaya Web Platform (Next.js App Router)

Production-ready web application built with Next.js App Router, optimized for Vercel deployment, MongoDB persistence, and Amazon S3 media storage.

## Stack

- Framework: Next.js 15 (App Router, Server Components)
- Runtime: Node.js (Route Handlers + Server Utilities).
- Database: MongoDB with Mongoose connection pooling
- Storage: Amazon S3 for media uploads
- CDN: Vercel Edge + optional CloudFront/Cloudflare via CDN base URL
- Auth: Signed HTTP-only cookie session (HMAC SHA-256)

## What Was Implemented

- Migrated backend data storage from local JSON files to MongoDB-backed repositories
- Added shared cache-aware data layer with revalidation tags for fast repeated reads.
- Switched upload API from local filesystem to Amazon S3.
- Added centralized server environment validation.
- Added image optimization and remote image support for S3/CDN domains.
- Added production-focused Next.js config for compression, bundle import optimization, and immutable static caching headers.
- Added health endpoint at `/api/health` for runtime checks.

## Project Structure

```text
pink-papaya-website/
	src/
		app/
			(main)/
				...web pages (mobile-first responsive pages)
			admin/
				...admin pages
			api/
				blog/
				interior/
				interior-feedback/
				locations/
				stays/
				upload/
				login/
				logout/
				health/
		components/
			...UI and page components
		data/
			...seed data used for first MongoDB bootstrap
		lib/
			auth.ts
			authStore.ts
			env.ts
			mongodb.ts
			contentStore.ts
			s3.ts
			blogStore.ts
			interiorStore.ts
			interiorFeedbackStore.ts
			locationsStore.ts
			staysStore.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

Required:

- `AUTH_SECRET` (minimum 24 chars)
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`

Optional:

- `AWS_S3_PUBLIC_BASE_URL` (CloudFront/custom domain)
- `NEXT_PUBLIC_CDN_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` (seeds the first admin user if the admins collection is empty)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API Notes

- Existing APIs are preserved; internals now persist to MongoDB.
- First read auto-seeds MongoDB collections from files in `src/data/` if collections are empty.
- Upload endpoint returns S3 URL and object key:

```json
{
	"url": "https://cdn.example.com/uploads/....jpg",
	"key": "uploads/...jpg"
}
```

## Performance Strategy

- Mobile-first UI with App Router streaming and Server Components by default.
- API GET routes export revalidate windows for ISR-friendly behavior.
- Repository layer uses cache tags + `revalidateTag` after writes.
- Next.js image optimization enabled with AVIF/WebP and S3/CDN remote patterns.
- Static assets served with long-lived immutable caching.
- Bundle optimizations enabled for heavy icon packages.

## Vercel Deployment

1. Push repository to Git provider.
2. Import project in Vercel.
3. In Vercel Project Settings -> Environment Variables, add all variables from `.env.example`.
4. Set Production Node version compatible with Next.js 15 (Node 18+).
5. Deploy.

Recommended for India-focused latency:

- Keep MongoDB region near India users (Mumbai/ap-south-1 where possible).
- Keep S3 bucket in `ap-south-1`.
- Use CloudFront/Cloudflare with India PoPs and set `AWS_S3_PUBLIC_BASE_URL`.
- Optionally configure Vercel function regions closest to users.

## Build & Validation

```bash
npm run lint
npm run build
```

## Security Checklist

- Do not commit `.env*` files.
- Use IAM user/policy with minimum S3 permissions for upload bucket only.
- Rotate AWS and auth secrets periodically.
- Use HTTPS only in production.
