**Logging & Debugging Guide**

- **Logger utility**: `src/lib/logger.ts` — lightweight structured logger with masking and environment-awareness.
- **Usage**:
  - Import `getLogger` and create a logger: `const logger = getLogger("API")`.
  - Use `logger.info/warn/error/debug(message, meta)`.
  - Use `logEnvironment(process.env)` to print a masked environment summary (development only).

- **Integrations added**:
  - `src/lib/mongodb.ts`: logs connection start/success/failure and mongoose query debug in development.
  - `src/lib/s3.ts`: logs S3 client initialization and uploads (bucket + key).
  - `src/app/api/log-example/route.ts`: example API route demonstrating request logging and error handling.

- **Masking rules**: keys containing `KEY`, `SECRET`, `PASSWORD`, `TOKEN`, `URI`, `AUTH`, or `ACCESS` are masked (first 4/last 4) in logs.

- **Environment awareness**:
  - Detailed, readable logs in development (`NODE_ENV !== production`).
  - Compact JSON logs in production to make it easy to ship to log aggregation.

- **How to use**:
  - Start dev server: `npm run dev` and hit `/api/log-example`.
  - Check terminal for prefixed logs: `[ENV]`, `[DB]`, `[AWS]`, `[API]`, `[ERROR]`.

- **Best practices**:
  - Do not print full secrets in production. Use `logEnvironment` only in development or controlled diagnostics.
  - Forward JSON logs to your log collector in production (e.g., CloudWatch, Datadog).
