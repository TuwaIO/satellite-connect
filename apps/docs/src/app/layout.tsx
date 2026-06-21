import '@/styles/app.css';

import { Footer, Navbar, RemoteLogo } from '@tuwaio/docs-ui';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';

import { navLinks } from '@/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const navbarLogo = <RemoteLogo width={105} height={45} className="tuwadocs:transition-opacity tuwadocs:duration-300" />;
const footerLogo = <RemoteLogo width={100} height={42} className="tuwadocs:transition-opacity tuwadocs:duration-300" />;

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Satellite Connect Docs" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Layout
          navbar={<Navbar key="navbar" links={navLinks} logo={navbarLogo} />}
          footer={<Footer key="footer" logo={footerLogo} />}
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
