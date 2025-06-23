import './globals.css';
import type { Metadata } from 'next';
import { registerServiceWorker } from './sw-register';
import Navigation from '@/components/Navigation';

// Register service worker for PWA functionality
if (typeof window !== 'undefined') {
  registerServiceWorker();
}

export const metadata: Metadata = {
  title: 'Dalili Live - Your Real-Time Business Guide',
  description: 'Discover amazing local businesses and experiences with Dalili Live',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Default to English if no language is specified
  const lang = params.lang || 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <Navigation />
        <main className="lg:ml-64">{children}</main>
      </body>
    </html>
  );
} 