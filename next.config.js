/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support
    locales: ['en', 'ar', 'fr'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en',
    // This is a list of locale domains and the default locale they
    // should handle (these are optional)
    domains: [
      {
        domain: 'dalili.live',
        defaultLocale: 'en',
      },
      {
        domain: 'ar.dalili.live',
        defaultLocale: 'ar',
      },
      {
        domain: 'fr.dalili.live',
        defaultLocale: 'fr',
      },
    ],
  },
  // Allow custom SVG imports
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig; 