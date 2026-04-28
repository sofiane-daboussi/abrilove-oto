import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  webpack(config) {
    config.resolve.alias[require.resolve('next/dist/build/polyfills/polyfill-module.js')] = false
    return config
  },
}

export default nextConfig
