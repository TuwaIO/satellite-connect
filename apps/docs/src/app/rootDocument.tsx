import '@/styles/app.css';

import { PreferenceExpiry, SiteLogo } from '@tuwaio/docs-ui';
import { localeOfPath } from '@tuwaio/docs-ui/locale';
import { DocsLayout } from '@tuwaio/docs-ui/nextra';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';

import { navLinks } from '@/constants';
import { localizedPages } from '@/i18n/pages';

// The size of the logo of tuwa.io: 110px on phones, 126px from 640px
const logo = <SiteLogo className="tuwadocs:transition-opacity tuwadocs:duration-300" />;

// --- Metadata Configuration ---
export const rootMetadata: Metadata = {
  metadataBase: new URL('https://satellite.docs.tuwa.io'),
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

export async function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      {/* The paper of each theme, as the body below: Nextra paints its sticky header and the foot of its sidebar with
          these colors */}
      <Head backgroundColor={{ light: '#f2f1ee', dark: '#101014' }}>
        <meta name="apple-mobile-web-app-title" content="Satellite Connect Docs" />
        {/* The theme and the language are kept 30 days after they are chosen (Cookie Policy) */}
        <PreferenceExpiry keys={['theme', 'tuwa-locale']} />
      </Head>
      <body
        className="antialiased bg-[var(--tuwa-docs-paper)] text-[var(--tuwa-text-primary)]"
        suppressHydrationWarning
      >
        {/* English, Ukrainian and Simplified Chinese: the language switch, the interface, the sidebar titles and the
            translated pages of src/i18n have their own URLs, /uk and /zh-CN */}
        <DocsLayout
          initialLocale={localeOfPath(`/${lang}`) ?? undefined}
          languageRoutes={Object.keys(localizedPages)}
          logo={logo}
          links={navLinks}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/satellite-connect/tree/main/apps/docs"
        >
          <NextTopLoader color="var(--tuwa-text-accent)" shadow={false} showSpinner={false} />
          {children}
        </DocsLayout>
      </body>
    </html>
  );
}
