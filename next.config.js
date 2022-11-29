/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ['minotar.net', 'mc-heads.net']
    }
}

module.exports = nextConfig
