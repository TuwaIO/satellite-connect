import '@/styles/app.css';

import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import { Footer, Navbar, baseNavLinks } from '@tuwaio/docs-ui';
import NextTopLoader from 'nextjs-toploader';

// --- Metadata Configuration ---
export const metadata = {
  title: {
    default: 'Satellite Connect Documentation',
    template: '%s – Satellite Connect',
  },
  description:
    'Official documentation for the Satellite Connect, the headless state management system for connect Web3 wallet.',

  keywords: [
    'Satellite Connect',
    'headless',
    'state management',
    'transaction tracking',
    'wallet connect',
    'web3 wallets connect',
    'solana web3 wallet connect',
    'like rainbowkit',
    'like reown',
    'like connectkit',
    'self custody',
    'web3',
    'zustand',
    'wagmi',
    'viem',
    'typescript',
    'solana',
    'gill',
    'solanakit',
  ],
  authors: [{ name: 'TUWA', url: 'https://github.com/TuwaIO' }],

  openGraph: {
    title: 'Satellite Connect Documentation',
    description: 'The official documentation for the headless state management system for connect Web3 wallet.',
    url: 'https://satellite.docs.tuwa.io/',
    siteName: 'Pulsar Engine Docs',
    images: [
      {
        url: 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Satellite Connect Documentation',
    description: 'The official documentation for the headless state management system for connect Web3 wallet.',
    images: ['https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png'],
  },
};

export const navLinks = [
  {
    title: 'Storybook',
    href: 'https://stories.tuwa.io/?path=/docs/introduction--docs',
    className: 'hover:text-indigo-600 dark:hover:text-indigo-400',
    image: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.71 16.71a1 1 0 0 0-.33-.21a7 7 0 0 0-9.09-8.93a1 1 0 0 0-.66.84a1 1 0 0 0 .5 1.05a5 5 0 0 1 2.83 4.84a1 1 0 0 0 .43.86a1 1 0 0 0 .93.11a3 3 0 0 1 3.85 1.79a1 1 0 0 0 1.84-.37z" />
      </svg>
    ),
  },
  ...baseNavLinks,
  {
    title: 'GitHub',
    href: 'https://github.com/TuwaIO/satellite-connect',
    className: 'tuwa-footer-link--github',
    image: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Satellite Connect Docs" />
      </Head>
      <body>
        <Layout
          navbar={<Navbar key="navbar" links={navLinks} />}
          footer={<Footer key="footer" />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/satellite-connect/tree/main/apps/docs"
          navigation={{ prev: true, next: true }}
        >
          <NextTopLoader color="#6366f1" showSpinner={false} />
          {children}
        </Layout>
      </body>
    </html>
  );
}
