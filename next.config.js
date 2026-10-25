/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduces dev-only overlay noise that can surface as "[object Event]" on chunk failures
  devIndicators: false,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ]
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  async redirects() {
    // The old single-price page now lives on Compare plans.
    return [
      { source: "/pricing", destination: "/plans", permanent: true },
      { source: "/pay", destination: "/contact", permanent: true },
      { source: "/document-preparation-agreement", destination: "/terms-of-service", permanent: true },
    ]
  },
}

module.exports = nextConfig
