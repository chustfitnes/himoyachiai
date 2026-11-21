/**
 * Security & Zero-Log Headers Middleware
 * Enforces no-referrer, strict cache prevention, no sniffing, and Telegram iframe compatibility.
 */
export function securityHeadersMiddleware(req, res, next) {
  // Never log request bodies or private user input
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: 'unsafe-inline'; frame-ancestors 'self' https://web.telegram.org https://*.telegram.org https://telegram.org;"
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}
