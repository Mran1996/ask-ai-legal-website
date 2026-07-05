/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduces dev-only overlay noise that can surface as "[object Event]" on chunk failures
  devIndicators: false,
  reactStrictMode: true,
}

module.exports = nextConfig
