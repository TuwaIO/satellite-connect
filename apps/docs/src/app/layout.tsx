import '@/styles/app.css';

import { Footer, Navbar, PreferenceExpiry, SiteLogo } from '@tuwaio/docs-ui';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';

import { navLinks } from '@/constants';

const logo = <SiteLogo width={126} height={40} className="tuwadocs:transition-opacity tuwadocs:duration-300" />;

// --- Metadata Configuration ---
export const metadata: Metadata = {
  title: {
    default: 'Satellite Connect Documentation',
    template: '%s – Satellite Connect',
  },
  description:
    'Documentation for Satellite Connect, the Stage 2 wallet connection layer of the TUWA ecosystem: a headless, framework-agnostic store for EVM and Solana wallet connections.',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://tuwa.io/brand/icon0.svg',
    shortcut: 'https://tuwa.io/brand/web-app-manifest-512x512.png',
    apple: 'https://tuwa.io/brand/web-app-manifest-512x512.png',
  },
  keywords: [
    'satellite connect',
    'tuwa',
    'wallet connection',
    'web3 wallet connect',
    'multi-chain',
    'headless',
    'framework-agnostic',
    'self-custody',
    'evm',
    'wagmi',
    'viem',
    'solana',
    '@solana/kit',
    'wallet standard',
    'siwx',
    'zustand',
    'react',
    'typescript',
  ],
  authors: [{ name: 'TUWA', url: 'https://github.com/TuwaIO' }],

  openGraph: {
    title: 'Satellite Connect Documentation',
    description:
      'Documentation for Satellite Connect, the Stage 2 wallet connection layer of the TUWA ecosystem: a headless, framework-agnostic store for EVM and Solana wallet connections.',
    url: 'https://satellite.docs.tuwa.io/',
    siteName: 'Satellite Connect Docs',
    images: [
      {
        url: 'https://tuwa.io/brand/preview-logo.png',
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
    description:
      'Documentation for Satellite Connect, the Stage 2 wallet connection layer of the TUWA ecosystem: a headless, framework-agnostic store for EVM and Solana wallet connections.',
    images: ['https://tuwa.io/brand/preview-logo.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head backgroundColor={{ light: '#ffffff', dark: '#0a0e27' }}>
        <meta name="apple-mobile-web-app-title" content="Satellite Connect Docs" />
        <PreferenceExpiry />
      </Head>
      <body
        className="antialiased bg-[var(--tuwa-bg-primary)] dark:bg-[#0a0e27] text-[var(--tuwa-text-primary)]"
        suppressHydrationWarning
      >
        <Layout
          navbar={<Navbar key="navbar" links={navLinks} logo={logo} />}
          footer={<Footer key="footer" logo={logo} />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/satellite-connect/tree/main/apps/docs"
          navigation={{ prev: true, next: true }}
        >
          <NextTopLoader color="#0052ff" shadow="0 0 10px #0052ff,0 0 5px #0052ff" showSpinner={false} />
          {children}
        </Layout>
      </body>
    </html>
  );
}
